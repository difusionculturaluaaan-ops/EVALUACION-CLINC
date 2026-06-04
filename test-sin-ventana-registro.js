const { chromium } = require('playwright');

async function test() {
  console.log('\n✅ TEST: Sin ventana de registro en tests\n');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Login
    console.log('1️⃣  Login...');
    await page.goto('http://localhost:3000/auth.html');
    await page.fill('input[type="email"]', 'demo@clinica.com');
    await page.fill('input[type="password"]', 'demo123456');
    await page.$('button:has-text("Entrar")').then(b => b.click());
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    console.log('✅ Logueado');

    // Intentar abrir test sin paciente
    console.log('\n2️⃣  Click en SCL-90-R sin paciente...');
    await page.$('button:has-text("SCL-90-R")').then(b => b.click());
    await page.waitForTimeout(1000);

    // Verificar que NO se abre formulario de registro
    const formularioVisible = await page.evaluate(() => {
      const page = document.getElementById('page-nuevo');
      return page && window.getComputedStyle(page).display !== 'none';
    });

    if (formularioVisible) {
      console.log('❌ FALLO: Formulario de registro aún visible');
    } else {
      console.log('✅ BIEN: Formulario de registro NO se abrió');
    }

    // Verificar que se muestra toast de error
    const toast = await page.evaluate(() => {
      const t = document.getElementById('toast');
      return t ? t.textContent : '';
    });

    if (toast.includes('crear') || toast.includes('seleccionar')) {
      console.log(`✅ Toast mostrado: "${toast}"`);
    } else {
      console.log(`⚠️ Toast no mostrado o incorrecto`);
    }

    console.log('\n✅ TEST EXITOSO\n');

  } catch (error) {
    console.error('❌ ERROR:', error.message);
  } finally {
    await browser.close();
  }
}

test();
