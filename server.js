// 🌐 Dependencias externas
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import './models/user.model.js';

// 🧩 Rutas
import respuestaRoutes from './routes/respuesta.routes.js';
import formularioRoutes from './routes/formulario.routes.js';

// 🔧 Configuración de entorno
dotenv.config();

// 🔌 Conexión a base de datos
import connectDB from './config/db.js';
connectDB();

// 🚀 Inicialización de la aplicación
const app = express();

// 🛡️ Middlewares globales
app.use(express.json());

// ✅ Configurar CORS para permitir cabeceras personalizadas como X-Tenant-Id
app.use(cors({
  origin: 'https://josemanuelmoralesmejia-b7df8.web.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Tenant-Id']
}));

// 📦 Rutas principales
app.use('/api/formularios', formularioRoutes);
app.use('/api/respuestas', respuestaRoutes);

// 📍 Ruta raíz para verificación de estado
app.get('/', (req, res) => {
  res.send('✅ API funcionando 🔐');
});

// 🧪 Ruta de prueba para errores
app.get('/error-test', (req, res, next) => {
  const error = new Error('Este es un error de prueba');
  error.status = 418;
  next(error);
});

// ❌ Middleware de manejo global de errores
app.use((err, req, res, next) => {
  console.error('🚨 Error capturado:', err.message);
  res.status(err.status || 500).json({
    mensaje: err.message || 'Error inesperado',
    status: err.status || 500
  });
});

// 📡 Levantar servidor
const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
