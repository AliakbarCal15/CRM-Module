// middleware/upload.js
import multer from 'multer';
import path from 'path';

//
// === 🟢 LEAD PDF UPLOAD (Aliakbar's Code Preserved) ===
//

const leadStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/leads');
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const leadFileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed for leads.'));
  }
};

export const uploadLeadAttachment = multer({
  storage: leadStorage,
  fileFilter: leadFileFilter,
});

//
// === 🔵 QUOTATION MULTI-FILE UPLOAD (Partner’s Logic Merged) ===
//

const quotationStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/quotations');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

const quotationFileFilter = (req, file, cb) => {
  const allowed = ['.pdf', '.doc', '.docx', '.jpg', '.png'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type for quotation.'));
  }
};

export const uploadQuotationAttachment = multer({
  storage: quotationStorage,
  fileFilter: quotationFileFilter,
});
