# 🧪 Prueba Local: TDS Gráfico 10 Factores → PDF

**Fecha:** 5 de agosto 2026  
**Objetivo:** Verificar que el gráfico TDS con 10 factores se renderiza correctamente en pantalla Y en el PDF descargado

---

## 📋 Pasos para Probar

### 1️⃣ Asegurarse que el servidor está corriendo

```bash
# En terminal 1
cd c:\Users\image\Developer\software\EVALUACIÓN CLÍNICA PSICO
npm run dev
```

Esperar hasta ver:
```
✓ ready - started server on 0.0.0.0:3000
```

### 2️⃣ Abrir navegador y hacer login

- Ir a: `http://localhost:3000/`
- Email: `demo@clinica.com`
- Contraseña: `demo123456!`
- Click "Entrar"

### 3️⃣ Abrir test TDS

- En el sidebar izquierdo, hacer click en **"TDS"**
- Debería cargar el formulario con 30 ítems

### 4️⃣ Llenar el test manualmente

**Opción A: Llenar todos los 30 ítems** (recomendado para prueba completa)
- Cada ítem tiene 5 opciones (0-5)
- Llenar con valores variados (ej: algunos 1, algunos 3, algunos 4)
- Takes ~2-3 minutos

**Opción B: Llenar rápido** (primeros 20 ítems es suficiente)
- Hacer click en diferentes opciones rápidamente
- Puede ser 0-5, lo importante es que haya datos

### 5️⃣ Calcular Resultados

- Hacer click en botón **"Calcular Resultados"**
- Esperar ~1-2 segundos
- Deberías ver:
  - ✅ **Tabla de factores** (F1-F10 con nombres)
  - ✅ **Gráfico de barras** (10 pares de barras: Paciente rojo, Referencia verde)
  - ✅ **Modal con interpretación** de resultados

**Verificar en pantalla:**
```
DENTRO DEL MODAL:
┌─────────────────────────────────┐
│ TDS: Test de Trastornos del Sueño│
│                                  │
│ [Gráfico aquí - 10 BARRAS]       │
│ ┌──────────────────────────────┐ │
│ │ ▮▮ ▮▮ ▮▮ ... ▮▮ ▮▮ (10 pares) │ │
│ │                              │ │
│ │ 🔴 Paciente  🟢 Referencia   │ │
│ └──────────────────────────────┘ │
│                                  │
│ [Tabla de Factores]              │
│ F1: Somnolencia:  [valores]      │
│ F2: Insomnio:     [valores]      │
│ ...                              │
│ F10: Parálisis:   [valores]      │
│                                  │
│ [Botones]                        │
│ [Descargar] [Cerrar]             │
└─────────────────────────────────┘
```

### 6️⃣ Descargar PDF

- Hacer click en botón **"Descargar Reporte"** (o similar)
- Se abrirá un **modal con datos del profesional**
- Llenar campos:
  - **Nombre:** Dr. Test
  - **Cédula:** 123456789
  - **Especialidad:** Psicología
  - **Diagnóstico:** Trastorno del sueño
  - **Firma:** (opcional) Test
- Hacer click **"Descargar"**
- El PDF se descargará automáticamente

### 7️⃣ Verificar PDF Descargado

**Abrir archivo:** `Reporte_Test_[timestamp].pdf` (en carpeta Descargas)

**Verificar contenido:**

✅ **Página 1:**
- Encabezado con logo (si aplica)
- Datos del paciente (nombre, fecha)
- Datos del profesional (nombre, cédula, especialidad)
- Diagnóstico

✅ **Página 1-2 (según disponibilidad de espacio):**
- **GRÁFICO:** 10 factores con barras (Paciente rojo vs Referencia verde)
  - Debe verse claro, sin cortes
  - Altura debe ser ~450px aproximadamente
  - Leyenda visible (Paciente, Referencia)

✅ **Tablas:**
- Tabla con valores de cada factor
- Interpretación de resultados

---

## ✅ Criterios de Éxito

| Criterio | Status | Nota |
|----------|--------|------|
| ✅ Gráfico renderiza en pantalla | - | 10 barras, colores claros |
| ✅ Gráfico incluido en PDF | - | Visible, sin cortes |
| ✅ Altura correcta en PDF | - | ~450px |
| ✅ Datos correctos | - | Valores paciente vs referencia coinciden |
| ✅ Tabla completa (F1-F10) | - | Todos los factores con valores |
| ✅ PDF sin errores | - | Se descarga, se abre correctamente |

---

## 🐛 Si Algo Falla

### ❌ Error: "Primero calcula los resultados"
- **Causa:** No se guardó el gráfico correctamente
- **Solución:** Recargar página (F5) e intentar de nuevo

### ❌ Error: Canvas no renderiza (gráfico en blanco)
- **Causa:** Chart.js no cargó o datos inválidos
- **Solución:** Abrir consola (`F12`) y buscar errores en rojo
- **Verificar:** Que todos los ítems del test estén llenos

### ❌ Error: PDF no incluye gráfico
- **Causa:** Canvas no fue capturado
- **Solución:** 
  1. Revisar que canvas está en página (abrir DevTools)
  2. Recalcular resultados
  3. Intentar descargar de nuevo

### ❌ Error: PDF cortado o gráfico mal posicionado
- **Causa:** Altura incorrecta o márgenes
- **Solución:** Comunicar dimensiones en screenshot

### ❌ Error: Gráfico muy pequeño en PDF
- **Causa:** Altura = 0 o 100%
- **Solución:** Verificar que textoH4.includes('TDS') funcione correctamente

---

## 🔍 Debug Mode (Para Desarrolladores)

Si necesitas ver qué está pasando:

1. **Abrir DevTools:** `F12` o `Ctrl+Shift+I`
2. **Ir a Console:** Tab "Console"
3. **Buscar logs de TDS:**
   ```javascript
   // En console, escribir:
   console.log('Gráfico renderizado');
   // O buscar en los logs existentes por "TDS"
   ```

4. **Verificar canvas:**
   ```javascript
   // En console:
   document.querySelector('canvas#chartReporte')
   // Debería retornar el elemento canvas (no null)
   ```

5. **Verificar datos:**
   ```javascript
   // En console, después de calcular:
   console.log(app.pruebaActiva.resultado)
   // Debería mostrar objeto con .factores
   ```

---

## 📊 Datos Esperados para TDS

Después de llenar 30 ítems y calcular, deberías ver:

```javascript
{
  "factores": {
    "F1": {"label": "Somnolencia", "suma": X, "media": Y},
    "F2": {"label": "Insomnio Inter", "suma": X, "media": Y},
    "F3": {"label": "Insomnio Inicial", "suma": X, "media": Y},
    "F4": {"label": "Apnea", "suma": X, "media": Y},
    "F5": {"label": "Parasomnias", "suma": X, "media": Y},
    "F6": {"label": "Sonambulismo", "suma": X, "media": Y},
    "F7": {"label": "Ronquido", "suma": X, "media": Y},
    "F8": {"label": "Inquietas", "suma": X, "media": Y},
    "F9": {"label": "Medicamentos", "suma": X, "media": Y},
    "F10": {"label": "Parálisis", "suma": X, "media": Y}
  }
}
```

---

## 📸 Screenshots para Reportar

Si algo no funciona, captura:

1. **Pantalla con gráfico visible** (después de calcular)
2. **Pantalla del PDF descargado** (mostrando gráfico)
3. **Console con cualquier error** (F12 → Console tab)

---

## 🎯 Commits Relacionados

- `6a81202` - TDS gráfico 10 factores (implementación inicial)
- `60d445a` - No reemplazar canvas (permite captura en PDF)
- `51ab03c` - Altura óptima para TDS en PDF (450px)

---

**Última actualización:** 5 de agosto 2026  
**Status:** 🚀 Listo para probar en local
