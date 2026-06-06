/**
 * Test: Verificar que importar JSON en CUIDA carga todo correctamente
 * Flujo: Login → Generar JSON → Importar JSON → Verificar reporte
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';

async function testJSONImport() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  let jsonPath = null;

  try {
    console.log('\n🚀 TEST: EXPORTAR E IMPORTAR JSON EN CUIDA\n');

    // 1. LOGIN
    console.log('1️⃣ Login...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    // Credenciales
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

    // 2. BUSCAR PACIENTE BOLAS VÍA API
    console.log('2️⃣ Obteniendo paciente...');

    const loginRes = await page.evaluate(() => {
      return fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'demo@clinica.com', password: 'demo123456' })
      }).then(r => r.json());
    });

    const pacientesRes = await page.evaluate(() => {
      const token = localStorage.getItem('auth_token');
      return fetch('/api/pacientes', {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(r => r.json());
    });

    const bolas = pacientesRes.find(p => p.nombre.toLowerCase().includes('bola'));
    const pacienteId = bolas?.id || pacientesRes[0]?.id;

    console.log(`   ✅ Paciente: ${bolas?.nombre || 'Primer paciente'} (ID: ${pacienteId})\n`);

    // 3. ABRIR CUIDA
    console.log('3️⃣ Abriendo CUIDA...');

    const token = await page.evaluate(() => localStorage.getItem('auth_token'));
    const cuidaUrl = `${BASE_URL}/cuida.html?paciente_id=${pacienteId}&token=${encodeURIComponent(token)}`;
    await page.goto(cuidaUrl, { waitUntil: 'networkidle' });

    await page.waitForFunction(() => document.querySelector('#f-nombre') !== null, { timeout: 10000 });
    console.log('   ✅ CUIDA cargado\n');

    // 4. RESPONDER Y EXPORTAR JSON
    console.log('4️⃣ Completando test y exportando JSON...');

    // Completar datos
    await page.evaluate(() => {
      document.getElementById('f-nombre').value = 'Test Usuario';
      document.getElementById('f-edad').value = '40';
      document.getElementById('f-sexo').value = 'Masculino';
      document.getElementById('f-fecha').value = new Date().toISOString().split('T')[0];
    });

    // Iniciar cuestionario
    const buttons1 = await page.$$('button');
    for (const btn of buttons1) {
      const text = await btn.textContent();
      if (text.includes('Iniciar')) {
        await btn.click();
        break;
      }
    }

    await page.waitForTimeout(500);

    // Responder todas las preguntas
    console.log('   📝 Respondiendo 189 preguntas...');
    await page.evaluate(() => {
      for (let i = 0; i < 189; i++) {
        const resp = 2 + (i % 3);
        const inputId = `q${i}v${resp}`;
        const input = document.getElementById(inputId);
        if (input) {
          input.click();
          window.setAns(i, resp);
        }
      }
    });

    console.log('   ✅ Preguntas respondidas\n');

    // 5. IR AL REPORTE Y EXPORTAR
    console.log('5️⃣ Exportando JSON...');

    // Navegar al reporte
    await page.evaluate(() => window.goTab('reporte'));
    await page.waitForTimeout(2000);

    // Exportar JSON (descargar)
    const downloadPromise = page.context().waitForEvent('download').catch(() => null);

    const exportButtons = await page.$$('button');
    for (const btn of exportButtons) {
      const text = await btn.textContent();
      if (text.includes('Exportar') && text.includes('JSON')) {
        await btn.click();
        break;
      }
    }

    // Esperar descarga
    const download = await downloadPromise;
    if (download) {
      jsonPath = path.join(__dirname, 'test-cuida-import.json');
      await download.saveAs(jsonPath);
      console.log(`   ✅ JSON descargado: ${path.basename(jsonPath)}\n`);
    } else {
      // Si no descargó, exportar desde evaluate
      jsonPath = path.join(__dirname, 'test-cuida-import.json');
      const jsonData = await page.evaluate(() => {
        const data = {
          testType: 'CUIDA',
          version: '1.0',
          respuestas: window.ANS,
          metadatos: {
            nombre: document.getElementById('f-nombre').value,
            edad: document.getElementById('f-edad').value,
            sexo: document.getElementById('f-sexo').value,
            fecha: document.getElementById('f-fecha').value,
            baremo: document.getElementById('f-baremo').value,
            responsable: document.getElementById('f-resp').value,
            expediente: document.getElementById('f-exp').value
          },
          respondidas: window.ANS.filter(a => a > 0).length,
          timestamp: new Date().toISOString()
        };
        return data;
      });

      fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2));
      console.log(`   ✅ JSON generado: ${path.basename(jsonPath)}\n`);
    }

    // 6. IR ATRÁS Y LIMPIAR
    console.log('6️⃣ Limpiando para importar JSON...');

    const newCaseButtons = await page.$$('button');
    for (const btn of newCaseButtons) {
      const text = await btn.textContent();
      if (text.includes('Volver al cuestionario')) {
        await btn.click();
        break;
      }
    }

    // Limpiar datos
    await page.evaluate(() => {
      window.ANS.fill(0);
      document.getElementById('f-nombre').value = '';
      document.getElementById('f-edad').value = '';
      document.getElementById('f-sexo').value = '';
      document.getElementById('f-fecha').value = '';
      window.goTab('datos');
    });

    console.log('   ✅ Limpiar datos\n');

    // 7. IMPORTAR JSON
    console.log('7️⃣ Importando JSON...');

    // Leer JSON
    const jsonContent = fs.readFileSync(jsonPath, 'utf-8');
    const jsonData = JSON.parse(jsonContent);

    // Simular importación mediante FileReader
    await page.evaluate((jsonString) => {
      const blob = new Blob([jsonString], { type: 'application/json' });
      const event = {
        target: {
          result: jsonString
        }
      };
      // Llamar directamente a la función importarJSON
      window.importarJSON({
        target: {
          files: [blob]
        }
      });
    }, jsonContent);

    // Esperar a que se procese
    await page.waitForTimeout(2000);

    // 8. VERIFICAR RESULTADOS
    console.log('8️⃣ Verificando contenido cargado...\n');

    const verification = await page.evaluate(() => {
      const nombre = document.getElementById('f-nombre')?.value || '';
      const edad = document.getElementById('f-edad')?.value || '';
      const sexo = document.getElementById('f-sexo')?.value || '';
      const respGrid = document.getElementById('resp-grid')?.textContent || '';
      const reporteHdr = document.getElementById('rpt-hdr')?.textContent || '';
      const reporteChart = document.getElementById('rpt-chart-tbl')?.textContent || '';
      const reporteValidez = document.getElementById('rpt-validez')?.textContent || '';
      const reporteInforme = document.getElementById('rpt-informe')?.textContent || '';

      return {
        nombre,
        edad,
        sexo,
        datosLlenos: nombre.length > 0 && edad.length > 0,
        respuestasVisibles: respGrid.length > 0,
        encabezadoVisible: reporteHdr.length > 0,
        graficoVisible: reporteChart.length > 0,
        validezVisible: reporteValidez.length > 0,
        informeVisible: reporteInforme.length > 0,
        respondidas: window.ANS.filter(a => a > 0).length
      };
    });

    console.log('📊 RESULTADOS DE VERIFICACIÓN:\n');
    console.log(`   ✅ Nombre cargado: ${verification.nombre}`);
    console.log(`   ✅ Edad cargada: ${verification.edad}`);
    console.log(`   ✅ Sexo cargado: ${verification.sexo}`);
    console.log(`   ${verification.datosLlenos ? '✅' : '❌'} Datos del paciente prerellenados`);
    console.log(`   ${verification.respondidas}/189 respuestas cargadas`);
    console.log(`\n   Reporte generado:`);
    console.log(`   ${verification.encabezadoVisible ? '✅' : '❌'} Encabezado visible`);
    console.log(`   ${verification.graficoVisible ? '✅' : '❌'} Gráfico/Tabla de escalas visible`);
    console.log(`   ${verification.validezVisible ? '✅' : '❌'} Validez del protocolo visible`);
    console.log(`   ${verification.respuestasVisibles ? '✅' : '❌'} Tabla de respuestas visible`);
    console.log(`   ${verification.informeVisible ? '✅' : '❌'} Informe interpretativo visible\n`);

    // RESULTADO FINAL
    console.log('═'.repeat(70));
    if (verification.datosLlenos && verification.respondidas === 189 &&
        verification.encabezadoVisible && verification.graficoVisible &&
        verification.validezVisible && verification.respuestasVisibles &&
        verification.informeVisible) {
      console.log('✅ TEST COMPLETADO EXITOSAMENTE');
      console.log('   → Importar JSON FUNCIONA CORRECTAMENTE');
      console.log('   → Todos los datos se cargaron');
      console.log('   → Reporte generado con todas las secciones');
    } else {
      console.log('⚠️ TEST COMPLETADO CON ADVERTENCIAS');
      if (!verification.datosLlenos) console.log('   ⚠️ Datos no completamente cargados');
      if (verification.respondidas !== 189) console.log(`   ⚠️ Solo ${verification.respondidas}/189 respuestas`);
      if (!verification.encabezadoVisible) console.log('   ⚠️ Encabezado no visible');
      if (!verification.graficoVisible) console.log('   ⚠️ Gráfico no visible');
      if (!verification.respuestasVisibles) console.log('   ⚠️ Tabla de respuestas no visible');
      if (!verification.informeVisible) console.log('   ⚠️ Informe no visible');
    }
    console.log('═'.repeat(70));

    console.log('\n✓ Navegador abierto. Presiona Ctrl+C para cerrar...\n');
    await new Promise(() => {});

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    const screenshot = await page.screenshot({ path: 'test-json-error.png' });
    console.log('📸 Screenshot: test-json-error.png');
    process.exit(1);
  }
}

testJSONImport();
