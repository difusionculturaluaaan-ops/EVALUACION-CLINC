# 📋 PENDIENTES - VALIDACIÓN CIENTÍFICA DE TESTS
**Fecha creación**: 2026-06-08  
**Status**: Pendiente para sesión 2026-06-09  
**Prioridad**: 🔴 CRÍTICA

---

## 🔴 CRÍTICOS - RESOLVER INMEDIATAMENTE

### 1. **PCL-R - LIMITACIÓN DOCUMENTADA**
**Hallazgo**: NO es válido para población civil general
- ❌ Diseñado para contextos carcelarios/forenses
- ❌ Confiabilidad cae por debajo de 0.70 en contextos no-forenses
- ❌ No validado para población mexicana

**Acción requerida**:
- [ ] **LIMITAR uso a contexto forense ÚNICAMENTE**
- [ ] Agregar disclaimer claro en reportes
- [ ] Considerar alternativa: MMPI-2-RF, PAI, o PPI para población civil

**Documento**: INVESTIGACION_HALLAZGOS_TESTS.md (Sección 4)

---

### 2. **TDS - ACLARACIÓN URGENTE**
**Problema**: Sistema tiene "TDS" pero existen múltiples instrumentos:
- Cuestionario Trastornos Sueño Monterrey (mexicano)
- Sleep Disorders Questionnaire - SDQ (45 items)
- COS - Cuestionario Ocho Sueño (DSM-IV/ICD-10)

**Acción requerida**:
- [ ] **Identificar EXACTAMENTE cuál TDS está implementado**
- [ ] Cuántos items tiene
- [ ] Cuál es la población de normalización
- [ ] De dónde vienen los parámetros

**Documento**: INVESTIGACION_HALLAZGOS_TESTS.md (Sección 6)

---

## 🟡 MEDIA PRIORIDAD - INVESTIGACIÓN PENDIENTE

### 3. **HAMILTON (HAM-D-17)**

**Hallazgos**:
- ✅ Puntos de corte estándar (FDA): 0-7 / 8-16 / 17-23 / ≥24
- ⚠️ Debate reciente: Algunos proponen cortes más bajos (≤4, ≤5)
- ❌ Sin baremos mexicanos encontrados

**Acciones**:
- [ ] Investigar baremos mexicanos (si existen)
- [ ] Si no existen, usar españoles como referencia
- [ ] Decidir: ¿Usar cortes FDA estándar o alternativos?
- [ ] Documentar en reportes

**Documento**: INVESTIGACION_HALLAZGOS_TESTS.md (Sección 1)

---

### 4. **SCL-90-R**

**Hallazgos**:
- ✅ 9 dimensiones validadas
- ⚠️ **Población mexicana puntúa SIGNIFICATIVAMENTE MÁS ALTA que Argentina**
- ⚠️ Baremos españoles disponibles pero pueden no ser directamente aplicables
- ❌ Normas mexicanas específicas no encontradas

**Acciones**:
- [ ] Investigar normas mexicanas actuales
- [ ] Si no existen: ¿crear propias o usar españolas?
- [ ] Documentar comparación: Paciente vs Población Normal (especificar cuál)
- [ ] En reportes: Clarificar población de referencia

**Documento**: INVESTIGACION_HALLAZGOS_TESTS.md (Sección 2)

---

### 5. **ISRA (Inventario Situaciones Respuestas Ansiedad)**

**Hallazgos**:
- ✅ Estructura confirmada: 24 respuestas (7 cog, 10 fisio, 7 motor)
- ✅ Propiedades psicométricas: Alfa alto, test-retest adecuado
- ⚠️ Instrumento de 1986 (España)
- ❌ Baremos no encontrados en búsqueda web

**Acciones**:
- [ ] Investigar baremos españoles originales (1986 Tobal & Cano)
- [ ] Buscar validación en República Dominicana (existe estudio)
- [ ] Buscar normas latinoamericanas más recientes
- [ ] Si no existen para México: crear o usar como referencia

**Documento**: INVESTIGACION_HALLAZGOS_TESTS.md (Sección 3)

---

### 6. **EGEP-5 (Estrés Postraumático)**

**Hallazgos**:
- ✅ **ES PTSD** (no depresión, no sueño)
- ✅ Propiedades sólidas: α=0.92, Sensibilidad 91%, Especificidad 75%
- ❌ Baremos de población normal no encontrados

**Acciones**:
- [ ] Investigar puntos de corte clínicos para PTSD
- [ ] Buscar baremos españoles o latinoamericanos
- [ ] Documentar población normal de referencia
- [ ] Aclarar: ¿Para qué contexto se usa en sistema? (clínico, forense, ambos)

**Documento**: INVESTIGACION_HALLAZGOS_TESTS.md (Sección 5)

---

## 📌 CRÍTICOS A LARGO PLAZO - MMPI Y CUIDA

**Estado**: Pendientes (derechos comprados, documentación en Excel)

### MMPI-2-RF
- [ ] Localizar documentación de licencia/derechos
- [ ] Verificar baremos incluidos en compra
- [ ] Validar T-scores vs manual Pearson
- [ ] Comparación con población normal

### CUIDA
- [ ] Localizar documentación de licencia/derechos
- [ ] Verificar eneatipos y baremos
- [ ] **Validación jurídica** (custodia/adopción)
- [ ] Comparación con población normal

**Documento**: VALIDACION_CIENTIFICA_REQUERIDA.md

---

## 📁 DOCUMENTOS GENERADOS

1. **VALIDACION_CIENTIFICA_REQUERIDA.md** (409 líneas)
   - Checklist completo para MMPI y CUIDA
   - 7 tests analizados
   - Estrategia de investigación en 3 fases

2. **VALIDACION_CALCULOS_Y_NORMAS.md** (321 líneas)
   - Validación de cálculos por test
   - Normas de población normal requeridas
   - Acciones específicas inmediatas
   - Formato estándar de documentación

3. **INVESTIGACION_HALLAZGOS_TESTS.md** (323 líneas)
   - 6 tests investigados
   - Resultados de búsqueda científica
   - Tabla resumen
   - Fuentes consultadas

---

## 🎯 PLAN PARA MAÑANA (2026-06-09)

### Sesión 1: Presentación de hallazgos (20 min)
- [ ] Revisar INVESTIGACION_HALLAZGOS_TESTS.md
- [ ] Discutir hallazgos críticos (PCL-R, TDS)
- [ ] Priorizar acciones

### Sesión 2: Decisiones sobre implementación (30 min)
- [ ] Decidir sobre PCL-R: ¿Mantener o limitar?
- [ ] Aclarar qué es TDS exactamente
- [ ] Qué población de referencia usar para cada test
- [ ] Qué disclaimers agregar a reportes

### Sesión 3: Acción - Actualizar código (30-60 min)
- [ ] Agregar disclaimers en reportes
- [ ] Actualizar comparaciones con población normal
- [ ] Documentar en código fuentes de baremos

---

## 📊 RESUMEN ESTADO ACTUAL

| Test | ¿Implementado? | ¿Validado? | ¿Cálculos OK? | ¿Normas OK? | Acción Crítica |
|------|:---:|:---:|:---:|:---:|---|
| Hamilton | ✅ | ⚠️ | ✅ | ❌ | Buscar normas MX |
| SCL-90-R | ✅ | ⚠️ | ✅ | ⚠️ | Validar normas MX |
| ISRA | ✅ | ⚠️ | ✅ | ❌ | Buscar/crear baremos |
| PCL-R | ✅ | ❌ | ✅ | ⚠️ | **LIMITAR A FORENSE** |
| EGEP-5 | ✅ | ⚠️ | ✅ | ❌ | Investigar puntos corte |
| TDS | ✅ | ❓ | ❓ | ❓ | **ACLARAR CUÁL ES** |
| MMPI-2-RF | ✅ | ❌ | ❓ | ❓ | Obtener documentación |
| CUIDA | ✅ | ❌ | ❓ | ❓ | Obtener documentación |

---

## 📞 PREGUNTAS PARA MAÑANA

1. **¿Cuál es exactamente el TDS implementado?**
2. **¿Tienes la documentación de derechos de MMPI-2-RF y CUIDA?**
3. **¿PCL-R se limita a forense o también se usa clínico?**
4. **¿Qué población de referencia prefieres para comparación?**
   - Españolas (más disponibles)
   - Mexicanas (más representativas pero menos documentadas)
   - Propias (crear baremos)

---

**Siguiente sesión**: 2026-06-09  
**Duración estimada**: 60-90 minutos  
**Objetivo**: Decisiones ejecutables + Actualización de código

