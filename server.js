const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// Rutas
const formularioRoutes = require('./routes/formulario.routes');
app.use('/api/formularios', formularioRoutes);

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
