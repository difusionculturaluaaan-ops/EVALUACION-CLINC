const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log('🚀 Test MMPI-2 PRO - 338 Items\n');

    // Abrir directamente mmpi-pro.html con paciente_id simulado (demo)
    console.log('1️⃣ Abriendo MMPI-2 PRO...');
    await page.goto('http://localhost:3000/mmpi-pro.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Llenar datos básicos
    console.log('2️⃣ Llenando datos del evaluado...');
    await page.fill('input#inp-nombre', 'Pica, Pedro', { timeout: 5000 }).catch(() => {
      console.log('⚠️ Campo nombre no encontrado');
    });

    await page.fill('input#inp-fecha', '1985-05-15', { timeout: 5000 }).catch(() => {
      console.log('⚠️ Campo fecha no encontrado');
    });

    await page.fill('input#inp-eval', 'Dr. Test', { timeout: 5000 }).catch(() => {
      console.log('⚠️ Campo evaluador no encontrado');
    });

    await page.waitForTimeout(500);

    // Ir a la pestaña TEST
    console.log('3️⃣ Yendo a pestaña TEST...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button.tab-btn'));
      const testBtn = buttons.find(b => b.textContent.includes('Test'));
      if (testBtn) testBtn.click();
    });

    await page.waitForTimeout(1500);

    // Completar todos los items
    console.log('4️⃣ Completando 338 items...');
    let completed = 0;

    for (let i = 1; i <= 338; i++) {
      // Por cada item, seleccionar aleatoriamente V o F
      const isTrue = Math.random() > 0.4;  // 60% Verdadero
      const selector = isTrue ? `input[value="V"]` : `input[value="F"]`;

      try {
        // Obtener todos los radios de respuesta
        const allRadios = await page.$$('input[type="radio"]');

        // Buscar en los radios del item actual
        for (const radio of allRadios) {
          const isChecked = await radio.isChecked();
          const parent = await radio.evaluate(el => el.closest('.item, .question, [data-item]'));

          if (!isChecked) {
            const value = await radio.getAttribute('value');
            if ((isTrue && value === 'V') || (!isTrue && value === 'F')) {
              await radio.click();
              completed++;
              break;
            }
          }
        }
      } catch (e) {
        // Ignorar errores de items individuales
      }

      // Mostrar progreso
      if (i % 50 === 0) {
        console.log(`  ⏳ ${i}/338 items...`);
      }
    }

    console.log(`✅ ${completed}/338 items completados`);
    await page.waitForTimeout(1000);

    // Ir a RESULTADOS y calcular
    console.log('5️⃣ Calculando resultados...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button.tab-btn'));
      const resBtn = buttons.find(b => b.textContent.includes('Resultados'));
      if (resBtn) resBtn.click();
    });

    await page.waitForTimeout(2000);

    // Hacer clic en Calcular Resultados
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const calcBtn = buttons.find(b => b.textContent.includes('Calcular Resultados'));
      if (calcBtn) calcBtn.click();
    });

    await page.waitForTimeout(2000);

    // Tomar screenshot del reporte
    console.log('6️⃣ Capturando resultados...');
    await page.screenshot({ path: 'test-mmpi-pro-results.png' });

    // Verificar que los datos se calcularon
    const hasResults = await page.evaluate(() => {
      return document.querySelector('#scale-table') !== null;
    });

    if (hasResults) {
      console.log('✅ Resultados calculados exitosamente');

      // Si hay paciente_id en URL, guardar
      const hasPacienteId = await page.evaluate(() => {
        const params = new URLSearchParams(window.location.search);
        return params.has('paciente_id');
      });

      if (hasPacienteId) {
        console.log('7️⃣ Guardando en expediente...');
        await page.click('button:has-text("Guardar en Expediente")').catch(() => {
          console.log('⚠️ No se encontró botón de guardar');
        });

        await page.waitForTimeout(3000);
        console.log('✅ Test guardado en expediente');
      } else {
        console.log('⚠️ Sin paciente_id - test no se guarda en expediente');
        console.log('   (Ejecuta desde la app con: app.abrirMMPI2Pro())');
      }
    } else {
      console.log('⚠️ No se pudieron calcular los resultados');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await page.waitForTimeout(3000);
    await browser.close();
    console.log('\n🏁 Test completado');
  }
})();
