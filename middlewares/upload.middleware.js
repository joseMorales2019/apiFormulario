// middlewares/upload.middleware.js
import multer from 'multer';

const storage = multer.memoryStorage(); // Para acceder a req.file.buffer
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Límite de 5 MB opcional
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(xlsx|xls)$/)) {
      return cb(new Error('Solo se permiten archivos Excel (.xlsx, .xls)'));
    }
    cb(null, true);
  }
});

export default upload;
