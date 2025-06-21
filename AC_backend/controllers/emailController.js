import nodemailer from 'nodemailer';
import { generateQuotationPDF } from '../utils/pdfGenerator.js';
import Quotation from '../models/Quotation.js';

export const sendQuotationEmail = async (req, res) => {
  try {
    const { id: quotationId } = req.params;

    const quotation = await Quotation.findById(quotationId)
      .populate('customer', 'name email billingAddress')
      .populate('salesRep', 'name');

    if (!quotation) {
      return res.status(404).json({ error: 'Quotation not found' });
    }

    if (!quotation.customer?.email) {
      return res.status(400).json({ error: 'Customer email is missing' });
    }

    // Generate PDF
    const pdfBuffer = await generateQuotationPDF(quotation);

    // Configure email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: quotation.customer.email,
      subject: `Quotation #${quotation.quotationId || quotation._id}`,
      text: `Dear ${quotation.customer.name || 'Customer'},\n\nPlease find attached your quotation.\n\nBest regards,\n${quotation.salesRep?.name || 'Sales Team'}`,
      attachments: [
        {
          filename: `Quotation-${quotation.quotationId || quotation._id}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Quotation email sent successfully' });
  } catch (error) {
    console.error('Email send failed:', error);
    res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
};
