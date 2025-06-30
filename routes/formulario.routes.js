const express = require('express');
const router = express.Router();
const controlador = require('../controllers/formulario.controller');
const upload = require('../middlewares/upload.middleware');

router.post('/', controlador.crearFormulario);
router.get('/', controlador.obtenerFormularios);
router.get('/:id', controlador.obtenerFormularioPorId);
router.put('/:id', controlador.actualizarFormulario);
router.delete('/:id', controlador.eliminarFormulario);

// 📥 Subida de archivo Excel
router.post('/upload', upload.single('archivo'), controlador.crearDesdeExcel);

module.exports = router;
