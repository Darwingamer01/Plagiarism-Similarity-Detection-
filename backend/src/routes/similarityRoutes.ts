import { Router } from 'express';
import { similarityController } from '../controllers/similarityController';
import { authenticate } from '../middleware/authMiddleware';
import { upload } from '../utils/fileUpload';
import { uploadLimiter } from '../middleware/rateLimiter';

const router = Router();

/**
 * @swagger
 * /api/similarity/check:
 *   post:
 *     summary: Check document similarity
 *     tags: [Similarity]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               threshold:
 *                 type: number
 *                 default: 0.88
 *               topK:
 *                 type: number
 *                 default: 5
 *     responses:
 *       200:
 *         description: Similarity check completed
 *       400:
 *         description: Invalid input
 */
router.post(
  '/check',
  authenticate,
  uploadLimiter,
  upload.single('file'),
  similarityController.check.bind(similarityController)
);

/**
 * @swagger
 * /api/similarity/results/{id}:
 *   get:
 *     summary: Get similarity check result
 *     tags: [Similarity]
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
 *         description: Similarity result retrieved
 *       404:
 *         description: Result not found
 */
router.get('/results/:id', authenticate, similarityController.getResult.bind(similarityController));

/**
 * @swagger
 * /api/similarity/history:
 *   get:
 *     summary: Get similarity check history
 *     tags: [Similarity]
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
 *     responses:
 *       200:
 *         description: History retrieved successfully
 */
router.get('/history', authenticate, similarityController.getHistory.bind(similarityController));

/**
 * @swagger
 * /api/similarity/history/{id}:
 *   delete:
 *     summary: Delete a specific similarity check
 *     tags: [Similarity]
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
 *         description: Similarity check deleted successfully
 *       404:
 *         description: Similarity check not found
 */
router.delete('/history/:id', authenticate, similarityController.deleteCheck.bind(similarityController));

/**
 * @swagger
 * /api/similarity/history:
 *   delete:
 *     summary: Clear all similarity check history for the authenticated user
 *     tags: [Similarity]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: History cleared successfully
 */
router.delete('/history', authenticate, similarityController.clearHistory.bind(similarityController));

export default router;
