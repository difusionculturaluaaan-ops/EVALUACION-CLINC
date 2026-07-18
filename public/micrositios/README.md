# 🏗️ MICROSITIOS - Evaluación Clínica Psicológica

**Ubicación:** `public/micrositios/`

Espacio para tests psicométricos **independientes pero integrados** en el sistema de evaluación clínica.

---

## 📋 Estructura

```
public/micrositios/
├── mbi/                          ✅ Operativo
│   ├── index.html               → Página principal
│   ├── js/
│   │   └── mbi.js               → Lógica completamente aislada
│   └── css/
│       └── (opcional)
│
├── cisneros/                     🚀 En desarrollo
│   ├── index.html               → Página principal (plantilla)
│   ├── js/
│   │   └── cisneros.js          → Lógica (pendiente implementación)
│   └── css/
│       └── (opcional)
│
└── README.md                     ← Este archivo
```

---

## 🔗 ACCESO

### URLs Públicas

```
MBI:      http://localhost:3000/micrositios/mbi/
CISNEROS: http://localhost:3000/micrositios/cisneros/
```

### URLs de Redirección (Legacy)

```
MBI:      http://localhost:3000/mbi.html      → redirige a /micrositios/mbi/
CISNEROS: http://localhost:3000/cisneros.html → redirige a /micrositios/cisneros/
```

---

## 🔒 AISLAMIENTO GARANTIZADO

Cada micrositio es **100% independiente**:

```javascript
// MBI
window.tests_mbi = { ... }
localStorage: mbi_* (prefijo exclusivo)

// CISNEROS
window.tests_cisneros = { ... }
localStorage: cisneros_* (prefijo exclusivo)
```

**Beneficios:**
- ✅ Cambios en MBI NO afectan CISNEROS
- ✅ Cada test maneja su propia lógica
- ✅ Comparten API global (`/js/api.js`) para guardar en expediente
- ✅ Comparten estilos base (`/css/*.css`)
- ✅ CSS personalizado opcional por test

---

## 📊 TESTS IMPLEMENTADOS

### MBI (Maslach Burnout Inventory) ✅

| Aspecto | Valor |
|---------|-------|
| **Ítems** | 22 |
| **Escala** | 1-5 (Nunca a Diariamente) |
| **Subescalas** | 3 (AE, D, RP) |
| **Estado** | ✅ COMPLETO |
| **Ubicación** | `/micrositios/mbi/` |
| **Diagnóstico** | Síndrome de burnout |

**Características:**
- JSON import/export funcional
- Guardar en expediente integrado
- 3 tabs: Datos, Test, Resultados
- Interpretación automática + recomendaciones

**Cómo acceder:**
```
http://localhost:3000/micrositios/mbi/
```

---

### CISNEROS (Escala de Mobbing) 🚀

| Aspecto | Valor |
|---------|-------|
| **Ítems** | 44 (43 + 1 chequeo) |
| **Escala** | 0-6 (Nunca a Todos los días) |
| **Dimensiones** | 5 (Demérito, Obstaculización, Intimidación, Aislamiento, Acoso) |
| **Autores** | 3 (Jefe, Compañeros, Subordinados) |
| **Estado** | 🚀 EN DESARROLLO (plantilla lista) |
| **Ubicación** | `/micrositios/cisneros/` |
| **Diagnóstico** | Presencia/severidad de mobbing |

**Estado de implementación:**
- ✅ Plantilla HTML lista
- ✅ Estructura de carpetas
- ⏳ Lógica JS pendiente (cisneros.js)
- ⏳ Cálculo de dimensiones pendiente
- ⏳ Interpretación clínica pendiente

**Cómo acceder:**
```
http://localhost:3000/micrositios/cisneros/
(Aún no funciona — pendiente implementación)
```

---

## 🛠️ CÓMO AGREGAR UN NUEVO TEST

### Paso 1: Crear Estructura
```bash
mkdir -p public/micrositios/[nombre]/js
mkdir -p public/micrositios/[nombre]/css
```

### Paso 2: Crear Archivos
- `public/micrositios/[nombre]/index.html` (plantilla)
- `public/micrositios/[nombre]/js/[nombre].js` (lógica aislada)
- `public/micrositios/[nombre]/css/[nombre].css` (opcional)

### Paso 3: Namespace Aislado
```javascript
// public/micrositios/[nombre]/js/[nombre].js
window.tests_[nombre] = {
  nombre: '[NOMBRE COMPLETO]',
  // ... resto de lógica
}
```

### Paso 4: localStorage Prefixado
```javascript
localStorage.setItem('[nombre]_respuestas', JSON.stringify(data));
```

### Paso 5: Rutas Correctas en HTML
```html
<script src="/micrositios/[nombre]/js/[nombre].js"></script>
<!-- API global disponible en /js/api.js -->
```

### Paso 6: Integrar con Expediente
```javascript
// Utilizar api.guardarPrueba() para guardar en BD
api.guardarPrueba(
  pacienteId,
  '[ACRÓNIMO]',
  data,
  score,
  subescalas,
  evaluador
)
```

---

## 📈 PRÓXIMOS TESTS

### Fase 1 (Esta semana)
- [x] MBI ✅
- [ ] CISNEROS (plantilla lista, lógica pendiente)

### Fase 2 (Próxima semana)
- [ ] Otros tests según prioridad

---

## 🔄 FLUJO TÍPICO (Todos los tests)

```
1. Ingresar Datos del Evaluado
   ├── Nombre, Fecha, Edad, Sexo
   └── Centro, Evaluador

2. Aplicar Test
   ├── Responder ítems (tabla interactiva)
   └── Progreso en tiempo real

3. Ver Resultados
   ├── Diagnóstico principal
   ├── Desglose por dimensiones
   ├── Interpretación clínica
   └── Recomendaciones

4. Acciones
   ├── Generar PDF
   ├── Guardar en Expediente
   ├── Exportar JSON
   └── Importar JSON (para reutilizar)
```

---

## 🎨 ESTILOS COMPARTIDOS

Los micrositios reutilizan estilos base:

```html
<link rel="stylesheet" href="/css/styles.css">
<link rel="stylesheet" href="/css/tokens.css">
<link rel="stylesheet" href="/css/typography.css">
<link rel="stylesheet" href="/css/components.css">
```

**Color personalizado por test:**
- MBI: Azul `#60a5fa`
- CISNEROS: Naranja `#f97316`
- Próximos: Según diseño

---

## 📝 CHECKLIST: CREAR NUEVO TEST

```markdown
[ ] Crear carpeta public/micrositios/[nombre]/
[ ] Crear public/micrositios/[nombre]/js/
[ ] Crear public/micrositios/[nombre]/css/
[ ] Crear public/micrositios/[nombre]/index.html
[ ] Implementar public/micrositios/[nombre]/js/[nombre].js
[ ] Namespace: window.tests_[nombre]
[ ] localStorage: [nombre]_* (prefijo)
[ ] JSON import/export
[ ] Guardar en expediente (api.guardarPrueba)
[ ] Testear en local: /micrositios/[nombre]/
[ ] Crear memory/parametros_[nombre].md
[ ] Commit con estructura completa
```

---

## 🚀 DEPLOYMENT

Todos los micrositios se despliegan automáticamente en Vercel:

```
Vercel:
- https://mi-clinica.vercel.app/micrositios/mbi/
- https://mi-clinica.vercel.app/micrositios/cisneros/
```

**No requieren configuración especial:**
- Usan rutas públicas estándar
- Usan API global (`/api/*`)
- Funciona multitenant automáticamente

---

## 📞 SOPORTE

Para agregar un nuevo micrositio:
1. Copiar estructura de MBI o CISNEROS
2. Usar namespace aislado: `window.tests_[nombre]`
3. Usar localStorage prefixado: `[nombre]_*`
4. Reutilizar `/js/api.js` para guardar
5. Hacer commit con estructura

---

**Última actualización:** 2026-07-18  
**Estado:** Estructura lista, MBI ✅, CISNEROS 🚀  
**Próximo:** Implementar lógica CISNEROS
