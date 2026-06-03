const { chromium } = require('playwright');

async function test() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('Navegando...');
    await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
    
    const finalUrl = page.url();
    const title = await page.title();
    
    console.log(`\nURL final: ${finalUrl}`);
    console.log(`Título: ${title}`);
    
    // Ver si está en auth
    if (finalUrl.includes('auth')) {
      console.log('❌ Redirigió a auth.html - No está autenticado');
    } else if (finalUrl.includes('index')) {
      console.log('✅ En index.html');
    }

  } finally {
    await browser.close();
  }
}

test();
