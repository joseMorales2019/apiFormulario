import express from 'express';
import {
  nuevoFormulario,
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
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// Aplicar middleware global a todas las rutas
router.use(authMiddleware);

router.post('/upload', upload.single('archivo'), crearDesdeExcel);
router.post('/asignar', asignarFormularios);
router.post('/', nuevoFormulario);
router.get('/', obtenerFormularios);
router.get('/:id', obtenerFormularioPorId);
router.put('/:id', actualizarFormulario);
router.put('/actualizar-seleccionados', actualizarFormulariosSeleccionados);
router.post('/eliminar-seleccionados', eliminarFormulariosSeleccionados);
router.delete('/:id', eliminarFormulario);

export default router;
