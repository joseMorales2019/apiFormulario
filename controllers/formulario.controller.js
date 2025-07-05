import XLSX from 'xlsx';
import Formulario from '../models/formulario.model.js';
import AsignacionFormulario from '../models/asignacionFormulario.model.js';

// Crear nuevo formulario
export const nuevoFormulario = async (req, res) => {
  try {
    const formulario = new Formulario({ ...req.body, tenantId: req.user.tenantId });
    const resu = await formulario.save();
    res.status(201).json(resu);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear formulario', detalle: error.message });
  }
};

// Obtener todos los formularios del tenant
export const obtenerFormularios = async (req, res) => {
  try {
    const formularios = await Formulario.find({ tenantId: req.user.tenantId });
    res.json(formularios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener formularios', detalle: error.message });
  }
};

// Obtener formulario por ID
export const obtenerFormularioPorId = async (req, res) => {
  try {
    const f = await Formulario.findOne({ _id: req.params.id, tenantId: req.user.tenantId });
    if (!f) return res.status(404).json({ error: 'No encontrado o acceso denegado' });
    res.json(f);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener formulario', detalle: error.message });
  }
};

// Actualizar formulario
export const actualizarFormulario = async (req, res) => {
  try {
    const f = await Formulario.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.user.tenantId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!f) return res.status(404).json({ error: 'No encontrado o acceso denegado' });
    res.json(f);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar formulario', detalle: error.message });
  }
};

// Eliminar formulario
export const eliminarFormulario = async (req, res) => {
  try {
    const f = await Formulario.findOneAndDelete({
      _id: req.params.id, tenantId: req.user.tenantId
    });
    if (!f) return res.status(404).json({ error: 'No encontrado o acceso denegado' });
    res.json({ mensaje: 'Formulario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar formulario', detalle: error.message });
  }
};

// Crear formulario desde Excel
export const crearDesdeExcel = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Archivo requerido' });

    const wb = XLSX.read(req.file.buffer, { type: 'buffer' });
    const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
    if (!rows.length) return res.status(400).json({ error: 'Excel vacío' });

    const campos = rows.map((c, i) => ({
      etiqueta: c.etiqueta || `Campo ${i + 1}`,
      tipo: c.tipo || 'texto',
      obligatorio: String(c.obligatorio).toLowerCase().startsWith('s'),
      opciones: typeof c.opciones === 'string' ? c.opciones.split(',').map(x => x.trim()) : [],
      min: c.min ? Number(c.min) : undefined,
      max: c.max ? Number(c.max) : undefined,
      pattern: c.pattern || '',
      placeholder: c.placeholder || '',
      ayuda: c.ayuda || ''
    }));

    const form = new Formulario({
      tenantId: req.user.tenantId,
      nombre: 'Generado desde Excel',
      descripcion: 'Formulario auto-generado',
      campos
    });

    const saved = await form.save();
    res.status(201).json({ mensaje: 'Formulario creado desde Excel', formulario: saved });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear desde Excel', detalle: error.message });
  }
};

// Actualizar múltiples formularios
export const actualizarFormulariosSeleccionados = async (req, res) => {
  try {
    const formularios = req.body; // [{ _id, ... }]
    const updates = formularios.map(f =>
      Formulario.findOneAndUpdate(
        { _id: f._id, tenantId: req.user.tenantId },
        f,
        { new: true, runValidators: true }
      )
    );
    const resultados = await Promise.all(updates);
    res.json({ mensaje: 'Formularios actualizados', resultados });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar formularios', detalle: error.message });
  }
};

// Eliminar múltiples formularios
export const eliminarFormulariosSeleccionados = async (req, res) => {
  try {
    const { ids } = req.body;
    const resultado = await Formulario.deleteMany({
      _id: { $in: ids },
      tenantId: req.user.tenantId
    });
    res.json({
      mensaje: 'Formularios eliminados correctamente',
      eliminados: resultado.deletedCount
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar formularios', detalle: error.message });
  }
};

// Asignar formularios a usuarios
export const asignarFormularios = async (req, res) => {
  try {
    const { formularioIds = [], usuarioIds = [] } = req.body;
    if (!formularioIds.length || !usuarioIds.length) {
      return res.status(400).json({ error: 'Debe enviar arrays de usuarioIds y formularioIds' });
    }

    const tenantId = req.user.tenantId;
    const asignaciones = [];

    for (const formularioId of formularioIds) {
      for (const usuarioId of usuarioIds) {
        asignaciones.push({
          tenantId,
          formulario: formularioId,
          usuario: usuarioId
        });
      }
    }

    const insertados = await AsignacionFormulario.insertMany(asignaciones, { ordered: false });
    res.status(201).json({
      mensaje: 'Asignaciones realizadas con éxito',
      asignaciones: insertados
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Ya existen algunas asignaciones duplicadas' });
    }
    res.status(500).json({ error: 'Error al asignar formularios', detalle: error.message });
  }
};
