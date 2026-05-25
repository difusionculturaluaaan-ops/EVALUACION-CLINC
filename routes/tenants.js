const express = require('express');
const { getTenantById } = require('../db/schema');
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

module.exports = router;
