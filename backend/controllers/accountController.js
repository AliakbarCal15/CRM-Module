import SalesOrder from '../models/salesOrder.js';
import PurchaseOrder from '../models/purchaseOrder.js';

// 🟦 Dashboard Summary Metrics
export const getDashboardMetrics = async (req, res) => {
  try {
    const sales = await SalesOrder.find();
    const purchases = await PurchaseOrder.find();

    const totalSales = sales.reduce((sum, s) => sum + (s.grandTotal || 0), 0);
    const totalPurchase = purchases.reduce((sum, p) => sum + (p.grandTotal || 0), 0);
    const pendingTax = purchases.reduce((sum, p) => {
      return sum + (p.taxSummary?.includes('GST') ? 0.18 * (p.subtotal || 0) : 0);
    }, 0);
    const totalRevenue = totalSales; // Or calculate from subtotal + tax if needed
    const netProfit = totalSales - totalPurchase;
    const transactions = purchases.length;

    res.json({
      totalSales,
      totalPurchase,
      pendingTax,
      totalRevenue,
      netProfit,
      transactions,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📈 Sales Trend Line Chart
export const getSalesAnalytics = async (req, res) => {
  try {
    const sales = await SalesOrder.find().sort({ salesOrderDate: 1 });

    const grouped = {};
    sales.forEach(({ salesOrderDate, grandTotal }) => {
      const day = new Date(salesOrderDate).toISOString().split('T')[0];
      grouped[day] = (grouped[day] || 0) + (grandTotal || 0);
    });

    const labels = Object.keys(grouped);
    const data = Object.values(grouped);

    res.json({ labels, data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📉 Purchase Trend Line Chart
export const getPurchaseAnalytics = async (req, res) => {
  try {
    const purchases = await PurchaseOrder.find().sort({ purchaseDate: 1 });

    const grouped = {};
    purchases.forEach(({ purchaseDate, grandTotal }) => {
      const day = new Date(purchaseDate).toISOString().split('T')[0];
      grouped[day] = (grouped[day] || 0) + (grandTotal || 0);
    });

    const labels = Object.keys(grouped);
    const data = Object.values(grouped);

    res.json({ labels, data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
