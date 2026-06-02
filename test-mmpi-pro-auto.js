const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log('🚀 Test MMPI-2 PRO Automatizado\n');

    // Ir a mmpi-pro.html
    console.log('1️⃣ Abriendo MMPI-2 PRO...');
    await page.goto('http://localhost:3000/mmpi-pro.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Llenar datos básicos
    console.log('2️⃣ Llenando datos...');
    await page.evaluate(() => {
      document.getElementById('inp-nombre').value = 'Pica, Pedro';
      document.getElementById('inp-fecha').value = '1985-05-15';
      document.getElementById('inp-eval').value = 'Dr. Test';
      document.getElementById('inp-cargo').value = 'Paciente';
      document.getElementById('inp-edad').value = '39 años · Masculino';

      // Trigger save
      window.saveInfo?.();
    });

    console.log('3️⃣ Completando 338 items...');

    // Inyectar script para llenar el array de respuestas directamente
    const itemsCompleted = await page.evaluate(async () => {
      // Acceder al array global de respuestas
      if (typeof responses === 'undefined') {
        console.warn('⚠️ Array responses no accesible');
        return 0;
      }

      // Llenar respuestas (índices 1-338)
      // Patrón: 60% V (Verdadero = 1), 40% F (Falso = 0)
      for (let i = 1; i <= 338; i++) {
        responses[i] = Math.random() > 0.4 ? 1 : 0;  // 1 = V, 0 = F
      }

      // Actualizar la interfaz
      if (typeof buildItemsGrid === 'function') {
        buildItemsGrid();
      }

      if (typeof updateProgress === 'function') {
        updateProgress();
      }

      return 338;
    });

    console.log(`✅ ${itemsCompleted} respuestas registradas`);
    await page.waitForTimeout(1000);

    // Ir a la pestaña TEST para ver el progreso
    console.log('4️⃣ Yendo a pestaña TEST...');
    await page.evaluate(() => {
      showTab('test');
    });

    await page.waitForTimeout(2000);

    // Ir a RESULTADOS
    console.log('5️⃣ Yendo a pestaña RESULTADOS...');
    await page.evaluate(() => {
      showTab('resultados');
    });

    await page.waitForTimeout(1500);

    // Hacer clic en "Calcular Resultados"
    console.log('6️⃣ Calculando resultados...');
    await page.evaluate(() => {
      const btn = document.getElementById('btn-finish-test');
      if (btn) {
        btn.click();
      } else {
        // Alternativa: buscar por texto
        const buttons = Array.from(document.querySelectorAll('button'));
        const calcBtn = buttons.find(b => b.textContent.includes('Calcular'));
        if (calcBtn) calcBtn.click();
      }
    });

    await page.waitForTimeout(3000);

    // Verificar resultados
    const resultsData = await page.evaluate(() => {
      if (typeof calcResults === 'undefined') return null;

      return {
        totalScales: calcResults.length,
        firstScale: calcResults[0],
        lastScale: calcResults[calcResults.length - 1],
        hasValidScores: calcResults.some(r => r.t > 0)
      };
    });

    if (resultsData && resultsData.hasValidScores) {
      console.log(`✅ Resultados calculados: ${resultsData.totalScales} escalas`);
      console.log(`   Primera: ${resultsData.firstScale.abbr} (T=${resultsData.firstScale.t})`);
      console.log(`   Última: ${resultsData.lastScale.abbr} (T=${resultsData.lastScale.t})`);
    } else {
      console.log('⚠️ No se calcularon resultados correctamente');
    }

    // Tomar screenshot
    console.log('7️⃣ Capturando resultados...');
    await page.screenshot({ path: 'test-mmpi-auto-results.png' });
    console.log('   📸 Screenshot: test-mmpi-auto-results.png');

    // Descargar PDF
    console.log('8️⃣ Generando PDF...');
    await page.evaluate(() => {
      const pdfBtn = Array.from(document.querySelectorAll('button'))
        .find(b => b.textContent.includes('Descargar PDF'));
      if (pdfBtn) pdfBtn.click();
    }).catch(() => {
      console.log('⚠️ No se pudo generar PDF');
    });

    await page.waitForTimeout(2000);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await page.waitForTimeout(2000);
    await browser.close();
    console.log('\n✅ Test completado');
  }
})();
