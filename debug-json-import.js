const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function debugJSONImport() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('🔍 Debug: Importación JSON EGEP-5\n');

  try {
    // 1. Navegar a EGEP-5
    console.log('📍 Paso 1: Navegando a EGEP-5...');
    await page.goto('http://localhost:3000/micrositios/egep5/');
    await page.waitForTimeout(2000);
    console.log('✅ Página cargada\n');

    // 2. Click en botón Importar JSON
    console.log('📍 Paso 2: Buscando botón "Importar JSON"...');
    const importBtn = await page.$('button:has-text("Importar JSON")');
    if (!importBtn) {
      console.log('❌ Botón no encontrado');
      return;
    }
    console.log('✅ Botón encontrado');

    // Click
    console.log('📍 Paso 3: Clickeando botón...');
    await importBtn.click();
    await page.waitForTimeout(1000);

    // Subir archivo
    const fileInput = await page.$('input[type="file"]');
    const jsonPath = path.join(__dirname, 'egep5_datos_completos.json');
    await fileInput.setInputFiles(jsonPath);
    console.log('✅ Archivo seleccionado\n');

    // Esperar a que se cargue
    console.log('📍 Paso 4: Esperando a que se carguen datos (3 segundos)...');
    await page.waitForTimeout(3000);

    // Debug: Ver contenido del Tab 2
    console.log('📍 Paso 5: Inspeccionando Tab 2...\n');

    // Contar elementos symptom_respuesta_27
    const siForms = await page.$$('input[name*="symptom_respuesta_"]');
    console.log(`✅ Encontrados ${siForms.length} radio buttons Sí/No\n`);

    // Ver una muestra de elementos
    if (siForms.length > 0) {
      console.log('📋 Primeros 5 elementos Sí/No:');
      for (let i = 0; i < Math.min(5, siForms.length); i++) {
        const name = await siForms[i].getAttribute('name');
        const value = await siForms[i].getAttribute('value');
        const checked = await siForms[i].isChecked();
        console.log(`  [${i+1}] name="${name}" value="${value}" checked=${checked}`);
      }
    }

    console.log('\n📋 Molestia inputs:');
    const molestiaForms = await page.$$('input[name^="symptom_"][type="radio"]');
    const uniqueNames = new Set();
    for (const form of molestiaForms) {
      const name = await form.getAttribute('name');
      if (name && name.match(/^symptom_\d+$/)) {
        uniqueNames.add(name);
      }
    }
    console.log(`✅ Encontrados ${uniqueNames.size} items con molestia`);
    const firstFive = Array.from(uniqueNames).slice(0, 5);
    console.log(`  Ejemplos: ${firstFive.join(', ')}`);

    // Ver el HTML de la tabla de síntomas
    console.log('\n📍 Paso 6: Leyendo HTML de tabla de síntomas...');
    const tableHTML = await page.$eval('table.egep5-symptoms-table', el => el.outerHTML.substring(0, 500));
    console.log('Primeros 500 chars de tabla:');
    console.log(tableHTML + '\n...\n');

    // Verificar que los datos llegaron a memoria
    console.log('📍 Paso 7: Verificando datos en memoria...');
    const memoryData = await page.evaluate(() => {
      return {
        items_27_31: window.tests_egep5?.respuestas?.items_27_31 || [],
        items_32_33: window.tests_egep5?.respuestas?.items_32_33 || [],
        items_34_40: window.tests_egep5?.respuestas?.items_34_40 || []
      };
    });
    console.log('Datos en memoria (window.tests_egep5.respuestas):');
    console.log('  items_27_31:', memoryData.items_27_31);
    console.log('  items_32_33:', memoryData.items_32_33);
    console.log('  items_34_40:', memoryData.items_34_40);

    // Guardar screenshot para inspección visual
    console.log('\n📍 Paso 8: Guardando screenshot...');
    await page.screenshot({ path: 'debug-json-import-tab2.png', fullPage: true });
    console.log('✅ Screenshot guardado: debug-json-import-tab2.png\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    await browser.close();
  }
}

debugJSONImport();
