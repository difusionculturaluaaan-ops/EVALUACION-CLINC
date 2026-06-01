const { chromium } = require('playwright');

(async () => {
  console.log('🚀 Test completo MMPI-2-RF...\n');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // 1. Ir a la app
    console.log('🌐 Cargando app...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    
    // 2. Verificar si está en login o ya autenticado
    const loginForm = await page.locator('input[placeholder*="Email"]').first();
    
    if (await loginForm.isVisible()) {
      console.log('🔐 Haciendo login...');
      await loginForm.fill('clinica@prueba.com');
      await page.locator('input[placeholder*="Contraseña"]').fill('123456');
      await page.locator('button:has-text("Entrar")').click();
      await page.waitForTimeout(3000);
    }
    
    console.log('✅ Autenticación completa');
    
    // 3. Esperar a que cargue sidebar
    await page.waitForSelector('.sidebar', { timeout: 10000 });
    console.log('✅ Sidebar visible');
    
    // 4. Screenshot de home
    await page.screenshot({ path: 'test-01-home.png' });
    console.log('📸 Screenshot 01: Home logueado\n');
    
    // 5. Buscar botón MMPI
    console.log('🔍 Buscando botón MMPI-2...');
    const btnMMPI = await page.locator('button[data-page="mmpi"]').first();
    
    if (await btnMMPI.isVisible()) {
      console.log('✅ Botón MMPI encontrado');
      await btnMMPI.click();
      await page.waitForTimeout(3000);
      
      // Screenshot de MMPI
      await page.screenshot({ path: 'test-02-mmpi.png' });
      console.log('📸 Screenshot 02: MMPI-2 abierto\n');
      
      // 6. Verificar estructura
      const hasPage = await page.locator('#page-mmpi').isVisible();
      const tabs = await page.locator('.tab-btn, .nav-item').count();
      
      console.log(`✅ Página MMPI visible: ${hasPage}`);
      console.log(`📊 Elementos de navegación: ${tabs}`);
      console.log('\n🎉 PRUEBA COMPLETADA CON ÉXITO\n');
      
    } else {
      console.log('⚠️  Botón MMPI no visible, posible que se necesite paciente');
      
      // Intentar crear un paciente primero
      console.log('👤 Buscando opción de crear paciente...');
      const btnNewPatient = await page.locator('button:has-text("Nuevo"), button:has-text("Crear")').first();
      
      if (await btnNewPatient.isVisible()) {
        console.log('✅ Botón crear paciente encontrado');
        // Tomar screenshot para ver la UI
        await page.screenshot({ path: 'test-01-home-nopatient.png' });
        console.log('📸 Screenshot guardado');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    console.log('\nNavegador abierto para inspección manual.\n');
  }
})();
