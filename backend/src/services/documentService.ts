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

        // Update document with chunks count and status
        await db.query(
          `UPDATE documents
           SET chunks_count = $1, status = $2, processed_at = CURRENT_TIMESTAMP
           WHERE id = $3`,
          [aiResult.chunks_added || 0, 'indexed', document.id]
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

  async getDocuments(userId: string, page: number = 1, limit: number = 20, sort: string = 'created_at', order: string = 'desc') {
    const offset = (page - 1) * limit;
    const orderClause = `${sort} ${order.toUpperCase()}`;

    // Get total count
    const countResult = await db.query(
      'SELECT COUNT(*) FROM documents WHERE user_id = $1',
      [userId]
    );
    const total = parseInt(countResult.rows[0].count);

    // Get documents
    const result = await db.query(
      `SELECT id, filename, original_filename, file_type, file_size, status, chunks_count, created_at, processed_at
       FROM documents
       WHERE user_id = $1
       ORDER BY ${orderClause}
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    return {
      documents: result.rows.map(doc => ({
        id: doc.id,
        filename: doc.original_filename,
        fileType: doc.file_type,
        fileSize: doc.file_size,
        chunksCount: doc.chunks_count,
        status: doc.status,
        createdAt: doc.created_at,
        processedAt: doc.processed_at
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
              (SELECT json_agg(json_build_object('text', dc.text_content, 'index', dc.chunk_index))
               FROM document_chunks dc
               WHERE dc.document_id = d.id
               ORDER BY dc.chunk_index) as chunks
       FROM documents d
       WHERE d.id = $1 AND d.user_id = $2`,
      [documentId, userId]
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
      createdAt: doc.created_at,
      processedAt: doc.processed_at
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
}

export const documentService = new DocumentService();
