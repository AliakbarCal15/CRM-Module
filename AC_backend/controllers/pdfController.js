import { generateQuotationPDF } from '../utils/pdfGenerator.js';
import Quotation from '../models/Quotation.js';

/**
 * @desc    Generate and send quotation PDF as download
 * @route   GET /api/quotations/:quotationId/download-pdf
 * @access  Private
 */
export const downloadQuotationPDF = async (req, res) => {
  try {
    const { quotationId } = req.params;

    const quotation = await Quotation.findById(quotationId).populate('salesRep');
    if (!quotation) {
      return res.status(404).json({ error: 'Quotation not found' });
    }

    const pdfBuffer = await generateQuotationPDF(quotation);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=Quotation-${quotation.quotationId}.pdf`,
      'Content-Length': pdfBuffer.length,
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF', details: error.message });
  }
};
