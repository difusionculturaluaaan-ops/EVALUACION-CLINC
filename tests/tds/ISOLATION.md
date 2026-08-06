# 🔒 Registro de Aislamiento del TDS
**Fecha:** 06 de agosto de 2026  
**Ejecutado por:** Claude Code  
**Propósito:** Aislar TDS del sistema principal manteniendo respaldos

---

## ✅ Acciones Completadas

### 1. Creación de Carpeta Aislada
```
✓ Directorio creado: tests/tds/
✓ Subdirectorios: js/, css/
```

### 2. Respaldo de Archivos Originales
```
✓ tests/tds/tds-legacy.html         ← public/tds.html (respaldo)
✓ tests/tds/tds2-legacy.html        ← public/tds2.html (respaldo)
✓ tests/tds/js/tds-original.js      ← public/js/tests/tds.js (respaldo)
```

### 3. Nuevo Índice Principal
```
✓ tests/tds/index.html              ← tds_fixed.html (mejorado)
  - UTF-8 correctamente codificado
  - Colores actualizados (morado → azul)
  - Botón "Finalizar TDS" agregado
  - LocalStorage funcional
  - PDF generación integrada
```

### 4. Eliminación del Sistema Principal
```
✓ public/tds.html                   ELIMINADO
✓ public/tds2.html                  ELIMINADO
✓ public/js/tests/tds.js            ELIMINADO
```

### 5. Limpieza de Referencias en index.html
```
✓ Línea 79-81: Removido botón TDS
✓ Línea 82-84: Removido botón TDS-2
```

### 6. Limpieza de Referencias en public/js/app.js
```
✓ Línea 34:   'TDS': tests_tds,                                    REMOVIDO
✓ Línea 135:  'tds': 'TDS',                                       REMOVIDO
✓ Línea 212:  'TDS': 'tds',                                       REMOVIDO
✓ Línea 221:  [data-page="tds"] en querySelectorAll              REMOVIDO
✓ Línea 239:  [data-page="tds"] en querySelectorAll (fallback)    REMOVIDO
✓ Línea 797-804: Función iniciarTDS2()                           REMOVIDO
✓ Línea 1535: 'tds' en testsConEvaluador                         REMOVIDO
✓ Línea 4850: 'TDS': 'tds' en mapeoInterpretacion                REMOVIDO
```

---

## 📊 Resumen de Cambios

| Categoría | Acción | Estado |
|-----------|--------|--------|
| Archivos | 3 eliminados del public | ✅ |
| Referencias HTML | 2 botones removidos | ✅ |
| Referencias JS | 8 líneas removidas | ✅ |
| Aislamiento | Carpeta tests/tds creada | ✅ |
| Respaldos | 3 archivos preservados | ✅ |
| Documentación | README + ISOLATION.md | ✅ |

---

## 🧪 Verificación

### Tests de Aislamiento Exitosos
- ✅ TDS no aparece en sidebar del sistema principal
- ✅ `app.iniciarTestConPaciente('tds')` ya no está disponible
- ✅ `app.iniciarTDS2()` removida
- ✅ Archivo tests/tds/index.html funciona independientemente
- ✅ LocalStorage del TDS funciona de forma aislada

### Integridad del Sistema Principal
- ✅ Otros tests (EGEP-5, MBI, CISNEROS, etc.) sin cambios
- ✅ API /api/pruebas sigue siendo genérica (compatible)
- ✅ No hay errores JavaScript (app.js limpio)

---

## 🔐 Ventajas del Aislamiento

### ✅ Independencia
- El TDS puede ser actualizado sin afectar otros tests
- Puede ser replicado a otros proyectos sin conflictos

### ✅ Reutilización
- Carpeta tests/tds/ es portátil
- Patrón replicable para otros micrositios

### ✅ Mantenimiento
- Cambios locales en index.html no afectan el core
- CSS/JS específico del TDS está contenido

### ✅ Seguridad
- Respaldos disponibles en tds-legacy.html y tds2-legacy.html
- Código original preservado en js/tds-original.js
- Fácil reversión si es necesaria

---

## 📝 Notas Técnicas

### Rutas de Acceso Futuras
```
# Opción 1: URL directa (desarrollo)
http://localhost:3000/tests/tds/index.html

# Opción 2: Iframe en expediente (futuro)
<iframe src="/tests/tds/index.html?paciente_id=123"></iframe>

# Opción 3: Nuevo botón en sidebar (futuro)
onclick="app.abrirMicrositio('tds', pacienteId)"
```

### Integración Futura
Para que el TDS se integre nuevamente (con expediente):

1. Agregar botón en tests/tds/index.html
2. Implementar patrón de comunicación con expediente
3. Seguir modelo de EGEP-5 o MBI
4. Crear archivo INTEGRATION.md en esta carpeta

---

## 📋 Checklist de Aislamiento

- [x] Crear directorio tests/tds/
- [x] Copiar archivos originales como respaldo
- [x] Crear versión mejorada en index.html
- [x] Eliminar archivos del public/
- [x] Remover referencias en index.html
- [x] Remover referencias en app.js
- [x] Verificar no hay errores en consola
- [x] Documentar cambios (README.md)
- [x] Documentar aislamiento (ISOLATION.md)
- [x] Confirmar otros tests funcionan bien

---

**Estado Final:** ✅ COMPLETAMENTE AISLADO  
**Próximo Paso:** Integración con expediente (cuando se requiera)
