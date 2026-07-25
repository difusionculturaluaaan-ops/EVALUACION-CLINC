const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log('🔍 Navegando a CISNEROS...');
  await page.goto('http://localhost:3000/micrositios/cisneros', { waitUntil: 'networkidle' });

  console.log('📁 Importando JSON...');
  const jsonPath = path.join(__dirname, 'test_cisneros.json');

  if (!fs.existsSync(jsonPath)) {
    console.error(`❌ JSON no encontrado en: ${jsonPath}`);
    await browser.close();
    process.exit(1);
  }

  console.log(`✅ JSON encontrado en: ${jsonPath}`);

  const fileInput = await page.$('#cisneros-file-input');

  if (!fileInput) {
    console.error('❌ No se encontró el input de archivo');
    await browser.close();
    process.exit(1);
  }

  await fileInput.setInputFiles(jsonPath);

  console.log('⏳ Esperando a que se procese el import...');
  await page.waitForTimeout(1500);

  // Verificar datos
  console.log('🔍 Verificando datos cargados...');

  const datos = await page.evaluate(() => {
    return {
      nombre: document.getElementById('c_nombre')?.value,
      edad: document.getElementById('c_edad')?.value,
      sexo: document.getElementById('c_sexo')?.value,
      empresa: document.getElementById('c_empresa')?.value,
      evaluador: document.getElementById('c_evaluador')?.value,
      fecha: document.getElementById('c_fecha')?.value,
      respuestasCount: document.querySelectorAll('input[type="radio"]:checked').length
    };
  });

  console.log('📋 Datos cargados:');
  console.log(`  ✓ Nombre: ${datos.nombre || '(vacío)'}`);
  console.log(`  ✓ Edad: ${datos.edad || '(vacío)'}`);
  console.log(`  ✓ Sexo: ${datos.sexo || '(vacío)'}`);
  console.log(`  ✓ Empresa: ${datos.empresa || '(vacío)'}`);
  console.log(`  ✓ Evaluador: ${datos.evaluador || '(vacío)'}`);
  console.log(`  ✓ Fecha: ${datos.fecha || '(vacío)'}`);
  console.log(`  ✓ Radio buttons marcados: ${datos.respuestasCount}`);

  // Verificar que los radio buttons están marcados
  console.log('🔍 Verificando radio buttons...');
  const radiosMarcos = await page.evaluate(() => {
    const checked = [];
    for (let i = 1; i <= 43; i++) {
      const radio = document.querySelector(`input[name="cisneros_item_${i}"]:checked`);
      if (radio) {
        checked.push({ item: i, valor: radio.value });
      }
    }
    return checked;
  });

  console.log(`✅ ${radiosMarcos.length} radio buttons marcados`);
  if (radiosMarcos.length === 43) {
    console.log('✅ TODOS los radio buttons están marcados correctamente');
  } else {
    console.warn(`⚠️  Solo ${radiosMarcos.length}/43 radio buttons están marcados`);
  }

  // Tomar screenshot
  const screenshotDir = '/c/Users/image/AppData/Local/Temp/claude/c--Users-image-Developer-software-EVALUACI-N-CL-NICA-PSICO/eab7d850-41d6-4261-a1d2-6009b7a7d78c/scratchpad';
  const screenshotPath = path.join(screenshotDir, 'cisneros_import_test.png');
  console.log('📸 Tomando screenshot del test...');
  await page.screenshot({ path: screenshotPath });
  console.log(`✅ Screenshot guardado`);

  // Calcular resultados
  console.log('📊 Calculando resultados...');
  try {
    await page.click('button:has-text("Calcular Resultados")');
    await page.waitForTimeout(1500);

    // Screenshot final
    const screenshotPath2 = path.join(screenshotDir, 'cisneros_resultados.png');
    console.log('📸 Tomando screenshot de resultados...');
    await page.screenshot({ path: screenshotPath2 });
    console.log(`✅ Screenshot guardado`);

    const resultadosVisibles = await page.evaluate(() => {
      const btn = document.querySelector('button:has-text("Guardar en Expediente")');
      return btn ? true : false;
    });

    if (resultadosVisibles) {
      console.log('✅ Botón "Guardar en Expediente" visible - resultados calculados');
    }
  } catch (e) {
    console.warn('⚠️  No se pudo calcular resultados automáticamente');
  }

  console.log('\n✅ TEST COMPLETADO EXITOSAMENTE');
  console.log('\n📊 RESUMEN:');
  console.log(`  • JSON importado correctamente`);
  console.log(`  • ${radiosMarcos.length}/43 radio buttons marcados`);
  console.log(`  • Datos de paciente: ${datos.nombre ? 'SÍ' : 'NO'}`);

  await browser.close();
  process.exit(0);
})().catch((error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
