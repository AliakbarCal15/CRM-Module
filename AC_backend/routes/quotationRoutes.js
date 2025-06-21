import express from 'express';
import {
  createQuotation,
  getAllQuotations,
  getQuotationById,
  updateQuotation,
  deleteQuotation,
  getQuotationVersions,
  getQuotationVersionByNumber,
  restoreQuotationVersion
} from '../controllers/quotationController.js';

import { sendQuotationEmail } from '../controllers/emailController.js';
import { downloadQuotationPDF } from '../controllers/pdfController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// 📌 CRUD Routes
router.post('/', protect, createQuotation);
router.get('/', protect, getAllQuotations);
router.get('/:id', protect, getQuotationById);
router.put('/:id', protect, updateQuotation);
router.delete('/:id', protect, deleteQuotation);

// 📧 Email & PDF
router.post('/:quotationId/send-email', protect, sendQuotationEmail);
router.get('/:quotationId/download-pdf', protect, downloadQuotationPDF);

// 🧾 Version Control
router.get('/:id/versions', protect, getQuotationVersions);                     // All versions of a quotation
router.get('/:id/versions/:versionNumber', protect, getQuotationVersionByNumber); // Specific version
router.post('/:id/restore-version/:versionNumber', protect, restoreQuotationVersion); // Restore

export default router;
