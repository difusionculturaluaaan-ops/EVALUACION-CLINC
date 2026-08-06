const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('Abriendo página...');
  await page.goto('http://localhost:3000/');
  
  console.log('Esperando login...');
  await page.waitForSelector('input[type="email"]', { timeout: 10000 });
  
  console.log('Completando login...');
  await page.fill('input[type="email"]', 'demo@clinica.com');
  await page.fill('input[type="password"]', 'demo123456!');
  await page.click('button[type="submit"]');
  
  console.log('Esperando redirección...');
  await page.waitForTimeout(3000);
  
  const url = page.url();
  console.log('URL actual:', url);
  
  const title = await page.title();
  console.log('Título:', title);
  
  await page.screenshot({ path: 'test_screenshot.png' });
  console.log('Screenshot guardado');
  
  await browser.close();
})().catch(console.error);
