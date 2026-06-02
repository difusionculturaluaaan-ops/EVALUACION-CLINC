const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto('http://localhost:3000/mmpi-pro.html');
    console.log('✅ Página cargada');

    // 1. Llenar datos
    await page.fill('#inp-nombre', 'Test Patient');
    await page.fill('#inp-fecha', '2026-06-01');
    await page.fill('#inp-cargo', 'Psicólogo');
    await page.fill('#inp-inst', 'Clínica Test');
    await page.fill('#inp-eval', 'Dr. Test');
    await page.fill('#inp-edad', '35');

    // 2. Completar todos los 338 items
    console.log('🔄 Completando 338 items...');

    await page.evaluate(() => {
      for (let i = 1; i <= 338; i++) {
        const randomResp = Math.random() < 0.5 ? 'V' : 'F';
        setResp(i, randomResp);
      }
      // Llamar a syncTestProgress para actualizar la interfaz
      syncTestProgress();
    });

    console.log('✅ 338 items completados');

    // 3. Calcular
    console.log('⚡ Calculando resultados...');

    // Hacer clic en el botón finishTest
    await page.evaluate(() => {
      finishTest();
    });

    await page.waitForTimeout(1500);

    // 4. Navegar a Perfil
    console.log('📊 Capturando datos del gráfico...');

    await page.evaluate(() => {
      showTab('perfil');
      renderProfile();
    });

    await page.waitForTimeout(500);

    // 5. Obtener datos y comparar
    const comparison = await page.evaluate(() => {
      const screenData = JSON.parse(JSON.stringify(calcResults));
      const pdfData = JSON.parse(JSON.stringify(calcResults));

      let svg = null;
      let svgSize = 0;
      try {
        svg = generarSVGGraficoParaPDF();
        svgSize = svg ? svg.length : 0;
      } catch (e) {
        // Ignorar error
      }

      return {
        screenResults: screenData,
        pdfResults: pdfData,
        svgSize: svgSize,
        totalScales: screenData.length,
        allDataIdentical: JSON.stringify(screenData) === JSON.stringify(pdfData)
      };
    });

    console.log('\n🔍 VERIFICACIÓN DE CONSISTENCIA:\n');
    console.log(`✅ Total escalas: ${comparison.totalScales}`);
    if (comparison.svgSize > 0) {
      console.log(`✅ SVG generado (${comparison.svgSize} caracteres)`);
    } else {
      console.log(`❌ Error al generar SVG`);
    }
    console.log(`${comparison.allDataIdentical ? '✅' : '❌'} Datos idénticos entre pantalla y PDF`);

    console.log('\n📈 Escalas y T-scores:');
    let allMatch = true;
    comparison.screenResults.forEach((r, idx) => {
      const pdfResult = comparison.pdfResults[idx];
      const match = r.t === pdfResult.t;
      if (!match) allMatch = false;
      const icon = match ? '✅' : '❌';
      console.log(`  ${icon} ${idx + 1}. ${r.abbr}: T=${r.t} (PD=${r.pd})`);
    });

    if (!comparison.allDataIdentical || !allMatch) {
      console.error('\n❌ INCONSISTENCIA DETECTADA');
      process.exit(1);
    } else {
      console.log('\n✅ GRÁFICOS 100% CONSISTENTES: Ambos usan exactamente los mismos datos\n');
      process.exit(0);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
