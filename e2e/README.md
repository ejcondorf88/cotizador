# Serenity BDD Template

Template base para pruebas de aceptación E2E usando **Serenity BDD** con el patrón **Screenplay**.

Este proyecto sirve como punto de partida para crear suites de pruebas automatizadas para aplicaciones web.

---

## Características

- ✅ **Serenity BDD 4.2.15** - Framework de testing BDD
- ✅ **Screenplay Pattern** - Patrón de diseño para tests mantenibles
- ✅ **Cucumber 7.20.1** - Gherkin para escenarios de prueba
- ✅ **Selenium 4.27.0** - Automatización de navegador
- ✅ **Java 17** - Versión de Java compatible
- ✅ **Maven** - Gestión de dependencias y build

---

## Estructura del Proyecto

```
serenity-bdd-template/
├── pom.xml                                    # Configuración Maven
├── serenity.properties                        # Configuración Serenity
├── README.md                                  # Este archivo
├── .gitignore                                 # Archivos ignorados por Git
└── src/test/
    ├── java/com/segurax/
    │   ├── CucumberTestSuite.java            # Runner de Cucumber
    │   ├── actors/
    │   │   └── ElUsuario.java                # Actor factory
    │   ├── models/                           # POJOs de negocio
    │   │   ├── Cotizacion.java
    │   │   ├── Propiedad.java
    │   │   ├── Direccion.java
    │   │   ├── builders/
    │   │   │   └── CotizacionBuilder.java    # Builder pattern
    │   │   └── factories/
    │   │       └── CotizacionFactory.java    # Object Mother
    │   ├── tasks/                            # Screenplay Tasks
    │   │   ├── NavegarA.java
    │   │   └── CrearCotizacion.java
    │   ├── questions/                        # Screenplay Questions
    │   │   ├── ElTituloDeLaPagina.java
    │   │   └── ElFolioDeLaCotizacion.java
    │   ├── targets/                          # Elementos UI
    │   │   └── CotizacionTargets.java
    │   └── stepdefinitions/                    # Step Definitions
    │       ├── Hooks.java
    │       └── CotizacionStepDefinitions.java
    └── resources/
        └── features/                          # Archivos .feature
            └── crear_cotizacion.feature
```

---

## Instalación

### Requisitos Previos

- Java 17 o superior
- Maven 3.8+
- Chrome/Chromium (para pruebas con Chrome)
- ChromeDriver (descargar versión compatible con tu Chrome)

### Descargar ChromeDriver

```bash
# macOS con Homebrew
brew install chromedriver

# O descargar manualmente desde:
# https://chromedriver.chromium.org/downloads
```

### Compilar el Proyecto

```bash
# Clonar o copiar el template
cd serenity-bdd-template

# Compilar
cd serenity-bdd-template && mvn clean compile test-compile
```

---

## Cómo Ejecutar Tests

### Ejecutar Todos los Tests

```bash
mvn clean verify
```

### Ejecutar por Tags

```bash
# Ejecutar solo tests @happy-path
mvn clean verify -Dcucumber.filter.tags="@happy-path"

# Ejecutar tests de UI
mvn clean verify -Dcucumber.filter.tags="@ui"

# Excluir tests @wip
mvn clean verify -Dcucumber.filter.tags="not @wip"
```

### Modo Headless

```bash
mvn clean verify -Dheadless.mode=true
```

### Cambiar Navegador

```bash
# Firefox
mvn clean verify -Dwebdriver.driver=firefox

# Edge
mvn clean verify -Dwebdriver.driver=edge
```

### Ejecutar Feature Específico

```bash
mvn clean verify -Dcucumber.features="src/test/resources/features/crear_cotizacion.feature"
```

---

## Ver Reportes

Después de ejecutar los tests, el reporte de Serenity se genera en:

```
target/site/serenity/index.html
```

Abrir en navegador:

```bash
# macOS
open target/site/serenity/index.html

# Linux
xdg-open target/site/serenity/index.html

# Windows
start target/site/serenity/index.html
```

---

## Patrón Screenplay

### Componentes Principales

| Componente | Descripción | Convención de Nombres |
|------------|-------------|----------------------|
| **Actor** | El usuario que ejecuta acciones | `ElUsuario`, `ElAdministrador` |
| **Task** | Lo que el actor intenta hacer | `NavegarA`, `CrearCotizacion` |
| **Question** | Lo que el actor pregunta | `ElTituloDeLaPagina`, `ElFolioDeLaCotizacion` |
| **Target** | Elementos de la UI | `BOTON_NUEVA_COTIZACION`, `CAMPO_EMPRESA` |

### Ejemplo de Task

```java
public class NavegarA implements Task {
    private final String targetUrl;

    public static NavegarA url(String targetUrl) {
        return Tasks.instrumented(NavegarA.class, targetUrl);
    }

    @Override
    public <T extends Actor> void performAs(T actor) {
        actor.attemptsTo(Open.url(targetUrl));
    }
}
```

### Ejemplo de Question

```java
public class ElTituloDeLaPagina implements Question<String> {
    public static ElTituloDeLaPagina mostrado() {
        return new ElTituloDeLaPagina();
    }

    @Override
    public String answeredBy(Actor actor) {
        return TheWebPage.title().answeredBy(actor);
    }
}
```

---

## Cómo Agregar Nuevos Tests

### 1. Crear un Feature File

```gherkin
# language: es
@mi-feature @ui
Característica: Mi Nueva Feature
  Como usuario
  Quiero hacer algo
  Para obtener un beneficio

  @happy-path
  Escenario: Escenario exitoso
    Dado que el navega a la página de inicio
    Cuando realiza una acción
    Entonces debe ver el resultado esperado
```

### 2. Crear Step Definitions

```java
public class MiFeatureStepDefinitions {

    @Dado("que el navega a la página de inicio")
    public void navegarAPaginaDeInicio() {
        OnStage.theActorCalled("el Usuario").attemptsTo(
            NavegarA.url("http://localhost:5173")
        );
    }

    @Cuando("realiza una acción")
    public void realizarAccion() {
        OnStage.theActorInTheSpotlight().attemptsTo(
            // Tasks aquí
        );
    }

    @Entonces("debe ver el resultado esperado")
    public void verificarResultado() {
        OnStage.theActorInTheSpotlight().should(
            seeThat(ElTituloDeLaPagina.mostrado(), equalTo("Resultado"))
        );
    }
}
```

### 3. Crear Tasks Necesarios

```java
public class RealizarAccion implements Task {
    public static RealizarAccion especifica() {
        return Tasks.instrumented(RealizarAccion.class);
    }

    @Override
    public <T extends Actor> void performAs(T actor) {
        actor.attemptsTo(
            Click.on(MisTargets.BOTON_ACCION)
        );
    }
}
```

### 4. Definir Targets

```java
public class MisTargets {
    public static final Target BOTON_ACCION = Target.the("botón acción")
        .located(By.cssSelector("[data-testid='btn-accion']"));
}
```

---

## Modelos y Test Data

### Builder Pattern

```java
Cotizacion cotizacion = CotizacionBuilder.unaCotizacion()
    .conFolio("COT-2026-00001")
    .conEmpresa("Mi Empresa SA")
    .conRfc("RFC123456789")
    .conGiro("Tecnología")
    .conFechas(LocalDate.now(), LocalDate.now().plusYears(1))
    .conPropiedad(unaPropiedad)
    .build();
```

### Factory (Object Mother)

```java
// Datos predefinidos para tests
Cotizacion cotizacion = CotizacionFactory.unaCotizacionValida();

// Datos personalizados
Cotizacion custom = CotizacionFactory.unaCotizacionConFolio("COT-2026-99999");

// Propiedades de prueba
Propiedad propiedad = CotizacionFactory.unaPropiedadCompleta();
List<Propiedad> props = CotizacionFactory.multiplesPropiedades(3);
```

---

## Configuración

### serenity.properties

```properties
# WebDriver
webdriver.driver=chrome
webdriver.base.url=http://localhost:5173

# Timeouts
webdriver.timeouts.implicitlywait=5000
webdriver.wait.for.timeout=10000

# Screenshots
serenity.take.screenshots=FOR_EACH_ACTION
```

### Variables de Entorno

```bash
# Cambiar URL base
export WEBDRIVER_BASE_URL=https://staging.example.com

# Cambiar navegador
export WEBDRIVER_DRIVER=firefox

# Headless mode
export HEADLESS_MODE=true
```

---

## Comandos Útiles

```bash
# Compilar
mvn clean compile test-compile

# Ejecutar tests
mvn clean verify

# Ejecutar por tag
mvn clean verify -Dcucumber.filter.tags="@happy-path"

# Generar reporte manualmente
mvn serenity:aggregate

# Ejecutar en modo debug
mvn clean verify -X

# Saltar tests, solo compilar
mvn clean compile -DskipTests
```

---

## Troubleshooting

### ChromeDriver no encontrado

```bash
# Verificar que chromedriver está en PATH
which chromedriver

# O especificar ruta en serenity.properties
webdriver.chrome.driver=/ruta/al/chromedriver
```

### Elemento no encontrado

- Verificar selectores en `CotizacionTargets.java`
- Aumentar timeouts en `serenity.properties`
- Verificar que la aplicación está corriendo

### Tests muy lentos

- Usar modo headless: `-Dheadless.mode=true`
- Reducir screenshots: `serenity.take.screenshots=BEFORE_AND_AFTER_EACH_STEP`

---

## Recursos

- [Serenity BDD Documentation](https://serenity-bdd.github.io/)
- [Screenplay Pattern](https://serenity-bdd.github.io/docs/screenplay/)
- [Cucumber Documentation](https://cucumber.io/docs/cucumber/)
- [Selenium Documentation](https://www.selenium.dev/documentation/)

---

## Licencia

MIT License - Template para uso interno en SeguraX.

---

## Contacto

Para dudas o soporte, contactar al equipo de QA de SeguraX.
