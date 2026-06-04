const { chromium } = require('playwright');

async function test() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Capturar TODOS los errores
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
      console.log(`[ERROR] ${msg.text()}`);
    }
  });

  page.on('pageerror', error => {
    console.log(`[PAGE ERROR] ${error.message}`);
    errors.push(error.message);
  });

  try {
    console.log('\nCargando página...\n');
    await page.goto('http://localhost:3000/auth.html');
    
    // Login
    await page.fill('input[type="email"]', 'demo@clinica.com');
    await page.fill('input[type="password"]', 'demo123456');
    await page.$('button:has-text("Entrar")').then(b => b.click());
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    console.log('\n--- Verificando app ---');
    const appStatus = await page.evaluate(() => {
      return {
        appExists: typeof app !== 'undefined',
        appType: typeof app,
        functionsAvailable: {
          mostrarModalCrearPaciente: typeof app?.mostrarModalCrearPaciente,
          showPage: typeof app?.showPage,
          init: typeof app?.init
        }
      };
    });

    console.log('App Status:', JSON.stringify(appStatus, null, 2));

    if (errors.length > 0) {
      console.log('\nErrores detectados:');
      errors.forEach(e => console.log(`  - ${e}`));
    }

  } finally {
    await browser.close();
  }
}

test();
