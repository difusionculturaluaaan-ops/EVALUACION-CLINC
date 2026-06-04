const fs = require('fs');
const path = require('path');

const appJsPath = 'public/js/app.js';
const code = fs.readFileSync(appJsPath, 'utf8');

try {
  // Intentar parsear
  new Function(code);
  console.log('✅ Sintaxis válida en app.js');
} catch (error) {
  console.log('❌ ERROR DE SINTAXIS EN app.js:');
  console.log(`\nMensaje: ${error.message}`);
  
  // Intentar encontrar la línea
  const lines = code.split('\n');
  const match = error.message.match(/line (\d+)/);
  if (match) {
    const lineNum = parseInt(match[1]);
    console.log(`\nLínea problemática (${lineNum}):`);
    console.log(`${lines[lineNum - 1]}`);
    console.log(`${' '.repeat(10)}↑`);
    
    // Mostrar contexto
    console.log('\nContexto:');
    for (let i = Math.max(0, lineNum - 4); i < Math.min(lines.length, lineNum + 3); i++) {
      const prefix = (i + 1) === lineNum ? '❌' : '  ';
      console.log(`${prefix} ${i + 1}: ${lines[i]}`);
    }
  }
}
