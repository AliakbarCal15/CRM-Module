// backend/controllers/userController.js
import User from '../models/User.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'firstName lastName _id');
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err.message);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};
