import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import TaskForm from '../Components/TaskForm';
import { FiEdit2, FiArrowLeft } from 'react-icons/fi';

const TaskDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/tasks/${id}`);
        setTask(res.data);
      } catch (err) {
        console.error('Failed to load task:', err.response?.data || err.message);
        setError('Task not found or could not be loaded.');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const handleUpdate = async (updatedData) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${id}`, updatedData);
      setTask(updatedData);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating task:', err);
      alert('Failed to update task.');
    }
  };

  if (loading) return <p className="text-center mt-6">Loading task details...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 relative">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => navigate('/tasks')}
          className="text-gray-600 hover:text-blue-600 flex items-center gap-2"
          title="Back to Tasks"
        >
          <FiArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Back</span>
        </button>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-gray-500 hover:text-blue-600"
            title="Edit Task"
          >
            <FiEdit2 className="w-5 h-5" />
          </button>
        )}
      </div>

      {isEditing ? (
        <TaskForm taskToEdit={task} onSubmit={handleUpdate} />
      ) : (
        task && (
          <div className="bg-white shadow rounded p-6">
            <h2 className="text-2xl font-bold mb-4">Task Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800">
              <p><strong>Owner Name:</strong> {task.ownerName}</p>
              <p><strong>Subject:</strong> {task.subject}</p>
              <p><strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
              <p><strong>Contact:</strong> {task.contact || 'N/A'}</p>
              <p><strong>Account:</strong> {task.account || 'N/A'}</p>
              <p><strong>Status:</strong> {task.status}</p>
              <p><strong>Priority:</strong> {task.priority}</p>
              <p><strong>Reminder:</strong> {task.reminder ? 'Yes' : 'No'}</p>
              <p><strong>Repeat:</strong> {task.repeat}</p>
              <p><strong>Assigned To:</strong> {task.assignedTo || 'N/A'}</p>
              <p className="sm:col-span-2"><strong>Description:</strong> {task.description || '—'}</p>
              
              {task.tags?.length > 0 && (
                <p className="sm:col-span-2">
                  <strong>Tags:</strong>{' '}
                  {task.tags.map((tag, index) => (
                    <span key={index} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2">
                      {tag}
                    </span>
                  ))}
                </p>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default TaskDetailsPage;
