# ms-core - Backend API SeguraX

Microservicio backend para Cotizador SeguraX. Maneja cotizaciones, propiedades, coberturas y cálculo de primas.

## Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| NestJS | 10.x | Framework backend |
| TypeScript | 5.x | Lenguaje tipado |
| TypeORM | 0.3.x | ORM para PostgreSQL |
| PostgreSQL | 16 | Base de datos relacional |
| Jest | 29.x | Testing framework |
| Winston | 3.x | Logging estructurado |

## Arquitectura Hexagonal (Ports & Adapters)

```
src/
├── domain/              # Entidades, enums, value objects (sin dependencias externas)
│   ├── quote/          # Entidad Quote, enums, value objects
│   └── property/       # Entidad Property, enums, value objects
├── application/         # Use cases, DTOs, ports (solo depende de domain)
│   ├── quote/          # Casos de uso de cotizaciones
│   └── property/       # Casos de uso de propiedades
├── infrastructure/      # Repositories, mappers, TypeORM entities
│   ├── quote/          # Implementación repositorio Quote
│   ├── property/       # Implementación repositorio Property
│   └── database/       # Configuración TypeORM, migraciones
├── presentation/        # Controllers, DTOs HTTP, exception filters
│   ├── quote/          # QuoteController
│   ├── property/       # PropertyController
│   └── health/         # Health checks
└── common/              # Utilidades compartidas (logger, interceptors)
```

### Principios Hexagonales

| Principio | Implementación |
|-----------|---------------|
| **Independencia de frameworks** | Domain no depende de NestJS |
| **Testabilidad** | Use cases con mocks fáciles |
| **Independencia de UI** | Domain no sabe del frontend |
| **Independencia de BD** | Repository ports permiten cambiar PostgreSQL |

## Instalación

```bash
# Clonar y entrar al directorio
cd ms-core

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con credenciales PostgreSQL

# Ejecutar migraciones
npm run migration:run
```

## Comandos Disponibles

```bash
# Desarrollo con hot reload
npm run start:dev

# Producción
npm run build
npm run start:prod

# Testing
npm run test              # Tests unitarios
npm run test:cov          # Coverage report
npm run test:e2e          # Tests end-to-end
npm run test:watch        # Watch mode

# Calidad de código
npm run lint            # ESLint con auto-fix
npm run format          # Prettier formatting

# Migraciones TypeORM
npm run migration:generate -- -n NombreMigration
npm run migration:run
npm run migration:revert
```

## Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DB_HOST` | Host PostgreSQL | `localhost` |
| `DB_PORT` | Puerto PostgreSQL | `5432` |
| `DB_USERNAME` | Usuario PostgreSQL | `postgres` |
| `DB_PASSWORD` | Contraseña PostgreSQL | `password` |
| `DB_NAME` | Nombre de la base de datos | `segurax` |
| `PORT` | Puerto del servidor API | `3000` |
| `NODE_ENV` | Entorno (development/production) | `development` |

## API Endpoints

### Cotizaciones (`/quotes`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/quotes` | Listar todas las cotizaciones (con filtros opcionales) |
| `GET` | `/quotes/:id` | Obtener cotización por ID |
| `POST` | `/quotes` | Crear nueva cotización (genera folio automático) |
| `PATCH` | `/quotes/:id` | Actualizar datos de la cotización |

### Propiedades

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/quotes/:quoteId/properties` | Listar propiedades de una cotización |
| `POST` | `/quotes/:quoteId/properties/bulk` | Crear múltiples propiedades |
| `PATCH` | `/properties/:id` | Actualizar una propiedad |
| `DELETE` | `/quotes/:quoteId/properties` | Eliminar todas las propiedades de una cotización |

### Utilidades

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/cp/:cp/validate` | Validar código postal (formato) |
| `GET` | `/activities/search` | Buscar clave de giro SAT |
| `GET` | `/health` | Health check del servicio |

## Estructura de Respuestas

### QuoteResponseDto
```json
{
  "id": "uuid",
  "folioNumber": "COT-20250120-ABC123",
  "status": "draft",
  "companyName": "Empresa Ejemplo",
  "rfc": "RFC123456789",
  "businessLine": "Comercio",
  "propertyCount": 3,
  "createdAt": "2025-01-20T10:00:00Z",
  "updatedAt": "2025-01-20T10:00:00Z"
}
```

### PropertyResponseDto
```json
{
  "id": "uuid",
  "quoteId": "uuid",
  "name": "Sucursal Centro",
  "address": { "street": "", "city": "", "state": "", "zipCode": "" },
  "construction": { "type": "", "year": 2020, "levels": 1 },
  "coverages": { "building": 1000000, "contents": 500000 },
  "status": "incomplete",
  "completionPercentage": 65,
  "createdAt": "2025-01-20T10:00:00Z",
  "updatedAt": "2025-01-20T10:00:00Z"
}
```

## 🐳 Docker

### Dockerfile Optimizado (Multi-Stage)

El Dockerfile usa **3 stages** para optimizar la imagen final:

```dockerfile
# Stage 1: Dependencies (solo prod)
# Stage 2: Builder (compila TypeScript)
# Stage 3: Production (imagen final mínima)
```

**Características de seguridad:**
- ✅ Multi-stage build
- ✅ Usuario `node` (no-root, UID 1000)
- ✅ Labels OCI estándar
- ✅ Imagen base Alpine Linux
- ✅ Sin HEALTHCHECK (gestión externa)
- ✅ `dumb-init` para manejo de señales

### Comandos Docker

```bash
# Build
docker build -t ms-core .

# Run
docker run -p 3000:3000 --env-file .env ms-core

# Development con Docker Compose (desde raíz)
docker-compose up ms-core

# Verificar usuario no-root
docker run --rm ms-core id
# Output: uid=1000(node) gid=1000(node)

# Verificar labels OCI
docker inspect ms-core --format='{{.Config.Labels}}'
```

### Labels OCI

La imagen incluye metadata estándar OCI:

| Label | Valor |
|-------|-------|
| `org.opencontainers.image.title` | ms-core |
| `org.opencontainers.image.description` | Backend Core API - SeguraX Cotizador |
| `org.opencontainers.image.version` | 1.0.0 |
| `org.opencontainers.image.authors` | DevOps Team |

## 🧪 Testing

El proyecto usa **Jest** con configuración para testing de arquitectura hexagonal:

```bash
# Tests unitarios (use cases, domain)
npm run test

# Tests con cobertura
npm run test:cov

# Tests en modo watch
npm run test:watch

# Tests de integración (repositorios, controllers)
npm run test:e2e

# Tests de integración (alias)
npm run test:integration
```

### Estrategia de Testing

| Capa | Tipo de Test | Ejemplo | Cobertura |
|------|--------------|---------|-----------|
| Domain | Unit test puro | `quote.entity.spec.ts` | 90% |
| Application | Unit con mocks | `create-quote.use-case.spec.ts` | 80% |
| Infrastructure | Integration | `quote.typeorm.repository.spec.ts` | 80% |
| Presentation | E2E | `quote.controller.e2e-spec.ts` | - |

### Comandos de Testing Actualizados

```bash
# Ejecutar todos los tests
npm run test

# Cobertura con umbral mínimo 80%
npm run test:cov

# Modo watch para desarrollo
npm run test:watch

# Debug de tests
npm run test:debug

# Tests E2E completos
npm run test:e2e
```

## Logging

Sistema de logging estructurado con Winston:

```typescript
// Cada request incluye correlation ID
{
  "timestamp": "2025-01-20T10:00:00.000Z",
  "level": "info",
  "correlationId": "uuid",
  "layer": "presentation",
  "class": "QuoteController",
  "event": "QUOTE_CREATE_SUCCESS",
  "message": "Quote created successfully",
  "meta": { "quoteId": "uuid", "folioNumber": "COT-..." }
}
```

## Licencia

MIT License
