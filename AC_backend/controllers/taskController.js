import Task from '../models/taskModel.js';

// ✅ Allowed Task Status Options
const allowedStatuses = [
  'Not Started',
  'In Progress',
  'Completed',
  'Deferred',
  'Waiting for input',
];

// ✅ Create Task
export const createTask = async (req, res) => {
  try {
    let { status } = req.body;

    // Normalize and validate
    status = status?.trim() || 'Deferred';

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Allowed: ${allowedStatuses.join(', ')}`,
      });
    }

    const task = new Task({ ...req.body, status });
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(400).json({ message: 'Error creating task', error: error.message });
  }
};

// ✅ Get All Tasks (sorted by due date)
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ dueDate: 1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
};

// ✅ Get Task by ID
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching task', error: error.message });
  }
};

// ✅ Update Task
export const updateTask = async (req, res) => {
  try {
    let { status } = req.body;

    if (status) {
      status = status.trim();
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: `Invalid status. Allowed: ${allowedStatuses.join(', ')}`,
        });
      }
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { ...req.body, status },
      { new: true }
    );

    if (!updatedTask) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: 'Error updating task', error: error.message });
  }
};

// ✅ Delete Task
export const deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
};
