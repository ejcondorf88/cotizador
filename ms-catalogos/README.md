# MS-Catalogos

Microservicio de Catálogos para el sistema **SeguraX Cotizador**.

## 📋 Descripción

Este microservicio gestiona los **catálogos maestros** del sistema, proporcionando datos de referencia para las cotizaciones de seguros. Implementa una arquitectura **N-Capas (Ports & Adapters / Hexagonal)** para mantener la lógica de negocio independiente de los frameworks.

### Catálogos Disponibles

| Catálogo | Descripción | Reemplaza |
|----------|-------------|-----------|
| **Giros** | Actividades económicas/negocios | Mock de activities |
| **Agentes** | Agentes de seguros con oficina asignada | Campo libre `agentKey` |
| **Suscriptores** | Suscriptores de pólizas | Campo libre `subscriber` |
| **Oficinas** | Oficinas/regiones de operación | Campo libre `office` |

### Características Principales

- ✅ **Arquitectura N-Capas** (Domain → Application → Infrastructure → Presentation)
- ✅ **Soft Delete** (eliminación lógica con campo `activo`)
- ✅ **Paginación** en todos los endpoints de listado
- ✅ **Búsqueda** por texto (case-insensitive)
- ✅ **Validaciones** con class-validator
- ✅ **Tests Unitarios** con Jest y TestContainers
- ✅ **Cobertura mínima 80%**
- ✅ **Dockerfile optimizado** (multi-stage, usuario no-root)

---

## 🏗️ Arquitectura N-Capas

```
┌─────────────────────────────────────────────────────────────┐
│ PRESENTATION                                                │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Controllers (NestJS)                                     │ │
│ │ • GirosController, AgentesController                   │ │
│ │ • SuscriptoresController, OficinasController           │ │
│ │ • DTOs de entrada/salida, Validation Pipes             │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ APPLICATION                                                 │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Use Cases (Casos de Uso)                                 │ │
│ │ • Create, Update, Delete, Get, GetAll, Search          │ │
│ │ • DTOs de aplicación                                    │ │
│ │ • Ports (interfaces de repositorio)                      │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ DOMAIN                                                      │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Entities (Entidades puras - sin dependencias)           │ │
│ │ • Giro, Agente, Suscriptor, Oficina                    │ │
│ │ • Value Objects, Enums                                  │ │
│ │ • Lógica de negocio pura                                │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ INFRASTRUCTURE                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ • TypeORM Entities (con @Entity, @Column)             │ │
│ │ • Repository Adapters (implementan ports)             │ │
│ │ • Mappers (Domain ↔ TypeORM)                          │ │
│ │ • Database Module (configuración TypeORM)               │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Flujo de Dependencias

```
Controller (Presentation)
    ↓ (usa DI de NestJS)
Use Case (Application)
    ↓ (usa ports - interfaces)
Domain (Entities + Repository Port)
    ↑ (implementa - TypeORM)
Repository Adapter (Infrastructure)
```

---

## 📦 Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| NestJS | 10.x | Framework backend |
| TypeScript | 5.x | Lenguaje tipado |
| TypeORM | 0.3.x | ORM para PostgreSQL |
| PostgreSQL | 16 | Base de datos relacional |
| Jest | 29.x | Testing framework |
| TestContainers | 10.x | PostgreSQL en contenedores para tests |
| ts-jest | 29.x | Compilación TypeScript para Jest |
| Supertest | 6.x | Tests E2E de endpoints HTTP |
| class-validator | 0.14.x | Validación de DTOs |

---

## 🚀 Instalación

```bash
# Clonar y entrar al directorio
cd ms-catalogos

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con credenciales PostgreSQL

# Ejecutar migraciones
npm run migration:run

# Iniciar en modo desarrollo
npm run start:dev
```

---

## 🔧 Configuración

### Variables de Entorno

Crear archivo `.env`:

```env
PORT=3001
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=segurax
```

### Schema de Base de Datos

Las tablas se crean en el schema `catalog` separado del resto de la base de datos:

```sql
-- Schema: catalog
-- Tablas:
--   catalog.giros       - Giros de negocio
--   catalog.agentes     - Agentes de seguros
--   catalog.suscriptores - Suscriptores
--   catalog.oficinas    - Oficinas/regiones
```

---

## 📡 Endpoints API

Base URL: `http://localhost:3001/catalogos`

Documentación Swagger: `http://localhost:3001/api-docs`

### Giros

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/catalogos/giros` | Listar giros (paginado) |
| `GET` | `/catalogos/giros/buscar?q={query}` | Buscar por descripción/clave |
| `GET` | `/catalogos/giros/:id` | Obtener por ID |
| `POST` | `/catalogos/giros` | Crear giro |
| `PATCH` | `/catalogos/giros/:id` | Actualizar giro |
| `DELETE` | `/catalogos/giros/:id` | Eliminar giro (soft) |

**Campos de Giro:**
- `clave` (string, único, requerido)
- `descripcion` (string, requerido)
- `sector` (string, opcional)
- `riesgo` (enum: BAJO, MEDIO, ALTO, default: MEDIO)
- `activo` (boolean, default: true)

### Agentes

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/catalogos/agentes` | Listar agentes (paginado) |
| `GET` | `/catalogos/agentes/buscar?q={query}` | Buscar por nombre/código |
| `GET` | `/catalogos/agentes/:id` | Obtener por ID |
| `GET` | `/catalogos/agentes/by-oficina/:oficinaId` | Filtrar por oficina |
| `POST` | `/catalogos/agentes` | Crear agente |
| `PATCH` | `/catalogos/agentes/:id` | Actualizar agente |
| `DELETE` | `/catalogos/agentes/:id` | Eliminar agente (soft) |

**Campos de Agente:**
- `codigo` (string, único, requerido)
- `nombre` (string, requerido)
- `email` (string, opcional, formato email)
- `telefono` (string, opcional)
- `oficinaId` (UUID, opcional)
- `activo` (boolean, default: true)

### Suscriptores

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/catalogos/suscriptores` | Listar suscriptores (paginado) |
| `GET` | `/catalogos/suscriptores/buscar?q={query}` | Buscar por nombre/código |
| `GET` | `/catalogos/suscriptores/:id` | Obtener por ID |
| `POST` | `/catalogos/suscriptores` | Crear suscriptor |
| `PATCH` | `/catalogos/suscriptores/:id` | Actualizar suscriptor |
| `DELETE` | `/catalogos/suscriptores/:id` | Eliminar suscriptor (soft) |

**Campos de Suscriptor:**
- `codigo` (string, único, requerido)
- `nombre` (string, requerido)
- `tipo` (string, opcional)
- `activo` (boolean, default: true)

### Oficinas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/catalogos/oficinas` | Listar oficinas (paginado) |
| `GET` | `/catalogos/oficinas/buscar?q={query}` | Buscar por nombre/código |
| `GET` | `/catalogos/oficinas/:id` | Obtener por ID |
| `GET` | `/catalogos/oficinas/by-estado/:estado` | Filtrar por estado |
| `POST` | `/catalogos/oficinas` | Crear oficina |
| `PATCH` | `/catalogos/oficinas/:id` | Actualizar oficina |
| `DELETE` | `/catalogos/oficinas/:id` | Eliminar oficina (soft) |

**Campos de Oficina:**
- `codigo` (string, único, requerido)
- `nombre` (string, requerido)
- `ciudad` (string, opcional)
- `estado` (string, opcional)
- `activo` (boolean, default: true)

---

## 🧪 Testing

El microservicio tiene una **suite completa de tests** siguiendo la estrategia N-Capas:

### Estrategia de Testing

| Capa | Tipo de Test | Tecnología | Cobertura |
|------|--------------|------------|-----------|
| **Domain** | Unit tests puros | Jest | 90% |
| **Application** | Unit tests con mocks | Jest | 80% |
| **Infrastructure** | Integration tests | Jest + TestContainers | 80% |
| **Presentation** | E2E tests | Jest + Supertest | - |

### Tecnologías de Testing

- **Jest 29.x** - Framework de testing
- **TestContainers** - PostgreSQL en contenedor para tests de integración
- **ts-jest** - Compilación TypeScript para Jest
- **Supertest** - Tests de endpoints HTTP
- **@nestjs/testing** - Testing module de NestJS

### Comandos de Testing

```bash
# Tests unitarios (todos)
npm run test

# Tests con cobertura
npm run test:cov

# Tests en modo watch
npm run test:watch

# Tests E2E
npm run test:e2e

# Tests de integración (repositorios)
npm run test:integration

# Tests por capa
npm run test:domain        # Solo capa Domain
npm run test:application   # Solo capa Application
npm run test:infrastructure # Solo capa Infrastructure

# Debug de tests
npm run test:debug
```

### Estructura de Tests

```
src/
├── domain/
│   └── giros/
│       └── entities/
│           └── __tests__/
│               └── giro.entity.spec.ts          # Domain tests
├── application/
│   └── giros/
│       ├── use-cases/
│       │   └── __tests__/
│       │       ├── create-giro.use-case.spec.ts
│       │       ├── update-giro.use-case.spec.ts
│       │       └── ...
│       └── dto/
│           └── __tests__/
│               └── create-giro.dto.spec.ts
└── infrastructure/
    └── giros/
        ├── adapters/
        │   └── __tests__/
        │       └── giro-repository.adapter.spec.ts  # Integration tests
        └── mappers/
            └── __tests__/
                └── giro.mapper.spec.ts
test/
├── setup.ts              # Configuración global Jest
├── database.ts           # Helper de TestContainers
└── fixtures/
    ├── giros.ts          # Datos de prueba
    ├── agentes.ts
    ├── suscriptores.ts
    └── oficinas.ts
```

### TestContainers

Los tests de integración usan **TestContainers** para crear una base de datos PostgreSQL real en un contenedor Docker:

```typescript
// test/database.ts
import { PostgreSqlContainer } from '@testcontainers/postgresql';

export const testDatabase = new PostgreSqlContainer()
  .withDatabase('test_catalogos')
  .withUsername('test')
  .withPassword('test');

// Uso en tests
beforeAll(async () => {
  const container = await testDatabase.start();
  // Configurar conexión TypeORM al contenedor
});
```

**Ventajas:**
- ✅ Tests con base de datos real (no mocks)
- ✅ Aislamiento entre tests (cada test tiene su DB)
- ✅ Compatible con CI/CD
- ✅ Ejecuta SQL real (queries, índices, constraints)

### Cobertura de Tests

Configuración de umbrales en `jest.config.ts`:

```typescript
coverageThreshold: {
  global: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80,
  },
  './domain/': {
    branches: 90,    // Domain requiere mayor cobertura
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
}
```

**Generar reporte de cobertura:**
```bash
npm run test:cov
# Reporte HTML en: coverage/lcov-report/index.html
```

### Ejemplos de Tests

#### Domain Entity Test
```typescript
// src/domain/giros/entities/__tests__/giro.entity.spec.ts
describe('Domain/Giros - Giro Entity', () => {
  describe('create()', () => {
    it('should create a giro with generated UUID', () => {
      const giro = Giro.create({
        clave: 'COM-001',
        descripcion: 'Comercio de prueba',
      });

      expect(giro.id).toBeDefined();
      expect(giro.id).toMatch(/^[0-9a-f-]{36}$/);
      expect(giro.riesgo).toBe('MEDIO'); // Default
    });

    it('should allow custom risk level', () => {
      const giro = Giro.create({
        clave: 'COM-001',
        descripcion: 'Comercio',
        riesgo: 'ALTO',
      });
      expect(giro.riesgo).toBe('ALTO');
    });
  });
});
```

#### Repository Integration Test
```typescript
// src/infrastructure/giros/adapters/__tests__/giro-repository.adapter.spec.ts
describe('Infrastructure/Giros - GiroRepositoryAdapter', () => {
  it('should persist giro with UUID', async () => {
    const giro = Giro.create({
      clave: 'COM-001',
      descripcion: 'Comercio de prueba',
    });

    const saved = await repository.create(giro);
    expect(saved.id).toMatch(/^[0-9a-f-]{36}$/);
  });

  it('should search giros case-insensitive', async () => {
    await repository.create(Giro.create({ 
      clave: 'A', 
      descripcion: 'COMERCIO MAYORISTA' 
    }));
    
    const result = await repository.search('comercio', { page: 1, limit: 10 });
    expect(result.items).toHaveLength(1);
  });
});
```

---

## 🐳 Docker

### Dockerfile Optimizado (Multi-Stage)

El Dockerfile usa **2 stages** para optimizar la imagen final:

```dockerfile
# ============================================================================
# STAGE 1: Build
# ============================================================================
FROM node:20-alpine AS builder
# Instala dependencias de build
# Compila TypeScript

# ============================================================================
# STAGE 2: Production
# ============================================================================
FROM node:20-alpine AS production
LABEL org.opencontainers.image.title="ms-catalogos"
LABEL org.opencontainers.image.description="Microservicio de Catálogos"
LABEL org.opencontainers.image.version="1.0.0"
# Usuario no-root (appuser:appgroup, UID 1001)
# Solo dependencias de producción (--omit=dev)
# Sin HEALTHCHECK
```

**Características de seguridad:**
- ✅ Multi-stage build (builder + production)
- ✅ Usuario `appuser` (no-root, UID 1001)
- ✅ Grupo `appgroup` (GID 1001)
- ✅ Labels OCI estándar
- ✅ Imagen base Alpine Linux
- ✅ Sin HEALTHCHECK (gestión externa)
- ✅ `npm ci --omit=dev` para dependencias mínimas
- ✅ Limpieza de cache (`npm cache clean`)

### Comandos Docker

```bash
# Build de la imagen
docker build -t ms-catalogos .

# Run con variables de entorno
docker run -p 3001:3001 \
  -e DB_HOST=postgres \
  -e DB_PORT=5432 \
  -e DB_USERNAME=postgres \
  -e DB_PASSWORD=password \
  -e DB_NAME=segurax \
  ms-catalogos

# Verificar usuario no-root
docker run --rm ms-catalogos id
# Output: uid=1001(appuser) gid=1001(appgroup)

# Verificar labels OCI
docker inspect ms-catalogos --format='{{.Config.Labels}}'

# Development con Docker Compose
cd ..
docker-compose up ms-catalogos
```

### Labels OCI

La imagen incluye metadata estándar OCI:

| Label | Valor |
|-------|-------|
| `org.opencontainers.image.title` | ms-catalogos |
| `org.opencontainers.image.description` | Microservicio de Catálogos - SeguraX Cotizador |
| `org.opencontainers.image.version` | 1.0.0 |
| `org.opencontainers.image.authors` | DevOps Team |

---

## 🔌 Integración con Gateway

El Gateway debe configurarse para enrutar peticiones al microservicio:

```yaml
# ms-gateway/application.yml
spring:
  cloud:
    gateway:
      routes:
        # Catálogos API
        - id: ms-catalogos
          uri: http://localhost:3001
          predicates:
            - Path=/api/v1/catalogos/**
          filters:
            - StripPrefix=2  # Remueve /api/v1
```

---

## 📊 Comandos Útiles

```bash
# Desarrollo
npm run start:dev           # Modo desarrollo con hot reload
npm run build               # Compilar para producción
npm run start:prod          # Ejecutar en producción

# Migraciones
npm run migration:generate  # Generar migración desde entidades
npm run migration:run       # Ejecutar migraciones
npm run migration:revert    # Revertir última migración

# Testing
npm run test                # Tests unitarios
npm run test:cov            # Tests con cobertura
npm run test:watch          # Tests en modo watch
npm run test:e2e            # Tests E2E
npm run test:integration    # Tests de integración

# Calidad de código
npm run lint                # ESLint con auto-fix
npm run format              # Prettier formatting

# Docker
docker build -t ms-catalogos .
docker run -p 3001:3001 ms-catalogos
```

---

## 📖 Documentación Relacionada

- [SPEC-022: Tests Unitarios - ms-catalogos](../.github/specs/unit-testing-ms-catalogos.spec.md)
- [SPEC-001: Dockerfiles Optimization](../.github/specs/dockerfiles-optimization.spec.md)
- [README Gateway](../ms-gateway/README.md) - Configuración de rutas
- [README Raíz](../README.md) - Arquitectura general

---

## 📄 Licencia

MIT License
