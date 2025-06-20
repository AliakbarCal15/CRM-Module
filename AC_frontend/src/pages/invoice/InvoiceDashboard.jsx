// src/pages/InvoiceDashboard.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate , Link} from 'react-router-dom';
import axios from 'axios';
import { Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

// const navigate = useNavigate();

const InvoiceDashboard = () => {
  const [invoices, setInvoices] = useState([]);
  const [isDark, setIsDark] = useState(false);
  const navigate = useNavigate();

  // 🔁 Fetch invoice data from backend
  const fetchInvoices = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/invoices');

      setInvoices(res.data);
    } catch (err) {
      console.error('❌ Error fetching invoices:', err.message);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // 🧠 KPI CALCULATIONS
  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter(inv => inv.paymentStatus === 'Paid');
  const overdueInvoices = invoices.filter(inv => inv.paymentStatus === 'Overdue');
  const draftInvoices = invoices.filter(inv => inv.paymentStatus === 'Draft');
  const totalRevenue = paidInvoices.reduce((sum, i) => sum + i.totalAmount, 0);

  // 🧮 Pie Chart Data
  const pieChartData = {
    labels: ['Paid', 'Overdue', 'Draft'],
    datasets: [
      {
        data: [paidInvoices.length, overdueInvoices.length, draftInvoices.length],
        backgroundColor: ['#2c5f6f', '#fc5185', '#f6c90e'],
        borderWidth: 1,
      },
    ],
  };

  // 📈 Line Chart: Revenue by Month
  const monthlyRevenue = {};
  paidInvoices.forEach(inv => {
    const date = new Date(inv.invoiceDate);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    monthlyRevenue[key] = (monthlyRevenue[key] || 0) + inv.totalAmount;
  });

  const lineChartData = {
    labels: Object.keys(monthlyRevenue),
    datasets: [
      {
        label: 'Revenue ₹',
        data: Object.values(monthlyRevenue),
        borderColor: '#2c5f6f',
        fill: false,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: isDark ? '#fff' : '#000' },
      },
    },
    scales: {
      x: { ticks: { color: isDark ? '#fff' : '#000' } },
      y: { ticks: { color: isDark ? '#fff' : '#000' } },
    },
  };

  const card = (title, value) => (
    <div className="p-4 bg-white shadow rounded text-center border" style={{ borderColor: '#2c5f6f' }}>
      <h3 className="text-lg font-semibold text-[#2c5f6f]">{title}</h3>
      <p className="text-2xl font-bold mt-1">
        {typeof value === 'number' ? `₹${value.toLocaleString('en-IN')}` : value}
      </p>
    </div>
  );

  return (
    <div className={isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'} style={{ minHeight: '100vh', padding: '1.5rem' }}>
      <div className="flex justify-between items-center mb-6">
  <h1 className="text-2xl font-bold" style={{ color: '#2c5f6f' }}>
    Invoice & Billing Dashboard
  </h1>

  <div className="flex items-center gap-4">
    <button
      onClick={() => navigate('/invoices/create')}
      className="px-4 py-2 rounded text-white shadow-md"
      style={{ backgroundColor: '#2c5f6f' }}
    >
      ➕ Create Invoice
    </button>
    <button
      onClick={() => setIsDark(!isDark)}
      className="px-4 py-2 rounded text-white"
      style={{ backgroundColor: '#2c5f6f' }}
    >
      {isDark ? 'Switch to Light' : 'Switch to Dark'}
    </button>
  </div>
</div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {card('Total Invoices', totalInvoices)}
        {card('Paid Invoices', paidInvoices.length)}
        {card('Overdue Invoices', overdueInvoices.length)}
        {card('Drafts', draftInvoices.length)}
        {card('Total Revenue', totalRevenue)}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2 text-center" style={{ color: '#2c5f6f' }}>Invoice Status Distribution</h2>
          <Pie data={pieChartData} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2 text-center" style={{ color: '#2c5f6f' }}>Monthly Revenue Trend</h2>
          <Line data={lineChartData} options={lineChartOptions} />
        </div>
      </div>
      <div className="flex justify-end mt-4">
  <Link to="/invoices/all">
    <button className="bg-[#2c5f6f] text-white px-4 py-2 rounded shadow hover:bg-[#244c58] transition">
      📄 View All Invoices
    </button>
  </Link>
</div>

    </div>
  );
};

export default InvoiceDashboard;
