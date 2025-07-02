// 📄 respuesta.routes.js
import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import {
  enviarRespuestas,
  obtenerMisRespuestas,
  actualizarRespuesta,
  eliminarRespuesta,
  eliminarRespuestasSeleccionadas,
  actualizarRespuestasSeleccionadas
} from '../controllers/respuesta.controller.js';

import { obtenerTodasLasRespuestas } from '../controllers/respuesta.controller.js';


const router = express.Router();

// Todas las rutas protegidas con authMiddleware para validar token
router.post('/', authMiddleware, enviarRespuestas);
router.get('/mias', authMiddleware, obtenerMisRespuestas);
router.put('/:id', authMiddleware, actualizarRespuesta);
router.put('/actualizar-seleccionadas', authMiddleware, actualizarRespuestasSeleccionadas);
router.delete('/:id', authMiddleware, eliminarRespuesta);
router.post('/eliminar-seleccionadas', authMiddleware, eliminarRespuestasSeleccionadas);



router.get('/', authMiddleware, obtenerTodasLasRespuestas); // GET /api/respuestas



export default router;
