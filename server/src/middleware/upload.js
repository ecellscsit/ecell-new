import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const storage = multer.diskStorage({
  destination: 'uploads',
  filename: (req, file, cb) =>
    cb(null, crypto.randomBytes(8).toString('hex') + path.extname(file.originalname).toLowerCase()),
});
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) =>
    /image\/(jpeg|png|webp|gif|svg\+xml)/.test(file.mimetype) ? cb(null, true) : cb(new Error('Images only')),
});
