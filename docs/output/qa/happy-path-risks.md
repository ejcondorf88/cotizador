# Identificación de Riesgos - Happy Path E2E (SPEC-021)

## Información General

| Campo | Valor |
|-------|-------|
| **Spec ID** | SPEC-021 |
| **Feature** | happy-path-e2e-serenity |
| **Fecha** | 2026-04-21 |
| **Autor** | QA Lead - ASDD |
| **Estado** | DRAFT |
| **Metodología** | Regla ASD (Alto/Medio/Bajo) |

---

## Resumen Ejecutivo de Riesgos

| Nivel | Cantidad | Requiere Acción |
|-------|----------|-----------------|
| 🔴 **Alto** | 3 | ✅ Obligatorio |
| 🟡 **Medio** | 4 | ⚠️ Recomendado |
| 🟢 **Bajo** | 2 | ℹ️ Opcional |
| **Total** | **9** | - |

---

## Riesgos Identificados

### 🔴 RIESGO ALTO (Obligatorio - Requiere Mitigación Inmediata)

#### R-001: Flaky Tests por Dependencia de Estado

| Campo | Valor |
|-------|-------|
| **ID** | R-001 |
| **Nombre** | Tests dependen de estado previo del sistema |
| **Categoría** | Estabilidad |
| **Probabilidad** | Alta |
| **Impacto** | Alto |
| **Nivel** | 🔴 **ALTO** |

**Descripción:**
Los tests E2E pueden fallar si el estado del sistema no es consistente entre ejecuciones. Si hay datos residuales de ejecuciones anteriores, los tests pueden comportarse de manera inconsistente.

**Escenarios de Fallo:**
- Cotizaciones previas afectan el folio generado
- Inmuebles anteriores persisten en la base de datos
- Estado de sesión no limpio

**Mitigación:**
- ✅ Implementar limpieza de datos antes de cada test run
- ✅ Crear cotización nueva en cada ejecución (ya definido en spec)
- ✅ Usar datos de prueba únicos por ejecución (timestamps)
- ✅ Implementar `@Before` que resetea estado

**Acción Requerida:**
```java
@Before
public void limpiarEstado() {
    // Limpiar cotizaciones de prueba anteriores
    // Resetear estado del actor
    // Verificar ambiente limpio
}
```

**Estado:** ⬜ Pendiente de implementación

---

#### R-002: Frontend no Disponible Durante Tests

| Campo | Valor |
|-------|-------|
| **ID** | R-002 |
| **Nombre** | Frontend no corriendo al iniciar tests |
| **Categoría** | Infraestructura |
| **Probabilidad** | Media |
| **Impacto** | Alto |
| **Nivel** | 🔴 **ALTO** |

**Descripción:**
Si el frontend no está corriendo en `localhost:5173` cuando se ejecutan los tests, todos los tests fallarán inmediatamente.

**Escenarios de Fallo:**
- Desarrollador olvidó iniciar el frontend
- Puerto ocupado por otro proceso
- Frontend en proceso de build
- Error de compilación del frontend

**Mitigación:**
- ✅ Implementar healthcheck antes de ejecutar tests
- ✅ Agregar validación en `@BeforeClass`
- ✅ Usar wait con retry para verificar disponibilidad
- ✅ Documentar pre-condiciones claramente

**Acción Requerida:**
```java
@BeforeClass
public static void verificarAmbiente() {
    given()
        .when().get("http://localhost:5173")
        .then().statusCode(200);
}
```

**Estado:** ⬜ Pendiente de implementación

---

#### R-003: ChromeDriver Versión Incompatible

| Campo | Valor |
|-------|-------|
| **ID** | R-003 |
| **Nombre** | Versión de ChromeDriver no coincide con Chrome |
| **Categoría** | Infraestructura |
| **Probabilidad** | Media |
| **Impacto** | Alto |
| **Nivel** | 🔴 **ALTO** |

**Descripción:**
ChromeDriver debe coincidir exactamente con la versión de Chrome instalada. Las actualizaciones automáticas de Chrome pueden romper la compatibilidad.

**Escenarios de Fallo:**
- Chrome se actualizó pero ChromeDriver no
- ChromeDriver no está en PATH
- Versión incompatible genera WebDriverException

**Mitigación:**
- ✅ Usar WebDriverManager para manejo automático de drivers
- ✅ Documentar versión exacta requerida
- ✅ Agregar validación de versiones en setup
- ✅ Considerar usar Docker para ambiente controlado

**Acción Requerida:**
```xml
<!-- pom.xml -->
<dependency>
    <groupId>io.github.bonigarcia</groupId>
    <artifactId>webdrivermanager</artifactId>
    <version>5.8.0</version>
</dependency>
```

```java
WebDriverManager.chromedriver().setup();
```

**Estado:** ⬜ Pendiente de implementación

---

### 🟡 RIESGO MEDIO (Recomendado - Debe ser Mitigado)

#### R-004: Selectores UI Cambian Frecuentemente

| Campo | Valor |
|-------|-------|
| **ID** | R-004 |
| **Nombre** | Cambios en selectores UI rompen tests |
| **Categoría** | Mantenibilidad |
| **Probabilidad** | Alta |
| **Impacto** | Medio |
| **Nivel** | 🟡 **MEDIO** |

**Descripción:**
Los selectores CSS o XPath pueden cambiar durante el desarrollo del frontend, causando que los tests fallen aunque la funcionalidad sea correcta.

**Escenarios de Fallo:**
- Cambio de clase CSS
- Reestructuración del DOM
- IDs dinámicos generados

**Mitigación:**
- ✅ Usar atributos `data-testid` en componentes React
- ✅ Centralizar selectores en clases `Targets`
- ✅ Usar estrategias de localización robustas
- ✅ Implementar self-healing con Healenium (opcional)

**Acción Requerida:**
```java
// Targets.java
public class QuotePageTargets {
    public static final Target BOTON_CREAR_COTIZACION = 
        Target.the("Botón crear cotización")
              .locatedBy("[data-testid='btn-crear-cotizacion']");
}
```

**Estado:** ⬜ Pendiente de coordinación con Frontend

---

#### R-005: Timeout por Tiempo de Respuesta

| Campo | Valor |
|-------|-------|
| **ID** | R-005 |
| **Nombre** | Operaciones tardan más de 10 segundos |
| **Categoría** | Performance |
| **Probabilidad** | Media |
| **Impacto** | Medio |
| **Nivel** | 🟡 **MEDIO** |

**Descripción:**
Las operaciones asíncronas (crear cotización, guardar inmueble) pueden tardar más de 10 segundos en ambientes con pocos recursos o bajo carga.

**Escenarios de Fallo:**
- Timeout en espera de redirección
- Spinner de carga no desaparece
- Backend lento responde después del timeout

**Mitigación:**
- ✅ Usar esperas explícitas (WaitUntil) en lugar de sleep
- ✅ Configurar timeout configurable vía properties
- ✅ Implementar retry con backoff exponencial
- ✅ Monitorear tiempos de respuesta del backend

**Acción Requerida:**
```java
// Uso de esperas explícitas
actor.attemptsTo(
    WaitUntil.the(ELEMENTO, isVisible())
             .forNoMoreThan(10).seconds()
);
```

**Estado:** ⚠️ Monitorear durante ejecución

---

#### R-006: Datos de Prueba Inválidos

| Campo | Valor |
|-------|-------|
| **ID** | R-006 |
| **Nombre** | Datos de prueba no cumplen validaciones de negocio |
| **Categoría** | Datos |
| **Probabilidad** | Media |
| **Impacto** | Medio |
| **Nivel** | 🟡 **MEDIO** |

**Descripción:**
Si los datos de prueba no cumplen con las reglas de validación del negocio (ej: CP inválido, año de construcción futuro), los formularios no se guardarán.

**Escenarios de Fallo:**
- CP con letras en lugar de números
- Año de construcción > año actual
- Suma asegurada = 0

**Mitigación:**
- ✅ Validar datos de prueba contra reglas de negocio
- ✅ Usar datos consistentes y realistas
- ✅ Revisar validaciones del backend
- ✅ Documentar reglas de negocio en datos de prueba

**Acción Requerida:**
```json
{
  "cp": "06600",           // ✓ Válido: 5 dígitos
  "año_construccion": 2015, // ✓ Válido: 1900-2026
  "garantia_edificio": 5000000 // ✓ Válido: > 0
}
```

**Estado:** ✅ Mitigado - Datos validados en test-data.md

---

#### R-007: Tests No Son Idempotentes

| Campo | Valor |
|-------|-------|
| **ID** | R-007 |
| **Nombre** | Ejecuciones repetidas producen resultados diferentes |
| **Categoría** | Estabilidad |
| **Probabilidad** | Baja |
| **Impacto** | Medio |
| **Nivel** | 🟡 **MEDIO** |

**Descripción:**
Los tests pueden dejar el sistema en un estado que afecta ejecuciones posteriores si no se maneja correctamente.

**Escenarios de Fallo:**
- Acumulación de cotizaciones de prueba
- Estados de cobertura persisten
- Sesiones no cerradas

**Mitigación:**
- ✅ Implementar `@After` que limpia datos de prueba
- ✅ Usar transacciones rollback si es posible
- ✅ Crear datos únicos por ejecución
- ✅ Documentar requisitos de limpieza

**Acción Requerida:**
```java
@After
public void limpiarDatosDePrueba() {
    // Eliminar cotización creada durante el test
    // Limpiar inmuebles de prueba
}
```

**Estado:** ⬜ Pendiente de implementación

---

### 🟢 RIESGO BAJO (Opcional - Puede ser Mitigado)

#### R-008: Reporte Serenity en Idioma Incorrecto

| Campo | Valor |
|-------|-------|
| **ID** | R-008 |
| **Nombre** | Reporte generado no está completamente en español |
| **Categoría** | Localización |
| **Probabilidad** | Baja |
| **Impacto** | Bajo |
| **Nivel** | 🟢 **BAJO** |

**Descripción:**
El reporte Serenity puede mostrar algunos textos en inglés por defecto, afectando la legibilidad para stakeholders hispanohablantes.

**Escenarios de Fallo:**
- Mensajes de Serenity en inglés
- Labels de pasos en inglés
- Títulos de secciones no traducidos

**Mitigación:**
- ✅ Configurar `serenity.report.language=es`
- ✅ Usar descripciones en español en @Step
- ✅ Verificar internacionalización de Serenity

**Acción Requerida:**
```properties
# serenity.properties
serenity.report.language=es
serenity.console.colors=true
```

**Estado:** ℹ️ Opcional - No bloquea la ejecución

---

#### R-009: Screenshots Ocupan Demasiado Espacio

| Campo | Valor |
|-------|-------|
| **ID** | R-009 |
| **Nombre** | Capturas de pantalla generan archivos grandes |
| **Categoría** | Performance |
| **Probabilidad** | Baja |
| **Impacto** | Bajo |
| **Nivel** | 🟢 **BAJO** |

**Descripción:**
La configuración `FOR_EACH_ACTION` genera muchos screenshots que pueden ocupar espacio significativo en disco, especialmente en CI/CD.

**Escenarios de Fallo:**
- Disco lleno en servidor CI
- Reporte muy pesado para descargar
- Tiempo de build aumentado

**Mitigación:**
- ✅ Configurar compresión de imágenes
- ✅ Usar `FOR_FAILURES` en lugar de `FOR_EACH_ACTION` en CI
- ✅ Limpiar screenshots antiguos periódicamente
- ✅ Almacenar reportes en almacenamiento externo

**Acción Requerida:**
```properties
# serenity.properties
serenity.take.screenshots=FOR_FAILURES
```

**Estado:** ℹ️ Opcional - Configurar según ambiente

---

## Matriz de Riesgos

```
                    IMPACTO
              ┌─────────────────────────┐
              │   Bajo    Medio    Alto  │
         ┌────┼─────────┬─────────┬─────┤
         │Alta│ R-008   │ R-004   │ R-001│
         │    │ R-009   │         │ R-002│
PROBABI- ├────┼─────────┼─────────┼─────┤
LIDAD    │Med │         │ R-005   │ R-003│
         │    │         │ R-006   │      │
         │    │         │ R-007   │      │
         ├────┼─────────┼─────────┼─────┤
         │Baja│         │         │      │
         └────┴─────────┴─────────┴─────┘

Leyenda:
🔴 Riesgos Alto: R-001, R-002, R-003
🟡 Riesgos Medio: R-004, R-005, R-006, R-007
🟢 Riesgos Bajo: R-008, R-009
```

---

## Plan de Mitigación Priorizado

### Sprint 1 (Obligatorio)

| Prioridad | Riesgo | Acción | Responsable | Estado |
|-----------|--------|--------|-------------|--------|
| 1 | R-001 | Implementar limpieza de datos | QA Engineer | ⬜ |
| 2 | R-002 | Agregar healthcheck de ambiente | QA Engineer | ⬜ |
| 3 | R-003 | Integrar WebDriverManager | QA Engineer | ⬜ |

### Sprint 2 (Recomendado)

| Prioridad | Riesgo | Acción | Responsable | Estado |
|-----------|--------|--------|-------------|--------|
| 4 | R-004 | Coordinar data-testid con Frontend | Tech Lead | ⬜ |
| 5 | R-005 | Implementar esperas explícitas | QA Engineer | ⬜ |
| 6 | R-006 | Validar datos contra reglas | QA Engineer | ✅ |
| 7 | R-007 | Implementar limpieza @After | QA Engineer | ⬜ |

### Sprint 3 (Opcional)

| Prioridad | Riesgo | Acción | Responsable | Estado |
|-----------|--------|--------|-------------|--------|
| 8 | R-008 | Configurar idioma español | QA Engineer | ⬜ |
| 9 | R-009 | Optimizar configuración screenshots | QA Engineer | ⬜ |

---

## Métricas de Riesgo

### Indicadores Clave

| Métrica | Fórmula | Valor Actual | Objetivo |
|---------|---------|--------------|----------|
| Densidad de Riesgo | Total Riesgos / Casos de Prueba | 9/7 = 1.29 | < 1.5 |
| % Riesgos Alto | (Riesgos Alto / Total) * 100 | 33% | < 20% |
| % Riesgos Mitigados | Mitigados / Total | 11% | 100% |

### Evolución del Riesgo

```
Riesgo Total
  │
9 ┤ 🟢 Inicial (antes de mitigaciones)
  │
7 ┤ 🟡 Después de Sprint 1 (obligatorio)
  │
4 ┤ 🔵 Después de Sprint 2 (recomendado)
  │
2 ┤ 🟣 Óptimo (todos mitigados)
  └─────────────────────────────
```

---

## Conclusiones y Recomendaciones

### Hallazgos Principales

1. **3 Riesgos Alto identificados:** Todos relacionados con estabilidad del ambiente de pruebas
2. **4 Riesgos Medio identificados:** Principalmente de mantenibilidad y datos
3. **Ningún riesgo de negocio crítico:** Los riesgos son técnicos, no funcionales

### Recomendaciones

1. **Priorizar Sprint 1:** Los 3 riesgos altos deben mitigarse antes de la primera ejecución
2. **Coordinar con Frontend:** Agregar `data-testid` a componentes clave
3. **Documentar Setup:** Crear guía detallada de configuración del ambiente
4. **Automatizar Healthcheck:** Validar ambiente antes de cada ejecución

### Aprobación de Riesgos

| Nivel | Cantidad | Estado |
|-------|----------|--------|
| 🔴 Alto | 3 | ⬜ Pendiente mitigación |
| 🟡 Medio | 4 | ⚠️ En seguimiento |
| 🟢 Bajo | 2 | ℹ️ Aceptado |

**Decisión:**
- [ ] Aprobar con mitigaciones obligatorias
- [ ] Rechazar - requiere más análisis
- [ ] Aplazar - riesgos aceptados temporalmente

---

## Anexos

### A. Checklist de Validación de Riesgos

Para cada riesgo Alto:
- [ ] Estrategia de mitigación definida
- [ ] Implementación planificada
- [ ] Responsable asignado
- [ ] Fecha de entrega definida
- [ ] Validación post-implementación

### B. Referencias

- SPEC-021: Happy Path E2E Specification
- QA Guidelines: `.github/docs/lineamientos/qa-guidelines.md`
- Definition of Done: `.github/copilot-instructions.md`

---

*Documento generado siguiendo la Regla ASD (Alto=Obligatorio, Medio=Recomendado, Bajo=Opcional) - Centro de Excelencia Sofka*
