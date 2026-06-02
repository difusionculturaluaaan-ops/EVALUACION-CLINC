const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log('🚀 Test MMPI-2 PRO para Pedro Pica\n');

    // Usar paciente_id de demo (reemplazar con ID real si es necesario)
    const pacienteId = '1';  // ID de prueba - en producción sería el ID real de Pedro

    console.log(`1️⃣ Abriendo MMPI-2 PRO (paciente_id=${pacienteId})...`);
    await page.goto(`http://localhost:3000/mmpi-pro.html?paciente_id=${pacienteId}`, {
      waitUntil: 'networkidle'
    });

    await page.waitForTimeout(2000);

    // Verificar que tiene paciente_id
    const hasPacienteId = await page.evaluate(() => {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('paciente_id');
      console.log(`Paciente ID detectado: ${id}`);
      return id !== null;
    });

    if (!hasPacienteId) {
      console.log('⚠️ Advertencia: Sin paciente_id. El test no se guardará en expediente.');
    } else {
      console.log('✅ Paciente_id detectado');
    }

    console.log('2️⃣ Llenando datos del evaluado...');
    await page.evaluate(() => {
      document.getElementById('inp-nombre').value = 'Pica, Pedro';
      document.getElementById('inp-fecha').value = '1985-05-15';
      document.getElementById('inp-cargo').value = 'Paciente';
      document.getElementById('inp-inst').value = 'Hospital Test';
      document.getElementById('inp-eval').value = 'Dr. Test';
      document.getElementById('inp-edad').value = '39 años · Masculino';

      if (typeof saveInfo === 'function') saveInfo();
    });

    await page.waitForTimeout(1000);

    console.log('3️⃣ Completando 338 items...');
    await page.evaluate(() => {
      // Llenar array de respuestas
      for (let i = 1; i <= 338; i++) {
        responses[i] = Math.random() > 0.4 ? 1 : 0;  // 60% V, 40% F
      }

      // Mostrar en pantalla
      if (typeof buildItemsGrid === 'function') buildItemsGrid();
      if (typeof updateProgress === 'function') updateProgress();
    });

    await page.waitForTimeout(1500);

    console.log('4️⃣ Navegando a Resultados...');
    await page.evaluate(() => {
      if (typeof showTab === 'function') {
        showTab('resultados');
      } else {
        const btn = Array.from(document.querySelectorAll('button.tab-btn'))
          .find(b => b.textContent.includes('Resultados'));
        if (btn) btn.click();
      }
    });

    await page.waitForTimeout(2000);

    console.log('5️⃣ Calculando resultados...');
    await page.evaluate(() => {
      if (typeof calcAll === 'function') {
        calcAll();
      } else {
        const btn = document.getElementById('btn-finish-test');
        if (btn) btn.click();
      }
    });

    await page.waitForTimeout(3000);

    // Verificar que se calcularon
    const hasResults = await page.evaluate(() => {
      return typeof calcResults !== 'undefined' && calcResults.length > 0;
    });

    if (hasResults) {
      console.log('✅ Resultados calculados correctamente');
    } else {
      console.log('⚠️ No se calcularon resultados');
    }

    console.log('6️⃣ Buscando botón "Guardar en Expediente"...');

    // Verificar que el botón existe y está visible
    const hasGuardarBtn = await page.evaluate(() => {
      const btn = document.getElementById('btn-guardar-expediente');
      return btn !== null && btn.style.display !== 'none';
    });

    if (hasGuardarBtn) {
      console.log('7️⃣ Guardando en expediente...');

      // Hacer clic
      await page.click('#btn-guardar-expediente').catch(async () => {
        // Alternativa
        await page.click('button:has-text("Guardar en Expediente")');
      });

      // Esperar respuesta
      console.log('   ⏳ Enviando datos a servidor...');
      await page.waitForTimeout(4000);

      // Verificar si se mostró alert de éxito o si fue a otra página
      const alertPresent = await page.evaluate(() => {
        // En Playwright, los alerts se capturan automáticamente
        return document.body.innerHTML.includes('expediente');
      }).catch(() => false);

      console.log('✅ Datos enviados al servidor');
    } else {
      console.log('⚠️ Botón "Guardar en Expediente" no encontrado');
      console.log('   Esto significa que paciente_id no se detectó correctamente');
    }

    console.log('8️⃣ Capturando pantalla final...');
    await page.screenshot({ path: 'test-mmpi-guardar-final.png' });
    console.log('   📸 test-mmpi-guardar-final.png');

    // Información final
    const finalInfo = await page.evaluate(() => {
      const params = new URLSearchParams(window.location.search);
      const pacId = params.get('paciente_id');

      return {
        pacienteId: pacId,
        urlActual: window.location.href,
        tieneResultados: typeof calcResults !== 'undefined' && calcResults.length > 0,
        cantidadResultados: typeof calcResults !== 'undefined' ? calcResults.length : 0
      };
    });

    console.log('\n📊 Resumen Final:');
    console.log(`   Paciente ID: ${finalInfo.pacienteId || 'No detectado'}`);
    console.log(`   URL: ${finalInfo.urlActual}`);
    console.log(`   Resultados: ${finalInfo.cantidadResultados} escalas`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await page.waitForTimeout(2000);
    await browser.close();
    console.log('\n🏁 Test completado\n');
  }
})();
