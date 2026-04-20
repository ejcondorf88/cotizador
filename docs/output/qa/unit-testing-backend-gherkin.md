# Escenarios Gherkin — SPEC-014: Unit Testing Backend

## Resumen

Este documento contiene escenarios Gherkin adicionales y complementarios a los tests unitarios existentes. Los escenarios aquí descritos representan **casos de borde**, **flujos de error avanzados** y **escenarios de integración** que deberían ser considerados para pruebas de aceptación o E2E.

---

## HU-01: Domain Entities Testing

### Feature: Creación y gestión de Cotizaciones (Quote)

```gherkin
# language: es
Característica: Gestión de entidad Quote
  Como desarrollador
  Quiero validar el comportamiento de la entidad Quote
  Para garantizar la integridad de la lógica de negocio

  @happy-path @domain @critico
  Escenario: Crear una cotización con folio único
    Dado que el sistema genera un folio con año 2026 y número 1
    Cuando se crea la cotización
    Entonces el folio debe ser "COT-2026-00001"
    Y el estado debe ser "DRAFT"
    Y debe tener un ID único generado

  @happy-path @domain
  Escenario: Actualizar detalles de la cotización de forma parcial
    Dado que existe una cotización con folio "COT-2026-00001"
    Y tiene los detalles iniciales:
      | campo         | valor          |
      | companyName   | Empresa A      |
      | rfc           | RFC123456      |
    Cuando se actualizan los detalles con:
      | campo         | valor          |
      | businessLine  | Tecnología     |
    Entonces el companyName debe mantenerse "Empresa A"
    Y el rfc debe mantenerse "RFC123456"
    Y el businessLine debe ser "Tecnología"

  @edge-case @domain
  Escenario: Actualizar múltiples veces preserva historial implícito
    Dado que existe una cotización en estado "DRAFT"
    Cuando se actualiza el campo "companyName" con valor "Empresa 1"
    Y luego se actualiza con valor "Empresa 2"
    Y luego se actualiza con valor "Empresa 3"
    Entonces el companyName actual debe ser "Empresa 3"
    Y el timestamp de actualización debe reflejar la última modificación

  @error-path @domain @critico
  Escenario: Transición de estado inválida - DRAFT a COMPLETED directamente
    Dado que existe una cotización en estado "DRAFT"
    Cuando se intenta cambiar el estado a "COMPLETED"
    Entonces debe lanzarse una excepción de transición inválida
    Y el estado debe permanecer como "DRAFT"

  @error-path @domain
  Escenario: Transición de estado inválida - COMPLETED a cualquier otro
    Dado que existe una cotización en estado "COMPLETED"
    Cuando se intenta cambiar el estado a "IN_PROGRESS"
    Entonces debe lanzarse una excepción de transición inválida
    Y el estado debe permanecer como "COMPLETED"

  @edge-case @domain
  Escenario: Cancelar cotización desde cualquier estado
    Dado que existe una cotización en estado "<estado>"
    Cuando se cancela la cotización
    Entonces el estado debe ser "CANCELLED"

    Ejemplos:
      | estado       |
      | DRAFT        |
      | IN_PROGRESS  |
      | COMPLETED    |

  @edge-case @domain
  Escenario: Reactivar cotización cancelada solo a DRAFT
    Dado que existe una cotización en estado "CANCELLED"
    Cuando se intenta reactivar
    Entonces el estado debe ser "DRAFT"
    Y no debe permitirse cambiar directamente a "IN_PROGRESS"
```

### Feature: Gestión de Propiedades (Property)

```gherkin
# language: es
Característica: Gestión de entidad Property
  Como desarrollador
  Quiero validar el comportamiento de la entidad Property
  Para garantizar el cálculo correcto del estado de completitud

  @happy-path @domain @critico
  Escenario: Calcular porcentaje de completitud con todos los campos
    Dado que se crea una propiedad con:
      | campo              | valor           |
      | name               | Sucursal Norte  |
      | address.street     | Av. Principal   |
      | address.zipCode    | 12345           |
      | construction.type  | CONCRETO        |
      | coverages.building | 1000000         |
    Cuando se recalcula el estado
    Entonces el porcentaje debe ser 100%
    Y el estado debe ser "COMPLETE"

  @happy-path @domain
  Escenario: Calcular suma total de coberturas
    Dado que se crea una propiedad con coberturas:
      | tipo               | monto    |
      | building           | 1000000  |
      | contents           | 500000   |
      | electronicEquipment| 100000   |
      | machinery          | 200000   |
      | stock              | 200000   |
    Cuando se calcula la cobertura total
    Entonces el resultado debe ser 2000000

  @edge-case @domain
  Escenario: Propiedad con todas las coberturas en cero
    Dado que se crea una propiedad con:
      | campo              | valor      |
      | address.street     | Calle Test |
      | address.zipCode    | 12345      |
      | construction.type  | CONCRETO   |
    Y todas las coberturas son 0
    Cuando se recalcula el estado
    Entonces el estado debe ser "INCOMPLETE"
    Y debe registrarse la razón: "Sin cobertura definida"

  @edge-case @domain
  Escenario: Calle con longitud mínima inválida
    Dado que se crea una propiedad con:
      | campo              | valor   |
      | address.street     | A       |
      | address.zipCode    | 12345   |
    Cuando se recalcula el estado
    Entonces el estado debe ser "INCOMPLETE"
    Y la calle debe ser considerada incompleta

  @edge-case @domain
  Escenario: Código postal con letras
    Dado que se crea una propiedad con:
      | campo              | valor   |
      | address.zipCode    | ABCDE   |
    Cuando se recalcula el estado
    Entonces el estado debe ser "INCOMPLETE"
    Y debe registrarse error de validación en CP

  @edge-case @domain
  Escenario: Actualización parcial de campos anidados preserva resto
    Dado que existe una propiedad completa con:
      | campo              | valor           |
      | address.city       | Ciudad A        |
      | address.state      | Estado A        |
      | construction.year  | 2020            |
    Cuando se actualiza solo el campo "address.city" con "Ciudad B"
    Entonces el estado debe seguir siendo "COMPLETE"
    Y address.state debe seguir siendo "Estado A"
    Y construction.year debe seguir siendo 2020
```

---

## HU-02: Application Layer Testing

### Feature: Casos de uso de Cotización

```gherkin
# language: es
Característica: Casos de uso de Quote
  Como desarrollador
  Quiero validar la orquestación de casos de uso
  Para garantizar el flujo correcto de la aplicación

  @happy-path @application @critico
  Escenario: Crear cotización genera folio único automáticamente
    Dado que el último folio del año 2026 es "COT-2026-00010"
    Cuando se ejecuta el caso de uso CreateQuote
    Entonces el folio generado debe ser "COT-2026-00011"
    Y el estado inicial debe ser "DRAFT"

  @error-path @application @critico
  Escenario: Creación fallida por error de base de datos
    Dado que el repositorio de cotizaciones está caído
    Cuando se ejecuta el caso de uso CreateQuote
    Entonces debe lanzarse un error de infraestructura
    Y debe registrarse el error en logs
    Y no debe existir la cotización parcial

  @edge-case @application @critico
  Escenario: Concurrencia - Múltiples cotizaciones simultáneas
    Dado que 10 usuarios crean cotizaciones al mismo tiempo
    Cuando se procesan todas las solicitudes
    Entonces deben generarse 10 folios únicos
    Y no debe haber folios duplicados
    Y la secuencia debe ser contigua

  @error-path @application
  Escenario: Actualizar cotización inexistente
    Dado que se intenta actualizar una cotización con ID "NO-EXISTE"
    Cuando se ejecuta el caso de uso UpdateQuote
    Entonces debe lanzarse NotFoundException
    Y el mensaje debe indicar "Quote with id NO-EXISTE not found"

  @error-path @application
  Escenario: Validación de fechas - Fecha fin anterior a inicio
    Dado que existe una cotización válida
    Cuando se actualiza con:
      | campo         | valor      |
      | validityStart | 2026-12-31 |
      | validityEnd   | 2026-01-01 |
    Entonces debe lanzarse BadRequestException
    Y el mensaje debe indicar "validityEnd must be after validityStart"

  @edge-case @application
  Escenario: Validación de fechas - Mismo día
    Dado que existe una cotización válida
    Cuando se actualiza con:
      | campo         | valor      |
      | validityStart | 2026-06-01 |
      | validityEnd   | 2026-06-01 |
    Entonces debe lanzarse BadRequestException
    O debe aceptarse con duración mínima de 1 día

  @edge-case @application
  Escenario: Actualizar solo un campo preserva los demás
    Dado que existe una cotización con detalles completos
    Cuando se actualiza solo el campo "companyName"
    Entonces todos los demás campos deben mantener sus valores originales
    Y el timestamp debe actualizarse

  @error-path @application
  Escenario: Actualizar con RFC inválido
    Dado que existe una cotización en estado "DRAFT"
    Cuando se actualiza con rfc "INVALIDO"
    Entonces debe lanzarse BadRequestException
    Y el mensaje debe indicar formato de RFC inválido
```

### Feature: Casos de uso de Propiedades

```gherkin
# language: es
Característica: Casos de uso de Property
  Como desarrollador
  Quiero validar la gestión de propiedades
  Para garantizar la integridad de datos

  @happy-path @application @critico
  Escenario: Crear múltiples propiedades en bulk
    Dado que existe una cotización con ID "quote-123" sin propiedades
    Cuando se crean 5 propiedades en bulk
    Entonces deben crearse exactamente 5 propiedades
    Y todas deben estar en estado "INCOMPLETE"
    Y todas deben tener el quoteId "quote-123"
    Y los nombres deben ser "Inmueble 1", "Inmueble 2", etc.

  @error-path @application @critico
  Escenario: Crear propiedades para cotización inexistente
    Dado que se intentan crear propiedades para quote "NO-EXISTE"
    Cuando se ejecuta el caso de uso CreatePropertiesBulk
    Entonces debe lanzarse NotFoundException

  @error-path @application @critico
  Escenario: Crear propiedades cuando ya existen
    Dado que existe una cotización con propiedades existentes
    Cuando se intentan crear más propiedades
    Entonces debe lanzarse BadRequestException
    Y el mensaje debe indicar "Quote already has N properties. Delete them first."

  @edge-case @application
  Escenario: Crear 1 propiedad (límite inferior)
    Dado que existe una cotización sin propiedades
    Cuando se crea 1 propiedad en bulk
    Entonces debe crearse exactamente 1 propiedad
    Y debe llamarse "Inmueble 1"

  @edge-case @application
  Escenario: Crear 100 propiedades (límite superior)
    Dado que existe una cotización sin propiedades
    Cuando se crean 100 propiedades en bulk
    Entonces deben crearse exactamente 100 propiedades
    Y todas deben tener quoteId correcto

  @error-path @application
  Escenario: Crear 0 propiedades
    Dado que existe una cotización sin propiedades
    Cuando se intentan crear 0 propiedades
    Entonces debe lanzarse BadRequestException
    Y el mensaje debe indicar "Count must be between 1 and 100"

  @error-path @application
  Escenario: Crear 101 propiedades (excede límite)
    Dado que existe una cotización sin propiedades
    Cuando se intentan crear 101 propiedades
    Entonces debe lanzarse BadRequestException

  @happy-path @application
  Escenario: Actualizar propiedad con datos válidos
    Dado que existe una propiedad con ID "prop-123"
    Cuando se actualiza con:
      | campo              | valor      |
      | name               | Nueva Name |
      | zipCode            | 54321      |
      | coverageBuilding   | 2000000    |
    Entonces el nombre debe ser "Nueva Name"
    Y el CP debe ser "54321"
    Y la cobertura debe ser 2000000
    Y debe recalcularse el estado

  @error-path @application
  Escenario: Actualizar propiedad con CP inválido (4 dígitos)
    Dado que existe una propiedad con ID "prop-123"
    Cuando se actualiza con zipCode "1234"
    Entonces debe lanzarse BadRequestException
    Y el mensaje debe indicar "Zip code must be exactly 5 digits"

  @error-path @application
  Escenario: Actualizar propiedad con CP con letras
    Dado que existe una propiedad con ID "prop-123"
    Cuando se actualiza con zipCode "ABCDE"
    Entonces debe lanzarse BadRequestException

  @error-path @application
  Escenario: Validar año de construcción - Antes de 1900
    Dado que existe una propiedad con ID "prop-123"
    Cuando se actualiza con constructionYear 1899
    Entonces debe lanzarse BadRequestException

  @error-path @application
  Escenario: Validar año de construcción - Futuro
    Dado que existe una propiedad con ID "prop-123"
    Y el año actual es 2026
    Cuando se actualiza con constructionYear 2027
    Entonces debe lanzarse BadRequestException

  @error-path @application
  Escenario: Validar cobertura negativa
    Dado que existe una propiedad con ID "prop-123"
    Cuando se actualiza con coverageBuilding -1000
    Entonces debe lanzarse BadRequestException

  @error-path @application
  Escenario: Validar cobertura excede máximo
    Dado que existe una propiedad con ID "prop-123"
    Cuando se actualiza con coverageBuilding 200000000
    Entonces debe lanzarse BadRequestException
    Y el mensaje debe indicar "Maximum building coverage"
```

---

## HU-03: Infrastructure Layer Testing

### Feature: Mapeo de entidades

```gherkin
# language: es
Característica: Mapeo entre Domain y TypeORM
  Como desarrollador
  Quiero validar la transformación de datos
  Para garantizar la integridad en persistencia

  @happy-path @infrastructure @critico
  Escenario: Mapeo bidireccional de Quote preserva todos los datos
    Dado que existe una entidad de dominio Quote completa:
      | campo         | valor          |
      | id            | quote-123      |
      | folioNumber   | COT-2026-00001 |
      | status        | DRAFT          |
      | companyName   | Empresa Test   |
      | rfc           | RFC123456      |
      | currency      | MXN            |
    Cuando se mapea a entidad TypeORM
    Y se mapea de vuelta a dominio
    Entonces todos los campos deben coincidir
    Y el id debe ser "quote-123"
    Y el folioNumber debe ser "COT-2026-00001"
    Y los detalles deben estar presentes

  @happy-path @infrastructure
  Escenario: Mapeo de Quote sin detalles
    Dado que existe una entidad de dominio Quote sin detalles
    Cuando se mapea a entidad TypeORM
    Y se mapea de vuelta a dominio
    Entonces los campos de detalles deben ser undefined
    Y los campos obligatorios deben estar presentes

  @happy-path @infrastructure @critico
  Escenario: Mapeo bidireccional de Property con JSON
    Dado que existe una entidad de dominio Property completa:
      | campo              | valor            |
      | id                 | prop-123         |
      | quoteId            | quote-456        |
      | name               | Sucursal Norte   |
      | address.street     | Av. Principal    |
      | address.zipCode    | 01000            |
      | construction.type  | CONCRETO         |
      | coverages.building | 1000000          |
    Cuando se mapea a entidad TypeORM
    Y se mapea de vuelta a dominio
    Entonces el objeto address debe mantenerse intacto
    Y el objeto construction debe mantenerse intacto
    Y el objeto coverages debe mantenerse intacto

  @edge-case @infrastructure
  Escenario: Mapeo con valores nulos en campos opcionales
    Dado que existe una entidad con:
      | campo              | valor   |
      | constructionYear   | null    |
      | levels             | null    |
      | activityCode       | null    |
    Cuando se mapea a dominio
    Entonces los campos nulos deben ser undefined en el dominio

  @edge-case @infrastructure
  Escenario: Mapeo de lista de propiedades
    Dado que existen 50 entidades TypeORM de propiedades
    Cuando se mapean a dominio como lista
    Entonces la lista debe tener 50 elementos
    Y cada elemento debe ser instancia de Property
```

---

## Datos de Prueba Sintéticos

### Cotizaciones (Quotes)

| Escenario | Folio | Estado | companyName | rfc | validityStart | validityEnd |
|-----------|-------|--------|-------------|-----|---------------|-------------|
| Básico válido | COT-2026-00001 | DRAFT | Empresa S.A. | RFC123456789 | 2026-01-01 | 2026-12-31 |
| Con detalles completos | COT-2026-00002 | IN_PROGRESS | Constructora ABC | ABC987654321 | 2026-06-01 | 2027-05-31 |
| Completada | COT-2026-00003 | COMPLETED | Financiera XYZ | XYZ555555555 | 2026-03-01 | 2027-02-28 |
| Cancelada | COT-2026-00004 | CANCELLED | Empresa Fallida | BAD000000000 | - | - |
| Fecha inválida | COT-2026-00005 | DRAFT | Test | TEST12345678 | 2026-12-31 | 2026-01-01 |

### Propiedades (Properties)

| Escenario | ID | quoteId | name | status | zipCode | constructionYear | coverageBuilding |
|-----------|-----|---------|------|--------|---------|------------------|------------------|
| Completa | prop-001 | quote-001 | Sucursal Norte | COMPLETE | 01000 | 2020 | 1000000 |
| Incompleta | prop-002 | quote-001 | Sucursal Sur | INCOMPLETE | - | - | 0 |
| CP inválido | prop-003 | quote-002 | Propiedad Bad | INCOMPLETE | 1234 | 2019 | 500000 |
| Año futuro | prop-004 | quote-002 | Propiedad Bad2 | - | 12345 | 2030 | 500000 |
| Cobertura alta | prop-005 | quote-003 | Almacén | COMPLETE | 54321 | 2015 | 150000000 |

---

## Escenarios Adicionales para E2E (Futuro)

```gherkin
# language: es
Característica: End-to-End Testing (Pendiente de implementación)

  @e2e @critico @pendiente
  Escenario: Flujo completo de creación de cotización
    Dado que el usuario accede al sistema
    Cuando crea una nueva cotización
    Y agrega 3 propiedades
    Y completa los detalles de la cotización
    Y actualiza los datos de cada propiedad
    Entonces la cotización debe estar en estado "IN_PROGRESS"
    Y todas las propiedades deben estar "COMPLETE"

  @e2e @pendiente
  Escenario: Validación de API - Crear cotización sin autenticación
    Dado que no hay sesión de usuario activa
    Cuando se intenta crear una cotización vía API
    Entonces debe retornarse código 401

  @e2e @pendiente
  Escenario: Performance - Crear 100 propiedades
    Dado que existe una cotización válida
    Cuando se crean 100 propiedades en una sola operación
    Entonces la operación debe completarse en menos de 5 segundos
    Y todas las propiedades deben estar persistidas
```

---

## Cobertura de Escenarios

| HU | Happy Path | Error Path | Edge Case | Total |
|----|------------|------------|-----------|-------|
| HU-01 (Domain) | 5 | 4 | 6 | 15 |
| HU-02 (Application) | 4 | 10 | 5 | 19 |
| HU-03 (Infrastructure) | 4 | 0 | 2 | 6 |
| **E2E (Pendiente)** | 2 | 1 | 1 | 4 |
| **TOTAL** | **15** | **15** | **14** | **44** |

---

## Estado de Implementación

| Tipo | Implementado | Pendiente |
|------|---------------|-----------|
| Domain Tests | ✅ 35+ tests | - |
| Application Tests | ✅ 40+ tests | - |
| Infrastructure Tests | ✅ 16+ tests | Integration tests |
| E2E Tests | ❌ 0 tests | 44 scenarios |
| DTO Validation Tests | ⚠️ Parcial | Tests exhaustivos |

---

*Generado por: QA Agent — Cotizador SeguraX*  
*Fecha: 2026-04-19*  
*Spec: SPEC-014 (unit-testing-backend)*  
*Total escenarios documentados: 44*
