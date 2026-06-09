# ✅ Validación de Cálculos y Normas de Población Normal
## Tests: Hamilton, PCL-R, SCL-90-R, ISRA, EGEP-5/TDS

**Objetivo**: Asegurar que los cálculos sean válidos y que la comparación con población normal sea científicamente válida

**Estado**: En investigación

---

## 📋 ESTRUCTURA POR TEST

### 1️⃣ **HAMILTON DEPRESSION SCALE (HAM-D 17)**

#### A) Validación de Cálculo
**Pregunta**: ¿Es correcta la fórmula de puntuación?

```
Implementación actual en código:
- 17 items con respuestas múltiples
- Suma simple de puntuaciones
- Rango: 0-54 puntos
```

**A verificar:**
- [ ] ¿Items y puntajes coinciden con manual Hamilton 1960?
- [ ] ¿Opciones de respuesta son correctas? (algunas 0-4, otras 0-2, 0-3)
- [ ] ¿Suma simple es el método correcto?

#### B) Normas de Población Normal

**Necesario investigar:**

| Característica | Requerimiento | Estado |
|---|---|---|
| **Población normal** | Media y SD por edad/género | ❓ |
| **Puntos de corte** | Bajo (<7), Leve (7-13), Moderado (14-18), Severo (≥19) | ⚠️ Necesita validar |
| **Sensibilidad** | ¿Qué % de depresivos detecta? | ❓ |
| **Especificidad** | ¿Qué % de no-depresivos excluye? | ❓ |

**Búsqueda recomendada:**
1. Hamilton M. (1960). A rating scale for depression. J Neurol Neurosurg Psychiatry. 
2. Buscar: "HAM-D 17 normative data Mexico" o "Latin America"
3. Buscar: "Hamilton depression sensitivity specificity" en PubMed

#### C) Comparación con Población Normal

**Implementar en reportes:**
```
Paciente: Puntuación = X
Población normal media (adultos 25-65): Y ± Z
Interpretación: [X puntos por encima/debajo del promedio]
Clasificación: [Bajo/Leve/Moderado/Severo]
Contexto: El X% de población normal obtiene puntuaciones similares
```

---

### 2️⃣ **PCL-R (Psychopathy Checklist-Revised)**

#### A) Validación de Cálculo

```
Implementación actual:
- 20 items
- Puntuación 0-2 por item
- Rango total: 0-40 puntos
```

**A verificar:**
- [ ] ¿Es puntuación de 0-2 o de 0-3?
- [ ] ¿Hay items inversos?
- [ ] ¿Suma simple es correcta?

**CRÍTICO**: PCL-R es para evaluación clínica con revisor entrenado (no auto-reporte)

#### B) Normas de Población Normal

**Problema**: PCL-R originalmente diseñado para población carcelaria, NO civil

**Necesario investigar:**

| Dato | Requerimiento | Fuente |
|---|---|---|
| **Normas civiles** | ¿Existen baremos para población no-criminal? | ❓ |
| **Puntos de corte** | ¿25 para psicopatía? ¿Es válido fuera prisión? | ⚠️ |
| **Comparación válida** | ¿Puedo comparar civil vs. "población normal"? | ⚠️ CUESTIONABLE |

**Búsqueda recomendada:**
1. Hare RD. (2003). Manual for the Psychopathy Checklist-Revised
2. Buscar: "PCL-R community sample norms"
3. Buscar: "Psychopathy screening general population"

#### C) Limitación IMPORTANTE
- ⚠️ PCL-R no es válido para población civil general
- ⚠️ Requiere evaluador entrenado y acceso a historial
- **RECOMENDACIÓN**: Limitar uso a contextos forenses/carcelarios

---

### 3️⃣ **SCL-90-R (Symptom Checklist-90-Revised)**

#### A) Validación de Cálculo

```
Implementación actual:
- 90 items
- 9 dimensiones clínicas
- Puntuación 0-4 por item (Likert)
- Índices: Global Severity Index (GSI), Positive Symptom Total (PST), Positive Symptom Distress Index (PSDI)
```

**A verificar:**
- [ ] ¿Asignación de items a 9 dimensiones correcta?
- [ ] ¿Fórmulas de índices correctas?
  - GSI = suma total / 90
  - PST = número items > 0
  - PSDI = suma total / PST

#### B) Normas de Población Normal

**Necesario investigar:**

| Dimensión | Media Normal | SD | Punto Corte T-score |
|---|---|---|---|
| Somatización | ? | ? | T ≥ 63? |
| Obsesión-Compulsión | ? | ? | T ≥ 63? |
| Sensibilidad Interpersonal | ? | ? | T ≥ 63? |
| Depresión | ? | ? | T ≥ 63? |
| Ansiedad | ? | ? | T ≥ 63? |
| Hostilidad | ? | ? | T ≥ 63? |
| Ansiedad Fóbica | ? | ? | T ≥ 63? |
| Ideación Paranoide | ? | ? | T ≥ 63? |
| Psicoticismo | ? | ? | T ≥ 63? |
| **GSI** | ? | ? | T ≥ 63? |

**Búsqueda recomendada:**
1. Derogatis LR. (1994). SCL-90-R: Administration, Scoring and Procedures
2. Buscar: "SCL-90-R normative data Mexico" o "Spanish speaking"
3. Buscar: "SCL-90-R validity" en PubMed

#### C) Comparación con Población Normal

```
Paciente: GSI = 1.2
Población normal media: 0.3 ± 0.2 (T-score 50)
Interpretación: El paciente está [X desviaciones estándar] por encima del promedio
Rango clínico: GSI > 0.63 (T ≥ 63)
```

---

### 4️⃣ **ISRA (Inventario Situaciones y Respuestas de Ansiedad)**

#### A) Validación de Cálculo

```
Implementación actual:
- 22 items (versión corta)
- 3 dimensiones: Cognitiva (C), Fisiológica (F), Motora (M)
- Puntuación 0-4 por item (Likert)
- Rango: 0-88 por dimensión
```

**A verificar:**
- [ ] ¿Distribución de items a 3 dimensiones correcta?
  - C: Cognitiva (pensamientos ansiosos)
  - F: Fisiológica (síntomas corporales)
  - M: Motora (conductas de evitación)
- [ ] ¿Items y puntajes coinciden con manual Tobal & Cano?

#### B) Normas de Población Normal (España/Latinoamérica)

**Necesario investigar:**

| Dimensión | Media Normal | SD | Interpretación |
|---|---|---|---|
| Cognitiva | ? | ? | Normal/Leve/Moderada/Severa |
| Fisiológica | ? | ? | Normal/Leve/Moderada/Severa |
| Motora | ? | ? | Normal/Leve/Moderada/Severa |
| **Total** | ? | ? | Nivel de ansiedad |

**Problema**: ISRA es de 1986 España, ¿válido para México 2026?

**Búsqueda recomendada:**
1. Tobal JM & Cano-Vindel A. (1986). ISRA - Inventario de Situaciones y Respuestas de Ansiedad
2. Buscar: "ISRA norms Mexico" o "ISRA Latin America"
3. Buscar: "ISRA validity reliability" estudios recientes

#### C) Comparación con Población Normal

```
Paciente: Cognitiva = 35, Fisiológica = 28, Motora = 22
Población normal: Cognitiva = 18 ± 8, Fisiológica = 15 ± 7, Motora = 12 ± 6
Interpretación: Ansiedad [moderada/severa] en dimensión cognitiva
Contexto: El paciente está en percentil [X] comparado con población general
```

---

### 5️⃣ **EGEP-5 / TDS (Especificar instrumento exacto)**

#### REQUIERE ACLARACIÓN
- [ ] ¿Nombre completo del instrumento?
- [ ] ¿Autor y año?
- [ ] ¿En qué contexto se usa (depresión, trastornos del sueño, otro)?
- [ ] ¿Cuántos items?
- [ ] ¿Escala de respuesta?

**Una vez aclarado, aplicar mismo protocolo:** Validación cálculo + Normas + Comparación

---

## 📊 TABLA MAESTRA DE VALIDACIÓN

| Test | Cálculo ¿OK? | Normas Disponibles? | Punto Corte Clínico | Población Normal (Media ± SD) | Prioridad |
|------|:---:|:---:|:---:|:---:|:---:|
| **Hamilton** | ⚠️ Verificar | ❓ Buscar | Bajo/Leve/Mod/Severo | Media=? SD=? | 🟡 MEDIA |
| **PCL-R** | ⚠️ Verificar | ⚠️ Limitado (carcelario) | 25+ psicopatía | NO APLICA (población civil) | 🔴 CRÍTICA |
| **SCL-90-R** | ⚠️ Verificar | ❓ Buscar normas MX | GSI > 0.63 (T≥63) | GSI: 0.3 ± 0.2 | 🟡 MEDIA |
| **ISRA** | ⚠️ Verificar | ⚠️ España 1986 | Percentiles | Cogn: 18±8, Fisio: 15±7, Moto: 12±6 | 🟡 MEDIA |
| **EGEP-5** | ❓ | ❓ | ❓ | ❓ | 🟡 MEDIA |

---

## 🔍 ACCIONES ESPECÍFICAS INMEDIATAS

### Para Hamilton:
1. [ ] Verificar items 1-17 en código vs. manual original
2. [ ] Confirmar opciones de respuesta (algunos 0-2, otros 0-4)
3. [ ] Buscar: "HAM-D 17 normative sample" en Google Scholar
4. [ ] Documentar: Media, SD, puntos de corte

### Para SCL-90-R:
1. [ ] Verificar 90 items en código vs. manual Derogatis
2. [ ] Confirmar 9 dimensiones y su composición
3. [ ] Buscar: "SCL-90-R norms Mexico" o "Spanish population"
4. [ ] Documentar: Medias por dimensión, T-scores

### Para ISRA:
1. [ ] Verificar 22 items en código vs. manual Tobal
2. [ ] Confirmar 3 dimensiones (C, F, M)
3. [ ] Buscar: "ISRA normative data" + país
4. [ ] Documentar: Baremos más recientes si existen

### Para PCL-R:
1. [ ] ⚠️ ADVERTENCIA: Está diseñado para carcelarios, NO civil
2. [ ] Limitar uso a contextos forenses
3. [ ] Agregar disclaimer claro en reportes

### Para EGEP-5:
1. [ ] Aclarar qué es este instrumento
2. [ ] Buscar documentación original
3. [ ] Aplicar protocolo igual a los demás

---

## 📝 FORMATO ESTÁNDAR DE VALIDACIÓN POR TEST

Cuando investigue, documente así:

```markdown
### [Nombre Test]

**Fuente Original:**
- Autor: [Nombre, Apellido]
- Año: [YYYY]
- Publicación: [Revista/Editorial]
- DOI: [si existe]

**Población de Normalización:**
- N = [tamaño muestra]
- Edad: [rango]
- Género: [distribución]
- País/Región: [ubicación]
- Contexto: [clínico/general/específico]

**Baremos (Población Normal):**
| Medida | Media | SD | N |
|--------|-------|-----|---|
| [Escala 1] | [X] | [Y] | [Z] |

**Puntos de Corte Clínicos:**
- Normal: [rango]
- Leve: [rango]
- Moderado: [rango]
- Severo: [rango]

**Confiabilidad:**
- Alfa Cronbach: [valor]
- Test-Retest: [valor] (intervalo: [X días/semanas])

**Validez:**
- Sensibilidad: [X%]
- Especificidad: [Y%]
- Validez concurrente: [correlación]

**Comparación con Implementación:**
- ¿Items coinciden? [Sí/No/Parcial]
- ¿Cálculos correctos? [Sí/No/Parcial]
- ¿Normas disponibles? [Sí/No/Parcial]
- Discrepancias encontradas: [listar]

**Limitaciones Documentadas:**
- [Limitación 1]
- [Limitación 2]
```

---

## 🎯 META FINAL

Para cada test, al final debería tener:

✅ Cálculos verificados vs. manual original  
✅ Normas de población normal documentadas  
✅ Puntos de corte clínicos establecidos  
✅ Baremos para comparación válida  
✅ Disclaimers de validez según contexto  

Esto permite reportes confiables con comparación científica vs. "persona normal".

