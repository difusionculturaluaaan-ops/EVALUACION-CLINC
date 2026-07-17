# Campos Pendientes para Usar Después

## Duración e Inicio de Síntomas

Estos campos fueron removidos de Tab 2 (Sección 1) para usarlos en una fase posterior:

```html
<!-- Duración de síntomas e Inicio de síntomas -->
<div class="form-row">
  <div class="form-group">
    <label>Duración de síntomas</label>
    <select id="symptom_duration">
      <option value="">–</option>
      <option>Menos de 1 mes</option>
      <option>1 a 3 meses</option>
      <option>Más de 3 meses</option>
    </select>
  </div>
  <div class="form-group">
    <label>Inicio de síntomas</label>
    <select id="symptom_onset">
      <option value="">–</option>
      <option>Inmediato</option>
      <option>Primeros 6 meses</option>
      <option>Después de 6 meses</option>
    </select>
  </div>
</div>
```

**Ubicación sugerida**: Sección 3 de síntomas o en un Tab separado de características adicionales.

**Funciones JS asociadas**:
- `cambiarItem13()` - Gravedad del evento
- `cambiarItem14()` - Cuándo ocurrió
- `cambiarItem15()` - Frecuencia

---

**Guardado**: 17/07/2026
**Commits relacionados**: b2002a7
