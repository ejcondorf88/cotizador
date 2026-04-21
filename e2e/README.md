# Happy Path E2E - Serenity BDD Tests

Suite de pruebas End-to-End (E2E) automatizadas para el cotizador **SeguraX**, cubriendo el flujo completo desde la homepage hasta la configuración de coberturas.

> **SPEC:** [SPEC-021 - Happy Path E2E](../.github/specs/happy-path-e2e-serenity.spec.md)  
> **Estado:** IMPLEMENTED ✅  
> **Última actualización:** 2026-04-21

---

## Descripción del Proyecto

Este proyecto implementa **5 microflujos E2E** que verifican el camino feliz (happy path) del cotizador SeguraX:

| Microflujo | Descripción | Escenario |
|------------|-------------|-----------|
| **1** | Homepage → Cotización | Navegar desde homepage a la página de nueva cotización |
| **2** | Crear Cotización | Crear cotización y verificar folio generado |
| **3** | Seleccionar Inmuebles | Seleccionar 2 inmuebles para asegurar |
| **4** | Completar Inmuebles | Completar datos de ambos inmuebles |
| **5** | Configurar Coberturas | Activar coberturas opcionales y finalizar |

### Características

- ✅ **Serenity BDD 4.2.15** - Framework BDD con reportes detallados
- ✅ **Screenplay Pattern** - Tests mantenibles y legibles
- ✅ **Cucumber 7.20.1** - Escenarios en lenguaje natural (Gherkin)
- ✅ **Selenium 4.27.0** - Automatización de navegador
- ✅ **Java 17** - LTS con soporte extendido
- ✅ **Maven** - Gestión de dependencias

---

## Requisitos Previos

### Software Requerido

| Componente | Versión | Notas |
|------------|---------|-------|
| Java | 17+ | [Descargar](https://adoptium.net/) |
| Maven | 3.8+ | `mvn -version` para verificar |
| Chrome | Última estable | Para ejecución headless o headed |
| ChromeDriver | Compatible con Chrome | Automáticamente gestionado por Serenity |

### Servicios Requeridos

Antes de ejecutar los tests, asegúrate de que estos servicios estén corriendo:

```bash
# Frontend (Vite Dev Server)
# Puerto: 5173
npm run dev

# Backend (Microservicios)
# Puerto: 3000 (o a través del Gateway en 8080)
docker-compose up ms-core
```

---

## Instalación

### 1. Clonar el Proyecto

```bash
cd C:\workspace\cotizador\e2e
```

### 2. Verificar Dependencias

```bash
# Verificar Java
java -version  # Debe mostrar Java 17+

# Verificar Maven
mvn -version   # Debe mostrar Maven 3.8+

# Verificar Chrome
google-chrome --version  # o chrome --version
```

### 3. Compilar el Proyecto

```bash
# Compilar e instalar dependencias
mvn clean compile test-compile
```

---

## Comandos de Ejecución

### Ejecutar Todos los Tests

```bash
mvn clean verify
```

### Ejecutar por Tags

```bash
# Todo el happy path
mvn clean verify -Dcucumber.filter.tags="@happy-path"

# Un microflujo específico
mvn clean verify -Dcucumber.filter.tags="@microflujo-1"
mvn clean verify -Dcucumber.filter.tags="@microflujo-3"
mvn clean verify -Dcucumber.filter.tags="@microflujo-5"

# Tests críticos solo
mvn clean verify -Dcucumber.filter.tags="@critical"

# Excluir tests en desarrollo
mvn clean verify -Dcucumber.filter.tags="not @wip"
```

### Ejecutar por Feature

```bash
# Feature específico
mvn clean verify -Dcucumber.features="src/test/resources/features/happy_path_flujo_completo.feature"

# Runner específico
mvn clean verify -Dtest=HappyPathRunner
```

### Modo Headless (CI/CD)

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

### Ejecución con Variables de Entorno

```bash
# Cambiar URL base
export WEBDRIVER_BASE_URL=https://staging.segurax.com
mvn clean verify

# O directamente
mvn clean verify -Dwebdriver.base.url=https://staging.segurax.com
```

---

## Estructura del Proyecto

```
e2e/
├── pom.xml                              # Configuración Maven
├── serenity.properties                    # Configuración Serenity
├── README.md                            # Este archivo
├── src/test/
│   ├── java/com/segurax/
│   │   ├── runners/
│   │   │   └── HappyPathRunner.java     # Runner principal
│   │   ├── stepdefinitions/
│   │   │   ├── HappyPathFlujoCompletoStepDefinitions.java  # Glue Gherkin-Java
│   │   │   └── CotizacionStepDefinitions.java
│   │   ├── actors/
│   │   │   └── ElAgente.java            # Factory del actor principal
│   │   ├── tasks/                       # Acciones de negocio (When)
│   │   │   ├── Navegar.java
│   │   │   ├── CrearUnaCotizacion.java
│   │   │   ├── SeleccionarCantidadDeInmuebles.java
│   │   │   ├── CompletarElInmueble.java
│   │   │   ├── GuardarElInmueble.java
│   │   │   ├── FinalizarElPasoDeInmuebles.java
│   │   │   ├── ActivarCobertura.java
│   │   │   ├── ContinuarEnCoberturas.java
│   │   │   └── HacerClick.java
│   │   ├── questions/                   # Verificaciones (Then)
│   │   │   ├── ElFolioDeLaCotizacion.java
│   │   │   ├── ElEstadoDeLaCotizacion.java
│   │   │   ├── LaCantidadDeFichasDeInmueble.java
│   │   │   ├── LosInmueblesEstanCompletos.java
│   │   │   ├── LaSumaAseguradaTotal.java
│   │   │   ├── LaCoberturaObligatoria.java
│   │   │   ├── LasCoberturasOpcionales.java
│   │   │   └── ElTituloDeLaPagina.java
│   │   ├── targets/                     # Localizadores UI
│   │   │   ├── HomepageTargets.java
│   │   │   ├── QuotePageTargets.java
│   │   │   ├── PropertyCountTargets.java
│   │   │   ├── PropertyDetailsTargets.java
│   │   │   ├── PropertyFormTargets.java
│   │   │   ├── CoverageTargets.java
│   │   │   └── CommonTargets.java
│   │   └── models/                      # Objetos de dominio
│   │       ├── InmuebleData.java
│   │       ├── Cotizacion.java
│   │       ├── Propiedad.java
│   │       └── Direccion.java
│   └── resources/
│       └── features/
│           ├── happy_path_flujo_completo.feature   # Feature principal
│           └── crear_cotizacion.feature
└── target/
    └── site/serenity/                     # Reportes generados
        └── index.html
```

---

## Tags de Cucumber Disponibles

### Tags de Flujo

| Tag | Descripción | Microflujos |
|-----|-------------|-------------|
| `@happy-path` | Todo el flujo E2E | 1-5 |
| `@e2e` | Tests de extremo a extremo | Todos |
| `@flujo-completo` | Cobertura del flujo completo | 1-5 |
| `@final` | Último paso del flujo | 5 |

### Tags por Microflujo

| Tag | Descripción |
|-----|-------------|
| `@microflujo-1` | Homepage → Página de cotización |
| `@microflujo-2` | Crear nueva cotización |
| `@microflujo-3` | Seleccionar cantidad de inmuebles |
| `@microflujo-4` | Completar datos de inmuebles |
| `@microflujo-5` | Configurar coberturas |

### Tags por Dominio

| Tag | Descripción |
|-----|-------------|
| `@homepage` | Tests relacionados con la homepage |
| `@navegacion` | Tests de navegación entre páginas |
| `@crear-cotizacion` | Tests de creación de cotización |
| `@folio` | Tests relacionados con folios |
| `@seleccion-inmuebles` | Tests de selección de cantidad |
| `@cantidad` | Tests de cantidad de inmuebles |
| `@completar-inmuebles` | Tests de completar formularios |
| `@formularios` | Tests de formularios |
| `@configurar-coberturas` | Tests de configuración de coberturas |
| `@coberturas` | Tests de coberturas |

### Tags de Prioridad

| Tag | Descripción |
|-----|-------------|
| `@critical` | Tests críticos para el negocio |
| `@ui` | Tests de interfaz de usuario |
| `@wip` | Work in progress (excluido por defecto) |
| `@manual` | Requiere ejecución manual |
| `@pending` | Pendiente de implementación |

---

## Reportes

### Generación de Reportes

Después de ejecutar los tests, Serenity genera reportes detallados:

```bash
# El reporte se genera automáticamente al ejecutar
mvn clean verify

# O generar manualmente
mvn serenity:aggregate
```

### Ubicación

```
target/site/serenity/
├── index.html              # Reporte principal
├── requirements/           # Requerimientos/features
├── capabilities/           # Capabilities del navegador
└── serenity-report.csv     # Datos en CSV
```

### Visualizar Reporte

```bash
# Windows
start target/site/serenity/index.html

# macOS
open target/site/serenity/index.html

# Linux
xdg-open target/site/serenity/index.html
```

### Contenido del Reporte

- **Resumen de ejecución:** Tests pasados/fallados/pendientes
- **Evidencias:** Screenshots de cada paso
- **Historial:** Tendencia de ejecuciones
- **Requerimientos:** Cobertura de features
- **Capabilities:** Información del entorno

---

## Solución de Problemas

### ChromeDriver no encontrado

```bash
# Serenity gestiona ChromeDriver automáticamente
# Si hay problemas, especificar ruta manual:
# En serenity.properties:
webdriver.chrome.driver=C:\ruta\al\chromedriver.exe
```

### Elemento no encontrado

- Verificar que el frontend está corriendo en `localhost:5173`
- Revisar selectores en archivos `*Targets.java`
- Aumentar timeouts en `serenity.properties`:
  ```properties
  webdriver.timeouts.implicitlywait=10000
  ```

### Tests flaky (intermitentes)

- Usar `WaitUntil` explícitos en lugar de sleeps
- Verificar estabilidad del entorno
- Aumentar timeouts de espera

### Puerto ocupado

```bash
# Si el 5173 está ocupado, el frontend puede usar otro
# Actualizar webdriver.base.url en consecuencia
webdriver.base.url=http://localhost:3000  # o el puerto usado
```

---

## Comandos Útiles

```bash
# Compilar sin ejecutar tests
mvn clean compile

# Ejecutar tests con verbose
mvn clean verify -X

# Ejecutar tests específicos
mvn clean verify -Dtest=HappyPathRunner

# Saltar generación de reporte (más rápido)
mvn clean verify -DskipSerenityReports=true

# Generar reporte manual
mvn serenity:aggregate

# Limpiar target/
mvn clean
```

---

## Recursos

- [Serenity BDD Documentation](https://serenity-bdd.github.io/)
- [Screenplay Pattern Guide](https://serenity-bdd.github.io/docs/screenplay/)
- [Cucumber Documentation](https://cucumber.io/docs/cucumber/)
- [Selenium WebDriver](https://www.selenium.dev/documentation/)

---

## Contribuir

Ver [CONTRIBUTING.md](./CONTRIBUTING.md) para guías de contribución al proyecto.

---

## Especificaciones Relacionadas

- [SPEC-021: Happy Path E2E](../.github/specs/happy-path-e2e-serenity.spec.md)
- [SPEC-002: Backend Quotes API](../.github/specs/backend-quotes-api.spec.md)
- [SPEC-003: Frontend Gateway Integration](../.github/specs/frontend-gateway-integration.spec.md)
- [SPEC-012: Add Insured Properties Flow](../.github/specs/add-insured-properties-flow.spec.md)
- [SPEC-018: Coverage Selection](../.github/specs/coverage-selection.spec.md)

---

**Equipo QA - SeguraX**  
© 2026 - Todos los derechos reservados
