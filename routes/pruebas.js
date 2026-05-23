const express = require('express');
const router = express.Router();
const {
  getPacienteByIdTenant,
  guardarPrueba,
  obtenerPruebaById,
  obtenerPruebasPaciente,
  obtenerPruebasRango
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

module.exports = router;
