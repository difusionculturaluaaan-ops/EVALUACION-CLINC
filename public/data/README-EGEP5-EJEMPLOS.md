# EGEP-5: Archivos de Ejemplo para Testing

## 📋 Archivos Disponibles

### ✅ `egep5-ejemplo-positivo.json`
**Diagnóstico: TEPT PRESENTE**
- Evento traumático: Accidente automovilístico
- Síntomas presentes en todas las escalas
- Impacto funcional significativo
- Resultado esperado: Se cumplen criterios A-G DSM-5

### ❌ `egep5-ejemplo-negativo.json`
**Diagnóstico: TEPT AUSENTE**
- Evento menor sin síntomas significativos
- Pocos síntomas reportados
- Mínimo impacto funcional
- Resultado esperado: No se cumplen criterios B-E

---

## 🚀 Cómo Usar

### Opción 1: Importar vía Interfaz (cuando esté disponible)
1. En la Sección 1, busca el botón **"Importar JSON"**
2. Selecciona uno de estos archivos
3. El formulario se completará automáticamente
4. Navega a Sección 3 y haz clic en **"Calcular Resultados"**

### Opción 2: Importar por Console (temporal, para testing)
```javascript
// En la consola (F12):
fetch('/data/egep5-ejemplo-positivo.json')
  .then(r => r.json())
  .then(d => {
    window.tests_egep5.respuestas = d.respuestas;
    window.tests_egep5.renderizarSintomas();
    window.tests_egep5.renderizarFuncionamiento();
    alert('JSON importado. Ve a Sección 3 y calcula.');
  });
```

---

## 📊 Estructura del JSON

```json
{
  "testType": "EGEP-5",           // Tipo de test
  "version": "1.0",               // Versión del formato
  "meta": {                        // Metadatos del paciente
    "nombre": "...",
    "fecha": "YYYY-MM-DD",
    "edad": "XX",
    "sexo": "...",
    "centro": "...",
    "evaluador": "...",
    "evento": "..."
  },
  "ev": { ... },                   // Eventos traumáticos (1-11)
  "respuestas": {                  // Respuestas de los 58 ítems
    "13": "leve",                  // Opciones: leve, mod, grave, extrema
    "14": "1a3m",                  // Opciones: infancia, mas3m, 1a3m, ultimo_mes
    "15": "unica",                 // Opciones: unica, varias, repetida
    "27": { "si": "SI", "g": 3 },  // Síntomas: SI/NO + grado 0-4
    "50": "mas3m",                 // Opciones: menos1m, 1a3m, mas3m
    "51": "primeros6m",            // Opciones: inmediato, primeros6m, 6m_mas
    "52": "SI"                     // Funcionamiento: SI/NO
  }
}
```

---

## 💡 Para Crear Tus Propios Ejemplos

1. Llena el formulario manualmente
2. Abre **DevTools** (F12)
3. En la **Consola**, escribe:
   ```javascript
   const json = JSON.stringify({
     testType: 'EGEP-5',
     version: '1.0',
     meta: window.tests_egep5.respuestas,  // o los datos que tengas
     ev: {},  // agrega eventos si los hay
     respuestas: window.tests_egep5.respuestas
   }, null, 2);
   console.log(json);
   // Copia el output y guárdalo como archivo .json
   ```

---

## 🎯 Próximos Pasos

- [ ] Integrar botón de importación en la UI
- [ ] Agregar más ejemplos (incompleto, con especificaciones, etc)
- [ ] Crear herramienta de exportación automática

