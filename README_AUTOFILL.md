# 🤖 EGEP-5 Auto-Fill - Guía de Uso

## Opciones de Auto-Llenado

Tienes **3 formas** de auto-llenar el EGEP-5:

---

## 1️⃣ Script Python (Selenium)

### ✨ Ventajas
- ✅ Automatización completa del navegador
- ✅ Controlable desde Python
- ✅ Puede ejecutarse en modo headless
- ✅ Captura pantallas automáticamente

### 📦 Instalación

```bash
# Instalar dependencias
pip install selenium

# Descargar ChromeDriver desde:
# https://chromedriver.chromium.org/
# (Debe coincidir con tu versión de Chrome)
```

### 🚀 Uso

```bash
# Ejecución normal (con interfaz)
python egep5_autofill.py

# Ejecución headless (sin interfaz)
python egep5_autofill.py --headless
```

### 📝 Código Ejemplo

```python
from egep5_autofill import EGEP5AutoFill

# Crear instancia
autofill = EGEP5AutoFill(
    url="http://localhost:3000/micrositios/egep5/",
    headless=False
)

# Ejecutar flujo completo
autofill.run_complete_flow()
```

---

## 2️⃣ JSON de Datos Pre-Cargados

### ✨ Ventajas
- ✅ Formato limpio y legible
- ✅ Fácil de personalizar
- ✅ Importable directamente en EGEP-5
- ✅ Reutilizable para múltiples pacientes

### 📄 Estructura

```json
{
  "paciente": {
    "nombre": "Juan Pérez García",
    "fecha": "2026-07-22",
    "edad": "35",
    "sexo": "Varón",
    "centro": "Clínica Centro Psicológico",
    "evaluador": "Dr. Luis Martínez",
    "evento": "Descripción del evento traumático"
  },
  "respuestas": {
    "event_type": { "1": "me" },
    "items_27_31": [3, 3, 3, 3, 3],
    "items_32_33": [2, 2],
    "items_34_40": [2, 2, 2, 2, 2, 2, 2],
    "items_41_46": [3, 3, 3, 3, 3, 3],
    "items_47_49": [1, 1, 1],
    "items_52_58": [1, 1, 1, 1, 0, 0, 0]
  }
}
```

### 🔧 Cómo Usar en EGEP-5

1. Abre EGEP-5 en el navegador
2. Ve a Tab 1 (Ingreso de Datos)
3. Clickea el botón **"Importar JSON"**
4. Selecciona el archivo `egep5_datos_completos.json`
5. Los datos se cargarán automáticamente
6. Ve a Tab 2 y clickea "Calcular Resultados"

### ✏️ Personalizar JSON

Edita el archivo JSON con tus datos:

```json
{
  "paciente": {
    "nombre": "TU NOMBRE",
    "edad": "TU EDAD",
    ...
  }
}
```

**Guía de valores para síntomas (0-4):**
- `0`: Ninguna molestia
- `1`: Leve
- `2`: Moderada
- `3`: Grave
- `4`: Extrema

---

## 3️⃣ Script Playwright (Node.js)

### ✨ Ventajas
- ✅ Más rápido que Selenium
- ✅ Captura screenshots automáticamente
- ✅ Funciona con cualquier navegador

### 📦 Instalación

```bash
# Instalar Node.js si no lo tienes
# Luego:
npm install playwright
```

### 🚀 Uso

```bash
node egep5-complete-test.js
```

Las screenshots se guardarán en `egep5-screenshots/`

---

## 📋 Resumen Rápido

| Método | Tipo | Uso | Velocidad |
|--------|------|-----|-----------|
| Python (Selenium) | Automatización | Scripts largos, integración | Lento |
| JSON | Importar datos | Llenado rápido en UI | Instantáneo |
| Playwright (Node.js) | Automatización + Screenshots | Testing, documentación | Medio |

---

## 🎯 Mi Recomendación

### Para testing rápido:
👉 Usa **JSON** - Importa en 5 segundos

### Para automatización completa:
👉 Usa **Python (Selenium)** - Control total

### Para documentación visual:
👉 Usa **Playwright (Node.js)** - Con screenshots

---

## 📚 Ejemplos de Uso

### Ejemplo 1: Auto-llenar con Python

```python
from egep5_autofill import EGEP5AutoFill

# Crear instancia
auto = EGEP5AutoFill(url="http://localhost:3000/micrositios/egep5/")

# Ejecutar
auto.run_complete_flow()
```

### Ejemplo 2: Importar JSON en EGEP-5

1. Abre EGEP-5
2. Click en "Importar JSON" (Tab 1)
3. Selecciona `egep5_datos_completos.json`
4. Automáticamente se llenan todos los campos
5. Click en "Calcular Resultados"

### Ejemplo 3: Personalizar JSON para nuevo paciente

```bash
# 1. Copia el JSON
cp egep5_datos_completos.json egep5_paciente_nuevo.json

# 2. Edita con tu editor favorito
nano egep5_paciente_nuevo.json

# 3. Cambia los valores
# - nombre
# - edad
# - evento
# - respuestas
# - etc.

# 4. Importa en EGEP-5 como en Ejemplo 2
```

---

## ⚠️ Notas Importantes

- El **JSON** solo funciona si tienes el botón "Importar JSON" visible
- El **Python script** requiere ChromeDriver compatible con tu Chrome
- El **Playwright** script requiere Node.js instalado
- Todos los scripts asumen que EGEP-5 está en `http://localhost:3000`

---

## 🐛 Troubleshooting

### Error: "ChromeDriver no encontrado"
```bash
# Descarga ChromeDriver que coincida con tu versión de Chrome
# https://chromedriver.chromium.org/
# Ponlo en tu PATH o en el mismo directorio
```

### Error: "EGEP-5 no se carga"
```bash
# Verifica que el servidor está corriendo
# Abre en navegador: http://localhost:3000
```

### Error: "Importar JSON no funciona"
```bash
# Asegúrate que estés en Tab 1 (Ingreso de Datos)
# El botón debe aparecer en la sección de "Progreso"
```

---

## 📞 Soporte

Si tienes problemas:
1. Verifica que EGEP-5 esté corriendo en localhost:3000
2. Revisa la consola del navegador (F12)
3. Revisa los logs del script Python/Node

---

**Última actualización:** 2026-07-22
**Versión:** 1.0
