#!/usr/bin/env node

/**
 * Test SCL-90R para Pedro - SEMI-AUTOMÁTICO
 * TÚ: Haces login en Edge
 * SCRIPT: Automatiza el resto (test + PDF)
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function runTest() {
  console.log('\n╔═══════════════════════════════════════════════════════════════════╗');
  console.log('║    Test SCL-90R para Pedro - SEMI-AUTOMÁTICO (Manual + Script)   ║');
  console.log('╚═══════════════════════════════════════════════════════════════════╝\n');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 100  // Ralentizar para ver mejor
  });
  const page = await browser.newPage();
  const outputDir = './test-results/pedro';

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('📋 INSTRUCCIONES - PASO MANUAL\n');

    console.log('🌐 Abriendo http://localhost:3000 en Edge...\n');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    console.log('🔒 AHORA TÚ DEBES HACER LO SIGUIENTE EN EDGE:\n');
    console.log('   1. Ingresa Email: demo@clinica.com');
    console.log('   2. Ingresa Contraseña: demo123456!');
    console.log('   3. Haz clic en "Entrar"');
    console.log('   4. Selecciona PEDRO como paciente');
    console.log('   5. Abre el test SCL-90R\n');
    console.log('⏳ Esperando... (120 segundos = 2 minutos)\n');
    console.log('═══════════════════════════════════════════════════════════════════\n');

    // Esperar a que el usuario abra el test (no solo haga login)
    let testReady = false;
    for (let i = 0; i < 120; i++) {
      const radios = await page.locator('input[type="radio"]').all();
      if (radios.length > 50) {
        testReady = true;
        break;
      }

      process.stdout.write('.');
      if ((i + 1) % 30 === 0) {
        process.stdout.write(` ${i + 1}s\n`);
      }

      await page.waitForTimeout(1000);
    }

    console.log('\n');

    if (!testReady) {
      console.log('⏱️  Se acabó el tiempo. No se detectó el test.\n');
      console.log('💡 Verifica que:\n');
      console.log('   ✓ Hayas hecho login correctamente');
      console.log('   ✓ Hayas seleccionado PEDRO');
      console.log('   ✓ Estés en la página del test SCL-90R\n');
      await browser.close();
      return;
    }

    console.log('\n✅ TEST ABIERTO! Continuando con la automatización...\n');
    await page.waitForTimeout(3000);

    // PASO 2: BUSCAR Y ABRIR SCL-90R
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('📋 PASO 1: ABRIENDO TEST SCL-90R\n');

    console.log('🔍 Buscando botón SCL-90R...');
    const sclButtons = await page.locator('button:has-text("SCL-90R"), button:has-text("SCL")').all();
    console.log(`   Se encontraron ${sclButtons.length} botones\n`);

    if (sclButtons.length > 0) {
      console.log('✓ Haciendo clic...\n');
      await sclButtons[0].click();
      await page.waitForTimeout(4000);
    }

    // PASO 3: DETECTAR ÍTEMS
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('✍️  PASO 2: COMPLETANDO TEST\n');

    const radios = await page.locator('input[type="radio"]').all();
    console.log(`📝 Se encontraron ${radios.length} ítems\n`);

    if (radios.length < 50) {
      console.log('⚠️  No hay suficientes ítems. Verifica que estés en el test correcto.\n');
      await browser.close();
      return;
    }

    // Completar items
    console.log('🤖 Completando automáticamente...\n');
    let completed = 0;

    for (let i = 0; i < Math.min(180, radios.length); i++) {
      if (i % 2 === 0) {
        try {
          await radios[i].click();
          completed++;
        } catch (e) {
          // continuar
        }
      }
      process.stdout.write('.');
      if (completed % 50 === 0 && completed > 0) {
        process.stdout.write(` ${completed}\n`);
      }
    }

    console.log(`\n✅ ${completed} ítems completados\n`);

    // PASO 4: CALCULAR
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('🔢 PASO 3: CALCULANDO RESULTADOS\n');

    const calcBtn = await page.locator('button:has-text("Calcular"), button:has-text("Resultado")').first();
    if (await calcBtn.count() > 0) {
      console.log('✓ Haciendo clic en "Calcular"...\n');
      await calcBtn.click();
      await page.waitForTimeout(2000);
    }

    // PASO 5: SCREENSHOT
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('📸 PASO 4: CAPTURANDO SCREENSHOT\n');

    const screenshotPath = path.join(outputDir, `pedro-resultados-${Date.now()}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`✅ Screenshot: ${screenshotPath}\n`);

    // PASO 6: DESCARGAR PDF
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('📄 PASO 5: DESCARGANDO PDF\n');

    const pdfBtn = await page.locator('button:has-text("PDF"), button:has-text("Descargar")').first();
    let pdfPath = null;

    if (await pdfBtn.count() > 0) {
      try {
        console.log('⏳ Iniciando descarga...\n');
        const downloadPromise = page.waitForEvent('download', { timeout: 10000 });
        await pdfBtn.click();
        const download = await downloadPromise;

        const filename = `pedro-scl90r-${Date.now()}.pdf`;
        pdfPath = path.join(outputDir, filename);
        await download.saveAs(pdfPath);

        console.log(`✅ PDF descargado!\n`);
      } catch (error) {
        console.log(`⚠️  Error en descarga: ${error.message}\n`);
      }
    }

    // RESULTADO FINAL
    console.log('\n╔═══════════════════════════════════════════════════════════════════╗');
    console.log('║                    ✅ TEST COMPLETADO                            ║');
    console.log('╚═══════════════════════════════════════════════════════════════════╝\n');

    console.log('📊 RESUMEN FINAL:\n');
    console.log(`   ✅ Items: ${completed}/90`);
    console.log(`   ✅ Screenshot: ${screenshotPath.replace(/\\/g, '/')}`);
    console.log(`   ✅ PDF: ${pdfPath ? pdfPath.replace(/\\/g, '/') : 'NO'}\n`);

    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('¡Listo! Todo guardado en: ./test-results/pedro/\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    console.log('👋 Presiona Ctrl+C para cerrar\n');
    // No cerrar el browser automáticamente para que veas el resultado
  }
}

// Ejecutar
runTest().catch(console.error);
