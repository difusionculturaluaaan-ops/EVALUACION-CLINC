const { chromium } = require('playwright');

const BASE_URL = 'http://localhost:3000';

async function test() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Capturar todas las requests fallidas
  page.on('response', async (response) => {
    if (response.status() >= 400) {
      console.log(`${response.status()} ${response.url()}`);
    }
  });

  try {
    console.log('Navegando...\n');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

  } finally {
    await browser.close();
  }
}

test();
