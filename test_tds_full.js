const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log('\n📊 TEST TDS: Gráfico 10 factores → PDF\n');

  try {
    // Login
    console.log('🔐 Haciendo login...');
    await page.goto('http://localhost:3000/');
    await page.fill('input[type="email"]', 'demo@clinica.com');
    await page.fill('input[type="password"]', 'demo123456!');
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle' });
    console.log('✅ Login exitoso');

    // Navegar a TDS
    console.log('📋 Abriendo test TDS...');
    const tdsButton = await page.$('text=TDS');
    if (!tdsButton) {
      console.log('⚠️ No encontré botón TDS, buscando en dropdown...');
      // Buscar en la sidebar
      await page.click('text=Pruebas');
      await page.waitForTimeout(500);
    }

    // Hacer click en TDS
    await page.click('text=TDS', { delay: 100 });
    await page.waitForSelector('[id*="tds"], [class*="tds"], canvas', { timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(1000);

    console.log('📝 Llenando TDS (30 ítems con valores 1-5)...');
    // Buscar inputs radio para TDS
    const items = await page.$$('input[type="radio"]');
    console.log(`  Encontré ${items.length} radio buttons`);

    let filled = 0;
    for (let i = 0; i < Math.min(items.length, 30); i++) {
      const item = items[i];
      if (await item.isVisible()) {
        await item.click();
        filled++;
      }
    }
    console.log(`✅ Completé ${filled} ítems`);

    // Calcular resultados
    console.log('🧮 Haciendo click en "Calcular Resultados"...');
    await page.click('button:has-text("Calcular Resultados")', { timeout: 5000 }).catch(() => {
      console.log('⚠️ Botón no encontrado con ese texto');
    });

    await page.waitForTimeout(1500);

    // Verificar gráfico
    console.log('📊 Verificando gráfico...');
    const canvas = await page.$('canvas');
    if (canvas) {
      console.log('✅ Canvas encontrado en página');
      
      // Screenshot
      await page.screenshot({ path: 'tds_grafico.png' });
      console.log('📸 Screenshot guardado: tds_grafico.png');
    } else {
      console.log('⚠️ No hay canvas visible');
    }

    // Descargar PDF
    console.log('💾 Iniciando descarga de PDF...');
    await page.click('button:has-text("Descargar")', { timeout: 5000 }).catch(() => {
      console.log('⚠️ Botón Descargar no encontrado');
    });

    await page.waitForTimeout(500);

    // Llenar datos profesionales
    const nombreInput = await page.$('#prof-nombre');
    if (nombreInput) {
      console.log('📋 Llenando datos profesionales...');
      await page.fill('#prof-nombre', 'Dr. Test');
      await page.fill('#prof-cedula', '123456789');
      await page.fill('#prof-especialidad', 'Psicología');
      await page.fill('#prof-diagnostico', 'Test');
      
      // Escuchar descarga
      const downloadPromise = page.waitForEvent('download');
      await page.click('button[type="submit"]', { timeout: 5000 }).catch(() => {});

      try {
        const download = await downloadPromise;
        const filePath = path.join(process.cwd(), 'tds_test.pdf');
        await download.saveAs(filePath);
        const stats = fs.statSync(filePath);
        console.log(`✅ PDF descargado: ${stats.size} bytes`);
      } catch (e) {
        console.log('⚠️ No se descargó PDF');
      }
    }

    console.log('\n✨ Test completado\n');

  } catch (err) {
    console.error('❌ Error:', err.message);
  }

  await browser.close();
})().catch(console.error);
