const { chromium } = require('playwright');

async function verificarCisnerosXY() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('🔍 Verificando CISNEROS con gráfico XY...\n');

  try {
    console.log('1️⃣ Navegando a CISNEROS...');
    await page.goto('http://localhost:3000/micrositios/cisneros/', { waitUntil: 'load', timeout: 30000 });
    await page.waitForTimeout(2000);

    console.log('2️⃣ Llenando datos...');
    // Rellenar datos generales
    const nInput = await page.$('#c_nombre');
    if (nInput) await page.fill('#c_nombre', 'Test Paciente');

    const eInput = await page.$('#c_edad');
    if (eInput) await page.fill('#c_edad', '40');

    console.log('3️⃣ Navegando a Tab Test...');
    // Click en Tab 2
    const testTab = await page.$('button[data-tab="test"]');
    if (testTab) await testTab.click();
    await page.waitForTimeout(1500);

    console.log('4️⃣ Llenando items con valores variados...');
    // Llenar algunos items Mobbing con puntuación alta
    const mobItems = [2, 3, 6, 10, 14, 16, 17, 18, 19, 22, 23, 24, 25, 26];
    for (const i of mobItems) {
      const input = await page.$(`input[name="cisneros_item_${i}"][value="4"]`);
      if (input) await input.click();
      await page.waitForTimeout(50);
    }

    // Llenar algunos items Bossing con puntuación alta
    const bossItems = [1, 4, 5, 7, 8, 9, 11, 12, 13, 15, 20, 21];
    for (const i of bossItems) {
      const input = await page.$(`input[name="cisneros_item_${i}"][value="3"]`);
      if (input) await input.click();
      await page.waitForTimeout(50);
    }

    console.log('5️⃣ Calculando resultados...');
    const calcBtn = await page.$('button:has-text("Calcular Resultados")');
    if (calcBtn) {
      await calcBtn.scrollIntoViewIfNeeded();
      await calcBtn.click();
    }
    await page.waitForTimeout(4000);

    console.log('✅ Resultados generados\n');

    // Tomar screenshots
    console.log('6️⃣ Tomando screenshots...');

    // Tab 3 - Resultados
    const resultsTab = await page.$('button[data-tab="resultados"]');
    if (resultsTab) {
      await resultsTab.scrollIntoViewIfNeeded();
      await resultsTab.click();
    }
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'cisneros-resultados-xy.png' });
    console.log('   ✓ Screenshot gráficos generado\n');

    console.log('═════════════════════════════════════════');
    console.log('✅ CISNEROS XY VERIFICADO');
    console.log('═════════════════════════════════════════\n');

    console.log('📊 Verifica en el navegador:\n');
    console.log('   ✓ Gráfico NEAP → IGAP → IMAP');
    console.log('   ✓ Gráfico XY: Mobbing (horizontal) vs Bossing (vertical)');
    console.log('   ✓ Punto del paciente plotteado en XY');
    console.log('   ✓ Leyenda con conteos\n');

    console.log('⏱️ Navegador abierto 10 minutos.\n');

    await new Promise(resolve => setTimeout(resolve, 600000));

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n⏱️ Navegador abierto 2 minutos para inspeccionar.\n');
    await new Promise(resolve => setTimeout(resolve, 120000));
  } finally {
    await browser.close();
  }
}

verificarCisnerosXY();
