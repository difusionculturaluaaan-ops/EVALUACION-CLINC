# 🏢 Plan de Migración a Multitenant

**Objetivo**: Transformar la aplicación de single-tenant a multitenant para soportar múltiples clínicas/usuarios independientes.

**Estado Actual**: Single-tenant, sqlite3 local, sin autenticación.

---

## 📊 Análisis Arquitectura Actual

### Limitaciones
- ❌ Una sola BD compartida (todos los datos mezclados)
- ❌ Sin concepto de "organización" o "clínica"
- ❌ Sin autenticación de usuarios
- ❌ Sin aislamiento de datos entre tenants
- ❌ Sin control de roles/permisos

### Lo que está bien
- ✅ Stack simple y estable (Express + SQLite)
- ✅ API clara y bien estructurada
- ✅ Lógica de negocio funcional
- ✅ Base de datos normalizada

---

## 🎯 Estrategia Multitenant Propuesta

### Enfoque: Shared Database + Tenant Isolation

**Ventajas**:
- ✅ Una sola BD SQLite (fácil de mantener)
- ✅ Fácil de implementar inicialmente
- ✅ Bajo costo operativo
- ✅ Permite evolucionar a Database-per-tenant después

**Flujo**:
```
Usuario (Login) → Token JWT con tenant_id → 
Middleware valida tenant_id → 
Query automáticamente filtra por tenant_id →
Datos completamente aislados
```

---

## 📝 Cambios Requeridos

### 1️⃣ BASE DE DATOS

#### Nuevas Tablas

**`tenants` (Clínicas/Organizaciones)**
```sql
CREATE TABLE tenants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,           -- ej: "clinica-norte"
  email_contacto TEXT,
  suscripcion_tipo TEXT DEFAULT 'pro', -- basic, pro, enterprise
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  estado TEXT DEFAULT 'activo'         -- activo, suspendido
);
```

**`usuarios` (Profesionales/Administradores)**
```sql
CREATE TABLE usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id INTEGER NOT NULL,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  rol TEXT DEFAULT 'profesional',  -- admin, profesional, asistente
  estado TEXT DEFAULT 'activo',
  ultimo_acceso DATETIME,
  creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);
```

#### Modificar Tablas Existentes

**`pacientes` (agregar tenant_id)**
```sql
ALTER TABLE pacientes ADD COLUMN tenant_id INTEGER NOT NULL;
ALTER TABLE pacientes ADD FOREIGN KEY (tenant_id) REFERENCES tenants(id);
CREATE INDEX idx_pacientes_tenant ON pacientes(tenant_id);
```

**`pruebas` (agregar tenant_id)**
```sql
ALTER TABLE pruebas ADD COLUMN tenant_id INTEGER NOT NULL;
ALTER TABLE pruebas ADD FOREIGN KEY (tenant_id) REFERENCES tenants(id);
CREATE INDEX idx_pruebas_tenant ON pruebas(tenant_id);
```

---

### 2️⃣ BACKEND - AUTENTICACIÓN

#### Nuevos Endpoints

**POST `/api/auth/register`**
```javascript
// Crear nuevo tenant + usuario admin
POST /api/auth/register
{
  "nombre_clinica": "Clínica Norte",
  "email": "admin@clinica-norte.com",
  "password": "segura123",
  "nombre_admin": "Dr. García"
}
Response:
{
  "tenant_id": 1,
  "usuario_id": 1,
  "token": "eyJhbGc...",
  "expira_en": "2026-05-30T15:30:00Z"
}
```

**POST `/api/auth/login`**
```javascript
POST /api/auth/login
{
  "email": "admin@clinica-norte.com",
  "password": "segura123"
}
Response:
{
  "token": "eyJhbGc...",
  "tenant_id": 1,
  "usuario": { id, nombre, rol, email },
  "expira_en": "2026-05-30T15:30:00Z"
}
```

**POST `/api/auth/logout`**

**POST `/api/auth/refresh`** (renovar token)

#### Middleware de Autenticación

```javascript
// middleware/autenticacion.js
function middlewareAutenticacion(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token requerido' });
  }
  
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = payload;    // { id, email, rol, tenant_id }
    req.tenant_id = payload.tenant_id;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

module.exports = middlewareAutenticacion;
```

#### Middleware de Tenant Isolation

```javascript
// middleware/tenant-isolation.js
function middlewareTenantIsolation(req, res, next) {
  // Valida que el tenant_id del token coincida con la request
  const tenant_id_param = req.params.tenant_id || req.body.tenant_id;
  
  if (tenant_id_param && tenant_id_param != req.tenant_id) {
    return res.status(403).json({ error: 'Acceso denegado a este tenant' });
  }
  
  next();
}
```

---

### 3️⃣ MODIFICAR RUTAS EXISTENTES

#### Patrón de rutas multitenant

**Antes (single-tenant)**:
```
GET  /api/pacientes
POST /api/pacientes
```

**Después (multitenant)**:
```
GET  /api/tenants/:tenant_id/pacientes
POST /api/tenants/:tenant_id/pacientes
```

O bien, incluir tenant_id en el JWT:
```
GET  /api/pacientes (tenant_id viene del token)
POST /api/pacientes (tenant_id viene del token)
```

**Recomendación**: Segunda opción es más limpia.

#### Ejemplo: Modificar routes/pacientes.js

```javascript
const express = require('express');
const router = express.Router();
const middlewareAutenticacion = require('../middleware/autenticacion');
const { 
  getPacientesbyTenant,    // NUEVO: filtrar por tenant_id
  // ... resto de funciones
} = require('../db/schema');

// Todas las rutas protegidas
router.use(middlewareAutenticacion);

// GET: Listar pacientes del tenant autenticado
router.get('/', async (req, res) => {
  try {
    const tenant_id = req.tenant_id; // Del token JWT
    const { q } = req.query;
    
    let pacientes;
    if (q) {
      pacientes = await buscarPacientesPorTenant(tenant_id, q);
    } else {
      pacientes = await getPacientesbyTenant(tenant_id);
    }
    
    res.json(pacientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST: Crear paciente para el tenant
router.post('/', async (req, res) => {
  try {
    const { nombre, edad, sexo, estado_civil, medicamentos, observaciones } = req.body;
    const tenant_id = req.tenant_id;
    
    if (!nombre?.trim()) {
      return res.status(400).json({ error: 'Nombre requerido' });
    }
    
    const paciente = await crearPacienteTenant(tenant_id, {
      nombre: nombre.trim(),
      edad, sexo, estado_civil, medicamentos, observaciones
    });
    
    res.status(201).json(paciente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

---

### 4️⃣ ACTUALIZAR SCHEMA.JS

#### Nuevas funciones para tenant

```javascript
// Crear nuevo tenant (al registrarse)
async function crearTenant(nombre, slug) {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO tenants (nombre, slug) VALUES (?, ?)',
      [nombre, slug],
      function(err) {
        if (err) {
          console.error(err);
          resolve(null);
        } else {
          getTenantById(this.lastID).then(resolve).catch(reject);
        }
      }
    );
  });
}

// Obtener tenant por ID
async function getTenantById(id) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM tenants WHERE id = ?', [id], (err, row) => {
      if (err) {
        console.error(err);
        resolve(null);
      } else {
        resolve(row || null);
      }
    });
  });
}

// Crear usuario para tenant
async function crearUsuario(tenant_id, email, nombre, password_hash, rol = 'profesional') {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO usuarios (tenant_id, email, nombre, password_hash, rol) VALUES (?, ?, ?, ?, ?)',
      [tenant_id, email, nombre, password_hash, rol],
      function(err) {
        if (err) {
          console.error(err);
          resolve(null);
        } else {
          getUsuarioById(this.lastID).then(resolve).catch(reject);
        }
      }
    );
  });
}

// Obtener usuario por email (para login)
async function getUsuarioPorEmail(email) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM usuarios WHERE email = ?', [email], (err, row) => {
      if (err) {
        console.error(err);
        resolve(null);
      } else {
        resolve(row || null);
      }
    });
  });
}

// MODIFICADO: getPacientes ahora filtra por tenant
async function getPacientesbyTenant(tenant_id) {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT * FROM pacientes WHERE tenant_id = ? ORDER BY creado_en DESC',
      [tenant_id],
      (err, rows) => {
        if (err) {
          console.error(err);
          resolve([]);
        } else {
          resolve(rows || []);
        }
      }
    );
  });
}

// Búsqueda con tenant
async function buscarPacientesPorTenant(tenant_id, query) {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT * FROM pacientes WHERE tenant_id = ? AND (nombre LIKE ? OR observaciones LIKE ?) ORDER BY creado_en DESC',
      [tenant_id, `%${query}%`, `%${query}%`],
      (err, rows) => {
        if (err) {
          console.error(err);
          resolve([]);
        } else {
          resolve(rows || []);
        }
      }
    );
  });
}

// Y así para el resto: crearPacienteTenant, actualizarPacienteTenant, etc.
```

---

### 5️⃣ FRONTEND - LOGIN

#### Nueva página: auth.html

```html
<!DOCTYPE html>
<html>
<head>
  <title>Evaluación Clínica - Login</title>
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <div class="auth-container">
    <div class="auth-box">
      <h1>Evaluación Clínica Pro</h1>
      
      <div class="tabs">
        <button class="tab-btn active" data-tab="login">Login</button>
        <button class="tab-btn" data-tab="registro">Registrarse</button>
      </div>
      
      <!-- LOGIN -->
      <form id="loginForm" class="auth-form active">
        <input type="email" placeholder="Email" required>
        <input type="password" placeholder="Contraseña" required>
        <button type="submit">Entrar</button>
        <p id="loginError" class="error"></p>
      </form>
      
      <!-- REGISTRO -->
      <form id="registroForm" class="auth-form">
        <input type="text" placeholder="Nombre de clínica" required>
        <input type="email" placeholder="Email admin" required>
        <input type="password" placeholder="Contraseña" required>
        <input type="text" placeholder="Tu nombre" required>
        <button type="submit">Crear clínica</button>
        <p id="registroError" class="error"></p>
      </form>
    </div>
  </div>
  
  <script src="js/auth.js"></script>
</body>
</html>
```

#### Script: js/auth.js

```javascript
class AuthManager {
  constructor() {
    this.setupEventListeners();
    this.checkLoggedIn();
  }
  
  setupEventListeners() {
    document.getElementById('loginForm').addEventListener('submit', e => this.handleLogin(e));
    document.getElementById('registroForm').addEventListener('submit', e => this.handleRegistro(e));
    
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', e => this.switchTab(e.target.dataset.tab));
    });
  }
  
  async handleLogin(e) {
    e.preventDefault();
    const [email, password] = [
      e.target.querySelector('input[type="email"]').value,
      e.target.querySelector('input[type="password"]').value
    ];
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!res.ok) throw new Error('Credenciales inválidas');
      
      const { token, tenant_id } = await res.json();
      
      // Guardar token
      localStorage.setItem('token', token);
      localStorage.setItem('tenant_id', tenant_id);
      
      // Redirigir a app
      window.location.href = '/index.html';
      
    } catch (err) {
      document.getElementById('loginError').textContent = err.message;
    }
  }
  
  async handleRegistro(e) {
    e.preventDefault();
    const [nombre_clinica, email, password, nombre_admin] = [
      e.target.querySelectorAll('input')[0].value,
      e.target.querySelectorAll('input')[1].value,
      e.target.querySelectorAll('input')[2].value,
      e.target.querySelectorAll('input')[3].value
    ];
    
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre_clinica, email, password, nombre_admin })
      });
      
      if (!res.ok) throw new Error('Error al registrarse');
      
      const { token, tenant_id } = await res.json();
      localStorage.setItem('token', token);
      localStorage.setItem('tenant_id', tenant_id);
      
      window.location.href = '/index.html';
      
    } catch (err) {
      document.getElementById('registroError').textContent = err.message;
    }
  }
  
  checkLoggedIn() {
    const token = localStorage.getItem('token');
    if (token && window.location.pathname.includes('auth')) {
      window.location.href = '/index.html';
    } else if (!token && !window.location.pathname.includes('auth')) {
      window.location.href = '/auth.html';
    }
  }
  
  switchTab(tab) {
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    document.getElementById(tab + 'Form').classList.add('active');
  }
}

new AuthManager();
```

---

### 6️⃣ ACTUALIZAR API CALLS

#### Modificar js/api.js

```javascript
class APIClient {
  constructor() {
    this.baseURL = '/api';
    this.token = localStorage.getItem('token');
    this.tenant_id = localStorage.getItem('tenant_id');
  }
  
  getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    };
  }
  
  async getPacientes(query = '') {
    const url = query 
      ? `${this.baseURL}/pacientes?q=${encodeURIComponent(query)}`
      : `${this.baseURL}/pacientes`;
    
    return fetch(url, {
      headers: this.getHeaders()
    }).then(res => res.json());
  }
  
  async crearPaciente(datos) {
    return fetch(`${this.baseURL}/pacientes`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(datos)
    }).then(res => res.json());
  }
  
  // Resto de métodos igual, solo agrega header Authorization
  
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('tenant_id');
    window.location.href = '/auth.html';
  }
}
```

---

## 📋 Checklist de Implementación

### Fase 1: Backend Autenticación
- [ ] Crear tablas `tenants` y `usuarios`
- [ ] Agregar `tenant_id` a pacientes y pruebas
- [ ] Implementar `/api/auth/register`
- [ ] Implementar `/api/auth/login`
- [ ] Crear middleware de autenticación
- [ ] Crear middleware de tenant isolation
- [ ] Generar JWT con secret en .env

### Fase 2: Modificar Rutas
- [ ] Actualizar routes/pacientes.js con autenticación
- [ ] Actualizar routes/pruebas.js con autenticación
- [ ] Filtrar todas las queries por tenant_id
- [ ] Testear aislamiento de datos

### Fase 3: Frontend Login
- [ ] Crear auth.html
- [ ] Crear js/auth.js
- [ ] Actualizar js/api.js con Authorization header
- [ ] Proteger rutas en app.js
- [ ] Agregar botón logout en header

### Fase 4: Testing
- [ ] Crear 2 tenants (clínicas)
- [ ] Verificar que datos están aislados
- [ ] Probar login con múltiples usuarios
- [ ] Verificar que no hay filtración de datos

### Fase 5: Opcionales
- [ ] Roles y permisos (admin, profesional, asistente)
- [ ] Invitar usuarios a clínica
- [ ] Cambiar contraseña
- [ ] Recuperar contraseña (email)

---

## 🔧 Variables de Entorno

Crear `.env`:
```
JWT_SECRET=tu_clave_super_secreta_aqui_min_32_caracteres
JWT_EXPIRY=7d
NODE_ENV=production
PORT=3000
```

Cargar en server.js:
```javascript
require('dotenv').config();
const SECRET = process.env.JWT_SECRET;
```

---

## 📊 Estimación de Esfuerzo

| Fase | Tiempo | Complejidad |
|------|--------|-------------|
| Fase 1: Auth Backend | 4-6 horas | 🟡 Media |
| Fase 2: Modificar Rutas | 3-4 horas | 🟡 Media |
| Fase 3: Frontend Login | 2-3 horas | 🟢 Baja |
| Fase 4: Testing | 2-3 horas | 🟢 Baja |
| **Total** | **~15 horas** | |

---

## ✅ Beneficios Multitenant

- ✅ Múltiples clínicas en una aplicación
- ✅ Datos completamente aislados
- ✅ Control de usuarios y roles
- ✅ Auditoría de accesos
- ✅ Fácil de escalar
- ✅ Monetización (SaaS)

---

**¿Quieres que comencemos con la implementación?**
