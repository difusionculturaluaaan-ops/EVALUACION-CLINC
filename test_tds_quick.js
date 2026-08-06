const { chromium } = require('playwright');

(async () => {
  console.log('🌐 Probando conexión a localhost:3000...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto('http://localhost:3000/', { timeout: 10000 });
    console.log('✅ Servidor está corriendo');

    // Verificar que cargó
    const title = await page.title();
    console.log('📄 Título:', title);

  } catch (err) {
    console.log('❌ Servidor no disponible:', err.message);
  }

  await browser.close();
})().catch(console.error);
