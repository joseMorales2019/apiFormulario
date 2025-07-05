import mongoose from 'mongoose';

const campoSchema = new mongoose.Schema({
  etiqueta: { type: String, required: true },
  tipo: { type: String, required: true },
  obligatorio: { type: Boolean, default: false },
  opciones: [{ type: String }],
  min: Number,
  max: Number,
  pattern: String,
  placeholder: String,
  ayuda: String
});

const formularioSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
  nombre: { type: String, required: true },
  descripcion: String,
  campos: [campoSchema],
  creadoEn: { type: Date, default: Date.now },
  actualizadoEn: { type: Date, default: Date.now }
});

formularioSchema.pre('save', function (next) {
  this.actualizadoEn = Date.now();
  next();
});

export default mongoose.model('Formulario', formularioSchema);
