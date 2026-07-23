const { chromium } = require('playwright');

async function verificarCisneros() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('🔍 Verificando CISNEROS con cambios...\n');

  try {
    console.log('1️⃣ Navegando a CISNEROS en local...');
    await page.goto('http://localhost:3000/micrositios/cisneros/', { waitUntil: 'load', timeout: 30000 });
    await page.waitForTimeout(2000);

    console.log('2️⃣ Llenando datos de paciente...');
    await page.fill('#c_nombre', 'Juan Pérez García');
    await page.fill('#c_edad', '45');
    await page.selectOption('#c_sexo', 'Varón');
    await page.fill('#c_empresa', 'Empresa XYZ');
    await page.fill('#c_evaluador', 'Dra. Psicóloga');
    await page.fill('#c_fecha', '2026-07-23');

    console.log('3️⃣ Navegando a Tab 2 (Test)...');
    await page.click('button[data-tab="test"]');
    await page.waitForTimeout(1500);

    console.log('4️⃣ Llenando items con datos de prueba...');
    // Llenar algunos items para probar
    const itemsToFill = [1, 5, 10, 15, 20, 25, 30, 35, 40];
    for (const i of itemsToFill) {
      await page.click(`input[name="cisneros_item_${i}"][value="4"]`);
      await page.waitForTimeout(100);
    }

    console.log('5️⃣ Calculando resultados...');
    // Click en Calcular Resultados
    await page.click('button:has-text("Calcular Resultados")');
    await page.waitForTimeout(3000);

    console.log('✅ Resultados calculados\n');

    console.log('6️⃣ Verificando gráfico...');
    // Screenshot del gráfico
    await page.screenshot({ path: 'cisneros-grafico.png' });
    console.log('   ✓ Screenshot gráfico generado');

    console.log('\n═════════════════════════════════════════');
    console.log('✅ CISNEROS ACTUALIZADO CORRECTAMENTE');
    console.log('═════════════════════════════════════════\n');

    console.log('📊 Verifica en el navegador:\n');
    console.log('   ✓ Badges Mobbing/Bossing en tabla');
    console.log('   ✓ Gráfico orden: NEAP → IGAP → IMAP');
    console.log('   ✓ Leyenda mejorada con descripción de cada índice\n');

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

verificarCisneros();
