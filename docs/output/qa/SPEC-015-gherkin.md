# Casos Gherkin Adicionales — SPEC-015: Serenity BDD Template

**Fecha:** 2026-04-20  
**Versión:** 1.0  
**Propósito:** Escenarios adicionales para fortalecer el template

---

## Escenarios de Template Validación

### Feature 1: Validación de Estructura del Proyecto

```gherkin
# language: es
@template @structure @validation
Característica: Validación de estructura del template
  Como desarrollador de QA
  Quiero verificar que la estructura del template sea correcta
  Para asegurar que todos los componentes necesarios existen

  @smoke @critico
  Escenario: Todas las carpetas del template existen
    Dado que se revisa el directorio "serenity-bdd-template/"
    Cuando se verifican las carpetas requeridas
    Entonces debe existir "src/test/java/com/segurax/actors/"
    Y debe existir "src/test/java/com/segurax/tasks/"
    Y debe existir "src/test/java/com/segurax/questions/"
    Y debe existir "src/test/java/com/segurax/targets/"
    Y debe existir "src/test/java/com/segurax/stepdefinitions/"
    Y debe existir "src/test/java/com/segurax/models/"
    Y debe existir "src/test/java/com/segurax/models/builders/"
    Y debe existir "src/test/java/com/segurax/models/factories/"
    Y debe existir "src/test/resources/features/"

  @smoke @critico
  Escenario: Archivos de configuración existen
    Dado que se revisa la raíz del proyecto
    Cuando se verifican los archivos de configuración
    Entonces debe existir "pom.xml"
    Y debe existir "serenity.properties"
    Y debe existir ".gitignore"
    Y debe existir "README.md"
```

---

### Feature 2: Validación de Configuración Maven

```gherkin
# language: es
@template @maven @validation
Característica: Validación de configuración Maven
  Como desarrollador de QA
  Quiero verificar las dependencias de Maven
  Para asegurar compatibilidad con Serenity BDD

  @smoke @critico
  Escenario: Dependencias de Serenity están configuradas
    Dado que se abre el archivo "pom.xml"
    Cuando se verifican las dependencias de test
    Entonces debe existir "serenity-core" versión "4.2.15"
    Y debe existir "serenity-cucumber" versión "4.2.15"
    Y debe existir "serenity-screenplay" versión "4.2.15"
    Y debe existir "serenity-screenplay-webdriver" versión "4.2.15"
    Y debe existir "serenity-ensure" versión "4.2.15"

  @smoke @critico
  Escenario: Versión de Java es 17
    Dado que se revisa la sección "properties" del pom
    Entonces "maven.compiler.source" debe ser "17"
    Y "maven.compiler.target" debe ser "17"

  @error-path
  Escenario: Verificar que no hay dependencias duplicadas
    Dado que se analiza el pom.xml
    Cuando se buscan dependencias duplicadas
    Entonces no debe haber dependencias con el mismo "groupId:artifactId"
```

---

### Feature 3: Validación de Patrones Screenplay

```gherkin
# language: esn@template @screenplay @pattern
Característica: Validación de implementación Screenplay
  Como desarrollador de QA
  Quiero verificar que los patrones Screenplay estén correctamente implementados
  Para asegurar la calidad del template

  @smoke @critico
  Escenario: Tasks implementan interfaz Task correctamente
    Dado que se revisa la clase "NavegarA.java"
    Cuando se verifica la implementación
    Entonces debe implementar "Task"
    Y debe tener método estático factory "url(String)"
    Y debe usar "Tasks.instrumented()"
    Y debe implementar "performAs(Actor actor)"

  @smoke @critico
  Escenario: Questions implementan interfaz Question correctamente
    Dado que se revisa la clase "ElTituloDeLaPagina.java"
    Cuando se verifica la implementación
    Entonces debe implementar "Question<String>"
    Y debe tener método estático factory "mostrado()"
    Y debe implementar "answeredBy(Actor actor)"

  @smoke @critico
  Escenario: Targets usan convención de nombres correcta
    Dado que se revisa la clase "CotizacionTargets.java"
    Cuando se verifican los targets definidos
    Entonces los nombres deben estar en MAYÚSCULAS_SNAKE_CASE
    Y deben usar "Target.the()" con descripción descriptiva
    Y deben usar "By.cssSelector()" o estrategias de localización válidas
```

---

### Feature 4: Validación de Modelos y Builders

```gherkin
# language: es
@template @models @builder
Característica: Validación de modelos y patrones de creación
  Como desarrollador de QA
  Quiero verificar los POJOs y Builders
  Para asegurar que los datos de prueba funcionan correctamente

  @smoke @critico
  Escenario: Builder crea objetos correctamente
    Dado que se usa "CotizacionBuilder.unaCotizacion()"
    Cuando se configura con datos de prueba
    Entonces el objeto resultante debe tener folio configurado
    Y debe tener empresa configurada
    Y debe tener RFC configurado
    Y la lista de propiedades no debe ser null

  @happy-path @critico
  Escenario: Factory crea cotizaciones válidas
    Dado que se llama "CotizacionFactory.unaCotizacionValida()"
    Cuando se obtiene la cotización
    Entonces el folio debe tener formato "COT-YYYY-NNNNN"
    Y el estado debe ser "DRAFT"
    Y debe tener al menos una propiedad asociada

  @happy-path @critico
  Escenario: Factory crea propiedades completas
    Dado que se llama "CotizacionFactory.unaPropiedadCompleta()"
    Cuando se verifica la propiedad
    Entonces el nombre no debe ser vacío
    Y la dirección debe estar configurada
    Y el porcentaje de completitud debe ser 100
    Y el estado debe ser "COMPLETE"

  @edge-case
  Escenario: Factory crea propiedades incompletas
    Dado que se llama "CotizacionFactory.unaPropiedadIncompleta()"
    Cuando se verifica la propiedad
    Entonces el estado debe ser "INCOMPLETE"
    Y el porcentaje de completitud debe ser menor a 100
    Y valores numéricos deben ser 0 o null

  @edge-case
  Escenario: Propiedad calcula valor total de cobertura
    Dado una propiedad con valores configurados:
      | campo                   | valor  |
      | valorEdificio           | 1000000|
      | valorContenido          | 500000 |
      | valorEquipoElectronico  | 100000 |
      | valorMaquinaria         | 0      |
      | valorExistencias        | 200000 |
    Cuando se llama "getValorTotalCobertura()"
    Entonces el resultado debe ser 1800000
```

---

### Feature 5: Validación de Configuración WebDriver

```gherkin
# language: es
@template @webdriver @configuration
Característica: Validación de configuración WebDriver
  Como desarrollador de QA
  Quiero verificar la configuración del navegador
  Para asegurar compatibilidad multi-navegador

  @smoke @critico
  Escenario: Configuración base de WebDriver
    Dado que se revisa "serenity.properties"
    Cuando se verifican las propiedades
    Entonces "webdriver.driver" debe estar definido
    Y "webdriver.timeouts.implicitlywait" debe ser mayor a 0
    Y "webdriver.wait.for.timeout" debe ser mayor a 0
    Y "webdriver.base.url" debe ser una URL válida

  @happy-path
  Escenario: Configuración de reportes
    Dado que se revisa "serenity.properties"
    Cuando se verifican las opciones de reporte
    Entonces "serenity.take.screenshots" debe estar definido
    Y "serenity.project.name" debe tener un valor descriptivo
    Y "serenity.test.root" debe ser "com.segurax"

  @edge-case
  Escenario: Soportar configuración por variables de entorno
    Dado que se establece variable "WEBDRIVER_BASE_URL"
    Cuando se ejecuta el test
    Entonces la URL base debe ser la de la variable de entorno

  @error-path
  Escenario: Manejar navegador no disponible
    Dado que se configura un navegador no instalado
    Cuando se intenta inicializar el WebDriver
    Entonces debe lanzarse una excepción clara
    Y el mensaje debe indicar el navegador no encontrado
```

---

### Feature 6: Escenarios de Ejecución

```gherkin
# language: es
@template @execution
Característica: Validación de ejecución de tests
  Como desarrollador de QA
  Quiero ejecutar los tests del template
  Para verificar que todo compila y corre correctamente

  @smoke @critico
  Escenario: Compilación exitosa con Maven
    Dado que se ejecuta "mvn clean compile test-compile"
    Cuando finaliza la compilación
    Entonces el resultado debe ser BUILD SUCCESS
    Y no deben haber errores de compilación
    Y deben generarse archivos .class en target/

  @smoke @critico
  Escenario: Ejecutar tests con Maven Verify
    Dado que el proyecto compila exitosamente
    Cuando se ejecuta "mvn clean verify"
    Entonces debe generarse el reporte en "target/site/serenity/"
    Y debe existir "index.html" en el directorio de reportes

  @error-path
  Escenario: Manejo de tests fallidos
    Dado un step definition con implementación fallida
    Cuando se ejecuta el test
    Entonces el reporte debe mostrar el fallo
    Y debe incluir captura de pantalla si aplica
    Y debe indicar el step que falló

  @edge-case
  Escenario: Ejecutar tests por tag específico
    Dado que se ejecuta "mvn clean verify -Dcucumber.filter.tags='@smoke'"
    Cuando finaliza la ejecución
    Entonces solo deben ejecutarse escenarios con tag @smoke
    Y escenarios sin el tag deben ser ignorados
```

---

### Feature 7: Escenarios de Documentación

```gherkin
# language: es
@template @documentation
Característica: Validación de documentación
  Como desarrollador de QA
  Quiero verificar que la documentación esté completa
  Para facilitar el uso del template

  @smoke @critico
  Escenario: README.md contiene información esencial
    Dado que se revisa "README.md"
    Cuando se verifica el contenido
    Entonces debe tener sección "Instalación"
    Y debe tener sección "Cómo Ejecutar Tests"
    Y debe tener sección "Estructura del Proyecto"
    Y debe tener ejemplos de uso

  @smoke @critico
  Escenario: Todas las clases tienen JavaDoc
    Dado que se revisan las clases Java
    Cuando se verifica la documentación
    Entonces cada clase debe tener JavaDoc con:
      | elemento      |
      | Descripción   |
      | @author       |
      | @version      |
      | Ejemplo de uso (opcional pero recomendado) |

  @happy-path
  Escenario: Comandos útiles documentados
    Dado que se revisa la sección de comandos
    Entonces debe incluir comando para compilar
    Y debe incluir comando para ejecutar tests
    Y debe incluir comando para generar reportes
    Y debe incluir comando para ejecutar por tags
```

---

### Feature 8: Escenarios de Actores y Screenplay

```gherkin
# language: es
@template @actors @screenplay
Característica: Validación de Actores y Stage
  Como desarrollador de QA
  Quiero verificar la configuración de actores
  Para asegurar el patrón Screenplay

  @smoke @critico
  Escenario: Hooks configuran el Stage correctamente
    Dado que se revisa "Hooks.java"
    Cuando se verifica el método "setTheStage()"
    Entonces debe usar "OnStage.setTheStage()"
    Y debe pasar "new OnlineCast()"
    Y debe tener anotación "@Before"

  @smoke @critico
  Escenario: Actor factory crea actores con habilidades
    Dado que se usa "ElUsuario.conLaHabilidadDe(driver)"
    Cuando se crea el actor
    Entonces el actor debe tener nombre "el Usuario"
    Y debe tener habilidad "BrowseTheWeb"
    Y debe poder ejecutar tareas web

  @happy-path
  Escenario: Actor en el spotlight puede ejecutar tasks
    Dado que el stage está configurado
    Y un actor ha sido llamado
    Cuando se usa "OnStage.theActorInTheSpotlight()"
    Entonces debe retornar el actor actual
    Y debe poder ejecutar "attemptsTo()"

  @error-path
  Escenario: Manejar actor no encontrado en spotlight
    Dado que no hay actor en el spotlight
    Cuando se intenta obtener "theActorInTheSpotlight()"
    Entonces debe lanzarse excepción "No actor in the spotlight"
```

---

## Datos de Prueba Recomendados

### Para Tests de Configuración

| Variable | Valor Válido | Valor Inválido | Borde |
|----------|--------------|----------------|-------|
| webdriver.driver | chrome, firefox | safari_old | headless |
| webdriver.base.url | http://localhost:5173 | invalid-url | http:// |
| maven.compiler.source | 17, 21 | 8, 11 | 17 (LTS) |

### Para Tests de Modelos

| Entidad | Campo | Válido | Inválido | Borde |
|---------|-------|--------|----------|-------|
| Cotizacion | folio | COT-2026-00001 | "" | COT-2026-99999 |
| Cotizacion | rfc | ABC123456789 | RFCINVALIDO | ABC12345678 |
| Propiedad | valorEdificio | 1000000.0 | -100 | 0.0 |
| Propiedad | porcentajeCompletitud | 100 | 101 | 0 |

### Para Tests de Ejecución

| Escenario | Tags | Resultado Esperado |
|-----------|------|-------------------|
| Todos los tests | "" | Ejecutar todos |
| Solo smoke | @smoke | Solo escenarios con @smoke |
| Excluir wip | not @wip | Ejecutar todos excepto @wip |
| Tag inexistente | @nonexistent | 0 escenarios ejecutados |

---

## Mapeo a Historias de Usuario de SPEC-015

| Feature Gherkin | HU de SPEC-015 | Prioridad |
|-----------------|------------------|-----------|
| Feature 1: Estructura | HU-01 | Crítica |
| Feature 2: Maven | HU-02 | Crítica |
| Feature 3: Screenplay | HU-03 | Crítica |
| Feature 4: Modelos | HU-04 | Crítica |
| Feature 5: WebDriver | HU-05 | Crítica |
| Feature 6: Ejecución | HU-06 | Crítica |
| Feature 7: Documentación | HU-06 | Alta |
| Feature 8: Actores | HU-03 | Crítica |

---

## Notas de Implementación

### Escenarios que Requieren Mock
- Feature 6 (Ejecución) - Requiere ChromeDriver o WebDriverManager
- Feature 5 (WebDriver) - Requiere navegador instalado

### Escenarios de Solo Validación Estática
- Feature 1 (Estructura) - Solo verificación de archivos
- Feature 2 (Maven) - Solo análisis de XML
- Feature 3 (Screenplay) - Solo análisis de código
- Feature 7 (Documentación) - Solo análisis de archivos

---

*Generado por QA Agent - Phase 4 ASDD*
