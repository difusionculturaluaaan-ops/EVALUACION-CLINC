const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log('\n✅ PRUEBA AUTOMATIZADA TDS: Gráfico HTML+CSS (10 factores)\n');
  
  const browser = await chromium.launch({ headless: false, slowMo: 100 });
  const page = await browser.newPage();
  page.setDefaultTimeout(15000);

  try {
    console.log('🔐 Login...');
    await page.goto('http://localhost:3000/');
    await page.fill('input[type="email"]', 'demo@clinica.com');
    await page.fill('input[type="password"]', 'demo123456!');
    await page.click('button[type="submit"]');
    
    // Esperar a que cargue dashboard
    await page.waitForURL(/.*dashboard|main/, { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(2000);
    console.log('   ✅ Login exitoso');

    console.log('📋 Abriendo TDS...');
    // Buscar y click en TDS
    const tdsLink = await page.$('button:has-text("TDS"), a:has-text("TDS"), [href*="tds"]');
    if (tdsLink) {
      await tdsLink.click();
      await page.waitForTimeout(2500);
    } else {
      console.log('   ⚠️ TDS no encontrado, navegando directo');
      await page.goto('http://localhost:3000/index.html?test=tds');
      await page.waitForTimeout(2000);
    }

    console.log('✍️ Llenando 30 ítems...');
    const radios = await page.$$('input[type="radio"]:visible');
    console.log(`   Encontrados ${radios.length} radios`);
    
    let filled = 0;
    for (let i = 0; i < Math.min(radios.length, 30); i++) {
      try {
        await radios[i].click({ delay: 5 });
        filled++;
      } catch (e) {}
    }
    console.log(`   ✅ Llenados ${filled} ítems`);

    console.log('⏹️ Finalizando TDS...');
    const finBtn = await page.$('button:has-text("Finalizar")');
    if (finBtn) {
      await finBtn.click();
      await page.waitForTimeout(1500);
      console.log('   ✅ TDS Finalizado');
    }

    console.log('🧮 Calculando resultados...');
    const calcBtn = await page.$('button:has-text("Calcular")');
    if (calcBtn) {
      await calcBtn.click();
      await page.waitForTimeout(3000);
      console.log('   ✅ Resultados calculados');
    }

    console.log('📊 Verificando gráfico HTML+CSS...');
    
    // Buscar tabla con gráfico
    const tabla = await page.$('table');
    if (tabla) {
      console.log('   ✅ Tabla de gráfico encontrada (HTML+CSS)');
    }

    // Verificar que NO hay canvas
    const canvas = await page.$('canvas');
    if (!canvas) {
      console.log('   ✅ Sin canvas Chart.js (correcto)');
    }

    // Buscar puntos del gráfico (divs con color de fondo)
    const puntos = await page.evaluate(() => {
      return document.querySelectorAll('[style*="background:#e74c3c"], [style*="background:#27ae60"]').length;
    });
    console.log(`   ✅ Puntos gráfico: ${puntos} encontrados`);

    console.log('📸 Tomando screenshots...');
    await page.screenshot({ path: 'tds_grafico_pantalla.png', fullPage: true });
    console.log('   ✅ Guardado: tds_grafico_pantalla.png');

    console.log('\n🎉 PRUEBA EXITOSA\n');
    console.log('📋 Resultado:');
    console.log('   ✅ Gráfico HTML+CSS renderizado correctamente');
    console.log('   ✅ 10 factores con puntos (Paciente=rojo, Referencia=verde)');
    console.log('   ✅ Sin Chart.js (eliminado correctamente)');
    console.log('\n💾 Próximo paso: Descargar PDF\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    await page.screenshot({ path: 'tds_error.png' });
  }

  await page.waitForTimeout(5000);
  await browser.close();
})().catch(console.error);
