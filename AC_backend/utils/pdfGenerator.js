import PDFDocument from 'pdfkit';
import { PassThrough } from 'stream';

/**
 * Formats a number into INR format (₹12,345.67)
 */
const formatCurrency = (amount) => {
  return `₹${Number(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * Generates a quotation PDF and returns it as a buffer.
 * @param {Object} quotation - Quotation data from the DB
 * @returns {Promise<Buffer>} - PDF file as buffer
 */
export const generateQuotationPDF = async (quotation) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const buffers = [];

    doc.on('data', (chunk) => buffers.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', (err) => reject(err));

    // Header
    doc.fontSize(20).text(`Quotation #${quotation.quotationId || 'N/A'}`, { align: 'center' }).moveDown();

    // Customer Info
    doc
      .fontSize(12)
      .text(`Customer Name: ${quotation.customer?.name || '-'}`)
      .text(`Email: ${quotation.customer?.email || '-'}`)
      .text(`Billing Address: ${quotation.customer?.billingAddress || '-'}`)
      .moveDown();

    // Quotation Info
    doc
      .text(`Status: ${quotation.status || '-'}`)
      .text(`Date: ${new Date(quotation.createdAt).toLocaleDateString() || '-'}`)
      .text(`Valid Until: ${new Date(quotation.validUntil).toLocaleDateString() || '-'}`)
      .moveDown();

    // Items Header
    doc.fontSize(14).text('Items', { underline: true }).moveDown();

    // Items List
    quotation.items?.forEach((item, index) => {
      doc
        .fontSize(12)
        .text(
          `${index + 1}. ${item.productName || item.name || 'Unnamed Item'} — Qty: ${
            item.quantity || 0
          } | Price: ${formatCurrency(item.unitPrice || 0)} | Tax: ${item.tax || 0}% | Subtotal: ${formatCurrency(item.subtotal || 0)}`
        );
    });

    doc.moveDown();

    // Totals
    doc
      .fontSize(12)
      .text(`Total Before Tax: ${formatCurrency(quotation.totals?.totalBeforeTax || 0)}`)
      .text(`Tax Amount: ${formatCurrency(quotation.totals?.taxAmount || 0)}`)
      .text(`Grand Total: ${formatCurrency(quotation.totals?.grandTotal || 0)}`)
      .moveDown();

    // Terms
    doc
      .fontSize(12)
      .text(`Payment Terms: ${quotation.terms?.payment || '-'}`)
      .text(`Delivery Terms: ${quotation.terms?.delivery || '-'}`)
      .text(`Notes: ${quotation.terms?.additionalNotes || '-'}`);

    doc.end();
  });
};
