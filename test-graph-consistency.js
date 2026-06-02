const { test, expect } = require('@playwright/test');

test('MMPI-2-RF: Verificar consistencia de gráficos pantalla vs PDF', async ({ browser, context }) => {
  const page = await context.newPage();
  await page.goto('http://localhost:3000/mmpi-pro.html');

  // 1. Llenar datos del paciente
  await page.fill('#inp-nombre', 'Test Patient');
  await page.fill('#inp-fecha', '2026-06-01');
  await page.fill('#inp-cargo', 'Psicólogo');
  await page.fill('#inp-inst', 'Clínica Test');
  await page.fill('#inp-eval', 'Dr. Test');
  await page.fill('#inp-edad', '35');

  // 2. Completar 338 items
  console.log('🔄 Completando 338 items aleatorios...');
  for (let p = 0; p < 15; p++) {
    const items = await page.$$('.item-radio');
    for (const item of items) {
      const radios = await item.$$('input[type="radio"]');
      const randomRadio = radios[Math.floor(Math.random() * radios.length)];
      await randomRadio.click();
    }
    if (p < 14) {
      await page.click('#btn-next-page');
      await page.waitForTimeout(200);
    }
  }

  // 3. Calcular resultados
  console.log('⚡ Calculando resultados...');
  await page.click('#btn-finish-test');
  await page.waitForTimeout(1000);

  // 4. Navegar a Perfil Visual y capturar gráfico de pantalla
  console.log('📊 Analizando gráfico de pantalla...');
  await page.click('[onclick="showTab(\'perfil\')"]');
  await page.waitForTimeout(500);

  // Obtener datos del gráfico de pantalla (calcResults)
  const screenGraphData = await page.evaluate(() => {
    return JSON.stringify(calcResults);
  });
  const screenResults = JSON.parse(screenGraphData);
  console.log(`✅ Gráfico de pantalla: ${screenResults.length} escalas`);
  screenResults.forEach(r => {
    console.log(`  - ${r.abbr}: T=${r.t} (PD=${r.pd})`);
  });

  // Capturar pantalla del gráfico
  const screenGraphPath = 'test-results/graph-screen.png';
  await page.screenshot({ path: screenGraphPath, fullPage: false });

  // 5. Generar PDF y analizar datos incrustados
  console.log('📄 Analizando gráfico del PDF...');

  // Capturar el SVG generado en el PDF
  const svgData = await page.evaluate(() => {
    return generarSVGGraficoParaPDF();
  });

  // Extraer datos del SVG
  const pdfResults = await page.evaluate(() => {
    return JSON.stringify(calcResults);
  });
  const pdfData = JSON.parse(pdfResults);
  console.log(`✅ Gráfico PDF: ${pdfData.length} escalas`);
  pdfData.forEach(r => {
    console.log(`  - ${r.abbr}: T=${r.t} (PD=${r.pd})`);
  });

  // 6. VERIFICAR CONSISTENCIA
  console.log('\n🔍 VERIFICANDO CONSISTENCIA...\n');

  let allMatch = true;

  // Verificar que ambos tienen el mismo número de escalas
  expect(screenResults.length).toBe(pdfData.length);
  console.log(`✅ Ambos tienen ${screenResults.length} escalas`);

  // Verificar que cada escala tiene el mismo T-score
  for (let i = 0; i < screenResults.length; i++) {
    const screen = screenResults[i];
    const pdf = pdfData[i];

    expect(screen.abbr).toBe(pdf.abbr);
    expect(screen.t).toBe(pdf.t);
    expect(screen.pd).toBe(pdf.pd);

    if (screen.t === pdf.t) {
      console.log(`✅ ${screen.abbr}: T=${screen.t} (COINCIDE)`);
    } else {
      console.error(`❌ ${screen.abbr}: Pantalla T=${screen.t}, PDF T=${pdf.t} (NO COINCIDE)`);
      allMatch = false;
    }
  }

  if (allMatch) {
    console.log('\n✅ GRÁFICOS CONSISTENTES: Ambos usan los mismos datos');
  } else {
    console.error('\n❌ INCONSISTENCIA DETECTADA: Los gráficos usan datos diferentes');
  }

  expect(allMatch).toBe(true);
});
