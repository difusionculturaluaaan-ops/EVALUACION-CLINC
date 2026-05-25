const jwt = require('jsonwebtoken');

function autenticarSuperAdmin(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_SUPER || process.env.JWT_SECRET);
    req.superAdmin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

module.exports = autenticarSuperAdmin;
