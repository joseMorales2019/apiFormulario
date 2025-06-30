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

// 📤 Importar formularios desde Excel (debe ir antes de las rutas con /:id)
router.post('/upload', upload.single('archivo'), crearDesdeExcel);

// 📦 Crear un nuevo formulario
router.post('/', crearFormulario);

// 📄 Obtener todos los formularios
router.get('/', obtenerFormularios);

// 🔍 Obtener un formulario por ID
router.get('/:id', obtenerFormularioPorId);

//✏️ Actualizar un formulario existente
router.put('/:id', actualizarFormulario);

// ❌ Eliminar un formulario
router.delete('/:id', eliminarFormulario);

export default router;
