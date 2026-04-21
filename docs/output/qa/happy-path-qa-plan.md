# Plan de Ejecución QA - Happy Path E2E (SPEC-021)

## Información General

| Campo | Valor |
|-------|-------|
| **Spec ID** | SPEC-021 |
| **Feature** | happy-path-e2e-serenity |
| **Fecha** | 2026-04-21 |
| **Autor** | QA Lead - ASDD |
| **Estado** | DRAFT |
| **Versión** | 1.0 |

---

## 1. Resumen Ejecutivo

Este plan de ejecución QA define el procedimiento para validar el **Happy Path E2E** del cotizador SeguraX utilizando **Serenity BDD + Screenplay Pattern**. El plan cubre los 5 microflujos críticos desde la homepage hasta la configuración de coberturas.

**Alcance:** Tests E2E automatizados del flujo completo
**Estrategia:** Shift-Left Testing con enfoque en camino feliz
**Herramientas:** Serenity BDD, Cucumber, Selenium WebDriver, Java

---

## 2. Pre-condiciones

### 2.1 Ambiente de Pruebas

| Componente | Requisito | Estado |
|------------|-----------|--------|
| **Frontend** | Corriendo en `localhost:5173` | ⬜ Verificar |
| **Backend (ms-core)** | Corriendo en `localhost:3000` | ⬜ Verificar |
| **Gateway** | Disponible en `localhost:8080` (opcional) | ⬜ Verificar |
| **Base de Datos** | PostgreSQL accesible | ⬜ Verificar |

### 2.2 Infraestructura de Testing

| Componente | Versión Mínima | Comando Verificación |
|------------|----------------|----------------------|
| Java | 17+ | `java -version` |
| Maven | 3.8+ | `mvn -version` |
| Chrome | Última estable | `google-chrome --version` |
| ChromeDriver | Compatible con Chrome | `chromedriver --version` |
| Node.js | 18+ | `node --version` |

### 2.3 Configuración del Proyecto E2E

**Verificar existencia de:**

```
e2e/
├── pom.xml                          # Debe incluir Serenity 4.x
├── serenity.properties              # Configuración base
└── src/
    ├── test/
    │   ├── java/
    │   │   └── com/segurax/
    │   │       ├── runners/
    │   │       ├── stepdefinitions/
    │   │       ├── tasks/
    │   │       ├── questions/
    │   │       ├── targets/
    │   │       ├── models/
    │   │       └── actors/
    │   └── resources/
    │       ├── features/
    │       └── drivers/
    └── main/
```

### 2.4 Configuración serenity.properties

```properties
# Verificar que exista
webdriver.driver=chrome
webdriver.base.url=http://localhost:5173
serenity.project.name=SeguraX - Happy Path E2E Tests
serenity.take.screenshots=FOR_EACH_ACTION
serenity.timeout=10
webdriver.wait.for.timeout=10000
```

---

## 3. Criterios de Aceptación

### 3.1 Criterios Funcionales

| ID | Criterio | Validación | Prioridad |
|----|----------|------------|-----------|
| CA-001 | Homepage carga correctamente | Título visible, botón "Cotizar ahora" habilitado | Critical |
| CA-002 | Navegación a /quote funciona | URL cambia a /quote | Critical |
| CA-003 | Crear cotización genera folio | Formato COT-YYYY-NNNNN | Critical |
| CA-004 | Estado inicial es BORRADOR | Badge gris visible | Critical |
| CA-005 | Seleccionar 2 inmuebles funciona | 2 fichas creadas | Critical |
| CA-006 | Completar datos inmueble 1 | Todos los campos guardados | Critical |
| CA-007 | Completar datos inmueble 2 | Todos los campos guardados | Critical |
| CA-008 | Suma asegurada calculada | Valor esperado: $11,500,000.00 | Critical |
| CA-009 | Coberturas obligatorias visibles | Incendio y CAT activas | Critical |
| CA-010 | Activar 3 coberturas opcionales | Cristales, Agua, Robo | Critical |
| CA-011 | Resumen muestra total correcto | 5 coberturas activas | Critical |
| CA-012 | Guardar coberturas exitoso | Mensaje de éxito visible | Critical |

### 3.2 Criterios Técnicos

| ID | Criterio | Métrica | Objetivo |
|----|----------|---------|----------|
| CT-001 | Tiempo de ejecución | < 120 segundos | Optimización |
| CT-002 | Screenshots capturados | 100% de steps | Trazabilidad |
| CT-003 | Reporte Serenity generado | index.html existe | Documentación |
| CT-004 | Tests determinísticos | 0% flaky | Confiabilidad |
| CT-005 | Timeout configurado | ≤ 10 segundos | Estabilidad |

### 3.3 Definición de Listo (DoR) - QA

- [x] SPEC-021 aprobada y en estado DRAFT
- [x] Feature file Gherkin definido
- [x] Datos de prueba identificados
- [x] Ambiente local configurado
- [x] Proyecto Serenity BDD estructurado
- [x] Selectores UI con data-testid disponibles

### 3.4 Definición de Terminado (DoD) - QA

- [ ] Todos los escenarios @critical ejecutan exitosamente
- [ ] Reporte Serenity generado sin errores
- [ ] Screenshots capturados para cada paso
- [ ] Documentación QA actualizada
- [ ] Matriz de riesgos validada
- [ ] Approval de QA Lead obtenido

---

## 4. Plan de Ejecución

### 4.1 Fases de Ejecución

```
┌─────────────────────────────────────────────────────────────────┐
│                    FASE 1: VALIDACIÓN AMBIENTE                   │
│  Duración: 5 minutos                                             │
│  Objetivo: Verificar que todo está corriendo correctamente       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    FASE 2: SMOKE TEST E2E                        │
│  Duración: 2 minutos                                             │
│  Objetivo: Validar que el framework funciona                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    FASE 3: EJECUCIÓN POR MICROFLUJO              │
│  Duración: 15 minutos                                            │
│  Objetivo: Ejecutar cada microflujo individualmente            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    FASE 4: EJECUCIÓN COMPLETA                   │
│  Duración: 5 minutos                                             │
│  Objetivo: Ejecutar el happy path completo E2E                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    FASE 5: ANÁLISIS Y REPORTE                   │
│  Duración: 10 minutos                                            │
│  Objetivo: Generar reportes y documentar hallazgos              │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Casos de Prueba

#### CP-001: Validación de Ambiente

| Campo | Valor |
|-------|-------|
| **ID** | CP-001 |
| **Nombre** | Validar ambiente de pruebas |
| **Prioridad** | Critical |
| **Tipo** | Setup |
| **Pre-condiciones** | Repositorio clonado, dependencias instaladas |
| **Pasos** | 1. Verificar frontend en localhost:5173<br>2. Verificar backend en localhost:3000<br>3. Verificar ChromeDriver instalado |
| **Resultado Esperado** | Todos los servicios responden con HTTP 200 |
| **Resultado Actual** | (Pendiente ejecución) |
| **Estado** | ⬜ No Ejecutado |

#### CP-002: Microflujo 1 - Homepage

| Campo | Valor |
|-------|-------|
| **ID** | CP-002 |
| **Nombre** | Navegar desde Homepage |
| **Prioridad** | Critical |
| **Tags** | @microflujo-1, @homepage, @critical |
| **Comando** | `mvn clean verify -Dcucumber.filter.tags="@microflujo-1"` |
| **Pasos** | 1. Actor accede a homepage<br>2. Clic en "Cotizar ahora"<br>3. Verificar redirección |
| **Validación** | URL = /quote, título visible |
| **Estado** | ⬜ No Ejecutado |

#### CP-003: Microflujo 2 - Crear Cotización

| Campo | Valor |
|-------|-------|
| **ID** | CP-003 |
| **Nombre** | Crear cotización y generar folio |
| **Prioridad** | Critical |
| **Tags** | @microflujo-2, @crear-cotizacion, @critical |
| **Comando** | `mvn clean verify -Dcucumber.filter.tags="@microflujo-2"` |
| **Pasos** | 1. Estar en /quote<br>2. Clic en "Crear Cotización"<br>3. Verificar folio y estado |
| **Validación** | Folio formato COT-YYYY-NNNNN, estado BORRADOR |
| **Estado** | ⬜ No Ejecutado |

#### CP-004: Microflujo 3 - Seleccionar Inmuebles

| Campo | Valor |
|-------|-------|
| **ID** | CP-004 |
| **Nombre** | Seleccionar 2 inmuebles |
| **Prioridad** | Critical |
| **Tags** | @microflujo-3, @seleccion-inmuebles, @critical |
| **Comando** | `mvn clean verify -Dcucumber.filter.tags="@microflujo-3"` |
| **Pasos** | 1. Seleccionar "2" en campo cantidad<br>2. Clic en "Continuar"<br>3. Verificar fichas |
| **Validación** | 2 fichas creadas, estado PENDIENTE |
| **Estado** | ⬜ No Ejecutado |

#### CP-005: Microflujo 4 - Completar Inmuebles

| Campo | Valor |
|-------|-------|
| **ID** | CP-005 |
| **Nombre** | Completar datos de 2 inmuebles |
| **Prioridad** | Critical |
| **Tags** | @microflujo-4, @completar-inmuebles, @critical |
| **Comando** | `mvn clean verify -Dcucumber.filter.tags="@microflujo-4"` |
| **Pasos** | 1. Completar inmueble 1<br>2. Completar inmueble 2<br>3. Verificar suma asegurada |
| **Validación** | Ambos COMPLETADO, suma = $11,500,000.00 |
| **Estado** | ⬜ No Ejecutado |

#### CP-006: Microflujo 5 - Configurar Coberturas

| Campo | Valor |
|-------|-------|
| **ID** | CP-006 |
| **Nombre** | Configurar coberturas |
| **Prioridad** | Critical |
| **Tags** | @microflujo-5, @configurar-coberturas, @critical, @final |
| **Comando** | `mvn clean verify -Dcucumber.filter.tags="@microflujo-5"` |
| **Pasos** | 1. Ir a coberturas<br>2. Verificar obligatorias<br>3. Activar 3 opcionales<br>4. Guardar |
| **Validación** | 5 coberturas activas, mensaje éxito |
| **Estado** | ⬜ No Ejecutado |

#### CP-007: Happy Path Completo

| Campo | Valor |
|-------|-------|
| **ID** | CP-007 |
| **Nombre** | Ejecutar happy path completo E2E |
| **Prioridad** | Critical |
| **Tags** | @happy-path, @e2e-completo, @critical |
| **Comando** | `mvn clean verify -Dcucumber.filter.tags="@happy-path"` |
| **Pasos** | Ejecutar flujo completo microflujos 1-5 |
| **Validación** | Todos los pasos pasan, reporte generado |
| **Estado** | ⬜ No Ejecutado |

---

## 5. Cronograma de Ejecución

| Fase | Actividad | Duración Estimada | Responsable |
|------|-----------|-------------------|-------------|
| 1 | Validar ambiente | 5 min | QA Engineer |
| 2 | Smoke test E2E | 2 min | QA Engineer |
| 3.1 | Ejecutar CP-002 | 2 min | QA Engineer |
| 3.2 | Ejecutar CP-003 | 2 min | QA Engineer |
| 3.3 | Ejecutar CP-004 | 3 min | QA Engineer |
| 3.4 | Ejecutar CP-005 | 5 min | QA Engineer |
| 3.5 | Ejecutar CP-006 | 3 min | QA Engineer |
| 4 | Ejecutar CP-007 | 5 min | QA Engineer |
| 5 | Generar reportes | 10 min | QA Lead |

**Total Estimado:** 40 minutos

---

## 6. Gestión de Defectos

### 6.1 Severidad de Defectos

| Severidad | Descripción | Ejemplo |
|-----------|-------------|---------|
| **Critical** | Bloquea el flujo E2E | Test no puede completarse |
| **High** | Falla funcional importante | Cobertura no se guarda |
| **Medium** | Problema menor | Timeout excedido ocasionalmente |
| **Low** | Cosmético | Mensaje de error no claro |

### 6.2 Estados de Defectos

```
NUEVO → ASIGNADO → EN_PROGRESO → RESUELTO → VERIFICADO → CERRADO
              ↓
           RECHAZADO
```

### 6.3 Template de Reporte de Defecto

```markdown
**ID:** BUG-XXX
**Título:** [Microflujo X] - Descripción corta
**Severidad:** Critical/High/Medium/Low
**Ambiente:** Local (localhost:5173)
**Navegador:** Chrome XX
**Pasos para Reproducir:**
1. ...
2. ...
**Resultado Esperado:** ...
**Resultado Actual:** ...
**Evidencia:** Screenshot/Log
**Serenity Report:** Link al reporte
```

---

## 7. Reportes y Métricas

### 7.1 Reportes a Generar

| Reporte | Ubicación | Generado por |
|-----------|-----------|--------------|
| Serenity Report | `e2e/target/site/serenity/` | Maven Plugin |
| Cucumber JSON | `e2e/target/cucumber-report.json` | Cucumber |
| Logs de Ejecución | `e2e/target/surefire-reports/` | Maven |
| Screenshots | `e2e/target/site/serenity/screenshots/` | Serenity |

### 7.2 Métricas a Capturar

| Métrica | Fórmula | Objetivo |
|---------|---------|----------|
| Tasa de Éxito | (Passed / Total) * 100 | 100% |
| Tiempo Promedio | Total Time / Total Tests | < 120s |
| Cobertura de Steps | Steps Mapped / Total Steps | 100% |
| Defectos Encontrados | Count | 0 Critical |

### 7.3 Dashboard QA

```
┌────────────────────────────────────────────────────┐
│         RESULTADOS EJECUCIÓN HAPPY PATH            │
├────────────────────────────────────────────────────┤
│                                                     │
│  Tests Ejecutados:     7                           │
│  ✅ Passed:            7 (100%)                    │
│  ❌ Failed:            0 (0%)                      │
│  ⏭️ Skipped:           0 (0%)                     │
│                                                     │
│  Tiempo Total:         38s                         │
│  Promedio por Test:    5.4s                        │
│                                                     │
│  Defectos:             0                           │
│                                                     │
│  Estado:               ✅ APPROVED                 │
│                                                     │
└────────────────────────────────────────────────────┘
```

---

## 8. Checklist de Ejecución

### Pre-ejecución

- [ ] Repositorio actualizado (git pull)
- [ ] Frontend corriendo (`npm run dev`)
- [ ] Backend corriendo (`npm run start:dev`)
- [ ] ChromeDriver compatible instalado
- [ ] Variables de entorno configuradas
- [ ] `serenity.properties` verificado

### Durante Ejecución

- [ ] Ejecutar microflujos en orden
- [ ] Capturar logs en caso de error
- [ ] Tomar screenshots manuales si es necesario
- [ ] Documentar comportamientos inesperados

### Post-ejecución

- [ ] Verificar reporte Serenity generado
- [ ] Revisar screenshots capturadas
- [ ] Documentar hallazgos
- [ ] Actualizar matriz de riesgos
- [ ] Generar QA Report final

---

## 9. Aprobaciones

| Rol | Nombre | Firma | Fecha |
|-----|--------|-------|-------|
| QA Lead | | | |
| Tech Lead | | | |
| Product Owner | | | |

---

## 10. Historial de Cambios

| Versión | Fecha | Autor | Cambios |
|---------|-------|-------|---------|
| 1.0 | 2026-04-21 | QA Lead | Versión inicial |

---

*Documento generado siguiendo los lineamientos de QA del Centro de Excelencia Sofka - Shift-Left Testing*
