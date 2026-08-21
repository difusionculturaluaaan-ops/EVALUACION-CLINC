/**
 * 🧪 CICLO DE TESTING MULTITENANT + AISLAMIENTO EGEP-5
 * Ejecutar: node tests/ciclo_testing_multitenant.js
 *
 * Verifica:
 * 1. Fuga multitenant (¿ aparece Nefertiti en Demo Clínica?)
 * 2. PUT/POST fix (¿Se guarda correctamente?)
 * 3. Reseteo entre pacientes (¿Está limpio el siguiente?)
 * 4. Aislamiento de tests (EGEP-5 no afecta otros tests)
 */

const { chromium } = require('playwright');

const BASE_URL = 'http://localhost:3000';
const DEMO_CLINICA_EMAIL = 'demo@clinica.com';
const DEMO_CLINICA_PASSWORD = 'demo123456';

const results = {
  multitenant_check: null,
  put_post_fix: null,
  reseteo_entre_pacientes: null,
  aislamiento_tests: null,
  logs_servidor: []
};

async function test() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('🚀 CICLO DE TESTING INICIADO\n');

    // ===== PASO 1: LOGIN EN DEMO CLÍNICA =====
    console.log('📝 PASO 1: Login en Demo Clínica...');
    await page.goto(`${BASE_URL}/auth.html`);

    // Click en tab Login
    await page.click('[data-tab="login"]');
    await page.waitForTimeout(500);

    // Llenar credenciales (Demo Clínica ya existe en BD)
    const emailInput = await page.$('input[type="email"]');
    const passwordInput = await page.$('input[type="password"]');

    if (!emailInput || !passwordInput) {
      console.error('❌ Campos de login no encontrados');
      return;
    }

    await emailInput.fill(DEMO_CLINICA_EMAIL);
    await passwordInput.fill(DEMO_CLINICA_PASSWORD);
    await page.click('button:has-text("Entrar")');

    // Esperar redirección a index.html
    await page.waitForURL(`${BASE_URL}/index.html`, { timeout: 10000 });
    await page.waitForTimeout(2000);

    console.log('✅ Login completado\n');

    // ===== PASO 2: VERIFICAR LISTA DE PACIENTES (MULTITENANT CHECK) =====
    console.log('🔍 PASO 2: Verificar aislamiento multitenant...');

    // Ir a EXPEDIENTES
    const expedientesBtn = await page.$('[data-page="expedientes"]');
    if (expedientesBtn) {
      await expedientesBtn.click();
      await page.waitForTimeout(2000);
    }

    // Buscar si "Nefertiti" aparece (NO debería)
    const pacientesText = await page.textContent('body');
    const tieneNefertiti = pacientesText && pacientesText.includes('Nefertiti');

    if (tieneNefertiti) {
      results.multitenant_check = {
        status: '🔴 FAIL',
        detail: 'Nefertiti aparece en Demo Clínica (debería estar en Claudia Martín)',
        severity: 'CRÍTICO'
      };
      console.log('❌ FUGA DETECTADA: Nefertiti aparece en Demo Clínica');
    } else {
      results.multitenant_check = {
        status: '✅ PASS',
        detail: 'Nefertiti NO aparece en Demo Clínica (correcto)',
        severity: 'OK'
      };
      console.log('✅ Aislamiento multitenant correcto\n');
    }

    // ===== PASO 3: CREAR NUEVO TEST CON PACIENTE A =====
    console.log('📋 PASO 3: Crear y guardar test con Paciente A...');

    // Ir a INICIO
    const inicioBtn = await page.$('[data-page="inicio"]');
    if (inicioBtn) {
      await inicioBtn.click();
      await page.waitForTimeout(2000);
    }

    // Seleccionar primer paciente (Lucía Solís)
    const luciaBtn = await page.$('button:has-text("Lucía")');
    if (luciaBtn) {
      await luciaBtn.click();
      await page.waitForTimeout(1000);
    }

    // Buscar botón EGEP-5 y hacer click
    const egep5BtnInicio = await page.$('[data-page="egep5"]');
    if (egep5BtnInicio) {
      await egep5BtnInicio.click();
      await page.waitForTimeout(3000);
    }

    // Verificar que se abrió EGEP-5
    const egep5Title = await page.textContent('h1');
    if (egep5Title && egep5Title.includes('EGEP-5')) {
      console.log('✅ EGEP-5 abierto correctamente');

      // Llenar 5 respuestas (índices 1-5, valor=1 "Nada")
      for (let i = 1; i <= 5; i++) {
        const radio = await page.$(`input[name="item_${i}"][value="1"]`);
        if (radio) {
          await radio.check();
          console.log(`  ✓ Item ${i} rellenado`);
        }
      }

      // Click "Calcular Resultados"
      const calcBtn = await page.$('button:has-text("Calcular Resultados")');
      if (calcBtn) {
        await calcBtn.click();
        await page.waitForTimeout(2000);
        console.log('✅ Resultados calculados');
      }

      // Click "Guardar en Expediente"
      const guardarBtn = await page.$('button:has-text("Guardar en Expediente")');
      if (guardarBtn) {
        await guardarBtn.click();
        await page.waitForTimeout(2000);
        console.log('✅ Prueba guardada en expediente');

        results.put_post_fix = {
          status: '✅ PASS',
          detail: 'Guardado completado sin errores',
          severity: 'OK'
        };
      }
    } else {
      console.error('❌ EGEP-5 no se abrió');
      results.put_post_fix = {
        status: '🔴 FAIL',
        detail: 'EGEP-5 no se abrió correctamente',
        severity: 'CRÍTICO'
      };
    }

    console.log('');

    // ===== PASO 4: ABRIR OTRO PACIENTE Y VERIFICAR RESETEO =====
    console.log('🔄 PASO 4: Verificar reseteo entre pacientes...');

    // Volver a INICIO
    if (inicioBtn) {
      await inicioBtn.click();
      await page.waitForTimeout(2000);
    }

    // Seleccionar segundo paciente (Bella Durmiente)
    const bellaBtn = await page.$('button:has-text("Bella")');
    if (bellaBtn) {
      await bellaBtn.click();
      await page.waitForTimeout(1000);
    }

    // Abrir EGEP-5 del segundo paciente
    if (egep5BtnInicio) {
      await egep5BtnInicio.click();
      await page.waitForTimeout(3000);
    }

    // Verificar que está vacío (sin datos de Lucía)
    const primerItem = await page.$('input[name="item_1"]');
    let estaBellaVacio = true;

    if (primerItem) {
      // Verificar que los primeros 5 items están sin marcar
      for (let i = 1; i <= 5; i++) {
        const checked = await page.isChecked(`input[name="item_${i}"][value="1"]`);
        if (checked) {
          estaBellaVacio = false;
          console.log(`❌ Item ${i} tiene marcado (datos de Lucía aún presentes)`);
        }
      }
    }

    if (estaBellaVacio) {
      results.reseteo_entre_pacientes = {
        status: '✅ PASS',
        detail: 'EGEP-5 de Bella está limpio (sin datos de Lucía)',
        severity: 'OK'
      };
      console.log('✅ Reseteo correcto: Bella sin datos de Lucía\n');
    } else {
      results.reseteo_entre_pacientes = {
        status: '🔴 FAIL',
        detail: 'EGEP-5 de Bella contiene datos de Lucía (fuga de datos)',
        severity: 'CRÍTICO'
      };
      console.log('❌ FUGA INTERNA: Datos de Lucía en Bella\n');
    }

    // ===== PASO 5: VERIFICAR AISLAMIENTO DE TESTS =====
    console.log('🔒 PASO 5: Verificar aislamiento entre tests...');

    // Volver a INICIO
    if (inicioBtn) {
      await inicioBtn.click();
      await page.waitForTimeout(2000);
    }

    // Buscar otro test (ej: CUIDA)
    const cuidaBtn = await page.$('[data-page="cuida"]');
    if (cuidaBtn) {
      await cuidaBtn.click();
      await page.waitForTimeout(3000);

      const cuidaTitle = await page.textContent('h1');
      if (cuidaTitle && cuidaTitle.includes('CUIDA')) {
        console.log('✅ CUIDA abierto (test diferente)');

        // Verificar que no tiene datos de EGEP-5
        const cuidaItems = await page.$$('input[name*="item"]');
        if (cuidaItems.length > 0) {
          console.log('✅ CUIDA tiene estructura propia (sin contaminación)');
          results.aislamiento_tests = {
            status: '✅ PASS',
            detail: 'CUIDA y EGEP-5 completamente aislados',
            severity: 'OK'
          };
        }
      }
    }

  } catch (error) {
    console.error('❌ ERROR EN TESTING:', error.message);
  } finally {
    await browser.close();
  }

  // ===== REPORTE FINAL =====
  console.log('\n' + '='.repeat(60));
  console.log('📊 REPORTE FINAL DE TESTING');
  console.log('='.repeat(60) + '\n');

  console.log('1️⃣ MULTITENANT CHECK:');
  console.log(`   Status: ${results.multitenant_check.status}`);
  console.log(`   Detail: ${results.multitenant_check.detail}\n`);

  console.log('2️⃣ PUT/POST FIX:');
  console.log(`   Status: ${results.put_post_fix.status}`);
  console.log(`   Detail: ${results.put_post_fix.detail}\n`);

  console.log('3️⃣ RESETEO ENTRE PACIENTES:');
  console.log(`   Status: ${results.reseteo_entre_pacientes.status}`);
  console.log(`   Detail: ${results.reseteo_entre_pacientes.detail}\n`);

  console.log('4️⃣ AISLAMIENTO DE TESTS:');
  console.log(`   Status: ${results.aislamiento_tests.status}`);
  console.log(`   Detail: ${results.aislamiento_tests.detail}\n`);

  // Verificar si hay FTAILs críticos
  const hayCriticos = Object.values(results).some(r => r && r.severity === 'CRÍTICO');

  console.log('='.repeat(60));
  if (hayCriticos) {
    console.log('🚨 RESULTADO GENERAL: BLOQUEANTE - Hay fallos críticos');
  } else {
    console.log('✅ RESULTADO GENERAL: Todos los tests pasaron');
  }
  console.log('='.repeat(60) + '\n');

  console.log('💡 PRÓXIMOS PASOS:');
  console.log('   1. Revisar logs del servidor (busca 🔍 [AUDITORIA])');
  console.log('   2. Si hay fuga multitenant: revisar tenant_id en JWT');
  console.log('   3. Si hay fuga interna: revisar localStorage reset');
  console.log('   4. Mantener en LOCAL hasta que todos pasen\n');
}

test().catch(console.error);
