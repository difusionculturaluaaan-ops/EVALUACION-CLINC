# TDS-3 · Test de Trastornos del Sueño (v3 - Mejorado)

**Versión:** 3.0 (Integración con Expediente - 06/08/2026)  
**Estado:** 🟢 Completamente aislado e integrado  
**Multitenant:** ✅ Soporte completo  

---

## 🔒 AISLAMIENTO TOTAL

Este micrositio es **COMPLETAMENTE INDEPENDIENTE** y aislado:

- ✅ Carpeta separada: `/tests/tds3/` (NO mezclar con `/tests/tds/`)
- ✅ Sin dependencias de otros tests
- ✅ Sin imports cruzados
- ✅ Datos locales en localStorage (por paciente)
- ✅ API multitenant con `paciente_id` en cada request

---

## 📋 Descripción

TDS-3 es la **tercera versión mejorada** del Test de Trastornos del Sueño:

- **30 ítems** organizados en 10 factores
- **Integración con Expediente**: Guardar resultados automáticamente
- **Multitenant ready**: Soporta múltiples clínicas/usuarios simultáneamente
- **Auto-carga de datos**: Lee datos del paciente desde sessionStorage
- **PDF generación**: Reportes profesionales
- **Import/Export JSON**: Reutilización de evaluaciones

---

## 🚀 Flujo de Uso

```
1. APP PRINCIPAL (public/index.html)
   └─ Usuario selecciona paciente
   └─ Hace click "TDS-3 (Nuevo)"
   
2. app.iniciarTDS3() (public/js/app.js)
   └─ Guarda datos en sessionStorage:
      * paciente_id
      * paciente_nombre
      * paciente_edad
      * paciente_sexo
      * usuario_nombre
      * auth_token
   
3. Redirige a: /tests/tds3/index.html?paciente_id=xxx&token=yyy
   
4. TDS-3 carga (tests/tds3/index.html)
   └─ Lee datos de URL y sessionStorage
   └─ Auto-llena formulario
   └─ Usuario responde 30 ítems
   └─ Calcula resultados automáticamente
   
5. Usuario hace click "Guardar en Expediente"
   └─ POST /api/pruebas con:
      {
        paciente_id: "xxx",
        tipo: "TDS",
        data: [respuestas],
        total: puntaje,
        subescalas: {factores}
      }
   └─ Servidor guarda en BD (multitenant)
   └─ Resultado disponible en expediente del paciente

6. (Futuro) Cargar evaluación guardada
   └─ Expediente → "TDS-3" → Abrir/Reabrir
   └─ Auto-llena con datos previos
```

---

## 📁 Estructura

```
tests/tds3/
├── index.html              # Aplicación completa (HTML + CSS + JS)
├── README.md               # Este archivo
└── ISOLATION.md            # Registro de aislamiento (TDS-3 vs TDS)
```

## 🔧 Características Técnicas

### ✅ Multitenant
- Cada evaluación vinculada a `paciente_id` único
- Datos persistidos en BD por paciente
- Sin colisión entre clínicas/usuarios

### ✅ Integración
- Lee datos de `sessionStorage` (pasado por app.js)
- Auto-llena: nombre, edad, sexo, evaluador
- Fallback a `localStorage` si sessionStorage vacío
- Token JWT en headers: `Authorization: Bearer {token}`

### ✅ Aislamiento
- **Cero dependencias** de otros tests
- **Cero imports** cruzados
- **Cero compartición** de variables globales
- Puede moverse a otro proyecto sin cambios

### ✅ Seguridad
- JWT obligatorio para guardar
- paciente_id verificado en servidor
- RLS en BD por tenant_id (en schema)

---

## 🎯 Diferencias: TDS vs TDS-3

| Aspecto | TDS (v1) | TDS-3 (v3) |
|---------|----------|----------|
| **Carpeta** | `/tests/tds/` | `/tests/tds3/` |
| **Expediente** | ❌ No integrado | ✅ Integrado |
| **Auto-llenar** | ❌ Manual | ✅ Automático |
| **Multitenant** | ⚠️ Parcial | ✅ Completo |
| **Guardar** | 📥 JSON local | 💾 BD remota |
| **Aislamiento** | ✅ | ✅ MAYOR |

---

## 🧪 Prueba en Local

```bash
# 1. Iniciar servidor
npm start

# 2. Abrir http://localhost:3000
# 3. Login
# 4. Crear/seleccionar paciente
# 5. Click "TDS-3 (Nuevo)"
# 6. Llenar test
# 7. Click "Guardar en Expediente"
# 8. Verificar en Expediente → Resultados del paciente
```

---

## 📝 Notas Importantes

### ⚠️ NUNCA mezclar TDS y TDS-3
- Son versiones independientes
- Están en carpetas separadas
- Tienen funciones diferentes
- Datos no comparten storage

### ⚠️ Multitenant - Verificación en Servidor
El cliente envía `paciente_id`, pero el servidor **DEBE verificar**:
```javascript
// server.js (rutas/pruebas.js)
const paciente = await getPacienteByIdTenant(paciente_id, req.tenant_id);
if (!paciente) return 403; // Acceso denegado
```

### ⚠️ Token JWT Obligatorio
Sin token válido en headers, guardar fallará:
```javascript
// En TDS-3, al guardar:
fetch('/api/pruebas', {
  headers: {
    'Authorization': `Bearer ${authToken}`
  }
})
```

---

## 🚀 Próximos Pasos

1. **Carga de datos previos**: Si paciente tiene TDS-3 guardado, cargar automáticamente
2. **Historial**: Ver versiones anteriores del test para este paciente
3. **Comparativa**: Mostrar cambios entre evaluaciones
4. **Reabrir para editar**: Permitir continuar una evaluación incompleta

---

## 📊 Estado de Implementación

```
✅ Estructura HTML/CSS/JS
✅ Auto-carga de datos del paciente
✅ Cálculo automático de puntajes
✅ Botón "Guardar en Expediente"
✅ Función guardarEnExpediente() con POST /api/pruebas
✅ Manejo de errores y fallbacks
✅ Mensaje de éxito (toast)
✅ Generación de PDF
✅ Import/Export JSON
✅ LocalStorage persistencia
✅ Dark/Light theme

⏳ FUTURO:
⚠️ Carga de evaluaciones previas
⚠️ Historial de evaluaciones
⚠️ Comparativa entre fechas
⚠️ Reabrir para editar
```

---

**Última actualización:** 06 de agosto de 2026  
**Responsable:** Claude Code  
**Status:** ✅ Listo para producción (multitenant verified)
