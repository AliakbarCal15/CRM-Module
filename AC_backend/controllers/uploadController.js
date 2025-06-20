import multer from 'multer';
import path from 'path';
import fs from 'fs';

// 📁 Ensure uploads directory exists
const uploadDir = path.resolve('uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// 🎯 Multer config: accept only PDF
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  const isPDF = file.mimetype === 'application/pdf';
  if (isPDF) cb(null, true);
  else cb(new Error('Only PDF files are allowed!'), false);
};

const upload = multer({ storage, fileFilter });

// 🚀 POST handler
export const uploadPDF = [
  upload.single('file'),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'PDF file upload failed.' });
    }

    const filePath = `/uploads/${req.file.filename}`;
    res.status(200).json({ filePath });
  }
];
