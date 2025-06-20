import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  sku: String,
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true },
  taxPercent: { type: Number, default: 0 },
  total: { type: Number, required: true },
});

const salesOrderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerEmail: String,
  customerPhone: String,
  billingAddress: String,
  shippingAddress: String,
  salesOrderNumber: { type: String, unique: true },
  salesOrderDate: { type: Date, required: true },
  products: [itemSchema],
  modeOfPayment: { type: String, enum: ['Cash', 'Card', 'Bank Transfer', 'UPI'] },
  paymentTerms: String,
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Partially Paid'] },
  assignedSalesperson: String,
  notes: String,
  discount: Number,
  taxSummary: String,
  subtotal: Number,
  grandTotal: Number,
  status: { type: String, enum: ['Draft', 'Confirmed', 'Cancelled', 'Invoiced'], default: 'Draft' },
  attachments: [String],
  followUpReminder: Date,
  sourceOfLead: String,
}, { timestamps: true });

export default mongoose.model('SalesOrder', salesOrderSchema);
