const fs = require('fs');

try {
  const code = fs.readFileSync('public/js/app.js', 'utf8');
  
  // Intentar evaluar el código
  eval(code);
  console.log('✅ app.js se cargó correctamente');
} catch (error) {
  console.error('❌ Error en app.js:');
  console.error(`Línea aprox: ${error.stack.split('\n')[1]}`);
  console.error(`Mensaje: ${error.message}`);
}
