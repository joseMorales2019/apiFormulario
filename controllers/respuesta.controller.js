import RespuestaFormulario from '../models/respuestaFormulario.model.js';

export const enviarRespuestas = async (req, res) => {
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
};

export const obtenerMisRespuestas = async (req, res) => {
  try {
    const respuestas = await RespuestaFormulario
      .find({ usuario: req.user.id })
      .populate('formulario');
    res.json(respuestas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener respuestas' });
  }
};
