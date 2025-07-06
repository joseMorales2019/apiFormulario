// models/user.model.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },

  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },

  rol: {
    type: String,
    enum: ['admin', 'mype', 'consultor', 'auditor'],
    default: 'mype'
  },

  reputacion: {
    score: { type: Number, default: 0 },
    nivel: {
      type: String,
      enum: ['Básico', 'Confiable', 'Verificado', 'Premium'],
      default: 'Básico'
    }
  },

  activo: { type: Boolean, default: true },

  ultimaConexion: Date
}, { timestamps: true });

export default mongoose.model('User', userSchema);
