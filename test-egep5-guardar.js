const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    console.log('🔍 Test EGEP-5: Guardar en Expediente\n');

    // Navegar
    console.log('📍 Navegando a http://localhost:3000/micrositios/egep5/');
    await page.goto('http://localhost:3000/micrositios/egep5/', { waitUntil: 'networkidle' });
    await page.waitForSelector('[data-tab="test"]', { timeout: 5000 });
    console.log('✅ EGEP-5 cargado\n');

    // Ir a Tab Test
    await page.click('[data-tab="test"]');
    await page.waitForTimeout(500);

    // Llenar items (27-31)
    console.log('📝 Llenando items 27-31...');
    for (let i = 27; i <= 31; i++) {
      const siEl = await page.$(`input[name="symptom_respuesta_${i}"][value="si"]`);
      const molEl = await page.$(`input[name="symptom_${i}"][value="2"]`);
      if (siEl) await page.click(`input[name="symptom_respuesta_${i}"][value="si"]`);
      if (molEl) await page.click(`input[name="symptom_${i}"][value="2"]`);
    }
    console.log('✅ Items completados\n');

    // Calcular
    console.log('🧮 Calculando resultados...');
    await page.click('button:has-text("Calcular Resultados")');
    await page.waitForTimeout(1000);
    console.log('✅ Resultados calculados\n');

    // Verificar que contenedores existen
    console.log('🔍 Verificando estructura MBI:');
    const pdfContainer = await page.$('#egep5-resultados-pdf');
    const btnContainer = await page.$('#egep5-resultados-botones');
    const btnGuardar = await page.$('button#btn-egep5-guardar');

    console.log(`   - Contenedor PDF: ${pdfContainer ? '✅ Existe' : '❌ NO existe'}`);
    console.log(`   - Contenedor Botones: ${btnContainer ? '✅ Existe' : '❌ NO existe'}`);
    console.log(`   - Botón Guardar: ${btnGuardar ? '✅ Existe' : '❌ NO existe'}\n`);

    if (!pdfContainer || !btnContainer || !btnGuardar) {
      throw new Error('Falta contenedor o botón');
    }

    // Escuchar alertas
    page.on('dialog', async dialog => {
      console.log(`   📢 Alert: ${dialog.message()}`);
      await dialog.accept();
    });

    // Click en Guardar
    console.log('💾 Clickeando "Guardar en Expediente"...');
    await page.click('#btn-egep5-guardar');

    // Esperar respuesta
    await page.waitForTimeout(3000);

    console.log('\n✅ TEST COMPLETADO - No hubo errores');

  } catch (error) {
    console.error('❌ ERROR:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
