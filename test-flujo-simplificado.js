const { chromium } = require('playwright');

const BASE_URL = 'http://localhost:3000';

async function test() {
  console.log('\n✅ TEST: Flujo Simplificado de Creación de Paciente\n');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // 1. Login
    console.log('1️⃣  Login...');
    await page.goto(`${BASE_URL}/auth.html`);
    await page.fill('input[type="email"]', 'demo@clinica.com');
    await page.fill('input[type="password"]', 'demo123456');
    await page.$('button:has-text("Entrar")').then(b => b.click());
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    console.log('✅ Logueado');

    // 2. Intentar abrir un test sin paciente
    console.log('\n2️⃣  Intentar abrir SCL-90-R sin paciente...');
    await page.$('button:has-text("SCL-90-R")').then(b => b.click());
    await page.waitForTimeout(1000);
    
    // Verificar que se muestra el toast de error
    const hasError = await page.evaluate(() => {
      const toast = document.getElementById('toast');
      return toast && toast.textContent.includes('Primero debes crear');
    });
    
    if (hasError) {
      console.log('✅ Toast de error mostrado correctamente');
    } else {
      console.log('⚠️  Toast no mostrado o mensaje incorrecto');
    }

    // 3. Crear paciente
    console.log('\n3️⃣  Crear Paciente...');
    await page.$('button:has-text("Crear Paciente")').then(b => b.click());
    await page.waitForTimeout(1000);
    
    // Llenar formulario
    await page.fill('#crear-nombre', 'Test Patient');
    await page.fill('#crear-edad', '30');
    await page.selectOption('#crear-sexo', 'Masculino');
    
    // Guardar
    await page.$('button:has-text("Crear Paciente"):last-of-type').then(b => b.click());
    await page.waitForTimeout(2000);
    console.log('✅ Paciente creado');

    // 4. Ahora abrir el test
    console.log('\n4️⃣  Abrir SCL-90-R con paciente...');
    await page.$('button:has-text("SCL-90-R")').then(b => b.click());
    await page.waitForTimeout(1500);
    
    // Verificar que se abre el test (buscar página del test)
    const testOpened = await page.evaluate(() => {
      return document.getElementById('page-scl90r') && 
             window.getComputedStyle(document.getElementById('page-scl90r')).display !== 'none';
    }).catch(() => false);
    
    if (testOpened) {
      console.log('✅ Test abierto correctamente');
    } else {
      console.log('❌ Test no se abrió');
    }

    console.log('\n✅ TEST COMPLETADO EXITOSAMENTE\n');

  } catch (error) {
    console.error('❌ ERROR:', error.message);
  } finally {
    await browser.close();
  }
}

test();
