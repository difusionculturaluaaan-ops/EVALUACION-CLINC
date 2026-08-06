const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log('\n🚀 PRUEBA AUTOMATIZADA TDS: Gráfico HTML+CSS\n');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // Login con credenciales correctas
    console.log('1️⃣ Login...');
    await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
    
    await page.fill('input[type="email"]', 'admin@clinica.com');
    await page.fill('input[type="password"]', 'admin123456');
    
    const enterBtn = await page.$('button:has-text("Entrar")');
    if (enterBtn) {
      await enterBtn.click();
      await page.waitForNavigation({ waitUntil: 'networkidle', timeout: 10000 }).catch(() => {});
      await page.waitForTimeout(2000);
    }

    console.log('2️⃣ Abriendo TDS...');
    const tdsBtn = await page.$('text=TDS');
    if (tdsBtn) {
      await tdsBtn.click();
      await page.waitForTimeout(2000);
    }

    console.log('3️⃣ Llenando 30 ítems...');
    const radios = await page.$$('input[type="radio"]');
    let filled = 0;
    for (let i = 0; i < Math.min(radios.length, 30); i++) {
      try {
        await radios[i].click({ delay: 10 });
        filled++;
      } catch (e) {}
    }
    console.log(`   ✅ Llenados ${filled} ítems`);

    console.log('4️⃣ Finalizando TDS...');
    const finBtn = await page.$('button:has-text("Finalizar")');
    if (finBtn) await finBtn.click();
    await page.waitForTimeout(1500);

    console.log('5️⃣ Calculando resultados...');
    const calcBtn = await page.$('button:has-text("Calcular")');
    if (calcBtn) await calcBtn.click();
    await page.waitForTimeout(3000);

    console.log('6️⃣ Verificando gráfico...');
    
    // Buscar la tabla del gráfico
    const tabla = await page.$('div:has(table)');
    if (tabla) {
      console.log('   ✅ Tabla gráfico HTML encontrada');
    }

    // Buscar puntos (círculos de gráfico)
    const puntos = await page.$$('[style*="background-color: rgb"]');
    console.log(`   ✅ Elementos visuales: ${puntos.length}`);

    console.log('7️⃣ Screenshot del resultado...');
    await page.screenshot({ path: 'tds_grafico_resultado.png', fullPage: true });
    console.log('   ✅ Guardado: tds_grafico_resultado.png');

    console.log('\n✨ PRUEBA COMPLETADA\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    await page.screenshot({ path: 'tds_error_final.png' });
  }

  // Mantener navegador abierto 10 segundos para ver resultado
  await page.waitForTimeout(10000);
  await browser.close();
})().catch(console.error);
