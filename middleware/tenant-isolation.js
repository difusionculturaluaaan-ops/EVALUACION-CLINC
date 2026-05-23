// Middleware que verifica que el tenant_id de la request coincida con el del usuario
function middlewareTenantIsolation(req, res, next) {
  try {
    // Obtener tenant_id de diferentes fuentes
    const tenantIdParam = req.params.tenant_id || req.query.tenant_id;
    const tenantIdBody = req.body?.tenant_id;
    const tenantIdHeader = req.headers['x-tenant-id'];

    // Usar el primero disponible
    const requestTenantId = tenantIdParam || tenantIdBody || tenantIdHeader;

    // Si hay tenant_id en la request, validar que coincida con el del usuario
    if (requestTenantId) {
      const userTenantId = parseInt(req.tenant_id);
      const reqTenantId = parseInt(requestTenantId);

      if (reqTenantId !== userTenantId) {
        return res.status(403).json({
          error: 'Acceso denegado',
          message: 'No tienes permiso para acceder a este tenant'
        });
      }
    }

    next();
  } catch (err) {
    console.error('Error en tenant isolation:', err);
    return res.status(403).json({ error: 'Acceso denegado' });
  }
}

module.exports = middlewareTenantIsolation;
