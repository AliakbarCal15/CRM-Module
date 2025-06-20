import PurchaseOrder from '../models/purchaseOrder.js';

export const createPurchase = async (req, res) => {
  try {
    // Auto-generate order number
    const count = await PurchaseOrder.countDocuments();
    const orderNumber = `PO-${String(count + 1).padStart(5, '0')}`;

    const order = new PurchaseOrder({ ...req.body, orderNumber });
    const saved = await order.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error creating purchase:', err.message);
    res.status(500).json({ message: err.message });
  }
};

export const getAllPurchases = async (req, res) => {
  try {
    const data = await PurchaseOrder.find().sort({ createdAt: -1 });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
