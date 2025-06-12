import { useState, useEffect } from 'react';

const AddLeadForm = ({ onSubmit, leadToEdit, closeForm }) => {
  const [formData, setFormData] = useState({
    leadOwnerName: '',
    companyName: '',
    firstName: '',
    lastName: '',
    title: '',
    email: '',
    phone: '',
    fax: '',
    leadSource: '',
    status: '',
    industry: '',
    numberOfEmployees: '',
    annualRevenue: '',
    rating: '',
    teamId: '',
    secondaryEmail: '',
    twitter: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    description: '',
  });

  const [users, setUsers] = useState([]); // ✅ Make sure it's always an array

useEffect(() => {
  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/users');
      const data = await res.json();
      console.log("Fetched Users →", data); // 👀 DEBUG OUTPUT

      if (Array.isArray(data)) {
        // Normalize full name regardless of structure
        const cleaned = data.map(user => ({
          _id: user._id,
          firstName: user.firstName || user.name?.first || 'Unknown',
          lastName: user.lastName || user.name?.last || '',
        }));
        setUsers(cleaned);
      } else {
        console.warn('User data is not an array:', data);
        setUsers([]);
      }
    } catch (err) {
      console.error('Error loading users:', err);
      setUsers([]);
    }
  };

  fetchUsers();
}, []);


  useEffect(() => {
    if (leadToEdit) {
      setFormData((prev) => ({ ...prev, ...leadToEdit }));
    }
  }, [leadToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      closeForm();
    } catch (error) {
      console.error('Failed to submit lead:', error);
      alert('Error submitting lead. Please try again.');
    }
  };

  const statusOptions = ['New', 'Contacted', 'Converted', 'Qualified', 'Unqualified'];
  const ratingOptions = ['Hot', 'Warm', 'Cold'];

  return (
    <div className="p-4 bg-white border rounded shadow mb-8">
      <h2 className="text-xl font-semibold mb-6">
        {leadToEdit ? 'Edit Lead' : 'Add Lead'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div>
          <h3 className="text-blue-600 font-medium mb-2">Basic Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['companyName', 'firstName', 'lastName', 'title', 'email', 'phone'].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium mb-1">
                  {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </label>
                <input
                  type={field.toLowerCase().includes('email') ? 'email' : 'text'}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required={['firstName', 'companyName', 'email', 'phone'].includes(field)}
                />
              </div>
            ))}

            {/* ✅ Lead Owner dropdown */}
            <div>
  <label className="block text-sm font-medium mb-1">Lead Owner</label>
  <select
    name="leadOwnerName"
    value={formData.leadOwnerName}
    onChange={handleChange}
    className="w-full p-2 border border-gray-300 rounded"
    required
  >
    <option value="">Select Owner</option>
    {users.map((user) => (
      <option
        key={user._id}
        value={`${user.firstName} ${user.middleName || ''} ${user.lastName}`.trim()}
      >
        {user.firstName} {user.middleName || ''} {user.lastName}
      </option>
    ))}
  </select>
</div>

          </div>
        </div>

        {/* Lead Details */}
        <div>
          <h3 className="text-blue-600 font-medium mb-2">Lead Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['fax', 'leadSource', 'industry', 'numberOfEmployees', 'annualRevenue', 'teamId'].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium mb-1">
                  {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </label>
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Select Status</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status.toLowerCase()}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Rating</label>
              <select
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Select Rating</option>
                {ratingOptions.map((rating) => (
                  <option key={rating} value={rating.toLowerCase()}>
                    {rating}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-blue-600 font-medium mb-2">Contact Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['secondaryEmail', 'twitter', 'street', 'city', 'state', 'zipCode', 'country'].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium mb-1">
                  {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </label>
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div>
          <h3 className="text-blue-600 font-medium mb-2">Additional Info</h3>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded"
            rows={4}
            placeholder="Enter any additional notes..."
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={closeForm}
            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            {leadToEdit ? 'Update Lead' : 'Add Lead'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddLeadForm;
