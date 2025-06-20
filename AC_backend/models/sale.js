import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema({
  customerName: String,
  amount: Number,
  tax: Number,
  date: Date,
}, { timestamps: true });

export default mongoose.model('Sale', saleSchema);
