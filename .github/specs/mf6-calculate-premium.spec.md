---
id: SPEC-006
status: IMPLEMENTED
feature: mf6-calculate-premium
created: 2025-01-21
updated: 2026-04-21
author: spec-generator
version: "1.0"
related-specs: [SPEC-001, SPEC-002, SPEC-003, SPEC-004, SPEC-005]
---

# Spec: MF6 — Cálculo de Prima (Premium Calculation)

> **Estado:** `DRAFT` → aprobar con `status: APPROVED` antes de iniciar implementación.
> **Ciclo de vida:** DRAFT → APPROVED → IN_PROGRESS → IMPLEMENTED → DEPRECATED

---

## 1. REQUERIMIENTOS

### Descripción
Micro-flujo 6 (MF6) del cotizador de seguros de daños. Implementa el cálculo de prima basado en las coberturas configuradas en el paso anterior (MF5). El sistema debe calcular primas netas y comerciales por inmueble, persistir el desglose en base de datos, y presentar un resumen detallado al usuario.

### Requerimiento de Negocio
El agente ya configuró las coberturas en CoverageStep.tsx (MF5). Al hacer click en "Continuar" debe dispararse el cálculo, persistirse en DB y mostrarse el resultado en una nueva página de resumen. El cálculo debe:
- Evaluar cada inmueble para determinar si es calculable (datos completos)
- Calcular prima neta = suma asegurada × tasa base por cobertura
- Aplicar factor comercial (1.2x) para obtener prima comercial
- Persistir desglose detallado por cobertura
- Manejar inmuebles incompletos sin bloquear el cálculo de los demás

### Historias de Usuario

#### HU-01: Calcular prima total del folio

```
Como: Agente de seguros
Quiero: Calcular la prima de la cotización después de configurar coberturas
Para: Conocer el costo total del seguro y presentarlo al asegurado

Prioridad: Alta
Estimación: L
Dependencias: MF5 (Configuración de Coberturas)
Capa: Backend + Frontend
```

#### Criterios de Aceptación — HU-01

**Happy Path**
```gherkin
CRITERIO-1.1: Calcular prima con datos completos
Dado que: Existe una cotización con 2 inmuebles completos
  Y: Cada inmueble tiene coberturas seleccionadas con valores > 0
Cuando: El agente hace click en "Continuar" en el paso de coberturas
Entonces: El sistema calcula la prima neta por cobertura
  Y: Aplica el factor comercial de 1.2x
  Y: Persiste los resultados en base de datos
  Y: Muestra el resumen con prima total comercial
  Y: Redirige a la página de resumen
```

**Error Path**
```gherkin
CRITERIO-1.2: Todos los inmuebles incompletos
Dado que: Existe una cotización donde todos los inmuebles están incompletos
Cuando: El agente intenta calcular la prima
Entonces: El sistema retorna error 422
  Y: El mensaje indica "No hay inmuebles con datos suficientes para calcular la prima"
  Y: No se guarda ningún cálculo
```

**Edge Case**
```gherkin
CRITERIO-1.3: Mix de inmuebles calculables e incompletos
Dado que: Existe una cotización con 3 inmuebles
  Y: 2 inmuebles están completos con coberturas configuradas
  Y: 1 inmueble está incompleto (falta CP o activityCode)
Cuando: El agente calcula la prima
Entonces: El sistema calcula solo los 2 inmuebles completos
  Y: Marca el tercero como INCOMPLETE con su razón
  Y: Muestra alerta indicando que X inmuebles no fueron calculados
  Y: El folio queda en estado CALCULATED
```

#### HU-02: Ver resumen de cálculo

```
Como: Agente de seguros
Quiero: Ver un resumen detallado del cálculo de prima
Para: Revisar el desglose por inmueble y cobertura antes de emitir

Prioridad: Alta
Estimación: M
Dependencias: HU-01
Capa: Frontend
```

#### Criterios de Aceptación — HU-02

**Happy Path**
```gherkin
CRITERIO-2.1: Visualizar resumen completo
Dado que: La prima ha sido calculada exitosamente
Cuando: El sistema redirige a la página de resumen
Entonces: Se muestra el número de folio, estado CALCULADO, fecha/hora
  Y: Se muestra la prima neta total, factor comercial aplicado (1.2x)
  Y: Se muestra la prima comercial total (la que paga el cliente)
  Y: Se muestra una card por cada inmueble con su desglose de coberturas
```

### Reglas de Negocio

1. **Regla 1 — Inmueble incompleto no bloquea el cálculo**: Si un inmueble no tiene CP válido (5 dígitos), activityCode con valor, o al menos un coverage > 0, se marca con status INCOMPLETE e incompleteReason. El cálculo continúa con los demás inmuebles y el folio queda CALCULADO.

2. **Regla 2 — Al menos un inmueble debe ser calculable**: Si TODOS los inmuebles están incompletos, el endpoint retorna 422 con mensaje: "No hay inmuebles con datos suficientes para calcular la prima".

3. **Regla 3 — Versionado optimista**: Cada vez que se ejecuta el cálculo, quote.version se incrementa en 1. Si el frontend tiene una versión desactualizada, retorna 409 Conflict.

4. **Regla 4 — Idempotencia del cálculo**: Si se llama POST /calculate múltiples veces, cada llamada SOBREESCRIBE el resultado anterior. Los premium_breakdowns anteriores se eliminan y se recrean. Siempre retorna el resultado más reciente.

5. **Regla 5 — Factor Comercial**: El factor comercial es fijo en 1.2 (configurable en DB con default 1.2). Prima Comercial = Prima Neta × Factor Comercial.

6. **Regla 6 — Cálculo de Cobertura**: Prima de cobertura = (coverageBuilding + coverageContents + coverageElectronic + coverageMachinery + coverageStock) × baseRate de la cobertura.

---

## 2. DISEÑO

### Modelos de Datos

#### Entidades afectadas

| Entidad | Almacén | Cambios | Descripción |
|---------|---------|---------|-------------|
| `Quote` | tabla `quotes` | modificada | Agregar campos de prima y versión |
| `Property` | tabla `properties` | modificada | Agregar campos de prima e incompleteReason |
| `QuoteCoverage` | tabla `quote_coverages` | modificada | Agregar calculatedPremium |
| `PremiumBreakdown` | tabla `premium_breakdowns` | nueva | Desglose de prima por cobertura e inmueble |

#### Campos del modelo — Quote (modificados)

| Campo | Tipo | Obligatorio | Default | Descripción |
|-------|------|-------------|---------|-------------|
| `netPremium` | decimal(12,2) | no | null | Prima neta total del folio |
| `commercialPremium` | decimal(12,2) | no | null | Prima comercial total (la que paga el cliente) |
| `commercialFactor` | decimal(4,2) | no | 1.2 | Factor comercial aplicado |
| `calculatedAt` | timestamp | no | null | Fecha/hora del último cálculo |
| `version` | int | sí | 1 | Versión para optimistic locking |

#### Campos del modelo — Property (modificados)

| Campo | Tipo | Obligatorio | Default | Descripción |
|-------|------|-------------|---------|-------------|
| `netPremium` | decimal(12,2) | no | null | Prima neta del inmueble |
| `commercialPremium` | decimal(12,2) | no | null | Prima comercial del inmueble |
| `incompleteReason` | text | no | null | Razón por la que no es calculable |

#### Campos del modelo — QuoteCoverage (modificado)

| Campo | Tipo | Obligatorio | Default | Descripción |
|-------|------|-------------|---------|-------------|
| `calculatedPremium` | decimal(12,2) | no | null | Prima calculada para esta cobertura |

#### Campos del modelo — PremiumBreakdown (nueva entidad)

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `id` | UUID | sí | PK autogenerado |
| `quoteId` | string | sí | FK a quotes.id |
| `propertyId` | string | sí | FK a properties.id |
| `coverageCode` | varchar(30) | sí | Código de cobertura (FIRE, CAT, etc.) |
| `coverageName` | varchar(100) | sí | Nombre legible de la cobertura |
| `amount` | decimal(12,2) | sí | Monto calculado de la prima |
| `createdAt` | timestamp | sí | Fecha de creación del registro |

#### Índices / Constraints

- `idx_premium_breakdown_quote_id` en `premium_breakdowns(quote_id)` — Búsquedas frecuentes por cotización
- `idx_premium_breakdown_property_id` en `premium_breakdowns(property_id)` — Búsquedas por inmueble
- `uq_premium_breakdown_quote_property_coverage` UNIQUE en `(quote_id, property_id, coverage_code)` — Evitar duplicados

### API Endpoints

#### POST /api/v1/quotes/:id/calculate

- **Descripción**: Calcula la prima de la cotización
- **Auth requerida**: sí
- **Request Body**: Ninguno
- **Response 200**:
```json
{
  "folio": "COT-2025-00001",
  "status": "CALCULATED",
  "version": 2,
  "netPremium": 25000.00,
  "commercialPremium": 30000.00,
  "commercialFactor": 1.2,
  "calculatedAt": "2025-01-21T14:30:00.000Z",
  "propertiesCalculated": 2,
  "propertiesTotal": 3,
  "properties": [
    {
      "propertyId": "uuid-1",
      "name": "Sucursal Centro",
      "status": "CALCULATED",
      "netPremium": 15000.00,
      "commercialPremium": 18000.00,
      "breakdown": [
        { "coverageCode": "FIRE", "coverageName": "Incendio y Rayo", "amount": 5000.00 },
        { "coverageCode": "CAT", "coverageName": "CAT (Terremoto/Huracán)", "amount": 10000.00 }
      ]
    },
    {
      "propertyId": "uuid-2",
      "name": "Sucursal Norte",
      "status": "INCOMPLETE",
      "incompleteReason": "Falta código postal válido (5 dígitos)"
    }
  ],
  "alerts": ["1 inmueble(s) no fueron calculados por datos incompletos"]
}
```
- **Response 404**: Cotización no encontrada
- **Response 409**: Versión desactualizada (conflicto de concurrencia)
- **Response 422**: No hay inmuebles con datos suficientes para calcular

### Diseño Frontend

#### Componentes nuevos

| Componente | Archivo | Props principales | Descripción |
|------------|---------|------------------|-------------|
| `PremiumTotalPanel` | `components/summary/PremiumTotalPanel.tsx` | `netPremium, commercialPremium, commercialFactor, propertiesCalculated, propertiesTotal, hasIncomplete` | Panel destacado con totales |
| `PropertyResultCard` | `components/summary/PropertyResultCard.tsx` | `property: PropertyResult` | Card con desglose por inmueble |
| `IncompletePropertyAlert` | `components/summary/IncompletePropertyAlert.tsx` | `count, onComplete` | Alerta de inmuebles incompletos |
| `WizardStepIndicator` | `components/wizard/WizardStepIndicator.tsx` | `currentStep, steps` | Reutilizar existente (paso 6 activo) |

#### Páginas nuevas

| Página | Archivo | Ruta | Protegida |
|--------|---------|------|-----------|
| `SummaryPage` | `pages/SummaryPage.tsx` | `/quote/:id/summary` | no |

#### Hooks y State

| Hook | Archivo | Retorna | Descripción |
|------|---------|---------|-------------|
| `useCalculate` | `hooks/useCalculate.ts` | `{ calculate, isLoading, result, error }` | Hook para llamar al endpoint de cálculo |
| `usePremiumResult` | `hooks/usePremiumResult.ts` | `{ data, loading, error, refetch }` | Hook para obtener resultado de cálculo (GET) |

#### Services (llamadas API)

| Función | Archivo | Endpoint |
|---------|---------|----------|
| `calculatePremium(quoteId)` | `services/premiumService.ts` | `POST /api/v1/quotes/{id}/calculate` |
| `getPremiumResult(quoteId)` | `services/premiumService.ts` | `GET /api/v1/quotes/{id}/premium` (opcional) |

#### Tipos TypeScript

Archivo: `src/types/premium.types.ts`

```typescript
export interface CoverageBreakdown {
  coverageCode: string;
  coverageName: string;
  amount: number;
}

export interface PropertyResult {
  propertyId: string;
  name: string;
  status: 'CALCULATED' | 'INCOMPLETE';
  incompleteReason?: string;
  netPremium?: number;
  commercialPremium?: number;
  breakdown: CoverageBreakdown[];
}

export interface PremiumCalculationResult {
  folio: string;
  status: string;
  version: number;
  netPremium: number;
  commercialPremium: number;
  commercialFactor: number;
  calculatedAt: string;
  propertiesCalculated: number;
  propertiesTotal: number;
  properties: PropertyResult[];
  alerts: string[];
}
```

#### Modificaciones a CoverageStep.tsx

El botón "Continuar" debe:
1. Llamar PATCH `/api/v1/quotes/{id}/coverages` (guardar selección) — YA EXISTE
2. Si éxito → llamar POST `/api/v1/quotes/{id}/calculate`
3. Si éxito → navigate(`/quote/${id}/summary`)
4. Mostrar spinner mientras calcula con texto "Calculando prima..."
5. Si error → mostrar toast de error sin salir de la página

### Arquitectura y Dependencias

#### Backend

**Patrón**: Arquitectura Hexagonal (Clean Architecture)

**Flujo**:
```
Controller → UseCase → Repository → TypeORM Entity
```

**Archivos a crear/modificar**:

1. **Domain**: Agregar campos a entidades Quote, Property
2. **Infrastructure**:
   - Modificar: `quote.typeorm.entity.ts`
   - Modificar: `property.typeorm.entity.ts`
   - Modificar: `quote-coverage.typeorm.entity.ts` (si existe) o crear
   - Crear: `premium-breakdown.typeorm.entity.ts`
3. **Application**: Crear `calculate-premium.use-case.ts`
4. **Presentation**: Agregar endpoint en `quote.controller.ts`
5. **Gateway**: Agregar ruta en `application.yml`

#### Frontend

**Stack**: React + TypeScript + Tailwind CSS + PrimeReact

**Flujo de usuario**:
```
CoverageStep (MF5)
    ↓ [Click "Continuar"]
  1. PATCH /coverages
    ↓
  2. POST /calculate (spinner)
    ↓
  3. navigate(/quote/:id/summary)
    ↓
SummaryPage
  - WizardStepIndicator (paso 6)
  - Header del folio
  - PremiumTotalPanel
  - PropertyResultCard[]
  - Acciones finales
```

### Notas de Implementación

> **Importante**: Este feature depende de que existan las coberturas en la base de datos. Asegurar que las coberturas FIRE, CAT, GLASS, WATER, THEFT, LIABILITY, ELECTRONIC, EXTRA_EXPENSES existan con sus tasas base.

> **Transaccionalidad**: Todo el cálculo debe ejecutarse en una sola transacción de base de datos. Si algo falla, hacer rollback completo.

> **Formato de moneda**: Usar esta función helper en todo el frontend:
> ```typescript
> const formatCurrency = (amount: number): string => {
>   return new Intl.NumberFormat('es-MX', {
>     style: 'currency',
>     currency: 'MXN',
>     minimumFractionDigits: 2
>   }).format(amount);
> };
> ```

> **Estilos**: Mantener consistencia con los otros pasos del wizard:
> - Fondo: `bg-[#1A1A2E]`
> - Acento dorado: `text-[#C9A84C]`, `bg-[#C9A84C]`
> - Botón primario: `bg-[#C9A84C] hover:bg-[#B8983E]`

---

## 3. LISTA DE TAREAS

> Checklist accionable para todos los agentes. Marcar cada ítem (`[x]`) al completarlo.
> El Orchestrator monitorea este checklist para determinar el progreso.

### Backend

#### Implementación
- [ ] Agregar campos a entidad Quote (domain + infrastructure)
  - `netPremium`, `commercialPremium`, `commercialFactor`, `calculatedAt`, `version`
- [ ] Agregar campos a entidad Property (domain + infrastructure)
  - `netPremium`, `commercialPremium`, `incompleteReason`
- [ ] Agregar campo `calculatedPremium` a QuoteCoverage entity
- [ ] Crear entidad PremiumBreakdown (domain + infrastructure)
- [ ] Crear migración de base de datos para nuevos campos y tabla
- [ ] Crear CalculatePremiumUseCase con toda la lógica de negocio
  - Validación de inmuebles calculables
  - Cálculo de primas por cobertura
  - Aplicación de factor comercial
  - Manejo de transacciones
- [ ] Crear PremiumBreakdownRepository para persistir desglose
- [ ] Agregar método `calculatePremium` en QuoteController
- [ ] Agregar ruta en ms-gateway (application.yml)
- [ ] Actualizar QuoteMapper para incluir nuevos campos en respuestas
- [ ] Actualizar DTOs de Quote (response, update) con nuevos campos

#### Tests Backend
- [ ] `test_calculate_premium_success` — happy path con inmuebles completos
- [ ] `test_calculate_premium_incomplete_properties` — mix de calculables e incompletos
- [ ] `test_calculate_premium_all_incomplete_throws_422` — todos incompletos
- [ ] `test_calculate_premium_version_conflict_throws_409` — optimistic locking
- [ ] `test_calculate_premium_overwrites_previous` — idempotencia
- [ ] `test_calculate_premium_transaction_rollback` — fallo en medio del cálculo
- [ ] `test_calculate_premium_not_found_throws_404` — cotización no existe

### Frontend

#### Implementación
- [ ] Crear `src/types/premium.types.ts` con todas las interfaces
- [ ] Crear `src/services/premiumService.ts` con función `calculatePremium`
- [ ] Crear `src/hooks/useCalculate.ts` hook con loading y error states
- [ ] Crear componente `PremiumTotalPanel.tsx` con formato de moneda
- [ ] Crear componente `PropertyResultCard.tsx` con tabla de desglose
- [ ] Crear componente `IncompletePropertyAlert.tsx` para inmuebles incompletos
- [ ] Crear página `SummaryPage.tsx` integrando todos los componentes
- [ ] Modificar `CoverageStep.tsx` para llamar calculate antes de navegar
  - Agregar estado de carga "Calculando prima..."
  - Manejar errores con toast
- [ ] Agregar ruta `/quote/:id/summary` en `App.tsx`
- [ ] Crear helper `formatCurrency()` en `src/utils/currency.ts`
- [ ] Actualizar `WizardStepIndicator` en SummaryPage (paso 6 activo)

#### Tests Frontend
- [ ] `PremiumTotalPanel renders correct amounts` — formato de moneda
- [ ] `PropertyResultCard shows breakdown table` — tabla de coberturas
- [ ] `PropertyResultCard shows incomplete state` — badge rojo y razón
- [ ] `useCalculate calls API and returns result` — hook functionality
- [ ] `useCalculate handles error state` — manejo de errores
- [ ] `SummaryPage displays all properties` — integración completa
- [ ] `CoverageStep calls calculate on continue` — modificación del flujo
- [ ] `IncompletePropertyAlert triggers navigation` — botón completar datos

### Tests E2E (Serenity BDD + Screenplay)

**Feature File**: `e2e/src/test/resources/features/calculo_prima_resumen.feature`

#### Scenarios Gherkin:
- [x] **@happy-path** - Calcular prima exitosamente
- [x] **@desglose** - Ver desglose por cobertura e inmueble
- [x] **@acciones** - Acciones disponibles en resumen
- [x] **@inmueble-incompleto** - Manejar inmuebles incompletos
- [x] **@recalcular** - Recalcular prima (idempotencia)
- [x] **@validacion-negocio** - Validar fórmulas matemáticas
- [x] **@api-integration** - Validar integración con backend

#### Step Definitions Creados:
- [x] `SummaryStepDefinitions.java` - 8 step definitions
- [x] `HappyPathFlujoCompletoStepDefinitions.java` - Actualizado con MF6

#### Tasks Screenplay:
- [x] `CalcularLaPrima.java` - Esperar cálculo automático
- [x] `RecalcularLaPrima.java` - Click en recalcular
- [x] `NavegarASummary.java` - Navegar a /quote/:id/summary

#### Questions Screenplay:
- [x] `ElPanelDePrimaTotal.java` - Verificar panel visible
- [x] `LaPrimaComercial.java` - Obtener valor de prima
- [x] `ElDesglosePorInmueble.java` - Verificar desglose
- [x] `LosBotonesDeAccionSummary.java` - Verificar botones

### QA Manual
- [ ] Ejecutar skill `/gherkin-case-generator` → criterios CRITERIO-1.1, 1.2, 1.3, 2.1
- [ ] Ejecutar skill `/risk-identifier` → clasificación ASD de riesgos
- [ ] Validar cálculo manual: suma asegurada × tasa = prima esperada
- [ ] Validar factor comercial 1.2x aplicado correctamente
- [ ] Probar escenario: 100 inmuebles (performance)
- [ ] Probar escenario: Todos los inmuebles incompletos
- [ ] Probar escenario: Doble clic en "Continuar" (idempotencia)
- [ ] Actualizar estado spec: `status: IMPLEMENTED`

---

## 4. ESTRUCTURA DE ARCHIVOS ESPERADA

### Backend

```
ms-core/src/
├── domain/quote/entities/quote.entity.ts                    ← agregar campos
├── domain/quote/enums/quote-status.enum.ts                  ← agregar CALCULATED
├── domain/property/entities/property.entity.ts               ← agregar campos
├── domain/premium/entities/premium-breakdown.entity.ts       ← NUEVO
├── infrastructure/quote/entities/quote.typeorm.entity.ts     ← agregar campos
├── infrastructure/property/entities/property.typeorm.entity.ts ← agregar campos
├── infrastructure/coverage/entities/quote-coverage.typeorm.entity.ts ← agregar calculatedPremium
├── infrastructure/premium/entities/premium-breakdown.typeorm.entity.ts ← NUEVO
├── application/quote/use-cases/calculate-premium.use-case.ts ← NUEVO (reescribir)
├── application/quote/dto/premium-calculation-response.dto.ts ← NUEVO
├── presentation/quote/quote.controller.ts                    ← agregar endpoint
└── presentation/quote/quote.module.ts                        ← registrar use case

ms-gateway/src/main/resources/application.yml               ← agregar ruta
```

### Frontend

```
src/
├── types/
│   └── premium.types.ts                                    ← NUEVO
├── services/
│   └── premiumService.ts                                   ← NUEVO
├── hooks/
│   ├── useCalculate.ts                                     ← NUEVO
│   └── usePremiumResult.ts                                 ← NUEVO (opcional)
├── components/summary/
│   ├── PremiumTotalPanel.tsx                             ← NUEVO
│   ├── PropertyResultCard.tsx                            ← NUEVO
│   └── IncompletePropertyAlert.tsx                       ← NUEVO
├── pages/
│   └── SummaryPage.tsx                                   ← NUEVO
├── utils/
│   └── currency.ts                                       ← NUEVO (formatCurrency)
├── components/coverage/
│   └── CoverageStep.tsx                                  ← modificar botón Continuar
└── App.tsx                                               ← agregar ruta /summary
```

---

## 5. ORDEN DE IMPLEMENTACIÓN RECOMENDADO

1. **Backend — Modelos y DB**
   - Modificar entidades existentes (Quote, Property)
   - Crear entidad PremiumBreakdown
   - Generar y ejecutar migración

2. **Backend — Lógica de negocio**
   - Implementar CalculatePremiumUseCase
   - Crear PremiumBreakdownRepository
   - Implementar endpoint en controller

3. **Backend — Gateway**
   - Agregar ruta en application.yml

4. **Frontend — Tipos y Servicios**
   - Crear premium.types.ts
   - Crear premiumService.ts
   - Crear useCalculate.ts

5. **Frontend — Componentes**
   - PremiumTotalPanel
   - PropertyResultCard
   - IncompletePropertyAlert

6. **Frontend — Integración**
   - Crear SummaryPage.tsx
   - Modificar CoverageStep.tsx
   - Agregar ruta en App.tsx

7. **QA y Testing**
   - Tests unitarios
   - Tests de integración
   - Validación de reglas de negocio

---

## 6. DEPENDENCIAS EXTERNAS

- **Backend**: NestJS, TypeORM, PostgreSQL
- **Frontend**: React, React Router, Tailwind CSS, PrimeReact
- **Gateway**: Spring Cloud Gateway (Java)

---

## 7. REFERENCIAS

- Patrón de arquitectura: Hexagonal/Clean Architecture
- Estilos UI: Ver `frontend/src/components/coverage/CoverageStep.tsx` para referencia de estilos
- Hook pattern: Ver `frontend/src/hooks/useCoverages.ts` para referencia de hooks
- Controller pattern: Ver `ms-core/src/presentation/quote/quote.controller.ts`
