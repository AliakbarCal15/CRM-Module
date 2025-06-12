// backend/server/models/invoiceModel.js

import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  sku: { type: String },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  total: { type: Number, required: true }
}, { _id: false });

const invoiceSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerEmail: { type: String },
  customerPhone: { type: String },
  billingAddress: { type: String },
  invoiceDate: { type: Date, required: true, default: Date.now },
  dueDate: { type: Date, required: true },
  products: { type: [productSchema], required: true },
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  taxRate: { type: Number, default: 18 }, // GST%
  taxAmount: { type: Number },
  totalAmount: { type: Number },
  paymentStatus: { type: String, enum: ['Draft', 'Sent', 'Paid', 'Overdue'], default: 'Draft' },
  notes: { type: String },
  salesOrderId: { type: mongoose.Schema.Types.ObjectId, ref: 'SalesOrder' }, // 🔁 Link to SalesOrder
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Invoice', invoiceSchema);
