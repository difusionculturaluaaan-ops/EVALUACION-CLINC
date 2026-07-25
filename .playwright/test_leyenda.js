const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log('🔍 Navegando a CISNEROS local...');
  await page.goto('http://localhost:3000/micrositios/cisneros/index.html', { waitUntil: 'networkidle' });

  console.log('📋 Llenando datos...');
  await page.evaluate(() => {
    window.sessionStorage.setItem('pacienteSeleccionado', '37');
    window.tests_cisneros.irTab('test');
  });

  await page.waitForTimeout(500);

  console.log('📝 Rellenando items...');
  for (let i = 1; i <= 43; i++) {
    const radio = await page.$(`input[name="cisneros_item_${i}"][value="3"]`);
    if (radio) await radio.click();
  }

  console.log('📊 Calculando resultados...');
  await page.click('button:has-text("Calcular Resultados")');
  await page.waitForTimeout(2000);

  console.log('🔍 Verificando leyenda...');
  const legendaInfo = await page.evaluate(() => {
    const svg = document.querySelector('#cisneros-grafico-mobbing-bossing svg');
    let leyendaData = {
      encontrado: !!svg,
      elementos: []
    };

    if (svg) {
      const texts = svg.querySelectorAll('text');
      texts.forEach(t => {
        if (t.textContent.includes('MOBBING') || t.textContent.includes('BOSSING')) {
          leyendaData.elementos.push({
            texto: t.textContent.trim(),
            x: t.getAttribute('x'),
            y: t.getAttribute('y'),
            visible: true
          });
        }
      });
    }

    return leyendaData;
  });

  console.log('✅ Resultado verificación:');
  console.log(legendaInfo);

  console.log('📸 Tomando screenshot...');
  const screenshotPath = path.join(__dirname, '..', '.playwright', 'leyenda_test.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`✅ Screenshot guardado`);

  await browser.close();
  process.exit(0);
})().catch((error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
