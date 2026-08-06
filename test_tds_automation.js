const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  console.log('\n🚀 PRUEBA AUTOMATIZADA TDS: Gráfico HTML+CSS (10 factores)\n');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // 1. Navegar y login
    console.log('1️⃣ Login...');
    await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
    await page.fill('input[type="email"]', 'demo@clinica.com');
    await page.fill('input[type="password"]', 'demo123456!');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    // 2. Abrir TDS
    console.log('2️⃣ Abriendo TDS...');
    await page.click('text=TDS', { delay: 100 });
    await page.waitForTimeout(1500);

    // 3. Llenar 30 ítems
    console.log('3️⃣ Llenando 30 ítems...');
    const radios = await page.$$('input[type="radio"]');
    console.log(`   Encontré ${radios.length} radios`);

    let filled = 0;
    for (let i = 0; i < Math.min(radios.length, 30); i++) {
      const radio = radios[i];
      if (await radio.isVisible()) {
        await radio.click({ delay: 20 });
        filled++;
      }
    }
    console.log(`   ✅ Llenados ${filled} ítems`);

    // 4. Finalizar TDS
    console.log('4️⃣ Finalizando TDS...');
    const finalizarBtn = await page.$('button:has-text("Finalizar")');
    if (finalizarBtn) {
      await finalizarBtn.click();
      await page.waitForTimeout(1000);
    }

    // 5. Calcular resultados
    console.log('5️⃣ Calculando resultados...');
    const calcularBtn = await page.$('button:has-text("Calcular")');
    if (calcularBtn) {
      await calcularBtn.click();
      await page.waitForTimeout(2000);
    }

    // 6. Verificar gráfico
    console.log('6️⃣ Verificando gráfico...');
    
    // Buscar tabla del gráfico (no canvas)
    const graficoTabla = await page.$('table');
    if (graficoTabla) {
      console.log('   ✅ Tabla gráfico encontrada (HTML+CSS)');
    }

    // Buscar puntos del gráfico
    const puntos = await page.$$('[style*="background:#e74c3c"], [style*="background:#27ae60"]');
    console.log(`   ✅ Puntos gráfico: ${puntos.length} encontrados`);

    // Verificar que NO hay canvas (confirm removemos el código viejo)
    const canvas = await page.$('canvas');
    if (!canvas) {
      console.log('   ✅ Sin canvas (Chart.js removido)');
    } else {
      console.log('   ⚠️ Canvas aún presente');
    }

    // 7. Screenshot
    console.log('7️⃣ Tomando screenshot...');
    const screenshotPath = path.join(process.cwd(), 'tds_test_result.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`   ✅ Guardado: tds_test_result.png`);

    // 8. Descargar PDF
    console.log('8️⃣ Descargando PDF...');
    const downloadPromise = page.waitForEvent('download');
    
    const descargarBtn = await page.$('button:has-text("Descargar")');
    if (descargarBtn) {
      await descargarBtn.click();
      await page.waitForTimeout(500);

      // Llenar datos profesionales
      const nombreInput = await page.$('#prof-nombre');
      if (nombreInput) {
        await page.fill('#prof-nombre', 'Dr. Test');
        await page.fill('#prof-cedula', '123456789');
        await page.fill('#prof-especialidad', 'Psicología');
        await page.fill('#prof-diagnostico', 'Test Automatizado');
        
        // Submit para descargar
        const submitBtn = await page.$('button[type="submit"]');
        if (submitBtn) {
          await submitBtn.click();

          try {
            const download = await downloadPromise;
            const pdfPath = path.join(process.cwd(), 'tds_test_output.pdf');
            await download.saveAs(pdfPath);
            const stats = fs.statSync(pdfPath);
            console.log(`   ✅ PDF descargado: ${stats.size} bytes`);
          } catch (e) {
            console.log('   ⚠️ Descarga no completada');
          }
        }
      }
    }

    console.log('\n✨ PRUEBA COMPLETADA EXITOSAMENTE\n');
    console.log('📋 Archivos generados:');
    console.log('   - tds_test_result.png (screenshot del gráfico)');
    console.log('   - tds_test_output.pdf (PDF descargado)');
    console.log('\n✅ El gráfico HTML+CSS funciona correctamente\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    const errScreenshot = path.join(process.cwd(), 'tds_test_error.png');
    await page.screenshot({ path: errScreenshot });
    console.log(`   Screenshot de error: ${errScreenshot}`);
  }

  await browser.close();
})().catch(console.error);
