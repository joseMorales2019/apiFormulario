// 📄 respuesta.controller.js
  try {
    const { formularioId, respuestas } = req.body;
    const usuarioId = req.user.id;
    const nuevaRespuesta = new RespuestaFormulario({
      usuario: usuarioId,
      formulario: formularioId,
      respuestas
    });
    const guardado = await nuevaRespuesta.save();
    res.status(201).json(guardado);
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar respuestas', detalle: error.message });
  }


export const obtenerMisRespuestas = async (req, res) => {
  try {
    const respuestas = await RespuestaFormulario.find({ usuario: req.user.id }).populate('formulario');
    res.json(respuestas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener respuestas' });
  }
};

export const actualizarRespuesta = async (req, res) => {
  try {
    const actualizada = await RespuestaFormulario.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!actualizada) return res.status(404).json({ error: 'Respuesta no encontrada' });
    res.json(actualizada);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar respuesta', detalle: error.message });
  }
};

export const actualizarRespuestasSeleccionadas = async (req, res) => {
  try {
    const { respuestas } = req.body; // [{id, datos}]
    const actualizadas = await Promise.all(
      respuestas.map(r => RespuestaFormulario.findByIdAndUpdate(r.id, r.datos, { new: true }))
    );
    res.json(actualizadas);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar respuestas seleccionadas' });
  }
};

export const eliminarRespuesta = async (req, res) => {
  try {
    const eliminada = await RespuestaFormulario.findByIdAndDelete(req.params.id);
    if (!eliminada) return res.status(404).json({ error: 'Respuesta no encontrada' });
    res.json({ mensaje: 'Respuesta eliminada' });
  } catch (error) {
    res.status(400).json({ error: 'Error al eliminar respuesta' });
  }
};

export const eliminarRespuestasSeleccionadas = async (req, res) => {
  try {
    const { ids } = req.body;
    const resultado = await RespuestaFormulario.deleteMany({ _id: { $in: ids } });
    res.json({ mensaje: 'Respuestas eliminadas', resultado });
  } catch (error) {
    res.status(400).json({ error: 'Error al eliminar respuestas seleccionadas' });
  }
};