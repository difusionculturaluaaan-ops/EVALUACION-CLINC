const { chromium } = require('playwright');

const BASE_URL = 'http://localhost:3000';

async function test() {
  console.log('\n📡 Capturando requests\n');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Capturar 404s
  page.on('response', response => {
    if (response.status() === 404) {
      console.log(`❌ 404: ${response.url()}`);
    }
  });

  try {
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

  } finally {
    await browser.close();
  }
}

test();
