# 📚 Micrositios - Referencias de Patrones y Soluciones

**Documento vivo** que documenta problemas, soluciones y patrones probados para todos los micrositios del sistema de evaluación clínica.

**Última actualización:** 24/07/2026
**Status:** En uso activo (CISNEROS, MBI, EGEP-5, CUIDA, SCID-II, MMPI-2-RF, SCL-90R, PCL-R, ISRA, Hamilton)

---

## 🔴 PROBLEMAS CRÍTICOS Y SOLUCIONES

### 1. JSON Import/Export - Radio Buttons No Se Marcan
**Problema:** Al importar JSON, los radio buttons no se renderizaban, bloqueando el cálculo de resultados.

**Causa:** Intentar llenar campos DOM directamente sin renderizar primero los elementos.

**Solución Correcta (MBI pattern):**
```javascript
// 1. Cargar respuestas en this.respuestas.items
this.respuestas.items = [0, ...respuestasNumeros];

// 2. Guardar metadatos en localStorage (no DOM)
if (data.metadatos) {
  localStorage.setItem('paciente_nombre', data.metadatos.paciente_nombre);
  // ... otros campos
}

// 3. Llamar función que renderiza radio buttons
this.cargarRespuestasEnDOM(data);

// 4. Renderizar UI
this.renderizarItems();

// 5. Cargar datos desde localStorage en formulario
this.cargarDatosPaciente();
```

**NUNCA hacer:**
```javascript
// ❌ INCORRECTO: Intentar llenar campos antes de renderizar
document.getElementById('c_nombre').value = data.metadatos.paciente_nombre;
this.renderizarItems(); // Ahora el input existe, pero es tarde
```

**Archivos con patrón correcto:**
- `public/micrositios/mbi/js/mbi.js` → `inicializarImportador()` (referencia)
- `public/micrositios/cisneros/js/cisneros.js` → `inicializarImportador()` (implementado)

---

### 2. Botones en PDF Generado
**Problema:** Al usar `html2pdf.js`, los botones HTML aparecían en el PDF descargado.

**Causa:** `@media print` NO funciona con `html2pdf.js` (genera PDF desde DOM actual, no desde CSS print).

**Soluciones Probadas:**

#### ✅ OPCIÓN A: Separar Contenedores (MBI pattern - más limpio)
```html
<!-- En index.html -->
<div id="test-resultados-pdf"><!-- contenido, SIN botones --></div>
<div id="test-resultados-botones"><!-- botones --></div>
```

```javascript
// En mostrarResultados()
const containerPDF = document.getElementById('test-resultados-pdf');
const containerBotones = document.getElementById('test-resultados-botones');
containerPDF.innerHTML = html; // contenido
containerBotones.innerHTML = htmlBotones; // botones
```

```javascript
// En generarPDF()
html2pdf().set(opt).from(document.getElementById('test-resultados-pdf')).save();
```

**Ventajas:** Arquitectura clara, separación de responsabilidades
**Desventajas:** Requiere cambiar estructura HTML

#### ✅ OPCIÓN B: Ocultar Dinámicamente (CISNEROS pattern - pragmático)
```javascript
// En generarPDF()
const buttons = element.querySelectorAll('button');
const buttonStyles = [];
buttons.forEach(btn => {
  buttonStyles.push(btn.style.display);
  btn.style.display = 'none';  // Ocultar antes
});

// Generar PDF
html2pdf().set(opt).from(element).save().then(() => {
  // Restaurar después
  buttons.forEach((btn, idx) => {
    btn.style.display = buttonStyles[idx];
  });
});
```

**Ventajas:** Simple, sin cambiar HTML, pragmático
**Desventajas:** Menos limpio arquitectónicamente

**Recomendación:** Usar OPCIÓN A para nuevos tests (más limpio), OPCIÓN B si es urgente.

---

### 3. Caché de Navegador / Vercel - Archivos No Actualizen
**Problema:** Cambios en JavaScript no se reflejaban en Vercel aunque se hiciera push.

**Causa:** Caché HTTP (24h default) o caché de browser local.

**Soluciones:**

#### Cache-Busting en Scripts
```html
<!-- Sin versión (problema) -->
<script src="/micrositios/cisneros/js/cisneros.js"></script>

<!-- Con versión (solución) -->
<script src="/micrositios/cisneros/js/cisneros.js?v=20260725d"></script>
```

**Patrón:** Incrementar versión cada deploy importante
- Formato: `v=YYYYMMDDHH` (año-mes-día-iteración)
- Ejemplo: `v=20260725a` → `v=20260725b` → `v=20260725d`

#### User-Side Cache Clear
- Incógnito/Private browsing
- Ctrl+Shift+Del (borrar caché)
- Hard refresh: Ctrl+Shift+R (Ctrl+F5 en algunos navegadores)

**Archivo a revisar:** `public/micrositios/[test]/index.html` → agregar `?v=YYYYMMDD` a todos los `<script>` tags

---

### 4. Separación de Contenedores HTML - Cambios Que Rompieron
**Problema:** Cambiar de `cisneros-resultados` a `cisneros-resultados-pdf` + `cisneros-resultados-botones` rompió referencias.

**Causa:** Múltiples funciones esperaban `cisneros-resultados` pero se pasó a nombres específicos.

**Lección:** Cuando cambies estructura HTML, busca TODAS las referencias al antiguo ID antes de hacer push.

```bash
# Antes de cambiar estructura:
grep -r "cisneros-resultados" public/micrositios/cisneros/js/
```

**Mejor práctica:** Usar OPCIÓN B (ocultamiento dinámico) para evitar cambios estructurales.

---

## 🟢 PATRONES QUE FUNCIONAN

### ✅ Estructura de Micrositios (Feature-First)
```
public/micrositios/[test]/
├── index.html              # Estructura + estilos CSS
├── js/
│   ├── [test].js          # Lógica principal (window.tests_[test])
│   ├── [test]-graficos.js # Gráficos SVG (opcional)
│   └── [test]-baremos.js  # Baremos/escalas (opcional)
└── pdf/                    # Logos o assets para PDF
```

### ✅ Objeto Global de Test
```javascript
window.tests_[TEST_NAME] = {
  nombre: 'TEST_NAME',
  tipo: 'TEST_NAME',
  totalItems: 44,
  respuestas: { items: Array(45).fill(0) },
  resultados: null,
  
  init() { /* Setup */ },
  renderizarItems() { /* UI */ },
  calcularResultados() { /* Lógica */ },
  mostrarResultados() { /* Renderizar resultados */ },
  generarPDF() { /* PDF */ },
  guardarEnExpediente() { /* API */ }
}
```

### ✅ JSON Export Structure
```javascript
{
  testType: 'TEST_NAME',
  version: '1.0',
  respuestas: [...],  // Array de respuestas numéricas
  metadatos: {
    paciente_nombre,
    paciente_id,
    evaluador,
    fecha_evaluacion,
    edad,
    sexo,
    empresa
  },
  puntuaciones: { /* escalas */ },
  diagnostico: { /* interpretación */ },
  respondidas: 43,
  timestamp: '2026-07-25T...'
}
```

### ✅ Inicialización Segura en mostrarResultados()
```javascript
mostrarResultados() {
  const container = document.getElementById('[test]-resultados');
  if (!container) {
    console.error('Container no encontrado');
    return;
  }
  
  // Renderizar contenido
  container.innerHTML = html;
  
  // Luego renderizar gráficos (async-safe)
  setTimeout(() => this.renderizarGraficos(), 0);
}
```

### ✅ Gráficos SVG
- **FUNCIONA:** SVG inline en HTML, canvas para html2pdf conversión
- **NO FUNCIONA:** Google Charts, Chart.js (no rendering en PDF)
- **Archivo de referencia:** `public/micrositios/cisneros/js/cisneros-graficos.js`

### ✅ localStorage para Datos de Sesión
```javascript
// Guardar
localStorage.setItem('paciente_nombre', nombre);
localStorage.setItem('[TEST]_respuestas', JSON.stringify(respuestas));

// Cargar
const nombre = localStorage.getItem('paciente_nombre');
const respuestas = JSON.parse(localStorage.getItem('[TEST]_respuestas'));
```

---

## 🟡 PATRONES A EVITAR

### ❌ @media print para PDF con html2pdf
`@media print` solo funciona en impresoras reales, NO con html2pdf.js

### ❌ Cambiar estructura HTML sin verificar referencias
Siempre grep todas las referencias antes de renombrar elementos.

### ❌ Llenar DOM antes de renderizar
Espera a que los elementos existan en el DOM antes de asignar `.value`.

### ❌ Caché-busting manual (sin versión)
No confíes en que Vercel siempre sirva la versión más nueva.

### ❌ Hardcodear valores en gráficos
Usar sempre `this.resultados` como fuente única de verdad.

---

## 📋 CHECKLIST ANTES DE IMPLEMENTAR NUEVO TEST

- [ ] **Estructura**: Crear carpeta `public/micrositios/[test]/`
- [ ] **HTML**: Copiar estructura base de test existente (MBI o CISNEROS)
- [ ] **JavaScript**: 
  - [ ] Crear `window.tests_[test]` con métodos core
  - [ ] `init()`, `renderizarItems()`, `calcularResultados()`, `mostrarResultados()`
  - [ ] `generarPDF()` con patrón ocultamiento (OPCIÓN B) o separación (OPCIÓN A)
  - [ ] `guardarEnExpediente()` para API
  - [ ] `exportarJSON()` / `inicializarImportador()` para persistencia
- [ ] **JSON**: Verificar estructura matches template arriba
- [ ] **Gráficos**: Usar SVG inline, no bibliotecas externas
- [ ] **Cache-busting**: Agregar `?v=YYYYMMDD` a scripts en HTML
- [ ] **Aislamiento**: Verificar test no importa de otros tests (usa `Grep` para verificar)
- [ ] **Testing**: 
  - [ ] Test local en Playwright primero
  - [ ] Verificar import/export funciona
  - [ ] Verificar PDF sin botones
  - [ ] Verificar JSON correcto
- [ ] **Deploy**: 
  - [ ] Push local
  - [ ] Esperar Vercel (2-3 min)
  - [ ] Verificar en Vercel
  - [ ] Hard-refresh si es necesario

---

## 📁 Archivos de Referencia por Sección

### JSON Import/Export
- ✅ `public/micrositios/mbi/js/mbi.js` → `inicializarImportador()` + `cargarRespuestasEnDOM()`
- ✅ `public/micrositios/cisneros/js/cisneros.js` → misma implementación

### PDF Generation
- ✅ `public/micrositios/mbi/js/mbi.js` → `generarPDF()` (patrón OPCIÓN A)
- ✅ `public/micrositios/cisneros/js/cisneros.js` → `generarPDF()` (patrón OPCIÓN B)

### Gráficos
- ✅ `public/micrositios/cisneros/js/cisneros-graficos.js` → SVG inline con html2canvas
- ✅ `public/micrositios/mbi/js/mbi.js` → `renderizarGraficoComparativo()` (Recharts renderizado a SVG)

### Cache-busting
- ✅ `public/micrositios/cisneros/index.html` → líneas ~463-464 (script tags con `?v=`)

---

## 🚀 Tests Implementados

| Test | Status | Patrón PDF | Patrón JSON | Gráficos |
|------|--------|-----------|-----------|----------|
| MBI | ✅ | OPCIÓN A (separado) | ✅ correcto | Recharts |
| CISNEROS | ✅ | OPCIÓN B (dinámico) | ✅ correcto | SVG inline |
| EGEP-5 | ✅ | OPCIÓN ? | ? | ? |
| CUIDA | ✅ | OPCIÓN ? | ? | ? |
| SCID-II | ✅ | OPCIÓN ? | ? | ? |
| MMPI-2-RF | ✅ | OPCIÓN ? | ? | ? |
| SCL-90R | ✅ | OPCIÓN ? | ? | ? |
| PCL-R | ✅ | OPCIÓN ? | ? | ? |
| ISRA | ✅ | OPCIÓN ? | ? | ? |
| Hamilton | ✅ | OPCIÓN ? | ? | ? |

**TODO:** Verificar otros tests y documentar patrones.

---

## 💾 Control de Cambios

| Fecha | Test | Cambio | Lección |
|-------|------|--------|---------|
| 24/07 | CISNEROS | Ocultamiento dinámico botones | Use OPCIÓN B para cambios urgentes |
| 24/07 | CISNEROS | Cache-busting v20260725d | Siempre versionear scripts |
| 24/07 | CISNEROS | Revert separación contenedores | Verificar todas las referencias antes de cambiar HTML |
| 19/07 | MBI/CISNEROS | JSON import con null-check | Usar localStorage para metadatos, no DOM directo |

---

**Mantener este documento actualizado conforme se descubran nuevos patrones o problemas.**
