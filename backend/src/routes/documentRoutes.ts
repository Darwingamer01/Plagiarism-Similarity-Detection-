import { Router } from 'express';
import { documentController } from '../controllers/documentController';
import { authenticate } from '../middleware/authMiddleware';
import { upload } from '../utils/fileUpload';
import { uploadLimiter } from '../middleware/rateLimiter';

const router = Router();

/**
 * @swagger
 * /api/documents/ingest:
 *   post:
 *     summary: Upload and index documents
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Documents processed successfully
 *       400:
 *         description: Invalid input
 */
router.post(
  '/ingest',
  authenticate,
  uploadLimiter,
  upload.array('files', 1),
  documentController.ingest.bind(documentController)
);

/**
 * @swagger
 * /api/documents/admin/reset:
 *   post:
 *     summary: WIPE ALL DATA (Documents & AI Index)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: System reset complete
 */
router.post('/admin/reset', authenticate, documentController.resetSystem.bind(documentController));

/**
 * @swagger
 * /api/documents:
 *   get:
 *     summary: List user's indexed documents
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: created_at
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       200:
 *         description: Documents retrieved successfully
 */
router.get('/', authenticate, documentController.getDocuments.bind(documentController));

/**
 * @swagger
 * /api/documents/{id}:
 *   get:
 *     summary: Get document details
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Document details retrieved
 *       404:
 *         description: Document not found
 */
router.get('/:id', authenticate, documentController.getDocumentById.bind(documentController));

/**
 * @swagger
 * /api/documents/{id}:
 *   delete:
 *     summary: Delete a document
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Document deleted successfully
 *       404:
 *         description: Document not found
 */
router.delete('/:id', authenticate, documentController.deleteDocument.bind(documentController));

/**
 * @swagger
 * /api/documents:
 *   delete:
 *     summary: Delete all documents for the authenticated user
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All documents deleted successfully
 */
router.delete('/', authenticate, documentController.deleteAllDocuments.bind(documentController));

export default router;
