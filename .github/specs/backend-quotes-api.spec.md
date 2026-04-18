---
id: SPEC-009
status: IMPLEMENTED
feature: backend-quotes-api
created: 2026-04-18
updated: 2026-04-18
author: spec-generator
version: "1.0"
related-specs: ["unify-naming-english", "quote-list-and-onboarding"]
---

# Spec: Backend API - Quotes Endpoints (List, Filter, Update)

> **Estado:** `DRAFT` → aprobar con `status: APPROVED` antes de iniciar implementación.
> **Ciclo de vida:** DRAFT → APPROVED → IN_PROGRESS → IMPLEMENTED → DEPRECATED

---

## 1. REQUERIMIENTOS

### Descripción
Extender la API REST del backend para soportar operaciones CRUD completas sobre las cotizaciones (quotes). Incluir: listado con filtro por estado, obtención por ID, y actualización de datos con cambio de estado.

### Requerimiento de Negocio
> "Necesito que el backend exponga endpoints para: (1) Listar todas las cotizaciones con filtro por estado DRAFT, (2) Obtener una cotización específica por ID, y (3) Actualizar la cotización con los datos del wizard (empresa, RFC, agente, fechas) y cambiar su estado de DRAFT a IN_PROGRESS."

### Historias de Usuario

#### HU-01: Listar Cotizaciones con Filtro

```
Como: Usuario del sistema frontend
Quiero: Obtener todas las cotizaciones filtradas por estado
Para: Mostrar solo las cotizaciones DRAFT en la lista

Prioridad: Alta
Estimación: S
Dependencias: SPEC-006 (unify-naming-english)
Capa: Backend
```

#### Criterios de Aceptación — HU-01

**Happy Path**
```gherkin
CRITERIO-1.1: Listar quotes filtradas por status
Dado que: Existen cotizaciones con diferentes estados en la base de datos
Cuando: El frontend hace GET /api/v1/quotes?status=DRAFT
Entonces: Se retorna un array con solo las cotizaciones en estado DRAFT
Y: Cada item incluye: id, folioNumber, status, createdAt, updatedAt
Y: El array está ordenado por fecha de creación descendente (más recientes primero)
Y: Se retorna status HTTP 200
```

**Sin filtro**
```gherkin
CRITERIO-1.2: Listar todas las quotes
Dado que: Se hace GET /api/v1/quotes sin parámetros
Cuando: El endpoint recibe la petición
Entonces: Se retorna todas las cotizaciones sin filtrar
Y: El orden es por fecha de creación descendente
```

**Empty result**
```gherkin
CRITERIO-1.3: Lista vacía
Dado que: No hay cotizaciones con el status solicitado
Cuando: Se filtra por un estado sin registros
Entonces: Se retorna un array vacío []
Y: Status HTTP 200 (no es error)
```

#### HU-02: Obtener Cotización por ID

```
Como: Usuario del sistema
Quiero: Obtener los detalles de una cotización específica
Para: Ver toda la información de la cotización seleccionada

Prioridad: Alta
Estimación: XS
Capa: Backend
```

#### Criterios de Aceptación — HU-02

```gherkin
CRITERIO-2.1: Obtener quote por ID existente
Dado que: Existe una cotización con ID válido
Cuando: Se hace GET /api/v1/quotes/{id}
Entonces: Se retorna el objeto completo de la cotización
Y: Incluye el campo details si tiene datos guardados
Y: Status HTTP 200

CRITERIO-2.2: Quote no encontrada
Dado que: Se solicita un ID que no existe
Cuando: Se hace GET /api/v1/quotes/{id-inexistente}
Entonces: Se retorna error 404
Y: El mensaje indica "Quote not found"
```

#### HU-03: Actualizar Cotización

```
Como: Usuario completando el wizard
Quiero: Guardar los datos del formulario y cambiar el estado
Para: Finalizar la cotización inicial

Prioridad: Alta
Estimación: M
Capa: Backend
```

#### Criterios de Aceptación — HU-03

**Actualización exitosa**
```gherkin
CRITERIO-3.1: Actualizar quote con datos completos
Dado que: Existe una cotización en estado DRAFT
Cuando: Se hace PATCH /api/v1/quotes/{id} con datos válidos
Entonces: Se guardan todos los campos en la base de datos
Y: Se actualiza el estado a IN_PROGRESS (si se envía status)
Y: Se actualiza el campo updatedAt
Y: Se retorna la cotización actualizada
Y: Status HTTP 200
```

**Campos aceptados:**
- companyName (nombre empresa)
- rfc (RFC del asegurado)
- businessLine (giro del negocio)
- businessType (tipo de negocio)
- agentKey (clave del agente)
- agentName (nombre del agente)
- subscriber (suscriptor)
- office (oficina)
- validityStart (fecha inicio ISO8601)
- validityEnd (fecha fin ISO8601)
- currency (MXN o USD)
- paymentType (CONTADO, MENSUAL, etc.)
- status (opcional, para cambiar estado)

**Quote no existe**
```gherkin
CRITERIO-3.2: Actualizar quote inexistente
Dado que: Se intenta actualizar un ID que no existe
Cuando: Se hace PATCH con ese ID
Entonces: Se retorna error 404
Y: No se realiza ningún cambio
```

**Validaciones**
```gherkin
CRITERIO-3.3: Validar campos obligatorios
Dado que: Se envían datos incompletos
Cuando: Faltan campos requeridos
Entonces: Se retorna error 400 con lista de campos faltantes
Y: No se guarda ningún cambio
```

### Reglas de Negocio

1. **Filtro por status**: Aceptar query param `status` con valores: DRAFT, IN_PROGRESS, COMPLETED, CANCELLED
2. **Ordenamiento**: Siempre ordenar por `createdAt` DESC (más recientes primero)
3. **Parcial updates**: Usar PATCH para actualizaciones parciales (no requiere todos los campos)
4. **Cambio de estado**: Al cambiar a IN_PROGRESS, validar que existan datos mínimos de la quote
5. **Audit**: Guardar siempre updatedAt al modificar
6. **No delete**: No implementar DELETE, solo soft-delete vía status CANCELLED
7. **RFC validation**: Validar formato RFC mexicano (3-4 letras + 6 dígitos + 2-3 homoclave)
8. **Fechas**: Validar que validityEnd > validityStart

---

## 2. DISEÑO

### Estructura de Datos - Quote Detail

Actualmente la tabla `quotes` tiene:
- id, folio_number, status, created_at, updated_at

**Necesitamos agregar:**

```sql
-- Campos del asegurado (Paso 1)
company_name VARCHAR(150)
rfc VARCHAR(13)
business_line VARCHAR(50)
business_type VARCHAR(50)

-- Campos del agente (Paso 2)
agent_key VARCHAR(20)
agent_name VARCHAR(100)
subscriber VARCHAR(100)
office VARCHAR(100)

-- Campos de vigencia (Paso 3)
validity_start TIMESTAMP
validity_end TIMESTAMP
currency VARCHAR(3) DEFAULT 'MXN'
payment_type VARCHAR(20) DEFAULT 'MENSUAL'
```

### Modelo de Datos Completo

#### Domain Entity (Quote con details)

```typescript
// domain/quote/entities/quote.entity.ts
export class Quote {
  constructor(
    public readonly id: string,
    public readonly folioNumber: string,
    public status: QuoteStatus,
    public readonly createdAt: Date,
    public updatedAt: Date,
    // Optional details
    public details?: QuoteDetails,
  ) {}
}

export interface QuoteDetails {
  // Asegurado
  companyName?: string;
  rfc?: string;
  businessLine?: string;
  businessType?: string;
  // Conducción
  agentKey?: string;
  agentName?: string;
  subscriber?: string;
  office?: string;
  // Vigencia
  validityStart?: Date;
  validityEnd?: Date;
  currency?: 'MXN' | 'USD';
  paymentType?: PaymentType;
}
```

#### TypeORM Entity (QuoteTypeOrmEntity)

```typescript
@Entity('quotes')
export class QuoteTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'folio_number', unique: true, length: 20 })
  folioNumber: string;

  @Column({ name: 'status', default: 'DRAFT', length: 20 })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Asegurado
  @Column({ name: 'company_name', nullable: true, length: 150 })
  companyName: string;

  @Column({ name: 'rfc', nullable: true, length: 13 })
  rfc: string;

  @Column({ name: 'business_line', nullable: true, length: 50 })
  businessLine: string;

  @Column({ name: 'business_type', nullable: true, length: 50 })
  businessType: string;

  // Conducción
  @Column({ name: 'agent_key', nullable: true, length: 20 })
  agentKey: string;

  @Column({ name: 'agent_name', nullable: true, length: 100 })
  agentName: string;

  @Column({ name: 'subscriber', nullable: true, length: 100 })
  subscriber: string;

  @Column({ name: 'office', nullable: true, length: 100 })
  office: string;

  // Vigencia
  @Column({ name: 'validity_start', nullable: true, type: 'timestamp' })
  validityStart: Date;

  @Column({ name: 'validity_end', nullable: true, type: 'timestamp' })
  validityEnd: Date;

  @Column({ name: 'currency', nullable: true, length: 3, default: 'MXN' })
  currency: string;

  @Column({ name: 'payment_type', nullable: true, length: 20 })
  paymentType: string;
}
```

### API Endpoints

#### GET /api/v1/quotes

**Query Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| status | string | No | Filtrar por estado: DRAFT, IN_PROGRESS, COMPLETED, CANCELLED |

**Response 200:**
```json
{
  "data": [
    {
      "id": "205e0931-27ca-4d38-a950-4116c4afc4bd",
      "folioNumber": "COT-2026-00013",
      "status": "DRAFT",
      "createdAt": "2026-04-18T19:59:14.835Z",
      "updatedAt": "2026-04-18T19:59:14.835Z"
    }
  ],
  "meta": {
    "total": 1,
    "filtered": true
  }
}
```

#### GET /api/v1/quotes/{id}

**Response 200:**
```json
{
  "id": "205e0931-27ca-4d38-a950-4116c4afc4bd",
  "folioNumber": "COT-2026-00013",
  "status": "DRAFT",
  "createdAt": "2026-04-18T19:59:14.835Z",
  "updatedAt": "2026-04-18T19:59:14.835Z",
  "details": {
    "companyName": "Constructora del Norte",
    "rfc": "ABC010101XXX",
    "businessLine": "Construcción",
    "businessType": "Constructora",
    "agentKey": "AGT-001234",
    "agentName": "Juan Pérez",
    "subscriber": "María González",
    "office": "CDMX Centro",
    "validityStart": "2026-04-18T00:00:00.000Z",
    "validityEnd": "2027-04-18T00:00:00.000Z",
    "currency": "MXN",
    "paymentType": "MENSUAL"
  }
}
```

**Response 404:**
```json
{
  "statusCode": 404,
  "message": "Quote not found",
  "correlationId": "uuid"
}
```

#### PATCH /api/v1/quotes/{id}

**Request Body:**
```json
{
  "companyName": "Constructora del Norte S.A.",
  "rfc": "ABC010101XXX",
  "businessLine": "Construcción",
  "businessType": "Constructora",
  "agentKey": "AGT-001234",
  "agentName": "Juan Pérez García",
  "subscriber": "María González",
  "office": "Sucursal CDMX Centro",
  "validityStart": "2026-04-18T00:00:00.000Z",
  "validityEnd": "2027-04-18T00:00:00.000Z",
  "currency": "MXN",
  "paymentType": "MENSUAL",
  "status": "IN_PROGRESS"
}
```

**Response 200:** Quote actualizada

**Response 400 (Validation Error):**
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    { "field": "rfc", "message": "Invalid RFC format" },
    { "field": "validityEnd", "message": "Must be after validityStart" }
  ]
}
```

### Arquitectura de Implementación

```
ms-core/src/
├── infrastructure/quote/
│   ├── entities/
│   │   └── quote.typeorm.entity.ts     # Agregar columnas nuevas
│   ├── adapters/
│   │   └── quote-repository.adapter.ts # Métodos findByStatus, findById, update
│   └── mappers/
│       └── quote.mapper.ts             # Mapeo de details
├── application/quote/
│   ├── dto/
│   │   ├── update-quote.dto.ts         # DTO para PATCH
│   │   ├── quote-detail.dto.ts         # DTO para details
│   │   └── quote-filter.dto.ts         # Query params
│   └── use-cases/
│       ├── get-quotes.use-case.ts      # Listar con filtro
│       ├── get-quote-by-id.use-case.ts
│       └── update-quote.use-case.ts    # Actualizar + validar
├── domain/quote/
│   ├── ports/
│   │   └── quote.repository.port.ts    # Agregar métodos al puerto
│   └── entities/
│       └── quote.entity.ts             # Agregar QuoteDetails
└── presentation/quote/
    └── quote.controller.ts             # Nuevos endpoints
```

### Estructura de DTOs

**UpdateQuoteDto**
```typescript
export class UpdateQuoteDto {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  companyName?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{2,3}$/i)
  rfc?: string;

  @IsOptional()
  @IsString()
  businessLine?: string;

  @IsOptional()
  @IsString()
  businessType?: string;

  @IsOptional()
  @IsString()
  agentKey?: string;

  @IsOptional()
  @IsString()
  agentName?: string;

  @IsOptional()
  @IsString()
  subscriber?: string;

  @IsOptional()
  @IsString()
  office?: string;

  @IsOptional()
  @IsDateString()
  validityStart?: string;

  @IsOptional()
  @IsDateString()
  validityEnd?: string;

  @IsOptional()
  @IsIn(['MXN', 'USD'])
  currency?: string;

  @IsOptional()
  @IsIn(['CONTADO', 'MENSUAL', 'TRIMESTRAL', 'SEMESTRAL', 'ANUAL'])
  paymentType?: string;

  @IsOptional()
  @IsIn(['DRAFT', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
  status?: QuoteStatus;
}
```

### Migración de Base de Datos

**20260418200000-AddQuoteDetails.ts**
```typescript
export class AddQuoteDetails20260418200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Asegurado
    await queryRunner.addColumn('quotes', new TableColumn({
      name: 'company_name', type: 'varchar', length: '150', isNullable: true
    }));
    await queryRunner.addColumn('quotes', new TableColumn({
      name: 'rfc', type: 'varchar', length: '13', isNullable: true
    }));
    await queryRunner.addColumn('quotes', new TableColumn({
      name: 'business_line', type: 'varchar', length: '50', isNullable: true
    }));
    await queryRunner.addColumn('quotes', new TableColumn({
      name: 'business_type', type: 'varchar', length: '50', isNullable: true
    }));

    // Conducción
    await queryRunner.addColumn('quotes', new TableColumn({
      name: 'agent_key', type: 'varchar', length: '20', isNullable: true
    }));
    await queryRunner.addColumn('quotes', new TableColumn({
      name: 'agent_name', type: 'varchar', length: '100', isNullable: true
    }));
    await queryRunner.addColumn('quotes', new TableColumn({
      name: 'subscriber', type: 'varchar', length: '100', isNullable: true
    }));
    await queryRunner.addColumn('quotes', new TableColumn({
      name: 'office', type: 'varchar', length: '100', isNullable: true
    }));

    // Vigencia
    await queryRunner.addColumn('quotes', new TableColumn({
      name: 'validity_start', type: 'timestamp', isNullable: true
    }));
    await queryRunner.addColumn('quotes', new TableColumn({
      name: 'validity_end', type: 'timestamp', isNullable: true
    }));
    await queryRunner.addColumn('quotes', new TableColumn({
      name: 'currency', type: 'varchar', length: '3', isNullable: true, default: 'MXN'
    }));
    await queryRunner.addColumn('quotes', new TableColumn({
      name: 'payment_type', type: 'varchar', length: '20', isNullable: true
    }));

    // Índice para búsqueda por status
    await queryRunner.createIndex('quotes', new TableIndex({
      name: 'IDX_QUOTES_STATUS',
      columnNames: ['status'],
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop all columns in reverse order
    await queryRunner.dropColumn('quotes', 'payment_type');
    await queryRunner.dropColumn('quotes', 'currency');
    await queryRunner.dropColumn('quotes', 'validity_end');
    await queryRunner.dropColumn('quotes', 'validity_start');
    await queryRunner.dropColumn('quotes', 'office');
    await queryRunner.dropColumn('quotes', 'subscriber');
    await queryRunner.dropColumn('quotes', 'agent_name');
    await queryRunner.dropColumn('quotes', 'agent_key');
    await queryRunner.dropColumn('quotes', 'business_type');
    await queryRunner.dropColumn('quotes', 'business_line');
    await queryRunner.dropColumn('quotes', 'rfc');
    await queryRunner.dropColumn('quotes', 'company_name');
    await queryRunner.dropIndex('quotes', 'IDX_QUOTES_STATUS');
  }
}
```

---

## 3. LISTA DE TAREAS

### Fase 1: Migración Base de Datos

- [ ] Crear migración `20260418200000-AddQuoteDetails.ts`
- [ ] Agregar columnas: company_name, rfc, business_line, business_type
- [ ] Agregar columnas: agent_key, agent_name, subscriber, office
- [ ] Agregar columnas: validity_start, validity_end, currency, payment_type
- [ ] Crear índice IDX_QUOTES_STATUS
- [ ] Ejecutar migración: `npm run migration:run`
- [ ] Verificar tablas con columnas nuevas

### Fase 2: Domain Layer

- [ ] Actualizar `domain/quote/entities/quote.entity.ts` - Agregar QuoteDetails
- [ ] Actualizar `domain/quote/ports/quote.repository.port.ts` - Nuevos métodos:
  - `findByStatus(status: QuoteStatus): Promise<Quote[]>`
  - `findById(id: string): Promise<Quote | null>`
  - `update(id: string, data: Partial<Quote>): Promise<Quote>`

### Fase 3: Infrastructure Layer

- [ ] Actualizar `infrastructure/quote/entities/quote.typeorm.entity.ts` - Nuevas columnas
- [ ] Actualizar `infrastructure/quote/mappers/quote.mapper.ts` - Mapeo de details
- [ ] Actualizar `infrastructure/quote/adapters/quote-repository.adapter.ts`:
  - Implementar `findByStatus`
  - Implementar `findById`
  - Implementar `update`

### Fase 4: Application Layer

- [ ] Crear `application/quote/dto/quote-filter.dto.ts`
- [ ] Crear `application/quote/dto/update-quote.dto.ts`
- [ ] Crear `application/quote/dto/quote-detail.dto.ts`
- [ ] Crear `application/quote/use-cases/get-quotes.use-case.ts`
- [ ] Crear `application/quote/use-cases/get-quote-by-id.use-case.ts`
- [ ] Crear `application/quote/use-cases/update-quote.use-case.ts`:
  - Validar RFC
  - Validar fechas (end > start)
  - Validar campos requeridos para cambio de estado

### Fase 5: Presentation Layer

- [ ] Actualizar `presentation/quote/quote.controller.ts`:
  - Agregar `@Get()` con query param `status`
  - Agregar `@Get(':id')`
  - Agregar `@Patch(':id')`
- [ ] Actualizar `presentation/quote/quote.module.ts` - Registrar nuevos use cases
- [ ] Agregar validaciones de DTOs con class-validator

### Fase 6: Testing

- [ ] Test GET /api/v1/quotes - sin filtro
- [ ] Test GET /api/v1/quotes?status=DRAFT - con filtro
- [ ] Test GET /api/v1/quotes/{id} - existente
- [ ] Test GET /api/v1/quotes/{id} - no existente (404)
- [ ] Test PATCH /api/v1/quotes/{id} - actualización exitosa
- [ ] Test PATCH - validación RFC inválido
- [ ] Test PATCH - fechas inválidas
- [ ] Test PATCH - quote no existe

### QA

- [ ] Verificar migración aplicada correctamente
- [ ] Verificar endpoints responden con formato correcto
- [ ] Verificar filtro por status funciona
- [ ] Verificar ordenamiento por fecha
- [ ] Verificar validaciones de DTO
- [ ] Verificar cambio de estado DRAFT → IN_PROGRESS
- [ ] Verificar logs estructurados en nuevos endpoints

---

## Notas de Implementación

### Patrones a seguir
1. **Hexagonal**: Domain → Application → Infrastructure → Presentation
2. **DTOs**: Usar class-validator para validaciones automáticas
3. **Mapper**: Separar entidad TypeORM de entidad de dominio
4. **Logging**: Usar StructuredLogger en todos los casos de uso
5. **Errores**: Usar excepciones de NestJS con códigos HTTP apropiados

### Consideraciones de Performance
- Índice en `status` para filtrado rápido
- Paginación opcional (para futuro: skip/limit)
- Select fields para no cargar todos los datos si no se necesitan

### Compatibilidad
- Mantener backward compatible: el campo `details` es opcional
- Las quotes existentes sin datos deben funcionar

---
*Fin de la especificación*
