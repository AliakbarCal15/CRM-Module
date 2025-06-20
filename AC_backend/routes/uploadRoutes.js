import express from 'express';
import { uploadPDF } from '../controllers/uploadController.js';

const router = express.Router();

// Route: POST /api/leads/upload
router.post('/upload', uploadPDF);

export default router;
