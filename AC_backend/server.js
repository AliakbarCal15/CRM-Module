// server.js 🔥 Final Merged Version
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path'; // ✅ Partner: for file operations (fallback/optional)

import connectDB from './config/db.js';

import leadRoutes from './routes/leadRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js'; // ✅ Aliakbar: For file upload
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import accountRoutes from './routes/accountRoutes.js';
import purchaseRoutes from './routes/purchaseRoutes.js';
import salesRoutes from './routes/salesRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import callRoutes from './routes/callRoutes.js';
import userRoutes from './routes/userRoutes.js';

import quotationRoutes from './routes/quotationRoutes.js'; // ✅ Partner: Quotations
import emailRoutes from './routes/emailRoutes.js';         // ✅ Partner: Email Sendgrid etc

dotenv.config();
connectDB();

const app = express();

// 🔧 Middleware
app.use(cors());
app.use(express.json());

// 🔗 API Routes
app.use('/api/leads', leadRoutes);
app.use('/api/leads', uploadRoutes); // ✅ Aliakbar: upload PDF to lead
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/calls', callRoutes);
app.use('/api/users', userRoutes);
app.use('/api/quotations', quotationRoutes); // ✅ Partner
app.use('/api/email', emailRoutes);          // ✅ Partner

// 📂 Serve uploaded static files (PDFs, Docs, Images)
app.use('/uploads', express.static('uploads')); // ✅ Needed for PDF viewer

// 🔚 404 Fallback
app.use((req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

// 🚀 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
