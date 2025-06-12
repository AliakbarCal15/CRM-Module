// backend/server/routes/invoiceRoutes.js

import express from 'express';
const router = express.Router();

import {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoice
} from '../controllers/invoiceController.js';

// ✅ Create new invoice
router.post('/', createInvoice);

// ✅ Get all invoices
router.get('/', getAllInvoices);

// ✅ Get invoice by ID
router.get('/:id', getInvoiceById);

// ✅ Update invoice status/details
router.patch('/:id', updateInvoice);

export default router;
