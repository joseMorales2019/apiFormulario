// 📄 formulario.routes.js
import express from 'express';
import {
  crearFormulario,
  obtenerFormularios,
  obtenerFormularioPorId,
  actualizarFormulario,
  actualizarFormulariosSeleccionados,
  eliminarFormulario,
  eliminarFormulariosSeleccionados,
  crearDesdeExcel,
  asignarFormularios
} from '../controllers/formulario.controller.js';
import upload from '../middlewares/upload.middleware.js';
const router = express.Router();

router.post('/upload', upload.single('archivo'), crearDesdeExcel);
router.post('/asignar', asignarFormularios);
router.post('/', crearFormulario);
router.get('/', obtenerFormularios);
router.get('/:id', obtenerFormularioPorId);
router.put('/:id', actualizarFormulario);
router.put('/actualizar-seleccionados', actualizarFormulariosSeleccionados);
router.delete('/:id', eliminarFormulario);
router.post('/eliminar-seleccionados', eliminarFormulariosSeleccionados);
export default router;