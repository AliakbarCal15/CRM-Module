// backend/server/scripts/seedAccountingData.js

import mongoose from 'mongoose';
import fs from 'fs';
import csv from 'csv-parser';
import dotenv from 'dotenv';
import path from 'path';

console.log('👉 Seeder script started'); // ✅ STEP 1: Script started

// Load env variables
dotenv.config();

// Import models
import salesOrder from '../models/salesOrder.js';
import purchaseOrder from '../models/purchaseOrder.js';
// Old model names (fallback way)
import SalesOrder from '../models/sale.js';
import PurchaseOrder from '../models/purchase.js';

// MongoDB connection string from .env or fallback
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/crm_system';

const filePath = path.resolve('accounting_dashboard_data.csv');

// ✅ STEP 2: Confirm file exists
if (!fs.existsSync(filePath)) {
  console.error('❌ CSV file NOT found at path:', filePath);
  process.exit(1); // Stop execution
}

console.log('📁 CSV file found at:', filePath);

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected for seeding');
  } catch (err) {
    console.error('❌ DB connection failed:', err.message);
    process.exit(1);
  }
};

// Basic product to attach per row
const sampleProduct = {
  productName: 'Default Product',
  sku: 'DEF-001',
  quantity: 1,
  unitPrice: 1000,
  taxPercent: 18,
  total: 1180,
};

// Parse CSV and insert data
const seedData = async () => {
  const salesData = [];
  const purchaseData = [];

  console.log('📄 Starting to read CSV...'); // ✅ STEP 3

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      console.log('🔍 Row read:', row); // ✅ Each row

      const {
        customerName,
        vendorName,
        date,
        paymentMethod,
        source,
        assignedTo,
      } = row;

      if (customerName) {
        salesData.push({
          customerName,
          customerEmail: `${customerName.toLowerCase().replace(' ', '')}@mail.com`,
          customerPhone: '9876543210',
          billingAddress: 'Billing St, Mumbai',
          shippingAddress: 'Shipping Ln, Mumbai',
          salesOrderDate: new Date(date),
          products: [sampleProduct],
          modeOfPayment: paymentMethod || 'UPI',
          paymentTerms: 'Net 30',
          paymentStatus: 'Paid',
          assignedSalesperson: assignedTo || 'Default Sales',
          notes: 'Imported from CSV',
          discount: 100,
          taxSummary: '18% GST',
          subtotal: 1000,
          grandTotal: 1180,
          status: 'Confirmed',
          followUpReminder: new Date(),
          sourceOfLead: source || 'CSV Import',
        });
      }

      if (vendorName) {
        purchaseData.push({
          vendorName,
          vendorEmail: `${vendorName.toLowerCase().replace(' ', '')}@supplier.com`,
          vendorPhone: '9123456780',
          vendorAddress: 'Vendor Market, Delhi',
          purchaseDate: new Date(date),
          products: [sampleProduct],
          modeOfPayment: paymentMethod || 'Bank Transfer',
          paymentTerms: 'On Delivery',
          paymentStatus: 'Pending',
          procurementOfficer: assignedTo || 'Default Buyer',
          notes: 'Imported from CSV',
          discount: 50,
          taxSummary: '18% GST',
          subtotal: 1000,
          grandTotal: 1180,
          status: 'Confirmed',
          deliveryPartner: 'BlueDart',
          followUpReminder: new Date(),
        });
      }
    })
    .on('error', (err) => {
      console.error('❌ CSV Read Error:', err.message); // ✅ STEP 4
    })
    .on('end', async () => {
      console.log('📦 Finished reading CSV, preparing DB inserts...'); // ✅ STEP 5

      try {
        const salesResult = await SalesOrder.insertMany(salesData);
        const purchaseResult = await PurchaseOrder.insertMany(purchaseData);

        console.log(`✅ Inserted ${salesResult.length} sales and ${purchaseResult.length} purchases`); // ✅ STEP 6
        mongoose.connection.close();
      } catch (err) {
        console.error('❌ Error during insert:', err.message);
        mongoose.connection.close();
      }

      console.log('✅ Script reached end successfully'); // ✅ STEP 7
    });
};

// Start everything
const runSeeder = async () => {
  await connectDB();
  await seedData();
};

runSeeder();
