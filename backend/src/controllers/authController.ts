import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';
import { validateRegistration, validateLogin, validateForgotPassword, validateResetPassword, validateInitiateRegistration, validateVerifyRegistration } from '../utils/validation';
// import { logger } from '../utils/logger';

export class AuthController {
  async initiateRegister(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate input
      const { error, value } = validateInitiateRegistration.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          error: {
            message: error.details[0].message,
            statusCode: 400
          }
        });
      }

      const result = await authService.initiateRegistration(value);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async verifyRegister(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate input
      const { error, value } = validateVerifyRegistration.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          error: {
            message: error.details[0].message,
            statusCode: 400
          }
        });
      }

      const result = await authService.verifyRegistration(value.email, value.otp);

      res.status(201).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate input
      const { error, value } = validateRegistration.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          error: {
            message: error.details[0].message,
            statusCode: 400
          }
        });
      }

      const result = await authService.register(value);

      res.status(201).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate input
      const { error, value } = validateLogin.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          error: {
            message: error.details[0].message,
            statusCode: 400
          }
        });
      }

      const result = await authService.login(value);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Refresh token is required',
            statusCode: 400
          }
        });
      }

      const result = await authService.refreshToken(refreshToken);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
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

      await authService.logout(req.user.id);

      res.status(200).json({
        success: true,
        data: {
          message: 'Logged out successfully'
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async generateApiKey(req: Request, res: Response, next: NextFunction) {
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

      const apiKey = await authService.generateApiKey(req.user.id);

      res.status(200).json({
        success: true,
        data: {
          apiKey
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async me(req: Request, res: Response, next: NextFunction) {
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

      res.status(200).json({
        success: true,
        data: {
          user: req.user
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { error, value } = validateForgotPassword.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          error: {
            message: error.details[0].message,
            statusCode: 400
          }
        });
      }

      await authService.forgotPassword(value.email);

      res.status(200).json({
        success: true,
        data: {
          message: 'If an account exists with this email, a password reset link has been sent.'
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { error, value } = validateResetPassword.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          error: {
            message: error.details[0].message,
            statusCode: 400
          }
        });
      }

      await authService.resetPassword(value.token, value.password);

      res.status(200).json({
        success: true,
        data: {
          message: 'Password has been reset successfully'
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async googleLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Google token is required',
            statusCode: 400
          }
        });
      }

      const result = await authService.handleOAuthLogin('google', token);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }


  async completeOAuthRegistration(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, fullName, provider, providerId } = req.body;

      if (!email || !fullName || !provider || !providerId) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Email, full name, provider, and provider ID are required',
            statusCode: 400
          }
        });
      }

      if (provider !== 'google') {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Invalid provider. Must be "google"',
            statusCode: 400
          }
        });
      }

      const result = await authService.completeOAuthRegistration({
        email,
        fullName,
        provider,
        providerId
      });

      res.status(201).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
