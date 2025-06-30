import mongoose from 'mongoose';

const respuestaSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  formulario: { type: mongoose.Schema.Types.ObjectId, ref: 'Formulario', required: true },
  respuestas: [
    {
      etiqueta: String,
      valor: mongoose.Schema.Types.Mixed
    }
  ],
  fechaEnvio: { type: Date, default: Date.now }
});

const RespuestaFormulario = mongoose.model('RespuestaFormulario', respuestaSchema);
export default RespuestaFormulario;
