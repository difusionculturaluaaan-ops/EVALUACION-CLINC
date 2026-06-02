/**
 * Test SCL-90R para Pedro
 * Script automático para completar test, calcular resultados y descargar PDF
 */

const { TestRunner } = require('./.claude/skills/graph-consistency-verifier/test-runner.js');
const path = require('path');

async function testPedroSCL90R() {
  console.log('\n╔═══════════════════════════════════════════════════════════════════╗');
  console.log('║                 Test SCL-90R para Pedro                           ║');
  console.log('╚═══════════════════════════════════════════════════════════════════╝\n');

  const runner = new TestRunner({
    testType: 'SCL90R-Pedro',
    baseUrl: 'http://localhost:3000',
    outputDir: './test-results/pedro',
    headless: false  // Mostrar navegador para que veas el proceso
  });

  try {
    console.log('🚀 Iniciando navegador...\n');
    await runner.init();

    console.log('📍 Navegando a http://localhost:3000\n');
    await runner.page.goto(runner.baseUrl, { waitUntil: 'networkidle' });

    // Dar tiempo para que el usuario vea la app
    console.log('⏳ Espera 3 segundos mientras carga la página...\n');
    await runner.page.waitForTimeout(3000);

    console.log('═══════════════════════════════════════════════════════════════════\n');
    console.log('📋 INSTRUCCIONES:\n');
    console.log('1. El navegador está abierto');
    console.log('2. Haz login si es necesario');
    console.log('3. Selecciona a PEDRO como paciente');
    console.log('4. Abre el test SCL-90R');
    console.log('\n⏳ Esperando a que abras el test...\n');
    console.log('(El script detectará cuando esté listo y completará automáticamente)\n');
    console.log('═══════════════════════════════════════════════════════════════════\n');

    // Esperar a que el usuario navegue al test
    let testReady = false;
    let attempts = 0;
    const maxAttempts = 60; // 60 segundos

    while (!testReady && attempts < maxAttempts) {
      const radios = await runner.page.$$('input[type="radio"]');
      if (radios.length > 50) { // Detecta que estamos en el test (90 ítems = 180+ radios)
        testReady = true;
        console.log('✅ ¡Test SCL-90R detectado!\n');
      } else {
        await runner.page.waitForTimeout(1000);
        attempts++;
      }
    }

    if (!testReady) {
      console.log('⚠️  No se detectó el test después de 60 segundos.');
      console.log('   Verifica que estés en la página correcta del test SCL-90R\n');
      await runner.close();
      return;
    }

    // Ahora automatizar el resto
    console.log('🤖 Automatizando el test...\n');

    const results = await runner.runFullTest({
      itemCount: 90,
      screenshotResults: true,
      downloadPDF: true,
      verifyGraph: true
    });

    // Resumen final
    console.log('\n╔═══════════════════════════════════════════════════════════════════╗');
    console.log('║                    ✅ TEST COMPLETADO                            ║');
    console.log('╚═══════════════════════════════════════════════════════════════════╝\n');

    console.log('📊 RESULTADOS PARA PEDRO:\n');
    console.log(`   ✅ Items completados: ${results.itemsCompleted}/90`);
    console.log(`   ✅ Gráfico verificado: ${results.graphVerified ? 'SÍ ✓' : 'NO ✗'}`);
    console.log(`   ✅ PDF descargado: ${results.pdfPath ? 'SÍ ✓' : 'NO ✗'}\n`);

    if (results.pdfPath) {
      console.log(`📁 Ubicación del PDF:`);
      console.log(`   ${results.pdfPath}\n`);

      console.log('💡 Puedes abrir el PDF para verificar que incluye:');
      console.log('   - Tabla de escalas del paciente');
      console.log('   - Índices (IST, TSP, MRSP)');
      console.log('   - Gráfico "Perfil de Subescalas" ✓');
      console.log('   - Interpretación de resultados\n');

      console.log('📂 PDF guardado y listo para revisar ✓\n');
    }

    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('¡Listo! Los resultados están guardados en ./test-results/pedro/\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nDetalles:', error.stack);
  } finally {
    console.log('\n👋 Cerrando navegador...');
    await runner.close();
    console.log('✅ Proceso finalizado\n');
  }
}

// Ejecutar
testPedroSCL90R().catch(console.error);
