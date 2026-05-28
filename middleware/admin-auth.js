const jwt = require('jsonwebtoken');
const { getUsuarioById } = require('../db/schema');

async function autenticarAdmin(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await getUsuarioById(decoded.id);

    if (!usuario) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    // Verificar que sea admin o profesional (profesional puede verlo pero no modificar)
    if (!['admin', 'profesional'].includes(usuario.rol)) {
      return res.status(403).json({ error: 'Rol no autorizado' });
    }

    req.usuario = {
      ...decoded,
      id: usuario.id,
      tenant_id: usuario.tenant_id,
      rol: usuario.rol,
      nombre: usuario.nombre
    };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

function requiereAdmin(req, res, next) {
  if (!req.usuario || req.usuario.rol !== 'admin') {
    return res.status(403).json({ error: 'Se requiere rol de administrador' });
  }
  next();
}

module.exports = {
  autenticarAdmin,
  requiereAdmin
};
