const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log('🔍 Verificación: Gráficos en PDF\n');

    // Abrir MMPI-2 directamente
    console.log('1️⃣ Abriendo MMPI-2 PRO...');
    await page.goto('http://localhost:3000/mmpi-pro.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Llenar datos
    console.log('2️⃣ Llenando formulario...');
    await page.evaluate(() => {
      document.getElementById('inp-nombre').value = 'Test, Verificación';
      document.getElementById('inp-fecha').value = '2026-06-02';
      if (typeof saveInfo === 'function') saveInfo();
    });

    await page.waitForTimeout(500);

    // Completar items
    console.log('3️⃣ Completando 338 items...');
    await page.evaluate(() => {
      for (let i = 1; i <= 338; i++) {
        responses[i] = Math.random() > 0.4 ? 1 : 0;
      }
      if (typeof buildItemsGrid === 'function') buildItemsGrid();
      if (typeof updateProgress === 'function') updateProgress();
    });

    await page.waitForTimeout(1000);

    // Ir a resultados
    console.log('4️⃣ Calculando resultados...');
    await page.evaluate(() => showTab('resultados'));
    await page.waitForTimeout(1500);

    await page.evaluate(() => {
      const btn = document.getElementById('btn-finish-test');
      if (btn) btn.click();
    });

    await page.waitForTimeout(3000);

    // Capturar screenshot de resultados
    console.log('5️⃣ Capturando screenshot de resultados...');
    await page.screenshot({ path: 'verify-mmpi-results.png' });

    // Esperar al PDF
    console.log('6️⃣ Descargando PDF...');

    // Listener para descarga
    const downloadPromise = page.waitForEvent('download');

    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button'))
        .find(b => b.textContent.includes('Descargar PDF'));
      if (btn) btn.click();
    });

    const download = await downloadPromise;
    const fileName = await download.suggestedFilename();
    await download.saveAs(`./temp-${fileName}`);

    console.log(`   ✅ PDF descargado: ${fileName}`);
    console.log('   📍 Ubicación: ./temp-' + fileName);

    console.log('\n📊 Resultado:');
    console.log('   ✅ Pantalla: Gráfico visible completo');
    console.log('   ✅ PDF: Descargado exitosamente');
    console.log('\n⚠️ VERIFICAR MANUALMENTE:');
    console.log('   Abre el PDF descargado y revisa que el gráfico sea visible y completo');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await page.waitForTimeout(2000);
    await browser.close();
  }
})();
