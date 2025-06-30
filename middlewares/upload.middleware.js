import multer from 'multer';

// Usamos almacenamiento en memoria, pero puedes cambiar a disco si lo deseas
const storage = multer.memoryStorage();

const upload = multer({ storage });

export default upload;
