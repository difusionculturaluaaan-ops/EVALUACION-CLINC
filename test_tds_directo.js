const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log('\n🚀 PRUEBA TDS: Sin login (acceso directo a test)\n');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // Ir directamente a la página del test TDS
    console.log('📍 Navegando a TDS en local...');
    await page.goto('http://localhost:3000/index.html', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    console.log('📸 Tomando screenshot de la página actual...');
    await page.screenshot({ path: 'tds_actual_estado.png', fullPage: true });
    console.log('✅ Guardado: tds_actual_estado.png');

    console.log('\n⏳ Abierto en navegador con headless=false');
    console.log('Por favor completa manualmente: llenar TDS → Finalizar → Calcular');
    
    await page.waitForTimeout(120000); // Esperar 2 minutos

  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  await browser.close();
})().catch(console.error);
