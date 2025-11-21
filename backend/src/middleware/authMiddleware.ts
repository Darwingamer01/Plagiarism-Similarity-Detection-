import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/environment';
import { AppError } from './errorHandler';
import { db } from '../config/database';

interface JwtPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        fullName: string;
        role: string;
      };
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check for Bearer token
    let token: string | undefined;
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check for API key
    const apiKey = req.headers['x-api-key'] as string;

    if (!token && !apiKey) {
      throw new AppError('No authentication token provided', 401);
    }

    if (apiKey) {
      // Authenticate with API key
      const result = await db.query(
        'SELECT id, email, full_name, role FROM users WHERE api_key = $1',
        [apiKey]
      );

      if (result.rows.length === 0) {
        throw new AppError('Invalid API key', 401);
      }

      req.user = {
        id: result.rows[0].id,
        email: result.rows[0].email,
        fullName: result.rows[0].full_name,
        role: result.rows[0].role
      };
    } else if (token) {
      // Authenticate with JWT
      const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;

      // Fetch user from database
      const result = await db.query(
        'SELECT id, email, full_name, role FROM users WHERE id = $1',
        [decoded.userId]
      );

      if (result.rows.length === 0) {
        throw new AppError('User not found', 401);
      }

      req.user = {
        id: result.rows[0].id,
        email: result.rows[0].email,
        fullName: result.rows[0].full_name,
        role: result.rows[0].role
      };
    }

    next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      next(new AppError('Invalid token', 401));
    } else if (error.name === 'TokenExpiredError') {
      next(new AppError('Token expired', 401));
    } else {
      next(error);
    }
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Not authenticated', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('Not authorized to access this resource', 403));
    }

    next();
  };
};
