# 📋 Guía: Crear y Eliminar Clínica Demo

## Descripción
Instrucciones para crear una clínica de demostración, probarla completamente y eliminarla sin afectar las clínicas de tus clientes reales.

---

## **Opción 1: Demo Temporal (Recomendado)**

### Paso 1: Crear la Clínica Demo

1. Abre https://evaluacion-clinc.vercel.app
2. Haz clic en **"Crear Clínica"**
3. Completa el formulario:
   - **Nombre de Clínica**: `Demo Clínica`
   - **Email Administrador**: `demo@clinica.com`
   - **Contraseña**: `demo123456` (o la que prefieras)
   - **Tu Nombre Completo**: `Demo Admin`
4. Haz clic en **"Crear Clínica"**

### Paso 2: Probar Completamente

Ya dentro de la clínica:
- ✅ Crea pacientes de prueba
- ✅ Realiza todos los 7 tests (SCL-90-R, Hamilton, MMPI-2, ISRA, TDS, PCL-R, EGEP-5)
- ✅ Genera reportes PDF
- ✅ Prueba búsqueda y filtros
- ✅ Prueba tema claro/oscuro
- ✅ Prueba logout y vuelve a entrar

### Paso 3: Eliminar la Clínica Demo

Cuando termines las pruebas, elimina todos los datos:

#### **Opción A: Desde Vercel Dashboard (Interfaz gráfica)**

1. Ve a https://vercel.com/dashboard
2. Abre tu proyecto **"evaluacion-clinc"**
3. Ve a **Settings → Storage → Vercel Postgres**
4. Abre el editor SQL o la consola
5. Ejecuta estas queries en orden:

```sql
-- Primero obtén el tenant_id de la demo
SELECT id FROM tenants WHERE nombre = 'Demo Clínica';
-- Anota el ID (ej: 2)

-- Elimina las pruebas
DELETE FROM pruebas WHERE tenant_id = 2;

-- Elimina los pacientes
DELETE FROM pacientes WHERE tenant_id = 2;

-- Elimina los usuarios
DELETE FROM usuarios WHERE tenant_id = 2;

-- Finalmente, elimina el tenant
DELETE FROM tenants WHERE nombre = 'Demo Clínica';

-- Verifica que se eliminó
SELECT * FROM tenants;
```

#### **Opción B: Con psql (Línea de comandos)**

```bash
# Conéctate a PostgreSQL
psql "postgresql://neondb_owner:npg_AVFEy9tU6lvT@ep-divine-fire-akm0pe63-pooler.c-3.us-west-2.aws.neon.tech/neondb"

# Ejecuta las queries arriba
```

### Paso 4: Verificar

- ✅ La clínica "Demo Clínica" fue eliminada completamente
- ✅ Tus clientes reales NO ven ni acceso a esa data
- ✅ Base de datos limpia y lista

---

## **Opción 2: Demo Permanente**

Si prefieres mantener una clínica de demo para futuras demostraciones:

1. Crea la clínica normalmente (pasos arriba)
2. Llámala **"Demo - No Borrar"**
3. Mantenla con datos de ejemplo reales
4. Comparte credenciales con nuevos clientes para que vean cómo funciona
5. **Nunca la elimines** - úsala como referencia

---

## **Opción 3: Base de Datos de Desarrollo Separada**

Para máxima separación entre demo y producción:

1. Crear una BD PostgreSQL separada en Neon (solo para testing)
2. Tener 2 versiones de la app:
   - `evaluacion-clinc.vercel.app` → BD producción (clientes reales)
   - `evaluacion-clinc-demo.vercel.app` → BD demo (solo para probar)

*(Esta opción es más avanzada, solo si necesitas separación total)*

---

## 🔒 **Consideraciones de Seguridad**

- ✅ **Datos de clientes**: Nunca están en la demo
- ✅ **Aislamiento por tenant**: Cada clínica ve solo sus datos
- ✅ **Backups automáticos**: Vercel/Neon hacen backups diarios
- ✅ **SSL/HTTPS**: Toda comunicación es encriptada

---

## 📋 **Checklist: Qué Probar en la Demo**

- [ ] Crear clínica
- [ ] Crear usuario admin
- [ ] Login y logout
- [ ] Crear paciente
- [ ] Realizar test SCL-90-R
- [ ] Realizar test Hamilton
- [ ] Realizar test MMPI-2
- [ ] Realizar test ISRA
- [ ] Realizar test TDS
- [ ] Realizar test PCL-R
- [ ] Realizar test EGEP-5
- [ ] Ver reporte del paciente
- [ ] Descargar reporte como PDF
- [ ] Buscar paciente
- [ ] Filtrar por status (activo/pausa)
- [ ] Cambiar tema (claro/oscuro)
- [ ] Ver interpretaciones clínicas
- [ ] Gráficas de resultados
- [ ] Actualizar datos del paciente

---

## 🚀 **Después de Probar**

1. ✅ Elimina la clínica demo (pasos arriba)
2. ✅ Verifica que los datos se borraron
3. ✅ Crea clínicas reales para tus clientes
4. ✅ Comparte la URL: https://evaluacion-clinc.vercel.app
5. ✅ Cada cliente crea su propia clínica

---

**Última actualización**: 2026-05-23
