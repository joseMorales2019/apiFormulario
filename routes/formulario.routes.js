// routes/formulario.routes.js
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

// Ruta para subida de Excel (debe ir antes que /:id)
router.post('/upload', upload.single('archivo'), crearDesdeExcel);

// Rutas CRUD
router.post('/', crearFormulario);
router.get('/', obtenerFormularios);
router.get('/:id', obtenerFormularioPorId);
router.put('/:id', actualizarFormulario);
router.delete('/:id', eliminarFormulario);

export default router;
