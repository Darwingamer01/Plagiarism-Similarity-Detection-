
import { Request, Response } from 'express';
import { emailService } from '../services/emailService';
import { logger } from '../utils/logger';

export const sendContactMessage = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, email, message } = req.body;

        // Basic validation
        if (!email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Email and message are required fields.'
            });
        }

        const name = firstName && lastName ? `${firstName} ${lastName}` : (firstName || 'Anonymous');

        const sent = await emailService.sendContactFormEmail(name, email, message);

        if (sent) {
            return res.status(200).json({
                success: true,
                message: 'Message sent successfully.'
            });
        } else {
            return res.status(500).json({
                success: false,
                message: 'Failed to send message. Please try again later.'
            });
        }
    } catch (error) {
        logger.error(`Error in sendContactMessage: ${error}`);
        return res.status(500).json({
            success: false,
            message: 'Internal server error.'
        });
    }
};
