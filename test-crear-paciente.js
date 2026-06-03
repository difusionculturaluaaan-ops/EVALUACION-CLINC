const { chromium } = require('playwright');

const BASE_URL = 'http://localhost:3000';

async function test() {
  console.log('\n🧪 TEST: Crear Paciente\n');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // 1. Navegar
    console.log('1️⃣  Navegando a la app...');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // 2. Login
    console.log('2️⃣  Login...');
    const emailInput = await page.$('input[type="email"]');
    if (emailInput) {
      await emailInput.fill('demo@clinica.com');
      await page.$('input[type="password"]').then(p => p.fill('demo123456'));
      await page.$('button:has-text("Entrar")').then(b => b.click());
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
    }

    // 3. Buscar botón "Crear Paciente"
    console.log('3️⃣  Buscando botón "Crear Paciente"...');
    const btnCrear = await page.$('text=Crear Paciente');
    if (!btnCrear) {
      throw new Error('❌ Botón "Crear Paciente" no encontrado');
    }
    console.log('✅ Botón encontrado');

    // 4. Click en botón
    console.log('4️⃣  Abriendo modal...');
    await btnCrear.click();
    await page.waitForTimeout(1000);

    // 5. Verificar modal
    console.log('5️⃣  Verificando modal...');
    const modal = await page.$('#modal-crear-paciente');
    if (!modal) {
      throw new Error('❌ Modal no encontrado');
    }

    const display = await modal.evaluate(el => window.getComputedStyle(el).display);
    if (display === 'none') {
      throw new Error('❌ Modal no está visible');
    }
    console.log('✅ Modal visible');

    // 6. Llenar formulario
    console.log('6️⃣  Llenando formulario...');
    await page.fill('#crear-nombre', 'Test Paciente');
    await page.fill('#crear-edad', '35');
    await page.selectOption('#crear-sexo', 'Masculino');
    await page.fill('#crear-email', 'test@example.com');
    console.log('✅ Formulario lleno');

    // 7. Guardar
    console.log('7️⃣  Haciendo click en "Crear Paciente"...');
    await page.$('button:has-text("Crear Paciente")').then(b => b.click());
    
    // Esperar confirmación
    await page.waitForTimeout(2000);
    
    const modalVisible = await page.$('#modal-crear-paciente').then(m => {
      return m.evaluate(el => window.getComputedStyle(el).display !== 'none');
    }).catch(() => false);

    if (!modalVisible) {
      console.log('✅ Modal cerrado después de guardar');
    }

    console.log('\n✅ TEST COMPLETADO EXITOSAMENTE\n');

  } catch (error) {
    console.error('❌ ERROR:', error.message);
  } finally {
    await browser.close();
  }
}

test();
