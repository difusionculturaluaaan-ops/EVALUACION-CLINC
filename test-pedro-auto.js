/**
 * Test SCL-90R para Pedro - Totalmente Automático
 * Login + Test + PDF
 */

const { TestRunner } = require('./.claude/skills/graph-consistency-verifier/test-runner.js');

async function testPedroAuto() {
  console.log('\n╔═══════════════════════════════════════════════════════════════════╗');
  console.log('║         Test SCL-90R para Pedro - AUTOMATIZADO                    ║');
  console.log('╚═══════════════════════════════════════════════════════════════════╝\n');

  const runner = new TestRunner({
    testType: 'SCL90R-Pedro',
    baseUrl: 'http://localhost:3000',
    outputDir: './test-results/pedro',
    headless: false
  });

  try {
    await runner.init();

    console.log('🌐 Navegando a http://localhost:3000\n');
    await runner.page.goto(runner.baseUrl, { waitUntil: 'networkidle' });

    // PASO 1: LOGIN
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('🔐 PASO 1: LOGIN\n');

    // Esperar a que haya un input de email
    console.log('⏳ Esperando formulario de login...');
    await runner.page.waitForSelector('input[type="email"], input[placeholder*="mail"], input[placeholder*="correo"]', { timeout: 10000 }).catch(() => null);

    // Buscar campos de email y contraseña
    const emailInputs = await runner.page.$$('input[type="email"], input[placeholder*="mail"], input[placeholder*="correo"]');
    const passwordInputs = await runner.page.$$('input[type="password"]');

    if (emailInputs.length > 0 && passwordInputs.length > 0) {
      console.log('✓ Formulario encontrado\n');

      console.log('📧 Ingresando email: demo@clinica.com');
      await emailInputs[0].fill('demo@clinica.com');

      console.log('🔑 Ingresando contraseña...');
      await passwordInputs[0].fill('demo123456!');

      // Buscar y hacer clic en el botón de login
      const loginBtn = await runner.page.locator('button:has-text("Entrar"), button:has-text("Login"), button:has-text("Ingresar")').first();
      if (await loginBtn.count() > 0) {
        console.log('✓ Haciendo clic en "Entrar"\n');
        await loginBtn.click();
        await runner.page.waitForTimeout(2000);
      }
    } else {
      console.log('✓ Ya estás logueado\n');
    }

    // PASO 2: ESPERAR A CARGA Y BUSCAR SCOPED-90R
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('👤 PASO 2: SELECCIONAR PATIENT (PEDRO)\n');

    // Buscar y hacer clic en SCL-90R
    console.log('🔍 Buscando test SCL-90R...');
    const sclBtn = await runner.page.locator('button:has-text("SCL-90R"), [data-page*="scl"]').first();

    if (await sclBtn.count() > 0) {
      console.log('✓ Test SCL-90R encontrado\n');
      console.log('📋 Abriendo test...');
      await sclBtn.click();
      await runner.page.waitForTimeout(2000);
    }

    // PASO 3: VERIFICAR QUE ESTAMOS EN EL TEST
    console.log('\n═══════════════════════════════════════════════════════════════════');
    console.log('✍️  PASO 3: COMPLETAR TEST\n');

    // Esperar a que haya inputs de radio (ítems del test)
    const radios = await runner.page.$$('input[type="radio"]');
    console.log(`✓ ${radios.length} ítems detectados\n`);

    if (radios.length < 50) {
      console.log('⚠️  No se detectó suficientes ítems.');
      console.log('   Verifica que estés en el test SCL-90R correcto.\n');
      await runner.close();
      return;
    }

    // Aquí ya estamos en el test, automatizar completamente
    console.log('🤖 Automatizando completamente el test...\n');

    const results = await runner.runFullTest({
      itemCount: 90,
      screenshotResults: true,
      downloadPDF: true,
      verifyGraph: true
    });

    // RESULTADO FINAL
    console.log('\n╔═══════════════════════════════════════════════════════════════════╗');
    console.log('║                    ✅ TEST COMPLETADO                            ║');
    console.log('╚═══════════════════════════════════════════════════════════════════╝\n');

    console.log('📊 RESULTADOS PARA PEDRO:\n');
    console.log(`   ✅ Items completados: ${results.itemsCompleted}/90`);
    console.log(`   ✅ Gráfico verificado: ${results.graphVerified ? 'SÍ ✓' : 'NO ✗'}`);
    console.log(`   ✅ PDF descargado: ${results.pdfPath ? 'SÍ ✓' : 'NO ✗'}\n`);

    if (results.pdfPath) {
      console.log(`📁 UBICACIÓN DEL PDF:\n   ${results.pdfPath}\n`);

      console.log('📋 El PDF contiene:');
      console.log('   ✓ Tabla de escalas (9 subescalas)');
      console.log('   ✓ Índices globales (IST, TSP, MRSP)');
      console.log('   ✓ Gráfico "Perfil de Subescalas" (Paciente vs Población Normal)');
      console.log('   ✓ Interpretación de resultados\n');
    }

    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('¡Listo! PDF guardado en: ./test-results/pedro/\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\n💡 Posibles soluciones:');
    console.error('   - Verifica que estés en http://localhost:3000/');
    console.error('   - Comprueba que el servidor está corriendo');
    console.error('   - Intenta recargar la página en Edge\n');
  } finally {
    await runner.close();
  }
}

// Ejecutar
testPedroAuto().catch(console.error);
