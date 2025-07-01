// middlewares/auth.middleware.js
import jwt from 'jsonwebtoken';

// Clave secreta para validar JWT (idealmente usar variable de entorno)
const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_muy_seguro';

const authMiddleware = (req, res, next) => {
  try {
    // Obtener el token del header Authorization: Bearer <token>
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No se proporcionó token de autorización', origen: 'authMiddleware' });
    }

    const token = authHeader.split(' ')[1]; // Extraer token del formato 'Bearer token'
    if (!token) {
      return res.status(401).json({ error: 'Token mal formado', origen: 'authMiddleware' });
    }

    // Verificar token JWT
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error('[authMiddleware] Token inválido:', err.message);
        return res.status(401).json({ error: 'Token inválido o expirado', detalle: err.message, origen: 'authMiddleware' });
      }
      // Añadir datos del usuario decodificados a req.user
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error('[authMiddleware] Error inesperado:', error);
    res.status(500).json({ error: 'Error interno de autenticación', detalle: error.message, origen: 'authMiddleware' });
  }
};

export default authMiddleware;
