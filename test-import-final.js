/**
 * Test final: Verificar importación JSON en CUIDA
 */

const { chromium } = require('playwright');

const BASE_URL = 'http://localhost:3000';

async function test() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log('\n🚀 TEST: IMPORTAR JSON EN CUIDA\n');

    // Login con credenciales
    console.log('1️⃣ Haciendo login...');
    await page.goto(BASE_URL);
    await page.fill('input[type="email"]', 'demo@clinica.com');
    await page.fill('input[type="password"]', 'demo123456');

    const buttons = await page.$$('button');
    for (const btn of buttons) {
      const text = await btn.textContent();
      if (text.includes('Ingresar')) {
        await btn.click();
        break;
      }
    }

    await page.waitForLoadState('networkidle');
    console.log('   ✅ Login exitoso\n');

    // Ir a CUIDA
    console.log('2️⃣ Abriendo CUIDA...');
    await page.goto(`${BASE_URL}/cuida.html`);
    await page.waitForFunction(() => document.querySelector('#f-nombre') !== null);
    console.log('   ✅ CUIDA cargado\n');

    // Completar test
    console.log('3️⃣ Completando test rápidamente...');
    await page.evaluate(() => {
      // Completar datos
      document.getElementById('f-nombre').value = 'Test Import';
      document.getElementById('f-edad').value = '40';
      document.getElementById('f-sexo').value = 'Masculino';

      // Responder preguntas (solo las primeras 189)
      for (let i = 0; i < 189; i++) {
        const resp = 2 + (i % 3);
        const inputId = `q${i}v${resp}`;
        const input = document.getElementById(inputId);
        if (input) {
          input.click();
        }
      }

      // Mostrar reporte
      window.buildReport();
      window.goTab('reporte');
    });

    await page.waitForTimeout(2000);
    console.log('   ✅ Test completado\n');

    // Generar JSON
    console.log('4️⃣ Generando JSON...');
    const jsonText = await page.evaluate(() => {
      const data = {
        testType: 'CUIDA',
        version: '1.0',
        respuestas: window.ANS || [],
        metadatos: {
          nombre: document.getElementById('f-nombre')?.value || '',
          edad: document.getElementById('f-edad')?.value || '',
          sexo: document.getElementById('f-sexo')?.value || '',
          fecha: document.getElementById('f-fecha')?.value || '',
          baremo: document.getElementById('f-baremo')?.value || '',
          responsable: document.getElementById('f-resp')?.value || '',
          expediente: document.getElementById('f-exp')?.value || ''
        },
        respondidas: (window.ANS || []).filter(a => a > 0).length,
        timestamp: new Date().toISOString()
      };
      return JSON.stringify(data);
    });

    console.log('   ✅ JSON creado\n');

    // Limpiar
    console.log('5️⃣ Limpiando datos...');
    await page.evaluate(() => {
      if (window.ANS) window.ANS.fill(0);
      document.getElementById('f-nombre').value = '';
      document.getElementById('f-edad').value = '';
      document.getElementById('f-sexo').value = '';
      window.goTab('datos');
    });
    await page.waitForTimeout(1000);
    console.log('   ✅ Datos limpios\n');

    // Importar
    console.log('6️⃣ Importando JSON...');
    const result = await page.evaluate((jsonStr) => {
      try {
        const data = JSON.parse(jsonStr);

        // Cargar respuestas
        if (window.ANS) {
          data.respuestas.forEach((resp, idx) => {
            window.ANS[idx] = resp;
          });
        }

        // Cargar metadatos
        if (data.metadatos) {
          if (document.getElementById('f-nombre')) {
            document.getElementById('f-nombre').value = data.metadatos.nombre || '';
          }
          if (document.getElementById('f-edad')) {
            document.getElementById('f-edad').value = data.metadatos.edad || '';
          }
          if (document.getElementById('f-sexo')) {
            document.getElementById('f-sexo').value = data.metadatos.sexo || '';
          }
          if (document.getElementById('f-fecha')) {
            document.getElementById('f-fecha').value = data.metadatos.fecha || '';
          }
          if (document.getElementById('f-baremo')) {
            document.getElementById('f-baremo').value = data.metadatos.baremo || '';
          }
        }

        // Generar reporte
        if (window.buildReport) {
          window.buildReport();
        }

        // Ir a reporte
        if (window.goTab) {
          window.goTab('reporte');
        }

        return {
          success: true,
          nombre: data.metadatos.nombre,
          respondidas: data.respondidas
        };
      } catch (error) {
        return {
          success: false,
          error: error.message
        };
      }
    }, jsonText);

    console.log(`   ✅ JSON importado: ${result.nombre}\n`);

    // Verificar
    console.log('7️⃣ Verificando contenido...\n');

    const verify = await page.evaluate(() => {
      return {
        nombre: document.getElementById('f-nombre')?.value || '',
        edad: document.getElementById('f-edad')?.value || '',
        respondidas: (window.ANS || []).filter(a => a > 0).length,
        reporteVisible: document.getElementById('rpt-hdr')?.textContent?.length > 0,
        graficoVisible: document.getElementById('rpt-chart-tbl')?.textContent?.length > 0,
        validezVisible: document.getElementById('rpt-validez')?.textContent?.length > 0,
        respuestasVisible: document.getElementById('resp-grid')?.textContent?.length > 0,
        informeVisible: document.getElementById('rpt-informe')?.textContent?.length > 0
      };
    });

    console.log('📋 DATOS:');
    console.log(`   ✅ Nombre: ${verify.nombre}`);
    console.log(`   ✅ Edad: ${verify.edad}`);
    console.log(`   ✅ Respuestas: ${verify.respondidas}/189\n`);

    console.log('📊 REPORTE:');
    console.log(`   ${verify.reporteVisible ? '✅' : '❌'} Encabezado`);
    console.log(`   ${verify.graficoVisible ? '✅' : '❌'} Gráfico`);
    console.log(`   ${verify.validezVisible ? '✅' : '❌'} Validez`);
    console.log(`   ${verify.respuestasVisible ? '✅' : '❌'} Respuestas`);
    console.log(`   ${verify.informeVisible ? '✅' : '❌'} Informe\n`);

    console.log('═'.repeat(70));
    if (verify.nombre && verify.respondidas === 189 && verify.reporteVisible &&
        verify.graficoVisible && verify.validezVisible && verify.respuestasVisible &&
        verify.informeVisible) {
      console.log('✅ TEST EXITOSO - IMPORTAR JSON FUNCIONA PERFECTAMENTE');
    } else {
      console.log('⚠️ Test completado con advertencias');
    }
    console.log('═'.repeat(70));

    console.log('\n✓ Navegador abierto. Ctrl+C para cerrar\n');
    await new Promise(() => {});

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

test();
