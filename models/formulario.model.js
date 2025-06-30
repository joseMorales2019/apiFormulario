// models/User.js
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
const Formulario = mongoose.model('Formulario', formularioSchema);

export default Formulario;