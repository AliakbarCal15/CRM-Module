// src/Components/TaskList.jsx
import { Pencil, Trash2, Save, X } from 'lucide-react';
import { useState } from 'react';

const TaskList = ({ tasks, onEdit, onDelete, onSelect }) => {
  const [editTaskId, setEditTaskId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleEditInit = (task) => {
    setEditTaskId(task._id);
    setEditForm({ ...task });
  };

  const handleSave = () => {
    onEdit(editForm);
    setEditTaskId(null);
    setEditForm({});
  };

  const handleCancel = () => {
    setEditTaskId(null);
    setEditForm({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  if (!tasks.length) {
    return <p className="text-gray-500 px-4">No tasks found.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {tasks.map((task) => (
        <div key={task._id} className="bg-white rounded-2xl shadow p-4">
          {editTaskId === task._id ? (
            <>
              <input
                name="subject"
                value={editForm.subject}
                onChange={handleChange}
                className="w-full mb-2 border p-1 rounded"
              />
              <input
                name="dueDate"
                type="date"
                value={editForm.dueDate?.slice(0, 10)}
                onChange={handleChange}
                className="w-full mb-2 border p-1 rounded"
              />
              <input
                name="ownerName"
                value={editForm.ownerName}
                onChange={handleChange}
                className="w-full mb-2 border p-1 rounded"
              />
              <select
                name="status"
                value={editForm.status}
                onChange={handleChange}
                className="w-full mb-2 border p-1 rounded"
              >
                <option>Not Started</option>
                <option>In Progress</option>
                <option>Completed</option>
                <option>Deferred</option>
                <option>Waiting on someone else</option>
              </select>
              <div className="flex justify-end space-x-2 mt-2">
                <button onClick={handleSave} className="text-green-600">
                  <Save />
                </button>
                <button onClick={handleCancel} className="text-red-600">
                  <X />
                </button>
              </div>
            </>
          ) : (
            <>
              <h2
                className="font-bold text-lg mb-1 cursor-pointer"
                onClick={() => onSelect(task)}
              >
                {task.subject}
              </h2>
              <p className="text-sm mb-1"><strong>Owner:</strong> {task.ownerName}</p>
              <p className="text-sm mb-1"><strong>Due:</strong> {task.dueDate?.slice(0, 10)}</p>
              <p className="text-sm mb-1"><strong>Status:</strong> {task.status}</p>
              <p className="text-sm text-gray-600">{task.description}</p>
              <div className="flex justify-end space-x-2 mt-3">
                <button onClick={() => handleEditInit(task)} className="text-blue-600">
                  <Pencil />
                </button>
                <button onClick={() => onDelete(task._id)} className="text-red-600">
                  <Trash2 />
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default TaskList;
