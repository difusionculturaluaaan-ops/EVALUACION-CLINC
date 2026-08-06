# TDS-3 · Test de Trastornos del Sueño (v3 - Micrositio Profesional)

**Versión:** 3.0 (Integración con Expediente - 06/08/2026)  
**Ubicación:** `/public/micrositios/tds3/`  
**Estado:** 🟢 Micrositio profesional multitenant  
**Acceso:** `/micrositios/tds3/`

---

## 🎯 Tipo de Aplicación

Este es un **MICROSITIO** - aplicación web independiente integrada al sistema principal:

- ✅ Ruta: `/public/micrositios/tds3/`
- ✅ URL: `http://localhost:3000/micrositios/tds3/`
- ✅ Servida por: `express.static()` en server.js
- ✅ Acceso: Desde app.js mediante `iniciarTDS3()`
- ✅ Datos: Multitenant con `paciente_id`

---

## 📋 Descripción

TDS-3 es un **micrositio profesional** para evaluar Trastornos del Sueño:

- **30 ítems** organizados en 10 factores
- **Integración con Expediente**: Guardar resultados automáticamente en BD
- **Multitenant**: Soporta múltiples clínicas/usuarios/tenants
- **Auto-carga**: Datos del paciente se cargan automáticamente
- **PDF**: Reportes profesionales descargables
- **JSON**: Import/Export para reutilización

---

## 🚀 Flujo Completo

```
1. APP PRINCIPAL
   ├─ public/index.html
   ├─ public/js/app.js → iniciarTDS3()
   └─ Redirige a: /micrositios/tds3/

2. DATOS PASADOS POR APP.JS
   ├─ sessionStorage:
   │  ├─ pacienteSeleccionado (ID)
   │  ├─ paciente_nombre
   │  ├─ paciente_edad
   │  ├─ paciente_sexo
   │  ├─ usuario_nombre (evaluador)
   │  └─ auth_token
   └─ URL: ?paciente_id=xxx&token=yyy

3. TDS-3 CARGA
   ├─ Lee datos de sessionStorage/URL
   ├─ Auto-llena formulario
   ├─ Usuario responde 30 ítems
   └─ Calcula resultados automáticamente

4. GUARDAR EN EXPEDIENTE
   ├─ POST /api/pruebas
   ├─ Headers: Authorization: Bearer {token}
   ├─ Body: paciente_id, tipo='TDS', data, total, subescalas
   └─ Resultado guardado en BD (multitenant)

5. EXPEDIENTE
   ├─ Paciente → Ver Resultados → TDS-3
   └─ Histórico de evaluaciones
```

---

## 📁 Estructura de Micrositios

```
public/micrositios/
├── egep5/
│   ├── index.html
│   ├── js/
│   │   ├── egep5.js
│   │   ├── egep5-baremos.js
│   │   └── egep5-graficos.js
│   └── README.md
│
├── mbi/
│   ├── index.html
│   ├── js/mbi.js
│   └── README.md
│
├── cisneros/
│   ├── index.html
│   ├── js/cisneros.js
│   └── README.md
│
└── tds3/ ← TDS-3 aquí
    ├── index.html          (HTML + CSS + JS inline)
    ├── js/                 (vacío - código en index.html)
    ├── css/                (vacío - estilos en index.html)
    └── README.md           (este archivo)
```

---

## 🔧 Características Técnicas

### ✅ Multitenant Seguro
- Cada evaluación vinculada a `paciente_id` único
- `tenant_id` verificado en servidor (schema)
- RLS en BD por tenant
- Sin colisión entre clínicas/usuarios

### ✅ Integración Completa
- Auto-carga de datos del paciente
- Fallback a localStorage si sessionStorage vacío
- Token JWT en headers
- Manejo de errores robusto
- Toast de éxito al guardar

### ✅ HTML Autónomo
- Todo código en `index.html` (HTML + CSS + JS inline)
- Cero dependencias externas
- Puede funcionar sin server.js si se abre directamente
- Pero mejor acceso: `/micrositios/tds3/`

### ✅ API Integration
- POST `/api/pruebas` para guardar
- Headers: `Authorization: Bearer {token}`
- Cuerpo: paciente_id, tipo, data, total, subescalas
- Respuesta JSON con resultado guardado

---

## 🧪 Prueba en Local

```bash
# 1. Iniciar servidor
npm start

# 2. Abrir http://localhost:3000
# 3. Login
# 4. Crear/seleccionar paciente
# 5. Click "TDS-3 (Nuevo)" en sidebar
# 6. Debería redirigir a /micrositios/tds3/
# 7. Llenar test (30 ítems)
# 8. Click "Calcular Resultados"
# 9. Click "Guardar en Expediente"
# 10. Verificar en Expediente → Resultados del paciente
```

---

## ⚙️ Configuración en Server

El server.js debe servir `/public/micrositios/`:

```javascript
// server.js (línea 30+)
app.use(express.static(publicPath, staticOptions));
app.use('/tests', express.static(testsPath, staticOptions));
// Micrositios se sirven automáticamente desde publicPath
```

---

## 📊 Estructura de Datos POST /api/pruebas

```javascript
{
  "paciente_id": "uuid-xxx",
  "tipo": "TDS",
  "data": [1, 2, 1, 3, 2, ...],  // 30 respuestas
  "total": 65,                    // Puntaje global máx 150
  "subescalas": {
    "F1_somnolencia": 12,
    "F2_insomnio_intermedio": 8,
    "F3_insomnio_inicial": 10,
    "F4_apnea": 5,
    "F5_paralisis_enuresis_bruxismo": 7,
    "F6_sonambulismo_somniloquio": 3,
    "F7_roncar": 6,
    "F8_piernas_pesadillas": 8,
    "F9_medicamentos": 2,
    "F10_paralisis_inicio": 4,
    "puntaje_global": 65,
    "_datos_paciente": {
      "fecha": "2026-08-06",
      "nombre": "Juan Pérez",
      "edad": "45",
      "sexo": "Varón"
    },
    "_resultados": {
      "factorScores": [...],
      "globalScore": 65,
      "band": {...}
    }
  }
}
```

---

## 🔐 Seguridad Multitenant

**Verificación en servidor (CRÍTICO):**

```javascript
// routes/pruebas.js
router.post('/', async (req, res) => {
  const { paciente_id, tipo, data, total, subescalas } = req.body;
  const tenant_id = req.tenant_id;  // Extraído de JWT

  // VERIFICACIÓN: ¿Paciente pertenece a este tenant?
  const paciente = await getPacienteByIdTenant(paciente_id, tenant_id);
  if (!paciente) {
    return res.status(403).json({ error: 'Acceso denegado' });
  }

  // Guardar con tenant_id
  const prueba = await guardarPrueba(
    paciente_id,
    tipo,
    data,
    total,
    subescalas,
    tenant_id  // ← IMPORTANTE
  );

  res.status(201).json(prueba);
});
```

---

## ✅ Checklist Antes de Deploy

- [ ] TDS-3 en `/public/micrositios/tds3/`
- [ ] URL en app.js: `/micrositios/tds3/`
- [ ] Archivo único: `index.html` (HTML + CSS + JS)
- [ ] POST `/api/pruebas` funciona
- [ ] Verificación tenant_id en servidor
- [ ] Token JWT requerido
- [ ] paciente_id validado
- [ ] Toast de éxito aparece
- [ ] Resultado guardado en BD
- [ ] Visible en Expediente del paciente
- [ ] Multitenant probado (2+ tenants)

---

## 🚀 Próximos Pasos

1. **Historial**: Mostrar evaluaciones previas del paciente
2. **Reabrir**: Continuar evaluación incompleta
3. **Comparativa**: Ver cambios entre fechas
4. **Reportes**: Generar PDF profesional
5. **Exportación**: Descargar datos en formatos

---

**Última actualización:** 06 de agosto de 2026  
**Responsable:** Claude Code  
**Tipo:** Micrositio profesional multitenant  
**Status:** ✅ Producción-ready
