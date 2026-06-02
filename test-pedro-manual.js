/**
 * Test SCL-90R para Pedro - Versión Interactiva
 * TÚ haces login y abres el test, el script automatiza lo demás
 */

const { TestRunner } = require('./.claude/skills/graph-consistency-verifier/test-runner.js');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise(resolve => rl.question(prompt, resolve));
}

async function testPedroInteractive() {
  console.log('\n╔═══════════════════════════════════════════════════════════════════╗');
  console.log('║         Test SCL-90R para Pedro - INTERACTIVO                     ║');
  console.log('╚═══════════════════════════════════════════════════════════════════╝\n');

  const runner = new TestRunner({
    testType: 'SCL90R-Pedro',
    baseUrl: 'http://localhost:3000',
    outputDir: './test-results/pedro',
    headless: false
  });

  try {
    await runner.init();

    console.log('🌐 Abriendo aplicación en http://localhost:3000\n');
    await runner.page.goto(runner.baseUrl, { waitUntil: 'networkidle' });

    console.log('═══════════════════════════════════════════════════════════════════\n');
    console.log('📋 PASO 1 - PREPARACIÓN\n');
    console.log('   1️⃣  Haz login en la aplicación');
    console.log('   2️⃣  Selecciona a PEDRO como paciente');
    console.log('   3️⃣  Abre el test SCL-90R\n');

    const ready = await question('⏳ ¿Ya abriste el test SCL-90R? (escribe: sí)\n→ ');

    if (ready.toLowerCase() !== 'sí' && ready.toLowerCase() !== 'si') {
      console.log('\n⚠️  Operación cancelada. Abre el test e intenta de nuevo.\n');
      await runner.close();
      rl.close();
      return;
    }

    console.log('\n═══════════════════════════════════════════════════════════════════\n');
    console.log('🤖 PASO 2 - AUTOMATIZACIÓN\n');
    console.log('   ✓ Completando 90 ítems automáticamente...');
    console.log('   ✓ Calculando resultados...');
    console.log('   ✓ Verificando gráfico...');
    console.log('   ✓ Descargando PDF...\n');

    const results = await runner.runFullTest({
      itemCount: 90,
      screenshotResults: true,
      downloadPDF: true,
      verifyGraph: true
    });

    console.log('\n═══════════════════════════════════════════════════════════════════\n');
    console.log('✅ TEST COMPLETADO PARA PEDRO\n');
    console.log('📊 RESUMEN:\n');
    console.log(`   Items completados: ${results.itemsCompleted}/90`);
    console.log(`   Gráfico verificado: ${results.graphVerified ? '✅ SÍ' : '❌ NO'}`);
    console.log(`   PDF descargado: ${results.pdfPath ? '✅ SÍ' : '❌ NO'}\n`);

    if (results.pdfPath) {
      console.log(`📁 UBICACIÓN DEL PDF:\n`);
      console.log(`   ${results.pdfPath}\n`);
      console.log('📋 El PDF incluye:');
      console.log('   ✓ Tabla de escalas (9 subescalas)');
      console.log('   ✓ Índices globales (IST, TSP, MRSP)');
      console.log('   ✓ Gráfico "Perfil de Subescalas" (Paciente vs Población Normal)');
      console.log('   ✓ Interpretación de resultados');
      console.log('   ✓ Datos de validación profesional\n');
    }

    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('¡Listo! Puedes revisar el PDF en la carpeta test-results/pedro/\n');

  } catch (error) {
    console.error('\n❌ Error durante el test:', error.message);
  } finally {
    rl.close();
    await runner.close();
  }
}

// Ejecutar
testPedroInteractive().catch(console.error);
