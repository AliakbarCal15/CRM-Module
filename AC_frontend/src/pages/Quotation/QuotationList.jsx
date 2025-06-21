import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const QuotationList = () => {
  const [quotations, setQuotations] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  const fetchQuotations = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/quotations', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setQuotations(data);
      setFiltered(data);
    } catch (err) {
      console.error('Failed to load quotations:', err);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  useEffect(() => {
    let temp = [...quotations];

    if (statusFilter !== 'All') {
      temp = temp.filter(q => q.status === statusFilter);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      temp = temp.filter(q =>
        q.customer?.name?.toLowerCase().includes(term) ||
        q.quotationId?.toLowerCase().includes(term)
      );
    }

    setFiltered(temp);
  }, [statusFilter, searchTerm, quotations]);

  const statusOptions = ['All', 'Draft', 'Sent', 'Accepted', 'Declined', 'Expired'];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Quotations</h2>
        <div className="flex gap-2">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => navigate('/quotations/create')}
          >
            + Create Quotation
          </button>
          <button className="bg-gray-300 px-4 py-2 rounded">Export</button>
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          {statusOptions.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search by customer or ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded w-64"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Quotation ID</th>
              <th className="p-2 border">Customer</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4">No quotations found.</td>
              </tr>
            ) : (
              filtered.map((q) => (
                <tr
                  key={q._id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/quotations/${q._id}`)}
                >
                  <td className="p-2 border">{q.quotationId}</td>
                  <td className="p-2 border">{q.customer?.name}</td>
                  <td className="p-2 border">{new Date(q.createdAt).toLocaleDateString()}</td>
                  <td className="p-2 border">{q.status}</td>
                  <td className="p-2 border">₹ {q.totals?.grandTotal}</td>
                  <td className="p-2 border">
                    <div className="flex gap-2">
                      <button
                        className="text-blue-600 underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/quotations/${q._id}`);
                        }}
                      >
                        View
                      </button>
                      <button
                        className="text-green-600 underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/quotations/edit/${q._id}`);
                        }}
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuotationList;
