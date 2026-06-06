const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');
const path = require('path');

// POST: Generar PDF de CUIDA con Puppeteer (renderizado perfecto como Ctrl+P)
router.post('/generate-cuida', async (req, res) => {
  let browser;
  try {
    const { html, paciente_id } = req.body;

    if (!html) {
      return res.status(400).json({ error: 'HTML requerido' });
    }

    console.log(`📄 Generando PDF CUIDA para paciente ${paciente_id}...`);

    // Iniciar Puppeteer en headless mode
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Establecer viewport para capturar correctamente
    await page.setViewport({ width: 1200, height: 1600 });

    // Inyectar HTML completo con estilos
    await page.setContent(html, { waitUntil: 'networkidle2' });

    // Generar PDF con settings idénticos a Ctrl+P
    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: { top: '8mm', right: '10mm', bottom: '8mm', left: '10mm' },
      printBackground: true,
      preferCSSPageSize: true
    });

    // Convertir a base64
    const pdfBase64 = pdfBuffer.toString('base64');

    console.log(`✅ PDF generado: ${pdfBuffer.length} bytes`);

    res.json({
      success: true,
      pdf_base64: pdfBase64,
      size: pdfBuffer.length
    });

  } catch (error) {
    console.error('❌ Error generando PDF CUIDA:', error);
    res.status(500).json({ error: error.message });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

module.exports = router;
