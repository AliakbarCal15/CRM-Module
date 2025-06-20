import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TaskForm = ({ onSubmit, taskToEdit = null }) => {
  const [formData, setFormData] = useState({
    ownerName: '',
    subject: '',
    dueDate: '',
    contact: '',
    account: '',
    status: 'Deferred',
    priority: 'Medium',
    reminder: false,
    repeat: 'None',
    description: '',
    assignedTo: '',
    tags: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        ...taskToEdit,
        dueDate: taskToEdit.dueDate ? taskToEdit.dueDate.split('T')[0] : '',
        tags: Array.isArray(taskToEdit.tags) ? taskToEdit.tags.join(', ') : '',
      });
    }
  }, [taskToEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.ownerName.trim() || !formData.subject.trim() || !formData.dueDate) {
      alert('Please fill in all required fields: Owner Name, Subject, Due Date');
      return;
    }

    try {
      setIsSubmitting(true);
      const finalData = {
        ...formData,
        tags: formData.tags
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0),
      };
      await onSubmit(finalData);

      if (!taskToEdit) {
        setFormData({
          ownerName: '',
          subject: '',
          dueDate: '',
          contact: '',
          account: '',
          status: 'Not Started',
          priority: 'Medium',
          reminder: false,
          repeat: 'None',
          description: '',
          assignedTo: '',
          tags: '',
        });
      }

      navigate('/tasks');
    } catch (err) {
      console.error('Error creating/updating task:', err);
      alert('Failed to save task. Please check the input data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'ownerName', label: 'Owner Name' },
          { name: 'subject', label: 'Subject' },
          { name: 'dueDate', label: 'Due Date', type: 'date' },
          { name: 'contact', label: 'Contact' },
          { name: 'account', label: 'Account' },
          { name: 'assignedTo', label: 'Assigned To' },
          { name: 'tags', label: 'Tags (comma separated)' },
        ].map(({ name, label, type = 'text' }) => (
          <div key={name}>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
              id={name}
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        ))}

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            {['Not Started', 'In Progress', 'Completed', 'Deferred', 'Waiting for input'].map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            {['High', 'Medium', 'Low'].map((priority) => (
              <option key={priority} value={priority}>{priority}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="repeat" className="block text-sm font-medium text-gray-700 mb-1">Repeat</label>
          <select
            id="repeat"
            name="repeat"
            value={formData.repeat}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            {['None', 'Daily', 'Weekly', 'Monthly', 'Yearly'].map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center mt-6">
          <input
            id="reminder"
            type="checkbox"
            name="reminder"
            checked={formData.reminder}
            onChange={handleChange}
            className="mr-2"
          />
          <label htmlFor="reminder" className="text-sm font-medium text-gray-700">Set Reminder</label>
        </div>

        <div className="md:col-span-2 lg:col-span-3">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      

      <div className="mt-6 flex justify-end gap-4">
        <button
          type="button"
          onClick={() => navigate('/tasks')}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : taskToEdit ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm; // 
