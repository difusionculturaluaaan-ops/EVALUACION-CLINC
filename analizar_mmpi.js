const XLSX = require('xlsx');
const fs = require('fs');

const xlsmPath = 'C:\temp\MMPI-2-RF.xlsm';

try {
  const workbook = XLSX.readFile(xlsmPath, { cellFormula: true });
  
  console.log('\n📊 ANÁLISIS: MMPI-2-RF SOFTWARE\n');
  
  workbook.SheetNames.forEach((sheetName, idx) => {
    console.log(`${'='.repeat(70)}`);
    console.log(`HOJA ${idx + 1}: ${sheetName}`);
    console.log(`${'='.repeat(70)}`);
    
    const ws = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
    
    console.log(`Filas: ${jsonData.length}, Columnas: ${Math.max(...jsonData.map(r => r.length || 0))}\n`);
    
    // Primeras filas
    console.log('CONTENIDO:');
    jsonData.slice(0, 8).forEach((row, rIdx) => {
      const filtered = row.slice(0, 5).map(v => String(v).substring(0, 15).padEnd(15)).join(' | ');
      console.log(`  ${filtered}`);
    });
    
    // Fórmulas
    const formulaCells = [];
    for (let col in ws) {
      if (col.startsWith('!')) continue;
      if (ws[col] && ws[col].f) {
        formulaCells.push({ cell: col, formula: ws[col].f.substring(0, 80) });
      }
    }
    
    if (formulaCells.length > 0) {
      console.log(`\n⚙️ FÓRMULAS (${formulaCells.length} total):`);
      formulaCells.slice(0, 6).forEach(f => {
        console.log(`  ${f.cell}: ${f.formula}...`);
      });
    }
    console.log('\n');
  });
  
  console.log('✅ Análisis completado\n');
  
} catch (error) {
  console.error('❌ Error:', error.message);
}
