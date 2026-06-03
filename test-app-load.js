const { chromium } = require('playwright');

const BASE_URL = 'http://localhost:3000';

async function test() {
  console.log('\n⏳ Esperando carga de app\n');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Mostrar todos los errores de consola
  let errors = [];
  page.on('console', msg => {
    const text = msg.text();
    if (msg.type() === 'error') {
      errors.push(text);
      console.log(`[ERROR] ${text}`);
    }
  });

  try {
    console.log('Cargando página...');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
    
    // Esperar muchos segundos
    for (let i = 1; i <= 10; i++) {
      await page.waitForTimeout(1000);
      const appExists = await page.evaluate(() => {
        return typeof app !== 'undefined';
      }).catch(() => false);
      
      if (appExists) {
        console.log(`✅ app cargado en segundo ${i}`);
        return;
      } else {
        console.log(`⏳ ${i}s - app aún no está disponible...`);
      }
    }
    
    console.log('❌ app NO se cargó después de 10 segundos');
    if (errors.length > 0) {
      console.log('\nErrores en consola:');
      errors.forEach(e => console.log(`  - ${e}`));
    }

  } finally {
    await browser.close();
  }
}

test();
