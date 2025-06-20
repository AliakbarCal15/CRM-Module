import express from 'express';
import {
  getDashboardMetrics,
  getSalesAnalytics,
  getPurchaseAnalytics,
} from '../controllers/accountController.js';

const router = express.Router();

router.get('/metrics', getDashboardMetrics);
router.get('/sales-analytics', getSalesAnalytics);
router.get('/purchase-analytics', getPurchaseAnalytics);

export default router;
