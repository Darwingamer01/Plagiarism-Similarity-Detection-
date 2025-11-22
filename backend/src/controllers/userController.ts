import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/userService';
import Joi from 'joi';

// Validation schemas
const validateUpdateProfile = Joi.object({
    fullName: Joi.string().min(2).max(100).required()
});

const validateRequestEmailChange = Joi.object({
    newEmail: Joi.string().email().required()
});

const validateVerifyEmailChange = Joi.object({
    newEmail: Joi.string().email().required(),
    otp: Joi.string().length(6).pattern(/^[0-9]+$/).required()
});

const validateChangePassword = Joi.object({
    oldPassword: Joi.string().min(6).required(),
    newPassword: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
        'any.only': 'Passwords do not match'
    })
});

const validateSetPassword = Joi.object({
    newPassword: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
        'any.only': 'Passwords do not match'
    })
});

const validateThreshold = Joi.object({
    threshold: Joi.number().min(0.5).max(0.99).required()
});
export class UserController {
    /**
 * Get similarity threshold for current user
 */
    async getThreshold(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    error: { message: 'Not authenticated', statusCode: 401 }
                });
            }
            const threshold = await userService.getThreshold(req.user.id);
            res.status(200).json({ success: true, data: { threshold } });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Set similarity threshold for current user
     */
    async setThreshold(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    error: { message: 'Not authenticated', statusCode: 401 }
                });
            }
            const { error, value } = validateThreshold.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    error: { message: error.details[0].message, statusCode: 400 }
                });
            }
            const threshold = await userService.setThreshold(req.user.id, value.threshold);
            res.status(200).json({ success: true, data: { threshold } });
        } catch (error) {
            next(error);
        }
    }
    /**
     * Update user profile (name only)
     */
    async updateProfile(req: Request, res: Response, next: NextFunction) {
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

                // Validate input
                const { error, value } = validateUpdateProfile.validate(req.body);
                if (error) {
                    return res.status(400).json({
                        success: false,
                        error: {
                            message: error.details[0].message,
                            statusCode: 400
                        }
                    });
                }

                const user = await userService.updateProfile(req.user.id, value.fullName);

                res.status(200).json({
                    success: true,
                    data: user
                });
            } catch (error) {
                next(error);
            }
        }

    /**
     * Request email change OTP
     */
    async requestEmailChange(req: Request, res: Response, next: NextFunction) {
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

                // Validate input
                const { error, value } = validateRequestEmailChange.validate(req.body);
                if (error) {
                    return res.status(400).json({
                        success: false,
                        error: {
                            message: error.details[0].message,
                            statusCode: 400
                        }
                    });
                }

                const result = await userService.requestEmailChange(req.user.id, value.newEmail);

                res.status(200).json({
                    success: true,
                    data: result
                });
            } catch (error) {
                next(error);
            }
        }

    /**
     * Verify email change OTP and update email
     */
    async verifyEmailChange(req: Request, res: Response, next: NextFunction) {
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

                // Validate input
                const { error, value } = validateVerifyEmailChange.validate(req.body);
                if (error) {
                    return res.status(400).json({
                        success: false,
                        error: {
                            message: error.details[0].message,
                            statusCode: 400
                        }
                    });
                }

                const user = await userService.verifyEmailChange(
                    req.user.id,
                    value.newEmail,
                    value.otp
                );

                res.status(200).json({
                    success: true,
                    data: user
                });
            } catch (error) {
                next(error);
            }
        }

    /**
     * Change password
     */
    async changePassword(req: Request, res: Response, next: NextFunction) {
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

                // Validate input
                const { error, value } = validateChangePassword.validate(req.body);
                if (error) {
                    return res.status(400).json({
                        success: false,
                        error: {
                            message: error.details[0].message,
                            statusCode: 400
                        }
                    });
                }

                const result = await userService.changePassword(
                    req.user.id,
                    value.oldPassword,
                    value.newPassword
                );

                res.status(200).json({
                    success: true,
                    data: result
                });
            } catch (error) {
                next(error);
            }
        }

    /**
     * Set password (for OAuth users)
     */
    async setPassword(req: Request, res: Response, next: NextFunction) {
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

                // Validate input
                const { error, value } = validateSetPassword.validate(req.body);
                if (error) {
                    return res.status(400).json({
                        success: false,
                        error: {
                            message: error.details[0].message,
                            statusCode: 400
                        }
                    });
                }

                const result = await userService.setPassword(
                    req.user.id,
                    value.newPassword
                );

                res.status(200).json({
                    success: true,
                    data: result
                });
            } catch (error) {
                next(error);
            }
        }
    }

    export const userController = new UserController();
