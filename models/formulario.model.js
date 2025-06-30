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
export default mongoose.model('formulario', userSchema);