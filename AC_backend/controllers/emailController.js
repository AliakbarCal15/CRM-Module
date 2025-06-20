import nodemailer from 'nodemailer';
import { generateQuotationPDF } from '../utils/pdfGenerator.js';
import Quotation from '../models/Quotation.js';

export const sendQuotationEmail = async (req, res) => {
  try {
    const { quotationId } = req.body;

    const quotation = await Quotation.findById(quotationId).populate('salesRep','name');
    if (!quotation) {
      return res.status(404).json({ error: 'Quotation not found' });
    }

    // Generate PDF
    const pdfBuffer = await generateQuotationPDF(quotation);

    // Configure transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or 'smtp.yourmail.com'
      auth: {
        user: process.env.EMAIL_USER, // put this in .env
        pass: process.env.EMAIL_PASS, // put this in .env
      },
    });

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: quotation.customer.email,
      subject: `Quotation #${quotation.quotationId}`,
      text: `Dear ${quotation.customer.name},\n\nPlease find attached your quotation.\n\nBest regards,\n${quotation.salesRep?.name || 'Your Company'}`,
      attachments: [
        {
          filename: `Quotation-${quotation.quotationId}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    });

    res.json({ message: 'Quotation email sent successfully' });
  } catch (error) {
    console.error('Email send failed:', error);
    res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
};
