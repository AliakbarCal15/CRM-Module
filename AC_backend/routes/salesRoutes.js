import express from 'express';
import { createSale, getAllSales } from '../controllers/salesController.js';

const router = express.Router();

router.post('/', createSale);
router.get('/', getAllSales);

export default router;
