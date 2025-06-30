import express from 'express';
import {
  crearFormulario,
  obtenerFormularios,
  obtenerFormularioPorId,
  actualizarFormulario,
  eliminarFormulario,
  crearDesdeExcel
} from '../controllers/formulario.controller.js';
import upload from '../middlewares/upload.middleware.js';

const router = express.Router();

// Rutas REST
router.post('/', crearFormulario);
router.get('/', obtenerFormularios);
router.get('/:id', obtenerFormularioPorId);
router.put('/:id', actualizarFormulario);
router.delete('/:id', eliminarFormulario);

// Subida de archivo Excel
router.post('/upload', upload.single('archivo'), crearDesdeExcel);

export default router;
