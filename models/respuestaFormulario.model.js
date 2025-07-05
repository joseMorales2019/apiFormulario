import mongoose from 'mongoose';

const respuestaSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  formulario: { type: mongoose.Schema.Types.ObjectId, ref: 'Formulario', required: true },
  respuestas: [{ etiqueta: { type: String, required: true }, valor: mongoose.Schema.Types.Mixed }],
  fechaEnvio: { type: Date, default: Date.now },
  actualizadoEn: { type: Date, default: Date.now }
});

respuestaSchema.pre('save', function (next) {
  this.actualizadoEn = Date.now();
  next();
});

export default mongoose.model('RespuestaFormulario', respuestaSchema);
