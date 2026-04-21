# Guía de Contribución - Happy Path E2E Tests

Guía para contribuir a la suite de pruebas E2E del cotizador SeguraX.

> **Importante:** Antes de contribuir, asegúrate de haber leído:
> - [README.md](./README.md) - Instalación y ejecución
> - [SPEC-021](../.github/specs/happy-path-e2e-serenity.spec.md) - Especificación técnica
> - [ADR-009](../.github/adr/ADR-009-serenity-bdd-e2e.md) - Decisiones arquitectónicas

---

## Tabla de Contenidos

1. [Cómo Agregar Nuevos Escenarios](#cómo-agregar-nuevos-escenarios)
2. [Convenciones de Código](#convenciones-de-código)
3. [Estructura del Screenplay Pattern](#estructura-del-screenplay-pattern)
4. [Ejemplos de Implementación](#ejemplos-de-implementación)
5. [Proceso de Code Review](#proceso-de-code-review)

---

## Cómo Agregar Nuevos Escenarios

### Paso 1: Crear el Feature File

```gherkin
# language: es
@mi-feature @ui @happy-path
Característica: Mi Nueva Feature
  Como agente de SeguraX
  Quiero realizar una acción
  Para obtener un resultado

  Antecedentes:
    Dado que el agente ha iniciado sesión
    Y el sistema está funcionando correctamente

  @microflujo-N @critical
  Escenario: Descripción del escenario
    Dado que el agente está en la página inicial
    Cuando realiza la acción principal
    Y completa los datos requeridos
    Entonces debe ver el resultado esperado
    Y el sistema debe estar en estado consistente
```

**Convenciones de Gherkin:**

- ✅ Usar `# language: es` al inicio
- ✅ Tags en orden: `@feature`, `@capa`, `@prioridad`
- ✅ Nombres de escenario descriptivos
- ✅ Usar tablas para datos de entrada
- ✅ Evitar pasos muy largos (máximo 2 líneas)

### Paso 2: Crear Step Definitions

```java
package com.segurax.stepdefinitions;

import io.cucumber.java.es.Dado;
import io.cucumber.java.es.Cuando;
import io.cucumber.java.es.Entonces;
import net.serenitybdd.screenplay.actors.OnStage;

import static net.serenitybdd.screenplay.GivenWhenThen.seeThat;
import static org.hamcrest.Matchers.*;

public class MiFeatureStepDefinitions {

    @Dado("que el agente está en la página inicial")
    public void estaEnLaPaginaInicial() {
        OnStage.theActorInTheSpotlight().attemptsTo(
            Navegar.aLaPaginaInicial()
        );
    }

    @Cuando("realiza la acción principal")
    public void realizaLaAccionPrincipal() {
        OnStage.theActorInTheSpotlight().attemptsTo(
            RealizarLaAccion.principal()
        );
    }

    @Entonces("debe ver el resultado esperado")
    public void debeVerElResultadoEsperado() {
        OnStage.theActorInTheSpotlight().should(
            seeThat(ElResultado.esperado(), equalTo("valor esperado"))
        );
    }
}
```

### Paso 3: Implementar Tasks

### Paso 4: Implementar Questions

### Paso 5: Definir Targets

---

## Convenciones de Código

### Nomenclatura

| Componente | Convención | Ejemplo |
|------------|------------|---------|
| **Clases Task** | Verbo + Sustantivo | `CrearCotizacion`, `NavegarA` |
| **Clases Question** | Artículo + Sustantivo | `ElFolioDeLaCotizacion`, `LaUrlActual` |
| **Clases Targets** | Sustantivo + Targets | `QuotePageTargets`, `HomepageTargets` |
| **Métodos Factory** | Descriptivo del retorno | `mostrado()`, `esperado()`, `valido()` |
| **Constantes Target** | MAYÚSCULAS_SNAKE_CASE | `BOTON_CREAR_COTIZACION` |
| **Variables** | camelCase | `cantidadInmuebles` |
| **Paquetes** | minúsculas | `com.segurax.tasks` |

### Estructura de Paquetes

```
com.segurax/
├── runners/           # Solo runners de Cucumber
├── stepdefinitions/   # Glue entre Gherkin y Java
├── tasks/             # Acciones (When)
├── questions/         # Verificaciones (Then)
├── targets/           # Selectores UI
├── actors/            # Factory de actores
└── models/            # POJOs de dominio
    ├── builders/      # Builders de modelos
    └── factories/     # Object Mothers
```

### JavaDoc

Todo componente Screenplay DEBE tener JavaDoc:

```java
/**
 * Task para crear una nueva cotización.
 *
 * <p>Esta acción simula el clic en el botón "Crear Cotización"
 * y espera a que el folio sea generado.</p>
 *
 * <p>Ejemplo de uso:</p>
 * <pre>
 * actor.attemptsTo(CrearUnaCotizacion.nueva());
 * </pre>
 *
 * @author Tu Nombre
 * @version 1.0.0
 * @see Task
 */
public class CrearUnaCotizacion implements Task {
    // implementación
}
```

### Imports

```java
// 1. Java core
import java.util.List;
import java.time.LocalDate;

// 2. Serenity BDD
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.Question;
import net.serenitybdd.screenplay.targets.Target;

// 3. Proyecto local
import com.segurax.targets.QuotePageTargets;
import com.segurax.models.Cotizacion;

// 4. Static imports (al final)
import static net.serenitybdd.screenplay.GivenWhenThen.seeThat;
import static org.hamcrest.Matchers.*;
```

---

## Estructura del Screenplay Pattern

### 1. Actor (El Usuario)

```java
public class ElAgente {
    public static final String ACTOR_NAME = "El Agente";

    public static Actor elActor() {
        return OnStage.theActorCalled(ACTOR_NAME);
    }

    public static void prepararEscenario() {
        OnStage.setTheStage(new OnlineCast());
    }
}
```

### 2. Task (La Acción)

```java
public class Navegar implements Task {
    private final String url;

    // Factory method
    public static Navegar aLaHomepage() {
        return Tasks.instrumented(Navegar.class, "http://localhost:5173");
    }

    // Constructor privado
    private Navegar(String url) {
        this.url = url;
    }

    // Implementación de la acción
    @Override
    public <T extends Actor> void performAs(T actor) {
        actor.attemptsTo(Open.url(url));
    }
}
```

### 3. Question (La Verificación)

```java
public class ElFolioDeLaCotizacion implements Question<String> {

    // Factory method
    public static ElFolioDeLaCotizacion mostrado() {
        return new ElFolioDeLaCotizacion();
    }

    // Implementación
    @Override
    public String answeredBy(Actor actor) {
        return Text.of(QuotePageTargets.TEXTO_FOLIO_COTIZACION)
                   .answeredBy(actor);
    }
}
```

### 4. Target (El Selector)

```java
public class QuotePageTargets {
    // Constructor privado (clase de utilidad)
    private QuotePageTargets() {}

    public static final Target BOTON_CREAR_COTIZACION = Target
        .the("botón Crear Cotización")
        .located(By.cssSelector("[data-testid='btn-crear-cotizacion']"));
}
```

---

## Ejemplos de Implementación

### Ejemplo Completo: Task con Parámetros

```java
package com.segurax.tasks;

import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.Tasks;
import net.serenitybdd.screenplay.actions.Click;
import net.serenitybdd.screenplay.actions.Enter;

/**
 * Task para seleccionar la cantidad de inmuebles.
 *
 * <p>Ejemplos de uso:</p>
 * <pre>
 * // Seleccionar 2 inmuebles
 * actor.attemptsTo(SeleccionarCantidadDeInmuebles.conValor(2));
 *
 * // Seleccionar cantidad y continuar
 * actor.attemptsTo(
 *     SeleccionarCantidadDeInmuebles.conValor(3),
 *     HacerClick.enElBoton("Continuar")
 * );
 * </pre>
 */
public class SeleccionarCantidadDeInmuebles implements Task {
    private final int cantidad;

    /**
     * Factory method para crear el Task con una cantidad específica.
     *
     * @param cantidad Número de inmuebles (1-10)
     * @return Task configurado
     */
    public static SeleccionarCantidadDeInmuebles conValor(int cantidad) {
        if (cantidad < 1 || cantidad > 10) {
            throw new IllegalArgumentException("Cantidad debe estar entre 1 y 10");
        }
        return Tasks.instrumented(SeleccionarCantidadDeInmuebles.class, cantidad);
    }

    // Constructor privado
    private SeleccionarCantidadDeInmuebles(int cantidad) {
        this.cantidad = cantidad;
    }

    @Override
    public <T extends Actor> void performAs(T actor) {
        actor.attemptsTo(
            Enter.theValue(String.valueOf(cantidad))
                 .into(PropertyCountTargets.INPUT_CANTIDAD),
            Click.on(PropertyCountTargets.BOTON_CONTINUAR)
        );
    }
}
```

### Ejemplo: Question con Builder

```java
package com.segurax.questions;

import net.serenitybdd.screenplay.Question;

/**
 * Question para verificar el estado de un inmueble específico.
 *
 * <p>Ejemplo de uso con Builder:</p>
 * <pre>
 * actor.should(seeThat(
 *     ElEstadoDelInmueble.numero(1).es("COMPLETADO"),
 *     is(true)
 * ));
 * </pre>
 */
public class ElEstadoDelInmueble {
    private final int numeroInmueble;

    private ElEstadoDelInmueble(int numeroInmueble) {
        this.numeroInmueble = numeroInmueble;
    }

    public static ElEstadoDelInmueble numero(int numeroInmueble) {
        return new ElEstadoDelInmueble(numeroInmueble);
    }

    public Question<Boolean> es(String estadoEsperado) {
        return actor -> {
            String estadoActual = Text.of(
                PropertyDetailsTargets.estadoDeLaFicha(numeroInmueble)
            ).answeredBy(actor);
            return estadoActual.equals(estadoEsperado);
        };
    }
}
```

### Ejemplo: Model con Builder Pattern

```java
package com.segurax.models;

/**
 * Modelo de datos para un inmueble.
 *
 * <p>Ejemplo de uso:</p>
 * <pre>
 * InmuebleData inmueble = InmuebleData.builder()
 *     .conNombre("Oficinas Corporativas")
 *     .conDireccion(direccion)
 *     .conTipoConstructivo("Concreto")
 *     .conAnioConstruccion(2015)
 *     .conNiveles(5)
 *     .conUso("Oficina")
 *     .conGarantiaEdificio(5000000)
 *     .conGarantiaContenidos(2000000)
 *     .build();
 * </pre>
 */
public class InmuebleData {
    private final String nombre;
    private final Direccion direccion;
    private final String tipoConstructivo;
    private final int anioConstruccion;
    private final int niveles;
    private final String uso;
    private final String giro;
    private final double garantiaEdificio;
    private final double garantiaContenidos;

    // Constructor privado, usar builder
    private InmuebleData(Builder builder) {
        this.nombre = builder.nombre;
        this.direccion = builder.direccion;
        this.tipoConstructivo = builder.tipoConstructivo;
        this.anioConstruccion = builder.anioConstruccion;
        this.niveles = builder.niveles;
        this.uso = builder.uso;
        this.giro = builder.giro;
        this.garantiaEdificio = builder.garantiaEdificio;
        this.garantiaContenidos = builder.garantiaContenidos;
    }

    public static Builder builder() {
        return new Builder();
    }

    // Getters...

    public static class Builder {
        private String nombre;
        private Direccion direccion;
        private String tipoConstructivo;
        private int anioConstruccion;
        private int niveles;
        private String uso;
        private String giro;
        private double garantiaEdificio;
        private double garantiaContenidos;

        public Builder conNombre(String nombre) {
            this.nombre = nombre;
            return this;
        }

        public Builder conDireccion(Direccion direccion) {
            this.direccion = direccion;
            return this;
        }

        // ... más setters

        public InmuebleData build() {
            return new InmuebleData(this);
        }
    }
}
```

---

## Proceso de Code Review

### Checklist de Revisión

Antes de solicitar review, verifica:

#### ✅ Funcionalidad

- [ ] El escenario Gherkin cubre el caso de negocio
- [ ] Los steps están correctamente mapeados
- [ ] Task realiza la acción esperada
- [ ] Question verifica correctamente
- [ ] Target encuentra el elemento UI

#### ✅ Calidad de Código

- [ ] JavaDoc completo en clases públicas
- [ ] Nomenclatura sigue convenciones
- [ ] Código formateado (Ctrl+Shift+F / Cmd+Shift+F)
- [ ] Sin imports no utilizados
- [ ] Sin System.out.println (usar logging si es necesario)

#### ✅ Screenplay Pattern

- [ ] Task implementa interfaz `Task`
- [ ] Question implementa interfaz `Question<T>`
- [ ] Target usa `data-testid` cuando sea posible
- [ ] Factory methods en Tasks y Questions
- [ ] Constructor privado en Tasks (usar instrumented)

#### ✅ Tests

- [ ] Feature file compila sin errores
- [ ] Tests ejecutan localmente: `mvn clean verify -Dcucumber.filter.tags="@mi-feature"`
- [ ] Screenshots se generan en reporte
- [ ] Sin timeouts innecesarios
- [ ] Esperas explícitas (WaitUntil) en lugar de Thread.sleep

#### ✅ Documentación

- [ ] Feature file tiene descripción clara
- [ ] Tags apropiados agregados
- [ ] Ejemplos de uso en JavaDoc
- [ ] Comentarios explicativos en lógica compleja

### Flujo de Review

```
1. Crear rama feature/test-nueva-funcionalidad
2. Implementar cambios siguiendo guía
3. Ejecutar tests localmente
4. Crear Pull Request con:
   - Descripción del cambio
   - Screenshots del reporte Serenity
   - Link a SPEC relacionada
5. Solicitar review a: @qa-lead @senior-dev
6. Aplicar feedback
7. Merge a main
```

### Criterios de Aceptación del Review

| Aspecto | Criterio |
|---------|----------|
| **Correctitud** | El test verifica lo que dice el requerimiento |
| **Mantenibilidad** | Código es legible y sigue patrones establecidos |
| **Robustez** | Maneja casos edge y esperas explícitas |
| **Performance** | No usa sleeps fijos, usa timeouts configurables |
| **Documentación** | JavaDoc completo y ejemplos claros |

---

## Recursos Adicionales

- [Serenity BDD Best Practices](https://serenity-bdd.github.io/docs/best-practices)
- [Screenplay Pattern Deep Dive](https://serenity-bdd.github.io/docs/screenplay/screenplay-pattern)
- [Cucumber Expressions](https://cucumber.io/docs/cucumber/cucumber-expressions/)

---

**Dudas o sugerencias:** Contactar al equipo QA de SeguraX
