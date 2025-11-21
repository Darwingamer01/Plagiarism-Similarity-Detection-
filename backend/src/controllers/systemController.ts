import { Request, Response, NextFunction } from 'express';
import { db } from '../config/database';
import { redis } from '../config/redis';
import { aiService } from '../services/aiService';

export class SystemController {
  async healthCheck(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json({
        success: true,
        data: {
          status: 'healthy',
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          environment: process.env.NODE_ENV
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async status(req: Request, res: Response, next: NextFunction) {
    try {
      const [dbHealthy, redisHealthy, aiServiceHealthy] = await Promise.all([
        db.healthCheck(),
        redis.healthCheck(),
        aiService.healthCheck()
      ]);

      const isHealthy = dbHealthy && redisHealthy && aiServiceHealthy;

      res.status(isHealthy ? 200 : 503).json({
        success: true,
        data: {
          status: isHealthy ? 'healthy' : 'unhealthy',
          timestamp: new Date().toISOString(),
          services: {
            database: {
              status: dbHealthy ? 'up' : 'down',
              healthy: dbHealthy
            },
            redis: {
              status: redisHealthy ? 'up' : 'down',
              healthy: redisHealthy
            },
            aiService: {
              status: aiServiceHealthy ? 'up' : 'down',
              healthy: aiServiceHealthy
            }
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async stats(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: {
            message: 'Not authenticated',
            statusCode: 401
          }
        });
      }

      // Get user statistics
      const documentsResult = await db.query(
        'SELECT COUNT(*) as total, SUM(chunks_count) as total_chunks FROM documents WHERE user_id = $1 AND status = $2',
        [req.user.id, 'indexed']
      );

      const checksResult = await db.query(
        'SELECT COUNT(*) as total FROM similarity_checks WHERE user_id = $1',
        [req.user.id]
      );

      const recentActivityResult = await db.query(
        `SELECT 'document' as type, original_filename as name, created_at as timestamp
         FROM documents
         WHERE user_id = $1
         UNION ALL
         SELECT 'similarity_check' as type, query_filename as name, created_at as timestamp
         FROM similarity_checks
         WHERE user_id = $1
         ORDER BY timestamp DESC
         LIMIT 10`,
        [req.user.id]
      );

      res.status(200).json({
        success: true,
        data: {
          documents: {
            total: parseInt(documentsResult.rows[0].total || '0'),
            totalChunks: parseInt(documentsResult.rows[0].total_chunks || '0')
          },
          similarityChecks: {
            total: parseInt(checksResult.rows[0].total || '0')
          },
          recentActivity: recentActivityResult.rows
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

export const systemController = new SystemController();
