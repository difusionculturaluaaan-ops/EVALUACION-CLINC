const express = require('express');
const { obtenerTestsHabilitados, habilitarTest, deshabilitarTest } = require('../db/schema');
const autenticacion = require('../middleware/autenticacion');

const router = express.Router();

// GET /api/usuario-tests/:usuario_id - Obtener tests habilitados
router.get('/:usuario_id', autenticacion, async (req, res) => {
  try {
    const { usuario_id } = req.params;

    // Validar que el usuario solo pueda ver sus propios tests
    if (parseInt(usuario_id) !== req.usuario.id && req.usuario.rol !== 'admin') {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const tests = await obtenerTestsHabilitados(parseInt(usuario_id));
    res.json(tests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/usuario-tests/:usuario_id/habilitar/:test - Habilitar un test
router.post('/:usuario_id/habilitar/:test', autenticacion, async (req, res) => {
  try {
    const { usuario_id, test } = req.params;

    // Solo admin puede habilitar tests para otros
    if (parseInt(usuario_id) !== req.usuario.id && req.usuario.rol !== 'admin') {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const result = await habilitarTest(parseInt(usuario_id), test);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/usuario-tests/:usuario_id/deshabilitar/:test - Deshabilitar un test
router.post('/:usuario_id/deshabilitar/:test', autenticacion, async (req, res) => {
  try {
    const { usuario_id, test } = req.params;

    // Solo admin puede deshabilitar tests para otros
    if (parseInt(usuario_id) !== req.usuario.id && req.usuario.rol !== 'admin') {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const result = await deshabilitarTest(parseInt(usuario_id), test);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
