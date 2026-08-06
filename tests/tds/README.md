# TDS · Test de Trastornos del Sueño
## Micrositio Independiente y Aislado

**Versión:** 2.0 (Rediseño 06/08/2026)  
**Estado:** 🟢 Completamente aislado del sistema principal

---

## 📋 Descripción

Este directorio contiene el TDS (Test de Trastornos del Sueño) como un **micrositio completamente independiente** del sistema principal de EVALUACIÓN CLÍNICA.

Cada test psicométrico en este portfolio **DEBE ser aislado** para garantizar:
- ✅ Independencia funcional (no afecta otros tests)
- ✅ Reutilización segura (puede replicarse a otros proyectos)
- ✅ Mantenimiento limpio (cambios locales no rompen el core)

---

## 📁 Estructura

```
tests/tds/
├── index.html              # Versión mejorada del test (UTF-8, colores actualizados)
├── tds-legacy.html         # Versión legada del tds.html original (respaldo)
├── tds2-legacy.html        # Versión legada del tds2.html original (respaldo)
├── README.md               # Este archivo
├── js/
│   └── tds-original.js     # Datos originales del test (respaldo de referencia)
└── ISOLATION.md            # Registro de aislamiento
```

---

## 🚀 Usar el TDS

### Opción 1: Directamente (desarrollo local)
```bash
# Abrir en navegador
cd tests/tds
# Arrastra index.html al navegador o:
http://localhost/tests/tds/index.html
```

### Opción 2: Integración futura con expediente
```javascript
// Para agregar botón "Guardar en Expediente" en index.html:
// Implementar patrón de integración (ver INTEGRATION.md cuando exista)
```

---

## 📊 Características

- **30 ítems** organizados en **10 factores**
- Escala Likert: Nada · Un poco · Moderado · Bastante · Mucho
- **Cálculo automático** de puntajes
- **Perfil visual** por factor
- **Generación de PDF** profesional
- **Import/Export JSON** para reutilización de datos
- **Dark/Light theme** automático
- **LocalStorage** para persistencia local

---

## 🎨 Colores Actualizados (06/08/2026)

| Elemento | Color | Hex |
|----------|-------|-----|
| Accent Primary | Azul | #2563EB |
| Accent Mid | Azul Brillante | #4A8FFF |
| Accent Deep | Azul Oscuro | #1E40AF |
| Background (Light) | Gris Crema | #F8F6F3 |
| Background (Dark) | Marrón Oscuro | #1A1410 |

---

## ✨ Cambios Respecto a Versión Anterior

### Encoding UTF-8
- ✅ Caracteres acentuados: `Evaluación`, `Psicología` (no `EvaluaciÃ³n`)
- ✅ Espacios normales (sin caracteres rotos)

### Colores
- ✅ Cambio: Morado → Azul (#2563EB)
- ✅ Coherencia con frontend actual

### UI
- ✅ Botón "Finalizar TDS" al final del test (cálculo automático)
- ✅ Diseño responsive mejorado

---

## 🔒 Aislamiento Confirmado

El TDS ha sido **removido completamente** del sistema principal:

### Archivos Eliminados
- ✅ `public/tds.html` (archivo viejo)
- ✅ `public/tds2.html` (archivo viejo)
- ✅ `public/js/tests/tds.js` (definición antigua)

### Referencias Removidas de `public/index.html`
- ✅ Botón TDS en sidebar
- ✅ Botón TDS-2 en sidebar

### Referencias Removidas de `public/js/app.js`
- ✅ `'TDS': tests_tds` (definición de test)
- ✅ `'tds': 'TDS'` (mapeo de página)
- ✅ `'TDS': 'tds'` (mapeo inverso)
- ✅ `[data-page="tds"]` (selectores DOM)
- ✅ Función `iniciarTDS2()`
- ✅ `'tds'` en `testsConEvaluador`
- ✅ Mapeo de interpretación TDS

---

## 📝 Notas de Desarrollo

### Criterios de Interpretación
Los puntos de corte usados (≤60 normal, 61-90 moderado, >90 severo) fueron proporcionados como **criterio interno de trabajo**. No corresponden a un baremo poblacional publicado con validación psicométrica.

### Perfil de Referencia
El perfil "Población Normal" es **ilustrativo, no formalmente validado**. Sirve como punto de comparación visual para facilitar la lectura clínica.

---

## 🔧 Próximos Pasos

1. **Integración con Expediente**: Agregar botón "Guardar en Expediente"
2. **Carga de Datos**: Cargar automáticamente datos del paciente
3. **Patrón MBI**: Aplicar estructura de PDF de dos contenedores
4. **Tests Adicionales**: Crear micrositios para otros tests siguiendo este patrón

---

## 📖 Véase También

- [CLAUDE.md](../../CLAUDE.md) - Guía maestro del portfolio
- [Test Isolation Verifier](../../.claude/skills/test-isolation-verifier/) - Skill de validación
- Patrones de aislamiento en: EGEP-5, MBI, CISNEROS

---

**Última actualización:** 06 de agosto de 2026  
**Responsable:** Claude Code  
**Estado:** ✅ Listo para desarrollo independiente
