import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import leadRoutes from './routes/leadRoutes.js';
import authRoutes from './routes/authRoutes.js'; 
import taskRoutes from './routes/taskRoutes.js';
import accountRoutes from './routes/accountRoutes.js';
import purchaseRoutes from './routes/purchaseRoutes.js';
import salesRoutes from './routes/salesRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import callRoutes from './routes/callRoutes.js';
import userRoutes from './routes/userRoutes.js';
dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/accounts', accountRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/auth', authRoutes); 
app.use('/api/tasks', taskRoutes); 
app.use('/api/purchases', purchaseRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/calls', callRoutes);
app.use('/api/users', userRoutes);
app.use((req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
