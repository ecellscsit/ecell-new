import { Router } from "express";
import { protect, adminOnly } from "../../middleware/auth.js";
import { upload } from "../../middleware/upload.js";
import { uploadFile } from "../../config/supabase.js";

const r = Router();

// single image: field name "file"  ->  { url: "https://xxx.supabase.co/storage/v1/object/public/ecell/abc.jpg" }
r.post(
  "/",
  protect,
  adminOnly,
  upload.single("file"),
  async (req, res, next) => {
    try {
      res.status(201).json({ url: await uploadFile(req.file) });
    } catch (e) {
      next(e);
    }
  },
);

// many images: field name "files"
r.post(
  "/many",
  protect,
  adminOnly,
  upload.array("files", 30),
  async (req, res, next) => {
    try {
      const urls = await Promise.all(req.files.map(uploadFile));
      res.status(201).json({ urls });
    } catch (e) {
      next(e);
    }
  },
);

export default r;
