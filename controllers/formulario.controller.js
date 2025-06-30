// controllers/formulario.controller.js
import Formulario from '../models/formulario.model.js';
import XLSX from 'xlsx';

// 🎯 Crear nuevo formulario
export const crearFormulario = async (req, res) => {
  try {
    const nuevoFormulario = new Formulario(req.body);
    const resultado = await nuevoFormulario.save();
    res.status(201).json(resultado);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear el formulario', detalle: error.message });
  }
};

// 📋 Obtener todos los formularios
export const obtenerFormularios = async (req, res) => {
  try {
    const formularios = await Formulario.find();
    res.json(formularios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener formularios' });
  }
};

// 🔍 Obtener un formulario por ID
export const obtenerFormularioPorId = async (req, res) => {
  try {
    const formulario = await Formulario.findById(req.params.id);
    if (!formulario) return res.status(404).json({ error: 'Formulario no encontrado' });
    res.json(formulario);
  } catch (error) {
    res.status(400).json({ error: 'ID inválido o error de consulta' });
  }
};

// 🛠️ Actualizar un formulario
export const actualizarFormulario = async (req, res) => {
  try {
    const actualizado = await Formulario.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!actualizado) return res.status(404).json({ error: 'Formulario no encontrado' });
    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar formulario', detalle: error.message });
  }
};

// ❌ Eliminar formulario
export const eliminarFormulario = async (req, res) => {
  try {
    const eliminado = await Formulario.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ error: 'Formulario no encontrado' });
    res.json({ mensaje: 'Formulario eliminado correctamente' });
  } catch (error) {
    res.status(400).json({ error: 'Error al eliminar formulario', detalle: error.message });
  }
};

// 📤 Crear formulario desde archivo Excel
export const crearDesdeExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se recibió ningún archivo' });
    }

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const hoja = workbook.Sheets[workbook.SheetNames[0]];
    const jsonCampos = XLSX.utils.sheet_to_json(hoja);

    // Validación mínima
    if (!Array.isArray(jsonCampos) || jsonCampos.length === 0) {
      return res.status(400).json({ error: 'El archivo Excel está vacío o mal formado' });
    }

    const campos = jsonCampos.map((campo, index) => ({
      etiqueta: campo['etiqueta'] || `Campo ${index + 1}`,
      tipo: campo['tipo'] || 'texto',
      obligatorio: campo['obligatorio']?.toString().toLowerCase() === 'sí',
      opciones: typeof campo['opciones'] === 'string'
        ? campo['opciones'].split(',').map(op => op.trim())
        : [],
      min: campo['min'] !== undefined ? Number(campo['min']) : undefined,
      max: campo['max'] !== undefined ? Number(campo['max']) : undefined,
      pattern: campo['pattern'] || '',
      placeholder: campo['placeholder'] || '',
      ayuda: campo['ayuda'] || ''
    }));

    const nuevoFormulario = new Formulario({
      nombre: 'Formulario generado desde Excel',
      descripcion: 'Este formulario fue creado automáticamente desde un archivo .xlsx',
      campos
    });

    const resultado = await nuevoFormulario.save();
    res.status(201).json({
      mensaje: 'Formulario creado exitosamente desde Excel',
      formulario: resultado
    });
  } catch (error) {
    console.error('❌ Error al procesar el Excel:', error);
    res.status(400).json({ error: 'No se pudo procesar el archivo', detalle: error.message });
  }
};
