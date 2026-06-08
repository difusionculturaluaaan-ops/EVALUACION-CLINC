# 🎨 Design System — Psyche (Evaluación Clínica Psicológica)

**Versión:** 1.0  
**Estado:** ✅ Foundation completa  
**Última actualización:** Junio 2026

---

## 📋 Índice

1. [Overview](#overview)
2. [Archivos](#archivos)
3. [Tokens CSS](#tokens-css)
4. [Tipografía](#tipografía)
5. [Componentes](#componentes)
6. [Cómo usar](#cómo-usar)
7. [Checklist para nuevos tests](#checklist-para-nuevos-tests)
8. [Reglas y restricciones](#reglas-y-restricciones)

---

## Overview

El Design System de Psyche proporciona una **foundation visual unificada** para toda la plataforma de evaluación clínica psicológica. Incluye:

- **Variables CSS centralizadas** (colores, espaciado, tipografía, sombras)
- **Clases tipográficas reutilizables** (display, heading, body, label, caption)
- **Componentes CSS puros** (botones, badges, cards, inputs, progress bars, empty states)
- **Sin dependencias externas** (funciona en HTML vanilla + JavaScript)

### Principios

✅ **Cero hardcoding** — Todos los valores visuales vienen de tokens.css  
✅ **Reutilizable** — Componentes funcionan en cualquier micrositio (CUIDA, MMPI-2-RF, etc.)  
✅ **Accesible** — Focus states, aria-labels, semántica HTML  
✅ **Responsive** — Mobile-first, funciona en todos los tamaños  
✅ **Sin breaking changes** — Tests existentes no se afectan  

---

## Archivos

### Foundation
```
public/css/
├── tokens.css          ← Variables CSS (colores, espaciado, tipografía)
├── typography.css      ← Clases tipográficas (.text-display-lg, .text-body, etc.)
└── components.css      ← Componentes reutilizables (btn, badge, card, input, etc.)
```

### Testing
```
public/
├── design-system-test.html     ← Demo de tokens y tipografía
└── components-test.html        ← Demo de componentes
```

---

## Tokens CSS

Todos los tokens están en `public/css/tokens.css` bajo `:root`.

### Colores

**Primarios**
```css
--color-primary: #534AB7;              /* Púrpura principal */
--color-primary-hover: #4840A3;        /* Hover del primario */
--color-primary-light: #EAE8F8;        /* Fondo claro */
--color-primary-subtle: #F3F0FA;       /* Fondo muy claro */
```

**Superficies**
```css
--color-surface: #FFFFFF;              /* Blanco principal */
--color-surface-secondary: #F8F7FC;    /* Gris claro */
--color-surface-tertiary: #F3F0FA;     /* Gris más claro */
--color-bg: #EEE9F8;                   /* Fondo de página */
```

**Texto**
```css
--color-text-primary: #1A1833;         /* Texto principal (negro) */
--color-text-secondary: #5C5880;       /* Texto secundario (gris) */
--color-text-muted: #9E9BBF;           /* Texto debilitado (gris claro) */
--color-text-inverse: #FFFFFF;         /* Texto inverso (blanco) */
```

**Semánticos**
```css
--color-success: #2E7D5E;              /* Verde éxito */
--color-warning: #B45309;              /* Naranja advertencia */
--color-danger: #B91C1C;               /* Rojo peligro */
--color-info: #1D4ED8;                 /* Azul información */
```

### Espaciado (escala 4px)

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;   /* Espaciado base */
--space-5: 20px;
--space-6: 24px;   /* Más común */
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
```

### Tipografía

```css
--font-display: 'DM Serif Display', Georgia, serif;
--font-body: 'DM Sans', system-ui, sans-serif;

--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 2rem;      /* 32px */
```

### Bordes y Sombras

```css
--radius-sm: 6px;
--radius-md: 10px;
--radius-lg: 14px;
--radius-full: 9999px;

--shadow-sm: 0 1px 3px rgba(83,74,183,0.08);
--shadow-md: 0 4px 16px rgba(83,74,183,0.10);
--shadow-lg: 0 8px 32px rgba(83,74,183,0.14);
```

### Transiciones

```css
--transition-fast: 120ms ease;
--transition-base: 200ms ease;
--transition-slow: 300ms ease;
```

---

## Tipografía

### Dónde usar cada tipografía

#### DM Serif Display (headings grandes)
- Solo en `.text-display-*` clases
- Solo en `<h1>` de página
- Transmite autoridad y profesionalismo
- **NO usar en body, labels, o botones**

```html
<h1 class="text-display-lg">MMPI-2 Forma Reestructurada</h1>
<div class="text-display-md">Resultados de Evaluación</div>
```

#### DM Sans (todo lo demás)
- `.text-heading` - títulos de sección (1.125rem, semibold)
- `.text-subheading` - subtítulos (1rem, medium)
- `.text-body` - párrafos principales (1rem, normal)
- `.text-body-sm` - párrafos pequeños (0.875rem)
- `.text-label` - etiquetas, botones (0.875rem, uppercase)
- `.text-caption` - ayuda, hints (0.75rem)
- `.text-mono` - IDs, códigos, folios

```html
<h2 class="text-heading">Datos del Paciente</h2>
<p class="text-body">Lorem ipsum dolor sit amet...</p>
<label class="text-label">Nombre Completo</label>
<small class="text-caption">Campo requerido</small>
```

### Escala de tamaños

```
Display Large    32px   — Page title (h1)
Display Medium   24px   — Major section
Display Small    20px   — Section heading

Heading          18px   — Card title
Subheading       16px   — Secondary title
Body             16px   — Paragraph text
Body Small       14px   — Secondary text
Label            14px   — Input labels, buttons
Caption          12px   — Helper text, hints
Mono             14px   — Code, IDs
```

---

## Componentes

### Button

**Variantes:** primary | secondary | danger | ghost  
**Tamaños:** sm | md (default) | lg  
**Estados:** normal, hover, active, disabled, focus

```html
<!-- Primary button -->
<button class="btn btn-primary">Calcular Resultados</button>

<!-- Secondary button -->
<button class="btn btn-secondary">Exportar JSON</button>

<!-- Danger button -->
<button class="btn btn-danger">Eliminar</button>

<!-- Ghost button -->
<button class="btn btn-ghost">Cancelar</button>

<!-- Tamaños -->
<button class="btn btn-primary btn-sm">Small</button>
<button class="btn btn-primary">Medium</button>
<button class="btn btn-primary btn-lg">Large</button>

<!-- Full width -->
<button class="btn btn-primary btn-full">Ancho completo</button>

<!-- Disabled -->
<button class="btn btn-primary" disabled>Deshabilitado</button>

<!-- Group -->
<div class="btn-group">
  <button class="btn btn-primary">Guardar</button>
  <button class="btn btn-secondary">Cancelar</button>
</div>
```

### Badge

**Variantes:** default | success | warning | danger | info  
**Tamaños:** sm (default) | lg

Para indicar **estados clínicos** en expedientes y tests.

```html
<!-- Estados de evaluación -->
<span class="badge badge-default">Sin evaluar</span>
<span class="badge badge-success">Completado</span>
<span class="badge badge-warning">Evaluación pendiente</span>
<span class="badge badge-danger">Requiere atención</span>
<span class="badge badge-info">En revisión</span>

<!-- Tamaño grande -->
<span class="badge badge-success badge-lg">Completado</span>
```

### Card

**Variantes:** default | flat | elevated

```html
<!-- Default: white with shadow sm -->
<div class="card card-default">
  <div class="card-header">
    <h3>Título de la Card</h3>
  </div>
  <div class="card-body">
    <p>Contenido principal</p>
  </div>
  <div class="card-footer">
    <button class="btn btn-secondary btn-sm">Acción</button>
  </div>
</div>

<!-- Flat: secondary surface -->
<div class="card card-flat">
  <div class="card-header">
    <h3>Sin sombra</h3>
  </div>
  <div class="card-body">
    <p>Para listas y contenido secundario</p>
  </div>
</div>

<!-- Elevated: strong shadow -->
<div class="card card-elevated">
  <div class="card-header">
    <h3>Destacado</h3>
  </div>
  <div class="card-body">
    <p>Para contenido principal</p>
  </div>
</div>
```

### Input

```html
<!-- Text input -->
<div class="input-wrapper">
  <label class="input-label">Nombre del Paciente</label>
  <input type="text" class="input-field" placeholder="Ej: Juan Pérez">
  <small class="input-helper">Ingresa el nombre completo</small>
</div>

<!-- Required field -->
<div class="input-wrapper">
  <label class="input-label required">Email</label>
  <input type="email" class="input-field">
</div>

<!-- Textarea -->
<div class="input-wrapper">
  <label class="input-label">Observaciones</label>
  <textarea class="input-field" placeholder="Notas clínicas..."></textarea>
</div>

<!-- Select -->
<div class="input-wrapper">
  <label class="input-label">Tipo de Test</label>
  <select class="input-field">
    <option>MMPI-2 RF</option>
    <option>CUIDA</option>
  </select>
</div>

<!-- Error state -->
<small class="input-helper error">Este campo es requerido</small>

<!-- Disabled -->
<input type="text" class="input-field" disabled>
```

### Progress Bar

Para mostrar progreso de preguntas en tests.

```html
<div class="progress-wrapper">
  <div class="progress-label">
    <span class="progress-label-text">MMPI-2 RF</span>
    <span class="progress-label-count">142 / 338</span>
  </div>
  <div class="progress-bar">
    <div class="progress-fill" style="width: 42%"></div>
  </div>
</div>
```

### Empty State

Para dashboards y listas vacías.

```html
<div class="empty-state">
  <div class="empty-state-icon">📭</div>
  <h3 class="empty-state-title">Sin pacientes registrados</h3>
  <p class="empty-state-description">
    Crea tu primer expediente para comenzar
  </p>
  <div class="empty-state-action">
    <button class="btn btn-primary">Crear Paciente</button>
    <button class="btn btn-secondary">Importar Datos</button>
  </div>
</div>
```

### Grid System

```html
<!-- 2 columnas -->
<div class="grid-cols-2">
  <div>Columna 1</div>
  <div>Columna 2</div>
</div>

<!-- 3 columnas -->
<div class="grid-cols-3">
  <div>Col 1</div>
  <div>Col 2</div>
  <div>Col 3</div>
</div>
```

---

## Cómo usar

### En un HTML nuevo

1. **Importar en el `<head>`:**
```html
<link rel="stylesheet" href="/css/tokens.css">
<link rel="stylesheet" href="/css/typography.css">
<link rel="stylesheet" href="/css/components.css">
```

2. **Usar clases:**
```html
<body style="background-color: var(--color-bg); color: var(--color-text-primary);">
  <div style="padding: var(--space-6);">
    <h1 class="text-display-lg">Mi Nuevo Test</h1>
    <button class="btn btn-primary">Comenzar</button>
  </div>
</body>
```

3. **No hardcodear colores/tamaños:**
```css
/* ❌ NO HACER */
.mi-boton { background: #534AB7; padding: 16px; }

/* ✅ HACER */
.mi-boton { background: var(--color-primary); padding: var(--space-4); }
```

### En tests existentes

**No es necesario cambiar CUIDA, MMPI-2-RF, etc.** Si en el futuro quieres migrar:

1. Agregar imports del design system
2. Cambiar componentes de a uno
3. Testear después de cada cambio
4. Commit incremental

---

## Checklist para nuevos tests

Cuando crees un nuevo test psicométrico:

- [ ] Importar `tokens.css` + `typography.css` + `components.css`
- [ ] Usar `--color-primary` (no hardcodear #534AB7)
- [ ] Usar `--space-*` para espaciado (no hardcodear px)
- [ ] Usar `.text-display-*` solo en h1
- [ ] Usar `.text-body` para párrafos
- [ ] Usar `.btn btn-primary` para botones principales
- [ ] Agregar `aria-label` a íconos
- [ ] Testear en mobile (responsive)
- [ ] Testear focus states (Tab key)
- [ ] No usar emojis como íconos funcionales

**Resultado:** Test que se ve coherente con toda la plataforma, sin duplicar CSS.

---

## Reglas y restricciones

### ✅ HACER

- Usar variables CSS de `tokens.css`
- Usar clases de `components.css`
- Crear componentes custom combinando clases base
- Extender estilos solo cuando sea necesario
- Testear en múltiples navegadores

### ❌ NO HACER

- Hardcodear colores, tamaños, espacios
- Crear nuevas escalas tipográficas
- Modificar `tokens.css` sin consenso
- Usar emojis como íconos funcionales
- Agregar dependencias externas (npm packages)
- Copiar estilos en lugar de usar clases

### Cuando agregar un nuevo token

Si necesitas algo que no existe:

1. Documentalo en una issue
2. Discute si pertenece al design system
3. Si sí, agregalo a `tokens.css` + documentación
4. Actualiza versión en este archivo

### Cuando crear un nuevo componente

1. Crea la estructura HTML
2. Agrega estilos a `components.css`
3. Crea demo en `components-test.html`
4. Documenta en esta sección
5. Commit con "Design System: Add [component name]"

---

## FAQ

**P: ¿Puedo overridear los tokens?**  
R: No recomendado. Si necesitas un color diferente, considerar si es una excepción válida o si falta un token. Documenta en una issue si es lo segundo.

**P: ¿Y si CUIDA necesita colores diferentes?**  
R: CUIDA puede mantener su CSS actual indefinidamente. El design system es optional para tests existentes.

**P: ¿Cómo migro un test viejo al design system?**  
R: Gradualmente. Cambia un componente a la vez, testea, y haz commit después de cada cambio. No todo de una vez.

**P: ¿Funciona sin JavaScript?**  
R: Sí. El design system es CSS puro + HTML. JavaScript es solo para lógica de negocio.

**P: ¿Cuál es la próxima prioridad?**  
R: Crear componentes de barra lateral unificada (sidebar) + icon system (reemplazar emojis con SVG).

---

## Historial de versiones

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0 | Jun 2026 | Foundation: tokens, typography, components (6) |

---

## Contacto / Actualización

Si necesitas modificar el design system, documenta en una issue con:
- ¿Qué necesitas?
- ¿Por qué el sistema actual no funciona?
- ¿Afecta a otros tests?

---

**Last updated:** Junio 7, 2026  
**Maintainer:** Claude Code
