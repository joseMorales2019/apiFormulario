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

const router = express.Router();

router.post('/', enviarRespuestas);
router.get('/mias', obtenerMisRespuestas);
router.put('/:id', actualizarRespuesta);
router.put('/actualizar-seleccionadas', actualizarRespuestasSeleccionadas);
router.delete('/:id', eliminarRespuesta);
router.post('/eliminar-seleccionadas', eliminarRespuestasSeleccionadas);
export default router;