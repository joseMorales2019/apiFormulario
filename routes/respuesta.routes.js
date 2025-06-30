import express from 'express';
import { enviarRespuestas, obtenerMisRespuestas } from '../controllers/respuesta.controller.js';


const router = express.Router();

router.post('/', enviarRespuestas);         // POST /api/respuestas
router.get('/mias', obtenerMisRespuestas);  // GET  /api/respuestas/mias

export default router;
