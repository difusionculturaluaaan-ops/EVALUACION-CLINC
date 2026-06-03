-- =============================================================================
-- TRANSFERIR PACIENTE ENTRE TENANTS - SCRIPT SEGURO
-- =============================================================================
--
-- Propósito: Transferir Roberto Solis Zamora (y todos sus tests) del
--            tenant DEMO al tenant de CLAUDIA MARTÍN DEL CAMPO
--
-- PASOS:
-- 1. Encontrar IDs de los tenants
-- 2. Verificar que el paciente existe en Demo
-- 3. Actualizar tenant_id en pacientes y pruebas
-- 4. Validar que la transferencia fue exitosa
-- =============================================================================

-- PASO 1: Encontrar los IDs de los tenants
SELECT id, nombre, slug FROM tenants WHERE nombre LIKE '%Demo%' OR nombre LIKE '%Claudia%';

-- PASO 2: Guardar los IDs encontrados (reemplazar en queries siguientes)
-- Demo tenant_id = ?
-- Claudia tenant_id = ?

-- PASO 3: Verificar que Roberto Solis Zamora existe en Demo
SELECT id, nombre, tenant_id FROM pacientes
WHERE nombre ILIKE '%Roberto%Solis%' AND tenant_id = ?;

-- PASO 4: Ver todas las pruebas de Roberto en Demo
SELECT id, tipo, creado_en, tenant_id FROM pruebas
WHERE paciente_id = (SELECT id FROM pacientes WHERE nombre ILIKE '%Roberto%Solis%' AND tenant_id = ?)
AND tenant_id = ?;

-- =============================================================================
-- TRANSFERENCIA ATÓMICA (ejecutar todo junto)
-- =============================================================================
BEGIN;

-- Actualizar paciente
UPDATE pacientes
SET tenant_id = ?
WHERE nombre ILIKE '%Roberto%Solis%' AND tenant_id = ?;

-- Actualizar todas sus pruebas
UPDATE pruebas
SET tenant_id = ?
WHERE paciente_id = (SELECT id FROM pacientes WHERE nombre ILIKE '%Roberto%Solis%' AND tenant_id = ?)
AND tenant_id = ?;

COMMIT;

-- =============================================================================
-- VALIDACIÓN FINAL
-- =============================================================================

-- Verificar que Roberto está en el nuevo tenant
SELECT id, nombre, tenant_id FROM pacientes
WHERE nombre ILIKE '%Roberto%Solis%';

-- Verificar que todas sus pruebas están en el nuevo tenant
SELECT id, paciente_id, tipo, tenant_id FROM pruebas
WHERE paciente_id = (SELECT id FROM pacientes WHERE nombre ILIKE '%Roberto%Solis%');

-- Verificar que NO quedan datos en el tenant Demo
SELECT COUNT(*) as pruebas_restantes FROM pruebas
WHERE paciente_id = (SELECT id FROM pacientes WHERE nombre ILIKE '%Roberto%Solis%')
AND tenant_id NOT IN (SELECT id FROM tenants WHERE nombre LIKE '%Claudia%');
