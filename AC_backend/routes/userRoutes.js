// backend/routes/userRoutes.js

import express from 'express';
import { getAllUsers, getSalesReps } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// 🔹 Public: Fetch all users (for Lead Owner dropdowns etc.)
router.get('/', getAllUsers);

// 🔐 Protected: Fetch only sales reps (for signup / admin use)
router.get('/sales-reps', protect, getSalesReps);

// ✅ Default export required by server.js (no crash now!)
export default router;
