import XLSX from 'xlsx';
import Formulario from '../models/formulario.model.js';

export const nuevoFormulario = async (req, res) => {
  const formulario = new Formulario({ ...req.body, tenantId: req.user.tenantId });
  const resu = await formulario.save();
  res.status(201).json(resu);
};

export const obtenerFormularios = async (req, res) => {
  const formularios = await Formulario.find({ tenantId: req.user.tenantId });
  res.json(formularios);
};

export const obtenerFormularioPorId = async (req, res) => {
  const f = await Formulario.findOne({ _id: req.params.id, tenantId: req.user.tenantId });
  if (!f) return res.status(404).json({ error: 'No encontrado o acceso denegado' });
  res.json(f);
};

export const actualizarFormulario = async (req, res) => {
  const f = await Formulario.findOneAndUpdate(
    { _id: req.params.id, tenantId: req.user.tenantId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!f) return res.status(404).json({ error: 'No encontrado o acceso denegado' });
  res.json(f);
};

export const eliminarFormulario = async (req, res) => {
  const f = await Formulario.findOneAndDelete({ _id: req.params.id, tenantId: req.user.tenantId });
  if (!f) return res.status(404).json({ error: 'No encontrado o acceso denegado' });
  res.json({ mensaje: 'Formulario eliminado' });
};

export const crearDesdeExcel = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Archivo requerido' });

  const wb = XLSX.read(req.file.buffer, { type: 'buffer' });
  const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
  if (!rows.length) return res.status(400).json({ error: 'Excel vacío' });

  const campos = rows.map((c, i) => ({
    etiqueta: c.etiqueta || `Campo ${i+1}`,
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
    descripcion: 'Auto-generado',
    campos
  });

  const saved = await form.save();
  res.status(201).json({ mensaje: 'Formulario creado desde Excel', formulario: saved });
};
