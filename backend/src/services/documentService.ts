import path from 'path';
import { db } from '../config/database';
import { aiService } from './aiService';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import { deleteFile } from '../utils/fileUpload';

export class DocumentService {
  async ingestDocuments(files: Express.Multer.File[], userId: string) {
    const results = [];

    for (const file of files) {
      try {
        // Insert document record
        const documentResult = await db.query(
          `INSERT INTO documents (user_id, filename, original_filename, file_type, file_size, file_path, status)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           RETURNING id, filename, original_filename`,
          [
            userId,
            file.filename,
            file.originalname,
            path.extname(file.originalname).toLowerCase(),
            file.size,
            file.path,
            'processing'
          ]
        );

        const document = documentResult.rows[0];

        // Send to AI service for processing
        const aiResult = await aiService.ingestDocument(
          file.path,
          file.originalname,
          userId,
          document.id
        );

        // Update document with chunks count, status, and AI analysis results
        await db.query(
          `UPDATE documents
           SET chunks_count = $1, status = $2, processed_at = CURRENT_TIMESTAMP,
               summary = $3, sentiment = $4, context = $5
           WHERE id = $6`,
          [
            aiResult.chunks_added || 0,
            'indexed',
            aiResult.summary || null,
            aiResult.sentiment || null,
            JSON.stringify(aiResult.context || []), // context is an array, store as JSON
            document.id
          ]
        );

        // Store chunks in database
        if (aiResult.chunks && aiResult.chunks.length > 0) {
          for (let i = 0; i < aiResult.chunks.length; i++) {
            const chunk = aiResult.chunks[i];
            await db.query(
              `INSERT INTO document_chunks (document_id, chunk_index, text_content, start_pos, end_pos, embedding_index)
               VALUES ($1, $2, $3, $4, $5, $6)`,
              [document.id, i, chunk.text, chunk.start, chunk.end, i]
            );
          }
        }

        results.push({
          documentId: document.id,
          filename: document.original_filename,
          chunksAdded: aiResult.chunks_added || 0,
          status: 'indexed'
        });

        logger.info(`Document processed successfully: ${document.original_filename}`);
      } catch (error: any) {
        logger.error(`Error processing document ${file.originalname}:`, error);

        // Update status to failed
        await db.query(
          `UPDATE documents SET status = $1 WHERE filename = $2`,
          ['failed', file.filename]
        );

        results.push({
          filename: file.originalname,
          status: 'failed',
          error: error.message
        });

        // Clean up file
        deleteFile(file.path);
      }
    }

    return results;
  }

  async getDocuments(userId: string, page: number = 1, limit: number = 20, sort: string = 'created_at', order: string = 'desc', scope: 'mine' | 'others' | 'all' = 'all') {
    const offset = (page - 1) * limit;
    
    // Validate sort column to prevent SQL injection
    const allowedSortColumns = ['created_at', 'filename', 'file_size', 'status'];
    const sortColumn = allowedSortColumns.includes(sort) ? sort : 'created_at';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    let countQuery = '';
    let countParams: any[] = [];
    let dataQuery = '';
    let dataParams: any[] = [];

    if (scope === 'mine') {
      // Simple filtered query for user's own documents
      countQuery = 'SELECT COUNT(*) FROM documents WHERE user_id = $1';
      countParams = [userId];

      dataQuery = `
        SELECT id, filename, original_filename, file_type, file_size, status, chunks_count, created_at, processed_at
        FROM documents
        WHERE user_id = $1
        ORDER BY ${sortColumn} ${sortOrder}
        LIMIT $2 OFFSET $3
      `;
      dataParams = [userId, limit, offset];

    } else if (scope === 'others') {
      // Query for documents NOT owned by user, deduplicated by filename
      countQuery = 'SELECT COUNT(DISTINCT original_filename) FROM documents WHERE user_id != $1';
      countParams = [userId];

      dataQuery = `
        WITH UniqueDocs AS (
          SELECT DISTINCT ON (original_filename) 
            id, original_filename, created_at
          FROM documents
          WHERE user_id != $1
          ORDER BY original_filename, created_at DESC
        )
        SELECT d.id, d.filename, d.original_filename, d.file_type, d.file_size, d.status, d.chunks_count, d.created_at, d.processed_at
        FROM documents d
        INNER JOIN UniqueDocs ud ON d.id = ud.id
        ORDER BY d.${sortColumn} ${sortOrder}
        LIMIT $2 OFFSET $3
      `;
      dataParams = [userId, limit, offset];

    } else {
      // 'all' - existing global logic (deduplicated across everyone)
      countQuery = 'SELECT COUNT(DISTINCT original_filename) FROM documents';
      countParams = [];

      dataQuery = `
        WITH UniqueDocs AS (
          SELECT DISTINCT ON (original_filename) 
            id, original_filename, created_at
          FROM documents
          ORDER BY original_filename, created_at DESC
        )
        SELECT d.id, d.filename, d.original_filename, d.file_type, d.file_size, d.status, d.chunks_count, d.created_at, d.processed_at
        FROM documents d
        INNER JOIN UniqueDocs ud ON d.id = ud.id
        ORDER BY d.${sortColumn} ${sortOrder}
        LIMIT $1 OFFSET $2
      `;
      dataParams = [limit, offset];
    }

    // Execute Count Query
    const countResult = await db.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    // Execute Data Query
    const result = await db.query(dataQuery, dataParams);

    return {
      documents: result.rows.map(doc => ({
        id: doc.id,
        filename: doc.original_filename,
        fileType: doc.file_type,
        fileSize: doc.file_size,
        chunksCount: doc.chunks_count,
        status: doc.status,
        createdAt: doc.created_at,
        processedAt: doc.processed_at,
        isOwner: scope === 'mine' // Helper flag for frontend to know if delete should be allowed (though scoped list implies it)
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getDocumentById(documentId: string, userId: string) {
    const result = await db.query(
      `SELECT d.*, 
              (SELECT json_agg(json_build_object(
                  'id', dc.id, 
                  'content', dc.text_content, 
                  'chunk_index', dc.chunk_index
               ) ORDER BY dc.chunk_index)
               FROM document_chunks dc
               WHERE dc.document_id = d.id) as chunks
       FROM documents d
       WHERE d.id = $1`,
      [documentId]
    );

    if (result.rows.length === 0) {
      throw new AppError('Document not found', 404);
    }

    const doc = result.rows[0];

    return {
      id: doc.id,
      filename: doc.original_filename,
      fileType: doc.file_type,
      fileSize: doc.file_size,
      status: doc.status,
      chunksCount: doc.chunks_count,
      chunks: doc.chunks || [],
      summary: doc.summary,
      sentiment: doc.sentiment,
      context: doc.context,
      createdAt: doc.created_at,
      processedAt: doc.processed_at,
      isOwner: doc.user_id === userId // Add ownership flag
    };
  }

  async deleteDocument(documentId: string, userId: string) {
    const result = await db.query(
      'SELECT file_path FROM documents WHERE id = $1 AND user_id = $2',
      [documentId, userId]
    );

    if (result.rows.length === 0) {
      throw new AppError('Document not found', 404);
    }

    const filePath = result.rows[0].file_path;

    // Delete from AI service
    await aiService.deleteDocument(documentId, userId);

    // Delete from database (cascades to chunks)
    await db.query('DELETE FROM documents WHERE id = $1', [documentId]);

    // Delete file from filesystem
    if (filePath) {
      deleteFile(filePath);
    }

    logger.info(`Document deleted: ${documentId}`);
  }

  async deleteAllDocuments(userId: string) {
    // Fetch all documents for the user
    const result = await db.query(
      'SELECT id, file_path FROM documents WHERE user_id = $1',
      [userId]
    );

    const documents = result.rows;

    if (documents.length === 0) {
      return { deletedCount: 0 };
    }

    // Delete from AI service (loop through each)
    for (const doc of documents) {
      try {
        await aiService.deleteDocument(doc.id, userId);
      } catch (error) {
        logger.error(`Failed to delete document ${doc.id} from AI service:`, error);
        // Continue with other deletions
      }
    }

    // Delete all documents from database (cascades to chunks)
    await db.query('DELETE FROM documents WHERE user_id = $1', [userId]);

    // Delete all files from filesystem
    for (const doc of documents) {
      if (doc.file_path) {
        try {
          deleteFile(doc.file_path);
        } catch (error) {
          logger.error(`Failed to delete file ${doc.file_path}:`, error);
          // Continue with other deletions
        }
      }
    }

    logger.info(`All documents deleted for user: ${userId}, count: ${documents.length}`);
    return { deletedCount: documents.length };
  }

  async resetSystem() {
    logger.warn('Executing SYSTEM RESET - Wiping all data');
    
    // 1. Clear AI Service Index
    try {
      await aiService.clearVectorIndex();
    } catch (e) {
      logger.error('Failed to clear AI index during reset', e);
    }

    // 2. Truncate Database Tables
    await db.query('TRUNCATE TABLE similarity_checks CASCADE');
    await db.query('TRUNCATE TABLE document_chunks CASCADE');
    await db.query('TRUNCATE TABLE documents CASCADE');
    
    // 3. Clean uploads directory
    try {
      // Use dynamic imports or just fs/path if already imported. 
      // Since fs/path are likely not imported, we'll assume we can't use them easily without top-level import.
      // But we can use the `deleteFile` utility logic if applicable, or just suppress the lint if we really need to.
      // Better: I will use the global `fs` and `path` if I import them, but I can't easily add imports now.
      // I will just use `fs` and `path` variables if I can, OR I will assume I can skip file deletion since restart cleans ephemeral storage anyway?
      // NO, I should try to clean it. I will fix the requires to be clean.
      const fs = require('fs');
      const path = require('path');
      const uploadDir = path.join(process.cwd(), 'uploads');
      if (fs.existsSync(uploadDir)) {
          const files = fs.readdirSync(uploadDir);
          for (const file of files) {
              if (file !== '.gitkeep') {
                try {
                    fs.unlinkSync(path.join(uploadDir, file));
                } catch (e) {
                    // Ignore
                }
              }
          }
      }
    } catch (e) {
        logger.error('Failed to clean uploads dir', e);
    }

    return { message: 'System fully reset' };
  }
}

export const documentService = new DocumentService();
