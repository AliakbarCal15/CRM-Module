// src/pages/TaskPage.jsx
import React, { useState, useEffect } from 'react';
import TaskForm from '../Components/TaskForm';
import TaskList from '../Components/TaskList';
import TaskDetails from '../Components/TaskDetails';
import axios from 'axios';

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskToEdit, setTaskToEdit] = useState(null);

  useEffect(() => {
    const shouldAutoClick = localStorage.getItem('autoCreateTask');
  if (shouldAutoClick === 'true') {
    const btn = document.getElementById('create-task-button');
    if (btn) btn.click();
    localStorage.removeItem('autoCreateTask');
  }
    // Fetch tasks when the component mounts
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks', err);
    }
  };

  const handleCreate = () => {
    setTaskToEdit(null);
    setShowForm(true);
    setSelectedTask(null);
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (taskToEdit) {
        await axios.put(`http://localhost:5000/api/tasks/${taskToEdit._id}`, taskData);
      } else {
        await axios.post('http://localhost:5000/api/tasks', taskData);
      }
      fetchTasks();
      setShowForm(false);
      setTaskToEdit(null);
    } catch (err) {
      console.error('Error saving task', err);
      alert('Failed to save task. Please check the input.');
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`);
      fetchTasks();
      setSelectedTask(null);
    } catch (err) {
      console.error('Error deleting task', err);
    }
  };

  const handleEdit = (task) => {
    setTaskToEdit(task);
    setShowForm(true);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Tasks</h1>
        {!showForm && (
          <button
            id="create-task-button"
            onClick={handleCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create Task
          </button>
        )}
      </div>

      {showForm && (
        <TaskForm
          onSubmit={handleSaveTask}
          taskToEdit={taskToEdit}
          onCancel={() => {
            setShowForm(false);
            setTaskToEdit(null);
          }}
        />
      )}

      <TaskList
        tasks={tasks}
        onSelect={setSelectedTask}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {selectedTask && (
        <div className="mt-6">
          <TaskDetails task={selectedTask} />
        </div>
      )}
    </div>
  );
};

export default TaskPage;
