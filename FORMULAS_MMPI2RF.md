# 📐 FÓRMULAS Y CÁLCULOS MMPI-2-RF

## 📋 Estructura de Respuestas

### Entrada de Datos (INGRESO DE DATOS)
- **338 items** totales
- **Patrón de 4 columnas** por cada 9 items:
  - `[ITEM#]` | `[R]` | `[V]` | `[F]`
  
Donde:
- `ITEM#` = Número del ítem (1-338)
- `R` = Respuesta (V=Verdadero, F=Falso)
- `V` = 1 si Verdadero, 0 si Falso
- `F` = 1 si Falso, 0 si Verdadero

### Ejemplo:
```
ITEM | R | V | F | ITEM | R | V | F | ...
  1  | F | 0 | 1 |  37  | V | 1 | 0 | ...
  2  | V | 1 | 0 |  38  | V | 1 | 0 | ...
```

---

## 🔢 Fórmulas Base (Excel → JavaScript)

### 1️⃣ Conversión V/F a 1/0
**Excel:**
```excel
=IF(AL3="V","1","0")
=IF(AL3="F","1","0")
```

**JavaScript:**
```javascript
const convertirRespuesta = (respuesta) => {
  return respuesta === 'V' ? 1 : 0;
};
```

### 2️⃣ Cálculo de Raw Score
**Patrón:** Suma de items específicos para cada escala

**Excel:**
```excel
=K23+O14+S22+AA37+AM12
```

Cada escala tiene sus propios items que se suman.

**JavaScript:**
```javascript
const calcularRawScore = (respuestas, itemsEscala) => {
  return itemsEscala.reduce((sum, itemIdx) => {
    return sum + (respuestas[itemIdx] || 0);
  }, 0);
};
```

### 3️⃣ Conversión Raw Score a T-Score
**Excel (ejemplo):**
```excel
=IF(AR7=0,32,IF(AR7=1,37,IF(AR7=2,42,IF(AR7=3,46,IF(AR7=4,51,IF(AR7=5,56,IF(AR7=6,61,IF(AR7=7,65,IF(AR7=8,70,IF(AR7=9,75,IF(AR7=10,79,IF(AR7=11,84,IF(AR7=12,89))))))))))))
```

Este es un **mapeo de Raw Score → T-Score** para una escala específica.

**JavaScript:**
```javascript
// Tabla de conversión Raw → T-Score
const tablaConversion = {
  RCd: {  // Escala Depresión
    0: 32,
    1: 37,
    2: 42,
    3: 46,
    4: 51,
    5: 56,
    6: 61,
    7: 65,
    8: 70,
    9: 75,
    10: 79,
    11: 84,
    12: 89
  },
  RC1: { ... },  // Otras escalas
  // ...
};

const obtenerTScore = (escala, rawScore) => {
  return tablaConversion[escala]?.[rawScore] || 50;
};
```

---

## 🎯 Escalas del MMPI-2-RF

### Escalas de Validez
| Escala | Nombre | Items | Raw Min | Raw Max |
|--------|--------|-------|---------|---------|
| CNS | Inconsistencia Contenido | ? | 0 | ? |
| VRIN-r | Respuestas Inconsistentes Variables | ? | 0 | ? |
| TRIN-r | Respuestas Inconsistentes Verdaderas | ? | 0 | ? |
| F-r | Escala F Reestructurada | ? | 0 | ? |
| Fp-r | Escala Fp Reestructurada | ? | 0 | ? |

### Escalas Clínicas (Restructured Clinical, RC)
| Escala | Nombre | Items | Raw Min | Raw Max | T-Score Range |
|--------|--------|-------|---------|---------|---|
| RCd | Depresión | ? | 0 | 12+ | 32-89 |
| RC1 | Quejas Somáticas | ? | 0 | ? | ? |
| RC2 | Baja Energía | ? | 0 | ? | ? |
| RC3 | Disfunción Cognitiva | ? | 0 | ? | ? |
| RC4 | Problemas de Conducta | ? | 0 | ? | ? |
| RC6 | Ideas Persecutorias | ? | 0 | ? | ? |
| RC7 | Disfunción Somática | ? | 0 | ? | ? |
| RC8 | Incapacidad Concentración | ? | 0 | ? | ? |
| RC9 | Hipomanía | ? | 0 | ? | ? |

---

## 📊 Proceso de Cálculo (Algoritmo)

```
1. ENTRADA
   - 338 respuestas (V/F)
   - Datos del paciente

2. PROCESAMIENTO
   a) Convertir V/F a 1/0 para cada respuesta
   b) Calcular raw score para cada escala
      - Sumar items específicos según tabla de escalas
   c) Convertir raw score a T-score
      - Usar tabla de conversión por escala
   d) Validar respuestas (índices de validez)
   e) Generar interpretaciones

3. SALIDA
   - Perfil de T-scores (20+ escalas)
   - Índices de validez
   - Interpretación clínica
   - Gráfico de perfil
```

---

## 🔍 Datos Faltantes a Documentar

Necesito extraer del Excel:

1. **✓ Estructura de respuestas** - DONE
2. **✗ Mapeo completo de items → escalas**
   - Qué items se suman para cada escala
3. **✗ Tablas de conversión Raw → T-Score**
   - Para CADA escala (RCd, RC1, RC2, etc.)
4. **✗ Fórmulas de índices de validez**
   - Cómo se calculan CNS, VRIN-r, TRIN-r, etc.
5. **✗ Reglas de interpretación**
   - Rangos de T-score para cada severidad
6. **✗ Precauciones y notas especiales**
   - Limitaciones en el cálculo
   - Consideraciones clínicas

---

## 🔗 Siguientes Pasos

**PASO 1 (COMPLETAR):** Extraer estas tablas del Excel
- [ ] Identificar exactamente qué items son para cada escala
- [ ] Documentar todas las tablas T-score
- [ ] Extraer reglas de interpretación

**PASO 2:** Codificar módulo JavaScript
- [ ] Crear estructura de datos con escalas
- [ ] Implementar funciones de cálculo
- [ ] Generar reportes

**PASO 3:** Testing y Validación
- [ ] Comparar con ejemplos del Excel
- [ ] Validar contra estándares MMPI-2-RF

