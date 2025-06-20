// backend/routes/leadRoutes.js
import express from 'express';
import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  importLeads,
  getLeadStats,
  getLeadTrends,
  uploadLeadAttachment,       // ✅ Aliakbar's file upload controller
  getLeadMetrics,             // ✅ Partner's route: Lead Retention & Conversion
  getMonthlyMetrics           // ✅ Partner's route: Monthly Trends
} from '../controllers/leadController.js';

import { uploadLeadAttachment as upload } from '../middleware/upload.js'; // ✅ Named multer export

const router = express.Router();

// 🔹 Core CRUD
router.get('/', getLeads);
router.post('/', createLead);
router.post('/import', importLeads);

// 🔹 Analytics
router.get('/stats', getLeadStats);
router.get('/bar-stats', getLeadTrends);
router.get('/metrics', getLeadMetrics);
router.get('/monthly-metrics', getMonthlyMetrics);

// 🔹 Individual CRUD
router.get('/:id', getLeadById);
router.put('/:id', updateLead);
router.delete('/:id', deleteLead);

// 🔹 📂 Upload Attachment (PDF only)
router.post('/upload/:id', upload.single('file'), uploadLeadAttachment);

export default router;
