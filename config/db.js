import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🟢 Conexión a MongoDB exitosa');
  } catch (error) {
    console.error('🔴 Error conectando a MongoDB', error);
    process.exit(1);
  }
};

module.exports = connectDB;
