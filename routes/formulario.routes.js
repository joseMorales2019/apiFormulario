import express from 'express';
import * as controlador from '../controllers/formulario.controller.js';
import upload from '../middlewares/upload.middleware.js';

const router = express.Router();

router.post('/', controlador.crearFormulario);
router.get('/', controlador.obtenerFormularios);
router.get('/:id', controlador.obtenerFormularioPorId);
router.put('/:id', controlador.actualizarFormulario);
router.delete('/:id', controlador.eliminarFormulario);
router.post('/upload', upload.single('archivo'), controlador.crearDesdeExcel);

export default router;
