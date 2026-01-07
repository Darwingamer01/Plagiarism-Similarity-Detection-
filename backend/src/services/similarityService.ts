import { db } from '../config/database';
import { aiService } from './aiService';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import { deleteFile } from '../utils/fileUpload';

export class SimilarityService {
  async checkSimilarity(
    file: Express.Multer.File,
    userId: string,
    threshold: number = 0.88,
    topK: number = 5
  ) {
    try {
      // Get total document count globally to compare against ALL documents
      const countResult = await db.query(
        'SELECT COUNT(*) FROM documents WHERE status = $1',
        ['indexed']
      );
      const totalDocs = parseInt(countResult.rows[0].count);
      const topKValue = Math.max(totalDocs, topK);

      // Create similarity check record immediately
      const checkResult = await db.query(
        `INSERT INTO similarity_checks (user_id, query_filename, similarity_threshold, status)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [userId, file.originalname, threshold, 'processing']
      );
      const checkId = checkResult.rows[0].id;

      if (totalDocs === 0) {
        // Clean up uploaded file
        deleteFile(file.path);
        logger.info('No documents in database to compare to.');
        
        const emptyResult = {
          checkId,
          queryFilename: file.originalname,
          maxSimilarity: 0,
          riskLevel: 'LOW', // Default to low risk if no matches
          similarDocuments: [],
          message: 'No documents in database to compare to.',
          no_match_report: {
              reasoning: "The system database is currently empty. No documents were found to compare against.",
          }
        };

        // Update check record
        await db.query(
          `UPDATE similarity_checks
           SET max_similarity_score = 0, status = 'completed', results = $1, completed_at = CURRENT_TIMESTAMP
           WHERE id = $2`,
          [JSON.stringify(emptyResult), checkId]
        );

        return emptyResult;
      }

      // Send to AI service
      const aiResult = await aiService.checkSimilarity(
        file.path,
        file.originalname,
        userId,
        threshold,
        topKValue
      );

      // Enrich similar documents with metadata (filenames, summaries) BEFORE saving to DB
      // This ensures the report persists even if the source documents are later deleted
      if (aiResult.similar_documents) {
        aiResult.similar_documents = await this.formatSimilarDocuments(aiResult.similar_documents);
      }

      // Calculate AVERAGE similarity across all documents instead of max
      // Note: We use the already formatted documents now, which is fine as they retain max_similarity
      const similarDocs = aiResult.similar_documents || [];
      let avgSimilarity = 0;

      if (similarDocs.length > 0) {
        const totalSimilarity = similarDocs.reduce((sum: number, doc: any) => {
          return sum + (doc.max_similarity || 0);
        }, 0);
        avgSimilarity = totalSimilarity / similarDocs.length;
      }

      const riskLevel = this.calculateRiskLevel(aiResult.overall_score || avgSimilarity);

      // Update similarity check with MAX similarity (not average)
      await db.query(
        `UPDATE similarity_checks
         SET max_similarity_score = $1, status = $2, results = $3, completed_at = CURRENT_TIMESTAMP
         WHERE id = $4`,
        [aiResult.max_similarity || 0, 'completed', JSON.stringify(aiResult), checkId]
      );

      // Clean up uploaded file
      deleteFile(file.path);

      logger.info(`Similarity check completed: ${checkId}, average similarity: ${avgSimilarity}`);

      return {
        checkId,
        queryFilename: file.originalname,
        maxSimilarity: avgSimilarity, // This is actually average now
        aggregate_score: aiResult.aggregate_score,
        overall_score: aiResult.overall_score,
        riskLevel,
        similarDocuments: aiResult.similar_documents // Already formatted
      };
    } catch (error: any) {
      logger.error('Similarity check error:', error);
      deleteFile(file.path);
      throw error;
    }
  }

  async getSimilarityResult(checkId: string, userId: string) {
    const result = await db.query(
      `SELECT * FROM similarity_checks WHERE id = $1 AND user_id = $2`,
      [checkId, userId]
    );

    if (result.rows.length === 0) {
      throw new AppError('Similarity check not found', 404);
    }

    const check = result.rows[0];

    // Parse results if it's a string (though pg usually handles json types automatically)
    let results = check.results;
    if (typeof results === 'string') {
      try {
        results = JSON.parse(results);
      } catch (e) {
        logger.error('Failed to parse results JSON', e);
      }
    }

    // Enrich similar documents with metadata (filenames, IDs) if they exist
    // Only if they haven't been enriched yet (backward compatibility for old records)
    if (results && results.similar_documents && Array.isArray(results.similar_documents)) {
      const needsEnrichment = results.similar_documents.length > 0 && !results.similar_documents[0].filename;

      if (needsEnrichment) {
        try {
          results.similar_documents = await this.formatSimilarDocuments(results.similar_documents);
        } catch (error) {
          logger.error('Error enriching similar documents in getSimilarityResult:', error);
          // Fallback to original results if formatting fails
        }
      }
    }

    return {
      checkId: check.id,
      queryFilename: check.query_filename,
      threshold: check.similarity_threshold,
      maxSimilarity: check.max_similarity_score,
      aggregate_score: results?.aggregate_score,
      overall_score: results?.overall_score,
      riskLevel: this.calculateRiskLevel(results?.overall_score || check.max_similarity_score),
      status: check.status,
      results: results,
      createdAt: check.created_at,
      completedAt: check.completed_at
    };
  }

  async getSimilarityHistory(userId: string, page: number = 1, limit: number = 20) {
    const offset = (page - 1) * limit;

    // Get total count
    const countResult = await db.query(
      'SELECT COUNT(*) FROM similarity_checks WHERE user_id = $1',
      [userId]
    );
    const total = parseInt(countResult.rows[0].count);

    // Get history
    const result = await db.query(
      `SELECT id, query_filename, similarity_threshold, max_similarity_score, status, created_at, completed_at, 
              COALESCE((results->>'aggregate_score')::float, 0) as aggregate_score,
              COALESCE((results->>'overall_score')::float, 0) as overall_score
       FROM similarity_checks
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    return {
      checks: result.rows.map(check => ({
        id: check.id,
        queryFilename: check.query_filename,
        threshold: check.similarity_threshold,
        maxSimilarity: check.max_similarity_score,
        aggregateScore: check.aggregate_score,
        overallScore: check.overall_score,
        riskLevel: this.calculateRiskLevel(check.overall_score > 0 ? check.overall_score : check.max_similarity_score),
        status: check.status,
        createdAt: check.created_at,
        completedAt: check.completed_at
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  private calculateRiskLevel(similarity: number): string {
    const percentage = similarity * 100;

    if (percentage >= 80) return 'VERY HIGH';
    if (percentage >= 60) return 'HIGH';
    if (percentage >= 40) return 'MEDIUM';
    if (percentage >= 20) return 'LOW';
    return 'VERY LOW';
  }

  private async formatSimilarDocuments(documents: any[]): Promise<any[]> {
    const formatted = [];

    for (const doc of documents) {
      try {
        // Validate that document_id looks like a UUID
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

        if (!uuidRegex.test(doc.document_id)) {
          logger.warn(`Skipping document with invalid UUID: ${doc.document_id}`);
          continue;
        }

        // Get document details from database
        const result = await db.query(
          'SELECT id, original_filename, summary FROM documents WHERE id = $1',
          [doc.document_id]
        );

        if (result.rows.length > 0) {
          const dbDoc = result.rows[0];
          formatted.push({
            documentId: dbDoc.id,
            filename: dbDoc.original_filename,
            summary: dbDoc.summary, // Include summary
            max_similarity: doc.max_similarity,
            overall_score: doc.overall_score || 0,
            matched_chunks: doc.matched_chunks || 0,
            matches: doc.matches || [],
            report: doc.report
          });
        } else {
          logger.warn(`Document not found in database: ${doc.document_id}`);
        }
      } catch (error: any) {
        logger.error(`Error formatting document ${doc.document_id}:`, error.message);
        // Continue with next document instead of failing the entire request
      }
    }

    return formatted;
  }

  async deleteCheck(checkId: string, userId: string) {
    // Verify the check belongs to the user
    const result = await db.query(
      'SELECT id FROM similarity_checks WHERE id = $1 AND user_id = $2',
      [checkId, userId]
    );

    if (result.rows.length === 0) {
      throw new AppError('Similarity check not found', 404);
    }

    // Delete the check (cascades to results)
    await db.query('DELETE FROM similarity_checks WHERE id = $1', [checkId]);

    logger.info(`Similarity check deleted: ${checkId} for user: ${userId}`);
  }

  async clearHistory(userId: string) {
    // Delete all similarity checks for the user (cascades to results)
    const result = await db.query(
      'DELETE FROM similarity_checks WHERE user_id = $1 RETURNING id',
      [userId]
    );

    const deletedCount = result.rowCount || 0;
    logger.info(`Similarity check history cleared for user: ${userId}, count: ${deletedCount}`);

    return { deletedCount };
  }
  async clearVectorIndex() {
    return await aiService.clearVectorIndex();
  }
}

export const similarityService = new SimilarityService();
