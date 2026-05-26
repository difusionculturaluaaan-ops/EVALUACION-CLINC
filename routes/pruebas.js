const express = require('express');
const router = express.Router();
const {
  pool,
  getPacienteByIdTenant,
  guardarPrueba,
  obtenerPruebaById,
  obtenerPruebasPaciente,
  obtenerPruebasRango,
  getNormasByTest,
  getNormasPoblacionGeneral
} = require('../db/schema');

// POST: Guardar una nueva prueba (solo del tenant autenticado)
router.post('/', async (req, res) => {
  try {
    const { paciente_id, tipo, data, total, subescalas } = req.body;
    const tenant_id = req.tenant_id;

    if (!paciente_id || !tipo || !data) {
      return res.status(400).json({ error: 'Datos incompletos' });
    }

    // Validar que el paciente pertenezca al tenant
    const paciente = await getPacienteByIdTenant(paciente_id, tenant_id);
    if (!paciente) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }

    // Validar que data es un array
    if (!Array.isArray(data)) {
      return res.status(400).json({ error: 'data debe ser un array' });
    }

    const prueba = await guardarPrueba(paciente_id, tipo, data, total, subescalas);
    res.status(201).json(prueba);
  } catch (error) {
    console.error('Error al guardar prueba:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET: Obtener una prueba específica (solo del tenant autenticado)
router.get('/:id', async (req, res) => {
  try {
    const tenant_id = req.tenant_id;
    const prueba = await obtenerPruebaById(req.params.id);

    if (!prueba) {
      return res.status(404).json({ error: 'Prueba no encontrada' });
    }

    // Validar que la prueba pertenezca al tenant
    if (prueba.tenant_id !== tenant_id) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    res.json(prueba);
  } catch (error) {
    console.error('Error al obtener prueba:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET: Obtener historial comparativo de un tipo de prueba para un paciente
// /pruebas/comparativo/:paciente_id/:tipo
router.get('/comparativo/:paciente_id/:tipo', async (req, res) => {
  try {
    const tenant_id = req.tenant_id;
    const paciente = await getPacienteByIdTenant(req.params.paciente_id, tenant_id);
    if (!paciente) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }

    const pruebas = await obtenerPruebasRango(req.params.paciente_id, req.params.tipo);
    res.json(pruebas);
  } catch (error) {
    console.error('Error al obtener historial:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET: Obtener normas de un test
// /pruebas/normas/:tipo_test
router.get('/normas/:tipo_test', async (req, res) => {
  try {
    const { tipo_test } = req.params;
    const normas = await getNormasByTest(tipo_test);

    if (!normas || normas.length === 0) {
      return res.status(404).json({ error: 'No hay normas disponibles para este test' });
    }

    res.json(normas);
  } catch (error) {
    console.error('Error al obtener normas:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET: Obtener normas de población general para un test
// /pruebas/normas-poblacion/:tipo_test
router.get('/normas-poblacion/:tipo_test', async (req, res) => {
  try {
    const { tipo_test } = req.params;
    const normas = await getNormasPoblacionGeneral(tipo_test);

    res.json(normas);
  } catch (error) {
    console.error('Error al obtener normas de población:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT: Cambiar estado de una prueba (Borrador <-> Oficial)
router.put('/:id/estado', async (req, res) => {
  try {
    const tenant_id = req.tenant_id;
    const { id } = req.params;
    const { estado } = req.body;

    if (!['borrador', 'oficial'].includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }

    // Validar que la prueba pertenezca al tenant
    const prueba = await obtenerPruebaById(id);
    if (!prueba) {
      return res.status(404).json({ error: 'Prueba no encontrada' });
    }
    if (prueba.tenant_id !== tenant_id) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    // Actualizar estado
    const result = await pool.query(
      'UPDATE pruebas SET estado = $1, actualizado_en = NOW() WHERE id = $2 RETURNING *',
      [estado, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE: Eliminar una prueba (solo borradores)
router.delete('/:id', async (req, res) => {
  try {
    const tenant_id = req.tenant_id;
    const { id } = req.params;

    // Validar que la prueba pertenezca al tenant
    const prueba = await obtenerPruebaById(id);
    if (!prueba) {
      return res.status(404).json({ error: 'Prueba no encontrada' });
    }
    if (prueba.tenant_id !== tenant_id) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    // Solo permitir eliminar borradores
    if (prueba.estado === 'oficial') {
      return res.status(400).json({ error: 'No se pueden eliminar pruebas oficiales' });
    }

    // Eliminar
    await pool.query('DELETE FROM pruebas WHERE id = $1', [id]);

    res.json({ success: true, message: 'Prueba eliminada' });
  } catch (error) {
    console.error('Error al eliminar:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
