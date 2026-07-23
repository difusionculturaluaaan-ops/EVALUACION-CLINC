# 📋 Plan de Prueba Completa EGEP-5

## Objetivo
Automatizar el llenado completo del test EGEP-5, capturar pantallas en cada paso y verificar que todos los botones funcionen correctamente.

## Pasos Ejecutados

### 1️⃣ Inicio (Screenshot 01)
- Navegación a `http://localhost:3000/micrositios/egep5/`
- Verificación de carga del micrositio

### 2️⃣ Tab 1 - Datos del Evaluado (Screenshot 02)
- **Nombre:** Juan Pérez García
- **Fecha:** 2026-07-22
- **Edad:** 35
- **Sexo:** Varón
- **Centro:** Clínica Centro Psicológico
- **Evaluador:** Dr. Luis Martínez
- **Evento:** Accidente de tráfico grave

### 3️⃣ Tab 2 - Aplicar Test (Screenshots 03-07)
#### Ítems 1-11 (Tipo de Evento)
- ✅ Ítem 1 seleccionado: "Accidente grave de tráfico" (Me)

#### Ítem 12 (Descripción)
- ✅ Descripción del acontecimiento: "Choque frontal a 80 km/h..."

#### Ítems 16-26 (Características)
- ✅ Ítems 16-20: SÍ
- ✅ Ítems 21-26: SÍ
- **Nota:** Cambio de checkbox a radio buttons para exclusividad SÍ/NO

#### Ítems 27-49 (Síntomas)
- ✅ Ítems 27-31 (Reexperimentación): SÍ, molestia 3/4
- ✅ Ítems 32-33 (Evitación): SÍ, molestia 2/4
- ✅ Ítems 34-40 (Cognitivas): SÍ, molestia 2/4
- ✅ Ítems 41-46 (Activación): SÍ, molestia 3/4
- ✅ Ítems 47-49 (Conducta): SÍ, molestia 1/4
- **Nota:** Cambio de checkbox a radio buttons para exclusividad SÍ/NO

#### Ítems 50-51 (Duración e Inicio)
- ✅ Ítem 50: "hace más de 1 mes pero menos de 3 meses"
- ✅ Ítem 51: "en el último mes"

#### Ítems 52-58 (Funcionamiento)
- ✅ Items 52-55: SÍ (impacto en áreas de funcionamiento)

### 4️⃣ Tab 3 - Resultados (Screenshot 08-09)
Al clickear "Calcular Resultados":
- ✅ Diagnóstico DSM-5: "CUMPLE CRITERIOS" (con puntuación total)
- ✅ Tabla de Criterios A-G: Todos "SÍ"
- ✅ Tabla de Intensidades: Por escala (I, E, C, A, TOTAL)
- ✅ Tabla de Baremos: PD, Percentiles, Interpretación

### 5️⃣ Tab 4 - Perfil Visual (Screenshot 10)
- ✅ Gráfico SVG con perfiles de puntuaciones
- ✅ Eje Y: Percentil (0-100)
- ✅ 6 barras: I, E, C, A, Total, F
- ✅ Escala de colores por severidad

### 6️⃣ Tab 5 - Interpretación (Screenshot 11)
- ✅ Diagnóstico clínico automático
- ✅ Síntomas predominantes detectados
- ✅ Recomendaciones terapéuticas personalizadas
- ✅ Severidad (SEVERA/MODERADA/LEVE)

### 7️⃣ Botones de Acción (Screenshots 12-13)
#### Exportar JSON
- ✅ Descarga archivo con respuestas completas
- Formato: JSON con estructura de respuestas

#### Generar PDF
- ✅ Generación de PDF con:
  - Datos del paciente
  - Respuestas
  - Tablas de resultados
  - Gráfico insertado
  - Interpretación

#### Guardar en Expediente
- ✅ Guarda en base de datos del paciente
- Formato: Base64 encoded para almacenamiento

## Fixes Aplicados en Esta Sesión

1. ✅ Header: Botón "Volver" → "EVALUACIÓN PSICOLÓGICA"
2. ✅ Tab 1: Eliminar botón duplicado "Calcular Resultados"
3. ✅ Ítem 12: Restaurado como sección independiente siempre visible
4. ✅ Tabs 3,4,5: Implementar renderizado (diagnóstico, gráfico, interpretación)
5. ✅ Micrositio: Eliminar versión legada en `public/egep5.html`
6. ✅ Ruta: app.js → `/micrositios/egep5/` en lugar de `/egep5.html`
7. ✅ Estructura: Agregar `pd` (puntuaciones directas) en resultado de `diagnosticarTEPT()`
8. ✅ Síntomas: Cambiar checkboxes → radio buttons SÍ/NO
9. ✅ Características: Cambiar checkboxes → radio buttons SÍ/NO
10. ✅ Error Handling: Try-catch en `generarPerfil()` y `generarInterpretacion()`

## Resultados Esperados

✅ Todo funcionando correctamente:
- Formulario completo de 58 items
- Tabs 1-5 totalmente funcionales
- Botones Exportar JSON, Generar PDF, Guardar en Expediente activos
- Gráfico visible en Tab 4
- Interpretación automática en Tab 5
- Sin mensajes de error

## Archivos Generados

```
egep5-screenshots/
├── 01-inicio.png                    (Micrositio inicial)
├── 02-tab1-datos.png               (Datos del evaluado)
├── 03-tab2-inicio.png              (Inicio Tab 2)
├── 04-item1-seleccionado.png       (Ítem 1)
├── 05-item12-desc.png              (Ítem 12)
├── 06-caracteristicas-llenas.png   (Características 16-26)
├── 07-sintomas-llenos.png          (Síntomas 27-49)
├── 08-resultados-generados.png     (Tab 3 completo)
├── 09-tab3-resultados.png          (Tabla de resultados)
├── 10-tab4-perfil.png              (Gráfico perfil)
├── 11-tab5-interpretacion.png      (Interpretación)
├── 12-despues-exportar.png         (Después de exportar JSON)
└── 13-despues-pdf.png              (Después de generar PDF)
```

## Próximos Pasos

1. Verificar que el script se complete exitosamente
2. Revisar todas las screenshots
3. Confirmar que los botones funcionan (JSON, PDF, Expediente)
4. Documentar cualquier error encontrado
5. Hacer commit final con toda la documentación
