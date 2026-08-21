const express = require('express');
const router = express.Router();
const {
  pool,
  getPacienteByIdTenant,
  guardarPrueba,
  obtenerPruebaById,
  obtenerPruebaByIdTenant,
  obtenerPruebasPaciente,
  obtenerPruebasRango,
  getNormasByTest,
  getNormasPoblacionGeneral,
  isTestAuthorizedForTenant
} = require('../db/schema');

// POST: Guardar una nueva prueba (solo del tenant autenticado)
router.post('/', async (req, res) => {
  try {
    const { paciente_id, tipo, data, total, subescalas, pdf_base64, pdf_filename, metadatos, evaluador } = req.body;
    const tenant_id = req.tenant_id;

    if (!paciente_id || !tipo || !data) {
      return res.status(400).json({ error: 'Datos incompletos' });
    }

    // Validar que el paciente pertenezca al tenant
    const paciente = await getPacienteByIdTenant(paciente_id, tenant_id);
    if (!paciente) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }

    // Validar que el test esté autorizado para este tenant
    const isAuthorized = await isTestAuthorizedForTenant(tenant_id, tipo);
    if (!isAuthorized) {
      return res.status(403).json({ error: `Test '${tipo}' no está autorizado para este tenant` });
    }

    // Validar que data es un array
    if (!Array.isArray(data)) {
      return res.status(400).json({ error: 'data debe ser un array' });
    }

    // Guardar prueba con metadatos incluidos en subescalas
    let subescalasConMetadatos = subescalas;
    if (metadatos) {
      subescalasConMetadatos = { ...subescalas, _metadatos: metadatos };
    }
    if (evaluador) {
      subescalasConMetadatos = { ...subescalasConMetadatos, _evaluador: evaluador };
    }

    const prueba = await guardarPrueba(paciente_id, tipo, data, total, subescalasConMetadatos, pdf_base64);
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
    const prueba_id = req.params.id;

    // 🔴 AUDITORIA: Loguear qué se está pidiendo
    console.log(`🔍 [AUDITORIA] GET /pruebas/:id - prueba_id: ${prueba_id}, tenant_id: ${tenant_id}, usuario: ${req.usuario?.email}`);

    // CRÍTICO: Validar tenant_id en BD para evitar access control bypass
    const prueba = await obtenerPruebaByIdTenant(prueba_id, tenant_id);

    if (!prueba) {
      console.log(`🔍 [AUDITORIA] Prueba NO encontrada (probablemente de otro tenant) - prueba_id: ${prueba_id}, tenant_id: ${tenant_id}`);
      return res.status(404).json({ error: 'Prueba no encontrada' });
    }

    console.log(`🔍 [AUDITORIA] Retornando prueba - id: ${prueba.id}, prueba.tenant_id: ${prueba.tenant_id}, req.tenant_id: ${tenant_id}, match: ${prueba.tenant_id === tenant_id}`);
    res.json(prueba);
  } catch (error) {
    console.error('Error al obtener prueba:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT: Actualizar una prueba (solo del tenant autenticado)
router.put('/:id', async (req, res) => {
  try {
    const tenant_id = req.tenant_id;
    const { paciente_id, tipo, data, total, subescalas, metadatos } = req.body;

    if (!paciente_id || !tipo || !data) {
      return res.status(400).json({ error: 'Datos incompletos' });
    }

    // CRÍTICO: Obtener prueba validando tenant_id en BD
    const prueba = await obtenerPruebaByIdTenant(req.params.id, tenant_id);
    if (!prueba) {
      return res.status(404).json({ error: 'Prueba no encontrada' });
    }

    // Validar que el test esté autorizado (en caso de cambio de tipo)
    const isAuthorized = await isTestAuthorizedForTenant(tenant_id, tipo);
    if (!isAuthorized) {
      return res.status(403).json({ error: `Test '${tipo}' no está autorizado para este tenant` });
    }

    // Incluir metadatos en subescalas si se proporciona
    let subescalasActualizada = subescalas;
    if (metadatos) {
      subescalasActualizada = { ...subescalas, _metadatos: metadatos };
    }

    // Actualizar en BD
    const result = await pool.query(
      'UPDATE pruebas SET data = $1, total = $2, subescalas = $3, actualizado_en = NOW() WHERE id = $4 AND tenant_id = $5 RETURNING *',
      [JSON.stringify(data), total, JSON.stringify(subescalasActualizada), req.params.id, tenant_id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar prueba:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET: Obtener historial comparativo de un tipo de prueba para un paciente
// /pruebas/comparativo/:paciente_id/:tipo
router.get('/comparativo/:paciente_id/:tipo', async (req, res) => {
  try {
    const tenant_id = req.tenant_id;
    const tipo = req.params.tipo;

    // Validar que el paciente pertenezca al tenant
    const paciente = await getPacienteByIdTenant(req.params.paciente_id, tenant_id);
    if (!paciente) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }

    // Validar que el test esté autorizado para este tenant
    const isAuthorized = await isTestAuthorizedForTenant(tenant_id, tipo);
    if (!isAuthorized) {
      return res.status(403).json({ error: `Test '${tipo}' no está autorizado para este tenant` });
    }

    const pruebas = await obtenerPruebasRango(req.params.paciente_id, tipo);
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

    // CRÍTICO: Validar que la prueba pertenezca al tenant en BD
    const prueba = await obtenerPruebaByIdTenant(id, tenant_id);
    if (!prueba) {
      return res.status(404).json({ error: 'Prueba no encontrada' });
    }

    // Actualizar estado (con validación tenant_id en WHERE)
    const result = await pool.query(
      'UPDATE pruebas SET estado = $1, actualizado_en = NOW() WHERE id = $2 AND tenant_id = $3 RETURNING *',
      [estado, id, tenant_id]
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

    // CRÍTICO: Validar que la prueba pertenezca al tenant en BD
    const prueba = await obtenerPruebaByIdTenant(id, tenant_id);
    if (!prueba) {
      return res.status(404).json({ error: 'Prueba no encontrada' });
    }

    // Solo permitir eliminar borradores
    if (prueba.estado === 'oficial') {
      return res.status(400).json({ error: 'No se pueden eliminar pruebas oficiales' });
    }

    // Eliminar (con validación tenant_id en WHERE - fail-closed security)
    await pool.query('DELETE FROM pruebas WHERE id = $1 AND tenant_id = $2', [id, tenant_id]);

    res.json({ success: true, message: 'Prueba eliminada' });
  } catch (error) {
    console.error('Error al eliminar:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint eliminado: /upload-pdf (se guarda base64 en BD directamente)

module.exports = router;
