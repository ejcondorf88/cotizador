# ADR-009: Selección de Serenity BDD con Screenplay Pattern para Pruebas E2E

**Estado:** Accepted  
**Fecha:** 2026-04-21  
**Autor:** QA Team - ASDD  
**Contexto:** SPEC-021 - Happy Path E2E  

---

## Contexto

El proyecto SeguraX requería una estrategia de pruebas End-to-End (E2E) para verificar el flujo completo del cotizador, desde la homepage hasta la configuración de coberturas. La suite de pruebas necesitaba:

- Verificar el happy path de 5 microflujos críticos
- Generar reportes ejecutivos con evidencias visuales
- Ser mantenible por el equipo QA
- Integrarse con CI/CD
- Ser entendible por stakeholders no técnicos

### Alternativas Consideradas

Investigamos 4 frameworks principales para automatización E2E:

| Framework | Lenguaje | Patrón | Reportes | Curva de Aprendizaje |
|-----------|----------|--------|----------|---------------------|
| **Serenity BDD** | Java | Screenplay | ⭐⭐⭐⭐⭐ Excelentes | Media |
| Cypress | JavaScript | Page Object | ⭐⭐⭐⭐ Buenos | Baja |
| Playwright | JavaScript/TypeScript | Page Object | ⭐⭐⭐⭐ Buenos | Baja |
| Selenium + TestNG | Java | Page Object | ⭐⭐⭐ Básicos | Media |

---

## Decisión

**Decidimos usar Serenity BDD con Screenplay Pattern** para la suite de pruebas E2E del proyecto SeguraX.

### Justificación

#### 1. Reportes Ejecutivos de Alta Calidad

Serenity BDD genera reportes HTML interactivos que incluyen:
- **Screenshots automáticos** en cada paso
- **Historial de ejecuciones** con tendencias
- **Requerimientos trazables** desde especificación hasta ejecución
- **Métricas de cobertura** visual

Estos reportes son valiosos para:
- Demos con stakeholders
- Auditorías de calidad
- Análisis de fallas

#### 2. Screenplay Pattern sobre Page Object Model

Elegimos Screenplay Pattern porque:

| Aspecto | Screenplay | Page Object |
|---------|------------|-------------|
| **Legibilidad** | ✅ Tests leen como user stories | ⚠️ Técnico, centrado en UI |
| **Mantenibilidad** | ✅ Acciones encapsuladas | ❌ Fragilidad ante cambios UI |
| **Reutilización** | ✅ Tasks compartibles entre features | ⚠️ Limitada a páginas |
| **Abstracción** | ✅ Negocio sobre implementación | ❤️ Acoplado a selectores |

#### 3. Stack Tecnológico Aligned

El equipo ya tenía:
- Java 17 para backend (Spring Boot)
- Maven para builds
- JUnit 5 para tests unitarios

Serenity BDD se integra naturalmente sin agregar nuevos lenguajes.

#### 4. Cucumber + Gherkin

Los escenarios en lenguaje natural facilitan:
- Colaboración con Product Owners
- Documentación viva del comportamiento
- Tags para ejecución selectiva

---

## Consecuencias

### Positivas

| Consecuencia | Impacto |
|--------------|---------|
| **Tests autodocumentados** | Los escenarios Gherkin sirven como especificación |
| **Fácil debugging** | Screenshots en cada paso identifican fallas rápidamente |
| **Escalabilidad** | Nuevos escenarios reutilizan Tasks/Questions existentes |
| **Integración CI/CD** | Maven plugin genera reportes automáticamente |
| **Comunidad activa** | Documentación extensa y actualizaciones frecuentes |

### Negativas

| Consecuencia | Mitigación |
|--------------|------------|
| **Curva de aprendizaje inicial** | Capacitación de 2-3 días, documentación interna en CONTRIBUTING.md |
| **Más código boilerplate** | Generación de templates para Tasks/Questions |
| **Velocidad de ejecución** | Tests E2E son inherentemente lentos; optimizar con paralelización |
| **Dependencia de Java** | Equipo QA necesita conocimientos Java básicos |

### Riesgos Aceptados

1. **Tiempo de implementación:** 3-4 semanas vs. 1-2 semanas con Cypress
   - *Mitigado por:* Mantenibilidad a largo plazo superior

2. **Configuración inicial compleja:** Serenity requiere más setup que Cypress
   - *Mitigado por:* Template base reutilizable para futuros proyectos

---

## Alternativas Rechazadas

### Cypress (Rechazado)

**Razones:**
- Stack diferente (JavaScript vs. Java del proyecto)
- Menos adecuado para tests con múltiples actores
- Reportes menos detallados para stakeholders ejecutivos

**Cuándo reconsiderar:** Si el equipo frontend asume ownership de los E2E

### Playwright (Rechazado)

**Razones:**
- Similar a Cypress en limitaciones de stack
- Aunque más rápido, carece del ecosistema de reportes de Serenity
- Menor integración con BDD/Gherkin

**Cuándo reconsiderar:** Si se prioriza velocidad de ejecución sobre documentación

### Selenium + TestNG (Rechazado)

**Razones:**
- Requiere construcción manual de reportes
- Sin integración nativa con BDD
- Page Object Model más frágil

---

## Implementación

### Arquitectura Elegida

```
┌─────────────────────────────────────────────────────────────┐
│                    Feature File (Gherkin)                   │
│            happy_path_flujo_completo.feature               │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                  Step Definitions                          │
│         HappyPathFlujoCompletoStepDefinitions               │
│         (Glue entre Gherkin y Screenplay)                  │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│              Screenplay Pattern Components                  │
├─────────────────────────────────────────────────────────────┤
│  Tasks (When) │ Questions (Then) │ Targets │ Actors │ Models │
│   Navegar     │  ElFolioDe...    │ *Page   │ElAgente│Inmueble│
│ CrearCotiz... │  LaUrlActual     │ Targets │        │  Data  │
└─────────────────────────────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                    Serenity BDD                            │
│           Reportes + Screenshots + Métricas                 │
└─────────────────────────────────────────────────────────────┘
```

### Métricas de Éxito

| Métrica | Objetivo | Actual |
|---------|----------|--------|
| Cobertura Happy Path | 100% (5/5 microflujos) | ✅ 100% |
| Tiempo ejecución | < 5 minutos | ✅ ~3 min |
| Reportes generados | Automáticos | ✅ Sí |
| Tests mantenibles | Refactor simple | ✅ Sí |
| Stakeholder feedback | Positivo | ✅ Aprobado |

---

## Lecciones Aprendidas

### Lo que funcionó bien

1. **Screenplay Pattern** redujo el acoplamiento entre tests y UI
2. **Factory methods** (`.nueva()`, `.mostrado()`) mejoraron legibilidad
3. **Tags de Cucumber** permitieron ejecución selectiva rápida
4. **Builder Pattern** en modelos facilitó creación de datos de prueba

### Lo que podría mejorar

1. **Selectores:** Inicialmente usamos clases CSS, migraremos a `data-testid`
2. **Tiempo de espera:** Algunos waits fueron innecesariamente largos
3. **Paralelización:** Ejecución secuencial; se explorará paralelo en futuro

---

## Referencias

- [SPEC-021: Happy Path E2E](../specs/happy-path-e2e-serenity.spec.md)
- [Documentación Serenity BDD](https://serenity-bdd.github.io/)
- [Screenplay Pattern - Serenity Docs](https://serenity-bdd.github.io/docs/screenplay/)
- [e2e/CONTRIBUTING.md](../../e2e/CONTRIBUTING.md)

---

## Estado del ADR

| Fecha | Evento |
|-------|--------|
| 2026-04-15 | Propuesta inicial |
| 2026-04-18 | Evaluación de alternativas |
| 2026-04-21 | Decisión aprobada e implementación completada |

---

*Este ADR sigue el formato de la plantilla ASDD para decisiones arquitectónicas.*
