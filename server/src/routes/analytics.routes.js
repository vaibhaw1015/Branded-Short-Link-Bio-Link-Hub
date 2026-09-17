import express from 'express';
import { analyticsController } from '../controllers/analytics.controller.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

router.use(authenticate);

router.get('/overview', analyticsController.getOverviewAnalytics);
router.get('/link/:id', analyticsController.getLinkAnalytics);

export default router;
