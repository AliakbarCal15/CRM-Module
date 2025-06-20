import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import SummaryCard from '../Components/SummaryCard';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Chart from '../Components/Chart';

const BASE_URL = 'http://localhost:5000/api/leads';

const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({});
  const [metrics, setMetrics] = useState({});
  const [barData, setBarData] = useState({ labels: [], datasets: {} });
  const [retentionTrend, setRetentionTrend] = useState([]);
  const [winRateTrend, setWinRateTrend] = useState([]);
  const [viewMode, setViewMode] = useState('year');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const barChartRef = useRef(null);
  const exportRef = useRef(null);

  useEffect(() => {
    fetchLeads();
    fetchStats();
    fetchMetrics();
  }, []);

  useEffect(() => {
    if (viewMode === 'range') {
      if (!startDate || !endDate) return;
      fetchBarData(viewMode, startDate.toISOString(), endDate.toISOString());
    } else {
      fetchBarData(viewMode);
      setStartDate(null);
      setEndDate(null);
    }
  }, [viewMode, startDate, endDate]);

  const fetchLeads = async () => {
    try {
      const { data } = await axios.get(BASE_URL);
      setLeads(data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/stats`);
      const { totalLeads, ...statusCounts } = data;
      setStats(statusCounts);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchMetrics = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/metrics`);
      setMetrics(data);

      const retentionRate = parseFloat(data.customerRetentionRate) || 0;
      const winRate = parseFloat(data.leadWinRate) || 0;

      const retention = Array.from({ length: 8 }, (_, i) =>
        retentionRate + Math.sin(i) * 5
      ).map((val) => Number(val.toFixed(2)));

      const winRateArr = Array.from({ length: 8 }, (_, i) =>
        winRate + Math.cos(i) * 4
      ).map((val) => Number(val.toFixed(2)));

      setRetentionTrend(retention);
      setWinRateTrend(winRateArr);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const fetchBarData = async (type = 'year', startISO = null, endISO = null) => {
    try {
      let url = `${BASE_URL}/bar-stats?type=${type}`;
      if (type === 'range' && startISO && endISO) {
        url += `&start=${startISO}&end=${endISO}`;
      }
      const { data } = await axios.get(url);
      setBarData(data);
    } catch (error) {
      console.error('Error fetching bar data:', error);
    }
  };

  const handleExportChart = () => {
    try {
      const chartInstance = barChartRef.current?.chart || barChartRef.current;
      const base64Image = chartInstance?.toBase64Image?.();
      if (base64Image) {
        const link = document.createElement('a');
        link.href = base64Image;
        link.download = `leads-${viewMode}-chart.png`;
        link.click();
      } else {
        console.warn('Chart instance or image is not available');
      }
    } catch (err) {
      console.error('Chart export error:', err);
    }
  };

  const handleExportPDF = () => {
    const input = exportRef.current;
    if (!input) return;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`leads-dashboard-${viewMode}.pdf`);
    });
  };

  return (
    <div ref={exportRef} className="p-6">
      <h1 className="text-3xl font-bold mb-6">Welcome to Goanny Technology Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
        <SummaryCard
          title="Total Leads"
          value={leads.length}
          bgColor="bg-gray-100"
          textColor="text-gray-800"
        />
        <SummaryCard
          title="Converted Leads"
          value={stats.converted || 0}
          bgColor="bg-gray-100"
          textColor="text-gray-800"
        />

        {Object.entries(stats).map(([status, count]) => {
          if (status === 'converted') return null;
          return (
            <SummaryCard
              key={status}
              title={`${status.charAt(0).toUpperCase() + status.slice(1)} Leads`}
              value={count}
              bgColor="bg-gray-100"
              textColor="text-gray-800"
            />
          );
        })}

        <SummaryCard
          title="Customer Retention Rate"
          value={`${metrics.customerRetentionRate || 0}%`}
          bgColor="bg-gray-100"
          textColor="text-gray-800"
        />
        <SummaryCard
          title="Lead Win Rate"
          value={`${metrics.leadWinRate || 0}%`}
          bgColor="bg-gray-100"
          textColor="text-gray-800"
        />
      </div>

      <Chart
        key={viewMode}
        stats={stats}
        barData={barData}
        viewMode={viewMode}
        setViewMode={setViewMode}
        handleExportChart={handleExportChart}
        barChartRef={barChartRef}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        retentionData={retentionTrend}
        winRateData={winRateTrend}
      />

      <div className="mt-6 flex space-x-4">
        <button
          onClick={handleExportPDF}
          className="text-sm bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Export Dashboard PDF
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
