import { Router } from 'express';
import { systemController } from '../controllers/systemController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

/**
 * @swagger
 * /api/system/health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [System]
 *     responses:
 *       200:
 *         description: System is healthy
 */
router.get('/health', systemController.healthCheck.bind(systemController));

/**
 * @swagger
 * /api/system/status:
 *   get:
 *     summary: Get system status
 *     tags: [System]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: System status retrieved
 *       503:
 *         description: System unhealthy
 */
router.get('/status', authenticate, systemController.status.bind(systemController));

/**
 * @swagger
 * /api/system/stats:
 *   get:
 *     summary: Get user statistics
 *     tags: [System]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved
 */
router.get('/stats', authenticate, systemController.stats.bind(systemController));

export default router;
