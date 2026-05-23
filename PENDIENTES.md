# 📋 Mejoras Futuras - Pendientes de Implementar

**Estado del proyecto**: ✅ Operativo y listo para producción  
**Última actualización**: 2026-05-23

---

## 🏢 Migración a Multitenant
**Prioridad**: 🔴 CRÍTICA  
**Descripción**: Transformar la aplicación de single-tenant a multitenant para soportar múltiples clínicas/organizaciones independientes con datos completamente aislados.

**Plan detallado**: Ver `MULTITENANT_PLAN.md`

**Estado**: ✅ FASE 1 Y FASE 2 COMPLETADAS (backend listo)

### Tareas:
- [x] **Fase 1: Base de Datos** ✅ COMPLETADO (6-7-2025)
  - [x] Crear tabla `tenants` (id, nombre, slug, suscripcion, estado)
  - [x] Crear tabla `usuarios` (id, tenant_id, email, password_hash, rol)
  - [x] Agregar `tenant_id` a tabla `pacientes`
  - [x] Agregar `tenant_id` a tabla `pruebas`
  - [x] Crear índices para queries rápidas
  - [x] Habilitar PRAGMA foreign_keys

- [x] **Fase 2: Backend Autenticación** ✅ COMPLETADO (6-7-2025)
  - [x] Instalar `jsonwebtoken` y `bcryptjs`
  - [x] Crear `.env` con JWT_SECRET
  - [x] Implementar endpoint `POST /api/auth/register` (crea tenant + usuario admin)
  - [x] Implementar endpoint `POST /api/auth/login` (retorna JWT token)
  - [x] Implementar endpoint `POST /api/auth/logout`
  - [x] Implementar endpoint `POST /api/auth/verify`
  - [x] Crear middleware de autenticación (valida JWT)
  - [x] Crear middleware de tenant isolation

- [x] **Fase 3: Modificar Rutas Existentes** ✅ COMPLETADO (6-7-2025)
  - [x] Proteger todas las rutas con middlewareAutenticacion
  - [x] Actualizar routes/pacientes.js (filtrar por tenant_id)
  - [x] Actualizar routes/pruebas.js (filtrar por tenant_id)
  - [x] Actualizar db/schema.js (nuevas funciones getTenant, crearUsuario, etc.)
  - [x] Asegurar aislamiento de datos a nivel BD
  - [x] Agregar funciones multitenant para pacientes y pruebas

- [ ] **Fase 4: Frontend Login** (2-3 horas) ⏳ PRÓXIMO
  - [ ] Crear `public/auth.html` (formulario login/registro)
  - [ ] Crear `public/js/auth.js` (AuthManager class)
  - [ ] Actualizar `public/js/api.js` (agregar Authorization header)
  - [ ] Proteger rutas en `public/js/app.js` (redirigir a login si no hay token)
  - [ ] Agregar botón logout en header

- [x] **Fase 4: Frontend Login** ✅ COMPLETADO (23-05-2026)
  - [x] Crear `public/auth.html` (formulario login/registro con estilos profesionales)
  - [x] Crear `public/js/auth.js` (AuthManager class con gestión de tokens)
  - [x] Actualizar `public/js/api.js` (agregar Authorization header a todas las requests)
  - [x] Proteger rutas en `public/js/app.js` (redirigir a login si no hay token)
  - [x] Agregar botón logout en header

- [x] **Fase 5: Testing y Validación (Manual)** ✅ COMPLETADO (23-05-2026)
  - [x] Crear 2 tenants de prueba (Clínica Centro, Clínica Norte)
  - [x] Crear usuarios en cada tenant
  - [x] Verificar aislamiento: ✓ Clínica A NO ve datos de Clínica B
  - [x] Testear login con múltiples usuarios
  - [x] Testear creación de pacientes desde API
  - [x] Verificar que JWT es válido

- [ ] **Fase 6: Opcional - Roles y Permisos** (2-3 horas)
  - [ ] Implementar roles: admin, profesional, asistente
  - [ ] Crear tabla `permisos` si es necesario
  - [ ] Middleware de autorización por rol
  - [ ] UI: Mostrar opciones según rol del usuario

- [ ] **Fase 7: Opcional - Gestión de Usuarios** (2-3 horas)
  - [ ] Invitar usuarios a clínica
  - [ ] Cambiar contraseña
  - [ ] Recuperar contraseña (email)
  - [ ] Listar usuarios de la clínica (solo admin)

### Beneficios:
- ✅ Múltiples clínicas en una sola aplicación
- ✅ Datos completamente aislados y seguros
- ✅ Control de acceso con JWT
- ✅ Escalable (agregar clínicas sin cambiar código)
- ✅ Preparado para monetización (SaaS)

### Estimación Total: ~15 horas

### Notas:
- La estrategia es "Shared Database + JWT Token Isolation"
- Cada usuario obtiene JWT con su `tenant_id`
- Todas las queries filtran automáticamente por `tenant_id`
- Fácil evolucionar a "Database per Tenant" después

---

---

## 🎨 Refinamiento UI/UX
**Prioridad**: 🟡 MEDIA  
**Descripción**: Mejoras visuales, animaciones, notificaciones, accesibilidad

**Estado**: ✅ COMPLETADO (23-05-2026)

### Implementado:

#### ✅ Sistema de Notificaciones Profesional
- **Archivo**: `public/js/notifications.js` (250+ líneas)
- **Features**:
  - Notificaciones tipo toast con 4 tipos: success, error, warning, info
  - Animaciones smooth (slideInRight cubic-bezier)
  - Auto-dismiss configurable (3-5 segundos)
  - Botón de cierre con hover effects
  - Accesibilidad completa: role, aria-live, aria-atomic
  - Estilos responsivos (mobile-first)
  - Soporte tema claro/oscuro

#### ✅ Animaciones y Micro-interacciones
- **Cambio de páginas**: `pageIn` 0.35s con cubic-bezier(0.34, 1.56, 0.64, 1)
- **Botones**: scale(0.97) on active, translateY(-2px) on hover
- **Inputs**: focus con sombra 4px en color primario y translateY(-1px)
- **Cards**: hover con levantamiento de 4px y shadow mejorada
- **Modales**: animación de entrada con scale(0.95) → scale(1) y translateY

#### ✅ Mejoras en Formularios
- Inputs con border 2px en focus (color primario)
- Transiciones suaves 0.25s cubic-bezier
- Placeholders con contraste mejorado (70% opacity)
- Focus shadow 4px rgba(44, 90, 160, 0.15)
- Transform translateY(-1px) en focus
- Botones disabled con opacity 0.6

#### ✅ Mejoras en Botones
- Box-shadow para profundidad (0 4px 12px rgba)
- Hover con translateY(-2px) y shadow aumentada
- Active con scale(0.97)
- Estados disabled claros y sin interacción
- Variantes primary/secondary con colores coordinados
- Transiciones 0.25s cubic-bezier(0.4, 0, 0.2, 1)

#### ✅ Modales Mejorados
- Backdrop con blur(4px) en tema dinámico
- Animación de entrada escalonada (modal → modal-content)
- Modal-content con scale(0.95) → scale(1)
- Transición suave 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)

#### ✅ Accesibilidad (A11y)
- Notifications.js:
  - role="region", aria-label, aria-live="polite", aria-atomic="true"
  - role="status" en cada notificación
  - escapeHtml() para prevenir XSS
  - Botones con aria-label descriptivos
- Formularios:
  - Labels explícitos en inputs
  - Focus states claramente visibles
  - Contrast mejorado según WCAG
  - Transiciones no causan mareo
- Tema oscuro soportado en todas las notificaciones

### Archivos Creados/Modificados:

**Creados:**
- `public/js/notifications.js` - 250+ líneas

**Modificados:**
- `public/auth.html` - Agrega notifications.js + estilos notificaciones
- `public/js/auth.js` - Usa notifications.success/error
- `public/index.html` - Agrega notifications.js
- `public/css/styles.css` - +220 líneas de mejoras

### Estadísticas de Implementación:

| Métrica | Valor |
|---------|-------|
| Líneas de código nuevas | ~500 |
| Archivos creados | 1 |
| Archivos modificados | 4 |
| Mejoras visuales | 8+ |
| Mejoras de accesibilidad | 5+ |
| Tipos de notificaciones | 4 |
| Animaciones nuevas | 6+ |

### Mejoras Antes/Después:

| Aspecto | Antes | Después |
|---------|-------|---------|
| Notificaciones | Elementos HTML | Toast con animación |
| Cambio de página | fadeIn 200ms | pageIn 350ms interpolado |
| Botones | Cambio de color | Shadow + translateY + scale |
| Inputs | Border simple | Border 2px + shadow focus |
| Modales | Aparición directa | Animación escala-posición |
| Accesibilidad | Básica | ARIA completo |

---

## 🔐 Autenticación
**Prioridad**: Alta  
**Descripción**: Implementar sistema de login/logout de usuarios para controlar acceso a la aplicación.

### Tareas:
- [ ] Crear tabla `users` en SQLite con campos: id, username, password (hashed), rol
- [ ] Implementar endpoint POST `/api/auth/login`
- [ ] Implementar endpoint POST `/api/auth/logout`
- [ ] Crear JWT token para mantener sesiones
- [ ] Agregar middleware de autenticación en Express
- [ ] UI: Formulario de login
- [ ] UI: Proteger rutas que requieren autenticación
- [ ] UI: Mostrar usuario activo en header

---

## 📊 Exportación de Datos
**Prioridad**: Media  
**Descripción**: Permitir exportar datos de pacientes y evaluaciones en formatos Excel y CSV.

### Tareas:
- [ ] Instalar librería `xlsx` para Excel
- [ ] Crear función exportar a Excel con todas las evaluaciones
- [ ] Crear función exportar a CSV por paciente
- [ ] Crear función exportar reporte de múltiples pacientes
- [ ] UI: Botones de exportación en expedientes
- [ ] UI: Botones de exportación en reportes individuales

---

## 📈 Dashboard de Análisis
**Prioridad**: Media  
**Descripción**: Crear dashboard con estadísticas agregadas de evaluaciones.

### Tareas:
- [ ] Endpoint GET `/api/analytics/resumen` con estadísticas globales
- [ ] Contar total de pacientes activos/pausados
- [ ] Calcular promedios por test
- [ ] Gráficas de tendencias por test
- [ ] Distribución de severidad (histogramas)
- [ ] Top tests más realizados
- [ ] Evolución temporal (mes a mes)
- [ ] UI: Nueva página "Dashboard"
- [ ] UI: Gráficas interactivas con Chart.js

---

## ☁️ Sincronización y Backup
**Prioridad**: Media  
**Descripción**: Backup automático de datos a nube (Dropbox, Google Drive, OneDrive).

### Tareas:
- [ ] Integración con API de Dropbox
- [ ] Integración con Google Drive API
- [ ] Crear función backup automático cada X horas
- [ ] Crear función restore desde backup
- [ ] UI: Configuración de backup en settings
- [ ] UI: Botón manual de backup/restore
- [ ] Logging de backup realizados

---

## 📱 Aplicación Mobile
**Prioridad**: Baja  
**Descripción**: Crear versión nativa de escritorio con Electron o app móvil con Capacitor.

### Opciones:
- **Electron** (Desktop): Versión nativa para Windows/Mac/Linux
- **Capacitor** (Mobile): Versión nativa para iOS/Android

### Tareas (Electron):
- [ ] Instalar Electron
- [ ] Empaquetar app actual como Electron
- [ ] Crear menú de aplicación nativo
- [ ] Agregar notificaciones del sistema
- [ ] Compilar para Windows/Mac/Linux

### Tareas (Capacitor):
- [ ] Instalar Capacitor
- [ ] Agregar soporte para cámara (foto perfil paciente)
- [ ] Agregar soporte para almacenamiento local
- [ ] Compilar para iOS y Android

---

## 🌍 Localización (Multiidioma)
**Prioridad**: Baja  
**Descripción**: Soportar inglés, portugués y francés además del español.

### Tareas:
- [ ] Crear estructura i18n (ej: locales/es.json, locales/en.json, etc.)
- [ ] Externalizar todos los strings de la UI
- [ ] Implementar selector de idioma
- [ ] Traducir a inglés (en)
- [ ] Traducir a portugués (pt-BR)
- [ ] Traducir a francés (fr)
- [ ] Guardar preferencia de idioma en localStorage
- [ ] Tests names y interpretaciones en múltiples idiomas

---

## 📋 Reportes Avanzados
**Prioridad**: Media  
**Descripción**: Crear reportes con comparativas entre evaluaciones y gráficas evolutivas.

### Tareas:
- [ ] Endpoint GET `/api/reportes/comparativa/:paciente_id` 
- [ ] Gráfica de evolución temporal por test
- [ ] Comparativa lado-a-lado entre dos evaluaciones
- [ ] Tabla de cambios (antes/después)
- [ ] Reporte PDF con gráficas incluidas
- [ ] UI: Selector de fechas para comparativa
- [ ] UI: Nueva página "Reportes Avanzados"
- [ ] Estadísticas de cambio (mejora/empeoramiento)

---

## ⚙️ Escala Likert Adaptativa
**Prioridad**: Baja  
**Descripción**: Permitir diferentes escalas de respuesta según el test (0-4, 0-3, 0-2, etc.).

### Tareas:
- [ ] Actualizar schema para agregar campo `escala` a pruebas
- [ ] Refactorizar renderer.js para soportar escalas dinámicas
- [ ] Actualizar cada test con su escala específica
- [ ] Validar respuestas según escala
- [ ] UI: Mostrar escala apropiada según test
- [ ] Tests afectados:
  - SCL-90-R: 0-4 ✅ (ya implementado)
  - Hamilton: Múltiple ✅ (ya implementado)
  - MMPI-2: T-scores ✅ (ya implementado)
  - ISRA: 0-4 ✅ (ya implementado)
  - TDS: 0-4 ✅ (ya implementado)
  - PCL-R: 0-2 ✅ (ya implementado)
  - EGEP-5: 0-3 ✅ (ya implementado)

---

## 📊 Resumen de Prioridades

| Prioridad | Mejoras |
|-----------|---------|
| 🔴 Alta | Autenticación |
| 🟡 Media | Exportación, Dashboard, Sincronización, Reportes Avanzados |
| 🟢 Baja | Mobile App, Localización, Escala Likert Adaptativa |

---

## 📌 Notas
- Todas las mejoras son **opcionales** pero recomendadas para producción robusta
- La autenticación es la más crítica si se usa en entorno compartido
- El dashboard y exportación mejoran la experiencia clínica
- La sincronización es importante para proteger datos
