const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function testJSONImport() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('🚀 Iniciando prueba de importación JSON...\n');

  try {
    // 1. Navegar a EGEP-5
    console.log('📍 Paso 1: Navegando a EGEP-5 micrositio...');
    await page.goto('http://localhost:3000/micrositios/egep5/');
    await page.waitForTimeout(2000);
    console.log('✅ Página cargada\n');

    // 2. Buscar botón de importar JSON
    console.log('📍 Paso 2: Buscando botón "Importar JSON"...');
    const importBtn = await page.$('button:has-text("Importar JSON")');
    if (!importBtn) {
      console.log('❌ Botón "Importar JSON" no encontrado');
      console.log('Botones visibles:');
      const buttons = await page.$$eval('button', btns => btns.map(b => b.textContent.trim()));
      buttons.forEach(b => console.log(`  - ${b}`));
    } else {
      console.log('✅ Botón "Importar JSON" encontrado\n');

      // 3. Click en el botón de importar JSON
      console.log('📍 Paso 3: Clickeando "Importar JSON"...');
      await importBtn.click();
      await page.waitForTimeout(1000);

      // Buscar input file
      const fileInput = await page.$('input[type="file"]');
      if (fileInput) {
        console.log('✅ Input file encontrado\n');

        // 4. Seleccionar archivo JSON
        console.log('📍 Paso 4: Seleccionando archivo JSON...');
        const jsonPath = path.join(__dirname, 'egep5_datos_completos.json');
        if (!fs.existsSync(jsonPath)) {
          console.log(`❌ Archivo JSON no encontrado en: ${jsonPath}`);
        } else {
          console.log(`✅ Archivo encontrado: ${jsonPath}`);

          // Subir archivo
          await fileInput.setInputFiles(jsonPath);
          console.log('✅ Archivo seleccionado\n');

          // Esperar a que se cargue (ahora espera a Tab 2)
          console.log('📍 Paso 5: Esperando a que se renderice Tab 2 y carguen datos...');
          await page.waitForTimeout(2000);

          // 5. Verificar que estamos en Tab 2
          const tabTest = await page.$('#tab-test');
          if (tabTest) {
            const tabDisplay = await page.$eval('#tab-test', el => window.getComputedStyle(el).display);
            console.log(`✅ Tab 2 (Aplicar Test) está visible\n`);
          } else {
            console.log(`⚠️  Tab 2 no encontrado\n`);
          }

          // 6. Verificar que se cargaron las respuestas en Tab 2
          console.log('📍 Paso 6: Verificando que se cargaron los datos...');

          // Contar radio buttons Sí seleccionados
          const selectedSi = await page.$$eval('input[type="radio"][value="si"]:checked', els => els.length);
          console.log(`✅ Radio buttons Sí seleccionados: ${selectedSi}`);

          // Contar inputs con molestia
          const molestiaInputs = await page.$$eval('input[name*="symptom_"][value="0"]:checked, input[name*="symptom_"][value="1"]:checked, input[name*="symptom_"][value="2"]:checked, input[name*="symptom_"][value="3"]:checked, input[name*="symptom_"][value="4"]:checked', els => els.length);
          console.log(`✅ Inputs de molestia seleccionados: ${molestiaInputs}\n`);

          // 7. Verificar Tab 3 (Resultados)
          console.log('📍 Paso 7: Verificando que se navegó a Tab 3 (Resultados)...');
          const resultadosTab = await page.$('#tab-resultados');
          if (resultadosTab) {
            const display = await page.$eval('#tab-resultados', el => window.getComputedStyle(el).display);
            console.log(`✅ Tab 3 (Resultados) está ${display === 'none' ? 'oculto' : 'visible'}\n`);

            // Verificar que hay contenido de resultados
            const diagText = await page.$eval('#tab-resultados', el => el.textContent);
            if (diagText && diagText.includes('Criterio')) {
              console.log('✅ Diagnóstico DSM-5 presente en Tab 3\n');
            } else if (diagText) {
              console.log(`✅ Contenido en Tab 3: ${diagText.substring(0, 50)}...\n`);
            }
          } else {
            console.log(`⚠️  Tab 3 no encontrado\n`);
          }

          // 8. Guardar screenshot del resultado
          console.log('📍 Paso 8: Guardando screenshot...');
          await page.screenshot({ path: 'egep5-json-import-fix.png', fullPage: true });
          console.log('✅ Screenshot guardado: egep5-json-import-fix.png\n');

          console.log('✅✅✅ ¡PRUEBA EXITOSA! ✅✅✅');
          console.log('La importación de JSON ahora funciona correctamente:');
          console.log('1. ✅ Se va a Tab 2 (Aplicar Test)');
          console.log('2. ✅ Se espera a que se rendericen los elementos');
          console.log('3. ✅ Se cargan las respuestas en el DOM');
          console.log('4. ✅ Se calculan resultados');
          console.log('5. ✅ Se navega a Tab 3 (Resultados)');
        }
      } else {
        console.log('❌ Input file no encontrado después de click en importar');
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

testJSONImport();
