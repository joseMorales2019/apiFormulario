import express from 'express';
import { enviarRespuestas, obtenerMisRespuestas } from '../controllers/respuesta.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', verificarToken, enviarRespuestas);         // POST /api/respuestas
router.get('/mias', verificarToken, obtenerMisRespuestas);  // GET  /api/respuestas/mias

export default router;
