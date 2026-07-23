const { chromium } = require('playwright');
const path = require('path');

async function debugWithLogs() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // Capturar logs de consola
  page.on('console', msg => {
    console.log(`[${msg.type().toUpperCase()}] ${msg.text()}`);
  });

  console.log('🔍 Debug: Importación JSON con logs de consola\n');

  try {
    console.log('📍 Navegando a EGEP-5...');
    await page.goto('http://localhost:3000/micrositios/egep5/');
    await page.waitForTimeout(2000);

    console.log('📍 Buscando botón Importar JSON...');
    const importBtn = await page.$('button:has-text("Importar JSON")');
    if (!importBtn) {
      console.log('❌ Botón no encontrado');
      return;
    }

    console.log('📍 Clickeando botón...');
    await importBtn.click();
    await page.waitForTimeout(1000);

    const fileInput = await page.$('input[type="file"]');
    const jsonPath = path.join(__dirname, 'egep5_datos_completos.json');
    await fileInput.setInputFiles(jsonPath);
    console.log('📍 Archivo seleccionado - esperando 5 segundos para ver logs...\n');

    // Esperar a que se ejecute y se impriman logs
    await page.waitForTimeout(5000);

    // Verificar si los elementos fueron marcados
    console.log('\n📍 Verificando elementos después de cargar:');
    const checkedSi = await page.$$eval('input[name*="symptom_respuesta_"][value="si"]:checked', els => els.length);
    console.log(`✅ Radio buttons Sí marcados: ${checkedSi}`);

    const checkedNo = await page.$$eval('input[name*="symptom_respuesta_"][value="no"]:checked', els => els.length);
    console.log(`✅ Radio buttons No marcados: ${checkedNo}`);

    const checkedMolestia = await page.$$eval('input[name^="symptom_"][type="radio"]:checked', els => els.length);
    console.log(`✅ Radio buttons molestia marcados: ${checkedMolestia}`);

    console.log('\n📍 Guardando screenshot...');
    await page.screenshot({ path: 'debug-logs-tab2.png', fullPage: true });
    console.log('✅ Screenshot: debug-logs-tab2.png');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

debugWithLogs();
