import mongoose from 'mongoose';

const purchaseSchema = new mongoose.Schema({
  vendorName: String,
  amount: Number,
  tax: Number,
  date: Date,
}, { timestamps: true });

export default mongoose.model('Purchase', purchaseSchema);
