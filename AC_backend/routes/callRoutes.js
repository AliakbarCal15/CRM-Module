// backend/routes/callRoutes.js

import express from 'express';
import { createCall, getCallsByLead } from '../controllers/callController.js';

const router = express.Router();

// POST /api/calls — create a schedule/log call
router.post('/', createCall);

// GET /api/calls/:leadId — get all calls linked to one lead
router.get('/:leadId', getCallsByLead);

export default router;
