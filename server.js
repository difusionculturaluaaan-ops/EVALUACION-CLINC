require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { initDb } = require('./db/schema');
const { seedNormas } = require('./db/seed-normas');
const authRoutes = require('./routes/auth');
const pacientesRoutes = require('./routes/pacientes');
const pruebasRoutes = require('./routes/pruebas');
const superAdminRoutes = require('./routes/super-admin');
const adminRoutes = require('./routes/admin');
const tenantsRoutes = require('./routes/tenants');
const usuarioTestsRoutes = require('./routes/usuario-tests');
const pdfCuidaRoutes = require('./routes/pdf-cuida');
const middlewareAutenticacion = require('./middleware/autenticacion');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Servir archivos estáticos desde public
// SIMPLE Y ROBUSTO: dejar que express.static() maneje todo
const publicPath = path.join(__dirname, 'public');

app.use(express.static(publicPath, {
  // Asegurar que los archivos no se cacheen indefinidamente
  maxAge: '1d',
  setHeaders: (res, filePath) => {
    // Establecer Content-Type explícito para evitar errores MIME
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    } else if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css; charset=utf-8');
    } else if (filePath.endsWith('.html')) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
    }
    // Permitir que Vercel cachee pero requiera validación
    res.setHeader('Cache-Control', 'public, max-age=86400, must-revalidate');
  },
  // Si un archivo no existe, NO intentar múltiples variantes
  dotfiles: 'allow'
}));

// Headers para UTF-8 (solo para rutas API, no para archivos estáticos)
app.use('/api', (req, res, next) => {
  res.header('Content-Type', 'application/json; charset=utf-8');
  next();
});

// API Routes
// Rutas públicas (sin autenticación)
app.use('/api/auth', authRoutes);
app.use('/api/super-admin', superAdminRoutes);

// Rutas protegidas (requieren autenticación)
app.use('/api/pacientes', middlewareAutenticacion, pacientesRoutes);
app.use('/api/pruebas', middlewareAutenticacion, pruebasRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tenants', middlewareAutenticacion, tenantsRoutes);
app.use('/api/usuario-tests', middlewareAutenticacion, usuarioTestsRoutes);
app.use('/api/pdf', middlewareAutenticacion, pdfCuidaRoutes);

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
