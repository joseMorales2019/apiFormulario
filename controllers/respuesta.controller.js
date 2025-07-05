import RespuestaFormulario from '../models/respuestaFormulario.model.js';

export const enviarRespuestas = async (req, res) => {
  try {
    const resp = new RespuestaFormulario({
      ...req.body,
      tenantId: req.user.tenantId,
      usuario: req.user.id
    });
    const saved = await resp.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ error: 'Error al enviar respuestas', detalle: error.message });
  }
};

export const obtenerMisRespuestas = async (req, res) => {
  try {
    const docs = await RespuestaFormulario.find({ tenantId: req.user.tenantId, usuario: req.user.id })
      .populate('formulario');
    res.json(docs);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener respuestas', detalle: error.message });
  }
};

export const obtenerTodasLasRespuestas = async (req, res) => {
  try {
    if (req.user.rol !== 'admin') return res.status(403).json({ error: 'Solo admin' });
    const docs = await RespuestaFormulario.find({ tenantId: req.user.tenantId })
      .populate('formulario usuario');
    res.json(docs);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener todas las respuestas', detalle: error.message });
  }
};

export const actualizarRespuesta = async (req, res) => {
  try {
    const r = await RespuestaFormulario.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.user.tenantId },
      req.body,
      { new: true }
    );
    if (!r) return res.status(404).json({ error: 'No existe o no acceso' });
    res.json(r);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar respuesta', detalle: error.message });
  }
};

export const eliminarRespuesta = async (req, res) => {
  try {
    const r = await RespuestaFormulario.findOneAndDelete({
      _id: req.params.id, tenantId: req.user.tenantId
    });
    if (!r) return res.status(404).json({ error: 'No existe o no acceso' });
    res.json({ mensaje: 'Respuesta eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar respuesta', detalle: error.message });
  }
};

export const actualizarRespuestasSeleccionadas = async (req, res) => {
  try {
    const respuestas = req.body;
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

export const eliminarRespuestasSeleccionadas = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Debe enviar un array no vacío de IDs para eliminar.' });
    }
    const resultado = await RespuestaFormulario.deleteMany({
      _id: { $in: ids },
      tenantId: req.user.tenantId
    });
    res.json({
      mensaje: 'Respuestas eliminadas correctamente',
      eliminados: resultado.deletedCount
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar respuestas', detalle: error.message });
  }
};
