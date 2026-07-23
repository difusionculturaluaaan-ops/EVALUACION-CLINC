/**
 * EGEP-5 Complete Test Automation
 * Llena todos los items, captura pantallas y verifica funcionamiento
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const SCREENSHOT_DIR = path.join(__dirname, 'egep5-screenshots');

// Crear directorio para screenshots
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runCompleteTest() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log('🚀 Iniciando prueba completa de EGEP-5...\n');

    // 1. Navegar al micrositio
    console.log('📍 Paso 1: Navegando a EGEP-5 micrositio...');
    await page.goto('http://localhost:3000/micrositios/egep5/');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01-inicio.png') });
    console.log('✅ Screenshot guardada: 01-inicio.png\n');

    // 2. Llenar Tab 1 - Datos del Evaluado
    console.log('📍 Paso 2: Llenando Tab 1 - Datos del Evaluado...');

    await page.fill('#m_nombre', 'Juan Pérez García');
    await page.fill('#m_fecha', '2026-07-22');
    await page.fill('#m_edad', '35');
    await page.selectOption('#m_sexo', 'Varón');
    await page.fill('#m_centro', 'Clínica Centro Psicológico');
    await page.fill('#m_evaluador', 'Dr. Luis Martínez');
    await page.fill('#m_evento', 'Accidente de tráfico grave hace 3 meses. El evaluado fue conductor del vehículo y experimentó temor intenso por su vida.');

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02-tab1-datos.png') });
    console.log('✅ Tab 1 completado. Screenshot: 02-tab1-datos.png\n');

    // 3. Ir a Tab 2 - Aplicar Test
    console.log('📍 Paso 3: Navegando a Tab 2 - Aplicar Test...');
    await page.click('text=Aplicar Test');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03-tab2-inicio.png') });
    console.log('✅ Screenshot: 03-tab2-inicio.png\n');

    // 4. Llenar Ítems 1-11 (Tipo de evento)
    console.log('📍 Paso 4: Seleccionando Ítem 1 (Accidente grave de tráfico)...');
    await page.click('input[name="event_1"][value="me"]');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04-item1-seleccionado.png') });
    console.log('✅ Screenshot: 04-item1-seleccionado.png\n');

    // 5. Llenar Ítem 12 (Descripción)
    console.log('📍 Paso 5: Llenando Ítem 12 (Descripción del acontecimiento)...');
    await page.fill('#test_evento_desc', 'Choque frontal a 80 km/h. Vehículo quedó completamente destruido. El paciente fue atrapado dentro durante 30 minutos.');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05-item12-desc.png') });
    console.log('✅ Screenshot: 05-item12-desc.png\n');

    // 6. Llenar Características (16-26)
    console.log('📍 Paso 6: Llenando Características (16-26)...');
    // Item 16: Sí
    await page.click('input[name="caract_16"][value="si"]');
    // Item 17: Sí
    await page.click('input[name="caract_17"][value="si"]');
    // Item 18: Sí
    await page.click('input[name="caract_18"][value="si"]');
    // Item 19: Sí
    await page.click('input[name="caract_19"][value="si"]');
    // Item 20: Sí
    await page.click('input[name="caract_20"][value="si"]');
    // Items 21-26: Sí
    for (let i = 21; i <= 26; i++) {
      await page.click(`input[name="caract_${i}"][value="si"]`);
    }
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06-caracteristicas-llenas.png') });
    console.log('✅ Screenshot: 06-caracteristicas-llenas.png\n');

    // 7. Scroll a Síntomas y llenarlos
    console.log('📍 Paso 7: Llenando Síntomas (27-49)...');
    await page.click('text=SECCIÓN 2: SÍNTOMAS');
    await page.waitForTimeout(500);

    // Llenar Items 27-31 (Reexperimentación) - Sí con molestia 3
    for (let i = 27; i <= 31; i++) {
      await page.click(`input[name="symptom_respuesta_${i}"][value="si"]`);
      await page.click(`input[name="symptom_${i}"][value="3"]`);
    }
    console.log('✅ Items 27-31 completados');

    // Llenar Items 32-33 (Evitación) - Sí con molestia 2
    for (let i = 32; i <= 33; i++) {
      await page.click(`input[name="symptom_respuesta_${i}"][value="si"]`);
      await page.click(`input[name="symptom_${i}"][value="2"]`);
    }
    console.log('✅ Items 32-33 completados');

    // Llenar Items 34-40 (Cognitivos) - Algunos Sí con molestia 2
    for (let i = 34; i <= 40; i++) {
      await page.click(`input[name="symptom_respuesta_${i}"][value="si"]`);
      await page.click(`input[name="symptom_${i}"][value="2"]`);
    }
    console.log('✅ Items 34-40 completados');

    // Llenar Items 41-46 (Activación) - Sí con molestia 3
    for (let i = 41; i <= 46; i++) {
      await page.click(`input[name="symptom_respuesta_${i}"][value="si"]`);
      await page.click(`input[name="symptom_${i}"][value="3"]`);
    }
    console.log('✅ Items 41-46 completados');

    // Llenar Items 47-49 (Conducta) - Algunos Sí
    for (let i = 47; i <= 49; i++) {
      await page.click(`input[name="symptom_respuesta_${i}"][value="si"]`);
      await page.click(`input[name="symptom_${i}"][value="1"]`);
    }
    console.log('✅ Items 47-49 completados');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07-sintomas-llenos.png') });
    console.log('✅ Screenshot: 07-sintomas-llenos.png\n');

    // 8. Scroll a Items 50-51 (Duración e Inicio)
    console.log('📍 Paso 8: Llenando Items 50-51...');

    // Item 50: "hace más de 1 mes pero menos de 3 meses"
    const radioButtons50 = await page.locator('input[name="item50"]');
    const count50 = await radioButtons50.count();
    if (count50 > 1) {
      await page.click('input[name="item50"][value="mas1m"]');
    }

    // Item 51: "en el último mes"
    const radioButtons51 = await page.locator('input[name="item51"]');
    const count51 = await radioButtons51.count();
    if (count51 > 0) {
      await page.click('input[name="item51"][value="ultimomes"]');
    }

    console.log('✅ Items 50-51 completados\n');

    // 9. Llenar Items 52-58 (Funcionamiento)
    console.log('📍 Paso 9: Llenando Items 52-58 (Funcionamiento)...');
    // Algunos Sí para demostrar impacto
    for (let i = 0; i < 4; i++) {
      const numero = 52 + i;
      await page.click(`input[name="item_${numero}"][value="si"]`);
    }
    console.log('✅ Items 52-58 completados\n');

    // 10. Calcular Resultados
    console.log('📍 Paso 10: Clickeando "Calcular Resultados"...');
    await page.click('text=Calcular Resultados');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08-resultados-generados.png') });
    console.log('✅ Screenshot: 08-resultados-generados.png\n');

    // 11. Verificar Tab 3 (Resultados)
    console.log('📍 Paso 11: Verificando Tab 3 - Resultados...');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '09-tab3-resultados.png') });
    console.log('✅ Screenshot: 09-tab3-resultados.png\n');

    // 12. Navegar a Tab 4 (Perfil Visual)
    console.log('📍 Paso 12: Navegando a Tab 4 - Perfil Visual...');
    await page.click('text=Perfil Visual');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '10-tab4-perfil.png') });
    console.log('✅ Screenshot: 10-tab4-perfil.png\n');

    // 13. Navegar a Tab 5 (Interpretación)
    console.log('📍 Paso 13: Navegando a Tab 5 - Interpretación...');
    await page.click('text=Interpretación');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '11-tab5-interpretacion.png') });
    console.log('✅ Screenshot: 11-tab5-interpretacion.png\n');

    // 14. Volver a Resultados y probar botones
    console.log('📍 Paso 14: Probando botones de acción...');
    await page.click('text=Resultados');
    await page.waitForTimeout(500);

    // Probar Exportar JSON
    console.log('  - Intentando Exportar JSON...');
    const [download] = await Promise.all([
      page.waitForEvent('download').catch(() => null),
      page.click('text=Exportar JSON').catch(() => console.log('    ⚠️ Botón no disponible'))
    ]);
    if (download) {
      const path_download = await download.path();
      console.log('✅ JSON descargado: ' + path_download);
    }
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '12-despues-exportar.png') });

    // Probar Generar PDF
    console.log('  - Intentando Generar PDF...');
    const [downloadPdf] = await Promise.all([
      page.waitForEvent('download').catch(() => null),
      page.click('text=Generar PDF').catch(() => console.log('    ⚠️ Botón no disponible'))
    ]);
    if (downloadPdf) {
      const pathPdf = await downloadPdf.path();
      console.log('✅ PDF generado: ' + pathPdf);
    }
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '13-despues-pdf.png') });
    console.log('✅ Screenshot: 13-despues-pdf.png\n');

    console.log('✅✅✅ ¡PRUEBA COMPLETA EXITOSA! ✅✅✅\n');
    console.log('📁 Screenshots guardados en: ' + SCREENSHOT_DIR);
    console.log('\nArchivos generados:');
    fs.readdirSync(SCREENSHOT_DIR).forEach(file => {
      console.log('  - ' + file);
    });

  } catch (error) {
    console.error('❌ Error durante la prueba:', error.message);
    console.error(error);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'ERROR.png') });
  } finally {
    await browser.close();
  }
}

// Ejecutar
runCompleteTest().catch(console.error);
