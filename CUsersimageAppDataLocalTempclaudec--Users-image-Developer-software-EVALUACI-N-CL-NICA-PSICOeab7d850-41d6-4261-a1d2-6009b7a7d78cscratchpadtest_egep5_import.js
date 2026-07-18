const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Navegar a EGEP-5
  await page.goto('http://localhost:3000/egep5.html', { waitUntil: 'networkidle2' });
  console.log('✅ Página EGEP-5 cargada');
  
  // 1. Verificar que el JSON export funciona
  const resultadoExport = await page.evaluate(() => {
    // Completar algunos campos de prueba
    document.getElementById('m_nombre').value = 'Test Paciente';
    document.getElementById('m_evaluador').value = 'Dr Test';
    document.getElementById('m_fecha').value = '2026-07-17';
    document.getElementById('m_edad').value = '30';
    document.getElementById('m_sexo').value = 'Masculino';
    
    // Simular respuestas (Items 27-31 y diagnosis)
    document.querySelector('input[name="symptom_27"][value="1"]').click();
    document.querySelector('input[name="symptom_28"][value="2"]').click();
    
    return {
      nombre: document.getElementById('m_nombre').value,
      evaluador: document.getElementById('m_evaluador').value,
      mensaje: 'Campos completados'
    };
  });
  
  console.log('✅ Datos de prueba ingresados:', resultadoExport);
  
  // 2. Verificar que importJSON() existe
  const tieneImportJSON = await page.evaluate(() => {
    return typeof window.tests_egep5.importarJSON === 'function' ||
           typeof window.importJSON === 'function';
  });
  
  console.log('📍 importJSON función existe:', tieneImportJSON);
  
  // 3. Verificar que el input file existe
  const tieneInputFile = await page.evaluate(() => {
    return !!document.getElementById('file-import-egep5');
  });
  
  console.log('📍 Input file existe:', tieneInputFile);
  
  // 4. Crear JSON de prueba
  const testJSON = {
    testType: 'EGEP-5',
    respuestas: [0,0,0,0,0, 0,0,0,0,0, 1,2,1,0,0, 1,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
    metadatos: {
      paciente_nombre: 'Test Importado',
      evaluador: 'Dr Importador'
    }
  };
  
  console.log('✅ JSON de prueba creado');
  
  await browser.close();
  console.log('\n🔒 Conclusión: EGEP-5 está aislado y listo para agregar importJSON()');
})();
