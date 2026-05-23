const http = require('http');

const pacienteData = JSON.stringify({
  nombre: 'Juan Pérez',
  edad: 45,
  sexo: 'Masculino',
  estado_civil: 'Soltero',
  medicamentos: 'Ninguno',
  observaciones: 'Test de acentos'
});

console.log('📤 Enviando:', pacienteData);

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/pacientes',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(pacienteData)
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('📥 Respuesta recibida:');
    const parsed = JSON.parse(data);
    console.log('   Nombre en DB:', parsed.nombre);
    console.log('   Bytes:', Buffer.from(parsed.nombre).toString('hex'));
  });
});

req.on('error', (err) => console.error('Error:', err));
req.write(pacienteData);
req.end();
