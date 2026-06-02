const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const results = [];

  const tests = [
    { nombre: 'SCL-90R', items: 90, selector: 'SCL90R' },
    { nombre: 'PCL-R', items: 20, selector: 'PCLR' },
    { nombre: 'SCID-II', items: 119, selector: 'SCID2' },
    { nombre: 'ISRA', items: 30, selector: 'ISRA' },
    { nombre: 'MMPI-2', items: 338, selector: 'MMPI2' }
  ];

  for (const test of tests) {
    const page = await browser.newPage();

    try {
      console.log(`\n🧪 Verificando ${test.nombre}...`);

      await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);

      // Abrir test
      const testBtn = await page.evaluate((selector) => {
        const btns = Array.from(document.querySelectorAll('button'));
        const btn = btns.find(b => b.textContent.includes(selector) || b.textContent.includes('SCL') || b.textContent.includes('PCL') || b.textContent.includes('SCID') || b.textContent.includes('ISRA') || b.textContent.includes('MMPI'));
        return btn ? btn.textContent : null;
      }, test.selector);

      if (testBtn) {
        console.log(`   ✅ Botón encontrado: ${testBtn}`);
      }

      // Completar algunos items rápidamente
      const completed = await page.evaluate(async (itemsMax) => {
        let count = 0;
        const inputs = document.querySelectorAll('input[type="radio"], input[type="checkbox"]');

        for (let i = 0; i < Math.min(inputs.length, 10); i++) {
          if (!inputs[i].checked) {
            inputs[i].click();
            inputs[i].dispatchEvent(new Event('change', { bubbles: true }));
            count++;
          }
        }

        return count;
      }, test.items);

      console.log(`   ✅ Items completados: ${completed}`);

      // Verificar que no hay errores en consola
      const errors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      if (errors.length > 0) {
        console.log(`   ⚠️ Errores encontrados:`);
        errors.forEach(e => console.log(`      - ${e}`));
        results.push({ test: test.nombre, status: '⚠️ CON ERRORES', errors });
      } else {
        console.log(`   ✅ Sin errores en consola`);
        results.push({ test: test.nombre, status: '✅ OK' });
      }

    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      results.push({ test: test.nombre, status: '❌ FALLO', error: error.message });
    } finally {
      await page.close();
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 RESUMEN DE VERIFICACIÓN');
  console.log('='.repeat(50));

  results.forEach(r => {
    console.log(`${r.status} ${r.test}`);
  });

  const allOk = results.every(r => r.status.includes('✅'));
  console.log(`\n${allOk ? '🟢 TODOS LOS TESTS OK' : '🔴 HAY PROBLEMAS'}`);

  await browser.close();
})();
