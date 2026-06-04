const { chromium } = require('playwright');

async function test() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  const failedRequests = [];
  
  page.on('response', response => {
    if (response.status() >= 400) {
      failedRequests.push({
        status: response.status(),
        url: response.url()
      });
    }
  });

  try {
    await page.goto('http://localhost:3000/auth.html');
    
    await page.fill('input[type="email"]', 'demo@clinica.com');
    await page.fill('input[type="password"]', 'demo123456');
    await page.$('button:has-text("Entrar")').then(b => b.click());
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    if (failedRequests.length > 0) {
      console.log('\n❌ Recursos con error:');
      failedRequests.forEach(r => {
        console.log(`${r.status} ${r.url}`);
      });
    } else {
      console.log('\n✅ No hay errores 404');
    }

  } finally {
    await browser.close();
  }
}

test();
