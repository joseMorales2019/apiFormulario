const Formulario = require('../models/formulario.model');
const XLSX = require('xlsx');
// Crear nuevo formulario
exports.crearFormulario = async (req, res) => {
  try {
    const nuevoFormulario = new Formulario(req.body);
    const resultado = await nuevoFormulario.save();
    res.status(201).json(resultado);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear el formulario', detalle: error });
  }
};

// Obtener todos los formularios
exports.obtenerFormularios = async (req, res) => {
  try {
    const formularios = await Formulario.find();
    res.json(formularios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener formularios' });
  }
};

// Obtener un formulario por ID
exports.obtenerFormularioPorId = async (req, res) => {
  try {
    const formulario = await Formulario.findById(req.params.id);
    if (!formulario) return res.status(404).json({ error: 'Formulario no encontrado' });
    res.json(formulario);
  } catch (error) {
    res.status(400).json({ error: 'ID inválido o error de consulta' });
  }
};

// Actualizar formulario
exports.actualizarFormulario = async (req, res) => {
  try {
    const actualizado = await Formulario.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!actualizado) return res.status(404).json({ error: 'Formulario no encontrado' });
    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar formulario' });
  }
};

// Eliminar formulario
exports.eliminarFormulario = async (req, res) => {
  try {
    const eliminado = await Formulario.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ error: 'Formulario no encontrado' });
    res.json({ mensaje: 'Formulario eliminado correctamente' });
  } catch (error) {
    res.status(400).json({ error: 'Error al eliminar formulario' });
  }
};


// Crea formulario a partir de archivo Excel
exports.crearDesdeExcel = async (req, res) => {
  try {
    const buffer = req.file.buffer;
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const hoja = workbook.Sheets[workbook.SheetNames[0]];
    const jsonCampos = XLSX.utils.sheet_to_json(hoja);

    const campos = jsonCampos.map(campo => ({
      etiqueta: campo['etiqueta'],
      tipo: campo['tipo'],
      obligatorio: campo['obligatorio']?.toLowerCase() === 'sí',
      opciones: campo['opciones']?.split(',').map(op => op.trim()) || [],
      min: campo['min'] || null,
      max: campo['max'] || null,
      pattern: campo['pattern'] || null,
      placeholder: campo['placeholder'] || '',
      ayuda: campo['ayuda'] || ''
    }));

    const nuevoFormulario = new Formulario({
      nombre: 'Formulario generado desde Excel',
      descripcion: 'Este formulario fue creado automáticamente',
      campos
    });

    const resultado = await nuevoFormulario.save();
    res.status(201).json(resultado);
  } catch (error) {
    console.error('Error al procesar el Excel:', error);
    res.status(400).json({ error: 'No se pudo procesar el archivo' });
  }
};

export default controlador;