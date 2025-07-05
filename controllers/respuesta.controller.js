import RespuestaFormulario from '../models/respuestaFormulario.model.js';

export const enviarRespuestas = async (req, res) => {
  const resp = new RespuestaFormulario({
    ...req.body,
    tenantId: req.user.tenantId,
    usuario: req.user.id
  });
  const saved = await resp.save();
  res.status(201).json(saved);
};

export const obtenerMisRespuestas = async (req, res) => {
  const docs = await RespuestaFormulario.find({ tenantId: req.user.tenantId, usuario: req.user.id })
    .populate('formulario');
  res.json(docs);
};

export const obtenerTodasLasRespuestas = async (req, res) => {
  if (req.user.rol !== 'admin') return res.status(403).json({ error: 'Solo admin' });
  const docs = await RespuestaFormulario.find({ tenantId: req.user.tenantId })
    .populate('formulario usuario');
  res.json(docs);
};

export const actualizarRespuesta = async (req, res) => {
  const r = await RespuestaFormulario.findOneAndUpdate(
    { _id: req.params.id, tenantId: req.user.tenantId },
    req.body,
    { new: true }
  );
  if (!r) return res.status(404).json({ error: 'No existe o no acceso' });
  res.json(r);
};

export const eliminarRespuesta = async (req, res) => {
  const r = await RespuestaFormulario.findOneAndDelete({
    _id: req.params.id, tenantId: req.user.tenantId
  });
  if (!r) return res.status(404).json({ error: 'No existe o no acceso' });
  res.json({ mensaje: 'Respuesta eliminada' });
};
// respuesta.controller.js (agregar al final o donde sea adecuado)
export const actualizarRespuestasSeleccionadas = async (req, res) => {
  try {
    const respuestas = req.body; // Array con respuestas a actualizar [{ _id, ...}]
    if (!Array.isArray(respuestas) || respuestas.length === 0) {
      return res.status(400).json({ error: 'Se requiere un array no vacío de respuestas para actualizar.' });
    }

    const updates = respuestas.map(r =>
      RespuestaFormulario.findOneAndUpdate(
        { _id: r._id, tenantId: req.user.tenantId },
        r,
        { new: true }
      )
    );

    const resultados = await Promise.all(updates);
    res.json({ mensaje: 'Respuestas actualizadas', resultados });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar respuestas seleccionadas', detalle: error.message });
  }
};
