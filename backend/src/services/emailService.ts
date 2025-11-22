
import { logger } from '../utils/logger';
import nodemailer from 'nodemailer';

export class EmailService {
    async sendVerificationEmail(email: string, otp: string) {
        // Create transporter (use environment variables for real credentials)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `Plagiarism Detection <${process.env.GMAIL_USER}>`,
            to: email,
            subject: 'Verify Your Email Address',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 400px; margin: auto; border: 1px solid #eee; border-radius: 8px; padding: 24px; background: #fafafa;">
                    <h2 style="text-align:center; color:#333;">Email Verification</h2>
                    <p>Hello,</p>
                    <p>Thank you for registering! Please use the following OTP to verify your email:</p>
                    <div style="display:flex; justify-content:center; margin: 24px 0;">
                        <div style="background:#f0f4ff; border:2px solid #4f8cff; border-radius:8px; padding:16px 32px; font-size:2em; font-weight:bold; color:#1a237e; letter-spacing:4px; text-align:center;">
                            ${otp}
                        </div>
                    </div>
                    <p style="text-align:center; color:#888;">This code will expire in 10 minutes.</p>
                    <p style="text-align:center; color:#888; font-size:0.95em;">If you didn't request this, please ignore this email.</p>
                </div>
            `,
        };

        try {
            await transporter.sendMail(mailOptions);
            logger.info(`Verification email sent to ${email}`);
            return true;
        } catch (error) {
            logger.error(`Failed to send verification email: ${error}`);
            return false;
        }
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
