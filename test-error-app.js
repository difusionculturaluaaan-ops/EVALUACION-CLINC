const { chromium } = require('playwright');

const BASE_URL = 'http://localhost:3000';

async function test() {
  console.log('\n🔍 Revisando errores en consola\n');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Capturar errores de consola
  page.on('console', msg => {
    console.log(`[CONSOLE] ${msg.type().toUpperCase()}: ${msg.text()}`);
  });

  page.on('pageerror', error => {
    console.log(`[ERROR] ${error.message}\n${error.stack}`);
  });

  try {
    console.log('1️⃣  Navegando...');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    console.log('2️⃣  Verificando si app existe...');
    const appExists = await page.evaluate(() => {
      return typeof app !== 'undefined';
    });
    
    if (appExists) {
      console.log('✅ app existe');
      
      // Verificar funciones
      const hasFunctions = await page.evaluate(() => {
        return {
          mostrarModalCrearPaciente: typeof app.mostrarModalCrearPaciente,
          cerrarModalCrearPaciente: typeof app.cerrarModalCrearPaciente,
          guardarNuevoPaciente: typeof app.guardarNuevoPaciente
        };
      });
      
      console.log('Funciones disponibles:');
      console.log(JSON.stringify(hasFunctions, null, 2));
    } else {
      console.log('❌ app NO existe');
    }

  } catch (error) {
    console.error('ERROR:', error);
  } finally {
    await browser.close();
  }
}

test();
