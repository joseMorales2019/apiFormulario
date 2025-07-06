import RespuestaFormulario from '../models/respuestaFormulario.model.js';

/** 🔎 Valida que cada respuesta tenga estructura válida */
const validarRespuestas = (respuestas = []) =>
  Array.isArray(respuestas) &&
  respuestas.every(r =>
    typeof r === 'object' &&
    typeof r.etiqueta === 'string' &&
    Object.prototype.hasOwnProperty.call(r, 'valor')
  );

/** 📥 POST /api/respuestas — Guardar respuestas */
export const enviarRespuestas = async (req, res) => {
  try {
    const { formularioId, respuestas } = req.body;

    if (!formularioId || !validarRespuestas(respuestas)) {
      return res.status(400).json({
        error: 'Datos inválidos',
        detalle: 'Se requiere formularioId y un array válido de respuestas'
      });
    }

    const nuevaRespuesta = new RespuestaFormulario({
      tenantId: req.user.tenantId,
      usuario: req.user.id,
      formulario: formularioId,
      respuestas: respuestas.map(r => ({
        etiqueta: r.etiqueta,
        valor: r.valor ?? null
      }))
    });

    const guardada = await nuevaRespuesta.save();
    res.status(201).json(guardada);
  } catch (error) {
    console.error('❌ Error al enviar respuestas:', error);
    res.status(500).json({ error: 'Error al guardar respuestas', detalle: error.message });
  }
};

/** 📤 GET /api/respuestas/mias — Respuestas del usuario */
export const obtenerMisRespuestas = async (req, res) => {
  try {
    const docs = await RespuestaFormulario.find({
      tenantId: req.user.tenantId,
      usuario: req.user.id
    }).populate({ path: 'formulario', select: 'nombre descripcion' });

    res.json(docs);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tus respuestas', detalle: error.message });
  }
};

/** 🧠 GET /api/respuestas — Solo admin */
export const obtenerTodasLasRespuestas = async (req, res) => {
  try {
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ error: 'Acceso restringido a administradores' });
    }

    const respuestas = await RespuestaFormulario.find({
      tenantId: req.user.tenantId
    })
      .populate({ path: 'formulario', select: 'nombre descripcion' })
      .populate({ path: 'usuario', select: 'nombre email' }) // Asegura que el modelo User tenga estos campos
      .lean();

    const resultado = respuestas.map(r => ({
      _id: r._id,
      formularioId: r.formulario?._id,
      usuarioId: r.usuario?._id,
      respuestas: r.respuestas,
      usuario: r.usuario
        ? { id: r.usuario._id, nombre: r.usuario.nombre, email: r.usuario.email }
        : null,
      formulario: r.formulario
        ? { id: r.formulario._id, nombre: r.formulario.nombre }
        : null
    }));

    res.json(resultado);
  } catch (error) {
    console.error('❌ Error en obtenerTodasLasRespuestas:', error);
    res.status(500).json({ error: 'Error al obtener respuestas', detalle: error.message });
  }
};

/** ✏️ PUT /api/respuestas/:id — Actualizar respuesta */
export const actualizarRespuesta = async (req, res) => {
  try {
    const actualizada = await RespuestaFormulario.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.user.tenantId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!actualizada) {
      return res.status(404).json({ error: 'Respuesta no encontrada o sin permisos' });
    }

    res.json(actualizada);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar', detalle: error.message });
  }
};

/** 🗑️ DELETE /api/respuestas/:id — Eliminar una respuesta */
export const eliminarRespuesta = async (req, res) => {
  try {
    const eliminada = await RespuestaFormulario.findOneAndDelete({
      _id: req.params.id,
      tenantId: req.user.tenantId
    });

    if (!eliminada) {
      return res.status(404).json({ error: 'Respuesta no encontrada o sin permisos' });
    }

    res.json({ mensaje: 'Respuesta eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar respuesta', detalle: error.message });
  }
};

/** ✏️ PUT /api/respuestas/actualizar-seleccionadas — Actualizar masivo */
export const actualizarRespuestasSeleccionadas = async (req, res) => {
  try {
    const respuestas = req.body;

    if (!Array.isArray(respuestas) || respuestas.length === 0) {
      return res.status(400).json({ error: 'Debe enviar un array de respuestas válido' });
    }

    const updates = respuestas.map(r => {
      if (!r._id) throw new Error('Cada respuesta debe tener un _id');
      return RespuestaFormulario.findOneAndUpdate(
        { _id: r._id, tenantId: req.user.tenantId },
        r,
        { new: true, runValidators: true }
      );
    });

    const resultados = await Promise.all(updates);
    res.json({ mensaje: 'Respuestas actualizadas', resultados });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar en lote', detalle: error.message });
  }
};

/** 🗑️ POST /api/respuestas/eliminar-seleccionadas — Eliminar masivo */
export const eliminarRespuestasSeleccionadas = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Debe enviar un array de IDs para eliminar' });
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
    res.status(500).json({ error: 'Error al eliminar en lote', detalle: error.message });
  }
};
