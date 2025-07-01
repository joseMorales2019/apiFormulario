import express from 'express';
router.post('/respuestas', authMiddleware, async (req, res) => {
  const { usuarioId, formularioId, respuestas } = req.body;

  if (!usuarioId || !formularioId || !Array.isArray(respuestas)) {
    return res.status(400).json({ mensaje: 'Datos incompletos' });
  }

  try {
    const usuario = await User.findById(usuarioId);

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const formularioAsignado = usuario.formulariosAsignados.find(f =>
      f.formularioId.toString() === formularioId.toString()
    );

    if (!formularioAsignado) {
      return res.status(404).json({ mensaje: 'Formulario no asignado a este usuario' });
    }

    formularioAsignado.respuestas = respuestas; // 💾 Se almacenan las respuestas
    await usuario.save();

    return res.status(200).json({ mensaje: 'Respuestas guardadas con éxito' });
  } catch (error) {
    console.error('Error al guardar respuestas:', error);
    return res.status(500).json({ mensaje: 'Error al guardar respuestas' });
  }
});

export default router;

