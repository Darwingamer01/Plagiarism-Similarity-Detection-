
import { logger } from '../utils/logger';
import sgMail from '@sendgrid/mail';

export class EmailService {
    async sendVerificationEmail(email: string, otp: string) {
        try {
            // ALWAYS Log OTP for local development/testing convenience
            logger.info(`[DEV] Verification OTP for ${email}: ${otp}`);

            const apiKey = process.env.SENDGRID_API_KEY;
            
            // Mock Mode: If no valid API key, log and return success
            if (!apiKey || !apiKey.startsWith('SG.')) {
                logger.info(`[MOCK EMAIL] Verification Email to: ${email}`);
                logger.info(`[MOCK EMAIL] OTP: ${otp}`);
                return true;
            }

            sgMail.setApiKey(apiKey);

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

            await sgMail.send(msg);
            logger.info(`Verification email sent to ${email}`);
            return true;
        } catch (error) {
            logger.error(`Failed to send verification email: ${error}`);
            // Don't crash the app, just return false
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
    async sendContactFormEmail(name: string, email: string, message: string) {
        const apiKey = process.env.SENDGRID_API_KEY;
        const senderEmail = process.env.SENDGRID_SENDER_EMAIL || 'no-reply@plagiarism-detection.com';

        // Mock Mode: If no valid API key, log and return success
        if (!apiKey || !apiKey.startsWith('SG.')) {
            logger.info(`[MOCK EMAIL] Contact Form Message`);
            logger.info(`[MOCK EMAIL] From: ${name} <${email}>`);
            logger.info(`[MOCK EMAIL] Message: ${message}`);
            return true;
        }

        sgMail.setApiKey(apiKey);

        // Plain text version is crucial for spam filters
        const textContent = `
New Contact Message

Name: ${name}
Email: ${email}

Message:
${message}

--------------------------------------------------
Sent from Plagiarism Detection Platform
        `.trim();

        const msg = {
            to: senderEmail,
            from: {
                email: senderEmail,
                name: 'App Notification' // Neutral, non-marketing name
            },
            replyTo: {
                email: email,
                name: name
            },
            subject: `Message from ${name}`, // Simple, direct subject
            text: textContent, // Include plain text version
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <title>New Contact Message</title>
                </head>
                <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 20px;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden;">
                        <div style="background-color: #000000; padding: 20px; text-align: center;">
                            <h2 style="color: #ffffff; margin: 0; font-size: 20px;">New Contact Message</h2>
                        </div>
                        
                        <div style="padding: 30px;">
                            <div style="margin-bottom: 24px;">
                                <p style="margin: 0; color: #666; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">From</p>
                                <p style="margin: 4px 0 0; font-size: 16px; font-weight: 600;">${name}</p>
                                <a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a>
                            </div>

                            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 20px; margin-top: 20px;">
                                <p style="margin: 0; font-style: italic; white-space: pre-wrap;">${message}</p>
                            </div>
                        </div>

                        <div style="background-color: #f9fafb; padding: 15px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0; color: #6b7280; font-size: 12px;">
                                To reply, simply hit reply to this email.
                            </p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        };

        try {
            await sgMail.send(msg);
            logger.info(`Contact form email sent from ${email}`);
            return true;
        } catch (error) {
            logger.error(`Failed to send contact form email: ${error}`);
            // Log the actual error response if available for debugging
            if ((error as any).response) {
                logger.error(JSON.stringify((error as any).response.body));
            }
            return false;
        }
    }
}

export const emailService = new EmailService();
