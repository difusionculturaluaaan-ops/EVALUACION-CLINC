const express = require('express');
const { getTenantById, query } = require('../db/schema');
const middlewareAutenticacion = require('../middleware/autenticacion');
const router = express.Router();

// GET /api/tenants/:id - Obtener datos del tenant (requiere autenticación)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const tenant = await getTenantById(parseInt(id));

    if (!tenant) {
      return res.status(404).json({ error: 'Tenant no encontrado' });
    }

    // Retornar solo datos públicos del tenant
    res.json({
      id: tenant.id,
      nombre: tenant.nombre,
      slug: tenant.slug,
      logo_url: tenant.logo_url || null,
      estado: tenant.estado
    });
  } catch (error) {
    console.error('Error al obtener tenant:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/tenants/tests-habilitados - Obtener tests habilitados para el tenant actual
// El tenant se obtiene del JWT en middleware de autenticación
router.get('/tests-habilitados/list', middlewareAutenticacion, async (req, res) => {
  try {
    // tenant_id viene del middleware de autenticación en req.tenant_id
    const tenantId = req.tenant_id;

    if (!tenantId) {
      return res.status(401).json({ error: 'No hay tenant asociado' });
    }

    const result = await query(
      'SELECT tests_habilitados FROM tenants WHERE id = $1',
      [tenantId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tenant no encontrado' });
    }

    const testsHabilitados = result.rows[0].tests_habilitados || [];

    res.json({
      tests: testsHabilitados,
      tenant_id: tenantId
    });
  } catch (error) {
    console.error('Error al obtener tests habilitados:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
