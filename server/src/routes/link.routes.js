import express from 'express';
import { body } from 'express-validator';
import { linkController } from '../controllers/link.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { linkCreateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.use(authenticate);

router.post(
  '/',
  linkCreateLimiter,
  [
    body('destinationUrl')
      .trim()
      .notEmpty()
      .withMessage('Destination URL is required')
      .isURL({ require_protocol: true })
      .withMessage('Destination must be a valid absolute URL (include http:// or https://)'),
    body('customSlug')
      .optional({ checkFalsy: true })
      .trim()
      .matches(/^[a-zA-Z0-9_-]{3,50}$/)
      .withMessage('Custom slug must be 3-50 alphanumeric characters or hyphens/underscores')
  ],
  validate,
  linkController.createLink
);

router.get('/', linkController.getLinks);
router.delete('/:id', linkController.deleteLink);
router.get('/:id/qr', linkController.getQrCode);

export default router;
