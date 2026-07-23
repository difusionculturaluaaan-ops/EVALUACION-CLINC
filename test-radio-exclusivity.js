const { chromium } = require('playwright');

async function testRadioExclusivity() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('🔍 TEST: Exclusividad de Radio Buttons en Características\n');

  try {
    // Navegar a EGEP-5
    await page.goto('http://localhost:3000/micrositios/egep5/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Ir a Tab 2
    await page.click('button:has-text("Aplicar Test")');
    await page.waitForTimeout(1500);

    console.log('📍 Probando Item 16 (Características)...\n');

    // Click en Sí para Item 16
    console.log('1️⃣ Click en Sí para Item 16');
    const radio16si = await page.$('input[name="caract_16"][value="si"]');
    if (radio16si) {
      await radio16si.click();
      await page.waitForTimeout(500);

      // Verificar que Sí está checked
      const isSiChecked = await radio16si.evaluate(el => el.checked);
      console.log(`   ✓ Radio Sí checked: ${isSiChecked}`);

      // Verificar que NO no está checked
      const radio16no = await page.$('input[name="caract_16"][value="no"]');
      const isNoChecked = await radio16no.evaluate(el => el.checked);
      console.log(`   ✓ Radio NO checked: ${isNoChecked}`);

      if (isSiChecked && !isNoChecked) {
        console.log('   ✅ CORRECTO: Solo Sí está seleccionado\n');
      } else {
        console.log('   ❌ ERROR: Ambos están seleccionados o ninguno\n');
      }
    }

    // Click en NO para Item 16
    console.log('2️⃣ Click en NO para Item 16');
    const radio16no = await page.$('input[name="caract_16"][value="no"]');
    if (radio16no) {
      await radio16no.click();
      await page.waitForTimeout(500);

      // Verificar que NO está checked
      const isNoChecked = await radio16no.evaluate(el => el.checked);
      console.log(`   ✓ Radio NO checked: ${isNoChecked}`);

      // Verificar que Sí no está checked
      const radio16si = await page.$('input[name="caract_16"][value="si"]');
      const isSiChecked = await radio16si.evaluate(el => el.checked);
      console.log(`   ✓ Radio Sí checked: ${isSiChecked}`);

      if (isNoChecked && !isSiChecked) {
        console.log('   ✅ CORRECTO: Solo NO está seleccionado\n');
      } else {
        console.log('   ❌ ERROR: Ambos están seleccionados o ninguno\n');
      }
    }

    // Screenshot
    await page.screenshot({ path: 'test-radio-exclusivity.png' });

    console.log('📋 Resumen:');
    console.log('   Los radio buttons de Características DEBEN ser mutuamente excluyentes');
    console.log('   Solo se puede seleccionar UNO de los dos (Sí o NO)');
    console.log('   El CSS debe mostrar solo UN checkmark, no dos\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

testRadioExclusivity();
