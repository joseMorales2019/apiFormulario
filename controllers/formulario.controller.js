// ✨ formulario.controller.js actualizaciones restantes

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