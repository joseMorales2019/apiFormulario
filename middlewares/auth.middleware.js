// middlewares/auth.middleware.js
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET;

export default function authMiddleware(req, res, next){
  const h = req.headers.authorization;
  if(!h?.startsWith('Bearer ')) return res.status(401).json({ error: 'Token requerido' });
  const token = h.split(' ')[1];
  try {
    const d = jwt.verify(token, JWT_SECRET);
    if(!d.tenantId) throw new Error('tenantId faltante');
    req.user = d;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token inválido', detalle: err.message });
  }
}
