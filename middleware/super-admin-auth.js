const jwt = require('jsonwebtoken');

function autenticarSuperAdmin(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  try {
    const secret = process.env.JWT_SECRET_SUPER || process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET no configurado');
      return res.status(500).json({ error: 'Error de configuración del servidor' });
    }
    const decoded = jwt.verify(token, secret);
    req.superAdmin = decoded;
    next();
  } catch (error) {
    console.error('Error en autenticación super admin:', error.message);
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

module.exports = autenticarSuperAdmin;
