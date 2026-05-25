const express = require('express');
const router = express.Router();
const {
  getPacientesByTenant,
  getPacienteByIdTenant,
  buscarPacientesPorTenant,
  crearPacienteTenant,
  actualizarPaciente,
  toggleStatusPaciente,
  deletePaciente,
  obtenerPruebasPaciente
} = require('../db/schema');

// GET: Listar todos los pacientes del tenant autenticado
router.get('/', async (req, res) => {
  try {
    const tenant_id = req.tenant_id; // Del middleware de autenticación
    const { q } = req.query;
    let pacientes;

    if (q) {
      pacientes = await buscarPacientesPorTenant(tenant_id, q);
    } else {
      pacientes = await getPacientesByTenant(tenant_id);
    }

    res.json(pacientes);
  } catch (error) {
    console.error('Error al obtener pacientes:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST: Crear nuevo paciente para el tenant
router.post('/', async (req, res) => {
  try {
    const { nombre, edad, sexo, estado_civil, medicamentos, observaciones } = req.body;
    const tenant_id = req.tenant_id; // Del middleware de autenticación

    if (!nombre || nombre.trim() === '') {
      return res.status(400).json({ error: 'El nombre es requerido' });
    }

    const paciente = await crearPacienteTenant(tenant_id, {
      nombre: nombre.trim(),
      edad,
      sexo,
      estado_civil,
      medicamentos,
      observaciones
    });

    res.status(201).json(paciente);
  } catch (error) {
    console.error('Error al crear paciente:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET: Obtener un paciente específico (solo del tenant autenticado)
router.get('/:id', async (req, res) => {
  try {
    const tenant_id = req.tenant_id;
    const paciente = await getPacienteByIdTenant(req.params.id, tenant_id);
    if (!paciente) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }
    res.json(paciente);
  } catch (error) {
    console.error('Error al obtener paciente:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT: Actualizar paciente (solo del tenant autenticado)
router.put('/:id', async (req, res) => {
  try {
    const tenant_id = req.tenant_id;
    const paciente = await getPacienteByIdTenant(req.params.id, tenant_id);
    if (!paciente) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }

    const { nombre, edad, sexo, estado_civil, medicamentos, observaciones } = req.body;

    const actualizado = await actualizarPaciente(req.params.id, {
      nombre: nombre || paciente.nombre,
      edad: edad !== undefined ? edad : paciente.edad,
      sexo: sexo || paciente.sexo,
      estado_civil: estado_civil || paciente.estado_civil,
      medicamentos: medicamentos || paciente.medicamentos,
      observaciones: observaciones || paciente.observaciones
    });

    res.json(actualizado);
  } catch (error) {
    console.error('Error al actualizar paciente:', error);
    res.status(500).json({ error: error.message });
  }
});

// PATCH: Toggle status (activo/standby) - solo del tenant autenticado
router.patch('/:id/status', async (req, res) => {
  try {
    const tenant_id = req.tenant_id;
    const paciente = await getPacienteByIdTenant(req.params.id, tenant_id);
    if (!paciente) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }

    const actualizado = await toggleStatusPaciente(req.params.id);
    res.json(actualizado);
  } catch (error) {
    console.error('Error al cambiar status:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE: Eliminar paciente (con todos sus tests) - solo del tenant autenticado
router.delete('/:id', async (req, res) => {
  try {
    const tenant_id = req.tenant_id;
    const paciente = await getPacienteByIdTenant(req.params.id, tenant_id);
    if (!paciente) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }

    const eliminado = await deletePaciente(req.params.id);
    if (!eliminado) {
      return res.status(400).json({ error: 'No se pudo eliminar el paciente' });
    }

    res.json({ success: true, message: 'Paciente y sus tests eliminados correctamente' });
  } catch (error) {
    console.error('Error al eliminar paciente:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET: Obtener pruebas de un paciente (solo del tenant autenticado)
router.get('/:id/pruebas', async (req, res) => {
  try {
    const tenant_id = req.tenant_id;
    const paciente = await getPacienteByIdTenant(req.params.id, tenant_id);
    if (!paciente) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }

    const pruebas = await obtenerPruebasPaciente(req.params.id, tenant_id);
    res.json(pruebas);
  } catch (error) {
    console.error('Error al obtener pruebas:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
