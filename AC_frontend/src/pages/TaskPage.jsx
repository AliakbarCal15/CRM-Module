import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  DragDropContext,
  Droppable,
  Draggable,
} from '@hello-pangea/dnd';

const statuses = [
  'Not Started',
  'In Progress',
  'Completed',
  'Deferred',
  'Waiting for input',
];

const TaskPage = () => {
  const [tasksByStatus, setTasksByStatus] = useState({});
  const [selectedTasks, setSelectedTasks] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tasks');
      setTasksByStatus(groupTasksByStatus(res.data));
    } catch (err) {
      console.error('Error fetching tasks', err);
    }
  };

  const groupTasksByStatus = (tasks) => {
    const grouped = {};
    statuses.forEach((status) => (grouped[status] = []));
    tasks.forEach((task) => {
      const status = statuses.includes(task.status) ? task.status : 'Not Started';
      grouped[status].push(task);
    });
    return grouped;
  };

  const handleCreate = () => {
    navigate('/tasks/create');
  };

  const handleSelectTask = (taskId) => {
    setSelectedTasks((prev) => {
      const newSet = new Set(prev);
      newSet.has(taskId) ? newSet.delete(taskId) : newSet.add(taskId);
      return newSet;
    });
  };

  const handleMassDelete = async () => {
    try {
      await Promise.all(
        Array.from(selectedTasks).map((taskId) =>
          axios.delete(`http://localhost:5000/api/tasks/${taskId}`)
        )
      );
      setSelectedTasks(new Set());
      fetchTasks();
    } catch (err) {
      console.error('Mass delete failed:', err);
    }
  };

  const handleMassUpdate = async (newStatus) => {
    try {
      await Promise.all(
        Array.from(selectedTasks).map((taskId) =>
          axios.put(`http://localhost:5000/api/tasks/${taskId}`, { status: newStatus })
        )
      );
      setSelectedTasks(new Set());
      fetchTasks();
    } catch (err) {
      console.error('Mass update failed:', err);
    }
  };

  const handleDragEnd = async ({ source, destination, draggableId }) => {
    if (!destination) return;
    const startStatus = source.droppableId;
    const endStatus = destination.droppableId;

    if (startStatus === endStatus) {
      const newList = Array.from(tasksByStatus[startStatus]);
      const [movedTask] = newList.splice(source.index, 1);
      newList.splice(destination.index, 0, movedTask);
      setTasksByStatus((prev) => ({ ...prev, [startStatus]: newList }));
    } else {
      const startList = Array.from(tasksByStatus[startStatus]);
      const [movedTask] = startList.splice(source.index, 1);
      movedTask.status = endStatus;
      const endList = Array.from(tasksByStatus[endStatus]);
      endList.splice(destination.index, 0, movedTask);
      setTasksByStatus((prev) => ({
        ...prev,
        [startStatus]: startList,
        [endStatus]: endList,
      }));
      try {
        await axios.put(`http://localhost:5000/api/tasks/${draggableId}`, { status: endStatus });
      } catch (err) {
        console.error('Error updating task status', err);
        fetchTasks();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <button onClick={handleCreate} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Create Task
        </button>
      </div>

      {selectedTasks.size > 0 && (
        <div className="flex gap-4 items-center mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded">
          <span>{selectedTasks.size} selected</span>
          <button
            onClick={handleMassDelete}
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          >
            Delete
          </button>
          <select
            onChange={(e) => handleMassUpdate(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1"
            defaultValue=""
          >
            <option value="" disabled>Update Status</option>
            {statuses.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {statuses.map((status) => (
            <Droppable droppableId={status} key={status}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-white rounded shadow-sm p-3"
                  style={{
                    backgroundColor: snapshot.isDraggingOver ? '#e6f7ff' : 'white',
                    minHeight: '500px',
                  }}
                >
                  <h3 className="font-semibold text-lg mb-3">{status}</h3>
                  {(tasksByStatus[status] || []).map((task, index) => (
                    <Draggable key={task._id} draggableId={task._id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`bg-gray-100 rounded p-3 mb-3 shadow-sm cursor-pointer border-l-4 ${
                            snapshot.isDragging ? 'bg-blue-100' : 'hover:bg-blue-50'
                          }`}
                          onClick={() => navigate(`/tasks/${task._id}`)}
                        >
                          <div className="flex items-start justify-between">
                            <input
                              type="checkbox"
                              checked={selectedTasks.has(task._id)}
                              onChange={() => handleSelectTask(task._id)}
                              onClick={(e) => e.stopPropagation()}
                              className="mr-2 mt-1"
                            />
                            <div className="flex-grow">
                              <div className="font-medium">{task.subject}</div>
                              <div className="text-sm text-gray-600">
                                Due: {new Date(task.dueDate).toLocaleDateString()}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                Priority: {task.priority || 'Normal'}
                              </div>
                              <div className="text-xs text-gray-500">
                                Assigned to: {task.assignedTo || 'Unassigned'}
                              </div>
                              {task.tags && task.tags.length > 0 && (
                                <div className="flex flex-wrap mt-1 gap-1">
                                  {task.tags.map((tag, idx) => (
                                    <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default TaskPage;
