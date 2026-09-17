import express from 'express';
import { body } from 'express-validator';
import { authController } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/authenticate.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post(
  '/signup',
  authLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('username')
      .trim()
      .isLength({ min: 3, max: 30 })
      .matches(/^[a-zA-Z0-9_-]+$/)
      .withMessage('Username must be 3-30 characters alphanumeric, underscore or hyphen'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  validate,
  authController.signup
);

router.post(
  '/verify-email',
  [
    body('token').notEmpty().withMessage('Verification token is required')
  ],
  validate,
  authController.verifyEmail
);

router.post(
  '/login',
  authLimiter,
  [
    body('email').trim().isEmail().withMessage('Please provide a valid email address'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validate,
  authController.login
);

router.post('/refresh', authController.refresh);

router.post('/logout', authController.logout);

router.post(
  '/forgot-password',
  authLimiter,
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required')
  ],
  validate,
  authController.forgotPassword
);

router.post(
  '/reset-password',
  authLimiter,
  [
    body('token').notEmpty().withMessage('Reset token is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  validate,
  authController.resetPassword
);

router.get('/me', authenticate, authController.getMe);

export default router;
