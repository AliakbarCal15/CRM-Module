import React from 'react';
import TaskForm from '../Components/TaskForm';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateTaskPage = () => {
  const navigate = useNavigate();

  const handleCreate = async (taskData) => {
    try {
      await axios.post('http://localhost:5000/api/tasks', taskData);
      navigate('/tasks'); // Redirect after successful creation
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task.');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Create Task
      </h1>
      <TaskForm onSubmit={handleCreate} />
    </div>
  );
};

export default CreateTaskPage;
