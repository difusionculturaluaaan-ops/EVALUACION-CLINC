const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log('🚀 Iniciando test MMPI-2 PRO para Pedro Pica...\n');

    // 1. Ir a localhost:3000
    console.log('1️⃣ Abriendo app...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // 2. Buscar y seleccionar a Pedro Pica
    console.log('2️⃣ Buscando a Pedro Pica...');

    // Hacer clic en "Expedientes" o búsqueda
    await page.click('text=Expedientes').catch(() => {
      console.log('⚠️ No encontré botón Expedientes');
    });

    await page.waitForTimeout(1000);

    // Buscar en el input de búsqueda
    const searchInput = await page.$('input[type="text"]').catch(() => null);
    if (searchInput) {
      await searchInput.fill('Pedro Pica');
      await page.waitForTimeout(1500);
    }

    // Buscar y hacer clic en Pedro Pica en los resultados
    const pedroFound = await page.evaluate(() => {
      const elements = document.querySelectorAll('div, li, button');
      for (const elem of elements) {
        if (elem.textContent.includes('Pica, Pedro') || elem.textContent.includes('Pedro Pica')) {
          elem.click();
          return true;
        }
      }
      return false;
    });

    if (!pedroFound) {
      console.log('⚠️ Pedro Pica no encontrado, usando primer paciente disponible');
      // Intentar con el primer paciente
      await page.evaluate(() => {
        const firstPatient = document.querySelector('[data-paciente], .paciente-item, .patient-card');
        if (firstPatient) firstPatient.click();
      }).catch(() => {});
    }

    await page.waitForTimeout(2000);

    // 3. Hacer clic en MMPI-2 PRO
    console.log('3️⃣ Abriendo MMPI-2 PRO...');
    const mmpiButton = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.textContent.includes('MMPI-2 PRO'));
      return btn ? true : false;
    });

    if (mmpiButton) {
      await page.click('button:has-text("MMPI-2 PRO")').catch(() => {
        console.log('⚠️ No se pudo hacer clic directo, intentando por xpath...');
      });
    }

    await page.waitForTimeout(3000);

    // Esperar a que cargue la página MMPI-2 PRO
    await page.waitForSelector('input[placeholder*="Apellido"]', { timeout: 10000 }).catch(() => {
      console.log('⚠️ Timeout esperando formulario MMPI-2 PRO');
    });

    // 4. Llenar datos básicos si existen
    console.log('4️⃣ Llenando datos del evaluado...');
    const nombre = await page.$('input[placeholder*="Apellido"]');
    const fecha = await page.$('input[type="date"]');
    const eval = await page.$('input[placeholder*="evaluador"]');

    if (nombre) await nombre.fill('Pica, Pedro');
    if (fecha) await fecha.fill('1985-05-15');
    if (eval) await eval.fill('Dr. Test');

    await page.waitForTimeout(500);

    // 5. Hacer clic en la pestaña TEST
    console.log('5️⃣ Navegando a pestaña TEST...');
    await page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('.tab-btn'));
      const testTab = tabs.find(t => t.textContent.includes('Test'));
      if (testTab) testTab.click();
    });

    await page.waitForTimeout(1000);

    // 6. Completar los 338 items automáticamente
    console.log('6️⃣ Completando 338 items...');
    const itemsCompleted = await page.evaluate(async () => {
      let completed = 0;

      // Obtener todos los items visibles
      for (let itemNum = 1; itemNum <= 338; itemNum++) {
        // Buscar radio buttons o checkboxes del item actual
        const radios = document.querySelectorAll('input[type="radio"], input[type="checkbox"]');

        for (const radio of radios) {
          const label = radio.labels?.[0];
          const itemText = label?.textContent || radio.title || '';

          // Si contiene un número que match con el item actual
          if (itemText.includes(`${itemNum}`) || radio.getAttribute('data-item') == itemNum) {
            // Seleccionar aleatoriamente F o V (más falsos para test realista)
            const shouldSelect = Math.random() > 0.3;  // 70% Verdadero, 30% Falso
            if (shouldSelect) {
              radio.checked = true;
              radio.dispatchEvent(new Event('change', { bubbles: true }));
              radio.dispatchEvent(new Event('click', { bubbles: true }));
              completed++;
              break;
            }
          }
        }

        // Mostrar progreso cada 50 items
        if (itemNum % 50 === 0) {
          console.log(`  ⏳ ${itemNum}/338 items completados...`);
        }
      }

      return completed;
    });

    console.log(`✅ Items completados: ${itemsCompleted}`);

    // 7. Scroll a pestaña RESULTADOS y hacer clic en "Calcular"
    console.log('7️⃣ Calculando resultados...');
    await page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('.tab-btn'));
      const resultTab = tabs.find(t => t.textContent.includes('Resultados'));
      if (resultTab) resultTab.click();
    });

    await page.waitForTimeout(2000);

    // Hacer clic en botón "Calcular Resultados"
    const calcButton = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.textContent.includes('Calcular'));
      return btn ? true : false;
    });

    if (calcButton) {
      await page.click('button:has-text("Calcular")');
      await page.waitForTimeout(2000);
    }

    // 8. Guardar en Expediente
    console.log('8️⃣ Guardando en expediente...');
    const saveButton = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.textContent.includes('Guardar en Expediente'));
      return btn ? true : false;
    });

    if (saveButton) {
      console.log('   Haciendo clic en "Guardar en Expediente"...');
      await page.click('button:has-text("Guardar en Expediente")');
      await page.waitForTimeout(3000);

      // Esperar a que muestre alert o redirija
      console.log('✅ Test MMPI-2 PRO completado y guardado!');
    } else {
      console.log('⚠️ No se encontró botón "Guardar en Expediente"');
    }

    // 9. Esperar un poco antes de cerrar
    await page.waitForTimeout(2000);

    // Captura final
    const screenshot = await page.screenshot({ path: 'test-mmpi-final.png' });
    console.log('\n📸 Screenshot guardado: test-mmpi-final.png');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
})();
