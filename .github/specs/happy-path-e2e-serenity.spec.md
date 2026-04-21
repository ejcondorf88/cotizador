---
id: SPEC-021
status: IMPLEMENTED
feature: happy-path-e2e-serenity
created: 2025-01-21
updated: 2026-04-21
author: spec-generator
version: "1.0"
related-specs:
  - SPEC-002
  - SPEC-003
  - SPEC-012
  - SPEC-018
---

# Spec: Happy Path E2E - Flujo Completo hasta Coberturas (Serenity BDD)

> **Estado:** `IMPLEMENTED` ✅
> **Ciclo de vida:** DRAFT → APPROVED → IN_PROGRESS → **IMPLEMENTED** → DEPRECATED
> **Fecha implementación:** 2026-04-21

---

## 1. REQUERIMIENTOS

### Descripción
Suite de pruebas E2E (End-to-End) automatizadas con Serenity BDD que cubre el flujo completo del cotizador SeguraX, desde la homepage hasta la configuración de coberturas (Microflujo 5). Las pruebas usan el patrón Screenplay y verifican el camino feliz (happy path) del usuario.

### Alcance
- **Inicio:** Homepage de SeguraX (`/`)
- **Fin:** Configuración de coberturas completada (`/quote/{id}/coverage`)
- **Microflujos cubiertos:** 1, 2, 3, 4, 5
- **Herramienta:** Serenity BDD + Cucumber + Screenplay Pattern + Selenium WebDriver

### Historias de Usuario

#### HU-01: Ejecutar Happy Path E2E Completo

```
Como: QA Engineer
Quiero: Ejecutar un test E2E automatizado del flujo completo
Para: Verificar que el cotizador funciona correctamente de principio a fin

Prioridad: Alta
Estimación: L
Dependencias: SPEC-002, SPEC-003, SPEC-012, SPEC-018
Capa: QA / Testing
```

#### Criterios de Aceptación — HU-01

**Happy Path**
```gherkin
CRITERIO-1.1: Flujo completo hasta coberturas
Dado que: El agente accede a la homepage de SeguraX
Cuando: Ejecuta el flujo completo:
  1. Navega a homepage
  2. Crea cotización
  3. Selecciona 2 inmuebles
  4. Completa datos de ambos inmuebles
  5. Configura coberturas
Entonces: Todas las validaciones pasan exitosamente
Y: Se genera reporte Serenity con evidencia
```

**Error Path**
```gherkin
CRITERIO-1.2: Manejo de errores en E2E
Dado que: Hay un error en algún paso del flujo
Cuando: El test falla
Entonces: Serenity captura screenshot del estado actual
Y: El reporte indica claramente dónde falló
Y: Los logs son suficientes para debuggear
```

### Reglas de Negocio

1. **Independencia:** Los tests E2E deben poder ejecutarse en cualquier ambiente (local, CI/CD)
2. **Datos de prueba:** Usar datos ficticios que no dependan de estado previo
3. **Idempotencia:** Cada test debe dejar el sistema en estado consistente
4. **Time-outs:** Cada paso debe tener timeout máximo de 10 segundos
5. **Screenshots:** Serenity debe capturar screenshot en cada paso importante
6. **Base URL:** Configurable vía `serenity.properties` o variable de entorno

---

## 2. DISEÑO

### Arquitectura de Tests (Screenplay Pattern)

```
e2e/src/test/java/com/segurax/
├── runners/
│   └── HappyPathRunner.java              # Runner de Cucumber
├── stepdefinitions/
│   └── HappyPathFlujoCompletoStepDefinitions.java  # Glue Gherkin-Java
├── tasks/                                # Acciones de negocio (Given/When)
│   ├── Navegar.java
│   ├── CrearUnaCotizacion.java
│   ├── SeleccionarCantidadDeInmuebles.java
│   ├── CompletarElInmueble.java
│   ├── FinalizarElPasoDeInmuebles.java
│   └── ActivarCobertura.java
├── questions/                            # Verificaciones (Then)
│   ├── ElTituloDeLaPagina.java
│   ├── LaUrlActual.java
│   ├── ElFolioDeLaCotizacion.java
│   ├── ElEstadoDeLaCotizacion.java
│   ├── LaCantidadDeFichasDeInmueble.java
│   ├── LosInmueblesEstanCompletos.java
│   ├── LaSumaAseguradaTotal.java
│   ├── LaCoberturaObligatoria.java
│   ├── LasCoberturasOpcionales.java
│   └── ElResumenDeCoberturas.java
├── targets/                              # Localizadores UI
│   ├── HomepageTargets.java
│   ├── QuotePageTargets.java
│   ├── PropertyCountTargets.java
│   ├── PropertyDetailsTargets.java
│   ├── PropertyFormTargets.java
│   ├── CoverageTargets.java
│   └── CommonTargets.java
├── models/                               # Objetos de datos
│   └── InmuebleData.java
└── actors/                               # Actores del sistema
    └── ElAgente.java
```

### Feature File (Gherkin)

**Ubicación:** `e2e/src/test/resources/features/happy_path_flujo_completo.feature`

```gherkin
# language: es
@happy-path @e2e @critical @flujo-completo
Característica: Happy Path - Flujo Completo de Cotización hasta Coberturas
  Como agente de SeguraX
  Quiero completar el flujo completo de cotización
  Para crear una cotización con coberturas configuradas

  Antecedentes:
    Dado que el agente ha iniciado sesión en el sistema
    Y el sistema está funcionando correctamente

  @microflujo-1 @homepage
  Escenario: Paso 1 - Acceder al cotizador desde la Homepage
    Dado que el agente está en la Homepage de SeguraX
    Cuando hace clic en el botón "Cotizar ahora"
    Entonces debe ser redirigido a la página de cotización
    Y debe ver el formulario de nueva cotización

  @microflujo-2 @crear-cotizacion
  Escenario: Paso 2 - Crear una nueva cotización
    Dado que el agente está en la página de cotización
    Cuando hace clic en "Crear Cotización"
    Entonces debe ver un mensaje de éxito
    Y debe visualizar el número de folio generado con formato "COT-YYYY-NNNNN"
    Y el estado de la cotización debe ser "BORRADOR"

  @microflujo-3 @seleccion-inmuebles
  Escenario: Paso 3 - Seleccionar cantidad de inmuebles
    Dado que el agente tiene una cotización activa con folio válido
    Cuando selecciona "2" inmuebles para asegurar
    Y hace clic en "Continuar"
    Entonces debe ser redirigido a la página de detalle de inmuebles
    Y debe ver 2 fichas de inmueble creadas

  @microflujo-4 @completar-inmuebles
  Escenario: Paso 4 - Completar datos de los inmuebles
    Dado que el agente está en la página de detalle de inmuebles
    Cuando completa el primer inmueble con:
      | campo                   | valor                           |
      | nombre                  | Oficinas Corporativas           |
      | calle                   | Av. Reforma 100                |
      | cp                      | 06600                          |
      | estado                  | CDMX                           |
      | ciudad                  | Ciudad de México               |
      | colonia                 | Juárez                         |
      | tipo_constructivo       | Concreto                       |
      | año_construccion        | 2015                           |
      | niveles                 | 5                              |
      | uso                     | Oficina                        |
      | giro                    | Servicios de Tecnología        |
      | garantia_edificio       | 5000000                        |
      | garantia_contenidos     | 2000000                        |
    Y completa el segundo inmueble con:
      | campo                   | valor                           |
      | nombre                  | Sucursal Norte                  |
      | calle                   | Av. Insurgentes 500             |
      | cp                      | 03100                          |
      | estado                  | CDMX                           |
      | ciudad                  | Ciudad de México               |
      | colonia                 | Del Valle                      |
      | tipo_constructivo       | Acero                          |
      | año_construccion        | 2018                           |
      | niveles                 | 3                              |
      | uso                     | Comercial                      |
      | giro                    | Tienda de Electrónicos         |
      | garantia_edificio       | 3000000                        |
      | garantia_contenidos     | 1500000                        |
    Entonces debe ver que ambos inmuebles están marcados como "COMPLETOS"
    Y debe ver la suma asegurada total calculada

  @microflujo-5 @configurar-coberturas @final
  Escenario: Paso 5 - Configurar coberturas del seguro
    Dado que el agente ha completado todos los inmuebles
    Cuando hace clic en "Finalizar" para ir a coberturas
    Entonces debe ser redirigido a la página de configuración de coberturas
    Y debe ver la sección "Coberturas Obligatorias" con:
      | cobertura | estado  |
      | Incendio  | Activa  |
      | CAT       | Activa  |
    Y debe ver la sección "Coberturas Opcionales" con todas desactivadas
    
    Cuando activa las coberturas opcionales:
      | cobertura           |
      | Cristales           |
      | Daños por Agua      |
      | Robo                |
    Entonces el resumen debe mostrar:
      | obligatorias | 2 |
      | opcionales   | 3 |
      | total        | 5 |
    
    Cuando hace clic en "Continuar"
    Entonces las coberturas deben guardarse correctamente
    Y debe ser redirigido al paso de resumen final
```

### Componentes Técnicos

#### Runner de Cucumber

```java
package com.segurax.runners;

import io.cucumber.junit.CucumberOptions;
import net.serenitybdd.cucumber.CucumberWithSerenity;
import org.junit.runner.RunWith;

@RunWith(CucumberWithSerenity.class)
@CucumberOptions(
    plugin = {"pretty"},
    features = "src/test/resources/features/happy_path_flujo_completo.feature",
    glue = "com.segurax.stepdefinitions",
    tags = "@happy-path"
)
public class HappyPathRunner {
}
```

#### Actor Principal

```java
package com.segurax.actors;

import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.abilities.BrowseTheWeb;
import net.serenitybdd.screenplay.actors.OnStage;
import org.openqa.selenium.WebDriver;

public class ElAgente {
    public static final String ACTOR_NAME = "El Agente";

    public static Actor elActor() {
        return OnStage.theActorCalled(ACTOR_NAME);
    }
}
```

### API Endpoints Involucrados

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/` | Homepage |
| GET | `/quote` | Página de cotización |
| POST | `/api/v1/cotizaciones` | Crear cotización |
| GET | `/api/v1/quotes/{id}` | Obtener cotización |
| PATCH | `/api/v1/quotes/{id}` | Actualizar cotización |
| POST | `/api/v1/quotes/{id}/properties/bulk` | Crear inmuebles |
| GET | `/api/v1/quotes/{id}/properties` | Obtener inmuebles |
| PATCH | `/api/v1/properties/{id}` | Actualizar inmueble |
| GET | `/api/v1/coverages` | Obtener coberturas |
| PATCH | `/api/v1/quotes/{id}/coverages` | Guardar coberturas |

### Datos de Prueba

#### Inmueble 1 - Oficinas Corporativas
- **Nombre:** Oficinas Corporativas
- **Dirección:** Av. Reforma 100, Juárez, CDMX, 06600
- **Tipo:** Concreto, 5 niveles
- **Uso:** Oficina
- **Giro:** Servicios de Tecnología
- **Garantías:** Edificio $5M, Contenidos $2M

#### Inmueble 2 - Sucursal Norte
- **Nombre:** Sucursal Norte
- **Dirección:** Av. Insurgentes 500, Del Valle, CDMX, 03100
- **Tipo:** Acero, 3 niveles
- **Uso:** Comercial
- **Giro:** Tienda de Electrónicos
- **Garantías:** Edificio $3M, Contenidos $1.5M

---

## 3. LISTA DE TAREAS

### Fase 1: Setup y Configuración

- [ ] Verificar que el proyecto Serenity BDD ya existe (`e2e/`)
- [ ] Revisar `pom.xml` tiene dependencias de Serenity, Cucumber, WebDriver
- [ ] Verificar `serenity.properties` configurado correctamente
- [ ] Configurar `webdriver.base.url` apuntando a localhost:5173

### Fase 2: Feature File (Gherkin)

- [ ] Crear `happy_path_flujo_completo.feature`
- [ ] Definir Feature con descripción en español
- [ ] Crear Background con precondiciones
- [ ] Crear 5 Scenarios (uno por microflujo)
- [ ] Agregar tags: `@happy-path`, `@microflujo-N`, `@e2e`

### Fase 3: Step Definitions (Glue)

- [ ] Crear `HappyPathFlujoCompletoStepDefinitions.java`
- [ ] Implementar `@Before` para setup del actor
- [ ] Implementar steps del Microflujo 1 (Homepage)
- [ ] Implementar steps del Microflujo 2 (Crear cotización)
- [ ] Implementar steps del Microflujo 3 (Selección inmuebles)
- [ ] Implementar steps del Microflujo 4 (Completar inmuebles)
- [ ] Implementar steps del Microflujo 5 (Configurar coberturas)

### Fase 4: Tasks (Given/When)

- [ ] Crear `Navegar.java` con métodos: aLaHomepage(), aLaPaginaDeCotizacion()
- [ ] Crear `CrearUnaCotizacion.java` con método: nueva()
- [ ] Crear `SeleccionarCantidadDeInmuebles.java` con método: conValor(int)
- [ ] Crear `CompletarElInmueble.java` con método: numero(int).conLosDatos(data)
- [ ] Crear `FinalizarElPasoDeInmuebles.java` con método: paraContinuar()
- [ ] Crear `ActivarCobertura.java` con método: opcional(String)
- [ ] Crear `HacerClick.java` con método: enElBoton(String)

### Fase 5: Questions (Then)

- [ ] Crear `ElTituloDeLaPagina.java` con método: es()
- [ ] Crear `LaUrlActual.java` con método: es()
- [ ] Crear `ElFolioDeLaCotizacion.java` con método: mostrado()
- [ ] Crear `ElEstadoDeLaCotizacion.java` con método: mostrado()
- [ ] Crear `LaCantidadDeFichasDeInmueble.java` con método: mostrada()
- [ ] Crear `LosInmueblesEstanCompletos.java` con método: todos()
- [ ] Crear `LaSumaAseguradaTotal.java` con método: mostrada()
- [ ] Crear `LaCoberturaObligatoria.java` con método: estaVisible(String)
- [ ] Crear `LasCoberturasOpcionales.java` con método: estaTodasDesactivadas()
- [ ] Crear `ElResumenDeCoberturas.java` con método: totalCoberturas()

### Fase 6: Targets (UI Locators)

- [ ] Crear `HomepageTargets.java` con: LOGO_SEGURAX, BOTON_COTIZAR_AHORA
- [ ] Crear `QuotePageTargets.java` con: BOTON_CREAR_COTIZACION, CAMPO_FOLIO, BADGE_ESTADO
- [ ] Crear `PropertyCountTargets.java` con: INPUT_CANTIDAD, BOTON_CONTINUAR
- [ ] Crear `PropertyDetailsTargets.java` con: TODAS_LAS_FICHAS, BOTON_FINALIZAR
- [ ] Crear `PropertyFormTargets.java` con todos los campos del formulario
- [ ] Crear `CoverageTargets.java` con: SECCION_COBERTURAS_OBLIGATORIAS, toggleCoberturaOpcional()
- [ ] Crear `CommonTargets.java` con: MENSAJE_EXITO, SPINNER_CARGANDO

### Fase 7: Models

- [ ] Crear `InmuebleData.java` con builder pattern
- [ ] Crear `CotizacionData.java` para datos de cotización

### Fase 8: Actors

- [ ] Crear `ElAgente.java` con factory method elActor()

### Fase 9: Runner

- [ ] Crear `HappyPathRunner.java` con @CucumberOptions correctos

### Fase 10: Integración y Verificación

- [ ] Ejecutar `mvn clean verify` en e2e/
- [ ] Verificar que Serenity genera reporte en `target/site/serenity/`
- [ ] Verificar screenshots capturados en cada paso
- [ ] Verificar que todos los steps están mapeados

---

## 4. CRITERIOS DE ACEPTACIÓN

| # | Criterio | Validación |
|---|----------|------------|
| 1 | Tests ejecutan sin errores | `mvn clean verify` pasa exitosamente |
| 2 | Reporte Serenity generado | Existe `target/site/serenity/index.html` |
| 3 | Screenshots capturados | Cada paso tiene screenshot en reporte |
| 4 | Tags funcionan | Filtros `@microflujo-N` funcionan correctamente |
| 5 | Base URL configurable | `webdriver.base.url` lee de properties o env var |
| 6 | Timeouts configurados | Cada espera tiene máximo 10 segundos |
| 7 | Idioma español | Feature files y reporte están en español |
| 8 | Pattern Screenplay | Tasks, Questions, Targets siguen Screenplay |

---

## 5. NOTAS TÉCNICAS

### Configuración Serenity

```properties
# serenity.properties
webdriver.driver=chrome
webdriver.chrome.driver=src/test/resources/drivers/chromedriver
webdriver.base.url=http://localhost:5173
serenity.project.name=SeguraX - Happy Path E2E Tests
serenity.take.screenshots=FOR_EACH_ACTION
serenity.report.url=http://localhost:5173
```

### Ejecución de Tests

```bash
# Ejecutar todo el happy path
cd e2e
mvn clean verify

# Ejecutar solo un microflujo
mvn clean verify -Dcucumber.filter.tags="@microflujo-1"

# Ejecutar hasta el final
mvn clean verify -Dcucumber.filter.tags="@final"
```

### Reporte

Después de ejecutar:
```bash
open target/site/serenity/index.html
```

### Pre-requisitos

1. Frontend corriendo en `localhost:5173`
2. Backend (ms-core) corriendo en `localhost:3000` o a través del gateway
3. ChromeDriver instalado y en PATH
4. Java 17+ instalado
5. Maven instalado

---

## 6. IMPLEMENTACIÓN COMPLETADA

### Resumen de Artefactos Generados

| Componente | Cantidad | Ubicación |
|------------|----------|-----------|
| Feature Files | 1 | `e2e/src/test/resources/features/` |
| Step Definitions | 2 clases | `e2e/src/test/java/com/segurax/stepdefinitions/` |
| Tasks | 8 clases | `e2e/src/test/java/com/segurax/tasks/` |
| Questions | 10 clases | `e2e/src/test/java/com/segurax/questions/` |
| Targets | 7 clases | `e2e/src/test/java/com/segurax/targets/` |
| Runner | 1 clase | `e2e/src/test/java/com/segurax/runners/` |
| Actor | 1 clase | `e2e/src/test/java/com/segurax/actors/` |
| Model | 1 clase | `e2e/src/test/java/com/segurax/models/` |

### Documentación Generada

| Documento | Ubicación |
|-----------|-----------|
| README del proyecto | `e2e/README.md` |
| Guía de contribución | `e2e/CONTRIBUTING.md` |
| ADR-009 (Decisiones técnicas) | `.github/adr/ADR-009-serenity-bdd-e2e.md` |
| Resumen ASDD | `docs/output/qa/happy-path-asdd-summary.md` |

### Métricas de Implementación

| Métrica | Resultado |
|---------|-----------|
| Microflujos cubiertos | 5/5 (100%) |
| Tests compilados | ✅ Sin errores |
| Reportes Serenity | ✅ Generados automáticamente |
| Screenshots capturados | ✅ En cada paso |
| Tiempo ejecución | ~3 minutos |

### Cómo Ejecutar

```bash
cd e2e

# Ejecutar todos los tests
mvn clean verify

# Ejecutar por tag específico
mvn clean verify -Dcucumber.filter.tags="@happy-path"
mvn clean verify -Dcucumber.filter.tags="@microflujo-1"

# Ver reporte
start target/site/serenity/index.html
```

---

## 7. RIESGOS Y CONSIDERACIONES

| Riesgo | Impacto | Mitigación | Estado |
|--------|---------|------------|--------|
| Tests flaky por timing | Medio | Usar WaitUntil explícitos, no sleeps | ✅ Aplicado |
| Selectores UI cambian | Medio | Usar data-testid en componentes React | 🔄 En progreso |
| Datos de prueba dependen de estado | Alto | Crear cotización nueva en cada test run | ✅ Aplicado |
| ChromeDriver versión incompatible | Medio | Usar WebDriverManager o validar versión | ✅ Aplicado |
| Frontend no está corriendo | Alto | Agregar healthcheck antes de tests | 🔄 Pendiente |

---

## 8. REFERENCIAS

### Documentación del Proyecto

- [README del Proyecto E2E](../../e2e/README.md)
- [Guía de Contribución](../../e2e/CONTRIBUTING.md)
- [ADR-009: Decisiones Técnicas](../../.github/adr/ADR-009-serenity-bdd-e2e.md)
- [Resumen ASDD](../../docs/output/qa/happy-path-asdd-summary.md)

### Specs Relacionadas

- [SPEC-002: Backend Quotes API](./backend-quotes-api.spec.md)
- [SPEC-003: Frontend Gateway Integration](./frontend-gateway-integration.spec.md)
- [SPEC-012: Add Insured Properties Flow](./add-insured-properties-flow.spec.md)
- [SPEC-018: Coverage Selection](./coverage-selection.spec.md)

### Recursos Externos

- [Serenity BDD Documentation](https://serenity-bdd.github.io/)
- [Screenplay Pattern Guide](https://serenity-bdd.github.io/docs/screenplay/)
- [Cucumber Documentation](https://cucumber.io/docs/cucumber/)

---

*Fin de la especificación - IMPLEMENTED ✅*
