
import { logger } from '../utils/logger';
import sgMail from '@sendgrid/mail';

export class EmailService {
    async sendVerificationEmail(email: string, otp: string) {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

            const msg = {
                to: email,
                from: {
                    email: process.env.SENDGRID_SENDER_EMAIL as string,
                    name: 'Plagiarism Detection'
                },
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
            await sgMail.send(msg);
            logger.info(`Verification email sent to ${email}`);
            return true;
        } catch (error) {
            logger.error(`Failed to send verification email: ${error}`);
            return false;
        }
    }

    async sendResetPasswordEmail(email: string, token: string) {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

        // Construct the reset password link for the deployed frontend
        const resetLink = `https://plagiarism-similarity-detection.vercel.app/reset-password?token=${token}`;

        const msg = {
            to: email,
            from: {
                email: process.env.SENDGRID_SENDER_EMAIL as string,
                name: 'Plagiarism Detection'
            },
            subject: 'Reset Your Password',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 400px; margin: auto; border: 1px solid #eee; border-radius: 8px; padding: 24px; background: #fafafa;">
                    <h2 style="text-align:center; color:#333;">Password Reset Request</h2>
                    <p>Hello,</p>
                    <p>You requested to reset your password. Please click the button below to reset it:</p>
                    <div style="display:flex; justify-content:center; margin: 24px 0;">
                        <a href="${resetLink}" style="background:#4f8cff; color:#fff; padding:12px 28px; border-radius:6px; font-size:1.1em; text-decoration:none; font-weight:bold;">Reset Password</a>
                    </div>
                    <p style="text-align:center; color:#888;">If you didn't request this, please ignore this email.</p>
                </div>
            `,
        };

        try {
            await sgMail.send(msg);
            logger.info(`Password reset email sent to ${email}`);
            return true;
        } catch (error) {
            logger.error(`Failed to send password reset email: ${error}`);
            return false;
        }
    }

    async sendEmailChangeOTP(email: string, otp: string) {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

        const msg = {
            to: email,
            from: {
                email: process.env.SENDGRID_SENDER_EMAIL as string,
                name: 'Plagiarism Detection'
            },
            subject: 'Verify Your New Email Address',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 400px; margin: auto; border: 1px solid #eee; border-radius: 8px; padding: 24px; background: #fafafa;">
                    <h2 style="text-align:center; color:#333;">Email Change Verification</h2>
                    <p>Hello,</p>
                    <p>You requested to change your email address. Please use the following OTP to verify your new email:</p>
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
            await sgMail.send(msg);
            logger.info(`Email change OTP sent to ${email}`);
            return true;
        } catch (error) {
            logger.error(`Failed to send email change OTP: ${error}`);
            return false;
        }
    }
}

export const emailService = new EmailService();
