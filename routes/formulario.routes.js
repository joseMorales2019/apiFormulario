import express from 'express';
import controlador from '../controllers/formulario.controller.js';
import upload from '../middlewares/upload.middleware.js';

const router = express.Router();

router.post('/', controlador.crearFormulario);
router.get('/', controlador.obtenerFormularios);
router.get('/:id', controlador.obtenerFormularioPorId);
router.put('/:id', controlador.actualizarFormulario);
router.delete('/:id', controlador.eliminarFormulario);

// 📥 Subida de archivo Excel
router.post('/upload', upload.single('archivo'), controlador.crearDesdeExcel);

export default router;
