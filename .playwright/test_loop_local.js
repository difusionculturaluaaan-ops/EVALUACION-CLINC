const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Capturar todos los errores de consola
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  console.log('🔍 Abriendo CISNEROS en local...');
  await page.goto('http://localhost:3000/micrositios/cisneros', { waitUntil: 'networkidle' });

  console.log('📝 Rellenando datos básicos...');
  await page.fill('#c_nombre', 'Test User');
  await page.fill('#c_edad', '30');
  await page.fill('#c_evaluador', 'Evaluador Test');

  console.log('🎯 Navegando a Tab Test...');
  await page.click('button.cisneros-tab:nth-child(2)');
  await page.waitForTimeout(500);

  console.log('✍️ Llenando 10 items de prueba...');
  for (let i = 1; i <= 10; i++) {
    const radio = await page.$(`input[name="cisneros_item_${i}"][value="3"]`);
    if (radio) {
      await radio.click();
    }
  }

  console.log('⚙️ Presionando "Calcular Resultados"...');
  await page.click('button:has-text("Calcular Resultados")');
  await page.waitForTimeout(1500);

  console.log('\n📊 Verificando estado...');
  const hasResults = await page.evaluate(() => {
    return document.getElementById('tab-resultados')?.classList.contains('active') || false;
  });

  const htmlContent = await page.evaluate(() => {
    const tab = document.getElementById('tab-resultados');
    return tab?.textContent?.substring(0, 100) || 'VACIO';
  });

  console.log(`Tab de resultados visible: ${hasResults}`);
  console.log(`Contenido: ${htmlContent}`);

  if (errors.length > 0) {
    console.log('\n❌ ERRORES DE CONSOLA:');
    errors.forEach(err => console.log(`  - ${err}`));
  } else {
    console.log('\n✅ Sin errores de consola');
  }

  // Screenshot
  await page.screenshot({ path: path.join(__dirname, 'loop_test_local.png') });
  console.log('\n📸 Screenshot guardado');

  await browser.close();
  process.exit(0);
})().catch((error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
