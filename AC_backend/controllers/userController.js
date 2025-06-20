// backend/controllers/userController.js
import User from '../models/User.js';

/**
 * @desc    Get all users (used for dropdowns, etc.)
 * @route   GET /api/users
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'firstName lastName _id');
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err.message);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

/**
 * @desc    Get users with role 'salesrep' (for sales-specific features)
 * @route   GET /api/users/sales-reps
 */
export const getSalesReps = async (req, res) => {
  try {
    const salesReps = await User.find({ role: 'salesrep' }).select('-password');
    res.status(200).json(salesReps);
  } catch (error) {
    console.error('Error fetching sales reps:', error);
    res.status(500).json({ message: 'Server error fetching sales reps' });
  }
};
