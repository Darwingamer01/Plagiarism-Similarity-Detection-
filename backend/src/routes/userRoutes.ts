import { Router } from 'express';
import { userController } from '../controllers/userController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile (name only)
 * @access  Private
 */
router.put('/profile', authenticate, userController.updateProfile.bind(userController));

/**
 * @route   POST /api/users/request-email-change
 * @desc    Request OTP for email change
 * @access  Private
 */
router.post('/request-email-change', authenticate, userController.requestEmailChange.bind(userController));

/**
 * @route   POST /api/users/verify-email-change
 * @desc    Verify OTP and update email
 * @access  Private
 */
router.post('/verify-email-change', authenticate, userController.verifyEmailChange.bind(userController));

/**
 * @route   POST /api/users/change-password
 * @desc    Change password (for users with existing password)
 * @access  Private
 */
router.post('/change-password', authenticate, userController.changePassword.bind(userController));

/**
 * @route   POST /api/users/set-password
 * @desc    Set password (for OAuth users without password)
 * @access  Private
 */
router.post('/set-password', authenticate, userController.setPassword.bind(userController));

/**
 * @route   GET /api/users/threshold
 * @desc    Get similarity threshold for current user
 * @access  Private
 */
router.get('/threshold', authenticate, userController.getThreshold.bind(userController));

/**
 * @route   PUT /api/users/threshold
 * @desc    Set similarity threshold for current user
 * @access  Private
 */
router.put('/threshold', authenticate, userController.setThreshold.bind(userController));

export default router;
