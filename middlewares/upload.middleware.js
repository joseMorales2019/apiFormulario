// 📄 upload.middleware.js actualizado
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const isExcel = file.originalname.match(/\.(xlsx|xls)$/);
    const mimeValid = file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.mimetype === 'application/vnd.ms-excel';

    if (!isExcel || !mimeValid) {
      return cb(new Error('Solo se permiten archivos Excel (.xlsx o .xls)')); 
    }
    cb(null, true);
  }
});

export default upload;