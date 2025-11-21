import { db } from '../config/database';
import { redis } from '../config/redis';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import bcrypt from 'bcrypt';
import { config } from '../config/environment';

export class UserService {
    /**
     * Update user profile (name only)
     */
    async updateProfile(userId: string, fullName: string) {
        const result = await db.query(
            'UPDATE users SET full_name = $1 WHERE id = $2 RETURNING id, email, full_name, role',
            [fullName, userId]
        );

        if (result.rows.length === 0) {
            throw new AppError('User not found', 404);
        }

        logger.info(`Profile updated for user: ${userId}`);

        return {
            id: result.rows[0].id,
            email: result.rows[0].email,
            fullName: result.rows[0].full_name,
            role: result.rows[0].role
        };
    }

    /**
     * Request email change OTP
     */
    async requestEmailChange(userId: string, newEmail: string) {
        // Check if new email already exists
        const existingUser = await db.query(
            'SELECT id FROM users WHERE email = $1 AND id != $2',
            [newEmail, userId]
        );

        if (existingUser.rows.length > 0) {
            throw new AppError('Email already in use by another account', 400);
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Store email change request in Redis with 10 minutes expiration
        const emailChangeData = {
            userId,
            newEmail,
            otp
        };

        await redis.setJSON(`email_change:${userId}`, emailChangeData, 600); // 10 minutes

        // Send OTP to new email
        const { emailService } = await import('./emailService');
        await emailService.sendEmailChangeOTP(newEmail, otp);

        logger.info(`Email change OTP sent for user: ${userId} to ${newEmail}`);

        return {
            message: 'Verification code sent to your new email address'
        };
    }

    /**
     * Verify email change OTP and update email
     */
    async verifyEmailChange(userId: string, newEmail: string, otp: string) {
        // Retrieve email change data from Redis
        const emailChangeData = await redis.getJSON(`email_change:${userId}`);

        if (!emailChangeData) {
            throw new AppError('Verification session expired. Please request a new code.', 400);
        }

        // Validate OTP
        if (emailChangeData.otp !== otp) {
            throw new AppError('Invalid verification code', 400);
        }

        // Validate new email matches
        if (emailChangeData.newEmail !== newEmail) {
            throw new AppError('Email mismatch', 400);
        }

        // Update email in database
        const result = await db.query(
            'UPDATE users SET email = $1 WHERE id = $2 RETURNING id, email, full_name, role',
            [newEmail, userId]
        );

        if (result.rows.length === 0) {
            throw new AppError('User not found', 404);
        }

        // Delete the email change request from Redis
        await redis.del(`email_change:${userId}`);

        logger.info(`Email updated for user: ${userId} to ${newEmail}`);

        return {
            id: result.rows[0].id,
            email: result.rows[0].email,
            fullName: result.rows[0].full_name,
            role: result.rows[0].role
        };
    }

    /**
     * Change password (for users with existing password)
     */
    async changePassword(userId: string, oldPassword: string, newPassword: string) {
        // Get user with password hash
        const userResult = await db.query(
            'SELECT password_hash FROM users WHERE id = $1',
            [userId]
        );

        if (userResult.rows.length === 0) {
            throw new AppError('User not found', 404);
        }

        const user = userResult.rows[0];

        // Check if user has a password set
        if (!user.password_hash) {
            throw new AppError('No password set. Please use set password instead.', 400);
        }

        // Verify old password
        const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password_hash);
        if (!isOldPasswordValid) {
            throw new AppError('Current password is incorrect', 400);
        }

        // Hash new password
        const newPasswordHash = await bcrypt.hash(newPassword, config.security.bcryptSaltRounds);

        // Update password
        await db.query(
            'UPDATE users SET password_hash = $1 WHERE id = $2',
            [newPasswordHash, userId]
        );

        logger.info(`Password changed for user: ${userId}`);

        return {
            message: 'Password changed successfully'
        };
    }

    /**
     * Set password (for OAuth users without password)
     */
    async setPassword(userId: string, newPassword: string) {
        // Get user
        const userResult = await db.query(
            'SELECT password_hash FROM users WHERE id = $1',
            [userId]
        );

        if (userResult.rows.length === 0) {
            throw new AppError('User not found', 404);
        }

        const user = userResult.rows[0];

        // Check if user already has a password
        if (user.password_hash) {
            throw new AppError('Password already set. Please use change password instead.', 400);
        }

        // Hash new password
        const newPasswordHash = await bcrypt.hash(newPassword, config.security.bcryptSaltRounds);

        // Set password
        await db.query(
            'UPDATE users SET password_hash = $1 WHERE id = $2',
            [newPasswordHash, userId]
        );

        logger.info(`Password set for user: ${userId}`);

        return {
            message: 'Password set successfully'
        };
    }
}

export const userService = new UserService();
