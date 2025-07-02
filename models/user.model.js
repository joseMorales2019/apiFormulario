import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  nombre: String,
  email: String,
  rol: String,
});

mongoose.model('User', UserSchema); // ✅ Registro
