import { Request, Response, NextFunction } from 'express';
import { similarityService } from '../services/similarityService';
import { validateSimilarityCheck, validatePagination, validateUUID } from '../utils/validation';

export class SimilarityController {
  async check(req: Request, res: Response, next: NextFunction) {
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

      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'No file uploaded',
            statusCode: 400
          }
        });
      }

      // Validate query parameters
      const { error, value } = validateSimilarityCheck.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          error: {
            message: error.details[0].message,
            statusCode: 400
          }
        });
      }

      const result = await similarityService.checkSimilarity(
        req.file,
        req.user.id,
        value.threshold,
        value.topK
      );

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getResult(req: Request, res: Response, next: NextFunction) {
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

      // Validate UUID
      const { error, value } = validateUUID.validate({ id: req.params.id });
      if (error) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Invalid check ID',
            statusCode: 400
          }
        });
      }

      const result = await similarityService.getSimilarityResult(value.id, req.user.id);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getHistory(req: Request, res: Response, next: NextFunction) {
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

      // Validate pagination
      const { error, value } = validatePagination.validate(req.query);
      if (error) {
        return res.status(400).json({
          success: false,
          error: {
            message: error.details[0].message,
            statusCode: 400
          }
        });
      }

      const result = await similarityService.getSimilarityHistory(
        req.user.id,
        value.page,
        value.limit
      );

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCheck(req: Request, res: Response, next: NextFunction) {
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

      // Validate UUID
      const { error, value } = validateUUID.validate({ id: req.params.id });
      if (error) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Invalid check ID',
            statusCode: 400
          }
        });
      }

      await similarityService.deleteCheck(value.id, req.user.id);

      res.status(200).json({
        success: true,
        data: {
          message: 'Similarity check deleted successfully'
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async clearHistory(req: Request, res: Response, next: NextFunction) {
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

      const result = await similarityService.clearHistory(req.user.id);

      res.status(200).json({
        success: true,
        data: {
          message: `${result.deletedCount} similarity check(s) deleted successfully`,
          deletedCount: result.deletedCount
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

export const similarityController = new SimilarityController();
