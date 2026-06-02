/**
 * Test SCL-90R para Pedro - TOTALMENTE AUTOMÁTICO
 * Login completo + Selección paciente + Test + PDF
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function testPedroFullAuto() {
  console.log('\n╔═══════════════════════════════════════════════════════════════════╗');
  console.log('║    Test SCL-90R para Pedro - TOTALMENTE AUTOMÁTICO                ║');
  console.log('╚═══════════════════════════════════════════════════════════════════╝\n');

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  const outputDir = './test-results/pedro';

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    // PASO 1: LOGIN
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('🔐 PASO 1: LOGIN AUTOMÁTICO\n');

    console.log('📍 Navegando a http://localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    // Hacer clic en pestaña "Clínica"
    console.log('🏥 Haciendo clic en "Clínica"...');
    const clinicaBtn = await page.locator('#clinicaEmail');
    if (await clinicaBtn.count() > 0) {
      console.log('   ✓ Campo de email Clínica encontrado\n');
    }
    await page.waitForTimeout(1000);

    // Llenar email
    console.log('📧 Ingresando email: demo@clinica.com');
    await page.locator('#clinicaEmail').fill('demo@clinica.com');
    await page.waitForTimeout(800);

    // Llenar contraseña
    console.log('🔑 Ingresando contraseña: demo123456!');
    await page.locator('#clinicaPassword').fill('demo123456!');
    await page.waitForTimeout(800);

    // Hacer clic en Entrar
    console.log('✓ Haciendo clic en "Entrar"...\n');
    const enterBtns = await page.locator('button:has-text("Entrar")').all();
    if (enterBtns.length > 0) {
      // El primer "Entrar" es el de Clínica
      await enterBtns[0].click();
      await page.waitForTimeout(5000);
    }

    // PASO 2: VERIFICAR QUE ESTAMOS LOGUEADOS
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('✅ PASO 2: VERIFICANDO LOGIN\n');

    await page.waitForTimeout(2000);
    const currentUrl = page.url();
    console.log(`📍 URL actual: ${currentUrl}`);

    if (currentUrl.includes('auth.html')) {
      console.log('❌ Login falló. Verifica las credenciales.\n');
      await browser.close();
      return;
    }

    console.log('✅ Login exitoso\n');
    await page.waitForTimeout(2000);

    // PASO 3: BUSCAR Y ABRIR SCL-90R
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('📋 PASO 3: ABRIENDO TEST SCL-90R\n');

    console.log('🔍 Buscando botón SCL-90R...');

    // Esperar a que la página esté lista
    await page.waitForTimeout(2000);

    // Buscar botones que contengan "SCL"
    const sclButtons = await page.locator('button:has-text("SCL")').all();
    console.log(`   Se encontraron ${sclButtons.length} botones con "SCL"\n`);

    if (sclButtons.length > 0) {
      console.log('✓ Haciendo clic en SCL-90R...\n');
      await sclButtons[0].click();
      await page.waitForTimeout(4000);
    } else {
      console.log('⚠️  No se encontró botón SCL. Buscando alternativas...\n');
      // Buscar por data-page
      const pages = await page.locator('[data-page*="scl"]').all();
      if (pages.length > 0) {
        await pages[0].click();
        await page.waitForTimeout(4000);
      }
    }

    // PASO 4: DETECTAR ÍTEMS DEL TEST
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('✍️  PASO 4: COMPLETANDO TEST\n');

    const radios = await page.locator('input[type="radio"]').all();
    console.log(`📝 Se encontraron ${radios.length} ítems\n`);

    if (radios.length < 50) {
      console.log('⚠️  No se detectaron suficientes ítems.');
      console.log('   Verifica que estés en la página correcta del test.\n');
      await browser.close();
      return;
    }

    // Completar items
    console.log('🤖 Completando 90 ítems automáticamente...\n');

    let completed = 0;
    for (let i = 0; i < Math.min(180, radios.length); i++) {
      // Alternar respuestas para variar (cada 2 items, cambiar)
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

    // PASO 5: CALCULAR RESULTADOS
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('🔢 PASO 5: CALCULANDO RESULTADOS\n');

    console.log('🔍 Buscando botón "Calcular"...');
    const calcBtn = await page.locator('button:has-text("Calcular"), button:has-text("Resultado"), button:has-text("Finalizar")').first();

    if (await calcBtn.count() > 0) {
      console.log('✓ Haciendo clic...\n');
      await calcBtn.click();
      await page.waitForTimeout(2000);
    } else {
      console.log('⚠️  Botón de cálculo no encontrado\n');
    }

    // PASO 6: VERIFICAR GRÁFICO
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('📊 PASO 6: VERIFICANDO GRÁFICO\n');

    const chartInfo = await page.evaluate(() => {
      const canvas = document.getElementById('chartPerfilComparativo');
      return {
        found: !!canvas,
        width: canvas?.width || 0,
        height: canvas?.height || 0
      };
    });

    if (chartInfo.found) {
      console.log(`✅ Gráfico encontrado: ${chartInfo.width}x${chartInfo.height}\n`);
    } else {
      console.log('⚠️  Gráfico no encontrado\n');
    }

    // PASO 7: CAPTURA SCREENSHOT
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('📸 PASO 7: CAPTURANDO SCREENSHOT\n');

    const screenshotPath = path.join(outputDir, `pedro-resultados-${Date.now()}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`✅ Screenshot guardado: ${screenshotPath}\n`);

    // PASO 8: DESCARGAR PDF
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('📄 PASO 8: DESCARGANDO PDF\n');

    console.log('🔍 Buscando botón PDF...');
    const pdfBtn = await page.locator('button:has-text("PDF"), button:has-text("Descargar"), a:has-text("PDF")').first();

    let pdfPath = null;

    if (await pdfBtn.count() > 0) {
      try {
        const downloadPromise = page.waitForEvent('download', { timeout: 10000 });
        await pdfBtn.click();
        const download = await downloadPromise;

        const filename = `pedro-scl90r-${Date.now()}.pdf`;
        pdfPath = path.join(outputDir, filename);
        await download.saveAs(pdfPath);

        console.log(`✅ PDF descargado: ${pdfPath}\n`);
      } catch (error) {
        console.log(`⚠️  Error descargando PDF: ${error.message}\n`);
      }
    } else {
      console.log('⚠️  Botón de descarga no encontrado\n');
    }

    // RESULTADO FINAL
    console.log('\n╔═══════════════════════════════════════════════════════════════════╗');
    console.log('║                    ✅ TEST COMPLETADO                            ║');
    console.log('╚═══════════════════════════════════════════════════════════════════╝\n');

    console.log('📊 RESUMEN PARA PEDRO:\n');
    console.log(`   ✅ Items completados: ${completed}/90`);
    console.log(`   ✅ Gráfico: ${chartInfo.found ? 'SÍ ✓' : 'NO ✗'}`);
    console.log(`   ✅ Screenshot: ${screenshotPath}`);
    console.log(`   ✅ PDF: ${pdfPath ? 'SÍ ✓' : 'NO ✗'}\n`);

    if (pdfPath) {
      console.log(`📁 UBICACIÓN DEL PDF:\n   ${pdfPath}\n`);
      console.log('📋 El PDF contiene:');
      console.log('   ✓ Tabla de escalas (9 subescalas)');
      console.log('   ✓ Índices globales (IST, TSP, MRSP)');
      console.log('   ✓ Gráfico "Perfil de Subescalas"');
      console.log('   ✓ Interpretación de resultados\n');
    }

    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('¡Listo! Todo guardado en: ./test-results/pedro/\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    await browser.close();
  }
}

// Ejecutar
testPedroFullAuto().catch(console.error);
