import mongoose from 'mongoose';

const campoSchema = new mongoose.Schema({
  etiqueta: String,
  tipo: String,
  obligatorio: Boolean,
  opciones: [String],
  min: Number,
  max: Number,
  pattern: String,
  placeholder: String,
  ayuda: String
});

// El formulario tiene muchos campos
const formularioSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String,
  campos: [campoSchema],
  creadoEn: { type: Date, default: Date.now }
});

const Formulario = mongoose.model('Formulario', formularioSchema);

export default Formulario;
