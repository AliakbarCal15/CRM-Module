import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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

const API_URL = 'http://localhost:5000/api/accounts'; // 🔁 Replace if needed

const AccountsPage = () => {
  const [metrics, setMetrics] = useState(null);
  const [salesData, setSalesData] = useState(null);
  const [purchaseData, setPurchaseData] = useState(null);
  const [isDark, setIsDark] = useState(false);
  const navigate = useNavigate(); // ADDED
  // Fetch dashboard metrics
  const fetchMetrics = async () => {
    const res = await axios.get(`${API_URL}/metrics`);
    setMetrics(res.data);
  };

  const fetchSalesAnalytics = async () => {
    const res = await axios.get(`${API_URL}/sales-analytics`);
    setSalesData(res.data);
  };

  const fetchPurchaseAnalytics = async () => {
    const res = await axios.get(`${API_URL}/purchase-analytics`);
    setPurchaseData(res.data);
  };

  useEffect(() => {
    fetchMetrics();
    fetchSalesAnalytics();
    fetchPurchaseAnalytics();
  }, []);

  if (!metrics || !salesData || !purchaseData) return <p>Loading...</p>;

  // 🧮 Pie Chart Data
  const pieChartData = {
    labels: ['Total Sales', 'Total Purchase', 'Pending Tax', 'Revenue', 'Net Profit'],
    datasets: [
      {
        data: [
          metrics.totalSales,
          metrics.totalPurchase,
          metrics.pendingTax,
          metrics.totalRevenue,
          metrics.netProfit
        ],
        backgroundColor: ['#2c5f6f', '#5eaaa8', '#f6c90e', '#fc5185', '#6a2c70'],
        borderWidth: 1,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: isDark ? '#fff' : '#000',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: isDark ? '#fff' : '#000',
        },
      },
      y: {
        ticks: {
          color: isDark ? '#fff' : '#000',
        },
      },
    },
  };

  const card = (title, value) => (
    <div className="p-4 bg-white shadow-md rounded text-center border" style={{ borderColor: '#2c5f6f' }}>
      <h3 className="text-lg font-semibold text-[#2c5f6f]">{title}</h3>
      <p className="text-2xl font-bold mt-1">₹{Number(value).toLocaleString('en-IN')}</p>
    </div>
  );

  return (
    <div className={isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'} style={{ minHeight: '100vh', padding: '1.5rem' }}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#2c5f6f' }}>Accounting Dashboard</h1>
        <button
          onClick={() => setIsDark(!isDark)}
          className="px-4 py-2 rounded text-white"
          style={{ backgroundColor: '#2c5f6f' }}
        >
          {isDark ? 'Switch to Light' : 'Switch to Dark'}
        </button>
      </div>

      {/* <div className="flex justify-between items-center mb-6">
  <h1 className="text-2xl font-bold" style={{ color: '#2c5f6f' }}>Accounting Dashboard</h1>
  <button
    onClick={() => setIsDark(!isDark)}
    className="px-4 py-2 rounded text-white"
    style={{ backgroundColor: '#2c5f6f' }}
  >
    {isDark ? 'Switch to Light' : 'Switch to Dark'}
  </button>
</div> */}

{/* 🔘 ADD NEW SALE / PURCHASE BUTTONS */}
<div className="flex gap-4 mb-6">
  <button
    onClick={() => navigate('/sales')}
    className="bg-[#2c5f6f] text-white px-4 py-2 rounded shadow hover:bg-[#24505c]"
  >
    ➕ Add Sale
  </button>
  <button
    onClick={() => navigate('/purchase')}
    className="bg-[#2c5f6f] text-white px-4 py-2 rounded shadow hover:bg-[#24505c]"
  >
    ➕ Add Purchase
  </button>
</div>


      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {card('Total Sales', metrics.totalSales)}
        {card('Total Purchase', metrics.totalPurchase)}
        {card('Pending Tax', metrics.pendingTax)}
        {card('Total Revenue', metrics.totalRevenue)}
        {card('Net Profit', metrics.netProfit)}
        {card('Transactions', metrics.transactions)}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-2 text-center" style={{ color: '#2c5f6f' }}>Overall Summary</h2>
          <Pie data={pieChartData} />
        </div>

        <div className="bg-white p-4 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-2 text-center" style={{ color: '#2c5f6f' }}>Sales Analytics</h2>
          <Line
            data={{
              labels: salesData.labels,
              datasets: [
                {
                  label: 'Sales',
                  data: salesData.data,
                  fill: false,
                  borderColor: '#2c5f6f',
                },
              ],
            }}
            options={lineChartOptions}
          />
        </div>

        <div className="bg-white p-4 rounded shadow-md md:col-span-2">
          <h2 className="text-xl font-semibold mb-2 text-center" style={{ color: '#2c5f6f' }}>Purchase Analytics</h2>
          <Line
            data={{
              labels: purchaseData.labels,
              datasets: [
                {
                  label: 'Purchase',
                  data: purchaseData.data,
                  fill: false,
                  borderColor: '#fc5185',
                },
              ],
            }}
            options={lineChartOptions}
          />
        </div>
      </div>
    </div>
  );
};

export default AccountsPage;
