import { Request, Response, NextFunction } from 'express';
import { documentService } from '../services/documentService';
import { validatePagination, validateUUID } from '../utils/validation';

export class DocumentController {
  async ingest(req: Request, res: Response, next: NextFunction) {
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

      if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'No files uploaded',
            statusCode: 400
          }
        });
      }

      const files = req.files as Express.Multer.File[];
      const result = await documentService.ingestDocuments(files, req.user.id);

      res.status(200).json({
        success: true,
        data: {
          processedFiles: result
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getDocuments(req: Request, res: Response, next: NextFunction) {
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

      const result = await documentService.getDocuments(
        req.user.id,
        value.page,
        value.limit,
        value.sort,
        value.order,
        req.query.scope as 'mine' | 'others' | 'all'
      );

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getDocumentById(req: Request, res: Response, next: NextFunction) {
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
            message: 'Invalid document ID',
            statusCode: 400
          }
        });
      }

      const result = await documentService.getDocumentById(value.id, req.user.id);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteDocument(req: Request, res: Response, next: NextFunction) {
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
            message: 'Invalid document ID',
            statusCode: 400
          }
        });
      }

      await documentService.deleteDocument(value.id, req.user.id);

      res.status(200).json({
        success: true,
        data: {
          message: 'Document deleted successfully'
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteAllDocuments(req: Request, res: Response, next: NextFunction) {
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

      const result = await documentService.deleteAllDocuments(req.user.id);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async resetSystem(req: Request, res: Response, next: NextFunction) {
    try {
      // Admin only check could go here
      const result = await documentService.resetSystem();
      res.status(200).json({ success: true, data: result });
    } catch (error) {
       next(error);
    }
  }
}

export const documentController = new DocumentController();
