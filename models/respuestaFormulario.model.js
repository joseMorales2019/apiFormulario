// 📄 respuestaFormulario.model.js actualizado
import mongoose from 'mongoose';

const respuestaSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  formulario: { type: mongoose.Schema.Types.ObjectId, ref: 'Formulario', required: true },
  respuestas: [
    {
      etiqueta: { type: String, required: true },
      valor: mongoose.Schema.Types.Mixed
    }
  ],
  fechaEnvio: { type: Date, default: Date.now },
  actualizadoEn: { type: Date, default: Date.now }
});

respuestaSchema.pre('save', function (next) {
  this.actualizadoEn = Date.now();
  next();
});

const RespuestaFormulario = mongoose.model('RespuestaFormulario', respuestaSchema);
export default RespuestaFormulario;