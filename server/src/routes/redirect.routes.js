import express from 'express';
import { redirectController } from '../controllers/redirect.controller.js';
import { redirectLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.get('/:shortCode', redirectLimiter, redirectController.redirect);

export default router;
