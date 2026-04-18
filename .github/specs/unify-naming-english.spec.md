---
id: SPEC-006
status: APPROVED
feature: unify-naming-english
created: 2025-01-18
updated: 2025-01-18
author: spec-generator
version: "1.0"
related-specs: ["cotizador-backend", "integracion-frontend-backend"]
---

# Spec: Unificar Nomenclatura a Inglés en Frontend y Backend

> **Estado:** `DRAFT` → aprobar con `status: APPROVED` antes de iniciar implementación.
> **Ciclo de vida:** DRAFT → APPROVED → IN_PROGRESS → IMPLEMENTED → DEPRECATED

---

## 1. REQUERIMIENTOS

### Descripción
Migrar toda la nomenclatura del código (métodos, propiedades, clases, archivos y endpoints) del español al inglés para mantener consistencia con estándares internacionales de desarrollo y mejorar la mantenibilidad del código.

### Requerimiento de Negocio
> "Actualmente el código tiene una mezcla de español e inglés. Los métodos y propiedades están en español (ej: `crearCotizacion`, `numeroFolio`, `estado`) mientras que el framework y librerías están en inglés. Queremos unificar todo a inglés para seguir convenciones estándar."

### Historias de Usuario

#### HU-01: Renombrar Entidades y Propiedades del Backend

```
Como: Desarrollador
Quiero: Que todas las entidades, propiedades y métodos del backend estén en inglés
Para: Mantener consistencia con estándares internacionales y mejorar legibilidad

Prioridad: Alta
Estimación: M
Dependencias: Ninguna
Capa: Backend
```

#### Criterios de Aceptación — HU-01

**Happy Path**
```gherkin
CRITERIO-1.1: Entidad Cotizacion renombrada a Quote
Dado que: Existe la entidad Cotizacion con propiedades en español
Cuando: Se migra a la entidad Quote con propiedades en inglés
Entonces: Todas las referencias se actualizan correctamente
Y: La API expone endpoints en inglés (/api/v1/quotes)
Y: La base de datos mantiene compatibilidad o se migra
```

**Error Path**
```gherkin
CRITERIO-1.2: Referencias rotas por renombrado
Dado que: Se renombraron archivos y clases
Cuando: Existen importaciones antiguas en otros módulos
Entonces: El sistema debe detectar todos los errores de compilación
Y: Proporcionar lista completa de referencias a actualizar
```

#### HU-02: Renombrar Servicios y Hooks del Frontend

```
Como: Desarrollador frontend
Quiero: Que servicios, hooks y tipos estén en inglés
Para: Mantener consistencia con el backend y convenciones de React

Prioridad: Alta
Estimación: S
Dependencias: HU-01 (para alinearse con API)
Capa: Frontend
```

#### Criterios de Aceptación — HU-02

```gherkin
CRITERIO-2.1: Servicio renombrado de cotizacionService a quoteService
Dado que: El servicio expone métodos en español
Cuando: Se migra a inglés (createQuote, getQuote, etc.)
Entonces: Todos los componentes que lo usan se actualizan
Y: Los tipos TypeScript reflejan los nuevos nombres
```

### Reglas de Negocio

1. **Convención de nombres**: Usar camelCase para propiedades/métodos, PascalCase para clases/interfaces
2. **Nombres de dominio**: 
   - `Cotizacion` → `Quote`
   - `numeroFolio` → `folioNumber`
   - `estado` → `status`
   - `fechaCreacion` → `createdAt`
   - `fechaActualizacion` → `updatedAt`
3. **Endpoints API**: `/api/v1/quotes` (reemplaza `/api/v1/cotizaciones`)
4. **Estados**: `'BORRADOR'` → `'DRAFT'`, `'EN_PROCESO'` → `'IN_PROGRESS'`, etc.
5. **Base de datos**: Mapeo de columnas snake_case: `numero_folio` → `folio_number`
6. **Sin breaking changes**: Mantener compatibilidad durante transición (opcional: endpoints duplicados)

---

## 2. DISEÑO

### Mapeo de Nombres

#### Backend - Entidades y Clases

| Español (Actual) | Inglés (Nuevo) | Tipo | Ubicación |
|------------------|----------------|------|-----------|
| `Cotizacion` | `Quote` | Clase dominio | `domain/quote/entities/quote.entity.ts` |
| `CotizacionRepositoryPort` | `QuoteRepositoryPort` | Interface | `domain/quote/ports/quote.repository.port.ts` |
| `CrearCotizacionUseCase` | `CreateQuoteUseCase` | Clase | `application/quote/use-cases/create-quote.use-case.ts` |
| `CotizacionResponseDto` | `QuoteResponseDto` | DTO | `application/quote/dto/quote-response.dto.ts` |
| `CotizacionController` | `QuoteController` | Controller | `presentation/quote/quote.controller.ts` |
| `CotizacionMapper` | `QuoteMapper` | Mapper | `infrastructure/quote/mappers/quote.mapper.ts` |
| `CotizacionRepositoryAdapter` | `QuoteRepositoryAdapter` | Repository | `infrastructure/quote/adapters/quote-repository.adapter.ts` |
| `CotizacionTypeOrmEntity` | `QuoteTypeOrmEntity` | Entity | `infrastructure/quote/entities/quote.typeorm.entity.ts` |

#### Backend - Propiedades

| Español (Actual) | Inglés (Nuevo) | Tipo |
|------------------|----------------|------|
| `id` | `id` | string (UUID) |
| `numeroFolio` | `folioNumber` | string |
| `estado` | `status` | enum: DRAFT, IN_PROGRESS, COMPLETED, CANCELLED |
| `fechaCreacion` | `createdAt` | Date (ISO8601) |
| `fechaActualizacion` | `updatedAt` | Date (ISO8601) |

#### Backend - Métodos

| Español (Actual) | Inglés (Nuevo) | Retorna |
|------------------|----------------|---------|
| `crear()` | `create()` | Promise<Quote> |
| `obtenerUltimoFolioDelYear()` | `getLastFolioOfYear()` | Promise<number> |
| `execute()` | `execute()` | Promise<Quote> |
| `toResponseDto()` | `toResponseDto()` | QuoteResponseDto |

#### Frontend - Servicios y Hooks

| Español (Actual) | Inglés (Nuevo) | Ubicación |
|------------------|----------------|-----------|
| `cotizacionService` | `quoteService` | `services/quoteService.ts` |
| `useCotizacionMutation` | `useQuoteMutation` | `hooks/queries/useQuoteMutation.ts` |
| `useCotizacionStore` | `useQuoteStore` | `lib/store/quote.store.ts` |
| `CotizadorPage` | `QuotePage` | `pages/QuotePage.tsx` |

#### Frontend - Tipos

| Español (Actual) | Inglés (Nuevo) | Ubicación |
|------------------|----------------|-----------|
| `Cotizacion` (interface) | `Quote` | `types/quote.ts` |
| `CrearCotizacionRequest` | `CreateQuoteRequest` | `types/quote.ts` |
| `CrearCotizacionResponse` | `CreateQuoteResponse` | `types/quote.ts` |

#### Frontend - Propiedades del Store

| Español (Actual) | Inglés (Nuevo) |
|------------------|----------------|
| `mostrarDetalles` | `showDetails` |
| `cotizacionSeleccionada` | `selectedQuote` |
| `setMostrarDetalles` | `setShowDetails` |
| `seleccionarCotizacion` | `selectQuote` |

### API Endpoints

#### POST /api/v1/quotes (antes: /api/v1/cotizaciones)
- **Descripción**: Creates a new quote
- **Auth requerida**: No (actualmente)
- **Request Body**: Empty object `{}`
- **Response 201**:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "folioNumber": "COT-2024-00001",
  "status": "DRAFT",
  "createdAt": "2024-01-18T10:30:00.000Z",
  "updatedAt": "2024-01-18T10:30:00.000Z"
}
```

### Modelos de Datos

#### Entidad Quote (Domain)
```typescript
export class Quote {
  constructor(
    public readonly id: string,
    public readonly folioNumber: string,
    public status: QuoteStatus,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  static create(folioNumber: string): Quote {
    return new Quote(
      uuid(),
      folioNumber,
      QuoteStatus.DRAFT,
      new Date(),
      new Date(),
    );
  }
}

export enum QuoteStatus {
  DRAFT = 'DRAFT',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}
```

#### Interface Quote (Frontend)
```typescript
export interface Quote {
  id: string;
  folioNumber: string;
  status: QuoteStatus;
  createdAt: string;
  updatedAt: string;
}

export enum QuoteStatus {
  DRAFT = 'DRAFT',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}
```

#### Tabla quotes (Base de Datos)
| Campo | Tipo | Columna DB |
|-------|------|------------|
| `id` | UUID | `id` |
| `folioNumber` | VARCHAR(20) | `folio_number` |
| `status` | VARCHAR(20) | `status` |
| `createdAt` | TIMESTAMP | `created_at` |
| `updatedAt` | TIMESTAMP | `updated_at` |

### Arquitectura de Cambios

```
Fase 1: Backend (aislado)
├── Crear nuevas entidades en inglés (Quote)
├── Crear nuevos DTOs (QuoteResponseDto)
├── Crear nuevos use cases (CreateQuoteUseCase)
├── Actualizar controller con nuevo endpoint (/quotes)
├── Mantener /cotizaciones como alias (deprecation)
└── Migrar base de datos (renombrar columnas)

Fase 2: Frontend
├── Crear nuevos tipos (Quote)
├── Crear nuevo servicio (quoteService)
├── Crear nuevos hooks (useQuoteMutation)
├── Actualizar componentes para usar nombres en inglés
├── Actualizar CotizadorPage → QuotePage
└── Actualizar rutas y navegación

Fase 3: Limpieza
├── Eliminar archivos en español
├── Eliminar endpoints deprecated
└── Actualizar documentación
```

### Estructura de Carpetas - Backend (Después)

```
ms-core/src/
├── domain/
│   └── quote/
│       ├── entities/
│       │   └── quote.entity.ts
│       ├── ports/
│       │   └── quote.repository.port.ts
│       └── enums/
│           └── quote-status.enum.ts
├── application/
│   └── quote/
│       ├── dto/
│       │   ├── create-quote.dto.ts
│       │   └── quote-response.dto.ts
│       └── use-cases/
│           ├── create-quote.use-case.ts
│           ├── get-quote.use-case.ts
│           └── list-quotes.use-case.ts
├── infrastructure/
│   └── quote/
│       ├── adapters/
│       │   └── quote-repository.adapter.ts
│       ├── entities/
│       │   └── quote.typeorm.entity.ts
│       ├── mappers/
│       │   └── quote.mapper.ts
│       └── database/migrations/
│           └── [timestamp]-RenameCotizacionesToQuotes.ts
└── presentation/
    └── quote/
        ├── quote.controller.ts
        └── quote.module.ts
```

### Estructura de Carpetas - Frontend (Después)

```
frontend/src/
├── types/
│   └── quote.ts              # Antes: cotizacion.ts
├── services/
│   └── quoteService.ts       # Antes: cotizacionService.ts
├── hooks/
│   └── queries/
│       └── useQuoteMutation.ts  # Antes: useCotizacionMutation.ts
├── lib/
│   └── store/
│       └── quote.store.ts    # Antes: cotizacion.store.ts
├── pages/
│   └── QuotePage.tsx         # Antes: CotizadorPage.tsx
└── components/
    └── [QuoteCard.tsx]       # Si aplica en futuro
```

---

## 3. LISTA DE TAREAS

### Fase 1: Backend

#### Dominio (Domain Layer)
- [ ] Crear `domain/quote/entities/quote.entity.ts` (reemplaza Cotizacion)
- [ ] Crear `domain/quote/enums/quote-status.enum.ts` (DRAFT, IN_PROGRESS, etc.)
- [ ] Crear `domain/quote/ports/quote.repository.port.ts` (reemplaza CotizacionRepositoryPort)
- [ ] Actualizar métodos de puertos: `obtenerUltimoFolioDelYear` → `getLastFolioOfYear`

#### Aplicación (Application Layer)
- [ ] Crear `application/quote/dto/create-quote.dto.ts`
- [ ] Crear `application/quote/dto/quote-response.dto.ts`
- [ ] Crear `application/quote/use-cases/create-quote.use-case.ts` (reemplaza CrearCotizacionUseCase)
- [ ] Crear `application/quote/use-cases/get-quote.use-case.ts`
- [ ] Crear `application/quote/use-cases/list-quotes.use-case.ts`

#### Infraestructura (Infrastructure Layer)
- [ ] Crear `infrastructure/quote/entities/quote.typeorm.entity.ts` con mapeo de columnas
- [ ] Crear `infrastructure/quote/adapters/quote-repository.adapter.ts`
- [ ] Crear `infrastructure/quote/mappers/quote.mapper.ts` con `toResponseDto()`
- [ ] Crear migración para renombrar tabla: `cotizaciones` → `quotes`
- [ ] Crear migración para renombrar columnas: `numero_folio` → `folio_number`, etc.

#### Presentación (Presentation Layer)
- [ ] Crear `presentation/quote/quote.controller.ts` con endpoints `/api/v1/quotes`
- [ ] Crear `presentation/quote/quote.module.ts`
- [ ] Registrar QuoteModule en `app.module.ts`
- [ ] Actualizar o crear `main.ts` para exponer ambos endpoints (compatibility)

#### Limpieza Backend
- [ ] Eliminar `domain/cotizacion/` (carpeta completa)
- [ ] Eliminar `application/cotizacion/` (carpeta completa)
- [ ] Eliminar `infrastructure/cotizacion/` (carpeta completa)
- [ ] Eliminar `presentation/cotizacion/` (carpeta completa)
- [ ] Eliminar migraciones antiguas relacionadas (opcional: mantener histórico)

### Fase 2: Frontend

#### Tipos
- [ ] Crear `types/quote.ts` con interfaces `Quote`, `CreateQuoteRequest`, `CreateQuoteResponse`
- [ ] Definir enum `QuoteStatus` (DRAFT, IN_PROGRESS, COMPLETED, CANCELLED)
- [ ] Eliminar `types/cotizacion.ts`
- [ ] Actualizar `types/index.ts` para exportar desde nuevo archivo

#### Servicios
- [ ] Crear `services/quoteService.ts` con método `createQuote()`
- [ ] Actualizar endpoint: `/api/v1/cotizaciones` → `/api/v1/quotes`
- [ ] Eliminar `services/cotizacionService.ts`
- [ ] Actualizar todos los imports en consumidores

#### Hooks y State
- [ ] Crear `hooks/queries/useQuoteMutation.ts` (reemplaza useCotizacionMutation)
- [ ] Crear `lib/store/quote.store.ts` con propiedades en inglés (`showDetails`, `selectedQuote`)
- [ ] Eliminar `hooks/queries/useCotizacionMutation.ts`
- [ ] Eliminar `lib/store/cotizacion.store.ts`

#### Componentes y Páginas
- [ ] Renombrar `pages/CotizadorPage.tsx` → `pages/QuotePage.tsx`
- [ ] Actualizar todos los imports de tipos y servicios
- [ ] Actualizar propiedades: `cotizacion` → `quote`, `numeroFolio` → `folioNumber`
- [ ] Actualizar estados: `estado` → `status`
- [ ] Actualizar fechas: `fechaCreacion` → `createdAt`, etc.
- [ ] Actualizar `App.tsx` con nueva ruta `/quote` (o mantener `/cotizador` como alias)

#### Limpieza Frontend
- [ ] Verificar que no queden imports rotos
- [ ] Ejecutar `npm run build` sin errores de TypeScript
- [ ] Verificar que `npm run lint` pase sin warnings

### Fase 3: QA y Verificación

- [ ] Verificar que POST /api/v1/quotes funcione correctamente
- [ ] Verificar que el frontend pueda crear quotes exitosamente
- [ ] Verificar que TanStack Query maneje correctamente los nuevos nombres
- [ ] Verificar que Zustand store funcione con nuevas propiedades
- [ ] Testear flujo completo: Frontend → API → DB → Respuesta
- [ ] Verificar que no haya referencias en español en el código final

### Documentación
- [ ] Actualizar `README.md` del backend con nuevos endpoints
- [ ] Actualizar `README.md` del frontend con nuevos nombres de servicios
- [ ] Actualizar diagramas de arquitectura si existen
- [ ] Actualizar spec a `status: IMPLEMENTED`

---

## Notas Técnicas

### Consideraciones de Base de Datos
La migración debe ser cuidadosa para no perder datos:

```typescript
// Migración de ejemplo
export class RenameCotizacionesToQuotes implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Renombrar tabla
    await queryRunner.renameTable('cotizaciones', 'quotes');
    
    // Renombrar columnas
    await queryRunner.renameColumn('quotes', 'numero_folio', 'folio_number');
    await queryRunner.renameColumn('quotes', 'estado', 'status');
    await queryRunner.renameColumn('quotes', 'fecha_creacion', 'created_at');
    await queryRunner.renameColumn('quotes', 'fecha_actualizacion', 'updated_at');
    
    // Actualizar valores del enum
    await queryRunner.query(`
      UPDATE quotes 
      SET status = CASE status
        WHEN 'BORRADOR' THEN 'DRAFT'
        WHEN 'EN_PROCESO' THEN 'IN_PROGRESS'
        WHEN 'COMPLETADA' THEN 'COMPLETED'
        WHEN 'CANCELADA' THEN 'CANCELLED'
      END
    `);
  }
}
```

### Backward Compatibility
Si se requiere mantener compatibilidad temporal:
- Crear un middleware o proxy que redirija `/cotizaciones` → `/quotes`
- Mantener DTOs duplicados con decoradores `@ApiProperty({ deprecated: true })`
- Agregar headers de deprecation: `X-Deprecated: true`

### Naming Conventions a Seguir
- **Archivos**: kebab-case (ej: `create-quote.use-case.ts`)
- **Clases/Interfaces**: PascalCase (ej: `QuoteResponseDto`)
- **Métodos/Propiedades**: camelCase (ej: `folioNumber`, `createQuote()`)
- **Constantes**: UPPER_SNAKE_CASE para enums (ej: `QuoteStatus.DRAFT`)
- **Endpoints**: kebab-case (ej: `/api/v1/quotes`)
- **Columnas DB**: snake_case (ej: `folio_number`)

---
*Fin de la especificación*
