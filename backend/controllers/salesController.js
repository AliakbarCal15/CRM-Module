import SalesOrder from '../models/salesOrder.js';

export const createSale = async (req, res) => {
  try {
    const count = await SalesOrder.countDocuments();
    const salesOrderNumber = `SO-${String(count + 1).padStart(5, '0')}`;

    const order = new SalesOrder({ ...req.body, salesOrderNumber });
    const saved = await order.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error creating sale:', err.message);
    res.status(500).json({ message: err.message });
  }
};

export const getAllSales = async (req, res) => {
  try {
    const data = await SalesOrder.find().sort({ createdAt: -1 });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
