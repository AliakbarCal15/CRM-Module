// Updated: LeadDetailsPage.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowLeftIcon, PencilIcon } from '@heroicons/react/24/solid';

const LeadDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lead, setLead] = useState(null);
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState('');
  const [file, setFile] = useState(null);
  const [invitedMeeting, setInvitedMeeting] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // 🔁 Fetch Lead
  useEffect(() => {
    const fetchLead = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/leads/${id}`);
        setLead(res.data);
        setNote(res.data.notes || '');
        setInvitedMeeting(localStorage.getItem(`invited-${id}`) === 'true');
      } catch (err) {
        console.error('❌ Failed to fetch lead:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLead();
  }, [id]);

  // 🔁 Fetch Calls
  useEffect(() => {
    const fetchCalls = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/calls/${id}`);
        setCalls(res.data);
      } catch (err) {
        console.error('❌ Failed to fetch calls:', err);
      }
    };

    fetchCalls();
  }, [id]);

  // 📝 Save Notes
  const handleNoteSave = async () => {
    try {
      await axios.put(`http://localhost:5000/api/leads/${id}`, { notes: note });
      alert('✅ Notes updated');
    } catch (err) {
      alert('❌ Failed to save note');
    }
  };

  // 📎 Upload PDF
  const handleUpload = async () => {
    if (!file) return alert('Choose a PDF file');
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post(`http://localhost:5000/api/leads/upload/${id}`, formData);
      alert('✅ Uploaded');
    } catch (err) {
      alert('❌ Upload failed');
    }
  };

  // 🖋️ Edit Handler
  const handleEdit = () => {
    navigate(`/leads/edit/${id}`);
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!lead) return <div className="p-6 text-red-500">Lead not found</div>;

  const fullName = `${lead.firstName} ${lead.lastName}`;
  const fullAddress = [lead.street, lead.city, lead.state, lead.zipCode, lead.country].filter(Boolean).join(', ');
  const openActivities = calls.filter(c => c.formType === 'Schedule');
  const closedActivities = calls.filter(c => c.formType === 'Log');

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white rounded shadow space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Lead Details</h2>
        <button onClick={() => navigate('/leads')} className="text-blue-600 flex items-center gap-1">
          <ArrowLeftIcon className="w-5 h-5" /> Back
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
        <p><strong>Owner:</strong> {lead.leadOwnerName || 'N/A'}</p>
        <p><strong>Name:</strong> {fullName}</p>
        <p><strong>Email:</strong> <a href={`mailto:${lead.email}`} className="text-blue-600">{lead.email}</a></p>
        <p><strong>Phone:</strong> {lead.phone}</p>
        <p><strong>Company:</strong> {lead.companyName}</p>
        <p><strong>Address:</strong> {fullAddress}</p>
        <p><strong>Twitter:</strong> <a href={`https://twitter.com/${lead.twitter}`} target="_blank" rel="noreferrer" className="text-blue-600">@{lead.twitter}</a></p>
        <p><strong>Facebook:</strong> <a href={lead.facebook || '#'} target="_blank" rel="noreferrer" className="text-blue-600">Visit</a></p>
        <p><strong>Title:</strong> {lead.title || 'N/A'}</p>
        <p><strong>Secondary Email:</strong> {lead.secondaryEmail || 'N/A'}</p>
        <p><strong>Fax:</strong> {lead.fax || 'N/A'}</p>
        <p><strong>Industry:</strong> {lead.industry || 'N/A'}</p>
        <p><strong>Rating:</strong> {lead.rating || 'N/A'}</p>
      </div>

      {/* Description Section */}
      <div>
        <p><strong>Description:</strong> {lead.description || 'N/A'}</p>
      </div>

      {/* 🖊️ Edit Button */}
      <div className="flex justify-end">
        <button onClick={handleEdit} className="flex items-center text-yellow-600 hover:text-yellow-700">
          <PencilIcon className="w-5 h-5 mr-1" />
          Edit
        </button>
      </div>

      {/* 📝 Notes */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Notes</h3>
        <textarea value={note} onChange={e => setNote(e.target.value)} className="w-full p-2 border rounded" rows={4} />
        <button onClick={handleNoteSave} className="mt-2 bg-blue-600 text-white px-4 py-1 rounded">Save Notes</button>
      </div>

      {/* 📎 Attachment */}
      {/* 📎 Upload + View PDF */}
<div>
  <h3 className="text-lg font-semibold mb-2">Upload Attachment (PDF Only)</h3>

  <input
    type="file"
    accept="application/pdf"
    onChange={(e) => setFile(e.target.files[0])}
    className="mb-2"
  />
  
  <div className="flex items-center gap-3">
    <button
      onClick={async () => {
        if (!file) return alert('⚠️ Please select a PDF first.');

        const formData = new FormData();
        formData.append('file', file);

        try {
          await axios.post(`http://localhost:5000/api/leads/upload/${id}`, formData);
          alert('✅ File uploaded successfully!');
          setFile(null);
          // Refresh lead to get updated attachment
          const res = await axios.get(`http://localhost:5000/api/leads/${id}`);
          setLead(res.data);
        } catch (err) {
          console.error('❌ Upload Error:', err);
          alert('Upload failed. Please try again.');
        }
      }}
      className="bg-green-600 text-white px-4 py-1 rounded"
    >
      Upload
    </button>

    {/* 🔗 View Uploaded PDF */}
    {lead.attachments && (
      <a
        href={`https://docs.google.com/gview?url=http://localhost:5000/uploads/${lead.attachments}&embedded=true`}
        target="_blank"
        rel="noreferrer"
        className="text-blue-600 underline text-sm"
      >
        View Uploaded Document
      </a>
    )}
  </div>
</div>


      {/* 🛒 Products Placeholder */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Products (Coming Soon)</h3>
        <p className="text-sm text-gray-500">Inventory connection pending. This will auto-sync with inventory products.</p>
      </div>

      {/* 📞 Activities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Open Activities</h3>
          {openActivities.length === 0 ? (
            <p className="text-sm text-gray-500">No open activities</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {openActivities.map((act, i) => (
                <li key={i} className="border p-2 rounded bg-gray-50">
                  📅 <strong>{act.callStartTime?.slice(0, 10)}</strong><br />
                  🔹 <em>{act.callPurpose}</em>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Closed Activities</h3>
          {closedActivities.length === 0 ? (
            <p className="text-sm text-gray-500">No closed activities</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {closedActivities.map((act, i) => (
                <li key={i} className="border p-2 rounded bg-gray-50">
                  🗓️ <strong>{act.callStartTime?.slice(0, 10)}</strong><br />
                  🧾 <em>{act.callPurpose}</em><br />
                  ✅ Outcome: {act.outcome}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* 🎯 Invited Meeting */}
      <div className="flex items-center gap-4 mt-4">
        <label className="font-semibold">Invited Meeting:</label>
        <input
          type="checkbox"
          checked={invitedMeeting}
          onChange={e => {
            setInvitedMeeting(e.target.checked);
            localStorage.setItem(`invited-${id}`, e.target.checked);
          }}
        />
        <button className="ml-4 bg-gray-300 text-sm px-3 py-1 rounded">📎 Upload Meet Recording</button>
      </div>
    </div>
  );
};

export default LeadDetailsPage;