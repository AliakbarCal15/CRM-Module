import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  sku: String,
  quantity: { type: Number, required: true, min: 1 },
  unitCost: { type: Number, required: true },
  taxPercent: { type: Number, default: 0 },
  total: { type: Number, required: true },
});

const purchaseOrderSchema = new mongoose.Schema({
  vendorName: { type: String, required: true },
  vendorEmail: String,
  vendorPhone: String,
  vendorAddress: String,
  orderNumber: { type: String, unique: true },
  purchaseDate: { type: Date, required: true },
  deliveryDate: Date,
  products: [itemSchema],
  modeOfPayment: { type: String, enum: ['Cash', 'Credit', 'Bank Transfer'] },
  paymentTerms: String,
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Partial'] },
  procurementOfficer: String,
  notes: String,
  discount: Number,
  taxSummary: String,
  subtotal: Number,
  grandTotal: Number,
  status: { type: String, enum: ['Draft', 'Confirmed', 'Received', 'Cancelled'], default: 'Draft' },
  attachments: [String],
  deliveryPartner: String,
  followUpReminder: Date,
}, { timestamps: true });

export default mongoose.model('PurchaseOrder', purchaseOrderSchema);
