---
id: SPEC-022
status: IMPLEMENTED
feature: unit-testing-ms-catalogos
created: 2026-04-21
updated: 2026-04-21
author: spec-generator
version: "1.0"
related-specs:
  - SPEC-021
  - SPEC-014
---

# SPEC-022: Tests Unitarios - Microservicio de Catálogos (ms-catalogos)

> **Estado:** `DRAFT` → aprobar con `status: APPROVED` antes de iniciar implementación.

---

## 1. REQUERIMIENTOS

### 1.1 Descripción

Crear suite completa de **pruebas unitarias e integración** para el microservicio `ms-catalogos` siguiendo la arquitectura N-Capas y la metodología **TDD (Test-Driven Development)**. El microservicio contiene 4 catálogos principales: Giros, Agentes, Suscriptores y Oficinas.

### 1.2 Contexto

El microservicio `ms-catalogos` ya está implementado con arquitectura N-Capas (Domain → Application → Infrastructure → Presentation). Cada catálogo tiene:

- **Domain**: Entities con lógica de negocio
- **Application**: Use Cases (CRUD + búsqueda) + DTOs
- **Infrastructure**: Repositorios TypeORM + Mappers + Entities
- **Presentation**: Controllers NestJS

La suite de tests debe cubrir todas las capas con cobertura mínima del **80%**.

### 1.3 Historias de Usuario

#### HU-01: Tests de Domain Entities

```
Como: Desarrollador practicando TDD
Quiero: Probar las entities del dominio
Para: Validar la lógica de negocio pura y los métodos de creación/actualización

Prioridad: Alta
Estimación: M
Capa: Testing (Domain)
Metodología: Red → Green → Refactor
```

**Criterios de Aceptación:**

```gherkin
CRITERIO-1.1: Giro Entity
Dado que: Se crea una instancia de Giro
Cuando: Se ejecutan los métodos de negocio
Entonces: Los valores por defecto son correctos
Y: Las actualizaciones funcionan parcialmente

Ejemplos a probar:
- create() genera UUID y fechas automáticamente
- create() asigna riesgo 'MEDIO' por defecto
- update() actualiza solo los campos proporcionados
- deactivate() marca activo=false y actualiza fecha
- activate() marca activo=true y actualiza fecha
```

```gherkin
CRITERIO-1.2: Agente Entity
Dado que: Se crea una instancia de Agente
Cuando: Se ejecutan los métodos de negocio
Entonces: La lógica de negocio funciona correctamente

Ejemplos a probar:
- create() con oficinaId opcional (null por defecto)
- create() con email opcional (null por defecto)
- update() permite cambiar de oficina
- deactivate()/activate() cambian el estado
```

```gherkin
CRITERIO-1.3: Suscriptor Entity
Dado que: Se crea una instancia de Suscriptor
Cuando: Se ejecutan los métodos de negocio
Entonces: Las validaciones funcionan correctamente

Ejemplos a probar:
- create() asigna tipo=null por defecto
- update() permite cambiar tipo
- codigo y nombre son obligatorios en create()
```

```gherkin
CRITERIO-1.4: Oficina Entity
Dado que: Se crea una instancia de Oficina
Cuando: Se ejecutan los métodos de negocio
Entonces: El comportamiento es consistente

Ejemplos a probar:
- create() con ciudad/estado opcionales
- update() permite cambiar ubicación
- codigo es único en el dominio
```

---

#### HU-02: Tests de Application Use Cases

```
Como: Desarrollador
Quiero: Probar los casos de uso de cada catálogo
Para: Validar la orquestación de lógica de negocio y validaciones

Prioridad: Alta
Estimación: L
Capa: Testing (Application)
```

**Criterios de Aceptación:**

```gherkin
CRITERIO-2.1: Create Use Cases
Dado que: Se ejecuta un caso de uso de creación
Cuando: Se proporcionan datos válidos
Entonces: Se crea la entidad correctamente
Y: Se verifican reglas de negocio (ej: código único)

Casos a probar:
- CreateGiroUseCase → éxito
- CreateAgenteUseCase → éxito y conflicto si código duplicado
- CreateSuscriptorUseCase → éxito
- CreateOficinaUseCase → éxito y conflicto si código duplicado
```

```gherkin
CRITERIO-2.2: Update Use Cases
Dado que: Se actualiza una entidad existente
Cuando: Se proporcionan datos válidos
Entonces: Se actualizan solo los campos proporcionados
Y: Se lanza NotFoundException si no existe

Casos a probar:
- UpdateGiroUseCase → actualización parcial
- UpdateAgenteUseCase → cambio de oficina
- UpdateSuscriptorUseCase → actualización completa
- UpdateOficinaUseCase → actualización de ubicación
```

```gherkin
CRITERIO-2.3: Get Use Cases
Dado que: Se consultan entidades
Cuando: Se ejecutan los casos de uso
Entonces: Se retornan los datos correctos
Y: Se lanza NotFoundException si no existe

Casos a probar:
- GetGiroByIdUseCase → found y not found
- GetAgenteByIdUseCase → found y not found
- GetSuscriptoresUseCase → paginación
- GetOficinasUseCase → paginación
```

```gherkin
CRITERIO-2.4: Search Use Cases
Dado que: Se buscan entidades por texto
Cuando: Se proporciona un query de búsqueda
Entonces: Se retornan resultados filtrados
Y: La búsqueda es case-insensitive

Casos a probar:
- SearchGirosUseCase → búsqueda por clave y descripción
- SearchAgentesUseCase → búsqueda por código y nombre
- SearchSuscriptoresUseCase → búsqueda por código y nombre
- Resultados paginados correctamente
```

```gherkin
CRITERIO-2.5: Delete Use Cases
Dado que: Se elimina una entidad
Cuando: Se ejecuta el caso de uso
Entonces: Se realiza soft delete (activo=false)
Y: Se lanza NotFoundException si no existe

Casos a probar:
- DeleteGiroUseCase → soft delete
- DeleteAgenteUseCase → soft delete
- DeleteSuscriptorUseCase → soft delete
- DeleteOficinaUseCase → soft delete
```

---

#### HU-03: Tests de Infrastructure - Repositories

```
Como: Desarrollador
Quiero: Probar los repositorios con PostgreSQL real
Para: Validar queries, mapeo y persistencia de datos

Prioridad: Alta
Estimación: L
Capa: Testing (Infrastructure)
Tecnología: TestContainers PostgreSQL
```

**Criterios de Aceptación:**

```gherkin
CRITERIO-3.1: GiroRepositoryAdapter
Dado que: Se conecta a PostgreSQL de test
Cuando: Se ejecutan operaciones CRUD
Entonces: Los datos persisten correctamente
Y: Los mappers funcionan en ambas direcciones

Pruebas a implementar:
- create() persiste giro con UUID
- findById() retorna giro existente
- findById() retorna null si no existe
- findAll() retorna solo activos
- findByClave() búsqueda exacta
- search() búsqueda por descripción (ILike)
- update() modifica campos específicos
- delete() soft delete (activo=false)
```

```gherkin
CRITERIO-3.2: AgenteRepositoryAdapter
Dado que: Se conecta a PostgreSQL de test
Cuando: Se ejecutan operaciones CRUD
Entonces: Los datos persisten con relaciones correctas

Pruebas a implementar:
- create() persiste agente con oficinaId
- findByCodigo() búsqueda exacta por código
- search() búsqueda por nombre o código
- findByOficina() filtrado por oficina
- findAll() paginación correcta
- update() cambio de oficina
- delete() soft delete
```

```gherkin
CRITERIO-3.3: SuscriptorRepositoryAdapter
Dado que: Se conecta a PostgreSQL de test
Cuando: Se ejecutan operaciones CRUD
Entonces: Las operaciones son consistentes

Pruebas a implementar:
- create() persiste suscriptor
- findByCodigo() búsqueda exacta
- search() búsqueda por nombre
- findAll() paginación
```

```gherkin
CRITERIO-3.4: OficinaRepositoryAdapter
Dado que: Se conecta a PostgreSQL de test
Cuando: Se ejecutan operaciones CRUD
Entonces: Las operaciones son consistentes

Pruebas a implementar:
- create() persiste oficina
- findByCodigo() búsqueda exacta
- findByEstado() filtrado por estado
- search() búsqueda por nombre
- findAll() paginación
```

---

#### HU-04: Tests de Mappers

```
Como: Desarrollador
Quiero: Probar los mappers entre Domain e Infrastructure
Para: Validar que la conversión de datos es bidireccional y consistente

Prioridad: Alta
Estimación: S
Capa: Testing (Infrastructure)
```

**Criterios de Aceptación:**

```gherkin
CRITERIO-4.1: GiroMapper
Dado que: Se tienen entities de dominio y TypeORM
Cuando: Se convierten en ambas direcciones
Entonces: Los datos se mantienen consistentes

Pruebas:
- toDomain() convierte TypeORM → Domain correctamente
- toTypeOrm() convierte Domain → TypeORM correctamente
- Conversión bidireccional preserva todos los campos
- Manejo de valores null (sector)
```

```gherkin
CRITERIO-4.2: AgenteMapper
Dado que: Se tienen entities de dominio y TypeORM
Cuando: Se convierten en ambas direcciones
Entonces: Los datos se mantienen consistentes

Pruebas:
- toDomain() convierte correctamente
- toTypeOrm() convierte correctamente
- Manejo de valores null (oficinaId, email, telefono)
```

```gherkin
CRITERIO-4.3: SuscriptorMapper
Dado que: Se tienen entities de dominio y TypeORM
Cuando: Se convierten en ambas direcciones
Entonces: Los datos se mantienen consistentes

Pruebas:
- toDomain() convierte correctamente
- toTypeOrm() convierte correctamente
- Manejo de valores null (tipo)
```

```gherkin
CRITERIO-4.4: OficinaMapper
Dado que: Se tienen entities de dominio y TypeORM
Cuando: Se convierten en ambas direcciones
Entonces: Los datos se mantienen consistentes

Pruebas:
- toDomain() convierte correctamente
- toTypeOrm() convierte correctamente
- Manejo de valores null (ciudad, estado)
```

---

#### HU-05: Tests de DTOs y Validaciones

```
Como: Desarrollador
Quiero: Probar los DTOs de entrada
Para: Validar que class-validator funciona correctamente

Prioridad: Media
Estimación: S
Capa: Testing (Application)
```

**Criterios de Aceptación:**

```gherkin
CRITERIO-5.1: Create DTOs Validation
Dado que: Se validan datos de entrada
Cuando: Se proporcionan datos inválidos
Entonces: Se retornan errores de validación

Casos a probar:
- CreateGiroDto: clave vacía → error
- CreateGiroDto: descripción vacía → error
- CreateAgenteDto: codigo vacío → error
- CreateAgenteDto: nombre vacío → error
- CreateAgenteDto: email inválido → error
- CreateSuscriptorDto: codigo vacío → error
- CreateOficinaDto: codigo vacío → error
- CreateOficinaDto: nombre vacío → error
```

```gherkin
CRITERIO-5.2: Update DTOs Validation
Dado que: Se validan datos de actualización
Cuando: Se proporcionan datos parciales
Entonces: Solo los campos proporcionados son validados

Casos a probar:
- UpdateGiroDto: todos los campos opcionales
- UpdateAgenteDto: email opcional pero válido si se proporciona
- UpdateSuscriptorDto: tipo opcional
- UpdateOficinaDto: ciudad opcional
```

```gherkin
CRITERIO-5.3: Pagination DTO
Dado que: Se validan parámetros de paginación
Cuando: Se proporcionan valores
Entonces: Los valores por defecto funcionan correctamente

Casos a probar:
- page por defecto = 1
- limit por defecto = 10
- limit máximo permitido
- Valores negativos → error
```

---

#### HU-06: Tests E2E de Controllers

```
Como: Desarrollador
Quiero: Probar los endpoints HTTP
Para: Validar la integración completa del microservicio

Prioridad: Media
Estimación: L
Capa: Testing (Presentation)
Tecnología: Supertest + NestJS Testing Module
```

**Criterios de Aceptación:**

```gherkin
CRITERIO-6.1: GirosController E2E
Dado que: Se ejecuta la aplicación NestJS
Cuando: Se hacen requests HTTP
Entonces: Se retornan responses correctos

Endpoints a probar:
- POST /giros → 201 + Giro creado
- GET /giros → 200 + lista paginada
- GET /giros/:id → 200 o 404
- GET /giros/search?q= → 200 + resultados
- PATCH /giros/:id → 200 o 404
- DELETE /giros/:id → 200 o 404
```

```gherkin
CRITERIO-6.2: AgentesController E2E
Dado que: Se ejecuta la aplicación NestJS
Cuando: Se hacen requests HTTP
Entonces: Se retornan responses correctos

Endpoints a probar:
- POST /agentes → 201 + Agente creado
- GET /agentes → 200 + lista paginada
- GET /agentes/:id → 200 o 404
- GET /agentes/search?q= → 200 + resultados
- GET /agentes/by-oficina/:id → 200 + filtrados
- PATCH /agentes/:id → 200 o 404
- DELETE /agentes/:id → 200 o 404
- POST /agentes → 409 si código duplicado
```

```gherkin
CRITERIO-6.3: SuscriptoresController E2E
Dado que: Se ejecuta la aplicación NestJS
Cuando: Se hacen requests HTTP
Entonces: Se retornan responses correctos

Endpoints a probar:
- POST /suscriptores → 201
- GET /suscriptores → 200 + lista
- GET /suscriptores/:id → 200 o 404
- GET /suscriptores/search?q= → 200
- PATCH /suscriptores/:id → 200 o 404
- DELETE /suscriptores/:id → 200 o 404
```

```gherkin
CRITERIO-6.4: OficinasController E2E
Dado que: Se ejecuta la aplicación NestJS
Cuando: Se hacen requests HTTP
Entonces: Se retornan responses correctos

Endpoints a probar:
- POST /oficinas → 201
- GET /oficinas → 200 + lista
- GET /oficinas/:id → 200 o 404
- GET /oficinas/by-estado/:estado → 200 + filtrados
- GET /oficinas/search?q= → 200
- PATCH /oficinas/:id → 200 o 404
- DELETE /oficinas/:id → 200 o 404
```

---

### 1.4 Reglas de Negocio para Testing

1. **Independencia**: Cada test debe ser independiente, sin dependencias entre tests
2. **Determinismo**: Los tests deben dar el mismo resultado siempre
3. **Velocidad**: Tests unitarios < 100ms cada uno
4. **Aislamiento**: Mocks para dependencias externas (excepto DB en integration tests)
5. **Cobertura**: Mínimo 80% en cada capa (Domain, Application, Infrastructure, Presentation)
6. **Nomenclatura**: `describe('[Capa] [Entidad]', () => { it('should...') })`
7. **AAA Pattern**: Arrange → Act → Assert en cada test
8. **TestContainers**: Usar PostgreSQL real en contenedor para tests de infraestructura
9. **Soft Delete**: Todos los deletes son lógicos (activo=false), nunca físicos

---

## 2. DISEÑO

### 2.1 Arquitectura de Testing N-Capas

```
┌─────────────────────────────────────────────────────────────────┐
│ ARQUITECTURA DE TESTING N-CAPAS - MS-CATALOGOS                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ PRESENTATION (E2E Tests)                                    ││
│ │ - Supertest + NestJS Testing Module                        ││
│ │ - Tests de endpoints HTTP                                   ││
│ │ - Mock de Use Cases para aislar capa                      ││
│ │                                                            ││
│ │ Controllers: giros.controller.e2e-spec.ts                  ││
│ │            : agentes.controller.e2e-spec.ts                ││
│ │            : suscriptores.controller.e2e-spec.ts         ││
│ │            : oficinas.controller.e2e-spec.ts               ││
│ └─────────────────────────────────────────────────────────────┘│
│                              │                                  │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ APPLICATION (Unit Tests)                                    ││
│ │ - Jest + Manual Mocks                                       ││
│ │ - Mock de Repositorios                                      ││
│ │ - Test de lógica de orquestación                          ││
│ │                                                            ││
│ │ Use Cases: create-giro.use-case.spec.ts                   ││
│ │          : update-giro.use-case.spec.ts                   ││
│ │          : search-agentes.use-case.spec.ts                ││
│ │          : delete-suscriptor.use-case.spec.ts             ││
│ │                                                            ││
│ │ DTOs: create-giro.dto.spec.ts                             ││
│ │     : pagination.dto.spec.ts                              ││
│ └─────────────────────────────────────────────────────────────┘│
│                              │                                  │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ DOMAIN (Unit Tests)                                         ││
│ │ - Jest puro                                                 ││
│ │ - Sin dependencias externas                                 ││
│ │ - Test de lógica de negocio pura                           ││
│ │                                                            ││
│ │ Entities: giro.entity.spec.ts                             ││
│ │         : agente.entity.spec.ts                           ││
│ │         : suscriptor.entity.spec.ts                       ││
│ │         : oficina.entity.spec.ts                          ││
│ └─────────────────────────────────────────────────────────────┘│
│                              │                                  │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ INFRASTRUCTURE (Integration Tests)                          ││
│ │ - Jest + TestContainers (PostgreSQL)                       ││
│ │ - DB real en contenedor                                     ││
│ │ - Test de queries y mappers                                ││
│ │                                                            ││
│ │ Repositories: giro.repository.spec.ts                       ││
│ │           : agente.repository.spec.ts                     ││
│ │           : suscriptor.repository.spec.ts                 ││
│ │           : oficina.repository.spec.ts                      ││
│ │                                                            ││
│ │ Mappers: giro.mapper.spec.ts                              ││
│ │        : agente.mapper.spec.ts                            ││
│ │        : suscriptor.mapper.spec.ts                        ││
│ │        : oficina.mapper.spec.ts                           ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Estructura de Carpetas para Tests

```
ms-catalogos/
├── src/
│   ├── domain/
│   │   ├── giros/
│   │   │   ├── entities/
│   │   │   │   └── giro.entity.ts
│   │   │   └── entities/__tests__/
│   │   │       └── giro.entity.spec.ts
│   │   ├── agentes/
│   │   │   ├── entities/
│   │   │   │   └── agente.entity.ts
│   │   │   └── entities/__tests__/
│   │   │       └── agente.entity.spec.ts
│   │   ├── suscriptores/
│   │   │   ├── entities/
│   │   │   │   └── suscriptor.entity.ts
│   │   │   └── entities/__tests__/
│   │   │       └── suscriptor.entity.spec.ts
│   │   └── oficinas/
│   │       ├── entities/
│   │       │   └── oficina.entity.ts
│   │       └── entities/__tests__/
│   │           └── oficina.entity.spec.ts
│   │
│   ├── application/
│   │   ├── giros/
│   │   │   ├── use-cases/
│   │   │   │   ├── __tests__/
│   │   │   │   │   ├── create-giro.use-case.spec.ts
│   │   │   │   │   ├── update-giro.use-case.spec.ts
│   │   │   │   │   ├── get-giros.use-case.spec.ts
│   │   │   │   │   ├── get-giro-by-id.use-case.spec.ts
│   │   │   │   │   ├── search-giros.use-case.spec.ts
│   │   │   │   │   └── delete-giro.use-case.spec.ts
│   │   │   │   └── ...
│   │   │   └── dto/__tests__/
│   │   │       ├── create-giro.dto.spec.ts
│   │   │       └── update-giro.dto.spec.ts
│   │   ├── agentes/
│   │   │   ├── use-cases/__tests__/
│   │   │   │   ├── create-agente.use-case.spec.ts
│   │   │   │   ├── update-agente.use-case.spec.ts
│   │   │   │   ├── search-agentes.use-case.spec.ts
│   │   │   │   └── ...
│   │   │   └── dto/__tests__/
│   │   │       └── create-agente.dto.spec.ts
│   │   ├── suscriptores/
│   │   │   ├── use-cases/__tests__/
│   │   │   │   └── ...
│   │   │   └── dto/__tests__/
│   │   │       └── ...
│   │   └── oficinas/
│   │       ├── use-cases/__tests__/
│   │       │   └── ...
│   │       └── dto/__tests__/
│   │           └── ...
│   │
│   ├── infrastructure/
│   │   ├── giros/
│   │   │   ├── adapters/
│   │   │   │   └── giro-repository.adapter.ts
│   │   │   │   └── __tests__/
│   │   │   │       └── giro-repository.adapter.spec.ts
│   │   │   ├── mappers/
│   │   │   │   └── giro.mapper.ts
│   │   │   │   └── __tests__/
│   │   │   │       └── giro.mapper.spec.ts
│   │   │   └── entities/
│   │   │       └── giro.typeorm.entity.ts
│   │   ├── agentes/
│   │   │   ├── adapters/__tests__/
│   │   │   │   └── agente-repository.adapter.spec.ts
│   │   │   ├── mappers/__tests__/
│   │   │   │   └── agente.mapper.spec.ts
│   │   │   └── ...
│   │   ├── suscriptores/
│   │   │   ├── adapters/__tests__/
│   │   │   │   └── suscriptor-repository.adapter.spec.ts
│   │   │   ├── mappers/__tests__/
│   │   │   │   └── suscriptor.mapper.spec.ts
│   │   │   └── ...
│   │   └── oficinas/
│   │       ├── adapters/__tests__/
│   │       │   └── oficina-repository.adapter.spec.ts
│   │       ├── mappers/__tests__/
│   │       │   └── oficina.mapper.spec.ts
│   │       └── ...
│   │
│   └── presentation/
│       ├── giros/
│       │   ├── giros.controller.ts
│       │   └── __tests__/
│       │       └── giros.controller.e2e-spec.ts
│       ├── agentes/
│       │   ├── agentes.controller.ts
│       │   └── __tests__/
│       │       └── agentes.controller.e2e-spec.ts
│       ├── suscriptores/
│       │   ├── suscriptores.controller.ts
│       │   └── __tests__/
│       │       └── suscriptores.controller.e2e-spec.ts
│       └── oficinas/
│           ├── oficinas.controller.ts
│           └── __tests__/
│               └── oficinas.controller.e2e-spec.ts
│
├── test/
│   ├── setup.ts                    # Configuración global Jest
│   ├── database.ts                 # TestContainers PostgreSQL helper
│   └── fixtures/
│       ├── giros.ts                # Datos de prueba
│       ├── agentes.ts              # Datos de prueba
│       ├── suscriptores.ts         # Datos de prueba
│       └── oficinas.ts             # Datos de prueba
│
├── jest.config.ts
├── jest.config.e2e.ts
└── package.json
```

### 2.3 Configuración Jest

#### jest.config.ts (Unit + Integration)

```typescript
import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\.spec\.ts$',
  transform: {
    '^.+\.(t|j)s$': 'ts-jest',
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
    './domain/': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
    './application/': {
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
  testTimeout: 30000, // 30s para TestContainers
};

export default config;
```

#### jest.config.e2e.ts

```typescript
import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.e2e-spec.ts$',
  transform: {
    '^.+\.(t|j)s$': 'ts-jest',
  },
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testTimeout: 60000, // 60s para E2E
};

export default config;
```

### 2.4 Ejemplos de Tests

#### Domain Entity Test (giro.entity.spec.ts)

```typescript
import { Giro } from '../giro.entity';

describe('Domain/Giros - Giro Entity', () => {
  describe('create()', () => {
    it('should create a giro with generated UUID', () => {
      const giro = Giro.create({
        clave: 'COM-001',
        descripcion: 'Comercio de prueba',
      });

      expect(giro.id).toBeDefined();
      expect(giro.id).toMatch(/^[0-9a-f-]{36}$/); // UUID v4 format
      expect(giro.clave).toBe('COM-001');
      expect(giro.descripcion).toBe('Comercio de prueba');
    });

    it('should assign default risk level MEDIO', () => {
      const giro = Giro.create({
        clave: 'COM-001',
        descripcion: 'Comercio',
      });

      expect(giro.riesgo).toBe('MEDIO');
    });

    it('should allow custom risk level', () => {
      const giro = Giro.create({
        clave: 'COM-001',
        descripcion: 'Comercio',
        riesgo: 'ALTO',
      });

      expect(giro.riesgo).toBe('ALTO');
    });

    it('should set activo=true by default', () => {
      const giro = Giro.create({
        clave: 'COM-001',
        descripcion: 'Comercio',
      });

      expect(giro.activo).toBe(true);
    });

    it('should set createdAt and updatedAt', () => {
      const before = new Date();
      const giro = Giro.create({
        clave: 'COM-001',
        descripcion: 'Comercio',
      });
      const after = new Date();

      expect(giro.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(giro.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
      expect(giro.updatedAt).toEqual(giro.createdAt);
    });
  });

  describe('update()', () => {
    it('should update only provided fields', () => {
      const giro = Giro.create({
        clave: 'COM-001',
        descripcion: 'Comercio Original',
        sector: 'Retail',
        riesgo: 'MEDIO',
      });
      const originalUpdatedAt = giro.updatedAt;

      // Esperar un ms para asegurar diferencia de tiempo
      jest.advanceTimersByTime(1);

      giro.update({ descripcion: 'Comercio Actualizado' });

      expect(giro.descripcion).toBe('Comercio Actualizado');
      expect(giro.clave).toBe('COM-001'); // No cambió
      expect(giro.sector).toBe('Retail'); // No cambió
      expect(giro.riesgo).toBe('MEDIO'); // No cambió
      expect(giro.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });

    it('should update multiple fields at once', () => {
      const giro = Giro.create({
        clave: 'COM-001',
        descripcion: 'Comercio',
      });

      giro.update({
        descripcion: 'Nueva descripción',
        riesgo: 'ALTO',
        sector: 'Nuevo sector',
      });

      expect(giro.descripcion).toBe('Nueva descripción');
      expect(giro.riesgo).toBe('ALTO');
      expect(giro.sector).toBe('Nuevo sector');
    });
  });

  describe('deactivate()', () => {
    it('should set activo=false', () => {
      const giro = Giro.create({
        clave: 'COM-001',
        descripcion: 'Comercio',
      });

      giro.deactivate();

      expect(giro.activo).toBe(false);
    });

    it('should update updatedAt', () => {
      const giro = Giro.create({
        clave: 'COM-001',
        descripcion: 'Comercio',
      });
      const originalUpdatedAt = giro.updatedAt;

      jest.advanceTimersByTime(1);
      giro.deactivate();

      expect(giro.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });

  describe('activate()', () => {
    it('should set activo=true', () => {
      const giro = Giro.create({
        clave: 'COM-001',
        descripcion: 'Comercio',
      });
      giro.deactivate();
      expect(giro.activo).toBe(false);

      giro.activate();

      expect(giro.activo).toBe(true);
    });
  });
});
```

#### Use Case Test (create-agente.use-case.spec.ts)

```typescript
import { CreateAgenteUseCase } from '../create-agente.use-case';
import { AgenteRepositoryPort } from '../../../../domain/agentes/ports/agente.repository.port';
import { ConflictException } from '@nestjs/common';

describe('Application/Agentes - CreateAgenteUseCase', () => {
  let useCase: CreateAgenteUseCase;
  let mockRepo: jest.Mocked<AgenteRepositoryPort>;

  beforeEach(() => {
    mockRepo = {
      create: jest.fn(),
      findById: jest.fn(),
      findByCodigo: jest.fn(),
      findAll: jest.fn(),
      search: jest.fn(),
      findByOficina: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    useCase = new CreateAgenteUseCase(mockRepo);
  });

  describe('execute()', () => {
    it('should create agente successfully', async () => {
      mockRepo.findByCodigo.mockResolvedValue(null);
      mockRepo.create.mockResolvedValue({
        id: 'uuid-123',
        codigo: 'AGT-001',
        nombre: 'Agente Test',
        email: null,
        telefono: null,
        oficinaId: null,
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      const result = await useCase.execute({
        codigo: 'AGT-001',
        nombre: 'Agente Test',
      });

      expect(result.codigo).toBe('AGT-001');
      expect(result.nombre).toBe('Agente Test');
      expect(mockRepo.findByCodigo).toHaveBeenCalledWith('AGT-001');
      expect(mockRepo.create).toHaveBeenCalled();
    });

    it('should throw ConflictException when codigo already exists', async () => {
      mockRepo.findByCodigo.mockResolvedValue({
        id: 'existing-id',
        codigo: 'AGT-001',
      } as any);

      await expect(
        useCase.execute({
          codigo: 'AGT-001',
          nombre: 'Agente Test',
        }),
      ).rejects.toThrow(ConflictException);

      expect(mockRepo.create).not.toHaveBeenCalled();
    });

    it('should create agente with all optional fields', async () => {
      mockRepo.findByCodigo.mockResolvedValue(null);
      mockRepo.create.mockImplementation((agente) => Promise.resolve(agente as any));

      const result = await useCase.execute({
        codigo: 'AGT-001',
        nombre: 'Agente Test',
        email: 'agente@test.com',
        telefono: '555-1234',
        oficinaId: 'oficina-uuid',
      });

      expect(result.email).toBe('agente@test.com');
      expect(result.telefono).toBe('555-1234');
      expect(result.oficinaId).toBe('oficina-uuid');
    });
  });
});
```

#### Repository Integration Test (giro-repository.adapter.spec.ts)

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { StartedTestContainer } from 'testcontainers';
import { GiroRepositoryAdapter } from '../giro-repository.adapter';
import { GiroTypeOrmEntity } from '../../entities/giro.typeorm.entity';
import { Giro } from '../../../../domain/giros/entities/giro.entity';

describe('Infrastructure/Giros - GiroRepositoryAdapter (Integration)', () => {
  let container: StartedTestContainer;
  let module: TestingModule;
  let repository: GiroRepositoryAdapter;
  let dataSource: DataSource;

  beforeAll(async () => {
    container = await new PostgreSqlContainer()
      .withDatabase('test_catalogos')
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
          database: 'test_catalogos',
          entities: [GiroTypeOrmEntity],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([GiroTypeOrmEntity]),
      ],
      providers: [GiroRepositoryAdapter],
    }).compile();

    repository = module.get<GiroRepositoryAdapter>(GiroRepositoryAdapter);
    dataSource = module.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
    await container.stop();
  });

  beforeEach(async () => {
    await dataSource.getRepository(GiroTypeOrmEntity).clear();
  });

  describe('create()', () => {
    it('should persist giro with UUID', async () => {
      const giro = Giro.create({
        clave: 'COM-001',
        descripcion: 'Comercio de prueba',
      });

      const saved = await repository.create(giro);

      expect(saved.id).toBeDefined();
      expect(saved.id).toMatch(/^[0-9a-f-]{36}$/);
      expect(saved.clave).toBe('COM-001');
    });
  });

  describe('findById()', () => {
    it('should return giro by id', async () => {
      const giro = Giro.create({ clave: 'COM-001', descripcion: 'Test' });
      const saved = await repository.create(giro);

      const found = await repository.findById(saved.id);

      expect(found?.clave).toBe('COM-001');
    });

    it('should return null if not found', async () => {
      const found = await repository.findById('non-existent-uuid');

      expect(found).toBeNull();
    });
  });

  describe('search()', () => {
    it('should find giros by partial description match', async () => {
      await repository.create(Giro.create({ clave: 'A', descripcion: 'Comercio de Alimentos' }));
      await repository.create(Giro.create({ clave: 'B', descripcion: 'Comercio de Ropa' }));
      await repository.create(Giro.create({ clave: 'C', descripcion: 'Servicios Tecnológicos' }));

      const result = await repository.search('Comercio', { page: 1, limit: 10 });

      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
    });

    it('should be case-insensitive', async () => {
      await repository.create(Giro.create({ clave: 'A', descripcion: 'COMERCIO MAYORISTA' }));

      const result = await repository.search('comercio', { page: 1, limit: 10 });

      expect(result.items).toHaveLength(1);
    });
  });

  describe('delete()', () => {
    it('should perform soft delete', async () => {
      const giro = Giro.create({ clave: 'DEL-001', descripcion: 'To Delete' });
      const saved = await repository.create(giro);

      await repository.delete(saved.id);

      const found = await repository.findById(saved.id);
      expect(found?.activo).toBe(false);
    });
  });
});
```

#### Mapper Test (giro.mapper.spec.ts)

```typescript
import { GiroMapper } from '../giro.mapper';
import { GiroTypeOrmEntity } from '../../entities/giro.typeorm.entity';
import { Giro } from '../../../../domain/giros/entities/giro.entity';

describe('Infrastructure/Giros - GiroMapper', () => {
  describe('toDomain()', () => {
    it('should convert TypeORM entity to Domain entity', () => {
      const typeormEntity = new GiroTypeOrmEntity();
      typeormEntity.id = 'uuid-123';
      typeormEntity.clave = 'COM-001';
      typeormEntity.descripcion = 'Comercio';
      typeormEntity.sector = 'Retail';
      typeormEntity.riesgo = 'MEDIO';
      typeormEntity.activo = true;
      typeormEntity.createdAt = new Date('2026-01-01');
      typeormEntity.updatedAt = new Date('2026-01-02');

      const domain = GiroMapper.toDomain(typeormEntity);

      expect(domain.id).toBe('uuid-123');
      expect(domain.clave).toBe('COM-001');
      expect(domain.descripcion).toBe('Comercio');
      expect(domain.sector).toBe('Retail');
      expect(domain.riesgo).toBe('MEDIO');
      expect(domain.activo).toBe(true);
    });

    it('should handle null sector', () => {
      const typeormEntity = new GiroTypeOrmEntity();
      typeormEntity.id = 'uuid-123';
      typeormEntity.clave = 'COM-001';
      typeormEntity.descripcion = 'Comercio';
      typeormEntity.sector = null;
      typeormEntity.riesgo = 'MEDIO';
      typeormEntity.activo = true;
      typeormEntity.createdAt = new Date();
      typeormEntity.updatedAt = new Date();

      const domain = GiroMapper.toDomain(typeormEntity);

      expect(domain.sector).toBeNull();
    });
  });

  describe('toTypeOrm()', () => {
    it('should convert Domain entity to TypeORM entity', () => {
      const domain = Giro.create({
        clave: 'COM-001',
        descripcion: 'Comercio',
        sector: 'Retail',
        riesgo: 'ALTO',
      });

      const typeorm = GiroMapper.toTypeOrm(domain);

      expect(typeorm.id).toBe(domain.id);
      expect(typeorm.clave).toBe('COM-001');
      expect(typeorm.descripcion).toBe('Comercio');
      expect(typeorm.sector).toBe('Retail');
      expect(typeorm.riesgo).toBe('ALTO');
    });
  });

  describe('bidirectional conversion', () => {
    it('should preserve all fields after round-trip', () => {
      const original = Giro.create({
        clave: 'COM-001',
        descripcion: 'Comercio Original',
        sector: 'Retail',
        riesgo: 'ALTO',
      });

      const typeorm = GiroMapper.toTypeOrm(original);
      const converted = GiroMapper.toDomain(typeorm);

      expect(converted.id).toBe(original.id);
      expect(converted.clave).toBe(original.clave);
      expect(converted.descripcion).toBe(original.descripcion);
      expect(converted.sector).toBe(original.sector);
      expect(converted.riesgo).toBe(original.riesgo);
      expect(converted.activo).toBe(original.activo);
      expect(converted.createdAt).toEqual(original.createdAt);
      expect(converted.updatedAt).toEqual(original.updatedAt);
    });
  });
});
```

#### DTO Validation Test (create-agente.dto.spec.ts)

```typescript
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateAgenteDto } from '../create-agente.dto';

describe('Application/Agentes/DTO - CreateAgenteDto', () => {
  describe('validation', () => {
    it('should fail when codigo is empty', async () => {
      const dto = plainToInstance(CreateAgenteDto, {
        codigo: '',
        nombre: 'Agente Test',
      });

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.property === 'codigo')).toBe(true);
    });

    it('should fail when nombre is empty', async () => {
      const dto = plainToInstance(CreateAgenteDto, {
        codigo: 'AGT-001',
        nombre: '',
      });

      const errors = await validate(dto);

      expect(errors.some((e) => e.property === 'nombre')).toBe(true);
    });

    it('should fail when email is invalid', async () => {
      const dto = plainToInstance(CreateAgenteDto, {
        codigo: 'AGT-001',
        nombre: 'Agente Test',
        email: 'invalid-email',
      });

      const errors = await validate(dto);

      expect(errors.some((e) => e.property === 'email')).toBe(true);
    });

    it('should pass with valid data', async () => {
      const dto = plainToInstance(CreateAgenteDto, {
        codigo: 'AGT-001',
        nombre: 'Agente Test',
        email: 'agente@test.com',
        telefono: '555-1234',
        oficinaId: 'oficina-uuid',
      });

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should pass with only required fields', async () => {
      const dto = plainToInstance(CreateAgenteDto, {
        codigo: 'AGT-001',
        nombre: 'Agente Test',
      });

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });
  });
});
```

#### Controller E2E Test (giros.controller.e2e-spec.ts)

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { GirosModule } from '../../giros.module';
import { GiroTypeOrmEntity } from '../../../infrastructure/giros/entities/giro.typeorm.entity';

describe('Presentation/Giros - GirosController (E2E)', () => {
  let app: INestApplication;
  let container: any;

  beforeAll(async () => {
    container = await new PostgreSqlContainer()
      .withDatabase('test')
      .withUsername('test')
      .withPassword('test')
      .start();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: container.getHost(),
          port: container.getPort(),
          username: 'test',
          password: 'test',
          database: 'test',
          entities: [GiroTypeOrmEntity],
          synchronize: true,
        }),
        GirosModule,
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await container.stop();
  });

  describe('POST /giros', () => {
    it('should create a new giro', () => {
      return request(app.getHttpServer())
        .post('/giros')
        .send({
          clave: 'COM-001',
          descripcion: 'Comercio de prueba',
          sector: 'Retail',
          riesgo: 'MEDIO',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.id).toBeDefined();
          expect(res.body.clave).toBe('COM-001');
          expect(res.body.activo).toBe(true);
        });
    });

    it('should return 400 when validation fails', () => {
      return request(app.getHttpServer())
        .post('/giros')
        .send({
          clave: '',
          descripcion: 'Test',
        })
        .expect(400);
    });
  });

  describe('GET /giros', () => {
    it('should return paginated list', async () => {
      // Create test data
      await request(app.getHttpServer())
        .post('/giros')
        .send({ clave: 'A', descripcion: 'Test A' });
      await request(app.getHttpServer())
        .post('/giros')
        .send({ clave: 'B', descripcion: 'Test B' });

      const response = await request(app.getHttpServer())
        .get('/giros?page=1&limit=10')
        .expect(200);

      expect(response.body.items).toBeDefined();
      expect(response.body.total).toBeDefined();
      expect(Array.isArray(response.body.items)).toBe(true);
    });
  });

  describe('GET /giros/search', () => {
    it('should search by query', async () => {
      await request(app.getHttpServer())
        .post('/giros')
        .send({ clave: 'SEARCH-001', descripcion: 'Comercio Buscable' });

      const response = await request(app.getHttpServer())
        .get('/giros/search?q=Comercio')
        .expect(200);

      expect(response.body.items.length).toBeGreaterThan(0);
    });
  });
});
```

### 2.5 TestContainers Database Helper (test/database.ts)

```typescript
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { StartedTestContainer } from 'testcontainers';

export class TestDatabase {
  private container: StartedTestContainer | null = null;

  async start(): Promise<{
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
  }> {
    this.container = await new PostgreSqlContainer()
      .withDatabase('test_catalogos')
      .withUsername('test')
      .withPassword('test')
      .start();

    return {
      host: this.container.getHost(),
      port: this.container.getPort(),
      username: 'test',
      password: 'test',
      database: 'test_catalogos',
    };
  }

  async stop(): Promise<void> {
    if (this.container) {
      await this.container.stop();
    }
  }
}

export const testDatabase = new TestDatabase();
```

### 2.6 Fixtures de Datos (test/fixtures/giros.ts)

```typescript
import { Giro } from '../../src/domain/giros/entities/giro.entity';

export const girosFixtures = {
  validGiro: {
    clave: 'COM-001',
    descripcion: 'Comercio al por mayor',
    sector: 'Mayorista',
    riesgo: 'MEDIO',
    activo: true,
  },

  validGiroMin: {
    clave: 'MIN-001',
    descripcion: 'Giro mínimo',
  },

  giroAltoRiesgo: {
    clave: 'HIGH-001',
    descripcion: 'Comercio de químicos',
    sector: 'Química',
    riesgo: 'ALTO',
  },

  giroBajoRiesgo: {
    clave: 'LOW-001',
    descripcion: 'Oficina administrativa',
    sector: 'Servicios',
    riesgo: 'BAJO',
  },

  createGiroEntities(count: number): Giro[] {
    return Array.from({ length: count }, (_, i) =>
      Giro.create({
        clave: `GIRO-${i.toString().padStart(3, '0')}`,
        descripcion: `Giro de prueba ${i}`,
        sector: 'Test',
        riesgo: 'MEDIO',
      }),
    );
  },
};
```

### 2.7 Scripts de Testing (package.json)

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./jest.config.e2e.ts",
    "test:unit": "jest --testPathPattern='\.spec\.ts$' --testPathIgnorePatterns='e2e'",
    "test:integration": "jest --testPathPattern='repository\.spec\.ts$'",
    "test:domain": "jest --testPathPattern='domain/'",
    "test:application": "jest --testPathPattern='application/'",
    "test:infrastructure": "jest --testPathPattern='infrastructure/'"
  }
}
```

---

## 3. LISTA DE TAREAS

### Fase 1: Configuración de Testing

- [ ] Verificar dependencias: `@nestjs/testing`, `jest`, `ts-jest`, `supertest`, `@testcontainers/postgresql`
- [ ] Crear `jest.config.ts` con configuración base (cobertura 80%)
- [ ] Crear `jest.config.e2e.ts` para pruebas E2E
- [ ] Crear `test/setup.ts` para configuración global (timezone, mocks)
- [ ] Crear `test/database.ts` con TestContainers helper
- [ ] Crear `test/fixtures/giros.ts` con datos de prueba
- [ ] Crear `test/fixtures/agentes.ts` con datos de prueba
- [ ] Crear `test/fixtures/suscriptores.ts` con datos de prueba
- [ ] Crear `test/fixtures/oficinas.ts` con datos de prueba

### Fase 2: Tests de Domain Entities

- [ ] `src/domain/giros/entities/__tests__/giro.entity.spec.ts`
  - [ ] Test create() con valores por defecto
  - [ ] Test create() con riesgo personalizado
  - [ ] Test update() parcial
  - [ ] Test deactivate()/activate()
- [ ] `src/domain/agentes/entities/__tests__/agente.entity.spec.ts`
  - [ ] Test create() con campos opcionales
  - [ ] Test update() cambio de oficina
  - [ ] Test deactivate()/activate()
- [ ] `src/domain/suscriptores/entities/__tests__/suscriptor.entity.spec.ts`
  - [ ] Test create() con tipo opcional
  - [ ] Test update() todos los campos
- [ ] `src/domain/oficinas/entities/__tests__/oficina.entity.spec.ts`
  - [ ] Test create() con ubicación opcional
  - [ ] Test update() cambio de ciudad/estado

### Fase 3: Tests de Application Use Cases

- [ ] Giros Use Cases
  - [ ] `create-giro.use-case.spec.ts` - Mock de repo
  - [ ] `update-giro.use-case.spec.ts` - NotFoundException
  - [ ] `get-giros.use-case.spec.ts` - Paginación
  - [ ] `get-giro-by-id.use-case.spec.ts` - Found/NotFound
  - [ ] `search-giros.use-case.spec.ts` - Búsqueda
  - [ ] `delete-giro.use-case.spec.ts` - Soft delete
- [ ] Agentes Use Cases
  - [ ] `create-agente.use-case.spec.ts` - Conflicto código duplicado
  - [ ] `update-agente.use-case.spec.ts` - Cambio de oficina
  - [ ] `search-agentes.use-case.spec.ts` - Búsqueda por código/nombre
  - [ ] `get-agentes.use-case.spec.ts` - Paginación
  - [ ] `delete-agente.use-case.spec.ts`
- [ ] Suscriptores Use Cases
  - [ ] `create-suscriptor.use-case.spec.ts`
  - [ ] `update-suscriptor.use-case.spec.ts`
  - [ ] `search-suscriptores.use-case.spec.ts`
  - [ ] `get-suscriptores.use-case.spec.ts`
  - [ ] `delete-suscriptor.use-case.spec.ts`
- [ ] Oficinas Use Cases
  - [ ] `create-oficina.use-case.spec.ts` - Conflicto código duplicado
  - [ ] `update-oficina.use-case.spec.ts`
  - [ ] `search-oficinas.use-case.spec.ts`
  - [ ] `get-oficinas.use-case.spec.ts`
  - [ ] `get-oficinas-by-estado.use-case.spec.ts` - Filtrado
  - [ ] `delete-oficina.use-case.spec.ts`

### Fase 4: Tests de Infrastructure - Repositories

- [ ] `src/infrastructure/giros/adapters/__tests__/giro-repository.adapter.spec.ts`
  - [ ] TestContainers PostgreSQL setup
  - [ ] create() persiste con UUID
  - [ ] findById() found y not found
  - [ ] findByClave() búsqueda exacta
  - [ ] search() búsqueda ILike
  - [ ] update() modificación parcial
  - [ ] delete() soft delete
- [ ] `src/infrastructure/agentes/adapters/__tests__/agente-repository.adapter.spec.ts`
  - [ ] create() con oficinaId
  - [ ] findByCodigo() exacto
  - [ ] search() por nombre o código
  - [ ] findByOficina() filtrado
  - [ ] findAll() paginación
- [ ] `src/infrastructure/suscriptores/adapters/__tests__/suscriptor-repository.adapter.spec.ts`
  - [ ] CRUD completo
  - [ ] search() por nombre
- [ ] `src/infrastructure/oficinas/adapters/__tests__/oficina-repository.adapter.spec.ts`
  - [ ] CRUD completo
  - [ ] findByEstado() filtrado
  - [ ] search() por nombre

### Fase 5: Tests de Mappers

- [ ] `src/infrastructure/giros/mappers/__tests__/giro.mapper.spec.ts`
  - [ ] toDomain() convierte correctamente
  - [ ] toTypeOrm() convierte correctamente
  - [ ] Manejo de null (sector)
  - [ ] Conversión bidireccional completa
- [ ] `src/infrastructure/agentes/mappers/__tests__/agente.mapper.spec.ts`
  - [ ] toDomain() con campos opcionales
  - [ ] toTypeOrm() con campos opcionales
  - [ ] Conversión bidireccional
- [ ] `src/infrastructure/suscriptores/mappers/__tests__/suscriptor.mapper.spec.ts`
- [ ] `src/infrastructure/oficinas/mappers/__tests__/oficina.mapper.spec.ts`

### Fase 6: Tests de DTOs y Validaciones

- [ ] Giros DTOs
  - [ ] `create-giro.dto.spec.ts` - Validaciones requeridas
  - [ ] `update-giro.dto.spec.ts` - Campos opcionales
  - [ ] `search-giro.dto.spec.ts` - Query mínimo 3 chars
- [ ] Agentes DTOs
  - [ ] `create-agente.dto.spec.ts` - Email válido
  - [ ] `update-agente.dto.spec.ts`
- [ ] Suscriptores DTOs
  - [ ] `create-suscriptor.dto.spec.ts`
  - [ ] `update-suscriptor.dto.spec.ts`
- [ ] Oficinas DTOs
  - [ ] `create-oficina.dto.spec.ts`
  - [ ] `update-oficina.dto.spec.ts`
- [ ] Common DTOs
  - [ ] `pagination.dto.spec.ts` - Defaults y validaciones

### Fase 7: Tests E2E de Controllers

- [ ] `src/presentation/giros/__tests__/giros.controller.e2e-spec.ts`
  - [ ] POST /giros → 201
  - [ ] POST /giros → 400 (validación)
  - [ ] GET /giros → 200 + paginación
  - [ ] GET /giros/:id → 200 / 404
  - [ ] GET /giros/search?q= → 200
  - [ ] PATCH /giros/:id → 200 / 404
  - [ ] DELETE /giros/:id → 200 / 404
- [ ] `src/presentation/agentes/__tests__/agentes.controller.e2e-spec.ts`
  - [ ] POST /agentes → 201 / 409 (conflicto)
  - [ ] GET /agentes → 200 + paginación
  - [ ] GET /agentes/search?q= → 200
  - [ ] GET /agentes/by-oficina/:id → 200
  - [ ] PATCH /agentes/:id → 200 / 404
  - [ ] DELETE /agentes/:id → 200 / 404
- [ ] `src/presentation/suscriptores/__tests__/suscriptores.controller.e2e-spec.ts`
  - [ ] CRUD completo E2E
  - [ ] Search endpoint
- [ ] `src/presentation/oficinas/__tests__/oficinas.controller.e2e-spec.ts`
  - [ ] CRUD completo E2E
  - [ ] By-estado endpoint

### Fase 8: Cobertura y CI

- [ ] Ejecutar `npm run test:cov` y verificar > 80%
- [ ] Identificar áreas sin cobertura y agregar tests
- [ ] Configurar GitHub Actions para ejecutar tests en PR
- [ ] Agregar badge de cobertura al README.md

---

## 4. COMANDOS ÚTILES

```bash
# Instalar dependencias de testing (si no están)
npm install --save-dev @nestjs/testing jest ts-jest @types/jest supertest @types/supertest testcontainers @testcontainers/postgresql

# Ejecutar todos los tests
npm test

# Ejecutar con watch mode
npm run test:watch

# Ver cobertura
npm run test:cov

# Ejecutar tests específicos
npm test -- giro.entity
npm test -- create-agente

# Ejecutar tests de una capa específica
npm run test:domain
npm run test:application
npm run test:infrastructure

# Debug
npm run test:debug

# Tests E2E
npm run test:e2e

# Tests con verbose
npm test -- --verbose
```

---

## 5. BUENAS PRÁCTICAS

| Práctica | Descripción |
|----------|-------------|
| **AAA Pattern** | Arrange → Act → Assert en cada test |
| **Nombres descriptivos** | `it('should throw ConflictException when codigo already exists')` |
| **Un assert por concepto** | Un test = un concepto lógico |
| **Mocks apropiados** | Mockear dependencias externas, no lógica de negocio |
| **TestContainers** | Usar PostgreSQL real en tests de infraestructura |
| **Setup/Teardown** | Limpiar estado entre tests (clear DB) |
| **Fixtures** | Datos reutilizables en `/test/fixtures/` |
| **Fake timers** | Usar `jest.useFakeTimers()` para fechas |
| **Async/await** | Preferir async/await sobre callbacks |
| **Type safety** | Tipar mocks y respuestas |

---

## 6. MATRIZ DE COBERTURA ESPERADA

| Capa | Archivos | Cobertura Esperada |
|------|----------|-------------------|
| Domain Entities | 4 archivos (.entity.ts) | 95%+ |
| Application Use Cases | 24 archivos (.use-case.ts) | 85%+ |
| Application DTOs | 12 archivos (.dto.ts) | 90%+ |
| Infrastructure Repositories | 4 archivos (repository.adapter.ts) | 85%+ |
| Infrastructure Mappers | 4 archivos (.mapper.ts) | 95%+ |
| Presentation Controllers | 4 archivos (.controller.ts) | 80%+ |
| **TOTAL** | ~52 archivos | **80%+** |

---

## 7. IMPLEMENTACIÓN CON ASDD

Este proyecto utiliza el framework ASDD (Agent Spec-Driven Development).

### Flujo de Implementación

#### Paso 1 — Aprobar Spec
```bash
# Manual: Editar archivo y cambiar status
# .github/specs/unit-testing-ms-catalogos.spec.md
# status: DRAFT → APPROVED
```

#### Paso 2 — Generar Tests (Paralelo)
```bash
# Usar skill de testing unitario
/unit-testing unit-testing-ms-catalogos backend
```

**Agente:** `test-engineer-backend`
**Skill:** `/unit-testing` desde `.opencode/skills/unit-testing/SKILL.md`

**Tareas del agente:**
- Configurar Jest con TestContainers
- Crear tests de Domain Entities (4 archivos)
- Crear tests de Application Use Cases (24 archivos)
- Crear tests de Infrastructure Repositories (4 archivos)
- Crear tests de Mappers (4 archivos)
- Crear tests de DTOs (12 archivos)
- Crear tests E2E de Controllers (4 archivos)
- Verificar cobertura > 80%

#### Paso 3 — QA y Validación
```bash
# Ejecutar todos los tests
npm test

# Verificar cobertura
npm run test:cov
```

---

## 8. PRÓXIMOS PASOS (Resumen)

1. Aprobar spec (cambiar status a APPROVED)
2. Ejecutar skill `/unit-testing` para generar tests
3. Verificar cobertura > 80%
4. Ejecutar tests E2E
5. Integrar con CI/CD

---

*Fin de la especificación*
