#!/usr/bin/env node

/**
 * Script seguro para transferir paciente entre tenants
 * Uso: node transfer-patient-safe.js
 */

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function main() {
  console.log('🔄 Iniciando transferencia de paciente entre tenants...\n');

  try {
    // PASO 1: Obtener IDs de tenants
    console.log('📍 PASO 1: Buscando tenants...');
    const tenantsResult = await pool.query(
      `SELECT id, nombre, slug FROM tenants WHERE nombre ILIKE $1 OR nombre ILIKE $2`,
      ['%demo%', '%claudia%']
    );

    if (tenantsResult.rows.length < 2) {
      console.error('❌ ERROR: No se encontraron ambos tenants (Demo y Claudia)');
      console.log('Tenants encontrados:', tenantsResult.rows);
      process.exit(1);
    }

    const demoTenant = tenantsResult.rows.find(t => t.nombre.toLowerCase().includes('demo'));
    const claudiaTenant = tenantsResult.rows.find(t => t.nombre.toLowerCase().includes('claudia'));

    console.log(`✓ Tenant Demo: ID=${demoTenant.id}, nombre="${demoTenant.nombre}"`);
    console.log(`✓ Tenant Claudia: ID=${claudiaTenant.id}, nombre="${claudiaTenant.nombre}"\n`);

    // PASO 2: Encontrar al paciente Roberto en Demo
    console.log('📍 PASO 2: Buscando paciente "Roberto Solis Zamora" en Demo...');
    const pacienteResult = await pool.query(
      `SELECT id, nombre, edad, sexo FROM pacientes
       WHERE nombre ILIKE $1 AND tenant_id = $2`,
      ['%roberto%solis%', demoTenant.id]
    );

    if (pacienteResult.rows.length === 0) {
      console.error('❌ ERROR: No se encontró "Roberto Solis Zamora" en Demo');
      process.exit(1);
    }

    const paciente = pacienteResult.rows[0];
    console.log(`✓ Paciente encontrado: ID=${paciente.id}, nombre="${paciente.nombre}"\n`);

    // PASO 3: Contar pruebas del paciente
    console.log('📍 PASO 3: Contando pruebas del paciente...');
    const pruebasResult = await pool.query(
      `SELECT id, tipo, fecha FROM pruebas
       WHERE paciente_id = $1 AND tenant_id = $2`,
      [paciente.id, demoTenant.id]
    );

    console.log(`✓ Se encontraron ${pruebasResult.rows.length} pruebas:`);
    pruebasResult.rows.forEach(p => {
      console.log(`  - ${p.tipo} (ID: ${p.id}, Fecha: ${new Date(p.creado_en).toLocaleDateString()})`);
    });
    console.log('');

    // PASO 4: TRANSFERENCIA ATÓMICA
    console.log('📍 PASO 4: Ejecutando transferencia atómica...\n');
    console.log('⚠️  Iniciando transacción...');

    await pool.query('BEGIN');

    // Actualizar paciente
    const updatePaciente = await pool.query(
      `UPDATE pacientes SET tenant_id = $1 WHERE id = $2 RETURNING id, nombre, tenant_id`,
      [claudiaTenant.id, paciente.id]
    );
    console.log(`✓ Paciente actualizado: ${updatePaciente.rows[0].nombre} → Tenant ${claudiaTenant.nombre}`);

    // Actualizar pruebas
    const updatePruebas = await pool.query(
      `UPDATE pruebas SET tenant_id = $1 WHERE paciente_id = $2 AND tenant_id = $3 RETURNING id, tipo`,
      [claudiaTenant.id, paciente.id, demoTenant.id]
    );
    console.log(`✓ ${updatePruebas.rows.length} pruebas actualizadas:`);
    updatePruebas.rows.forEach(p => console.log(`  - ${p.tipo}`));

    await pool.query('COMMIT');
    console.log('\n✅ Transacción completada exitosamente\n');

    // PASO 5: VALIDACIÓN
    console.log('📍 PASO 5: Validando transferencia...\n');

    const validacion1 = await pool.query(
      `SELECT id, nombre, tenant_id FROM pacientes WHERE id = $1`,
      [paciente.id]
    );
    const pacienteValidado = validacion1.rows[0];
    console.log(`✓ Paciente ahora en tenant: ${claudiaTenant.nombre} (ID: ${pacienteValidado.tenant_id})`);

    const validacion2 = await pool.query(
      `SELECT COUNT(*) as total FROM pruebas WHERE paciente_id = $1 AND tenant_id = $2`,
      [paciente.id, claudiaTenant.id]
    );
    console.log(`✓ Todas las ${validacion2.rows[0].total} pruebas están en tenant Claudia`);

    const validacion3 = await pool.query(
      `SELECT COUNT(*) as total FROM pruebas WHERE paciente_id = $1 AND tenant_id = $2`,
      [paciente.id, demoTenant.id]
    );
    console.log(`✓ Cero pruebas restantes en tenant Demo (${validacion3.rows[0].total})`);

    console.log('\n✅ ¡TRANSFERENCIA COMPLETADA EXITOSAMENTE!\n');
    console.log(`📊 Resumen:`);
    console.log(`   Paciente: ${paciente.nombre}`);
    console.log(`   De Tenant: ${demoTenant.nombre}`);
    console.log(`   A Tenant: ${claudiaTenant.nombre}`);
    console.log(`   Pruebas transferidas: ${pruebasResult.rows.length}`);
    console.log('');

  } catch (error) {
    console.error('\n❌ ERROR durante la transferencia:');
    console.error(error.message);

    // Hacer rollback si hay error
    try {
      await pool.query('ROLLBACK');
      console.log('↩️  Rollback ejecutado - Sin cambios aplicados');
    } catch (e) {
      // Ignorar si no hay transacción activa
    }

    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
