const express = require('express');
const {
  obtenerEscalasSCID2,
  obtenerMapeoSCID2,
  inicializarMapeoSCID2,
  pool
} = require('../db/schema');
const { autenticarAdmin, requiereAdmin } = require('../middleware/admin-auth');

const router = express.Router();

// GET /api/admin/scid2-escalas - Obtener escalas oficiales (read-only)
router.get('/scid2-escalas', autenticarAdmin, async (req, res) => {
  try {
    const escalas = await obtenerEscalasSCID2(req.usuario.tenant_id);
    res.json({ success: true, data: escalas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/admin/scid2-mapeo - Obtener mapeo de preguntas (read-only)
router.get('/scid2-mapeo', autenticarAdmin, async (req, res) => {
  try {
    const mapeo = await obtenerMapeoSCID2(req.usuario.tenant_id);
    res.json({ success: true, data: mapeo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/admin/scid2-inicializar - Inicializar con estructura oficial
router.post('/scid2-inicializar', autenticarAdmin, requiereAdmin, async (req, res) => {
  try {
    const resultado = await inicializarMapeoSCID2(
      req.usuario.tenant_id,
      req.usuario.id
    );

    if (!resultado) {
      return res.status(400).json({ error: 'Error al inicializar' });
    }

    res.json({ success: true, message: 'SCID-II inicializado con estructura oficial' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/admin/tests-habilitados - Obtener tests habilitados del tenant
router.get('/tests-habilitados', autenticarAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT tests_habilitados FROM tenants WHERE id = $1',
      [req.usuario.tenant_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tenant no encontrado' });
    }

    const tests = result.rows[0].tests_habilitados || [
      'SCL90R', 'HAMILTON', 'MMPI2PRO', 'CUIDA', 'ISRA', 'TDS', 'PCLR', 'SCID2', 'EGEP5'
    ];

    res.json({ success: true, tests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
