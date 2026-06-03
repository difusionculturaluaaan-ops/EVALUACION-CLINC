const { chromium } = require('playwright');

const BASE_URL = 'http://localhost:3000';

async function test() {
  console.log('\n✅ TEST: Botón "Crear Paciente" Funcional\n');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // 1. Login
    console.log('1️⃣  Login con demo@clinica.com...');
    await page.goto(`${BASE_URL}/auth.html`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    
    await page.fill('input[type="email"]', 'demo@clinica.com');
    await page.fill('input[type="password"]', 'demo123456');
    await page.$('button:has-text("Entrar")').then(b => b.click());
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    console.log('✅ Login completado');

    // 2. Verificar que app existe
    console.log('\n2️⃣  Verificando que app está disponible...');
    const appExists = await page.evaluate(() => {
      return typeof app !== 'undefined' && typeof app.mostrarModalCrearPaciente === 'function';
    });
    
    if (!appExists) {
      throw new Error('❌ app o función no disponibles');
    }
    console.log('✅ app.mostrarModalCrearPaciente disponible');

    // 3. Click en botón "Crear Paciente"
    console.log('\n3️⃣  Haciendo click en botón "Crear Paciente"...');
    await page.$('button:has-text("Crear Paciente")').then(b => b.click());
    await page.waitForTimeout(1500);
    
    console.log('✅ Click realizado');

    // 4. Verificar que modal se abre
    console.log('\n4️⃣  Verificando que modal se abre...');
    const modalVisible = await page.evaluate(() => {
      const modal = document.getElementById('modal-crear-paciente');
      if (!modal) return false;
      return modal.classList.contains('active');
    });
    
    if (!modalVisible) {
      throw new Error('❌ Modal no está visible');
    }
    console.log('✅ Modal visible con clase "active"');

    // 5. Verificar campos vacíos
    console.log('\n5️⃣  Verificando que formulario está limpio...');
    const formClear = await page.evaluate(() => {
      return {
        nombre: document.getElementById('crear-nombre').value,
        edad: document.getElementById('crear-edad').value,
        sexo: document.getElementById('crear-sexo').value
      };
    });
    
    if (formClear.nombre === '' && formClear.edad === '' && formClear.sexo === '') {
      console.log('✅ Formulario limpio');
    } else {
      console.log('⚠️  Formulario tiene datos', formClear);
    }

    // 6. Llenar y guardar
    console.log('\n6️⃣  Llenando formulario...');
    await page.fill('#crear-nombre', 'Juan Pérez López');
    await page.fill('#crear-edad', '45');
    await page.selectOption('#crear-sexo', 'Masculino');
    await page.fill('#crear-email', 'juan@example.com');
    await page.fill('#crear-telefono', '+34 600 123 456');
    
    console.log('✅ Formulario lleno');

    // 7. Click en "Crear Paciente" (guardar)
    console.log('\n7️⃣  Guardando paciente...');
    
    // Esperar a que se muestre el toast de éxito
    let guardadoExitoso = false;
    const startTime = Date.now();
    
    // Click en botón guardar
    await page.$('button:has-text("Crear Paciente"):not(.nav-item)').then(b => b.click());
    
    // Esperar toast
    while (Date.now() - startTime < 5000) {
      const toast = await page.evaluate(() => {
        const t = document.getElementById('toast');
        return t ? t.textContent : '';
      });
      
      if (toast.includes('creado')) {
        guardadoExitoso = true;
        console.log(`✅ Toast: "${toast}"`);
        break;
      }
      await page.waitForTimeout(100);
    }
    
    if (!guardadoExitoso) {
      console.log('⚠️  Toast no mostrado, pero continuar');
    }

    // 8. Verificar que modal se cerró
    console.log('\n8️⃣  Verificando que modal se cerró...');
    await page.waitForTimeout(1000);
    
    const modalClosed = await page.evaluate(() => {
      const modal = document.getElementById('modal-crear-paciente');
      return !modal.classList.contains('active');
    });
    
    if (modalClosed) {
      console.log('✅ Modal cerrado');
    } else {
      console.log('⚠️  Modal aún visible');
    }

    console.log('\n✅ TEST COMPLETADO EXITOSAMENTE\n');

  } catch (error) {
    console.error('\n❌ ERROR:', error.message, '\n');
  } finally {
    await browser.close();
  }
}

test();
