// InvoiceTable.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiEye, FiEdit2, FiTrash2, FiPaperclip } from 'react-icons/fi';
import toast from 'react-hot-toast';

const InvoiceTable = () => {
  const [invoices, setInvoices] = useState([]);
  const navigate = useNavigate();

  const fetchInvoices = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/invoices');
      setInvoices(res.data);
    } catch (err) {
      console.error('Error fetching invoices:', err);
      toast.error('Failed to load invoices');
    }
  };

  const deleteInvoice = async (id) => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/invoices/${id}`);
      toast.success('Invoice deleted');
      fetchInvoices();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete invoice');
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen text-black">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#2c5f6f]">All Invoices</h2>
        <Link to="/invoice/create">
          <button className="bg-[#2c5f6f] text-white px-4 py-2 rounded shadow hover:bg-[#244c58] transition">
            + New Invoice
          </button>
        </Link>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full table-auto text-sm text-left">
          <thead className="bg-[#2c5f6f] text-white">
            <tr>
              <th className="px-4 py-2">Invoice #</th>
              <th className="px-4 py-2">Customer</th>
              <th className="px-4 py-2">Amount (₹)</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No invoices found.
                </td>
              </tr>
            ) : (
              invoices.map((inv) => (
                <tr
                  key={inv._id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-2 font-medium">{inv.invoiceNumber || 'N/A'}</td>
                  <td className="px-4 py-2">{inv.customerName || 'N/A'}</td>
                  <td className="px-4 py-2">₹{inv.grandTotal?.toLocaleString('en-IN') || '0'}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      inv.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700'
                      : inv.paymentStatus === 'Overdue' ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {inv.paymentStatus || 'Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {new Date(inv.invoiceDate).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-4 py-2 space-x-2 flex">
                    <button
                      onClick={() => navigate(`/invoices/${inv._id}`)}
                      className="text-blue-600 hover:text-blue-800"
                      title="View Invoice"
                    >
                      <FiEye />
                    </button>
                    <button
                      onClick={() => navigate(`/invoice/edit/${inv._id}`)}
                      className="text-yellow-600 hover:text-yellow-800"
                      title="Edit Invoice"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => deleteInvoice(inv._id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete Invoice"
                    >
                      <FiTrash2 />
                    </button>
                    <button
                      onClick={() => alert('Attachment logic placeholder')}
                      className="text-gray-600 hover:text-gray-800"
                      title="Attach PDF"
                    >
                      <FiPaperclip />
                    </button>
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

export default InvoiceTable;
