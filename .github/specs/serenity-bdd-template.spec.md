---
id: SPEC-015
status: IMPLEMENTED
feature: serenity-bdd-template
created: 2026-04-20
updated: 2026-04-20
author: spec-generator
version: "1.0"
related-specs:
  - SPEC-014
---

# Spec: Template Inicial Serenity BDD + Screenplay Pattern

> **Estado:** `DRAFT` → aprobar con `status: APPROVED` antes de iniciar implementación.

---

## 1. REQUERIMIENTOS

### Descripción
Crear un **template inicial** (scaffold/boilerplate) para proyectos de pruebas de aceptación E2E usando **Serenity BDD** con el patrón **Screenplay**. Este template servirá como punto de partida para cualquier feature que requiera tests automatizados en el flujo ASDD.

El template debe ser **independiente del proyecto** (reutilizable), pero configurable para adaptarse a SeguraX.

### Requerimiento de Negocio
> "Necesito un template base para crear tests E2E con Serenity BDD que siga el patrón Screenplay. El template debe incluir la estructura de carpetas, dependencias Maven, configuración base, y ejemplos de Tasks, Questions y Step Definitions. Debe funcionar como punto de partida para cualquier feature."

---

### Historias de Usuario

#### HU-01: Estructura Base del Proyecto
```gherkin
# language: es
Característica: Estructura base Serenity BDD
  Como desarrollador de QA
  Quiero un template con estructura de carpetas predefinida
  Para no tener que crearla manualmente cada vez

  @template @structure
  Escenario: Estructura de carpetas estándar
    Dado que ejecuto el generador de template
    Cuando se crea el proyecto base
    Entonces debe existir la siguiente estructura:
      | src/test/java/com/segurax/actors/     |
      | src/test/java/com/segurax/tasks/      |
      | src/test/java/com/segurax/questions/  |
      | src/test/java/com/segurax/targets/    |
      | src/test/java/com/segurax/stepdefinitions/ |
      | src/test/resources/features/          |
      | src/test/resources/drivers/           |
    Y debe existir el archivo "pom.xml"
    Y debe existir el archivo "serenity.properties"
```

#### HU-02: Dependencias y Configuración Maven
```gherkin
# language: es
Característica: Configuración Maven
  Como desarrollador de QA
  Quiero un pom.xml con todas las dependencias configuradas
  Para poder ejecutar los tests sin configuración adicional

  @template @maven
  Escenario: Dependencias de Serenity BDD configuradas
    Dado que se genera el template
    Cuando reviso el pom.xml
    Entonces debe incluir:
      | serenity-core           | 4.2.15  |
      | serenity-cucumber       | 4.2.15  |
      | serenity-screenplay     | 4.2.15  |
      | cucumber-java             | 7.20.1  |
      | cucumber-junit            | 7.20.1  |
      | selenium-java           | 4.27.0  |
      | junit                   | 4.13.2  |
    Y debe tener el plugin serenity-maven-plugin configurado
    Y debe tener goals para "aggregate" en post-integration-test

  @template @maven
  Escenario: Java 17 como versión base
    Dado que se revisa el pom.xml
    Entonces maven.compiler.source debe ser "17"
    Y maven.compiler.target debe ser "17"
```

#### HU-03: Ejemplos Funcionales (Hello World)
```gherkin
# language: es
Característica: Ejemplos funcionales base
  Como desarrollador de QA
  Quiero ejemplos de Tasks, Questions y Step Definitions
  Para entender cómo estructurar los tests

  @template @examples
  Escenario: Ejemplo de Task básico
    Dado que existe el archivo "tasks/NavegarA.java"
    Cuando reviso la implementación
    Entonces debe extender de "Task"
    Y debe tener un factory method "a(String url)"
    Y debe usar "Tasks.instrumented()"
    Y debe implementar "performAs(Actor actor)"

  @template @examples
  Escenario: Ejemplo de Question básico
    Dado que existe el archivo "questions/ElTituloDeLaPagina.java"
    Cuando reviso la implementación
    Entonces debe implementar "Question<String>"
    Y debe tener factory method "mostrado()"
    Y debe implementar "answeredBy(Actor actor)"

@template @examples
Escenario: Ejemplo de Step Definitions
  Dado que existe el archivo "stepdefinitions/NavegacionStepDefinitions.java"
  Cuando reviso las anotaciones
  Entonces debe usar @Dado, @Cuando, @Entonces (idioma español)
  Y debe importar "net.serenitybdd.screenplay.actors.OnStage"
  Y debe usar "OnStage.theActorInTheSpotlight()" para acceder al actor
```

#### HU-04: Modelos y Test Data
```gherkin
# language: es
Característica: Modelos y datos de prueba
  Como desarrollador de QA
  Quiero POJOs, Builders y Factories
  Para manejar datos de prueba de forma estructurada

@template @models
Escenario: POJOs para entidades de negocio
  Dado que existe el directorio "models/"
  Cuando reviso los archivos
  Entonces debe existir "Cotizacion.java" con getters/setters
  Y debe existir "Propiedad.java" con datos de inmueble
  Y debe existir "Direccion.java" para direcciones
  Y debe existir "DatosSeguro.java" para coberturas y garantías

@template @models
Escenario: Builder Pattern para crear objetos
  Dado que existe "models/builders/CotizacionBuilder.java"
  Cuando uso el builder
  Entonces puedo crear una cotización con:
    """
    Cotizacion cotizacion = CotizacionBuilder.unaCotizacion()
        .conEmpresa("Mi Empresa SA")
        .conRfc("RFC123456789")
        .conFolio("COT-2026-00001")
        .build();
    """
  Y el objeto debe tener todos los campos seteados

@template @models
Escenario: Factory para datos de prueba (Object Mother)
  Dado que existe "models/factories/CotizacionFactory.java"
  Cuando uso la factory
  Entonces "unaCotizacionValida()" retorna una cotización con datos válidos
  Y "unaCotizacionConFolio(String folio)" retorna cotización personalizada
  Y "unaPropiedadCompleta()" retorna propiedad con todos los datos
  Y "unaPropiedadIncompleta()" retorna propiedad parcial

@template @models
Escenario: Datos reutilizables en steps
  Dado que tengo un step "crea una nueva cotización"
  Cuando el step se ejecuta
  Entonces debe obtener datos de "CotizacionFactory.unaCotizacionValida()"
  Y completar el formulario con esos datos
```

#### HU-05: Configuración de WebDriver
```gherkin
# language: es
Característica: Configuración WebDriver
  Como desarrollador de QA
  Quiero configuración base para WebDriver
  Para ejecutar tests en Chrome, Firefox o Edge

  @template @webdriver
  Escenario: Configuración multi-navegador
    Dado que existe "serenity.properties"
    Cuando reviso las propiedades
    Entonces debe tener "webdriver.driver=chrome" por defecto
    Y debe tener "serenity.take.screenshots=AFTER_EACH_STEP"
    Y debe tener timeout configurado (10 segundos)
    Y debe permitir override por variables de entorno

@template @webdriver
Escenario: ChromeDriver configurado
  Dado que se ejecuta en modo headless opcional
  Entonces debe existir configuración para "--headless"
  Y debe existir configuración para "--no-sandbox"
  Y debe soportar "--window-size=1920,1080"
```

#### HU-06: Feature de Ejemplo Funcional
```gherkin
# language: es
Característica: Feature de ejemplo
  Como desarrollador de QA
  Quiero un feature .feature funcional
  Para verificar que el template funciona correctamente

  @template @feature
  Escenario: Feature "inicio_sesion.feature" de ejemplo
    Dado que existe "src/test/resources/features/inicio_sesion.feature"
    Cuando reviso el contenido
    Entonces debe tener un escenario "Inicio de sesión exitoso"
    Y debe usar lenguaje español
    Y debe tener tags @example @happy-path
    Y debe ser ejecutable con "mvn clean verify"
```

---

### Reglas de Negocio

1. **Reutilizable**: El template debe ser independiente de cualquier feature específico
2. **Configurable**: Debe permitir cambiar URLs, navegador, timeouts sin modificar código
3. **Ejecutable**: `mvn clean verify` debe pasar sin errores (con mocks o página de ejemplo)
4. **Documentado**: Cada clase debe tener JavaDoc explicando su propósito
5. **Extensible**: Fácil de agregar nuevos Tasks, Questions y Features

---

## 2. DISEÑO

### Estructura de Carpetas

```
serenity-bdd-template/
├── pom.xml
├── serenity.properties
├── README.md
├── .gitignore
└── src/test/
    ├── java/com/segurax/
    │   ├── CucumberTestSuite.java
    │   ├── actors/
    │   │   └── ElUsuario.java
│   ├── models/
│   │   ├── Cotizacion.java
│   │   ├── Propiedad.java
│   │   ├── Direccion.java
│   │   ├── DatosSeguro.java
│   │   └── builders/
│   │       └── CotizacionBuilder.java
│   │   └── factories/
│   │       └── CotizacionFactory.java
    │   ├── tasks/
    │   │   ├── NavegarA.java
    │   │   ├── IniciarSesion.java
    │   │   └── Buscar.java
    │   ├── questions/
    │   │   ├── ElTituloDeLaPagina.java
    │   │   ├── ElMensajeDeError.java
    │   │   └── ElTextoVisible.java
    │   ├── targets/
    │   │   ├── PaginaLoginTargets.java
    │   │   └── PaginaPrincipalTargets.java
    │   ├── stepdefinitions/
    │   │   ├── Hooks.java
    │   │   ├── NavegacionStepDefinitions.java
    │   │   └── LoginStepDefinitions.java
    │   └── utils/
    │       └── Esperar.java
    └── resources/
        ├── features/
        │   └── inicio_sesion.feature
        ├── drivers/
        │   └── README.md
        └── serenity.conf
```

### Diagrama de Arquitectura Screenplay

```
┌─────────────────────────────────────────────────────────────────┐
│                    SCREENPLAY PATTERN                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐     ┌──────────────────────────────────┐     │
│  │   ACTOR      │────▶│  "El Usuario"                    │     │
│  └──────────────┘     └──────────────────────────────────┘     │
│         │                                                      │
│         │ attemptsTo()                                         │
│         ▼                                                      │
│  ┌──────────────┐     ┌──────────────────────────────────┐     │
│  │    TASK      │────▶│  NavegarA, IniciarSesion         │     │
│  └──────────────┘     └──────────────────────────────────┘     │
│         │                                                      │
│         │ performAs(Actor)                                     │
│         ▼                                                      │
│  ┌──────────────┐     ┌──────────────────────────────────┐     │
│  │   ACTION     │────▶│  Click, Enter, Select            │     │
│  └──────────────┘     └──────────────────────────────────┘     │
│         │                                                      │
│         │ on(Target)                                           │
│         ▼                                                      │
│  ┌──────────────┐     ┌──────────────────────────────────┐     │
│  │   TARGET     │────▶│  BOTON_LOGIN, CAMPO_USUARIO      │     │
│  └──────────────┘     └──────────────────────────────────┘     │
│                                                                │
│  ┌──────────────┐     ┌──────────────────────────────────┐     │
│  │  QUESTION    │────▶│  ElTituloDeLaPagina              │     │
│  └──────────────┘     └──────────────────────────────────┘     │
│         │                                                      │
│         │ seeThat(Question)                                    │
│         ▼                                                      │
│  ┌──────────────┐     ┌──────────────────────────────────┐     │
│  │ ASSERTION    │────▶│  equalTo, containsText, etc.     │     │
│  └──────────────┘     └──────────────────────────────────┘     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Relación Models con Screenplay

```
┌─────────────────────────────────────────────────────────────────┐
│                    MODELOS + SCREENPLAY                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────┐        ┌──────────────┐                      │
│   │   Model     │───────▶│   Builder    │                      │
│   │  (POJO)     │        │   Pattern    │                      │
│   └─────────────┘        └──────┬───────┘                      │
│          │                       │                              │
│          │                       │ build()                       │
│          │                       ▼                              │
│          │               ┌──────────────┐                      │
│ │ │ Factory │ │
│ │ │ (Test Data) │ │
│ │ └──────┬───────┘ │
│ │ │ │
│ │ ┌───────────────┘ │
│ │ │ │
│ ▼ ▼ │
│ ┌──────────────┐ ┌──────────────┐ │
│ │ Task │◀───│ Actor │ │
│ │ (usa Model │ │ "El Usuario"│ │
│ │ en performAs) └──────────────┘ │
│ └──────────────┘ │
│ │ │
│ │ actor.attemptsTo(CrearCotizacion.con(cotizacion)) │
│ ▼ │
│ ┌──────────────┐ │
│ │ Action │ │
│ │ Enter.theValue(cotizacion.getEmpresa()) │
│ └──────────────┘ │
│ │
└─────────────────────────────────────────────────────────────────┘
```

### Archivos Clave

#### pom.xml
```xml
<project ...>
    <modelVersion>4.0.0</modelVersion>
    
    <groupId>com.segurax</groupId>
    <artifactId>serenity-bdd-template</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <packaging>jar</packaging>
    
    <name>Serenity BDD Template</name>
    <description>Template base para pruebas E2E con Serenity BDD</description>
    
    <properties>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        
        <!-- Serenity Versions -->
        <serenity.version>4.2.15</serenity.version>
        <cucumber.version>7.20.1</cucumber.version>
        <selenium.version>4.27.0</selenium.version>
    </properties>
    
    <dependencies>
        <!-- Serenity BDD -->
        <dependency>
            <groupId>net.serenity-bdd</groupId>
            <artifactId>serenity-core</artifactId>
            <version>${serenity.version}</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>net.serenity-bdd</groupId>
            <artifactId>serenity-cucumber</artifactId>
            <version>${serenity.version}</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>net.serenity-bdd</groupId>
            <artifactId>serenity-screenplay</artifactId>
            <version>${serenity.version}</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>net.serenity-bdd</groupId>
            <artifactId>serenity-screenplay-webdriver</artifactId>
            <version>${serenity.version}</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>net.serenity-bdd</groupId>
            <artifactId>serenity-ensure</artifactId>
            <version>${serenity.version}</version>
            <scope>test</scope>
        </dependency>
        
        <!-- Cucumber -->
        <dependency>
            <groupId>io.cucumber</groupId>
            <artifactId>cucumber-java</artifactId>
            <version>${cucumber.version}</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>io.cucumber</groupId>
            <artifactId>cucumber-junit</artifactId>
            <version>${cucumber.version}</version>
            <scope>test</scope>
        </dependency>
        
        <!-- Selenium -->
        <dependency>
            <groupId>org.seleniumhq.selenium</groupId>
            <artifactId>selenium-java</artifactId>
            <version>${selenium.version}</version>
            <scope>test</scope>
        </dependency>
        
        <!-- JUnit -->
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.13.2</version>
            <scope>test</scope>
        </dependency>
        
        <!-- AssertJ -->
        <dependency>
            <groupId>org.assertj</groupId>
            <artifactId>assertj-core</artifactId>
            <version>3.26.3</version>
            <scope>test</scope>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-surefire-plugin</artifactId>
                <version>3.5.2</version>
                <configuration>
                    <includes>
                        <include>**/*Test.java</include>
                        <include>**/*TestSuite.java</include>
                    </includes>
                    <systemPropertyVariables>
                        <webdriver.driver>${webdriver.driver}</webdriver.driver>
                        <webdriver.chrome.driver>${webdriver.chrome.driver}</webdriver.chrome.driver>
                    </systemPropertyVariables>
                </configuration>
            </plugin>
            <plugin>
                <groupId>net.serenity-bdd.maven.plugins</groupId>
                <artifactId>serenity-maven-plugin</artifactId>
                <version>${serenity.version}</version>
                <executions>
                    <execution>
                        <id>serenity-reports</id>
                        <phase>post-integration-test</phase>
                        <goals>
                            <goal>aggregate</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
</project>
```

#### serenity.properties
```properties
# WebDriver Configuration
webdriver.driver=chrome
webdriver.chrome.driver=src/test/resources/drivers/chromedriver
webdriver.timeouts.implicitlywait=5000
webdriver.timeouts.fluentwait=10000
webdriver.wait.for.timeout=10000

# Application URLs
webdriver.base.url=https://example.com

# Project Configuration
serenity.project.name=Serenity BDD Template - E2E Tests
serenity.test.root=com.segurax

# Reporting Configuration
serenity.console.colors=true
serenity.logging=VERBOSE
serenity.verbose.steps=true
serenity.take.screenshots=FOR_EACH_ACTION
serenity.full.page.screenshot.strategy=true

# Browser Configuration
serenity.browser.width=1920
serenity.browser.height=1080
serenity.restart.browser.for.each=feature
```

#### CucumberTestSuite.java
```java
package com.segurax;

import io.cucumber.junit.CucumberOptions;
import net.serenitybdd.cucumber.CucumberSerenityRunner;
import org.junit.runner.RunWith;

/**
 * Cucumber Test Suite - Entry point for all Serenity BDD tests.
 * 
 * This runner executes all feature files in src/test/resources/features/
 * using the Spanish language (es) for Gherkin scenarios.
 */
@RunWith(CucumberSerenityRunner.class)
@CucumberOptions(
    plugin = {
        "pretty",
        "html:target/cucumber-reports/cucumber-html-report.html",
        "json:target/cucumber-reports/cucumber-report.json"
    },
    features = "src/test/resources/features/",
    glue = {
        "com.segurax.stepdefinitions",
        "com.segurax.hooks"
    },
    tags = "not @wip and not @manual",
    monochrome = true,
    dryRun = false,
    strict = true
)
public class CucumberTestSuite {
    // Test runner - configuration via annotations above
}
```

#### Ejemplo: NavegarA.java (Task)
```java
package com.segurax.tasks;

import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.Tasks;
import net.serenitybdd.screenplay.actions.Open;

/**
 * Task para navegar a una URL específica.
 * 
 * Ejemplo de uso:
 * <pre>
 * elActor.attemptsTo(NavegarA.url("https://example.com"));
 * </pre>
 */
public class NavegarA implements Task {
    
    private final String targetUrl;
    
    public NavegarA(String targetUrl) {
        this.targetUrl = targetUrl;
    }
    
    /**
     * Factory method para crear la tarea.
     * 
     * @param targetUrl URL destino
     * @return instancia de NavegarA
     */
    public static NavegarA url(String targetUrl) {
        return Tasks.instrumented(NavegarA.class, targetUrl);
    }
    
    @Override
    public <T extends Actor> void performAs(T actor) {
        actor.attemptsTo(
            Open.url(targetUrl)
        );
    }
}
```

#### Ejemplo: ElTituloDeLaPagina.java (Question)
```java
package com.segurax.questions;

import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;
import net.serenitybdd.screenplay.questions.page.TheWebPage;

/**
 * Question para obtener el título de la página actual.
 * 
 * Ejemplo de uso:
 * <pre>
 * elActor.should(seeThat(ElTituloDeLaPagina.mostrado(), equalTo("Inicio")));
 * </pre>
 */
public class ElTituloDeLaPagina implements Question<String> {
    
    /**
     * Factory method.
     * 
     * @return instancia de ElTituloDeLaPagina
     */
    public static ElTituloDeLaPagina mostrado() {
        return new ElTituloDeLaPagina();
    }
    
    @Override
    public String answeredBy(Actor actor) {
        return TheWebPage.title().answeredBy(actor);
    }
}
```

#### Ejemplo: Modelos (POJOs)

**Cotizacion.java:**
```java
package com.segurax.models;

import java.time.LocalDate;
import java.util.List;

/**
 * POJO que representa una cotización de seguro.
 * 
 * Ejemplo de uso:
 * <pre>
 * Cotizacion cotizacion = new Cotizacion("COT-2026-00001", "Mi Empresa SA");
 * </pre>
 */
public class Cotizacion {
    private String folio;
    private String empresa;
    private String rfc;
    private String giro;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private String estado;
    private List<Propiedad> propiedades;

    public Cotizacion() {}

    public Cotizacion(String folio, String empresa) {
        this.folio = folio;
        this.empresa = empresa;
        this.estado = "DRAFT";
    }

    // Getters y Setters
    public String getFolio() { return folio; }
    public void setFolio(String folio) { this.folio = folio; }

    public String getEmpresa() { return empresa; }
    public void setEmpresa(String empresa) { this.empresa = empresa; }

    public String getRfc() { return rfc; }
    public void setRfc(String rfc) { this.rfc = rfc; }

    public String getGiro() { return giro; }
    public void setGiro(String giro) { this.giro = giro; }

    public LocalDate getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(LocalDate fechaInicio) { this.fechaInicio = fechaInicio; }

    public LocalDate getFechaFin() { return fechaFin; }
    public void setFechaFin(LocalDate fechaFin) { this.fechaFin = fechaFin; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public List<Propiedad> getPropiedades() { return propiedades; }
    public void setPropiedades(List<Propiedad> propiedades) { this.propiedades = propiedades; }

    @Override
    public String toString() {
        return String.format("Cotizacion{folio='%s', empresa='%s', estado='%s'}", 
            folio, empresa, estado);
    }
}
```

**Propiedad.java:**
```java
package com.segurax.models;

/**
 * POJO que representa una propiedad/inmueble a asegurar.
 */
public class Propiedad {
    private String nombre;
    private Direccion direccion;
    private String tipoConstruccion;
    private int anioConstruccion;
    private int niveles;
    private String uso;
    private String actividadEspecifica;
    private double valorEdificio;
    private double valorContenido;
    private double valorEquipoElectronico;
    private double valorMaquinaria;
    private double valorExistencias;
    private String estado;
    private int porcentajeCompletitud;

    public Propiedad() {}

    // Getters y Setters
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public Direccion getDireccion() { return direccion; }
    public void setDireccion(Direccion direccion) { this.direccion = direccion; }

    public String getTipoConstruccion() { return tipoConstruccion; }
    public void setTipoConstruccion(String tipoConstruccion) { this.tipoConstruccion = tipoConstruccion; }

    public int getAnioConstruccion() { return anioConstruccion; }
    public void setAnioConstruccion(int anioConstruccion) { this.anioConstruccion = anioConstruccion; }

    public int getNiveles() { return niveles; }
    public void setNiveles(int niveles) { this.niveles = niveles; }

    public String getUso() { return uso; }
    public void setUso(String uso) { this.uso = uso; }

    public String getActividadEspecifica() { return actividadEspecifica; }
    public void setActividadEspecifica(String actividadEspecifica) { this.actividadEspecifica = actividadEspecifica; }

    public double getValorEdificio() { return valorEdificio; }
    public void setValorEdificio(double valorEdificio) { this.valorEdificio = valorEdificio; }

    public double getValorContenido() { return valorContenido; }
    public void setValorContenido(double valorContenido) { this.valorContenido = valorContenido; }

    public double getValorEquipoElectronico() { return valorEquipoElectronico; }
    public void setValorEquipoElectronico(double valorEquipoElectronico) { this.valorEquipoElectronico = valorEquipoElectronico; }

    public double getValorMaquinaria() { return valorMaquinaria; }
    public void setValorMaquinaria(double valorMaquinaria) { this.valorMaquinaria = valorMaquinaria; }

    public double getValorExistencias() { return valorExistencias; }
    public void setValorExistencias(double valorExistencias) { this.valorExistencias = valorExistencias; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public int getPorcentajeCompletitud() { return porcentajeCompletitud; }
    public void setPorcentajeCompletitud(int porcentajeCompletitud) { this.porcentajeCompletitud = porcentajeCompletitud; }

    public double getValorTotalCobertura() {
        return valorEdificio + valorContenido + valorEquipoElectronico + 
               valorMaquinaria + valorExistencias;
    }
}
```

**Direccion.java:**
```java
package com.segurax.models;

/**
 * POJO para direcciones.
 */
public class Direccion {
    private String calle;
    private String numero;
    private String colonia;
    private String ciudad;
    private String estado;
    private String codigoPostal;

    public Direccion() {}

    public Direccion(String calle, String colonia, String ciudad, String estado, String codigoPostal) {
        this.calle = calle;
        this.colonia = colonia;
        this.ciudad = ciudad;
        this.estado = estado;
        this.codigoPostal = codigoPostal;
    }

    // Getters y Setters
    public String getCalle() { return calle; }
    public void setCalle(String calle) { this.calle = calle; }

    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }

    public String getColonia() { return colonia; }
    public void setColonia(String colonia) { this.colonia = colonia; }

    public String getCiudad() { return ciudad; }
    public void setCiudad(String ciudad) { this.ciudad = ciudad; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public String getCodigoPostal() { return codigoPostal; }
    public void setCodigoPostal(String codigoPostal) { this.codigoPostal = codigoPostal; }
}
```

**DatosCotizacion.java:**
```java
package com.segurax.models;

import java.time.LocalDate;

/**
 * POJO para datos de cotización.
 */
public class DatosCotizacion {
    private String folio;
    private String empresa;
    private String rfc;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private double valorAsegurado;
    private String tipoCobertura;

    public DatosCotizacion() {}

    // Getters y Setters
    public String getFolio() { return folio; }
    public void setFolio(String folio) { this.folio = folio; }

    public String getEmpresa() { return empresa; }
    public void setEmpresa(String empresa) { this.empresa = empresa; }

    public String getRfc() { return rfc; }
    public void setRfc(String rfc) { this.rfc = rfc; }

    public LocalDate getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(LocalDate fechaInicio) { this.fechaInicio = fechaInicio; }

    public LocalDate getFechaFin() { return fechaFin; }
    public void setFechaFin(LocalDate fechaFin) { this.fechaFin = fechaFin; }

    public double getValorAsegurado() { return valorAsegurado; }
    public void setValorAsegurado(double valorAsegurado) { this.valorAsegurado = valorAsegurado; }

    public String getTipoCobertura() { return tipoCobertura; }
    public void setTipoCobertura(String tipoCobertura) { this.tipoCobertura = tipoCobertura; }
}
```

#### Ejemplo: CotizacionBuilder.java (Builder Pattern)
```java
package com.segurax.models.builders;

import com.segurax.models.Cotizacion;
import com.segurax.models.Propiedad;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Builder para crear instancias de Cotizacion.
 * 
 * Ejemplo de uso:
 * <pre>
 * Cotizacion cotizacion = CotizacionBuilder.unaCotizacion()
 *     .conEmpresa("Mi Empresa SA")
 *     .conRfc("RFC123456789")
 *     .conFolio("COT-2026-00001")
 *     .conPropiedad(PropiedadFactory.unaPropiedadCompleta())
 *     .build();
 * </pre>
 */
public class CotizacionBuilder {
    private String folio;
    private String empresa;
    private String rfc;
    private String giro;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private String estado;
    private List<Propiedad> propiedades;

    private CotizacionBuilder() {
        this.propiedades = new ArrayList<>();
        this.estado = "DRAFT";
    }

    public static CotizacionBuilder unaCotizacion() {
        return new CotizacionBuilder();
    }

    public CotizacionBuilder conFolio(String folio) {
        this.folio = folio;
        return this;
    }

    public CotizacionBuilder conEmpresa(String empresa) {
        this.empresa = empresa;
        return this;
    }

    public CotizacionBuilder conRfc(String rfc) {
        this.rfc = rfc;
        return this;
    }

    public CotizacionBuilder conGiro(String giro) {
        this.giro = giro;
        return this;
    }

    public CotizacionBuilder conFechas(LocalDate inicio, LocalDate fin) {
        this.fechaInicio = inicio;
        this.fechaFin = fin;
        return this;
    }

    public CotizacionBuilder conPropiedad(Propiedad propiedad) {
        this.propiedades.add(propiedad);
        return this;
    }

    public CotizacionBuilder conPropiedades(List<Propiedad> propiedades) {
        this.propiedades.addAll(propiedades);
        return this;
    }

    public CotizacionBuilder conEstado(String estado) {
        this.estado = estado;
        return this;
    }

    public Cotizacion build() {
        Cotizacion cotizacion = new Cotizacion();
        cotizacion.setFolio(folio);
        cotizacion.setEmpresa(empresa);
        cotizacion.setRfc(rfc);
        cotizacion.setGiro(giro);
        cotizacion.setFechaInicio(fechaInicio);
        cotizacion.setFechaFin(fechaFin);
        cotizacion.setEstado(estado);
        cotizacion.setPropiedades(propiedades);
        return cotizacion;
    }
}
```

#### Ejemplo: CotizacionFactory.java (Factory + Test Data)
```java
package com.segurax.models.factories;

import com.segurax.models.Cotizacion;
import com.segurax.models.Direccion;
import com.segurax.models.Propiedad;
import com.segurax.models.builders.CotizacionBuilder;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

/**
 * Factory para crear cotizaciones de prueba.
 * Implementa el patrón Object Mother para datos de test.
 */
public class CotizacionFactory {

    /**
     * Crea una cotización válida para pruebas.
     */
    public static Cotizacion unaCotizacionValida() {
        return CotizacionBuilder.unaCotizacion()
            .conFolio("COT-2026-00001")
            .conEmpresa("Empresa de Prueba SA")
            .conRfc("EPR123456789")
            .conGiro("Tecnología")
            .conFechas(LocalDate.now(), LocalDate.now().plusYears(1))
            .conPropiedad(unaPropiedadCompleta())
            .build();
    }

    /**
     * Crea una cotización con folio personalizado.
     */
    public static Cotizacion unaCotizacionConFolio(String folio) {
        return CotizacionBuilder.unaCotizacion()
            .conFolio(folio)
            .conEmpresa("Empresa Test")
            .conRfc("TEST123456")
            .conGiro("Comercio")
            .conFechas(LocalDate.now(), LocalDate.now().plusMonths(6))
            .build();
    }

    /**
     * Crea una propiedad completa con todos los datos.
     */
    public static Propiedad unaPropiedadCompleta() {
        Propiedad propiedad = new Propiedad();
        propiedad.setNombre("Inmueble Principal");
        propiedad.setDireccion(unaDireccionValida());
        propiedad.setTipoConstruccion("CONCRETO");
        propiedad.setAnioConstruccion(2020);
        propiedad.setNiveles(2);
        propiedad.setUso("COMERCIAL");
        propiedad.setActividadEspecifica("Tienda de abarrotes");
        propiedad.setValorEdificio(1000000);
        propiedad.setValorContenido(500000);
        propiedad.setValorEquipoElectronico(100000);
        propiedad.setValorMaquinaria(0);
        propiedad.setValorExistencias(200000);
        propiedad.setEstado("COMPLETE");
        propiedad.setPorcentajeCompletitud(100);
        return propiedad;
    }

    /**
     * Crea una propiedad incompleta.
     */
    public static Propiedad unaPropiedadIncompleta() {
        Propiedad propiedad = new Propiedad();
        propiedad.setNombre("Inmueble Incompleto");
        propiedad.setDireccion(unaDireccionParcial());
        propiedad.setTipoConstruccion("CONCRETO");
        propiedad.setUso("COMERCIAL");
        propiedad.setActividadEspecifica("Tienda");
        propiedad.setEstado("INCOMPLETE");
        propiedad.setPorcentajeCompletitud(40);
        return propiedad;
    }

    /**
     * Crea múltiples propiedades para pruebas bulk.
     */
    public static List<Propiedad> multiplesPropiedades(int cantidad) {
        return Arrays.asList(
            crearPropiedad("Inmueble 1", "01000", 1000000),
            crearPropiedad("Inmueble 2", "02000", 1500000),
            crearPropiedad("Inmueble 3", "03000", 800000)
        );
    }

    private static Propiedad crearPropiedad(String nombre, String cp, double valor) {
        Propiedad propiedad = new Propiedad();
        propiedad.setNombre(nombre);
        propiedad.setDireccion(unaDireccionConCp(cp));
        propiedad.setValorEdificio(valor);
        propiedad.setEstado("COMPLETE");
        return propiedad;
    }

    /**
     * Crea una dirección válida.
     */
    public static Direccion unaDireccionValida() {
        return new Direccion(
            "Av. Principal",
            "Centro",
            "Ciudad de México",
            "CDMX",
            "01000"
        );
    }

    private static Direccion unaDireccionParcial() {
        return new Direccion(
            "Calle Sin Número",
            "Centro",
            "Ciudad de México",
            "CDMX",
            "01000"
        );
    }

    private static Direccion unaDireccionConCp(String cp) {
        return new Direccion(
            "Av. Secundaria",
            "Colonia",
            "Ciudad",
            "Estado",
            cp
        );
    }
}
```

#### Ejemplo: Hooks.java
```java
package com.segurax.stepdefinitions;

import io.cucumber.java.Before;
import net.serenitybdd.screenplay.actors.OnStage;
import net.serenitybdd.screenplay.actors.OnlineCast;

/**
 * Hooks de Cucumber para configuración global.
 */
public class Hooks {
    
    /**
     * Configura el stage antes de cada escenario.
     * Inicializa el cast de actores.
     */
    @Before
    public void setTheStage() {
        OnStage.setTheStage(new OnlineCast());
    }
}
```

#### Ejemplo: NavegacionStepDefinitions.java
```java
package com.segurax.stepdefinitions;

import com.segurax.questions.ElTituloDeLaPagina;
import com.segurax.tasks.NavegarA;
import io.cucumber.java.es.Cuando;
import io.cucumber.java.es.Dado;
import io.cucumber.java.es.Entonces;
import net.serenitybdd.screenplay.actors.OnStage;

import static net.serenitybdd.screenplay.GivenWhenThen.seeThat;
import static org.hamcrest.Matchers.equalTo;

/**
 * Step Definitions para pasos de navegación.
 */
public class NavegacionStepDefinitions {
    
    @Dado("que {word} navega a {string}")
    public void navegarA(String actorName, String url) {
        OnStage.theActorCalled(actorName).attemptsTo(
            NavegarA.url(url)
        );
    }
    
    @Cuando("navega a la página de inicio")
    public void navegaALaPaginaDeInicio() {
        OnStage.theActorInTheSpotlight().attemptsTo(
            NavegarA.url("/")
        );
    }
    
    @Entonces("el título de la página debe ser {string}")
    public void elTituloDebeSer(String tituloEsperado) {
        OnStage.theActorInTheSpotlight().should(
            seeThat(ElTituloDeLaPagina.mostrado(), equalTo(tituloEsperado))
        );
    }
}
```

#### Ejemplo: crear_cotizacion.feature
```gherkin
# language: es
@example @happy-path @template
Característica: Crear Cotización
  Como usuario del cotizador
  Quiero crear una nueva cotización
  Para asegurar mis propiedades

@ui @smoke
Escenario: Crear una cotización exitosamente
  Dado que "el Usuario" navega a la página de cotizaciones
  Cuando selecciona "Nueva Cotización"
  Y completa los datos de la empresa:
    | campo         | valor             |
    | empresa       | Mi Empresa SA     |
    | rfc           | ABC123456789      |
    | giro          | Tecnología        |
  Entonces debe ver el folio generado con formato "COT-YYYY-NNNNN"
  Y el estado debe ser "DRAFT"

@ui @error
Escenario: Crear cotización con RFC inválido
  Dado que "el Usuario" navega a la página de cotizaciones
  Cuando completa el RFC con "RFCINVALIDO"
  Entonces debe ver el mensaje de error "RFC debe tener 12 o 13 caracteres"
```

---

## 3. LISTA DE TAREAS

### Fase 1: Configuración Base

- [ ] Crear directorio `serenity-bdd-template/`
- [ ] Crear `pom.xml` con dependencias Serenity 4.2.15
- [ ] Crear `serenity.properties` con configuración base
- [ ] Crear `.gitignore` para archivos de Maven y reportes

### Fase 2: Estructura Java

- [ ] Crear `CucumberTestSuite.java` - Runner principal
- [ ] Crear `actors/` con clase de ejemplo `ElUsuario.java`
- [ ] Crear `models/` con POJOs:
  - [ ] `Usuario.java` - Usuario del sistema
  - [ ] `Credenciales.java` - Login credentials
  - [ ] `Direccion.java` - Dirección postal
  - [ ] `DatosCotizacion.java` - Datos de cotización
- [ ] Crear `models/builders/` con:
  - [ ] `CotizacionBuilder.java` - Builder pattern
- [ ] Crear `models/factories/` con:
  - [ ] `CotizacionFactory.java` - Object Mother / Test Data Factory
- [ ] Crear `tasks/` con `NavegarA.java` y `IniciarSesion.java`
- [ ] Crear `questions/` con `ElTituloDeLaPagina.java` y `ElMensajeDeError.java`
- [ ] Crear `targets/` con `PaginaLoginTargets.java`
- [ ] Crear `stepdefinitions/` con `Hooks.java` y `LoginStepDefinitions.java`

### Fase 3: Recursos y Features

- [ ] Crear `src/test/resources/features/crear_cotizacion.feature`
- [ ] Crear `src/test/resources/drivers/README.md` (instrucciones)
- [ ] Crear `src/test/resources/serenity.conf` (config alternativa)

### Fase 4: Documentación

- [ ] Crear `README.md` con:
  - Instrucciones de instalación
  - Cómo ejecutar tests
  - Estructura del proyecto
  - Cómo agregar nuevos tests
- [ ] Agregar JavaDoc a todas las clases

### Fase 5: Verificación

- [ ] Ejecutar `mvn clean verify` sin errores
- [ ] Verificar reporte generado en `target/site/serenity/`
- [ ] Verificar que el feature de ejemplo se ejecuta
- [ ] Documentar cómo usar el template para nuevos features

---

## 4. COMANDOS ÚTILES

```bash
# Compilar proyecto
mvn clean compile test-compile

# Ejecutar todos los tests
mvn clean verify

# Ejecutar tests por tag
mvn clean verify -Dcucumber.filter.tags="@happy-path"

# Ejecutar en modo headless
mvn clean verify -Dheadless.mode=true

# Generar reporte manualmente
mvn serenity:aggregate

# Ejecutar con navegador específico
mvn clean verify -Dwebdriver.driver=firefox

# Ejecutar un feature específico
mvn clean verify -Dcucumber.features="src/test/resources/features/inicio_sesion.feature"
```

---

## 5. PATRONES Y CONVENCIONES

### Nomenclatura

| Componente | Convención | Ejemplo |
|------------|------------|---------|
| Tasks | Verbo en infinitivo + Sustantivo | `NavegarA`, `IniciarSesion` |
| Questions | Artículo + Sustantivo + Estado | `ElTituloDeLaPagina`, `ElMensajeDeError` |
| Targets | Sustantivo en MAYÚSCULAS | `BOTON_LOGIN`, `CAMPO_USUARIO` |
| Step Definitions | *StepDefinitions | `LoginStepDefinitions` |
| Features | snake_case | `inicio_sesion.feature` |

### Estructura de un Task

```java
public class NombreTask implements Task {
    // Atributos privados
    
    // Constructor privado
    
    // Factory method público estático
    public static NombreTask conParametros(...) {
        return Tasks.instrumented(NombreTask.class, ...);
    }
    
    // performAs(Actor actor)
    @Override
    public <T extends Actor> void performAs(T actor) {
        actor.attemptsTo(
            // Acciones
        );
    }
}
```

### Estructura de una Question

```java
public class NombreQuestion implements Question<Tipo> {
    
    // Factory method
    public static NombreQuestion verificacion() {
        return new NombreQuestion();
    }
    
    // answeredBy(Actor actor)
    @Override
    public Tipo answeredBy(Actor actor) {
        return // lógica de verificación
    }
}
```

---

*Fin de la especificación*
