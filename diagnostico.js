/**
 * Script de Diagnóstico
 * Verifica qué hay en la página actual de Edge
 */

const { chromium } = require('playwright');

async function diagnostic() {
  console.log('\n🔍 DIAGNÓSTICO DE PÁGINA ACTUAL\n');

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log('📍 Conectando a http://localhost:3000...\n');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    console.log('⏳ Esperando 5 segundos para que cargue...\n');
    await page.waitForTimeout(5000);

    // Diagnóstico
    const diagnostics = await page.evaluate(() => {
      return {
        // URL actual
        url: window.location.href,
        title: document.title,

        // Elementos comunes de preguntas
        radios: document.querySelectorAll('input[type="radio"]').length,
        checkboxes: document.querySelectorAll('input[type="checkbox"]').length,
        buttons: document.querySelectorAll('button').length,
        inputs: document.querySelectorAll('input').length,

        // Atributos específicos
        dataPages: document.querySelectorAll('[data-page]').length,
        pages: document.querySelectorAll('[class*="page"]').length,

        // Formularios
        forms: document.querySelectorAll('form').length,

        // Texto visible
        bodyText: document.body.innerText.substring(0, 200),

        // Botones por texto
        buttons_text: Array.from(document.querySelectorAll('button')).slice(0, 10).map(b => b.innerText),

        // Inputs por placeholder
        inputs_placeholder: Array.from(document.querySelectorAll('input')).slice(0, 5).map(i => ({
          type: i.type,
          placeholder: i.placeholder
        }))
      };
    });

    console.log('📊 RESULTADO DEL DIAGNÓSTICO:\n');
    console.log(`   URL Actual: ${diagnostics.url}`);
    console.log(`   Título: ${diagnostics.title}\n`);

    console.log('   📝 Elementos encontrados:');
    console.log(`      • Inputs de radio: ${diagnostics.radios}`);
    console.log(`      • Inputs de checkbox: ${diagnostics.checkboxes}`);
    console.log(`      • Inputs totales: ${diagnostics.inputs}`);
    console.log(`      • Botones: ${diagnostics.buttons}`);
    console.log(`      • Formularios: ${diagnostics.forms}`);
    console.log(`      • [data-page]: ${diagnostics.dataPages}`);
    console.log(`      • [class*="page"]: ${diagnostics.pages}\n`);

    if (diagnostics.radios > 0) {
      console.log('   ✅ DETECTADO: Inputs de radio (TEST ABIERTO)');
    } else if (diagnostics.radios === 0 && diagnostics.inputs > 5) {
      console.log('   ⚠️  PROBABLE: Aún en login o selección de paciente');
    } else {
      console.log('   ❌ NO DETECTADO: Test no está abierto');
    }

    console.log('\n   🔘 Primeros 10 botones:');
    diagnostics.buttons_text.forEach((text, i) => {
      if (text) console.log(`      ${i + 1}. ${text}`);
    });

    console.log('\n   📋 Primeros 5 inputs:');
    diagnostics.inputs_placeholder.forEach((input, i) => {
      console.log(`      ${i + 1}. [${input.type}] ${input.placeholder || '(sin placeholder)'}`);
    });

    console.log('\n   📄 Primeros 200 caracteres del body:');
    console.log(`      "${diagnostics.bodyText}..."\n`);

    console.log('═══════════════════════════════════════════════════════════════════\n');
    console.log('💡 PRÓXIMOS PASOS:\n');
    if (diagnostics.radios === 0) {
      console.log('   1. Haz login en Edge si aún no lo has hecho');
      console.log('   2. Selecciona a PEDRO como paciente');
      console.log('   3. Abre el test SCL-90R');
      console.log('   4. Ejecuta este script nuevamente\n');
    } else {
      console.log('   ✅ El test está abierto. Ejecuta: node test-pedro-simple.js\n');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    console.log('👉 Ve a Edge y haz los pasos necesarios, luego ejecuta el test script\n');
    await browser.close();
  }
}

// Ejecutar
diagnostic().catch(console.error);
