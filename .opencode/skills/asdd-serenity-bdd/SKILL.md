---
name: asdd-serenity-bdd
description: >
  Genera tests de aceptación E2E con Serenity BDD desde escenarios Gherkin del flujo ASDD.
  Trigger: Cuando se completa Phase 4 (QA) de ASDD y se necesitan tests E2E automáticos,
  cuando hay archivos Gherkin en docs/output/qa/, o cuando se solicita implementar
  pruebas de aceptación con Serenity BDD.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## When to Use

- **Después de Phase 4 (QA)** en el flujo ASDD - cuando el qa-agent generó escenarios Gherkin
- Cuando existen archivos `.md` con escenarios Gherkin en `docs/output/qa/`
- Cuando se necesita implementar pruebas de aceptación E2E automatizadas
- Para validar los features implementados en las spec anteriores
- Cuando el usuario solicita "tests E2E", "pruebas de aceptación", o "Serenity BDD"

## ASDD Integration Flow

```
[ASDD Phase 4 Complete]
         ↓
[Gherkin Scenarios Generated] ← docs/output/qa/*-gherkin.md
         ↓
[THIS SKILL ACTIVATES]
         ↓
[Generate Serenity BDD Tests]
         ↓
[Java Project Structure]
```

## Critical Patterns

### 1. Input: Escenarios Gherkin del QA Agent

Los escenarios vienen en formato:

```gherkin
@happy-path @domain @critico
Escenario: Crear una cotización con folio único
  Dado que el sistema genera un folio con año 2026 y número 1
  Cuando se crea la cotización
  Entonces el folio debe ser "COT-2026-00001"
  Y el estado debe ser "DRAFT"
```

### 2. Output: Proyecto Serenity BDD

Estructura esperada:

```
serenity-tests/
├── pom.xml
├── serenity.properties
└── src/test/java/com/segurax/
    ├── CucumberTestSuite.java
    ├── runners/
    │   └── <Feature>Runner.java
    ├── stepdefinitions/
    │   └── <Feature>StepDefinitions.java
    ├── tasks/
    │   └── <BusinessTask>.java
    ├── questions/
    │   └── <StateQuestion>.java
    ├── targets/
    │   └── <Page>Targets.java
    └── actors/
        └── <User>Actor.java
```

### 3. Transformation Rules

| Gherkin Element | Serenity Component | Naming Pattern |
|----------------|-------------------|----------------|
| `Escenario` | Método @Test o Step | `should<Description>` |
| `Dado que...` | Precondition/Task | `Preparar<Condition>` |
| `Cuando...` | Task | `<Verb><Noun>` |
| `Entonces...` | Assertion with Question | `should(seeThat(...))` |
| `Y...` | Chained Task or Assertion | Same as above |

### 4. Language Conventions

- **Business language**: Spanish (ubiquitous language del dominio)
- **Code**: Java with Spanish business terms
- **Feature files**: Spanish (from Gherkin)
- **Step definitions**: Spanish method names

## Code Examples

### From Gherkin to Serenity

**Input (Gherkin):**
```gherkin
Escenario: Crear una cotización con folio único
  Dado que el sistema genera un folio con año 2026 y número 1
  Cuando se crea la cotización
  Entonces el folio debe ser "COT-2026-00001"
```

**Output (Serenity BDD):**

```java
// Step Definition
@Cuando("se crea la cotización")
public void crearLaCotizacion() {
    elActor.attemptsTo(
        CrearCotizacion.nueva()
    );
}

@Entonces("el folio debe ser {string}")
public void elFolioDebeSer(String folioEsperado) {
    elActor.should(
        seeThat(ElFolioDeLaCotizacion.mostrado(), equalTo(folioEsperado))
    );
}

// Task
public class CrearCotizacion implements Task {
    public static CrearCotizacion nueva() {
        return Tasks.instrumented(CrearCotizacion.class);
    }

    @Override
    public <T extends Actor> void performAs(T actor) {
        actor.attemptsTo(
            Click.on(CotizacionTargets.BOTON_NUEVA_COTIZACION),
            WaitUntil.the(CotizacionTargets.FORMULARIO_COTIZACION, isVisible())
        );
    }
}

// Question
public class ElFolioDeLaCotizacion implements Question<String> {
    public static ElFolioDeLaCotizacion mostrado() {
        return new ElFolioDeLaCotizacion();
    }

    @Override
    public String answeredBy(Actor actor) {
        return Text.of(CotizacionTargets.CAMPO_FOLIO).answeredBy(actor);
    }
}
```

### Feature File Structure

```java
@RunWith(CucumberWithSerenity.class)
@CucumberOptions(
    plugin = {"pretty"},
    features = "src/test/resources/features/",
    glue = "com.segurax.stepdefinitions"
)
public class CucumberTestSuite {}
```

### Target Definition

```java
public class CotizacionTargets {
    public static final Target BOTON_NUEVA_COTIZACION = 
        Target.the("botón nueva cotización")
              .locatedBy("button[data-testid='btn-nueva-cotizacion']");
    
    public static final Target CAMPO_FOLIO = 
        Target.the("campo folio")
              .locatedBy("input[name='folioNumber']");
    
    public static final Target FORMULARIO_COTIZACION = 
        Target.the("formulario cotización")
              .locatedBy("form[data-testid='form-cotizacion']");
}
```

## Implementation Workflow

### Step 1: Discover Gherkin Scenarios

1. Look for files matching `docs/output/qa/*-gherkin.md`
2. Parse scenarios and extract:
   - Feature name
   - Background (if any)
   - Scenarios with tags
   - Steps (Given/When/Then/And)

### Step 2: Map to Serenity Components

```
Feature → Java Package + Feature File
Scenario → @Test method in Step Definitions
Given → @Dado step definition + Task
When → @Cuando step definition + Task  
Then → @Entonces step definition + Question
And → Continue chain
```

### Step 3: Generate Code

**Order of generation:**
1. `pom.xml` - Dependencies (Serenity, Cucumber, WebDriver)
2. `serenity.properties` - Configuration
3. `CucumberTestSuite.java` - Runner
4. `targets/*Targets.java` - UI locators (stubs)
5. `tasks/*Task.java` - Business actions
6. `questions/*Question.java` - Assertions
7. `stepdefinitions/*StepDefinitions.java` - Glue code
8. `features/*.feature` - Gherkin files

### Step 4: Tag-Based Organization

Use Gherkin tags to organize tests:

| Tag | Purpose | Serenity Filter |
|-----|---------|-----------------|
| `@happy-path` | Tests positivos | `--tags "@happy-path"` |
| `@error-path` | Tests de error | `--tags "@error-path"` |
| `@edge-case` | Casos límite | `--tags "@edge-case"` |
| `@critico` | Críticos para release | `--tags "@critico"` |
| `@domain` | Unit tests (skip E2E) | `--tags "not @domain"` |

## Commands

```bash
# Initialize Serenity project
cd serenity-tests
mvn clean verify

# Run specific tags
mvn clean verify -Dcucumber.filter.tags="@happy-path"

# Run with specific browser
mvn clean verify -Dwebdriver.driver=chrome

# Generate report
mvn serenity:aggregate

# Open report
open target/site/serenity/index.html
```

## Maven Dependencies (pom.xml)

```xml
<dependencies>
    <!-- Serenity BDD -->
    <dependency>
        <groupId>net.serenity-bdd</groupId>
        <artifactId>serenity-core</artifactId>
        <version>${serenity.version}</version>
    </dependency>
    <dependency>
        <groupId>net.serenity-bdd</groupId>
        <artifactId>serenity-cucumber6</artifactId>
        <version>${serenity.version}</version>
    </dependency>
    <dependency>
        <groupId>net.serenity-bdd</groupId>
        <artifactId>serenity-screenplay</artifactId>
        <version>${serenity.version}</version>
    </dependency>
    <dependency>
        <groupId>net.serenity-bdd</groupId>
        <artifactId>serenity-screenplay-webdriver</artifactId>
        <version>${serenity.version}</version>
    </dependency>
    
    <!-- WebDriver -->
    <dependency>
        <groupId>org.seleniumhq.selenium</groupId>
        <artifactId>selenium-java</artifactId>
        <version>${selenium.version}</version>
    </dependency>
    
    <!-- Testing -->
    <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>4.13.2</version>
        <scope>test</scope>
    </dependency>
</dependencies>
```

## Resources

- **Base Skill**: See `serenity-bdd` for Screenplay Pattern fundamentals
- **Templates**: See [assets/](assets/) for:
  - `pom.xml` template
  - `serenity.properties` template
  - `CucumberTestSuite.java` template
  - `StepDefinitions.java` template
- **Gherkin Source**: Read from `docs/output/qa/*-gherkin.md`

## Common Patterns by Feature Type

### Authentication Flows
```java
// Task chain for login
theActor.attemptsTo(
    IniciarSesion.como(usuario).conPassword(password),
    Ensure.that(ElMensajeDeBienvenida.mostrado(), containsText("Bienvenido"))
);
```

### CRUD Operations
```java
// Create
CrearRecurso.conDatos(datos);

// Read
ConsultarRecurso.porId(id);

// Update
ActualizarRecurso.conId(id).conDatos(nuevosDatos);

// Delete
EliminarRecurso.porId(id);
```

### Validation Flows
```java
// Validate error messages
elActor.should(
    seeThat(ElMensajeDeError.mostrado(), equalTo(mensajeEsperado))
);
```

## Configuration Files

### serenity.properties
```properties
webdriver.driver=chrome
webdriver.chrome.driver=src/test/resources/drivers/chromedriver
serenity.project.name=Cotizador SeguraX - E2E Tests
serenity.test.root=com.segurax.features
serenity.console.colors=true
serenity.logging=VERBOSE
```

## Checklist Before Running

- [ ] Gherkin scenarios exist in `docs/output/qa/`
- [ ] `pom.xml` has correct dependencies
- [ ] `serenity.properties` is configured
- [ ] Feature files are in `src/test/resources/features/`
- [ ] WebDriver is installed (Chrome/ChromeDriver)
- [ ] Application under test is running
- [ ] Base URL is configured

## Output

After execution:
- **Test Results**: `target/serenity-reports/`
- **HTML Report**: `target/site/serenity/index.html`
- **JSON Results**: `target/cucumber-reports/`
