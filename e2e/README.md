# 🧪 Happy Path E2E - Serenity BDD Tests

Suite de pruebas End-to-End (E2E) automatizadas para el cotizador **SeguraX**, cubriendo el flujo completo desde la homepage hasta la configuración de coberturas.

> **SPEC:** [SPEC-021 - Happy Path E2E](../.github/specs/happy-path-e2e-serenity.spec.md)  
> **Estado:** IMPLEMENTED ✅  
> **Última actualización:** 2026-04-21  
> **Ciclo de vida:** DRAFT → APPROVED → IN_PROGRESS → **IMPLEMENTED** → DEPRECATED

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

## 📂 Estructura del Proyecto

```
e2e/
├── pom.xml                              # Configuración Maven + dependencias
├── serenity.properties                  # Configuración Serenity BDD
├── README.md                            # Este archivo
├── CONTRIBUTING.md                      # Guía de contribución
├── .gitignore                           # Exclusiones de Git
│
├── src/test/
│   ├── java/com/segurax/
│   │   ├── runners/
│   │   │   └── HappyPathRunner.java              # Runner principal de Cucumber
│   │   │
│   │   ├── stepdefinitions/
│   │   │   ├── HappyPathFlujoCompletoStepDefinitions.java  # Glue: mapeo Gherkin→Java
│   │   │   └── CotizacionStepDefinitions.java              # Steps adicionales
│   │   │
│   │   ├── actors/
│   │   │   └── ElAgente.java                     # Factory del actor principal
│   │   │
│   │   ├── tasks/                                # 🎬 ACCIONES (When)
│   │   │   ├── Navegar.java                      # Navegar a páginas
│   │   │   ├── CrearUnaCotizacion.java           # Crear cotización
│   │   │   ├── SeleccionarCantidadDeInmuebles.java
│   │   │   ├── CompletarElInmueble.java
│   │   │   ├── GuardarElInmueble.java
│   │   │   ├── FinalizarElPasoDeInmuebles.java
│   │   │   ├── ActivarCobertura.java
│   │   │   ├── ContinuarEnCoberturas.java
│   │   │   └── HacerClick.java
│   │   │
│   │   ├── questions/                            # ✅ VERIFICACIONES (Then)
│   │   │   ├── ElFolioDeLaCotizacion.java
│   │   │   ├── ElEstadoDeLaCotizacion.java
│   │   │   ├── LaCantidadDeFichasDeInmueble.java
│   │   │   ├── LosInmueblesEstanCompletos.java
│   │   │   ├── LaSumaAseguradaTotal.java
│   │   │   ├── LaCoberturaObligatoria.java
│   │   │   ├── LasCoberturasOpcionales.java
│   │   │   └── ElTituloDeLaPagina.java
│   │   │
│   │   ├── targets/                              # 🎯 LOCALIZADORES UI
│   │   │   ├── HomepageTargets.java              # Homepage (botón Cotizar)
│   │   │   ├── QuotePageTargets.java             # Página de cotización
│   │   │   ├── PropertyCountTargets.java         # Selector de cantidad
│   │   │   ├── PropertyDetailsTargets.java       # Fichas de inmuebles
│   │   │   ├── PropertyFormTargets.java          # Formulario de inmueble
│   │   │   ├── CoverageTargets.java              # Configuración coberturas
│   │   │   └── CommonTargets.java                # Elementos comunes
│   │   │
│   │   └── models/                               # 📦 OBJETOS DE DOMINIO
│   │       ├── InmuebleData.java                 # Builder pattern
│   │       ├── Cotizacion.java
│   │       ├── Propiedad.java
│   │       └── Direccion.java
│   │
│   └── resources/
│       └── features/
│           ├── happy_path_flujo_completo.feature # 🥒 FEATURE PRINCIPAL (Gherkin)
│           └── crear_cotizacion.feature          # Feature adicional
│
└── target/
    └── site/serenity/                            # 📊 REPORTES GENERADOS
        ├── index.html                            # Reporte principal (¡abrir este!)
        ├── requirements/                         # Requerimientos/features
        ├── capabilities/                       # Capabilities del navegador
        └── serenity-report.csv                 # Datos en CSV
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

## 🏷️ Tags de Cucumber Disponibles

Los tags permiten filtrar y ejecutar tests específicos según el contexto.

### 🚀 Tags de Flujo Principal

| Tag | Descripción | Microflujos |
|-----|-------------|-------------|
| `@happy-path` | Todo el flujo E2E del camino feliz | 1-5 |
| `@e2e` | Tests de extremo a extremo | Todos |
| `@flujo-completo` | Cobertura del flujo completo | 1-5 |
| `@final` | Último paso del flujo (configurar coberturas) | 5 |

### 🔢 Tags por Microflujo

| Tag | Descripción | Escenario |
|-----|-------------|-----------|
| `@microflujo-1` | Homepage → Página de cotización | Navegar desde homepage |
| `@microflujo-2` | Crear nueva cotización | Crear y verificar folio |
| `@microflujo-3` | Seleccionar cantidad de inmuebles | Seleccionar 2 inmuebles |
| `@microflujo-4` | Completar datos de inmuebles | Completar datos de ambos |
| `@microflujo-5` | Configurar coberturas | Activar coberturas opcionales |

### 🏛️ Tags por Dominio

| Tag | Descripción | Uso |
|-----|-------------|-----|
| `@homepage` | Tests relacionados con la homepage | Página inicial |
| `@navegacion` | Tests de navegación entre páginas | Transiciones |
| `@crear-cotizacion` | Tests de creación de cotización | Microflujo 2 |
| `@folio` | Tests relacionados con folios | Generación de folios |
| `@seleccion-inmuebles` | Tests de selección de cantidad | Microflujo 3 |
| `@cantidad` | Tests de cantidad de inmuebles | Input de cantidad |
| `@completar-inmuebles` | Tests de completar formularios | Microflujo 4 |
| `@formularios` | Tests de formularios | Validación de campos |
| `@configurar-coberturas` | Tests de configuración de coberturas | Microflujo 5 |
| `@coberturas` | Tests de coberturas | Obligatorias y opcionales |

### ⚡ Tags de Prioridad y Estado

| Tag | Descripción | Uso Recomendado |
|-----|-------------|-----------------|
| `@critical` | Tests críticos para el negocio | Ejecutar en CI/CD siempre |
| `@ui` | Tests de interfaz de usuario | Validación visual |
| `@wip` | Work in progress (excluido por defecto) | Tests en desarrollo |
| `@manual` | Requiere ejecución manual | Validaciones complejas |
| `@pending` | Pendiente de implementación | Planificado |
| `@smoke` | Tests rápidos de verificación | Pre-commit |
| `@regression` | Tests de regresión | Release completo |

### 📋 Ejemplos de Uso de Tags

```bash
# Ejecutar todo el happy path (todos los microflujos)
mvn clean verify -Dcucumber.filter.tags="@happy-path"

# Ejecutar un microflujo específico
mvn clean verify -Dcucumber.filter.tags="@microflujo-1"
mvn clean verify -Dcucumber.filter.tags="@microflujo-3"

# Combinar tags (AND)
mvn clean verify -Dcucumber.filter.tags="@happy-path and @critical"

# Excluir tests en progreso
mvn clean verify -Dcucumber.filter.tags="@happy-path and not @wip"

# Tests de un dominio específico
mvn clean verify -Dcucumber.filter.tags="@coberturas"
mvn clean verify -Dcucumber.filter.tags="@formularios"

# Tests críticos solamente
mvn clean verify -Dcucumber.filter.tags="@critical"

# Hasta el paso final (útil para CI/CD)
mvn clean verify -Dcucumber.filter.tags="@final"
```

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

## 📋 Especificaciones Relacionadas

### Principales
- **[SPEC-021: Happy Path E2E](../.github/specs/happy-path-e2e-serenity.spec.md)** - Especificación completa de los tests E2E
- [SPEC-024: Update All READMEs](../.github/specs/update-all-readmes.spec.md) - Actualización de documentación

### Backend & APIs
- [SPEC-002: Backend Quotes API](../.github/specs/backend-quotes-api.spec.md) - API de cotizaciones
- [SPEC-003: Frontend Gateway Integration](../.github/specs/frontend-gateway-integration.spec.md) - Integración con Gateway
- [SPEC-012: Add Insured Properties Flow](../.github/specs/add-insured-properties-flow.spec.md) - Flujo de propiedades

### Frontend
- [SPEC-018: Coverage Selection](../.github/specs/coverage-selection.spec.md) - Selección de coberturas
- [SPEC-024: Frontend Cotizador](../.github/specs/frontend-cotizador-segurax.spec.md) - Frontend React

### Infraestructura
- [SPEC-001: Dockerfiles Optimization](../.github/specs/dockerfiles-optimization.spec.md) - Docker optimizado

---

**Equipo QA - SeguraX**  
© 2026 - Todos los derechos reservados
