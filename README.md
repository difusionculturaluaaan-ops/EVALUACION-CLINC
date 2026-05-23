# Evaluación Clínica Psicológica PRO v2.0

Sistema profesional de evaluación psicológica con 7 tests estandarizados, interpretación clínica automática y generación de reportes PDF.

## 🚀 Características

### Tests Disponibles
- **SCL-90-R**: Symptom Checklist-90 Revised (90 ítems, 9 subescalas)
- **Hamilton (HAM-D)**: Escala de Depresión (17 ítems)
- **MMPI-2**: Inventario Multifásico de Personalidad (13 escalas)
- **TDS**: Test de Trastornos del Sueño (30 ítems)
- **ISRA**: Inventario de Situaciones y Respuestas de Ansiedad (56 ítems)
- **PCL-R**: Hare Psychopathy Checklist-Revised (20 ítems)
- **EGEP-5**: Escala de Gravedad de TEPT - DSM-5 (22 ítems)

### Funcionalidades
✅ **Gestión de expedientes**: Crear, buscar y editar pacientes
✅ **Interpretación automática**: Baremos y niveles de severidad
✅ **Histórico de evaluaciones**: Rastrear progreso del paciente
✅ **Reportes profesionales**: Exportar evaluaciones en PDF
✅ **Interfaz responsive**: Desktop, tablet y móvil
✅ **Tema claro/oscuro**: Interfaz adaptable
✅ **Base de datos SQLite**: Almacenamiento seguro y local

## 📦 Instalación

### Requisitos
- Node.js v14 o superior
- npm o yarn

### Pasos

1. **Navegar al directorio del proyecto**
   ```bash
   cd "c:\Users\image\Developer\software\EVALUACIÓN CLÍNICA PSICO"
   ```

2. **Instalar dependencias** (ya hecho, pero si necesitas reinstalar)
   ```bash
   npm install
   ```

3. **Iniciar el servidor**
   ```bash
   npm start
   # o
   node server.js
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

## 🎯 Modo de Uso

### 1. Crear un Nuevo Paciente
- Click en **"Nueva Ficha"** en el sidebar
- Completar datos del paciente (nombre, edad, sexo, medicamentos, observaciones)
- Click en **"Registrar y Continuar"**

### 2. Aplicar una Evaluación
- Seleccionar el test desde el sidebar (SCL-90-R, Hamilton, etc.)
- Responder todos los ítems
- La barra de progreso muestra el avance
- Click en **"Finalizar [Test]"**

### 3. Ver Reporte
- Después de completar un test, se muestra el reporte automáticamente
- El reporte incluye:
  - Datos del paciente
  - Puntaje total
  - Nivel de severidad (con color)
  - Interpretación clínica
  - Observaciones

### 4. Descargar PDF
- En el reporte, click en **"⬇️ Descargar PDF"**
- Se generará un PDF profesional formateado

### 5. Gestionar Expedientes
- En **"Expedientes"** ver todos los pacientes
- Usar **búsqueda** para encontrar por nombre
- **✏️** para editar
- **⏸️** para pausar / **▶️** para reactivar

## 🗄️ Estructura del Proyecto

```
EVALUACIÓN CLÍNICA PSICO/
├── server.js                 # Servidor Express
├── package.json              # Dependencias
├── db/
│   └── schema.js             # Base de datos SQLite
├── routes/
│   ├── pacientes.js          # API CRUD pacientes
│   └── pruebas.js            # API pruebas
├── database/
│   └── clinica.db            # Archivo de BD (creado automáticamente)
└── public/
    ├── index.html            # SPA principal
    ├── css/
    │   └── styles.css        # Estilos profesionales
    └── js/
        ├── app.js            # Controlador principal
        ├── api.js            # Cliente HTTP
        ├── interpretacion.js  # Motor de interpretación clínica
        ├── chart-manager.js   # Gráficas Chart.js
        ├── expedientes.js     # Gestión de expedientes
        ├── pdf.js            # Generación de PDF
        └── tests/
            ├── renderer.js    # Renderizador genérico
            ├── scl90r.js      # Test SCL-90-R
            ├── hamilton.js    # Test Hamilton
            ├── mmpi2.js       # Test MMPI-2
            ├── tds.js         # Test TDS
            ├── isra.js        # Test ISRA
            ├── pclr.js        # Test PCL-R
            └── egep5.js       # Test EGEP-5
```

## 📊 Interpretación de Resultados

### Hamilton (HAM-D 17)
- **0-7**: Sin depresión
- **8-13**: Depresión leve
- **14-18**: Depresión moderada
- **19-22**: Depresión severa
- **≥23**: Muy severa

### SCL-90-R (GSI - Global Severity Index)
- **<0.70**: Sin caseness
- **0.70-1.29**: Leve
- **1.30-1.99**: Moderada
- **≥2.00**: Severa

### MMPI-2 (T-scores)
- **<50**: Bajo
- **50-64**: Normal
- **65-74**: Clínicamente elevado
- **≥75**: Muy elevado

### Hamilton (HAM-D 17)
- **0-7**: Sin depresión
- **8-13**: Leve
- **14-18**: Moderada
- **19-22**: Severa
- **≥23**: Muy severa

## 🔐 Seguridad

- Base de datos local (SQLite) - sin sincronización con servidores externos
- Datos sensibles protegidos localmente
- No requiere conexión a internet
- **Recomendación**: Realizar copias de seguridad regulares de `database/clinica.db`

## 💡 Consejos

1. **Responder completo**: Todos los ítems deben responderse para calcular el resultado
2. **Observaciones**: Usar el campo de observaciones para contexto clínico relevante
3. **Histórico**: Los cambios de status y pausas de evaluaciones se registran automáticamente
4. **Tema**: Cambiar entre tema claro/oscuro con el botón ☀️ en la esquina superior derecha

## 🛠️ Soporte Técnico

### Puerto ocupado
Si el puerto 3000 está ocupado, cambiar en `server.js`:
```javascript
const PORT = process.env.PORT || 3001; // Cambiar a 3001
```

### Limpiar datos
Para eliminar todos los datos y empezar de cero:
```bash
rm database/clinica.db
npm start
```

### Logs del servidor
El servidor muestra logs en consola. Para ver más detalles:
```bash
DEBUG=* npm start
```

## 📝 Notas Importantes

- **PCL-R**: Requiere entrenamiento especializado. Solo usar si está certificado.
- **MMPI-2**: Concentrado (9 escalas). Para evaluación completa (567 ítems), usar versión oficial.
- **EGEP-5**: Basada en criterios DSM-5 para TEPT.

## 🎓 Referencias Clínicas

- Derogatis, L.R. (1994). SCL-90-R: Administration, Scoring and Procedures Manual
- Hamilton, M. (1960). A rating scale for depression. Journal of Neurology, Neurosurgery & Psychiatry
- Hare, R.D. (1991). PCL-R Assessment
- Echeburúa, E. et al. (2016). EGEP-5: Escala de Gravedad de TEPT

---

**Versión**: 2.0.0  
**Última actualización**: 2026-05-22  
**Autor**: Sistema Automático de Evaluación Clínica
# EVALUACION-CLINC
