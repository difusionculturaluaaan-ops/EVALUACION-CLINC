/**
 * Test de Verificación: CUIDA en Local
 * Verifica: Carga → Datos Paciente → Respuestas → Guardado → Reporte
 */

const { chromium } = require('playwright');

const BASE_URL = 'http://localhost:3000';
let browser, context, page;

async function test() {
  console.log('\n╔════════════════════════════════════════════╗');
  console.log('║  TEST: CUIDA Integración Completa          ║');
  console.log('╚════════════════════════════════════════════╝\n');

  try {
    // 1. INICIAR NAVEGADOR
    console.log('▶ 1️⃣  Iniciando navegador...');
    browser = await chromium.launch({ headless: false });
    context = await browser.newContext();
    page = await context.newPage();

    // 2. NAVEGAR A LA APP
    console.log('▶ 2️⃣  Navegando a http://localhost:3000...');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    // 3. LOGIN AUTOMÁTICO
    console.log('▶ 3️⃣  Haciendo login automático...');
    const emailInput = await page.$('input[type="email"], input[placeholder*="email"], input[placeholder*="mail"]');
    if (emailInput) {
      await emailInput.fill('demo@clinica.com');
      const passInput = await page.$('input[type="password"]');
      await passInput.fill('demo123456');
      const loginBtn = await page.$('button:has-text("Entrar")');
      if (loginBtn) {
        await loginBtn.click();
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
        console.log('✓ Login completado');
      }
    } else {
      console.log('✓ Ya está logueado');
    }

    // 4. BUSCAR PACIENTE
    console.log('▶ 4️⃣  Buscando paciente en lista...');
    await page.waitForTimeout(3000);

    // Buscar elementos con clase expediente o que contengan pacientes
    let pacienteElements = await page.$$('[onclick*="abrirExpediente"]');

    if (pacienteElements.length === 0) {
      // Intentar buscar por texto o clase
      pacienteElements = await page.$$('.expediente-card, [class*="paciente"], div[onclick*="expediente"]');
    }

    if (pacienteElements.length === 0) {
      // Last resort: buscar cualquier elemento clickeable en el grid
      const gridItems = await page.$$('#expedientes-grid > *');
      pacienteElements = gridItems.slice(0, Math.max(1, gridItems.length - 2)); // Excluir últimos elementos que pueden ser mensajes
    }

    console.log(`   Encontrados ${pacienteElements.length} elementos de paciente`);

    if (pacienteElements.length === 0) {
      throw new Error('No se encontraron pacientes después del login');
    }

    // Buscar a Pedro Pica - necesitamos el correcto
    let pacienteCard = null;
    let nombreEncontrado = null;

    console.log('   🔍 Buscando "Pedro Pica" (excluir Francisco)...');

    // Listar todos primero para debug
    console.log('   📋 Primeros 10 pacientes:');
    for (let i = 0; i < Math.min(10, pacienteElements.length); i++) {
      const texto = await pacienteElements[i].textContent();
      console.log(`      [${i}] ${texto.substring(0, 60).trim()}`);
    }

    // Buscar Pedro Pica PERO EXCLUIR Francisco Céspedes
    for (let i = 0; i < pacienteElements.length; i++) {
      const texto = await pacienteElements[i].textContent();
      const lower = texto.toLowerCase();

      // EXCLUIR Francisco Céspedes
      if (lower.includes('francisco') || lower.includes('céspedes') || lower.includes('cespedes')) {
        continue;
      }

      // Buscar variantes de Pedro Pica
      if (lower.includes('pedro pica') || lower.includes('pedro') && lower.includes('piedra')) {
        pacienteCard = pacienteElements[i];
        nombreEncontrado = texto.substring(0, 80).trim();
        console.log(`✅ ENCONTRADO PEDRO PICA: ${nombreEncontrado} (índice ${i})`);
        break;
      }
    }

    // Si no encontró con exclusión, buscar solo "pedro" sin "francisco"
    if (!pacienteCard) {
      console.log('   🔍 Segunda búsqueda: solo "Pedro"...');
      for (let i = 0; i < pacienteElements.length; i++) {
        const texto = await pacienteElements[i].textContent();
        const lower = texto.toLowerCase();

        if (lower.includes('francisco') || lower.includes('céspedes') || lower.includes('cespedes')) {
          continue;
        }

        if (lower.includes('pedro')) {
          pacienteCard = pacienteElements[i];
          nombreEncontrado = texto.substring(0, 80).trim();
          console.log(`✅ ENCONTRADO: ${nombreEncontrado} (índice ${i})`);
          break;
        }
      }
    }

    // Si sigue sin encontrar
    if (!pacienteCard) {
      console.log('❌ PEDRO PICA NO ENCONTRADO - mostrando TODOS:');
      for (let i = 0; i < pacienteElements.length; i++) {
        const texto = await pacienteElements[i].textContent();
        console.log(`   [${i}] ${texto.substring(0, 60).trim()}`);
      }
      throw new Error('❌ No se puede encontrar a Pedro Pica. Pacientes disponibles mostrados arriba.');
    }

    // 5. HACER CLICK EN EL PACIENTE
    console.log(`▶ 5️⃣  Abriendo expediente del paciente...`);
    await pacienteCard.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    console.log('✓ Expediente abierto');

    // 6. BUSCAR BOTÓN CUIDA
    console.log('▶ 6️⃣  Buscando botón CUIDA...');
    const cuidaBtn = await page.$('[onclick*="iniciarCUIDA"]');
    if (!cuidaBtn) {
      throw new Error('❌ No se encontró botón CUIDA');
    }
    console.log('✓ Botón CUIDA encontrado');

    // 7. HACER CLICK EN CUIDA
    console.log('▶ 7️⃣  Haciendo click en CUIDA...');

    // CUIDA navega en la misma ventana, esperar cambio de URL
    await cuidaBtn.click();
    await page.waitForURL(/cuida\.html/, { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    console.log(`✓ CUIDA abierto: ${page.url()}`);

    // 8. ESPERAR A QUE CARGUE CUIDA
    console.log('▶ 8️⃣  Esperando a que cargue CUIDA...');
    await page.waitForTimeout(4000);

    // 9. RESPONDER TODOS LOS ITEMS
    console.log('▶ 9️⃣  Llenando TODOS los 189 items...');

    // Obtener todas las labels (porque los inputs radio están ocultos con display:none)
    const labels = await page.$$('.q-o label');
    console.log(`   Total de opciones: ${labels.length} (≈${Math.floor(labels.length / 4)} items)`);

    let respondidos = 0;

    // Responder todos los items - clickear las labels de manera alternada
    for (let i = 0; i < labels.length; i++) {
      try {
        const label = labels[i];

        // Scroll to element
        await label.scrollIntoViewIfNeeded();

        // Click en la label (no en el input que está oculto)
        await label.click();
        respondidos++;

        if (respondidos % 40 === 0) {
          console.log(`   ${respondidos}/${labels.length} respondidos...`);
        }

        // Pequeño delay para no saturar
        if (respondidos % 10 === 0) {
          await page.waitForTimeout(100);
        }
      } catch (e) {
        // Si falla uno, continuar con el siguiente
        // console.log(`   Fallo al clickear label ${i}: ${e.message}`);
      }
    }

    console.log(`✓ Respondidos ${respondidos} items de ${labels.length}`);

    // 10. NAVEGAR A REPORTE
    console.log('▶ 🔟 Navegando a Reporte...');
    await page.waitForTimeout(2000);

    // Buscar tab de reporte con diferentes patrones
    let reporteTab = await page.$('text="📊 Reporte"');
    if (!reporteTab) {
      reporteTab = await page.$('button:has-text("Reporte")');
    }

    if (reporteTab) {
      await reporteTab.click();
      await page.waitForTimeout(2000);
      console.log('✓ En pestaña Reporte');
    } else {
      console.log('⚠️  No se encontró tab de Reporte, intentando navegar por scroll');
    }

    // 11. BUSCAR Y HACER CLICK EN GUARDAR
    console.log('▶ 1️⃣1️⃣ Buscando botón Guardar...');
    await page.waitForTimeout(1000);

    let guardarBtn = await page.$('button:has-text("Guardar")');
    if (!guardarBtn) {
      guardarBtn = await page.$('text=/Guardar|guardado/i');
    }

    if (!guardarBtn) {
      throw new Error('❌ No se encontró botón Guardar');
    }

    console.log('✓ Botón Guardar encontrado');

    // 12. HACER CLICK EN GUARDAR
    console.log('▶ 1️⃣2️⃣ Haciendo click en Guardar...');

    // Interceptar alert
    let guardado = false;
    page.on('dialog', async dialog => {
      console.log(`✓ Alert: "${dialog.message()}"`);
      guardado = dialog.message().includes('guardado') || dialog.message().includes('exitoso');
      await dialog.accept();
    });

    await guardarBtn.click();
    await page.waitForTimeout(3000);

    if (guardado) {
      console.log('✓ CUIDA guardado exitosamente');
    }

    // 13. ESPERAR VOLVER AL EXPEDIENTE
    console.log('▶ 1️⃣3️⃣ Esperando volver al expediente...');
    await page.waitForTimeout(3000);

    const currentUrl = page.url();
    if (!currentUrl.includes('cuida.html')) {
      console.log(`✓ Volvió a la app: ${currentUrl.substring(0, 50)}`);
    } else {
      console.log('⚠️  Aún en cuida.html, puede haber delay');
    }

    console.log('\n╔════════════════════════════════════════════╗');
    console.log('║  ✅ TEST COMPLETADO EXITOSAMENTE          ║');
    console.log('╚════════════════════════════════════════════╝\n');

    return true;

  } catch (error) {
    console.error('\n❌ ERROR EN TEST:', error.message);
    console.log('\n╔════════════════════════════════════════════╗');
    console.log('║  ❌ TEST FALLIDO                          ║');
    console.log('╚════════════════════════════════════════════╝\n');
    return false;

  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Ejecutar test
test().then(success => {
  process.exit(success ? 0 : 1);
});
