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
      // Get total document count for this user to compare against ALL documents
      const countResult = await db.query(
        'SELECT COUNT(*) FROM documents WHERE user_id = $1 AND status = $2',
        [userId, 'indexed']
      );
      const totalDocs = parseInt(countResult.rows[0].count);

      if (totalDocs === 0) {
        // Clean up uploaded file
        deleteFile(file.path);
        logger.info('No documents in database to compare to.');
        return {
          checkId: null,
          queryFilename: file.originalname,
          maxSimilarity: 0,
          riskLevel: 'N/A',
          similarDocuments: [],
          message: 'No documents in database to compare to.'
        };
      }

      // Set topK to total documents to get ALL comparisons
      const actualTopK = Math.max(totalDocs, topK);

      // Create similarity check record
      const checkResult = await db.query(
        `INSERT INTO similarity_checks (user_id, query_filename, similarity_threshold, status)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [userId, file.originalname, threshold, 'processing']
      );

      const checkId = checkResult.rows[0].id;

      // Send to AI service with actualTopK to get all documents
      const aiResult = await aiService.checkSimilarity(
        file.path,
        file.originalname,
        userId,
        threshold,
        actualTopK
      );

      // Calculate AVERAGE similarity across all documents instead of max
      const similarDocs = aiResult.similar_documents || [];
      let avgSimilarity = 0;

      if (similarDocs.length > 0) {
        const totalSimilarity = similarDocs.reduce((sum: number, doc: any) => {
          return sum + (doc.max_similarity || 0);
        }, 0);
        avgSimilarity = totalSimilarity / similarDocs.length;
      }

      const riskLevel = this.calculateRiskLevel(avgSimilarity);

      // Update similarity check with AVERAGE similarity
      await db.query(
        `UPDATE similarity_checks
         SET max_similarity_score = $1, status = $2, results = $3, completed_at = CURRENT_TIMESTAMP
         WHERE id = $4`,
        [avgSimilarity, 'completed', JSON.stringify(aiResult), checkId]
      );

      // Clean up uploaded file
      deleteFile(file.path);

      logger.info(`Similarity check completed: ${checkId}, average similarity: ${avgSimilarity}`);

      return {
        checkId,
        queryFilename: file.originalname,
        maxSimilarity: avgSimilarity, // This is actually average now
        riskLevel,
        similarDocuments: await this.formatSimilarDocuments(aiResult.similar_documents || [])
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

    return {
      checkId: check.id,
      queryFilename: check.query_filename,
      threshold: check.similarity_threshold,
      maxSimilarity: check.max_similarity_score,
      riskLevel: this.calculateRiskLevel(check.max_similarity_score),
      status: check.status,
      results: check.results,
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
      `SELECT id, query_filename, similarity_threshold, max_similarity_score, status, created_at, completed_at
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
        riskLevel: this.calculateRiskLevel(check.max_similarity_score),
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
          'SELECT id, original_filename FROM documents WHERE id = $1',
          [doc.document_id]
        );

        if (result.rows.length > 0) {
          const dbDoc = result.rows[0];
          formatted.push({
            documentId: dbDoc.id,
            filename: dbDoc.original_filename,
            max_similarity: doc.max_similarity,
            matched_chunks: doc.matched_chunks || 0,
            matches: doc.matches || []
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
}

export const similarityService = new SimilarityService();
