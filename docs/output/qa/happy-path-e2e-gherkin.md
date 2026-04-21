# Escenarios Gherkin - Happy Path E2E (SPEC-021)

## Información General

| Campo | Valor |
|-------|-------|
| **Spec ID** | SPEC-021 |
| **Feature** | happy-path-e2e-serenity |
| **Fecha** | 2026-04-21 |
| **Autor** | QA Lead - ASDD |
| **Estado** | DRAFT |

---

## Feature: Happy Path - Flujo Completo de Cotización hasta Coberturas

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
    Y el frontend está corriendo en "http://localhost:5173"
    Y el backend está corriendo en "http://localhost:3000"
```

---

## Microflujo 1: Homepage → Página de Cotización

### Escenario: Navegar desde Homepage hasta el cotizador

```gherkin
@microflujo-1 @homepage @navegacion @critical
Escenario: Paso 1 - Acceder al cotizador desde la Homepage
  Dado que el agente está en la Homepage de SeguraX
  Cuando hace clic en el botón "Cotizar ahora"
  Entonces debe ser redirigido a la página de cotización "/quote"
  Y debe ver el título "Nueva Cotización"
  Y debe ver el formulario de nueva cotización visible
  Y el botón "Crear Cotización" debe estar habilitado
```

**Datos de Prueba:**
- URL Base: `http://localhost:5173`
- URL Destino: `http://localhost:5173/quote`
- Elemento: Botón "Cotizar ahora" (data-testid: `btn-cotizar-ahora`)

---

## Microflujo 2: Crear Cotización → Folio Generado

### Escenario: Crear nueva cotización exitosamente

```gherkin
@microflujo-2 @crear-cotizacion @folio @critical
Escenario: Paso 2 - Crear una nueva cotización
  Dado que el agente está en la página de cotización "/quote"
  Y el botón "Crear Cotización" está habilitado
  Cuando hace clic en "Crear Cotización"
  Entonces debe ver un mensaje de éxito "Cotización creada exitosamente"
  Y debe visualizar el número de folio generado
  Y el folio debe cumplir con el formato "COT-YYYY-NNNNN"
  Y el estado de la cotización debe ser "BORRADOR"
  Y el badge de estado debe mostrar color "gris"
```

**Ejemplos de Folios Válidos:**
| Ejemplo |
|---------|
| COT-2025-00001 |
| COT-2025-12345 |
| COT-2026-99999 |

---

## Microflujo 3: Seleccionar 2 Inmuebles

### Escenario: Seleccionar cantidad de inmuebles a asegurar

```gherkin
@microflujo-3 @seleccion-inmuebles @cantidad @critical
Escenario: Paso 3 - Seleccionar cantidad de inmuebles
  Dado que el agente tiene una cotización activa con folio válido
  Y está en el paso de selección de cantidad de inmuebles
  Cuando selecciona "2" inmuebles para asegurar en el campo de cantidad
  Y hace clic en el botón "Continuar"
  Entonces debe ser redirigido a la página de detalle de inmuebles "/quote/{id}/properties"
  Y debe ver 2 fichas de inmueble creadas
  Y cada ficha debe mostrar el estado "PENDIENTE"
  Y cada ficha debe tener el botón "Completar datos" habilitado
  Y el botón "Finalizar" debe estar deshabilitado hasta completar ambos inmuebles
```

**Variante - Escenario Outline:**

```gherkin
@microflujo-3 @outline
Esquema del escenario: Seleccionar diferentes cantidades de inmuebles
  Dado que el agente tiene una cotización activa
  Cuando selecciona "<cantidad>" inmuebles
  Y hace clic en "Continuar"
  Entonces debe ver "<cantidad>" fichas de inmueble

  Ejemplos:
    | cantidad |
    | 1        |
    | 2        |
    | 3        |
```

---

## Microflujo 4: Completar Datos de Inmuebles

### Escenario: Completar datos de ambos inmuebles

```gherkin
@microflujo-4 @completar-inmuebles @formularios @critical
Escenario: Paso 4 - Completar datos de los inmuebles
  Dado que el agente está en la página de detalle de inmuebles
  Y tiene 2 fichas de inmueble creadas
  
  # Primer Inmueble
  Cuando hace clic en "Completar datos" del primer inmueble
  Y completa el formulario del primer inmueble con:
    | campo             | valor                     |
    | nombre            | Oficinas Corporativas     |
    | calle             | Av. Reforma 100           |
    | cp                | 06600                     |
    | estado            | CDMX                      |
    | ciudad            | Ciudad de México          |
    | colonia           | Juárez                    |
    | tipo_constructivo | Concreto                  |
    | año_construccion  | 2015                      |
    | niveles           | 5                         |
    | uso               | Oficina                   |
    | giro              | Servicios de Tecnología   |
    | garantia_edificio | 5000000                   |
    | garantia_contenidos| 2000000                  |
  Y hace clic en "Guardar" del primer inmueble
  
  # Segundo Inmueble
  Y hace clic en "Completar datos" del segundo inmueble
  Y completa el formulario del segundo inmueble con:
    | campo             | valor                     |
    | nombre            | Sucursal Norte            |
    | calle             | Av. Insurgentes 500       |
    | cp                | 03100                     |
    | estado            | CDMX                      |
    | ciudad            | Ciudad de México          |
    | colonia           | Del Valle                 |
    | tipo_constructivo | Acero                     |
    | año_construccion  | 2018                      |
    | niveles           | 3                         |
    | uso               | Comercial                 |
    | giro              | Tienda de Electrónicos    |
    | garantia_edificio | 3000000                   |
    | garantia_contenidos| 1500000                  |
  Y hace clic en "Guardar" del segundo inmueble
  
  # Validaciones
  Entonces debe ver que el primer inmueble está marcado como "COMPLETADO"
  Y debe ver que el segundo inmueble está marcado como "COMPLETADO"
  Y ambas fichas deben mostrar icono de check verde
  Y debe ver la suma asegurada total calculada: "$ 11,500,000.00"
  Y el botón "Finalizar" debe estar habilitado
```

**Validaciones de Campo:**

| Campo | Tipo | Requerido | Validación |
|-------|------|-----------|------------|
| nombre | Texto | Sí | Mínimo 3 caracteres |
| calle | Texto | Sí | Mínimo 5 caracteres |
| cp | Texto | Sí | 5 dígitos numéricos |
| estado | Dropdown | Sí | Valor seleccionado |
| ciudad | Texto | Sí | Mínimo 3 caracteres |
| colonia | Texto | Sí | Mínimo 3 caracteres |
| tipo_constructivo | Dropdown | Sí | Concreto / Acero / Mampostería |
| año_construccion | Número | Sí | 1900 - año actual |
| niveles | Número | Sí | 1 - 100 |
| uso | Dropdown | Sí | Oficina / Comercial / Industrial |
| giro | Texto | Sí | Mínimo 3 caracteres |
| garantia_edificio | Moneda | Sí | > 0 |
| garantia_contenidos | Moneda | No | ≥ 0 |

---

## Microflujo 5: Configurar Coberturas

### Escenario: Configurar coberturas obligatorias y opcionales

```gherkin
@microflujo-5 @configurar-coberturas @coberturas @final @critical
Escenario: Paso 5 - Configurar coberturas del seguro
  Dado que el agente ha completado todos los inmuebles
  Y está en el paso de detalle de inmuebles
  
  # Navegar a coberturas
  Cuando hace clic en el botón "Finalizar" para ir a coberturas
  Entonces debe ser redirigido a la página de configuración de coberturas "/quote/{id}/coverage"
  Y debe ver el título "Configuración de Coberturas"
  
  # Validar coberturas obligatorias
  Y debe ver la sección "Coberturas Obligatorias" con:
    | cobertura | estado  | monto       |
    | Incendio  | Activa  | Calculado   |
    | CAT       | Activa  | Calculado   |
  Y las coberturas obligatorias no deben poder desactivarse
  
  # Validar coberturas opcionales iniciales
  Y debe ver la sección "Coberturas Opcionales" con todas desactivadas:
    | cobertura      | estado_inicial |
    | Cristales      | Desactivada    |
    | Daños por Agua | Desactivada    |
    | Robo           | Desactivada    |
    | Remoción       | Desactivada    |
    | Equipo Electrónico| Desactivada |
  
  # Activar coberturas opcionales
  Cuando activa la cobertura opcional "Cristales"
  Y activa la cobertura opcional "Daños por Agua"
  Y activa la cobertura opcional "Robo"
  
  # Validar resumen
  Entonces el resumen debe mostrar:
    | tipo          | cantidad |
    | obligatorias  | 2        |
    | opcionales    | 3        |
    | total         | 5        |
  
  # Guardar y continuar
  Cuando hace clic en "Continuar"
  Entonces las coberturas deben guardarse correctamente
  Y debe ver mensaje de éxito "Coberturas guardadas exitosamente"
  Y debe ser redirigido al paso de resumen final "/quote/{id}/summary"
```

### Escenario: Resumen de coberturas activas

```gherkin
@microflujo-5 @resumen-coberturas @critical
Escenario: Verificar resumen completo de coberturas
  Dado que el agente está en la página de coberturas
  Cuando tiene activas las coberturas:
    | tipo       | cobertura      |
    | obligatoria| Incendio       |
    | obligatoria| CAT            |
    | opcional   | Cristales      |
    | opcional   | Daños por Agua |
    | opcional   | Robo           |
  Entonces el resumen debe mostrar:
    | concepto                    | valor              |
    | Coberturas Obligatorias     | 2                  |
    | Coberturas Opcionales       | 3                  |
    | Total Coberturas Activas    | 5                  |
    | Suma Asegurada Total        | $ 11,500,000.00    |
  Y cada cobertura activa debe tener su switch en posición ON
  Y cada cobertura inactiva debe tener su switch en posición OFF
```

---

## Flujo Completo - End-to-End

### Escenario: Happy Path Completo (Todos los microflujos)

```gherkin
@happy-path @e2e-completo @flujo-end-to-end @critical
Escenario: Ejecutar flujo completo de cotización desde Homepage hasta Coberturas
  Dado que el agente accede a la homepage de SeguraX
  
  # Microflujo 1
  Cuando hace clic en "Cotizar ahora"
  Entonces es redirigido a la página de cotización
  
  # Microflujo 2
  Cuando hace clic en "Crear Cotización"
  Entonces se genera un folio con formato válido
  Y el estado es "BORRADOR"
  
  # Microflujo 3
  Cuando selecciona "2" inmuebles
  Y hace clic en "Continuar"
  Entonces ve 2 fichas de inmueble creadas
  
  # Microflujo 4
  Cuando completa los datos del primer inmueble con datos válidos
  Y completa los datos del segundo inmueble con datos válidos
  Entonces ambos inmuebles están marcados como "COMPLETADO"
  Y la suma asegurada total se calcula correctamente
  
  # Microflujo 5
  Cuando hace clic en "Finalizar"
  Entonces es redirigido a la página de coberturas
  Y ve las coberturas obligatorias activas
  
  Cuando activa coberturas opcionales: "Cristales", "Daños por Agua", "Robo"
  Y hace clic en "Continuar"
  Entonces las coberturas se guardan correctamente
  Y es redirigido al resumen final
  Y el flujo E2E se completa exitosamente
```

---

## Escenarios de Error - Happy Path (Validaciones)

### Escenario: Timeout en carga de página

```gherkin
@error-path @timeout @e2e
Escenario: Manejar timeout cuando la página no carga
  Dado que el agente intenta acceder al sistema
  Cuando la página no carga en menos de 10 segundos
  Entonces Serenity debe capturar un screenshot
  Y el test debe reportar "TimeoutException"
  Y el mensaje debe indicar "La página no respondió en el tiempo esperado"
```

### Escenario: Elemento no encontrado

```gherkin
@error-path @element-not-found @e2e
Escenario: Manejar cuando un elemento UI no existe
  Dado que el agente está en una página
  Cuando intenta interactuar con un elemento que no existe
  Entonces Serenity debe capturar el estado actual de la página
  Y el reporte debe indicar claramente qué elemento no se encontró
  Y debe incluir el selector utilizado
```

---

## Tags y Metadatos

### Jerarquía de Tags

```
@happy-path              # Suite completa de happy path
├── @e2e                 # Tests end-to-end
├── @critical            # Tests de alta prioridad
├── @flujo-completo      # Ejecutar todo el flujo
├── @microflujo-1        # Homepage
│   └── @homepage
│   └── @navegacion
├── @microflujo-2        # Crear cotización
│   └── @crear-cotizacion
│   └── @folio
├── @microflujo-3        # Selección inmuebles
│   └── @seleccion-inmuebles
│   └── @cantidad
├── @microflujo-4        # Completar inmuebles
│   └── @completar-inmuebles
│   └── @formularios
└── @microflujo-5        # Configurar coberturas
    └── @configurar-coberturas
    └── @coberturas
    └── @final
```

### Ejecución por Tags

```bash
# Ejecutar todo el happy path
mvn clean verify -Dcucumber.filter.tags="@happy-path"

# Ejecutar solo un microflujo
mvn clean verify -Dcucumber.filter.tags="@microflujo-1"

# Ejecutar hasta el final (microflujos 1-5)
mvn clean verify -Dcucumber.filter.tags="@flujo-completo"

# Ejecutar tests críticos únicamente
mvn clean verify -Dcucumber.filter.tags="@critical"

# Ejecutar todos los E2E
mvn clean verify -Dcucumber.filter.tags="@e2e"
```

---

## Trazabilidad

| Escenario | HU Relacionada | Criterio de Aceptación | Microflujo |
|-----------|---------------|------------------------|------------|
| Navegar desde Homepage | HU-01 | CRITERIO-1.1 | Microflujo 1 |
| Crear cotización | HU-01 | CRITERIO-1.1 | Microflujo 2 |
| Seleccionar 2 inmuebles | HU-01 | CRITERIO-1.1 | Microflujo 3 |
| Completar datos de inmuebles | HU-01 | CRITERIO-1.1 | Microflujo 4 |
| Configurar coberturas | HU-01 | CRITERIO-1.1 | Microflujo 5 |
| Timeout en carga | HU-01 | CRITERIO-1.2 | Error Path |
| Elemento no encontrado | HU-01 | CRITERIO-1.2 | Error Path |

---

*Documento generado siguiendo los lineamientos de QA del Centro de Excelencia Sofka*
