import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  productName: String,
  description: String,
  quantity: Number,
  unitPrice: Number,
  discount: Number,
  tax: Number,
  subtotal: Number
}, { _id: false });

const versionSchema = new mongoose.Schema({
  versionNumber: Number,
  items: [itemSchema],
  totals: {
    totalBeforeTax: Number,
    taxAmount: Number,
    grandTotal: Number
  },
  updatedAt: { type: Date, default: Date.now },
  notes: String
}, { _id: false });

// Define a counter schema
const counterSchema = new mongoose.Schema({
  _id: { type: String },
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.model('Counter', counterSchema);

const quotationSchema = new mongoose.Schema({
  customer: {
    name: String,
    contact: String,
    email: String,
    billingAddress: String
  },
  quotationId: { type: String, unique: true },
  date: { type: Date, default: Date.now },
  validUntil: Date,
  currency: String,
  salesRep: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [itemSchema],
  totals: {
    totalBeforeTax: Number,
    taxAmount: Number,
    grandTotal: Number
  },
  discountType: { type: String, enum: ['None', 'PerItem', 'Global'], default: 'None' },
  globalDiscount: Number,
  taxType: String,
  terms: {
    payment: String,
    delivery: String,
    additionalNotes: String
  },
  attachments: [String],
  status: {
    type: String,
    enum: ['Draft', 'Sent', 'Accepted', 'Declined', 'Expired'],
    default: 'Draft'
  },
  versions: [versionSchema],
  activityLog: [{
    action: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now },
    comment: String
  }]
}, { timestamps: true });

// Pre-save hook to auto-increment the quotationId
quotationSchema.pre('save', async function (next) {
  const doc = this;

  if (doc.isNew && !doc.quotationId) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'quotationId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );

      doc.quotationId = `QTN-${String(counter.seq).padStart(4, '0')}`;
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

export default mongoose.model('Quotation', quotationSchema);
