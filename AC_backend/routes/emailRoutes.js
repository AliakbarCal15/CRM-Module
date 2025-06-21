// routes/emailRoutes.js
import express from 'express';
import { sendQuotationEmail } from '../controllers/emailController.js';


const router = express.Router();

router.post('/send-email/:id', sendQuotationEmail);

export default router;
