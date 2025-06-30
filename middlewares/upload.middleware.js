// middlewares/upload.middleware.js
import multer from 'multer';

const storage = multer.memoryStorage(); // ← importante para usar .buffer
const upload = multer({ storage });

export default upload;
