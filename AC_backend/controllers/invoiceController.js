// backend/server/controllers/invoiceController.js

import Invoice from '../models/invoiceModel.js';
import SalesOrder from '../models/salesOrder.js';

/**
 * 🧾 Create a new invoice (manual or from salesOrder)
 */
export const createInvoice = async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      billingAddress,
      invoiceDate,
      dueDate,
      products,
      discount = 0,
      taxRate = 18,
      paymentStatus = 'Draft',
      notes,
      salesOrderId,
    } = req.body;

    // 💡 Calculate subtotal from products
    const subtotal = products.reduce((sum, p) => sum + (p.quantity * p.unitPrice), 0);
    const taxAmount = (subtotal - discount) * (taxRate / 100);
    const totalAmount = subtotal - discount + taxAmount;

    const newInvoice = new Invoice({
      customerName,
      customerEmail,
      customerPhone,
      billingAddress,
      invoiceDate,
      dueDate,
      products,
      subtotal,
      discount,
      taxRate,
      taxAmount,
      totalAmount,
      paymentStatus,
      notes,
      salesOrderId,
    });

    const saved = await newInvoice.save();
    res.status(201).json({ message: '✅ Invoice created successfully', invoice: saved });

  } catch (err) {
    console.error('❌ Error creating invoice:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

/**
 * 📦 Get all invoices
 */
export const getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.status(200).json(invoices);
  } catch (err) {
    console.error('❌ Error fetching invoices:', err);
    res.status(500).json({ message: 'Failed to get invoices', error: err.message });
  }
};

/**
 * 🔍 Get a single invoice by ID
 */
export const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findById(id);

    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.status(200).json(invoice);
  } catch (err) {
    console.error('❌ Error fetching invoice:', err);
    res.status(500).json({ message: 'Failed to fetch invoice', error: err.message });
  }
};

/**
 * ✏️ Update an invoice status or info
 */
export const updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updated = await Invoice.findByIdAndUpdate(id, updates, { new: true });
    if (!updated) return res.status(404).json({ message: 'Invoice not found' });

    res.status(200).json({ message: '✅ Invoice updated successfully', invoice: updated });
  } catch (err) {
    console.error('❌ Error updating invoice:', err);
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};
