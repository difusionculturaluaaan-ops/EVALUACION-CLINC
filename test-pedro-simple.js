/**
 * Test SCL-90R para Pedro - Versión Simple
 * 1. Espera a que abras el test en Edge
 * 2. Automatiza todo lo demás
 */

const { TestRunner } = require('./.claude/skills/graph-consistency-verifier/test-runner.js');

async function testPedroSimple() {
  console.log('\n╔═══════════════════════════════════════════════════════════════════╗');
  console.log('║      Test SCL-90R para Pedro - Versión Simplificada              ║');
  console.log('╚═══════════════════════════════════════════════════════════════════╝\n');

  const runner = new TestRunner({
    testType: 'SCL90R-Pedro',
    baseUrl: 'http://localhost:3000',
    outputDir: './test-results/pedro',
    headless: false
  });

  try {
    console.log('═══════════════════════════════════════════════════════════════════\n');
    console.log('📋 INSTRUCCIONES:\n');
    console.log('   1. En Edge, haz login con: demo@clinica.com / demo123456!');
    console.log('   2. Selecciona a PEDRO como paciente');
    console.log('   3. Abre el test SCL-90R');
    console.log('\n   ⏳ El script espera 15 segundos...\n');
    console.log('═══════════════════════════════════════════════════════════════════\n');

    await runner.init();
    await runner.page.goto(runner.baseUrl, { waitUntil: 'networkidle' });

    // Esperar 30 segundos a que el usuario abra el test
    console.log('⏳ Esperando a que abras el test SCL-90R en Edge (30 segundos)...\n');

    let testFound = false;
    let lastRadioCount = 0;

    for (let i = 0; i < 30; i++) {
      await runner.page.waitForTimeout(1000);

      const radios = await runner.page.$$('input[type="radio"]');
      lastRadioCount = radios.length;

      process.stdout.write('.');

      if (radios.length > 50) {
        testFound = true;
        break;
      }
    }

    console.log('\n');

    if (!testFound) {
      console.log('\n⚠️  No se detectó el test después de 30 segundos.');
      console.log(`   Se encontraron ${lastRadioCount} inputs de radio (se necesitan al menos 50)\n`);
      console.log('   Verifica que:\n');
      console.log('   ✓ Hayas hecho login con: demo@clinica.com / demo123456!');
      console.log('   ✓ Hayas seleccionado a PEDRO como paciente');
      console.log('   ✓ Estés en la página del test SCL-90R\n');
      console.log('   Intenta ejecutar el script de nuevo una vez abras el test.\n');
      await runner.close();
      return;
    }

    console.log('✅ ¡Test detectado! Automatizando...\n');
    console.log('═══════════════════════════════════════════════════════════════════\n');

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
testPedroSimple().catch(console.error);
