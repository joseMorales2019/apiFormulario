// 📄 formulario.model.js actualizado
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

const Formulario = mongoose.model('Formulario', formularioSchema);
export default Formulario;