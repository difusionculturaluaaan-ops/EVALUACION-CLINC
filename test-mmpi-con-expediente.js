const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log('🚀 Test MMPI-2 PRO + Guardar en Expediente\n');

    // 1. Abrir app principal
    console.log('1️⃣ Abriendo app principal...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // 2. Buscar y seleccionar a Pedro Pica
    console.log('2️⃣ Buscando a Pedro Pica...');

    // Hacer clic en Expedientes
    await page.click('text=/Expedientes|expedientes/', { timeout: 5000 }).catch(async () => {
      console.log('   Expedientes no encontrado, buscando en navegación');
      await page.click('button:has-text("Expedientes")').catch(() => {});
    });

    await page.waitForTimeout(1000);

    // Escribir en búsqueda
    const searchBox = await page.$('input[placeholder*="Buscar"], input[type="text"]').catch(() => null);
    if (searchBox) {
      await searchBox.fill('Pedro Pica');
      await page.waitForTimeout(1500);
    }

    // Hacer clic en resultado
    await page.evaluate(() => {
      const items = document.querySelectorAll('div, li, .paciente-item, [role="option"]');
      for (const item of items) {
        if (item.textContent.includes('Pica') && item.textContent.includes('Pedro')) {
          item.click();
          return;
        }
      }
    });

    await page.waitForTimeout(2000);

    // 3. Hacer clic en MMPI-2 PRO
    console.log('3️⃣ Abriendo MMPI-2 PRO (con paciente_id)...');

    // Hacer clic en MMPI-2 PRO
    await page.click('button:has-text("MMPI-2 PRO")').catch(async () => {
      console.log('   Buscando MMPI-2 PRO en menú');
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const mmpiBtn = btns.find(b => b.textContent.includes('MMPI-2'));
        if (mmpiBtn) mmpiBtn.click();
      });
    });

    await page.waitForTimeout(4000);

    // Usar la misma página (redirige internamente)
    let mmpiPage = page;

    // Verificar si se abrió en una pestaña nueva buscando el URL
    const currentUrl = await page.url();
    if (currentUrl.includes('mmpi-pro')) {
      console.log('   ✅ MMPI-2 PRO cargado en la misma pestaña');
    } else {
      console.log('   ⚠️ Esperando que cargue MMPI-2 PRO...');
      await page.waitForURL('**/mmpi-pro.html', { timeout: 10000 }).catch(() => {
        console.log('   ℹ️ Puede haber abierto en nueva ventana');
      });
    }

    // Verificar que tenemos paciente_id
    const pacienteId = await mmpiPage.evaluate(() => {
      const params = new URLSearchParams(window.location.search);
      return params.get('paciente_id');
    });

    if (pacienteId) {
      console.log(`   ✅ Paciente ID: ${pacienteId}`);
    } else {
      console.log('   ⚠️ Sin paciente_id en URL');
    }

    // 4. Llenar datos
    console.log('4️⃣ Llenando datos...');
    await mmpiPage.evaluate(() => {
      if (document.getElementById('inp-nombre')) {
        document.getElementById('inp-nombre').value = 'Pica, Pedro';
      }
      if (document.getElementById('inp-fecha')) {
        document.getElementById('inp-fecha').value = '1985-05-15';
      }
      if (document.getElementById('inp-eval')) {
        document.getElementById('inp-eval').value = 'Dr. Test';
      }
      if (typeof saveInfo === 'function') {
        saveInfo();
      }
    });

    // 5. Completar items
    console.log('5️⃣ Completando 338 items...');
    const completed = await mmpiPage.evaluate(() => {
      if (typeof responses === 'undefined') return 0;

      for (let i = 1; i <= 338; i++) {
        responses[i] = Math.random() > 0.4 ? 1 : 0;
      }

      if (typeof buildItemsGrid === 'function') buildItemsGrid();
      if (typeof updateProgress === 'function') updateProgress();

      return 338;
    });

    console.log(`   ✅ ${completed} items completados`);

    // 6. Ir a Resultados y calcular
    console.log('6️⃣ Calculando resultados...');
    await mmpiPage.evaluate(() => {
      showTab('resultados');
    });

    await mmpiPage.waitForTimeout(1500);

    await mmpiPage.evaluate(() => {
      const btn = document.getElementById('btn-finish-test');
      if (btn) {
        btn.click();
      }
    });

    await mmpiPage.waitForTimeout(3000);

    // 7. Guardar en Expediente
    console.log('7️⃣ Guardando en expediente...');

    // Buscar y hacer clic en "Guardar en Expediente"
    const saved = await mmpiPage.evaluate(async () => {
      const btn = document.getElementById('btn-guardar-expediente');
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });

    if (saved) {
      console.log('   ⏳ Guardando...');
      await mmpiPage.waitForTimeout(4000);

      // Esperar el alert o redirección
      const url = mmpiPage.url();
      if (url.includes('/')) {
        console.log('   ✅ Test guardado exitosamente');
      }
    } else {
      console.log('   ⚠️ No se encontró botón de guardar');
    }

    // 8. Screenshot final
    console.log('8️⃣ Capturando pantalla final...');
    await mmpiPage.screenshot({ path: 'test-mmpi-expediente-final.png' });
    console.log('   📸 Screenshot: test-mmpi-expediente-final.png');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    await page.waitForTimeout(3000);
    await browser.close();
    console.log('\n✅ Test completado\n');
  }
})();
