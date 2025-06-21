import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const formatCurrency = (amount) =>
  `₹${Number(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  })}`;

export const generateQuotationPDF = async (quotation) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const buffers = [];

    doc.on('data', (chunk) => buffers.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', (err) => reject(err));

    const contentWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;

    // ==== Header: Logo or Company Name ====
    const logoPath = path.join(__dirname, '../assets/logo.png');
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, doc.page.margins.left, doc.y, { width: 100 });
    } else {
      doc.fontSize(20).text('Goanny Technology', doc.page.margins.left, doc.y);
    }

    doc
      .fontSize(18)
      .font('Helvetica-Bold')
      .text(`Quotation #${quotation.quotationId || 'N/A'}`, {
        align: 'right',
      });

    doc.moveDown(2);

    // ==== Customer Information ====
    doc
      .fontSize(12)
      .fillColor('#007ACC')
      .font('Helvetica-Bold')
      .text('Customer Information', { underline: true });

    doc
      .fillColor('black')
      .fontSize(10)
      .font('Helvetica')
      .text(`Customer Name: ${quotation.customer?.name || '-'}`)
      .text(`Email: ${quotation.customer?.email || '-'}`)
      .text(`Billing Address: ${quotation.customer?.billingAddress || '-'}`);

    doc.moveDown(1.5);

    // ==== Quotation Details ====
    doc
      .fillColor('#007ACC')
      .font('Helvetica-Bold')
      .fontSize(12)
      .text('Quotation Details', { underline: true });

    doc
      .fillColor('black')
      .fontSize(10)
      .font('Helvetica')
      .text(`Status: ${quotation.status || '-'}`)
      .text(`Date: ${new Date(quotation.createdAt).toLocaleDateString() || '-'}`)
      .text(`Valid Until: ${new Date(quotation.validUntil).toLocaleDateString() || '-'}`);

    doc.moveDown(1.5);

    // ==== Items Header ====
    doc.fillColor('#007ACC').font('Helvetica-Bold').fontSize(12).text('Items', { underline: true });
    doc.moveDown(0.5);

    const tableTop = doc.y;
    const rowHeight = 22;
    const colWidths = [180, 60, 80, 60, 100];
    const headers = ['Product', 'Qty', 'Price', 'Tax', 'Subtotal'];

    let x = doc.page.margins.left;
    headers.forEach((header, i) => {
      doc
        .rect(x, tableTop, colWidths[i], rowHeight)
        .fill('#F0F0F0')
        .fillColor('black')
        .font('Helvetica-Bold')
        .fontSize(10)
        .text(header, x + 5, tableTop + 6);
      x += colWidths[i];
    });

    let y = tableTop + rowHeight;

    // ==== Item Rows ====
    quotation.items?.forEach((item) => {
      if (y + rowHeight > doc.page.height - doc.page.margins.bottom - 100) {
        doc.addPage();
        y = doc.page.margins.top;

        x = doc.page.margins.left;
        headers.forEach((header, i) => {
          doc
            .rect(x, y, colWidths[i], rowHeight)
            .fill('#F0F0F0')
            .fillColor('black')
            .font('Helvetica-Bold')
            .fontSize(10)
            .text(header, x + 5, y + 6);
          x += colWidths[i];
        });
        y += rowHeight;
      }

      x = doc.page.margins.left;
      const row = [
        item.productName || item.name || '-',
        `${item.quantity || 0}`,
        formatCurrency(item.unitPrice || 0),
        `${item.tax || 0}%`,
        formatCurrency(item.subtotal || 0),
      ];

      row.forEach((val, i) => {
        doc
          .rect(x, y, colWidths[i], rowHeight)
          .stroke()
          .fillColor('black')
          .font('Helvetica')
          .fontSize(10)
          .text(val, x + 5, y + 6);
        x += colWidths[i];
      });
      y += rowHeight;
    });

    doc.y = y + 20;

    // ==== Totals Section ====
    doc.fillColor('#007ACC').font('Helvetica-Bold').text('Totals', { underline: true });
    doc.moveDown(0.5);
    doc.fillColor('black').font('Helvetica').fontSize(11)
      .text(`Total Before Tax: ${formatCurrency(quotation.totals?.totalBeforeTax || 0)}`)
      .text(`Tax Amount: ${formatCurrency(quotation.totals?.taxAmount || 0)}`)
      .text(`Grand Total: ${formatCurrency(quotation.totals?.grandTotal || 0)}`);

    doc.moveDown(2);

    // ==== Terms & Notes ====
    const boxY = doc.y;
    const boxHeight = 85;
    doc
      .rect(doc.page.margins.left, boxY, contentWidth, boxHeight)
      .fill('#FAFAFA')
      .stroke()
      .fillColor('#007ACC')
      .font('Helvetica-Bold')
      .fontSize(12)
      .text('Terms & Notes', doc.page.margins.left + 10, boxY + 10)
      .fillColor('black')
      .font('Helvetica')
      .fontSize(10)
      .text(`Payment: ${quotation.terms?.payment || '-'}`, doc.page.margins.left + 10, boxY + 30)
      .text(`Delivery: ${quotation.terms?.delivery || '-'}`, doc.page.margins.left + 10, boxY + 45)
      .text(`Notes: ${quotation.terms?.additionalNotes || '-'}`, doc.page.margins.left + 10, boxY + 60);

    doc.y = boxY + boxHeight + 30;

    // ==== Signature ====
    doc
      .font('Helvetica')
      .fontSize(12)
      .text('Authorized Signature: ______________________', doc.page.margins.left, doc.y);

    // ==== Page Footer ====
    const range = doc.bufferedPageRange();
    for (let i = range.start; i < range.start + range.count; i++) {
      doc.switchToPage(i);
      doc
        .fontSize(10)
        .fillColor('gray')
        .font('Helvetica')
        .text(`Page ${i + 1} of ${range.count}`, 0, doc.page.height - 40, {
          align: 'center',
        });
    }

    doc.end();
  });
};
