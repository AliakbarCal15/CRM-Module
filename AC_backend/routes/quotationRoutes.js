// routes/quotationRoutes.js
import express from 'express';
import {
  createQuotation,
  getAllQuotations,
  getQuotationById,
  updateQuotation,
  deleteQuotation,
} from '../controllers/quotationController.js';

import { sendQuotationEmail } from '../controllers/emailController.js';
import { downloadQuotationPDF } from '../controllers/pdfController.js';

import { protect } from '../middleware/authMiddleware.js';
import { uploadQuotationAttachment as upload } from '../middleware/upload.js'; // ✅ Named import for quotation

const router = express.Router();

// Quotation CRUD
router.post('/', protect, createQuotation);
router.get('/', protect, getAllQuotations);
router.get('/:id', protect, getQuotationById);
router.put('/:id', protect, updateQuotation);
router.delete('/:id', protect, deleteQuotation);

// ✅ Send Quotation Email
router.post('/:quotationId/send-email', protect, sendQuotationEmail);

// ✅ Download Quotation PDF
router.get('/:quotationId/download-pdf', protect, downloadQuotationPDF);

// ✅ 📂 Upload Quotation File (future-ready placeholder)
router.post('/upload', upload.single('file'), (req, res) => {
  res.status(200).json({ message: 'Upload endpoint ready. Plug controller here.' });
});

export default router;
