import { logger } from '../utils/logger';

export class EmailService {
    async sendVerificationEmail(email: string, otp: string) {
        logger.info('=================================================================');
        logger.info(`📧 EMAIL MOCK: Email Verification`);
        logger.info(`To: ${email}`);
        logger.info(`Subject: Verify Your Email Address`);
        logger.info(`Body:`);
        logger.info(`Hello,`);
        logger.info(`Thank you for registering! Please use the following OTP to verify your email:`);
        logger.info(`OTP: ${otp}`);
        logger.info(`This code will expire in 10 minutes.`);
        logger.info(`If you didn't request this, please ignore this email.`);
        logger.info('=================================================================');

        return true;
    }

    async sendResetPasswordEmail(email: string, resetLink: string) {
        logger.info('=================================================================');
        logger.info(`📧 EMAIL MOCK: Password Reset Request`);
        logger.info(`To: ${email}`);
        logger.info(`Subject: Reset Your Password`);
        logger.info(`Body:`);
        logger.info(`Hello,`);
        logger.info(`You requested to reset your password.`);
        logger.info(`Please click the link below to reset it:`);
        logger.info(resetLink);
        logger.info(`If you didn't request this, please ignore this email.`);
        logger.info('=================================================================');

        return true;
    }

    async sendEmailChangeOTP(email: string, otp: string) {
        logger.info('=================================================================');
        logger.info(`📧 EMAIL MOCK: Email Change Verification`);
        logger.info(`To: ${email}`);
        logger.info(`Subject: Verify Your New Email Address`);
        logger.info(`Body:`);
        logger.info(`Hello,`);
        logger.info(`You requested to change your email address. Please use the following OTP to verify your new email:`);
        logger.info(`OTP: ${otp}`);
        logger.info(`This code will expire in 10 minutes.`);
        logger.info(`If you didn't request this, please ignore this email.`);
        logger.info('=================================================================');

        return true;
    }
}

export const emailService = new EmailService();
