// models/asignacionFormulario.model.js
import mongoose from 'mongoose';

const asignacionSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
  formulario: { type: mongoose.Schema.Types.ObjectId, ref: 'Formulario', required: true },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fechaAsignacion: { type: Date, default: Date.now }
}, { timestamps: true });

asignacionSchema.index({ tenantId: 1, formulario: 1, usuario: 1 }, { unique: true });

export default mongoose.model('AsignacionFormulario', asignacionSchema);
