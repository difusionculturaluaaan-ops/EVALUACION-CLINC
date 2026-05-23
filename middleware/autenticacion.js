const jwt = require('jsonwebtoken');

function middlewareAutenticacion(req, res, next) {
  try {
    // Obtener token del header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token requerido' });
    }

    const token = authHeader.substring(7); // Remover 'Bearer '

    // Verificar token
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Guardar en request para usar en rutas
    req.usuario = payload;     // { id, email, nombre, rol, tenant_id }
    req.tenant_id = payload.tenant_id;

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' });
    }
    return res.status(401).json({ error: 'Autenticación fallida' });
  }
}

module.exports = middlewareAutenticacion;
