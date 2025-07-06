import RespuestaFormulario from '../models/respuestaFormulario.model.js';

/**
 * Valida estructura de una respuesta individual
 */
const validarRespuestas = (respuestas = []) => {
  if (!Array.isArray(respuestas)) return false;

  return respuestas.every(r =>
    typeof r === 'object' &&
    typeof r.etiqueta === 'string' &&
    'valor' in r
  );
};

/**
 * POST /api/respuestas
 * Guardar respuestas de un usuario a un formulario
 */
export const enviarRespuestas = async (req, res) => {
  try {
    const { formularioId, respuestas } = req.body;

    if (!formularioId || !validarRespuestas(respuestas)) {
      return res.status(400).json({
        error: 'Datos incompletos o inválidos',
        detalle: 'formularioId requerido y respuestas debe ser un array con etiquetas y valores'
      });
    }

    const respuestaLimpia = new RespuestaFormulario({
      formulario: formularioId,
      respuestas: respuestas.map(r => ({
        etiqueta: r.etiqueta,
        valor: r.valor ?? null
      })),
      tenantId: req.user.tenantId,
      usuario: req.user.id
    });

    const saved = await respuestaLimpia.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error('❌ Error en enviarRespuestas:', error);
    res.status(500).json({ error: 'Error al enviar respuestas', detalle: error.message });
  }
};

/**
 * GET /api/respuestas/mias
 */
export const obtenerMisRespuestas = async (req, res) => {
  try {
    const docs = await RespuestaFormulario.find({
      tenantId: req.user.tenantId,
      usuario: req.user.id
    }).populate('formulario');
    res.json(docs);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener respuestas', detalle: error.message });
  }
};

/**
 * GET /api/respuestas
 * Solo para administradores
 */
export const obtenerTodasLasRespuestas = async (req, res) => {
  try {
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ error: 'Solo administradores autorizados' });
    }

    const docs = await RespuestaFormulario.find({
      tenantId: req.user.tenantId
    }).populate('formulario usuario');

    res.json(docs);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener todas las respuestas', detalle: error.message });
  }
};

/**
 * PUT /api/respuestas/:id
 * Actualizar una respuesta específica
 */
export const actualizarRespuesta = async (req, res) => {
  try {
    const actualizada = await RespuestaFormulario.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.user.tenantId },
      req.body,
      { new: true }
    );
    if (!actualizada) {
      return res.status(404).json({ error: 'Respuesta no encontrada o sin acceso' });
    }
    res.json(actualizada);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar respuesta', detalle: error.message });
  }
};

/**
 * DELETE /api/respuestas/:id
 */
export const eliminarRespuesta = async (req, res) => {
  try {
    const eliminada = await RespuestaFormulario.findOneAndDelete({
      _id: req.params.id,
      tenantId: req.user.tenantId
    });
    if (!eliminada) {
      return res.status(404).json({ error: 'Respuesta no encontrada o sin acceso' });
    }
    res.json({ mensaje: 'Respuesta eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar respuesta', detalle: error.message });
  }
};

/**
 * PUT /api/respuestas/actualizar-seleccionadas
 */
export const actualizarRespuestasSeleccionadas = async (req, res) => {
  try {
    const respuestas = req.body;
    if (!Array.isArray(respuestas) || respuestas.length === 0) {
      return res.status(400).json({ error: 'Debe enviar un array no vacío de respuestas' });
    }

    const updates = respuestas.map(r => {
      if (!r._id) throw new Error('Cada respuesta debe tener un _id');

      return RespuestaFormulario.findOneAndUpdate(
        { _id: r._id, tenantId: req.user.tenantId },
        r,
        { new: true }
      );
    });

    const resultados = await Promise.all(updates);
    res.json({ mensaje: 'Respuestas actualizadas correctamente', resultados });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar respuestas seleccionadas', detalle: error.message });
  }
};

/**
 * POST /api/respuestas/eliminar-seleccionadas
 */
export const eliminarRespuestasSeleccionadas = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Debe enviar un array de IDs no vacío para eliminar.' });
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
    res.status(500).json({ error: 'Error al eliminar respuestas seleccionadas', detalle: error.message });
  }
};
