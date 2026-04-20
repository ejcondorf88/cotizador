---
id: SPEC-014
status: IMPLEMENTED
feature: unit-testing-backend
created: 2026-04-19
updated: 2026-04-19
author: spec-generator
version: "1.0"
related-specs: []
---

# Spec: Pruebas Unitarias Backend (ms-core)

> **Estado:** `DRAFT` → aprobar con `status: APPROVED` antes de iniciar implementación.

---

## 1. REQUERIMIENTOS

### Descripción
Crear suite completa de pruebas unitarias para el backend ms-core siguiendo la **metodología TDD (Test-Driven Development)** y la arquitectura hexagonal. Los tests se escriben ANTES del código de implementación, siguiendo el ciclo Red → Green → Refactor.

### Metodología TDD

> **Ciclo TDD: Red → Green → Refactor**
> 
> 1. **Red**: Escribir un test que FALLA (no compila o falla la assertion)
> 2. **Green**: Escribir el CÓDIGO MÍNIMO necesario para pasar el test
> 3. **Refactor**: Mejorar el código manteniendo los tests pasando
> 4. **Repetir**: Siguiente test

### Flujo de Trabajo TDD por Capa

```
┌─────────────────────────────────────────────────────────────────┐
│ CICLO TDD POR CAPA                                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  CAPA DOMAIN (Entities)                                         │
│  ├─ 1. Escribir test: "should calculate completion percentage" │
│  ├─ 2. Verificar que FALLA (Red)                               │
│  ├─ 3. Implementar método en entity (Green)                   │
│  └─ 4. Refactorizar si es necesario                           │
│                                                                 │
│  CAPA APPLICATION (Use Cases)                                   │
│  ├─ 1. Escribir test con mocks de repositorio                  │
│  ├─ 2. Verificar que FALLA (Red)                               │
│  ├─ 3. Implementar use case (Green)                           │
│  └─ 4. Refactorizar                                            │
│                                                                 │
│  CAPA INFRASTRUCTURE (Repositories)                             │
│  ├─ 1. Escribir test con TestContainers PostgreSQL             │
│  ├─ 2. Verificar que FALLA (Red)                               │
│  ├─ 3. Implementar repositorio (Green)                          │
│  └─ 4. Refactorizar                                            │
│                                                                 │
│  CAPA PRESENTATION (Controllers)                                │
│  ├─ 1. Escribir test E2E con Supertest                         │
│  ├─ 2. Verificar que FALLA (Red)                               │
│  ├─ 3. Implementar controller (Green)                         │
│  └─ 4. Refactorizar                                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Requerimiento de Negocio
> "Necesito pruebas unitarias que validen cada capa de la arquitectura: entities, use cases, repositories y controllers. Las pruebas deben ser rápidas, independientes y tener cobertura mínima de 80%."

---

### Historias de Usuario (Formato TDD)

#### HU-01: TDD - Domain Entities

```
Como: Desarrollador practicando TDD
Quiero: Escribir tests ANTES de implementar las entities
Para: Validar la lógica de negocio pura con tests primero

Prioridad: Alta
Estimación: M
Capa: Testing (Domain)
Metodología: Red → Green → Refactor
```

**Flujo TDD para Quote Entity:**

```gherkin
ESCENARIO 1: Create folio
PASO 1 (RED): Escribir test
  - Test: "should generate folio with format COT-YYYY-NNNNN"
  - Ejecutar: expect(quote.folioNumber).toBe('COT-2026-00001')
  - Estado: ❌ FALLA (entity no existe)

PASO 2 (GREEN): Implementar mínimo
  - Crear entity Quote
  - Implementar método estático createWithFolioNumber()
  - Ejecutar: Test pasa ✅

PASO 3 (REFACTOR): Mejorar código
  - Extraer lógica de formato
  - Verificar: Tests siguen pasando ✅

ESCENARIO 2: Update details
PASO 1 (RED): Escribir test
  - Test: "should update only provided fields"
  - Estado: ❌ FALLA (método updateDetails no existe)

PASO 2 (GREEN): Implementar
  - Agregar método updateDetails()
  - Ejecutar: Test pasa ✅

PASO 3 (REFACTOR)
  - Simplificar implementación
  - Tests siguen pasando ✅
```

```gherkin
ESCENARIO TDD: Property Entity - Completion Percentage

PASO 1 (RED): Test primero
Dado que: Escribo el test
Cuando: Ejecuto el test
Entonces: FALLA porque el método recalculateStatus() no existe

  Código test:
  const property = Property.createEmpty('quote-1', 1);
  property.address = { street: 'A', neighborhood: 'B', city: 'C', state: 'D', zipCode: '12345' };
  property.construction = { type: 'CONCRETO', usage: 'COMERCIAL', specificActivity: 'Test' };
  property.coverages = { building: 1000000, contents: 0, electronicEquipment: 0, machinery: 0, stock: 0 };
  property.recalculateStatus();
  expect(property.status).toBe('COMPLETE');
  expect(property.completionPercentage).toBe(100);

PASO 2 (GREEN): Implementar mínimo
Dado que: Escribo el método recalculateStatus()
Cuando: Ejecuto el test
Entonces: PASA ✅

PASO 3 (REFACTOR): Mejorar
Dado que: Refactorizo la lógica
Cuando: Ejecuto todos los tests
Entonces: Todos PASAN ✅
```

```
Como: Desarrollador
Quiero: Probar las entities del dominio
Para: Validar la lógica de negocio pura

Prioridad: Alta
Estimación: M
Capa: Testing
```

**Criterios de Aceptación:**

```gherkin
CRITERIO-1.1: Quote Entity
Dado que: Se crea una instancia de Quote
Cuando: Se ejecutan los métodos de negocio
Entonces: Los cálculos son correctos
Y: Las validaciones funcionan según reglas de negocio

Ejemplos a probar:
- create() genera folio correcto
- updateDetails() actualiza campos parciales
- status transitions son válidas
```

```gherkin
CRITERIO-1.2: Property Entity
Dado que: Se crea una instancia de Property
Cuando: Se ejecutan métodos de negocio
Entonces: El completionPercentage se calcula correctamente
Y: El status se actualiza según campos completados

Ejemplos a probar:
- recalculateStatus() con campos completos → COMPLETE
- recalculateStatus() con campos incompletos → INCOMPLETE
- getTotalCoverage() suma todas las garantías
```

---

#### HU-02: Testing de Use Cases (Application Layer)

```
Como: Desarrollador
Quiero: Probar los casos de uso
Para: Validar la orquestación de lógica de negocio

Prioridad: Alta
Estimación: L
Capa: Testing
```

**Criterios de Aceptación:**

```gherkin
CRITERIO-2.1: CreateQuoteUseCase
Dado que: Se ejecuta el caso de uso
Cuando: Se proporcionan datos válidos
Entonces: Se crea la quote correctamente
Y: Se asigna un folio único

Dado que: Se ejecuta el caso de uso
Cuando: Ocurre un error de DB
Entonces: Se lanza excepción apropiada
Y: Se loguea el error
```

```gherkin
CRITERIO-2.2: UpdateQuoteUseCase
Dado que: Se actualiza una quote existente
Cuando: Se proporcionan datos válidos
Entonces: Se actualizan solo los campos proporcionados
Y: Se mantiene el folio original

Dado que: Se actualiza una quote
Cuando: La quote no existe
Entonces: Se lanza NotFoundException
```

```gherkin
CRITERIO-2.3: CreatePropertiesBulkUseCase
Dado que: Se crean N propiedades
Cuando: Se ejecuta el caso de uso
Entonces: Se crean exactamente N propiedades vacías
Y: Cada propiedad tiene el quoteId correcto

Dado que: Se crean propiedades
Cuando: Ya existen propiedades para ese quote
Entonces: Se lanza BadRequestException
```

```gherkin
CRITERIO-2.4: UpdatePropertyUseCase
Dado que: Se actualiza una propiedad
Cuando: Se proporcionan datos válidos
Entonces: Se actualizan los campos correctos
Y: Se recalcula el status automáticamente

Dado que: Se actualiza una propiedad
Cuando: El CP tiene formato inválido
Entonces: Se lanza BadRequestException
```

---

#### HU-03: Testing de Repositories (Infrastructure Layer)

```
Como: Desarrollador
Quiero: Probar los repositorios con DB real
Para: Validar queries y mapeo de datos

Prioridad: Alta
Estimación: L
Capa: Testing
```

**Criterios de Aceptación:**

```gherkin
CRITERIO-3.1: QuoteTypeOrmRepository
Dado que: Se conecta a PostgreSQL de test
Cuando: Se ejecutan operaciones CRUD
Entonces: Los datos persisten correctamente
Y: Los mappers funcionan en ambas direcciones

Pruebas a implementar:
- create() persiste quote con folio
- findById() retorna quote existente
- findById() retorna null si no existe
- findAll() retorna lista de quotes
- update() modifica campos específicos
```

```gherkin
CRITERIO-3.2: PropertyTypeOrmRepository
Dado que: Se conecta a PostgreSQL de test
Cuando: Se ejecutan operaciones CRUD
Entonces: Los datos persisten con relaciones correctas

Pruebas a implementar:
- create() persiste property con address JSON
- findByQuoteId() retorna propiedades de un quote
- createBulk() persiste N propiedades
- update() recalcula completionPercentage
- deleteByQuoteId() elimina todas las propiedades
```

```gherkin
CRITERIO-3.3: Mappers
Dado que: Se tienen entities de dominio y TypeORM
Cuando: Se convierten en ambas direcciones
Entonces: Los datos se mantienen consistentes

Pruebas:
- QuoteMapper.toDomain() mapea correctamente
- QuoteMapper.toEntity() mapea correctamente
- PropertyMapper.toDomain() con coverages/construction
- PropertyMapper.toEntity() con JSON fields
```

---

#### HU-04: Testing de Controllers (E2E)

```
Como: Desarrollador
Quiero: Probar los endpoints HTTP
Para: Validar la integración completa

Prioridad: Media
Estimación: L
Capa: Testing
```

**Criterios de Aceptación:**

```gherkin
CRITERIO-4.1: QuoteController E2E
Dado que: Se ejecuta la aplicación NestJS
Cuando: Se hacen requests HTTP
Entonces: Se retornan responses correctos

Endpoints a probar:
- POST /api/v1/quotes → 201 + Quote creada
- GET /api/v1/quotes → 200 + lista
- GET /api/v1/quotes/:id → 200 o 404
- PATCH /api/v1/quotes/:id → 200 o 404 o 400
```

```gherkin
CRITERIO-4.2: PropertyController E2E
Dado que: Se ejecuta la aplicación NestJS
Cuando: Se hacen requests HTTP
Entonces: Se retornan responses correctos

Endpoints a probar:
- POST /api/v1/quotes/:id/properties/bulk → 201 + N propiedades
- GET /api/v1/quotes/:id/properties → 200 + lista
- PATCH /api/v1/properties/:id → 200 o 404
- DELETE /api/v1/quotes/:id/properties → 204
```

---

#### HU-05: Testing de DTOs y Validaciones

```
Como: Desarrollador
Quiero: Probar los DTOs de entrada
Para: Validar que las validaciones funcionan

Prioridad: Media
Estimación: S
Capa: Testing
```

**Criterios de Aceptación:**

```gherkin
CRITERIO-5.1: CreateQuoteDto Validation
Dado que: Se validan datos de entrada
Cuando: Se proporcionan datos inválidos
Entonces: Se retornan errores de validación

Casos:
- RFC vacío → error
- Fecha fin anterior a inicio → error
- Valor negativo → error
- CP sin 5 dígitos → error
```

---

### Reglas de Negocio para Testing

1. **Independencia**: Cada test debe ser independiente
2. **Determinismo**: Los tests deben dar el mismo resultado siempre
3. **Velocidad**: Tests unitarios < 100ms cada uno
4. **Aislamiento**: Mocks para dependencias externas (excepto DB en integration)
5. **Cobertura**: Mínimo 80% en cada capa
6. **Nomenclatura**: `describe('[Capa] [Entidad]', () => { it('should...') })`

---

## 2. DISEÑO

### Estrategia de Testing por Capa

```
┌─────────────────────────────────────────────────────────────────┐
│ ARQUITECTURA HEXAGONAL CON TESTING                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ PRESENTATION (E2E Tests)                                     ││
│  │ - Supertest + NestJS Testing Module                        ││
│  │ - Test de endpoints HTTP                                     ││
│  │ - Mock de Use Cases                                          ││
│  │                                                              ││
│  │ Controllers: quote.controller.spec.ts                        ││
│  │            : property.controller.spec.ts                     ││
│  └─────────────────────────────────────────────────────────────┘│
│                              │                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ APPLICATION (Unit Tests)                                     ││
│  │ - Jest + Manual Mocks                                        ││
│  │ - Mock de Repositories                                       ││
│  │ - Test de lógica de orquestación                             ││
│  │                                                              ││
│  │ Use Cases: create-quote.use-case.spec.ts                     ││
│  │          : update-quote.use-case.spec.ts                     ││
│  │          : create-properties-bulk.use-case.spec.ts         ││
│  │          : update-property.use-case.spec.ts                  ││
│  └─────────────────────────────────────────────────────────────┘│
│                              │                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ DOMAIN (Unit Tests)                                          ││
│  │ - Jest puro                                                  ││
│  │ - Sin dependencias externas                                  ││
│  │ - Test de lógica de negocio pura                             ││
│  │                                                              ││
│  │ Entities: quote.entity.spec.ts                                 ││
│  │         : property.entity.spec.ts                            ││
│  └─────────────────────────────────────────────────────────────┘│
│                              │                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ INFRASTRUCTURE (Integration Tests)                           ││
│  │ - Jest + TestContainers (PostgreSQL)                         ││
│  │ - DB real en contenedor                                      ││
│  │ - Test de queries y mappers                                  ││
│  │                                                              ││
│  │ Repositories: quote.typeorm.repository.spec.ts               ││
│  │            : property.typeorm.repository.spec.ts           ││
│  │ Mappers     : quote.mapper.spec.ts                           ││
│  │            : property.mapper.spec.ts                       ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Estructura de Carpetas para Tests

```
ms-core/
├── src/
│   ├── domain/
│   │   ├── quote/
│   │   │   ├── entities/
│   │   │   │   └── quote.entity.ts
│   │   │   └── entities/__tests__/
│   │   │       └── quote.entity.spec.ts
│   │   └── property/
│   │       ├── entities/
│   │       │   └── property.entity.ts
│   │       └── entities/__tests__/
│   │           └── property.entity.spec.ts
│   │
│   ├── application/
│   │   ├── quote/
│   │   │   ├── use-cases/
│   │   │   │   ├── create-quote.use-case.ts
│   │   │   │   └── __tests__/
│   │   │   │       └── create-quote.use-case.spec.ts
│   │   │   └── dto/
│   │   │       └── __tests__/
│   │   │           └── create-quote.dto.spec.ts
│   │   └── property/
│   │       └── use-cases/
│   │           └── __tests__/
│   │               ├── create-properties-bulk.use-case.spec.ts
│   │               └── update-property.use-case.spec.ts
│   │
│   ├── infrastructure/
│   │   ├── quote/
│   │   │   ├── repositories/
│   │   │   │   ├── quote.typeorm.repository.ts
│   │   │   │   └── __tests__/
│   │   │   │       └── quote.typeorm.repository.spec.ts
│   │   │   └── mappers/
│   │   │       └── __tests__/
│   │   │           └── quote.mapper.spec.ts
│   │   └── property/
│   │       └── repositories/
│   │           └── __tests__/
│   │               └── property.typeorm.repository.spec.ts
│   │
│   └── presentation/
│       ├── quote/
│       │   └── quote.controller.ts
│       └── quote/
│           └── __tests__/
│               └── quote.controller.spec.ts
│
├── test/
│   ├── setup.ts                    # Configuración global Jest
│   ├── database.ts               # TestContainers PostgreSQL
│   └── fixtures/
│       ├── quotes.ts             # Datos de prueba
│       └── properties.ts         # Datos de prueba
│
├── jest.config.ts
└── package.json
```

### Configuración Jest (jest.config.ts)

```typescript
import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\.spec\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.(t|j)s',
    '!**/main.ts',
    '!**/*.module.ts',
    '!**/migrations/**',
    '!**/node_modules/**',
  ],
  coverageDirectory: '../coverage',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testEnvironment: 'node',
  setupFilesAfterEnv: ['../test/setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};

export default config;
```

### Ejemplos de Tests por Capa

#### 1. Domain Entity Test

```typescript
// src/domain/quote/entities/__tests__/quote.entity.spec.ts
import { Quote } from '../quote.entity';
import { QuoteStatus } from '../enums/quote-status.enum';

describe('Domain/Quote - Quote Entity', () => {
  describe('create()', () => {
    it('should create a quote with generated folio', () => {
      const year = 2026;
      const lastFolio = 5;
      
      const quote = Quote.createWithFolioNumber(year, lastFolio);
      
      expect(quote.folioNumber).toBe('COT-2026-00006');
      expect(quote.status).toBe(QuoteStatus.DRAFT);
    });
  });

  describe('updateDetails()', () => {
    it('should update only provided fields', () => {
      const quote = Quote.createWithFolioNumber(2026, 0);
      
      quote.updateDetails({
        companyName: 'Test Corp',
      });
      
      expect(quote.details?.companyName).toBe('Test Corp');
      expect(quote.status).toBe(QuoteStatus.DRAFT);
    });
  });

  describe('complete()', () => {
    it('should mark quote as IN_PROGRESS', () => {
      const quote = Quote.createWithFolioNumber(2026, 0);
      
      quote.complete();
      
      expect(quote.status).toBe(QuoteStatus.IN_PROGRESS);
    });
  });
});
```

#### 2. Use Case Test (con Mocks)

```typescript
// src/application/quote/use-cases/__tests__/create-quote.use-case.spec.ts
import { CreateQuoteUseCase } from '../create-quote.use-case';
import { QuoteRepositoryPort } from '../../../../domain/quote/ports/quote.repository.port';
import { StructuredLogger } from '../../../../common/logger/logger.service';

describe('Application/Quote - CreateQuoteUseCase', () => {
  let useCase: CreateQuoteUseCase;
  let mockRepo: jest.Mocked<QuoteRepositoryPort>;
  let mockLogger: jest.Mocked<StructuredLogger>;

  beforeEach(() => {
    mockRepo = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
    } as any;

    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
    } as any;

    useCase = new CreateQuoteUseCase(mockRepo, mockLogger);
  });

  it('should create quote with folio', async () => {
    mockRepo.create.mockResolvedValue({
      id: 'uuid-123',
      folioNumber: 'COT-2026-00001',
      status: 'DRAFT',
    } as any);

    const result = await useCase.execute();

    expect(result.folioNumber).toMatch(/^COT-\d{4}-\d{5}$/);
    expect(mockRepo.create).toHaveBeenCalled();
    expect(mockLogger.info).toHaveBeenCalled();
  });

  it('should log error on failure', async () => {
    mockRepo.create.mockRejectedValue(new Error('DB Error'));

    await expect(useCase.execute()).rejects.toThrow();
    expect(mockLogger.error).toHaveBeenCalled();
  });
});
```

#### 3. Repository Integration Test (con TestContainers)

```typescript
// src/infrastructure/quote/repositories/__tests__/quote.typeorm.repository.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { StartedTestContainer } from 'testcontainers';
import { QuoteTypeOrmRepository } from '../quote.typeorm.repository';
import { QuoteTypeOrmEntity } from '../../entities/quote.typeorm.entity';
import { Quote } from '../../../../domain/quote/entities/quote.entity';

describe('Infrastructure/Quote - QuoteTypeOrmRepository (Integration)', () => {
  let container: StartedTestContainer;
  let module: TestingModule;
  let repository: QuoteTypeOrmRepository;
  let dataSource: DataSource;

  beforeAll(async () => {
    // Iniciar PostgreSQL en contenedor
    container = await new PostgreSqlContainer()
      .withDatabase('test')
      .withUsername('test')
      .withPassword('test')
      .start();

    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: container.getHost(),
          port: container.getPort(),
          username: 'test',
          password: 'test',
          database: 'test',
          entities: [QuoteTypeOrmEntity],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([QuoteTypeOrmEntity]),
      ],
      providers: [QuoteTypeOrmRepository],
    }).compile();

    repository = module.get<QuoteTypeOrmRepository>(QuoteTypeOrmRepository);
    dataSource = module.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
    await container.stop();
  });

  beforeEach(async () => {
    // Limpiar tabla antes de cada test
    await dataSource.getRepository(QuoteTypeOrmEntity).clear();
  });

  describe('create()', () => {
    it('should persist quote with folio', async () => {
      const quote = Quote.createWithFolioNumber(2026, 0);

      const saved = await repository.create(quote);

      expect(saved.id).toBeDefined();
      expect(saved.folioNumber).toBe('COT-2026-00001');
    });
  });

  describe('findById()', () => {
    it('should return quote by id', async () => {
      const quote = Quote.createWithFolioNumber(2026, 0);
      const saved = await repository.create(quote);

      const found = await repository.findById(saved.id);

      expect(found?.folioNumber).toBe('COT-2026-00001');
    });

    it('should return null if not found', async () => {
      const found = await repository.findById('non-existent');

      expect(found).toBeNull();
    });
  });
});
```

#### 4. Controller E2E Test

```typescript
// src/presentation/quote/__tests__/quote.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { QuoteModule } from '../quote.module';

describe('Presentation/Quote - QuoteController (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [QuoteModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/v1/quotes', () => {
    it('should create a new quote', () => {
      return request(app.getHttpServer())
        .post('/api/v1/quotes')
        .expect(201)
        .expect((res) => {
          expect(res.body.folioNumber).toMatch(/^COT-\d{4}-\d{5}$/);
          expect(res.body.status).toBe('DRAFT');
        });
    });
  });

  describe('GET /api/v1/quotes', () => {
    it('should return list of quotes', () => {
      return request(app.getHttpServer())
        .get('/api/v1/quotes')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });
});
```

### Dependencias de Testing (package.json)

```json
{
  "devDependencies": {
    "@nestjs/testing": "^10.0.0",
    "@testcontainers/postgresql": "^10.0.0",
    "@types/jest": "^29.5.0",
    "@types/supertest": "^6.0.0",
    "jest": "^29.5.0",
    "jest-junit": "^16.0.0",
    "supertest": "^6.3.0",
    "testcontainers": "^10.0.0",
    "ts-jest": "^29.1.0"
  }
}
```

### Scripts (package.json)

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json"
  }
}
```

---

## 3. LISTA DE TAREAS

### Fase 1: Configuración de Testing

- [ ] Instalar dependencias: `@nestjs/testing`, `jest`, `ts-jest`, `supertest`, `@testcontainers/postgresql`
- [ ] Crear `jest.config.ts` con configuración base
- [ ] Crear `jest.config.e2e.ts` para pruebas E2E
- [ ] Crear `test/setup.ts` para configuración global
- [ ] Crear `test/database.ts` con TestContainers helper
- [ ] Crear `test/fixtures/quotes.ts` con datos de prueba
- [ ] Crear `test/fixtures/properties.ts` con datos de prueba

### Fase 2: Tests de Domain Entities

- [ ] Crear `quote.entity.spec.ts` - Test de creación, folio, update
- [ ] Crear `property.entity.spec.ts` - Test de completionPercentage, status

### Fase 3: Tests de Application (Use Cases)

- [ ] Crear `create-quote.use-case.spec.ts` - Mock de repo y logger
- [ ] Crear `update-quote.use-case.spec.ts` - Mock de repo, test parcial updates
- [ ] Crear `get-quotes.use-case.spec.ts` - Test filtrado por status
- [ ] Crear `create-properties-bulk.use-case.spec.ts` - Test bulk create
- [ ] Crear `update-property.use-case.spec.ts` - Test validaciones CP, valores

### Fase 4: Tests de Infrastructure (Integration)

- [ ] Crear `quote.typeorm.repository.spec.ts` - TestContainers PostgreSQL
- [ ] Crear `property.typeorm.repository.spec.ts` - TestContainers PostgreSQL
- [ ] Crear `quote.mapper.spec.ts` - Test mapeo bidireccional
- [ ] Crear `property.mapper.spec.ts` - Test mapeo con JSON fields

### Fase 5: Tests de Presentation (E2E)

- [ ] Crear `quote.controller.spec.ts` - Supertest + NestJS
- [ ] Crear `property.controller.spec.ts` - Supertest + NestJS
- [ ] Crear `health.controller.spec.ts` - Test /health endpoint

### Fase 6: DTOs y Validaciones

- [ ] Crear `create-quote.dto.spec.ts` - Test validaciones class-validator
- [ ] Crear `update-quote.dto.spec.ts` - Test validaciones opcionales
- [ ] Crear `update-property.dto.spec.ts` - Test valores máximos

### Fase 7: Cobertura y CI

- [ ] Verificar cobertura > 80% con `npm run test:cov`
- [ ] Configurar GitHub Actions para ejecutar tests en PR
- [ ] Agregar badge de cobertura al README.md

---

## 4. COMANDOS ÚTILES

```bash
# Instalar dependencias de testing
npm install --save-dev @nestjs/testing jest ts-jest @types/jest supertest @types/supertest testcontainers @testcontainers/postgresql

# Ejecutar todos los tests
npm test

# Ejecutar con watch mode
npm run test:watch

# Ver cobertura
npm run test:cov

# Ejecutar tests específicos
npm test -- quote.entity

# Debug
npm run test:debug

# E2E
npm run test:e2e

# Tests con UI
npm test -- --coverage --verbose
```

---

## 5. BUENAS PRÁCTICAS

| Práctica | Descripción |
|----------|-------------|
| **AAA Pattern** | Arrange → Act → Assert en cada test |
| **Nombres descriptivos** | `it('should throw NotFoundException when quote does not exist')` |
| **Un assert por test** | Un concepto, una prueba |
| **Mocks apropiados** | Mockear dependencias externas, no lógica de negocio |
| **TestContainers** | Usar DB real en tests de infraestructura |
| **Setup/Teardown** | Limpiar estado entre tests |
| **Fixtures** | Datos reutilizables en `/test/fixtures/` |

---

*Fin de la especificación*
