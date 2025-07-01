// ✨ formulario.controller.js actualizaciones restantes
import XLSX from 'xlsx';
import Formulario from '../models/formulario.model.js';

export const crearDesdeExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se recibió ningún archivo' });
    }

    // Leer el archivo Excel desde el buffer en memoria
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });

    // Seleccionar la primera hoja de cálculo
    const hoja = workbook.Sheets[workbook.SheetNames[0]];

    // Convertir la hoja a JSON
    const jsonCampos = XLSX.utils.sheet_to_json(hoja);

    // Validar que el archivo no esté vacío
    if (!Array.isArray(jsonCampos) || jsonCampos.length === 0) {
      return res.status(400).json({ error: 'El archivo Excel está vacío o mal formado' });
    }

    // Mapear cada fila del Excel a la estructura del campo del formulario
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

    // Crear el nuevo formulario con los campos parseados
    const nuevoFormulario = new Formulario({
      nombre: 'Formulario generado desde Excel',
      descripcion: 'Este formulario fue creado automáticamente desde un archivo .xlsx',
      campos
    });

    // Guardar el formulario en la base de datos
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










export const actualizarFormulario = async (req, res) => {
  try {
    const actualizado = await Formulario.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!actualizado) return res.status(404).json({ error: 'Formulario no encontrado' });
    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar formulario', detalle: error.message });
  }
};


export const asignarFormularios = async (req, res) => {
  try {
    const { usuarioId, formularios } = req.body; // formularios: [formularioId]
    const usuario = await User.findById(usuarioId);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    formularios.forEach(id => {
      if (!usuario.formulariosAsignados.some(f => f.formularioId.toString() === id)) {
        usuario.formulariosAsignados.push({ formularioId: id });
      }
    });
    await usuario.save();
    res.json({ mensaje: 'Formularios asignados exitosamente' });
  } catch (error) {
    res.status(400).json({ error: 'Error al asignar formularios', detalle: error.message });
  }
};

export const actualizarFormulariosSeleccionados = async (req, res) => {
  try {
    const { formularios } = req.body; // [{id, datos}]
    const actualizados = await Promise.all(
      formularios.map(f => Formulario.findByIdAndUpdate(f.id, f.datos, { new: true }))
    );
    res.json(actualizados);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar formularios seleccionados', detalle: error.message });
  }
};

export const eliminarFormulariosSeleccionados = async (req, res) => {
  try {
    const { ids } = req.body;
    const resultado = await Formulario.deleteMany({ _id: { $in: ids } });
    res.json({ mensaje: 'Formularios eliminados correctamente', resultado });
  } catch (error) {
    res.status(400).json({ error: 'Error al eliminar formularios seleccionados', detalle: error.message });
  }
};