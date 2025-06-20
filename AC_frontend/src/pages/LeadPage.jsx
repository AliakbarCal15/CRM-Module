import React, { useState } from 'react';
import Papa from 'papaparse';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LeadsTable from '../Components/LeadsTable';
import { FaFileCsv, FaDownload, FaUpload, FaPlus } from 'react-icons/fa';
import { HiOutlineDocumentDownload } from 'react-icons/hi';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Download helper
const downloadFile = (content, filename, mimeType = 'text/csv;charset=utf-8;') => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const LeadsPage = ({ leads, setLeads, onDeleteLead, onOpenForm }) => {
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const navigate = useNavigate();
  const leadsPerPage = 10;

  const filteredLeads = leads.filter((lead) =>
    statusFilter ? lead.status === statusFilter : true
  );

  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);
  const indexOfLastLead = currentPage * leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfLastLead - leadsPerPage, indexOfLastLead);

  const leadFields = [
    'firstName', 'lastName', 'email', 'phone', 'companyName',
    'status', 'leadSource', 'industry', 'annualRevenue',
    'numberOfEmployees', 'street', 'city', 'state', 'zipCode', 'country',
  ];

  const handleExportCSV = () => {
    setExporting(true);
    try {
      const headers = leadFields;
      const rows = filteredLeads.map((lead) =>
        leadFields.map((field) => (lead[field] != null ? String(lead[field]) : ''))
      );

      const csvContent = [
        headers.join(','),
        ...rows.map((row) =>
          row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')
        ),
      ].join('\n');

      downloadFile(csvContent, 'leads.csv');
    } catch (error) {
      alert('Failed to export CSV.');
      console.error(error);
    }
    setExporting(false);
  };

  const handleImportCSV = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        if (results.errors.length > 0) {
          alert(`CSV parsing error: ${results.errors.map((err) => err.message).join(', ')}`);
          setImporting(false);
          e.target.value = null;
          return;
        }

        const rows = results.data;
        const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'companyName'];
        const invalidRows = rows.filter((row) =>
          requiredFields.some((field) => !row[field] || row[field].trim() === '')
        );

        if (invalidRows.length > 0) {
          alert(
            `Import failed. ${invalidRows.length} row(s) missing required fields: ${requiredFields.join(', ')}`
          );
          setImporting(false);
          e.target.value = null;
          return;
        }

        try {
          const response = await axios.post(`${API_BASE_URL}/leads/import`, rows);
          const newlyAddedLeads = Array.isArray(response.data) ? response.data : [response.data];
          setLeads((prev) => [...prev, ...newlyAddedLeads]);
          alert('CSV imported successfully!');
        } catch (error) {
          console.error('Bulk CSV Import Error:', error);
          alert('Error importing leads in bulk.');
        } finally {
          setImporting(false);
          e.target.value = null;
        }
      },
    });
  };

  const handleDownloadTemplate = () => {
    const csv = leadFields.join(',') + '\n';
    downloadFile(csv, 'lead-template.csv');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Leads</h2>

      <div className="flex items-center flex-wrap gap-4 mb-4">
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="border rounded px-4 py-2 w-full sm:w-48"
          disabled={importing || exporting}
        >
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="converted">Interested</option>
          <option value="qualified">Proposal Shared</option>
          <option value="unqualified">Negotiation</option>
          <option value="unqualified">Converted</option>
          <option value="unqualified">Lost</option>
          <option value="unqualified">Duplicated</option>
          
        </select>

        <button
          onClick={() => onOpenForm(null)}
          className="cursor-pointer px-4 py-2 bg-[#174E63] text-white rounded flex items-center gap-2"
          disabled={importing || exporting}
        >
          <FaPlus /> Add New Lead
        </button>

        <button
          onClick={handleExportCSV}
          className={`cursor-pointer px-4 py-2 bg-green-600 text-white rounded flex items-center gap-2 ${
            exporting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={importing || exporting}
        >
          <FaFileCsv /> {exporting ? 'Exporting...' : 'Export CSV'}
        </button>

        <div className="relative">
          <label
            htmlFor="csvInput"
            className={`cursor-pointer px-4 py-2 bg-red-600 text-white rounded flex items-center gap-2 ${
              importing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <FaUpload /> {importing ? 'Importing...' : 'Import File'}
          </label>
          <input
            id="csvInput"
            type="file"
            accept=".csv"
            onChange={handleImportCSV}
            className="hidden"
            disabled={importing || exporting}
          />
        </div>

        <button
          onClick={handleDownloadTemplate}
          className="cursor-pointer px-4 py-2 bg-[#174E63] text-white rounded flex items-center gap-2"
          disabled={importing || exporting}
        >
          <HiOutlineDocumentDownload /> Download Template
        </button>
      </div>

      <LeadsTable
        leads={currentLeads}
        onEdit={onOpenForm}
        onDelete={onDeleteLead}
        onViewDetails={(lead) => navigate(`/leads/${lead._id}`)}
      />

      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              currentPage === i + 1
                ? 'bg-blue-600 text-white'
                : 'bg-white text-blue-600 border-blue-600'
            }`}
            disabled={importing || exporting}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LeadsPage;
