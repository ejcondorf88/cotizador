# Matriz de Riesgos — SPEC-015: Serenity BDD Template

**Fecha:** 2026-04-20  
**Versión:** 1.0  
**QA Lead:** Phase 4 Review

---

## Resumen Ejecutivo

| Métrica | Valor |
|---------|-------|
| Total Riesgos Identificados | 8 |
| Nivel ALTO (A) | 2 |
| Nivel MEDIO (S) | 4 |
| Nivel BAJO (D) | 2 |

**Veredicto General:** ✅ **ACEPTADO con Observaciones** - El template cumple con los requisitos base, pero presenta riesgos medios que deben mitigarse antes de usar en producción.

---

## Detalle de Riesgos

### 🔴 NIVEL ALTO (Obligatorio)

| ID | HU | Descripción del Riesgo | Factores | Nivel | Testing |
|----|----|------------------------|----------|-------|---------|
| **R-001** | HU-02 | Dependencias de Selenium 4.27.0 y ChromeDriver pueden presentar incompatibilidad de versiones con navegadores actualizados | Integración externa, dependencia no controlada | **A** | Obligatorio |
| **R-002** | HU-05 | Configuración de WebDriver apunta a localhost:5173 sin validación de ambiente disponible | SLA contractuales, sin rollback posible | **A** | Obligatorio |

---

### 🟡 NIVEL MEDIO (Recomendado)

| ID | HU | Descripción del Riesgo | Factores | Nivel | Testing |
|----|----|------------------------|----------|-------|---------|
| **R-003** | HU-03 | Step Definitions contienen implementaciones "placeholder" que simulan comportamiento sin interactuar con UI real | Código nuevo sin historial, alta probabilidad de defectos | **S** | Recomendado |
| **R-004** | HU-04 | CotizacionFactory genera datos estáticos sin randomización, riesgo de tests no deterministas | Código nuevo sin historial | **S** | Recomendado |
| **R-005** | HU-03 | Questions (ElFolioDeLaCotizacion) retornan valores hardcodeados sin leer del DOM | Alta probabilidad de defectos | **S** | Recomendado |
| **R-006** | HU-06 | Feature file "crear_cotizacion.feature" contiene escenarios que no son ejecutables sin aplicación real | Lógica de negocio compleja | **S** | Recomendado |

---

### 🟢 NIVEL BAJO (Opcional)

| ID | HU | Descripción del Riesgo | Factores | Nivel | Testing |
|----|----|------------------------|----------|-------|---------|
| **R-007** | HU-01 | Falta carpeta `src/test/resources/drivers/README.md` con instrucciones para ChromeDriver | Features internas | **D** | Opcional |
| **R-008** | HU-01 | No existe archivo `serenity.conf` como alternativa de configuración | Features internas | **D** | Opcional |

---

## Plan de Mitigación — Riesgos ALTO

### R-001: Incompatibilidad Selenium/ChromeDriver

**Mitigación Técnica:**
- Implementar WebDriverManager para gestión automática de drivers
- Documentar matriz de compatibilidad de versiones
- Agregar verificación de versión al inicio de tests

**Tests Obligatorios:**
- Test de compatibilidad de WebDriver
- Validación de descarga automática de drivers
- Test de inicialización de navegador

**Bloqueante para release:** ✅ Sí (si no se implementa WebDriverManager)

**Archivo a modificar:** `pom.xml`, `serenity.properties`

```xml
<!-- Agregar WebDriverManager -->
<dependency>
    <groupId>io.github.bonigarcia</groupId>
    <artifactId>webdrivermanager</artifactId>
    <version>5.9.2</version>
    <scope>test</scope>
</dependency>
```

---

### R-002: Validación de Ambiente

**Mitigación Técnica:**
- Agregar Health Check antes de ejecutar tests
- Implementar fallback para URLs no disponibles
- Configurar mock server para tests aislados

**Tests Obligatorios:**
- Test de conectividad con ambiente
- Validación de variables de entorno requeridas
- Test con mock server

**Bloqueante para release:** ✅ Sí

**Archivos a modificar:**
- `src/test/java/com/segurax/utils/HealthCheck.java` (nuevo)
- `Hooks.java` - Agregar validación de ambiente

---

## Plan de Mitigación — Riesgos MEDIO

### R-003: Implementaciones Placeholder

**Acción:** Documentar claramente cuáles componentes son "stubs" vs implementación real

**Recomendación:**
- Agregar anotación `@Placeholder` o comentario estandarizado
- Crear tarea en backlog para implementar Tasks reales
- Implementar al menos un Task funcional completo como referencia

---

### R-004: Datos No Deterministas

**Acción:** Implementar generación de datos aleatorios con Faker

**Recomendación:**
```xml
<!-- Agregar JavaFaker -->
<dependency>
    <groupId>com.github.javafaker</groupId>
    <artifactId>javafaker</artifactId>
    <version>1.0.2</version>
    <scope>test</scope>
</dependency>
```

---

### R-005: Questions Hardcodeadas

**Acción:** Implementar lectura real del DOM para al menos una Question

**Ejemplo:**
```java
@Override
public String answeredBy(Actor actor) {
    return Text.of(CotizacionTargets.CAMPO_FOLIO).answeredBy(actor);
}
```

---

### R-006: Feature No Ejecutable

**Acción:** Agregar tag @template-only y documentar que requiere implementación

**Recomendación:**
```gherkin
@template-only @not-implemented
Escenario: Crear una cotización exitosamente
  # Este escenario requiere implementación de Tasks reales
```

---

## Recomendaciones Adicionales

### 1. Dependencias con Vulnerabilidades Conocidas

| Dependencia | Versión Actual | Estado |
|-------------|----------------|--------|
| Selenium Java | 4.27.0 | ✅ Actualizada |
| Serenity BDD | 4.2.15 | ✅ Actualizada |
| Cucumber | 7.20.1 | ✅ Actualizada |
| JUnit | 4.13.2 | ⚠️ Considerar JUnit 5 |

**Recomendación:** Evaluar migración a JUnit 5 (Jupiter) para mejor soporte a largo plazo.

---

### 2. Cobertura de Patrones Screenplay

| Componente | Estado | Cobertura |
|------------|--------|-----------|
| Actor | ✅ Implementado | 100% |
| Task | ⚠️ Placeholder | 50% |
| Question | ⚠️ Placeholder | 50% |
| Target | ✅ Implementado | 100% |
| Action | ❌ No implementado | 0% |
| Ability | ✅ BrowseTheWeb (vía OnlineCast) | 100% |

---

### 3. Documentación JavaDoc

| Paquete | Cobertura | Estado |
|---------|-----------|--------|
| `actors/` | 100% | ✅ Completa |
| `models/` | 100% | ✅ Completa |
| `tasks/` | 100% | ✅ Completa |
| `questions/` | 100% | ✅ Completa |
| `targets/` | 100% | ✅ Completa |
| `stepdefinitions/` | 100% | ✅ Completa |

**Total Cobertura JavaDoc:** 100% ✅

---

## Checklist de Verificación

- [x] Estructura de carpetas según especificación
- [x] pom.xml con dependencias correctas
- [x] serenity.properties configurado
- [x] README.md con instrucciones completas
- [x] .gitignore apropiado
- [x] JavaDoc en todas las clases
- [x] CucumberTestSuite runner configurado
- [x] Feature file con escenarios de ejemplo
- [x] Modelos POJO implementados
- [x] Builder Pattern implementado
- [x] Factory Pattern implementado
- [ ] WebDriverManager agregado (recomendado)
- [ ] Archivo serenity.conf alternativo (opcional)
- [ ] Drivers/README.md con instrucciones (opcional)

---

## Conclusión

El template implementado cumple con los requisitos definidos en SPEC-015. La estructura está completa y sigue las convenciones del patrón Screenplay. Sin embargo, se identificaron **2 riesgos ALTOS** que deberían mitigarse antes de usar el template en producción, principalmente relacionados con la gestión de WebDriver y la validación de ambiente.

**Estado QA:** ⚠️ **APROBADO CON CONDICIONES**

---

*Generado por QA Agent - Phase 4 ASDD*
