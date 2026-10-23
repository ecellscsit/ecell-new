import { Router } from 'express';
import { protect, adminOnly } from '../../middleware/auth.js';
import { upload } from '../../middleware/upload.js';

const r = Router();
// single image: field name "file"  ->  { url: "/uploads/abc.jpg" }
r.post('/', protect, adminOnly, upload.single('file'), (req, res) => res.status(201).json({ url: `/uploads/${req.file.filename}` }));
// many images: field name "files"
r.post('/many', protect, adminOnly, upload.array('files', 30), (req, res) =>
  res.status(201).json({ urls: req.files.map((f) => `/uploads/${f.filename}`) }));
export default r;
