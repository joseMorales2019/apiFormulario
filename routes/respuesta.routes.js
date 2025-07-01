// 📄 respuesta.routes.js
import express from 'express';
import {
  enviarRespuestas,
  obtenerMisRespuestas,
  actualizarRespuesta,
  eliminarRespuesta,
  eliminarRespuestasSeleccionadas,
  actualizarRespuestasSeleccionadas
} from '../controllers/respuesta.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
const router = express.Router();

router.post('/', authMiddleware, enviarRespuestas);
router.get('/mias', authMiddleware, obtenerMisRespuestas);
router.put('/:id', authMiddleware, actualizarRespuesta);
router.put('/actualizar-seleccionadas', authMiddleware, actualizarRespuestasSeleccionadas);
router.delete('/:id', authMiddleware, eliminarRespuesta);
router.post('/eliminar-seleccionadas', authMiddleware, eliminarRespuestasSeleccionadas);
export default router;