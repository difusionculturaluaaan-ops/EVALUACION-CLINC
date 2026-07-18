# 📋 Pendientes EGEP-5

**Última actualización:** 18/07/2026  
**Estado:** En Desarrollo

---

## ✅ Completado

- [x] Tab 1: Ingreso de Datos (Datos del paciente)
- [x] Tab 2: Aplicar Test (58 ítems completos)
- [x] Tab 3: Resultados (DSM-5, criterios, síntomas, funcionamiento, baremos)
- [x] JSON Export (exportar respuestas a archivo)
- [x] JSON Import (importar respuestas desde archivo)
- [x] Botón "Guardar en Expediente"
- [x] Aislamiento verificado (no rompe otros tests)

## 🔴 Por Hacer

### Alta Prioridad (Para Mañana)

#### 1. Tab 4: Perfil Visual (Gráfico)
**Descripción:** Visualización de barras con baremos
- [ ] Gráfico con 5 escalas (I, E, C, A, Total)
- [ ] Mostrar puntuación paciente vs referencia
- [ ] Percentiles en baremos
- [ ] Similar a MMPI-2 RF
**Estimado:** 4-6 horas

#### 2. Tab 5: Interpretación (Narrativa)
**Descripción:** Análisis clínico automático
- [ ] Generar texto interpretativo basado en criterios DSM-5
- [ ] Sugerencias clínicas por cada criterio
- [ ] Información de especificaciones (despersonalización, etc)
**Estimado:** 3-4 horas

#### 3. Revisar encoding UTF-8 en JSON
**Problema:** Caracteres rotos en JSON exportado
- "espaÃ±a_2024" debería ser "españa_2024"
- "ClÃ­nica" debería ser "Clínica"
**Ubicación:** `exportarJSON()` línea 1018-1020
**Estimado:** 1-2 horas

### Media Prioridad (Semana siguiente)

#### 4. PDF Completo (Hoja de Corrección)
- [ ] Incluir gráfico de barres
- [ ] Tabla con criterios A-G
- [ ] Interpretación clínica
- [ ] Firmas/sello clínico
**Estimado:** 6-8 horas

#### 5. Tests E2E Automatizados
- [ ] Playwright: Completar test completo
- [ ] Exportar JSON
- [ ] Importar JSON
- [ ] Verificar que coincidan datos
**Estimado:** 3-4 horas

#### 6. Mobile Responsiveness
- [ ] Verificar en dispositivos pequeños
- [ ] Tablas scrollables en móvil
- [ ] Gráficos adaptables
**Estimado:** 2-3 horas

### Baja Prioridad (Roadmap futuro)

#### 7. Baremos Actualizados
- [ ] Validar con datos de población española 2024
- [ ] Revisar percentiles
- [ ] Documentar fuentes
**Estimado:** 5-6 horas

#### 8. Validaciones Avanzadas
- [ ] Alertas si respuesta es inconsistente
- [ ] Sugerir revisión si muchos ítems sin responder
- [ ] Validar que todos los criterios tengan mínimo de ítems
**Estimado:** 2-3 horas

---

## 🐛 Bugs Conocidos

### Encoding UTF-8 (No Crítico)
```
Síntoma: JSON export tiene caracteres rotos
Ejemplo: "espaÃ±a" en lugar de "españa"
Severidad: Baja (no afecta funcionalidad)
Reportado: 18/07/2026
```

---

## 📊 Estadísticas

| Sección | Items | Estado |
|---------|-------|--------|
| Datos Paciente | 6 campos | ✅ Completo |
| Eventos (1-11) | 11 items | ✅ Completo |
| Síntomas (27-49) | 23 items | ✅ Completo |
| Funcionamiento (52-58) | 7 items | ✅ Completo |
| **Total** | **58 items** | **✅ Completo** |

---

## 🔗 Referencias

- [[sesion_egep5_json_18072026]] - Detalles de bugs arreglados hoy
- [[proyecto_clinica]] - Contexto del proyecto
- [[arquitectura_multitenant_completa]] - Estructura de datos

---

## ⏱️ Timeline Propuesto

```
Viernes 18/07   - Completar JSON import ✅ (Hecho)
Sábado 19/07    - Tab 4 (Gráfico) + Tab 5 (Interpretación)
Domingo 20/07   - PDF completo + Tests E2E
Próx. semana    - Mobile + Validaciones + Baremos
```

**Contacto:** Usuario  
**Proyecto:** EGEP-5 (Evaluación Clínica Psicológica Pro)
