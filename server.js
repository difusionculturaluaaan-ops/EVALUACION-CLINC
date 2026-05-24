require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { initDb } = require('./db/schema');
const { seedNormas } = require('./db/seed-normas');
const authRoutes = require('./routes/auth');
const pacientesRoutes = require('./routes/pacientes');
const pruebasRoutes = require('./routes/pruebas');
const middlewareAutenticacion = require('./middleware/autenticacion');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Servir archivos estáticos desde public
app.use(express.static(path.join(__dirname, 'public')));

// Headers para UTF-8 (solo para rutas API, no para archivos estáticos)
app.use('/api', (req, res, next) => {
  res.header('Content-Type', 'application/json; charset=utf-8');
  next();
});

// API Routes
// Rutas públicas (sin autenticación)
app.use('/api/auth', authRoutes);

// Rutas protegidas (requieren autenticación)
app.use('/api/pacientes', middlewareAutenticacion, pacientesRoutes);
app.use('/api/pruebas', middlewareAutenticacion, pruebasRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor de Evaluación Clínica activo' });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error no capturado:', err);
  res.status(500).json({ error: 'Error interno del servidor', message: err.message });
});

// Iniciar servidor de forma asincrónica
async function start() {
  try {
    await initDb();
    await seedNormas();
    app.listen(PORT, () => {
      console.log(`\n╔═══════════════════════════════════════════════╗`);
      console.log(`║  EVALUACIÓN CLÍNICA PSICO v2.0 - SERVIDOR     ║`);
      console.log(`╚═══════════════════════════════════════════════╝`);
      console.log(`\n✓ Servidor corriendo en http://localhost:${PORT}`);
      console.log(`✓ API disponible en http://localhost:${PORT}/api\n`);
    });
  } catch (error) {
    console.error('Error al iniciar servidor:', error);
    process.exit(1);
  }
}

start();

module.exports = app;
