import React, { useState, useEffect } from 'react';
import { EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import { FiEye, FiEdit2, FiTrash2 } from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { EllipsisVerticalIcon } from '@heroicons/react/24/solid';

const LeadsTable = ({ leads, onEdit, onDelete, onViewDetails }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortedLeads, setSortedLeads] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredLead, setHoveredLead] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [showScheduleForm, setShowScheduleForm] = useState(null);
  const [showLogForm, setShowLogForm] = useState(null);

  const initialForm = {
    callType: '',
    callOwner: '',
    subject: '',
    callStartTime: '',
    reminder: false,
    callPurpose: '',
    callAgenda: '',
    outcome: '', // Only used for Log
  };

  const [formData, setFormData] = useState(initialForm);

  const leadsPerPage = 5;
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);

  // Formatters
  const capitalizeWords = (str) => str.replace(/\b\w/g, (char) => char.toUpperCase());
  const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  // 🔁 Initialize toast
  useEffect(() => {
    // toast.configure();
  }, []);

  useEffect(() => {
    let updatedLeads = [...leads];
    if (sortColumn) {
      updatedLeads.sort((a, b) => {
        const aVal = a[sortColumn]?.toString().toLowerCase() || '';
        const bVal = b[sortColumn]?.toString().toLowerCase() || '';
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    setSortedLeads(updatedLeads);
    setCurrentPage(1);
  }, [leads, sortColumn, sortDirection]);

  const handleSort = (column) => {
    let direction = 'asc';
    if (sortColumn === column && sortDirection === 'asc') {
      direction = 'desc';
    }
    setSortColumn(column);
    setSortDirection(direction);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleMouseEnter = (event, lead) => {
    const rect = event.target.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + 10,
      y: rect.bottom + window.scrollY + 5,
    });
    setHoveredLead(lead);
  };

  const handleMouseLeave = () => {
    setHoveredLead(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleCallSubmit = async (e, type, leadId) => {
    e.preventDefault();

    if (!formData.callType || !formData.callOwner || !formData.subject) {
      toast.error('Please fill in required fields.');
      return;
    }

    try {
      const payload = {
        ...formData,
        formType: type,
        leadId,
      };

      if (type === 'Schedule') delete payload.outcome;

      await axios.post('http://localhost:5000/api/calls', payload);

      toast.success(`${type} Call saved!`);

      // 🔁 Reset and auto-close after small delay
      setTimeout(() => {
        setFormData(initialForm);
        setShowScheduleForm(null);
        setShowLogForm(null);
      }, 1500);
    } catch (error) {
      console.error('❌ Call Submit Error:', error);
      toast.error('Failed to save call.');
    }
  };

  // Click handler for name to open lead detail page
  const handleNameClick = (lead) => {
    onViewDetails(lead);
  };

  const filteredLeads = sortedLeads.filter((lead) => {
    const query = searchQuery.toLowerCase();
    const fullName = `${lead.firstName || ''} ${lead.lastName || ''}`.toLowerCase();
    return (
      fullName.includes(query) ||
      lead.email?.toLowerCase().includes(query) ||
      lead.phone?.toLowerCase().includes(query) ||
      lead.companyName?.toLowerCase().includes(query)
    );
  });

  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);
  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);

  const handleDelete = () => {
    if (leadToDelete) {
      onDelete(leadToDelete._id);
      setShowDeleteConfirm(false);
      setLeadToDelete(null);
    }
  };

  const renderSortArrow = (column) => {
    if (sortColumn !== column) return null;
    return sortDirection === 'asc' ? ' ▲' : ' ▼';
  };

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <div className="p-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search by name, email, phone, or company"
          className="px-4 py-2 border border-gray-300 rounded w-full sm:w-1/3"
        />
      </div>

      {filteredLeads.length === 0 ? (
        <p className="p-4 text-gray-600 text-center">No leads found.</p>
      ) : (
        <table className="min-w-full table-auto relative">
          <thead className="bg-gray-100">
            <tr>
              <th
                className="px-4 py-2 border cursor-pointer select-none"
                onClick={() => handleSort('firstName')}
              >
                Name{renderSortArrow('firstName')}
              </th>
              <th
                className="px-4 py-2 border cursor-pointer select-none"
                onClick={() => handleSort('email')}
              >
                Email{renderSortArrow('email')}
              </th>
              <th className="px-4 py-2 border">Phone</th>
              <th
                className="px-4 py-2 border cursor-pointer select-none"
                onClick={() => handleSort('status')}
              >
                Status{renderSortArrow('status')}
              </th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentLeads.map((lead) => {
              const fullName = capitalizeWords(`${lead.firstName || ''} ${lead.lastName || ''}`.trim());
              const email = lead.email ? capitalizeFirstLetter(lead.email) : 'N/A';
              return (
                <tr key={lead._id}>
                  <td
                    className="px-4 py-2 border relative"
                    onMouseEnter={(e) => handleMouseEnter(e, lead)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <span 
                      className="text-blue-600 cursor-pointer font-medium hover:underline" 
                      onClick={() => handleNameClick(lead)}
                    >
                      {fullName}
                    </span>
                  </td>
                  <td className="px-4 py-2 border">{email}</td>
                  <td className="px-4 py-2 border">{lead.phone || 'N/A'}</td>
                  <td className="px-4 py-2 border capitalize text-gray-700">{lead.status || 'N/A'}</td>
                  <td className="px-4 py-2 border text-center space-x-3 relative group">
                    <button 
                      onClick={() => onViewDetails(lead)} 
                      className="hover:text-blue-600"
                      aria-label="View lead"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => onEdit(lead)} 
                      className="hover:text-yellow-600"
                      aria-label="Edit lead"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => {
                        setLeadToDelete(lead);
                        setShowDeleteConfirm(true);
                      }}
                      className="hover:text-red-600"
                      aria-label="Delete lead"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>

                    {/* Shortcut Button */}
                    <div className="inline-block relative">
                      <button
                        className="text-gray-600 hover:text-[#2c5f6f] p-1 rounded"
                        onClick={(e) => {
                          e.stopPropagation();
                          const rect = e.currentTarget.getBoundingClientRect();
                          setTooltipPosition({
                            x: rect.left,
                            y: rect.bottom + window.scrollY,
                          });
                          setDropdownOpen((prev) => (prev === lead._id ? null : lead._id));
                        }}
                      >
                        <EllipsisVerticalIcon className="h-5 w-5" />
                      </button>

                      {dropdownOpen === lead._id && (
                        <div
                          className="fixed w-52 bg-white shadow-lg border rounded-md z-50 p-2 space-y-2"
                          style={{
                            top: tooltipPosition.y + 6,
                            left: tooltipPosition.x - 190 < 10 ? 10 : tooltipPosition.x - 190, // stay in viewport
                          }}
                        >
                          <button
                            onClick={() => window.open('https://zoom.us', '_blank')}
                            className="w-full text-left hover:bg-gray-100 px-2 py-1 rounded"
                          >
                            🔗 Zoom Meeting
                          </button>
                          <button
                            onClick={() => window.open('https://meet.google.com', '_blank')}
                            className="w-full text-left hover:bg-gray-100 px-2 py-1 rounded"
                          >
                            🔗 Google Meet
                          </button>
                          <div className="border-t my-1" />
                          <div>
                            <span className="block px-2 text-xs font-semibold text-gray-600">📞 Create Call</span>
                            <button
                              onClick={() => {
                                setShowScheduleForm(lead._id);
                                setDropdownOpen(null);
                              }}
                              className="w-full text-left hover:bg-gray-100 px-3 py-1 text-sm"
                            >
                              Schedule Call
                            </button>
                            <button
                              onClick={() => {
                                setShowLogForm(lead._id);
                                setDropdownOpen(null);
                              }}
                              className="w-full text-left hover:bg-gray-100 px-3 py-1 text-sm"
                            >
                              Log Call
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* Tooltip Box (floating outside of table cells) */}
      {hoveredLead && (
        <div
          className="fixed bg-white border shadow-lg rounded-md px-4 py-2 text-sm z-50"
          style={{
            top: tooltipPosition.y,
            left: tooltipPosition.x,
            minWidth: '250px',
            whiteSpace: 'pre-line',
            maxWidth: '90vw',
            pointerEvents: 'none',
          }}
        >
          <p><strong>Name:</strong> {capitalizeWords(`${hoveredLead.firstName} ${hoveredLead.lastName}`)}</p>
          <p><strong>Title:</strong> {hoveredLead.title || 'N/A'}</p>
          <p><strong>Email:</strong> {hoveredLead.email || 'N/A'}</p>
          <p><strong>Company:</strong> {hoveredLead.companyName || 'N/A'}</p>
          <p><strong>Lead Source:</strong> {hoveredLead.leadSource || 'N/A'}</p>
        </div>
      )}

      {(showScheduleForm || showLogForm) && (
        <div className="mt-4 p-4 border bg-gray-50 rounded">
          <h3 className="font-bold mb-2">
            {showScheduleForm ? '📅 Schedule Call' : '📋 Log Call'}
          </h3>
          <form
            className="space-y-3 text-sm"
            onSubmit={(e) =>
              handleCallSubmit(
                e,
                showScheduleForm ? 'Schedule' : 'Log',
                showScheduleForm || showLogForm
              )
            }
          >
            <input
              name="callType"
              placeholder="Call Type"
              value={formData.callType}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
            <input
              name="callOwner"
              placeholder="Call Owner"
              value={formData.callOwner}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
            <input
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="datetime-local"
              name="callStartTime"
              value={formData.callStartTime}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            <label className="block">
              <input
                type="checkbox"
                name="reminder"
                checked={formData.reminder}
                onChange={handleInputChange}
                className="mr-2"
              />
              Reminder
            </label>
            <input
              name="callPurpose"
              placeholder="Call Purpose"
              value={formData.callPurpose}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            <textarea
              name="callAgenda"
              placeholder="Call Agenda"
              value={formData.callAgenda}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            {showLogForm && (
              <input
                name="outcome"
                placeholder="Call Outcome"
                value={formData.outcome}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            )}
            <button type="submit" className="bg-[#2c5f6f] text-white px-4 py-2 rounded">
              {showScheduleForm ? 'Save Schedule' : 'Log Call'}
            </button>
          </form>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center p-4">
        <button
          onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
          className={`px-4 py-2 rounded text-gray-700 ${
            currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-300 hover:bg-gray-400'
          }`}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
          className={`px-4 py-2 rounded text-gray-700 ${
            currentPage === totalPages ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-300 hover:bg-gray-400'
          }`}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 sm:w-1/3">
            <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
            <p>Are you sure you want to delete this lead?</p>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsTable;