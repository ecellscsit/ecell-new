import multer from "multer";

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) =>
    /image\/(jpeg|png|webp|gif|svg\+xml)/.test(file.mimetype)
      ? cb(null, true)
      : cb(new Error("Images only")),
});
