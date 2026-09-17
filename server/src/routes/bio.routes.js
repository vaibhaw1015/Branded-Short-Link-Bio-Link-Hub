import express from 'express';
import { body } from 'express-validator';
import { bioController, upload } from '../controllers/bio.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// Public route for public profile page
router.get('/:username', bioController.getPublicBio);

// Authenticated builder routes
router.get('/', authenticate, bioController.getBio);

router.put(
  '/',
  authenticate,
  [
    body('displayName').optional().trim().isLength({ max: 60 }).withMessage('Display name maximum 60 chars'),
    body('bio').optional().trim().isLength({ max: 500 }).withMessage('Bio maximum 500 chars'),
    body('theme').optional().isIn(['minimal-light', 'dark-slate', 'gradient']).withMessage('Invalid theme selection')
  ],
  validate,
  bioController.updateBio
);

router.post(
  '/avatar',
  authenticate,
  upload.single('avatar'),
  bioController.uploadAvatar
);

export default router;
