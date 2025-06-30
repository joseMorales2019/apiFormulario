import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';



// Cargar configuración
dotenv.config();

// Importaciones locales
import connectDB from './config/db.js';
import formularioRoutes from './routes/formulario.routes.js';


// Inicializar app
const app = express();

// Conexión a DB
connectDB(); // Si ya conectas en db.js, puedes quitar mongoose.connect aquí

// Middlewares
app.use(cors());
app.use(express.json());



// Rutas
app.use('/api/formularios', formularioRoutes);


// Ruta raíz
app.get('/', (req, res) => res.send('✅ API funcionando 🔐'));

// Ruta para probar errores
app.get('/error-test', (req, res, next) => {
  const error = new Error('Este es un error de prueba');
  error.status = 418;
  next(error);
});

// Manejo global de errores
app.use((err, req, res, next) => {
  res.status(err.status || 1000).json({
    mensaje: err.message || 'Error inesperado',
    status: err.status || 10000
  });
});

// Levantar servidor
const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
