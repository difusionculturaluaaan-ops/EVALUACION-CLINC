/**
 * Script para probar MMPI-2-RF automáticamente
 * Llena los 338 items y valida que funcione
 */

const { chromium } = require('playwright');

(async () => {
  console.log('🚀 Iniciando prueba MMPI-2-RF...\n');

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // 1. Ir a la app
    console.log('📱 Abriendo http://localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // 2. Crear paciente de prueba
    console.log('👤 Creando paciente de prueba...');
    const btnCrearPaciente = await page.locator('button:has-text("Nuevo Paciente")').first();
    if (await btnCrearPaciente.isVisible()) {
      await btnCrearPaciente.click();
      await page.waitForTimeout(1000);

      // Llenar datos del paciente
      await page.fill('input[placeholder*="Nombre"]', 'Test Paciente');
      await page.fill('input[placeholder*="Edad"]', '30');
      await page.selectOption('select', 'F'); // Si hay género

      const btnGuardar = await page.locator('button:has-text("Guardar")').first();
      if (await btnGuardar.isVisible()) {
        await btnGuardar.click();
        await page.waitForTimeout(1000);
      }
    }

    // 3. Entrar a MMPI
    console.log('📋 Entrando a MMPI-2 (RF + T-scores)...');
    const btnMMPI = await page.locator('button[data-page="mmpi"]').first();
    if (await btnMMPI.isVisible()) {
      await btnMMPI.click();
      await page.waitForTimeout(2000);
    }

    // 4. Hacer clic en pestaña RF
    console.log('📖 Abriendo sección RF (Items)...');
    const tabRF = await page.locator('button:has-text("MMPI-2-RF")').first();
    if (await tabRF.isVisible()) {
      await tabRF.click();
      await page.waitForTimeout(2000);
    }

    // 5. Llenar los 338 items
    console.log('⏳ Llenando los 338 items...\n');
    let respondidos = 0;
    let actualPage = 1;
    const totalPaginas = 15;

    for (let item = 1; item <= 338; item++) {
      // Alternar V y F
      const respuesta = item % 2 === 0 ? 'V' : 'F';

      // Evaluar en el contexto de la página
      await page.evaluate((itemNum, resp) => {
        localStorage.setItem(`mmpi_r${itemNum}`, resp);
      }, item, respuesta);

      respondidos++;

      // Mostrar progreso cada 24 items (fin de página)
      if (item % 24 === 0) {
        console.log(`✓ Página ${actualPage} completada (items ${item - 23}-${item})`);
        actualPage++;
      }
    }

    console.log(`\n✅ Los 338 items han sido llenados en localStorage\n`);

    // 6. Actualizar UI
    console.log('🔄 Actualizando interfaz...');
    await page.evaluate(() => {
      if (window.app && window.app.mmpiActualizarProgreso) {
        window.app.mmpiActualizarProgreso();
      }
    });
    await page.waitForTimeout(2000);

    // 7. Verificar progreso
    console.log('📊 Verificando progreso...');
    const progreso = await page.locator('#mmpi-resp-counter').textContent();
    console.log(`   Respuestas mostradas: ${progreso}`);

    const countV = await page.locator('#mmpi-count-v').textContent();
    const countF = await page.locator('#mmpi-count-f').textContent();
    console.log(`   Verdaderos: ${countV}, Falsos: ${countF}`);

    // 8. Verificar si el botón está activado
    console.log('\n🔘 Verificando botón de finalizar...');
    const btnFinish = await page.locator('#mmpi-btn-finish');
    const isEnabled = await btnFinish.evaluate(el => el.style.opacity !== '0.35' && el.style.pointerEvents !== 'none');
    const btnText = await btnFinish.textContent();

    console.log(`   Estado: ${isEnabled ? '✅ ACTIVADO' : '❌ DESACTIVADO'}`);
    console.log(`   Texto: ${btnText.trim()}`);

    if (isEnabled) {
      // 9. Intentar cambiar a SCORES
      console.log('\n→ Intentando cambiar a SCORES...');
      await btnFinish.click();
      await page.waitForTimeout(2000);

      // Verificar si estamos en SCORES
      const scoresSection = await page.locator('#mmpi-scores-section');
      const isVisible = await scoresSection.isVisible();

      if (isVisible) {
        console.log('✅ ¡ÉXITO! Estamos en la sección SCORES\n');
        console.log('🎉 PRUEBA COMPLETADA CORRECTAMENTE\n');
      } else {
        console.log('❌ No se cambió a SCORES\n');
      }
    } else {
      console.log('\n⚠️  Botón no está activado - revisar contadores\n');
    }

    // 10. Captura final
    console.log('📸 Tomando captura de pantalla...');
    await page.screenshot({ path: 'mmpi-test-resultado.png' });
    console.log('✓ Guardado: mmpi-test-resultado.png\n');

    console.log('═══════════════════════════════════');
    console.log('✅ PRUEBA FINALIZADA');
    console.log('═══════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Error durante la prueba:', error.message);
    console.error(error);
  } finally {
    // No cerrar el navegador para que veas el resultado
    console.log('Navegador abierto. Ciérralo manualmente cuando termines.\n');
    // await browser.close();
  }
})();
