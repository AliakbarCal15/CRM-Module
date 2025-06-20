import express from 'express';
import { sendQuotationEmail } from '../controllers/emailController.js';

const router = express.Router();

router.post('/send-quotation', sendQuotationEmail);

export default router;
