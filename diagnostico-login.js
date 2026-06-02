/**
 * Diagnóstico de Selectores de Login
 */

const { chromium } = require('playwright');

async function diagnosisLogin() {
  console.log('\n🔍 DIAGNÓSTICO DE SELECTORES DE LOGIN\n');

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log('📍 Navegando a http://localhost:3000...\n');
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(2000);

    const info = await page.evaluate(() => {
      return {
        // Botones
        buttons: Array.from(document.querySelectorAll('button')).map(b => ({
          text: b.innerText.trim(),
          classes: b.className,
          id: b.id
        })),

        // Inputs
        inputs: Array.from(document.querySelectorAll('input')).map(i => ({
          type: i.type,
          placeholder: i.placeholder,
          name: i.name,
          id: i.id,
          classes: i.className,
          value: i.value
        })),

        // Labels
        labels: Array.from(document.querySelectorAll('label')).map(l => l.innerText),

        // Divs con clases
        divs: Array.from(document.querySelectorAll('div[class]'))
          .filter(d => d.innerText.includes('Email') || d.innerText.includes('Contraseña') || d.innerText.includes('Clínica'))
          .slice(0, 5)
          .map(d => ({
            text: d.innerText.substring(0, 50),
            classes: d.className
          }))
      };
    });

    console.log('📊 ELEMENTOS ENCONTRADOS:\n');

    console.log('🔘 BOTONES:');
    info.buttons.forEach((btn, i) => {
      console.log(`   ${i + 1}. "${btn.text}" [${btn.id || btn.classes}]`);
    });

    console.log('\n📝 INPUTS:');
    info.inputs.forEach((inp, i) => {
      console.log(`   ${i + 1}. [${inp.type}] placeholder="${inp.placeholder}" name="${inp.name}" id="${inp.id}"`);
    });

    console.log('\n📌 SELECTORES ÚTILES:\n');
    console.log('   Para email (primer input de email):');
    console.log('   → page.locator("input[type=\'email\']").first()');

    console.log('\n   Para contraseña (primer input de password):');
    console.log('   → page.locator("input[type=\'password\']").first()');

    console.log('\n   Para botón Entrar (Clínica):');
    const enterBtns = info.buttons.filter(b => b.text.includes('Entrar'));
    if (enterBtns.length > 0) {
      console.log(`   → button:has-text("${enterBtns[0].text}")`);
    }

    console.log('\n   Para botón Clínica:');
    const clinicaBtns = info.buttons.filter(b => b.text.includes('Clínica'));
    if (clinicaBtns.length > 0) {
      console.log(`   → button:has-text("${clinicaBtns[0].text}")`);
    }

    console.log('\n═══════════════════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    console.log('Cerrando navegador...\n');
    await browser.close();
  }
}

diagnosisLogin().catch(console.error);
