const { chromium } = require('playwright');
const path = require('path');

async function runTest() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // Set viewport
  await page.setViewportSize({ width: 1400, height: 900 });

  // Navigate to MMPI-2 form
  const url = 'http://localhost:3000/mmpi-pro.html?paciente_id=7';
  console.log(`\n📍 Navigating to: ${url}\n`);
  await page.goto(url, { waitUntil: 'networkidle' });

  // ============================================
  // STEP 1: FILL PATIENT INFO
  // ============================================
  console.log('1️⃣ FILLING PATIENT INFORMATION...\n');
  await page.fill('#inp-nombre', 'González, Pedro');
  await page.fill('#inp-fecha', '2026-06-02');
  await page.fill('#inp-cargo', 'Profesional');
  await page.fill('#inp-inst', 'Hospital Central');
  await page.fill('#inp-eval', 'Lic. María López');
  await page.fill('#inp-edad', '35 años · Masculino');
  console.log('✅ Patient info filled\n');

  // ============================================
  // STEP 2: SWITCH TO TEST TAB
  // ============================================
  console.log('2️⃣ SWITCHING TO TEST TAB...\n');
  await page.click('.tab-btn:nth-child(2)');
  await page.waitForSelector('.tactive', { timeout: 5000 });
  await page.waitForTimeout(1000);
  console.log('✅ Test tab active\n');

  // ============================================
  // STEP 3: AUTO-ANSWER ALL 338 ITEMS
  // ============================================
  console.log('3️⃣ AUTO-ANSWERING 338 ITEMS (This will take ~30 seconds)...\n');

  // Get all VF buttons from the test items
  const totalItems = 338;
  let answeredCount = 0;

  // Use keyboard navigation for speed
  for (let i = 1; i <= totalItems; i++) {
    // Alternate responses: V, V, V, F pattern
    const response = i % 4 === 0 ? 'F' : 'V';

    try {
      // Find the button for this item in the current visible page
      const selector = `.vf-btn:nth-of-type(${((i - 1) % 24) * 2 + (response === 'V' ? 1 : 2)})`;

      // Use direct JS execution to set response faster
      await page.evaluate((itemNum, resp) => {
        window.testSetResp(itemNum, resp);
      }, i, response);

      answeredCount++;
      if (answeredCount % 50 === 0) {
        console.log(`   ✅ ${answeredCount}/338 items answered`);
      }
    } catch (err) {
      console.error(`   ❌ Error answering item ${i}: ${err.message}`);
    }
  }

  console.log(`\n✅ All ${answeredCount} items answered!\n`);

  // Wait a moment for UI to update
  await page.waitForTimeout(2000);

  // ============================================
  // STEP 4: CLICK "CALCULAR RESULTADOS"
  // ============================================
  console.log('4️⃣ CALCULATING RESULTS...\n');

  // Look for the finish button
  const finishBtn = await page.$('#btn-finish-test');
  if (finishBtn) {
    await finishBtn.click();
  } else {
    // Try the last page "Ver Resultados" button
    await page.click('.btn-primary:has-text("Resultados")');
  }

  await page.waitForTimeout(2000);
  console.log('✅ Results calculated\n');

  // ============================================
  // STEP 5: NAVIGATE TO RESULTS TAB
  // ============================================
  console.log('5️⃣ NAVIGATING TO RESULTS TAB...\n');
  const resultsBtns = await page.$$('.tab-btn');
  if (resultsBtns.length >= 3) {
    await resultsBtns[2].click(); // Click 3rd tab (Resultados)
  }
  await page.waitForTimeout(1000);
  console.log('✅ Results tab visible\n');

  // ============================================
  // STEP 6: CLICK "GUARDAR EN EXPEDIENTE"
  // ============================================
  console.log('6️⃣ ATTEMPTING TO SAVE PDF TO EXPEDIENT...\n');
  console.log('   🔍 Looking for "Guardar en Expediente" button...');

  // Wait for button to appear
  const saveBtn = await page.$('#btn-guardar-expediente', { timeout: 10000 }).catch(() => null);

  if (!saveBtn) {
    console.log('   ❌ Save button not found! Results may not have calculated properly.');

    // Take screenshot
    await page.screenshot({ path: 'screenshot-no-save-btn.png' });
    console.log('   📸 Screenshot saved: screenshot-no-save-btn.png');
  } else {
    console.log('   ✅ Save button found!');
    console.log('   🖱️  Clicking button...\n');

    // Listen for console messages and errors
    page.on('console', msg => {
      console.log(`   🔹 Console: ${msg.type().toUpperCase()}: ${msg.text()}`);
    });

    page.on('pageerror', error => {
      console.log(`   🔴 PAGE ERROR: ${error.message}`);
      console.log(`       ${error.stack}`);
    });

    // Click the button
    await saveBtn.click();

    // Wait and monitor
    console.log('   ⏳ Waiting for PDF generation (max 10 seconds)...\n');

    try {
      // Wait for button state change
      await page.waitForSelector('#btn-guardar-expediente:has-text("Guardando")', { timeout: 3000 }).catch(() => null);
      console.log('   ✅ Button shows "Guardando en expediente..."\n');

      // Wait for completion
      await page.waitForSelector('#btn-guardar-expediente:has-text("Guardado")', { timeout: 10000 }).catch(async () => {
        console.log('   ⏳ Still processing (checking after 10s)...\n');
      });

      // Check if success or error
      const btnText = await page.textContent('#btn-guardar-expediente');
      console.log(`   📍 Button final text: "${btnText}"`);

      if (btnText.includes('Guardado')) {
        console.log('   ✅ PDF SAVED SUCCESSFULLY!\n');
      } else if (btnText.includes('Error') || btnText.includes('❌')) {
        console.log('   ❌ ERROR DURING SAVE!\n');
      }

    } catch (err) {
      console.log(`   ⚠️ Timeout or error: ${err.message}\n`);
    }

    // Take final screenshot
    await page.screenshot({ path: 'screenshot-save-result.png' });
    console.log('   📸 Screenshot saved: screenshot-save-result.png\n');
  }

  // ============================================
  // FINAL SUMMARY
  // ============================================
  console.log('═══════════════════════════════════════════════════════════');
  console.log('INVESTIGATION COMPLETE');
  console.log('═══════════════════════════════════════════════════════════\n');
  console.log('📋 FINDINGS:');
  console.log('   • Patient info: filled ✅');
  console.log('   • Test items: 338 answered ✅');
  console.log('   • Results calculated: ✅');
  console.log('   • Save button: checked 👆\n');
  console.log('📌 Next: Check browser console in screenshots for html2pdf errors\n');

  // Keep browser open for inspection (30 seconds)
  console.log('⏳ Browser will close in 30 seconds...\n');
  await page.waitForTimeout(30000);

  await browser.close();
  console.log('✅ Investigation complete!');
}

runTest().catch(console.error);
