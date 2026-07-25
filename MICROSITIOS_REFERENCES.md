# 📚 Micrositios - Referencias de Patrones y Soluciones

**Documento vivo** que documenta problemas, soluciones y patrones probados para todos los micrositios del sistema de evaluación clínica.

**Última actualización:** 24/07/2026
**Status:** En uso activo (CISNEROS, MBI, EGEP-5, CUIDA, SCID-II, MMPI-2-RF, SCL-90R, PCL-R, ISRA, Hamilton)

---

## 🔴 PROBLEMAS CRÍTICOS Y SOLUCIONES

---

## 📊 JSON EXPORT/IMPORT (CRÍTICO - LEER SIEMPRE)

### Estructura Correcta de JSON Export

**SIEMPRE usar esta estructura exacta:**

```javascript
generarJSON() {
  if (!this.resultados) return null;
  
  // Obtener datos (con fallbacks a localStorage)
  const paciente_nombre = document.getElementById('m_nombre')?.value || 
                          localStorage.getItem('paciente_nombre') || 
                          'Paciente';
  const evaluador = document.getElementById('m_evaluador')?.value || 
                    localStorage.getItem('nombre') || 'Sin especificar';
  const edad = document.getElementById('m_edad')?.value || '';
  const sexo = document.getElementById('m_sexo')?.value || '';
  const centro = localStorage.getItem('clinica_nombre') || 'No especificado';
  const fecha_eval = document.getElementById('m_fecha')?.value || 
                     new Date().toISOString().split('T')[0];

  return {
    testType: 'TEST_NAME',
    version: '1.0',
    respuestas: this.respuestas.items.slice(1),  // Array de números (0-6, depende del test)
    metadatos: {
      paciente_nombre,
      paciente_id: sessionStorage.getItem('pacienteSeleccionado'),
      evaluador,
      fecha_evaluacion: fecha_eval,
      edad,
      sexo,
      centro
    },
    puntuaciones: {
      // Escalas específicas del test
      escala1: this.resultados.valor1,
      escala2: this.resultados.valor2
    },
    diagnostico: {
      // Diagnóstico e interpretación
      diagnostico: this.resultados.diagnostico,
      intensidad: this.resultados.intensidad
    },
    respondidas: this.respuestas.items.slice(1).filter(x => x > 0).length,
    timestamp: new Date().toISOString()
  };
}

exportarJSON() {
  if (!this.resultados) {
    alert('⚠️ Primero calcula los resultados');
    return;
  }

  const data = this.generarJSON();
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([new TextEncoder().encode(json)], 
                        { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `TEST_NAME_${data.metadatos.paciente_nombre}_${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
}
```

### JSON Import - Paso a Paso (MBI Pattern)

**❌ INCORRECTO (problema): Llenar DOM antes de renderizar**
```javascript
inicializarImportador() {
  const fileInput = document.getElementById('test-file-input');
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = JSON.parse(evt.target.result);
      
      // ❌ ERROR: Intentar llenar campos que aún no existen
      document.getElementById('m_nombre').value = data.metadatos.paciente_nombre;
      
      // Ahora renderiza - PERO ES TARDE
      this.renderizarItems();
    };
    reader.readAsText(file);
  });
}
```

**✅ CORRECTO (MBI pattern): Guardar en localStorage, renderizar, luego llenar**
```javascript
inicializarImportador() {
  const fileInput = document.getElementById('test-file-input');
  if (!fileInput) return;

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = JSON.parse(evt.target.result);

        // Validar estructura
        if (!data.respuestas || !Array.isArray(data.respuestas)) {
          throw new Error('Formato de JSON inválido');
        }

        // PASO 1: Convertir a números (por si vienen como strings)
        const respuestasNumeros = data.respuestas.map(v => {
          const num = parseInt(v);
          return isNaN(num) ? 0 : num;
        });

        // PASO 2: Cargar en respuestas (agregar 0 al inicio para índice 1-based)
        this.respuestas.items = [0, ...respuestasNumeros];

        // PASO 3: Guardar metadatos en localStorage (NO en DOM)
        if (data.metadatos) {
          if (data.metadatos.paciente_nombre) {
            localStorage.setItem('paciente_nombre', data.metadatos.paciente_nombre);
          }
          if (data.metadatos.edad) {
            localStorage.setItem('paciente_edad', data.metadatos.edad);
          }
          if (data.metadatos.sexo) {
            localStorage.setItem('paciente_sexo', data.metadatos.sexo);
          }
          // ... otros campos
        }

        // PASO 4: Marcar radio buttons como checked (ANTES de renderizar)
        this.cargarRespuestasEnDOM(data);

        // PASO 5: Renderizar items (ahora sí)
        this.renderizarItems();

        // PASO 6: Cargar datos en formulario DESDE localStorage
        this.cargarDatosPaciente();

        alert(`✅ Archivo "${file.name}" importado correctamente`);
        window.scrollTo({ top: 0, behavior: 'smooth' });

      } catch (error) {
        alert('❌ Error al importar: ' + error.message);
        console.error('Parse error:', error);
      }
    };
    reader.readAsText(file);
  });
}

// Función crucial: Marcar radio buttons
cargarRespuestasEnDOM(data) {
  if (!data.respuestas || !Array.isArray(data.respuestas)) return;

  data.respuestas.forEach((resp, index) => {
    const numero = index + 1;
    if (numero <= 22) {  // Ajustar según número de items
      const radio = document.querySelector(
        `input[name="test_item_${numero}"][value="${resp}"]`
      );
      if (radio) radio.checked = true;  // Marcar en DOM
    }
  });
}

// Función para cargar datos del formulario desde localStorage
cargarDatosPaciente() {
  const nombre = localStorage.getItem('paciente_nombre') || '';
  const edad = localStorage.getItem('paciente_edad') || '';
  const sexo = localStorage.getItem('paciente_sexo') || '';
  // ... otros campos

  // Ahora SÍ los elementos existen, asignar valores
  if (document.getElementById('m_nombre')) {
    document.getElementById('m_nombre').value = nombre;
  }
  if (document.getElementById('m_edad')) {
    document.getElementById('m_edad').value = edad;
  }
  // ... llenar los demás
}
```

**Orden crítico (NO cambiar):**
1. Parse JSON ✓
2. Convertir a números ✓
3. Cargar en `this.respuestas.items` ✓
4. Guardar metadatos en localStorage ✓
5. **Marcar radio buttons** ✓
6. Renderizar items ✓
7. Cargar datos en formulario ✓

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

---

## 📄 PDF GENERATION (CRÍTICO - LEER SIEMPRE)

### Problema Principal: @media print NO funciona con html2pdf.js

**❌ INCORRECTO (no funciona):**
```html
<style>
  @media print {
    .action-buttons { display: none !important; }
    .test-controls { display: none !important; }
  }
</style>

<div id="tab-resultados">
  <div class="action-buttons">
    <button onclick="exportarJSON()">Descargar JSON</button>
    <button onclick="generarPDF()">Descargar PDF</button>
  </div>
  <div id="content">Contenido del PDF</div>
</div>
```

**Razón:** html2pdf.js copia el DOM directamente sin interpretar `@media print`. Los botones aparecerán en el PDF aunque tengas `display: none` en la media query.

### ✅ SOLUCIÓN A: Dos Contenedores (MBI Pattern - Separación Física)

**Estructura:**
```html
<!-- Contenedor para Test (con botones) -->
<div id="tab-test-resultados">
  <div class="controls">
    <button onclick="exportarJSON()">Descargar JSON</button>
    <button onclick="guardarEnExpediente()">Guardar en Expediente</button>
  </div>
  <div id="content">Gráficos y tablas</div>
</div>

<!-- Contenedor para PDF (SIN botones) -->
<div id="tab-resultados-pdf" style="display: none;">
  <!-- SOLO gráficos y tablas, nada de botones -->
  <div id="content-copy">Gráficos y tablas (copia idéntica)</div>
</div>

<!-- Botones globales (fuera de cualquier contenedor PDF) -->
<div class="global-actions">
  <button onclick="generarPDF()">Descargar PDF</button>
</div>
```

**En JavaScript:**
```javascript
generarPDF() {
  const pdfContent = document.getElementById('tab-resultados-pdf');
  
  const opt = {
    margin: 10,
    filename: 'reporte.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
  };
  
  html2pdf().set(opt).from(pdfContent).save();
}
```

**Ventajas:** ✅ Seguro, sin efectos secundarios  
**Desventajas:** ❌ Duplicar HTML, mantener dos copias sincronizadas

**¿Cuándo usar?** Cuando tienes control total sobre la estructura (MBI, CUIDA)

---

### ✅ SOLUCIÓN B: Dynamic Hiding (CISNEROS Pattern - Pragmático)

**Estructura:**
```html
<div id="tab-resultados">
  <!-- Botones SIEMPRE en el HTML -->
  <div class="action-buttons" id="export-buttons">
    <button onclick="exportarJSON()">Descargar JSON</button>
    <button onclick="generarPDF()">Descargar PDF</button>
  </div>
  
  <!-- Contenido -->
  <div id="content">Gráficos y tablas</div>
</div>
```

**En JavaScript:**
```javascript
generarPDF() {
  // PASO 1: Obtener botones
  const buttons = document.getElementById('export-buttons');
  if (!buttons) return;
  
  // PASO 2: Guardar estilos originales
  const originalDisplay = buttons.style.display;
  const originalVisibility = buttons.style.visibility;
  
  // PASO 3: Ocultar botones
  buttons.style.display = 'none';
  
  try {
    // PASO 4: Generar PDF (SIN botones)
    const contentDiv = document.getElementById('tab-resultados');
    const opt = {
      margin: 10,
      filename: `reporte_${Date.now()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }  // IMPORTANTE
    };
    
    html2pdf().set(opt).from(contentDiv).save();
    
  } finally {
    // PASO 5: Restaurar estilos originales (SIEMPRE ejecutar)
    buttons.style.display = originalDisplay;
    buttons.style.visibility = originalVisibility;
  }
}
```

**Ventajas:** ✅ Simple, flexible, una sola copia de HTML  
**Desventajas:** ⚠️ Debe restaurar estilos en el `finally`

**¿Cuándo usar?** Para cambios rápidos, tests con muchos botones (CISNEROS)

---

### 📊 Comparación: A vs B

| Aspecto | Solución A (MBI) | Solución B (CISNEROS) |
|---------|-----------------|----------------------|
| Código duplicado | ✅ Sí (2 contenedores) | ❌ No |
| Mantenimiento | ⚠️ Difícil (2 fuentes de verdad) | ✅ Fácil (1 fuente) |
| Sincronización | ⚠️ Manual | ✅ Automática |
| Complejidad HTML | ✅ Normal | ✅ Simple |
| Complejidad JS | ✅ Simple | ⚠️ Con try/finally |
| Tiempo implementación | ⚠️ Más lento | ✅ Más rápido |
| Riesgo de bugs | ✅ Bajo | ⚠️ Medio (si olvidas `finally`) |

**Recomendación:** Usar **Solución B** para nuevos tests. Solución A solo si necesitas control absoluto.

---

### Anti-Patterns (QUÉ NO HACER)

**❌ Error 1: Ocultar sin restaurar**
```javascript
// MALO - Los botones desaparecen para siempre
generarPDF() {
  document.getElementById('export-buttons').style.display = 'none';
  const opt = { ... };
  html2pdf().set(opt).from(document.getElementById('tab-resultados')).save();
  // ❌ Falta restaurar aquí
}
```

**❌ Error 2: Confiar en @media print**
```html
<!-- MALO - No funciona con html2pdf -->
<style>
  @media print {
    .buttons { display: none !important; }
  }
</style>
```

**❌ Error 3: Copiar manualmente (Solución A sin sincronizar)**
```javascript
// MALO - Los dos contenedores pueden divergir
const pdfContent = document.getElementById('tab-resultados-pdf');
// ... editar contenido del tab principal
// pero la copia en PDF no se actualiza
```

**❌ Error 4: Usar `visibility: hidden` en lugar de `display: none`**
```javascript
// MALO - Reserva espacio, visible en PDF
buttons.style.visibility = 'hidden';  // Ocupa espacio pero no se ve
// Usar display: none en su lugar
buttons.style.display = 'none';  // No ocupa espacio
```

---

### Verificación: ¿El PDF genera sin botones?

**Checklist Local (ANTES de push):**
```bash
✅ 1. npm run dev (levanta servidor)
✅ 2. Abrir http://localhost:3000/micrositios/test-name
✅ 3. Llenar test completamente
✅ 4. Click "Calcular Resultados"
✅ 5. Click "Descargar PDF"
✅ 6. Abrir PDF descargado → ¿Aparecen botones?
    - SI: Hay bug
    - NO: Está correcto
✅ 7. Volver a página → ¿Funcionan botones?
    - SI: Está correcto
    - NO: try/finally roto, bug crítico
✅ 8. Screenshot del PDF sin botones
```

**Comando Playwright:**
```javascript
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000/micrositios/test', { 
    waitUntil: 'networkidle' 
  });
  
  // Llenar y calcular
  await page.fill('#nombre', 'Test');
  // ... llenar items
  await page.click('button:has-text("Calcular Resultados")');
  await page.waitForTimeout(1500);
  
  // Generar PDF
  await Promise.all([
    page.waitForEvent('download'),
    page.click('button:has-text("Descargar PDF")')
  ]).then(async ([download]) => {
    const path = await download.path();
    console.log(`✅ PDF descargado: ${path}`);
    // Aquí podrías inspeccionar el PDF con una librería si necesitas
  });
  
  // Verificar botones volvieron
  const buttonsVisible = await page.evaluate(() => {
    const btn = document.querySelector('.action-buttons');
    return btn && getComputedStyle(btn).display !== 'none';
  });
  
  console.log(buttonsVisible ? '✅ Botones restaurados' : '❌ Botones no se restauraron');
  
  await browser.close();
})();
```

---

### Ejemplo Real: CISNEROS

**Implementación correcta en `public/micrositios/cisneros/js/cisneros.js`:**

```javascript
generarPDF() {
  if (!this.resultados) {
    alert('⚠️ Primero calcula los resultados');
    return;
  }

  const tabResultados = document.getElementById('tab-resultados');
  const exportButtons = document.getElementById('export-buttons');
  
  // Guardar estilos originales
  const originalDisplay = exportButtons?.style.display || '';
  
  try {
    // Ocultar botones
    if (exportButtons) {
      exportButtons.style.display = 'none';
    }
    
    // Generar PDF
    const opt = {
      margin: 10,
      filename: `CISNEROS_${this.paciente_nombre || 'reporte'}_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };
    
    html2pdf().set(opt).from(tabResultados).save();
    
  } finally {
    // Restaurar botones (SIEMPRE ejecutar)
    if (exportButtons) {
      exportButtons.style.display = originalDisplay;
    }
  }
}
```

### 2. Botones en PDF Generado

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

| Test | Status | Patrón PDF | Patrón JSON | Gráficos | Cache-Busting |
|------|--------|-----------|-----------|----------|---|
| MBI | ✅ | OPCIÓN A (separado) | ✅ `inicializarImportador()` | Recharts | ✅ |
| CISNEROS | ✅ | OPCIÓN B (dinámico) | ✅ `inicializarImportador()` | SVG inline | ✅ v20260725d |
| EGEP-5 | ✅ | OPCIÓN B (try/finally) | ⚠️ Verificar | SVG inline | ✅ v20260722 |
| CUIDA | ✅ | OPCIÓN A (separado) | ✅ | SVG inline | ✅ |
| SCID-II | ✅ | OPCIÓN B (try/finally) | ? | SVG inline | ✅ |
| MMPI-2-RF | ✅ | OPCIÓN B (try/finally) | ? | SVG inline | ✅ |
| SCL-90R | ✅ | OPCIÓN B (try/finally) | ? | SVG inline | ✅ |
| PCL-R | ✅ | OPCIÓN B (try/finally) | ? | SVG inline | ✅ |
| ISRA | ✅ | OPCIÓN B (try/finally) | ? | SVG inline | ✅ |
| Hamilton | ✅ | OPCIÓN B (try/finally) | ? | SVG inline | ✅ |

**Pendiente:** Verificar e implementar JSON import/export en tests faltantes, siguiendo patrón MBI.

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
