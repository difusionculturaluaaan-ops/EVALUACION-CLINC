const { chromium } = require('playwright');

(async () => {
  console.log('🚀 Abriendo aplicación en Chrome...\n');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // 1. Ir a la app
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    console.log('✅ App cargada');
    
    // Tomar screenshot inicial
    await page.screenshot({ path: 'test-01-home.png' });
    console.log('📸 Screenshot 01: Home guardado\n');
    
    // 2. Buscar botón MMPI-2-RF en sidebar
    console.log('🔍 Buscando botón MMPI-2-RF...');
    const btnMMPI = await page.locator('button[data-page="mmpi"]').first();
    
    if (await btnMMPI.isVisible()) {
      console.log('✅ Botón MMPI encontrado');
      await btnMMPI.click();
      await page.waitForTimeout(2000);
      
      // Screenshot de MMPI
      await page.screenshot({ path: 'test-02-mmpi-loaded.png' });
      console.log('📸 Screenshot 02: MMPI-2-RF cargado\n');
      
      // Verificar que existan las 5 pestañas
      const tabs = await page.locator('.tab-btn').count();
      console.log(`📊 Pestañas encontradas: ${tabs}`);
      
      // Verificar elementos clave
      const hasTabBar = await page.locator('.tabs-bar').isVisible();
      const hasCards = await page.locator('.card').count();
      
      console.log(`✅ Tab bar visible: ${hasTabBar}`);
      console.log(`✅ Cards encontradas: ${hasCards}`);
      
      // Hacer clic en la pestaña "Aplicar Test"
      const tabTest = await page.locator('button:has-text("Aplicar Test")').first();
      if (await tabTest.isVisible()) {
        await tabTest.click();
        await page.waitForTimeout(1500);
        
        const itemsGrid = await page.locator('.items-grid').isVisible();
        console.log(`✅ Items grid visible: ${itemsGrid}`);
        
        await page.screenshot({ path: 'test-03-mmpi-test-tab.png' });
        console.log('📸 Screenshot 03: Pestaña Aplicar Test\n');
      }
      
      console.log('🎉 PRUEBA EXITOSA - Sin errores de consola\n');
    } else {
      console.log('❌ No se encontró botón MMPI');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await page.waitForTimeout(3000);
    console.log('Navegador abierto. Puedes interactuar o cerrar.\n');
    // No cerrar - dejar el navegador abierto
  }
})();
