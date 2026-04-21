# Cotizador SeguraX

Sistema de cotización de seguros de daños para empresas. Permite a agentes crear cotizaciones personalizadas con múltiples ubicaciones y coberturas.

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ COTIZADOR SEGURAX                                                           │
│ Sistema de Cotización de Seguros                                            │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ CLIENTE                                                                     │
│ (Navegador Web - Agentes)                                                   │
└─────────────────────────────────┬───────────────────────────────────────────┘
                                  │ HTTPS
                                  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ FRONTEND                                                                    │
│ React 19 + TypeScript + Tailwind CSS + Vite                                 │
│ Puerto: 5173                                                                │
│ ┌─────────────────────────────────────────────────────────────────────┐     │
│ │ • Wizard de 6 pasos                                                 │     │
│ │ • Formularios dinámicos de propiedades                              │     │
│ │ • Selección de coberturas con toggles                               │     │
│ │ • Estado: Zustand + React Query                                     │     │
│ └─────────────────────────────────────────────────────────────────────┘     │
└─────────────────────────────────┬───────────────────────────────────────────┘
                                  │ HTTP/REST
                                  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ API GATEWAY                                                                 │
│ Spring Cloud Gateway (WebFlux)                                              │
│ Puerto: 8080                                                                │
│ ┌─────────────────────────────────────────────────────────────────────┐     │
│ │ • Enrutamiento: /api/v1/** → ms-core                                │     │
│ │ • Enrutamiento: /api/v1/catalogos/** → ms-catalogos               │     │
│ │ • CORS centralizado                                                 │     │
│ │ • Logging de requests/responses                                     │     │
│ │ • Health checks: /actuator/health                                   │     │
│ └─────────────────────────────────────────────────────────────────────┘     │
└─────────────────────────────────┬───────────────────────────────────────────┘
                                  │ HTTP/REST
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
┌──────────────────────────┐      ┌──────────────────────────┐
│ MS-CORE (Backend)        │      │ MS-CATALOGOS             │
│ NestJS + TypeORM         │      │ NestJS + TypeORM         │
│ Puerto: 3000             │      │ Puerto: 3001             │
│ ┌──────────────────────┐ │      │ ┌──────────────────────┐   │
│ │ • Cotizaciones       │ │      │ │ • Giros              │   │
│ │ • Propiedades        │ │      │ │ • Agentes            │   │
│ │ • Coberturas         │ │      │ │ • Suscriptores       │   │
│ │ • Arq. Hexagonal     │ │      │ │ • Oficinas           │   │
│ └──────────────────────┘ │      │ │ • Arq. N-Capas       │   │
└──────────────────────────┘      │ └──────────────────────┘   │
                                  └──────────────────────────┘
                                            │
                                            │ PostgreSQL Protocol
                                            ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ BASE DE DATOS                                                               │
│ PostgreSQL 16                                                               │
│ Puerto: 5432                                                                │
│ ┌─────────────────────────────────────────────────────────────────────┐     │
│ │ • quotes: Cotizaciones con folio, estado                            │     │
│ │ • properties: Inmuebles por cotización                              │     │
│ │ • coverages: Catálogo de coberturas                                   │     │
│ │ • catalog.*: Giros, Agentes, Suscriptores, Oficinas                   │     │
│ │ • quote_coverages: Relación N:M con selección                       │     │
│ └─────────────────────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 📋 Stack Tecnológico

| Capa | Tecnología | Versión | Propósito |
|------|-----------|---------|-----------|
| **Frontend** | React + Vite | 19 + 8 | SPA con wizard |
| **Gateway** | Spring Cloud Gateway | 2023.0.0 | Enrutamiento, CORS |
| **Backend Core** | NestJS + TypeORM | 10 + 0.3 | Lógica de negocio |
| **Catálogos** | NestJS + TypeORM | 10 + 0.3 | Catálogos maestros |
| **Base de Datos** | PostgreSQL | 16 | Persistencia |
| **Testing E2E** | Serenity BDD | 4.2.15 | Tests automatizados |
| **Testing Unit** | Jest + TestContainers | 29.x | Tests unitarios |
| **Contenedores** | Docker + Compose | 24+ | Orquestación |

## 🐳 Docker y Contenedores

### Construcción de Imágenes (Multi-Stage Optimizado)

Todos los servicios incluyen Dockerfiles optimizados con multi-stage builds, usuario no-root y labels OCI:

```bash
# Microservicio de Catálogos (Node.js/NestJS - 2 stages)
docker build -t ms-catalogos:latest -f ms-catalogos/Dockerfile ms-catalogos/

# API Gateway (Java/Spring Boot - 2 stages)
docker build -t ms-gateway:latest -f ms-gateway/Dockerfile ms-gateway/

# Backend Core (Node.js/NestJS - 3 stages)
docker build -t ms-core:latest -f ms-core/Dockerfile ms-core/

# Frontend (React + Nginx - 2 stages)
docker build -t frontend:latest -f frontend/Dockerfile frontend/
```

### Docker Compose

```bash
# Desarrollo local
docker-compose up -d

# Producción (multi-stage builds)
docker-compose -f docker-compose.prod.yml up -d
```

### Verificación de Seguridad (Usuario No-Root)

Todos los contenedores ejecutan con usuario no-root por defecto:

```bash
# Verificar usuario dentro del contenedor
docker exec <container> id
docker exec <container> ps aux

# Verificar que no corre como root
docker inspect <container> --format='{{.Config.User}}'
```

### Tabla de Puertos por Microservicio

| Servicio | Puerto Host | Puerto Container | Usuario | UID/GID | Labels OCI |
|----------|-------------|------------------|---------|---------|------------|
| Frontend (Nginx) | 80 | 8080 | appuser | 1001:1001 | ✅ |
| API Gateway | 8080 | 8080 | appuser | 1001:1001 | ✅ |
| ms-core | 3000 | 3000 | node | 1000:1000 | ✅ |
| ms-catalogos | 3001 | 3001 | appuser | 1001:1001 | ✅ |
| PostgreSQL | 5432 | 5432 | postgres | 70:70 | N/A |

**Características de seguridad:**
- ✅ Multi-stage builds para imágenes mínimas
- ✅ Usuario no-root (principio de mínimo privilegio)
- ✅ Imágenes base Alpine Linux
- ✅ Labels OCI estándar (`org.opencontainers.image.*`)
- ✅ Sin HEALTHCHECK (gestión externa)

## 🧪 Testing

El proyecto cuenta con estrategia de testing completa:

### Tests Unitarios e Integración

| Servicio | Comando | Cobertura |
|----------|---------|-----------|
| ms-core | `cd ms-core && npm run test:cov` | Reporte en `coverage/` |
| ms-catalogos | `cd ms-catalogos && npm run test:cov` | Mínimo 80% requerido |
| ms-gateway | `cd ms-gateway && mvn test` | Reporte Surefire |
| frontend | `cd frontend && npm run test` | Reporte en `coverage/` |

### Tests E2E (Serenity BDD)

```bash
# Ejecutar todos los tests E2E
cd e2e && mvn clean verify

# Ejecutar por microflujo
mvn clean verify -Dcucumber.filter.tags="@microflujo-1"
mvn clean verify -Dcucumber.filter.tags="@microflujo-5"

# Modo headless (CI/CD)
mvn clean verify -Dheadless.mode=true
```

### Ver Reportes

```bash
# Reporte Serenity (E2E)
start e2e/target/site/serenity/index.html

# Reporte Cobertura (ms-catalogos)
start ms-catalogos/coverage/lcov-report/index.html
```

## 🚀 Quick Start

### Opción 1: Docker Compose (Recomendado)

```bash
# Clonar repositorio
git clone <repo>
cd cotizador

# Iniciar todos los servicios
docker-compose up -d

# Acceso
Frontend: http://localhost:5173
Gateway API: http://localhost:8080/api/v1
Actuator: http://localhost:8080/actuator/health
```

### Opción 2: Desarrollo Local

```bash
# Terminal 1: Database
docker run -d -p 5432:5432 -e POSTGRES_DB=segurax \
  -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password \
  postgres:16-alpine

# Terminal 2: Backend
cd ms-core
npm install
npm run migration:run
npm run start:dev

# Terminal 3: Gateway
cd ms-gateway
mvn spring-boot:run

# Terminal 4: Frontend
cd frontend
npm install
npm run dev

# Terminal 5: Catálogos
cd ms-catalogos
npm install
npm run migration:run
npm run start:dev
```

## 📁 Estructura del Proyecto

```
cotizador/
├── ms-core/                    # Backend (NestJS + Hexagonal)
│   ├── src/
│   │   ├── domain/             # Entidades, enums
│   │   ├── application/        # Use cases, DTOs
│   │   ├── infrastructure/     # TypeORM repos, mappers
│   │   └── presentation/       # Controllers
│   ├── Dockerfile              # Multi-stage, usuario no-root
│   ├── Dockerfile.dev
│   └── README.md
├── ms-gateway/                 # API Gateway (Spring Boot)
│   ├── src/
│   ├── Dockerfile              # Multi-stage, usuario no-root
│   └── README.md
├── ms-catalogos/               # Microservicio Catálogos (NestJS)
│   ├── src/
│   │   ├── domain/             # Entidades puras
│   │   ├── application/        # Use cases, DTOs
│   │   ├── infrastructure/     # Repositories, mappers
│   │   └── presentation/       # Controllers
│   ├── test/                   # Tests con TestContainers
│   ├── Dockerfile              # Multi-stage, usuario no-root
│   └── README.md
├── frontend/                   # Frontend (React + Vite)
│   ├── src/
│   ├── Dockerfile              # Multi-stage, usuario no-root
│   ├── Dockerfile.dev
│   └── README.md
├── e2e/                        # Tests E2E (Serenity BDD)
│   ├── src/test/
│   │   ├── java/com/segurax/   # Screenplay Pattern
│   │   └── resources/features/ # Gherkin scenarios
│   ├── pom.xml
│   └── README.md
├── docker-compose.yml          # Orquestación local
├── docker-compose.prod.yml     # Orquestación producción
├── docs/                       # Documentación
│   ├── diagrams/               # Diagramas C4 PlantUML
│   ├── adr/                    # Architecture Decision Records
│   └── output/qa/              # Artefactos QA
└── .github/
    ├── specs/                  # Especificaciones ASDD
    └── adr/                    # ADRs técnicos
```

## 🌐 Servicios y Puertos

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| Frontend | 5173 | React SPA |
| Gateway | 8080 | Spring Cloud Gateway |
| ms-core | 3000 | NestJS API Core |
| ms-catalogos | 3001 | NestJS API Catálogos |
| PostgreSQL | 5432 | Base de datos |

## 📚 Documentación

- [README Backend Core](./ms-core/README.md)
- [README Gateway](./ms-gateway/README.md)
- [README Catálogos](./ms-catalogos/README.md)
- [README Frontend](./frontend/README.md)
- [README E2E Tests](./e2e/README.md)
- [Diagramas C4](./docs/diagrams/)
- [ADRs](./docs/adr/)

## 📝 Decisiones Arquitectónicas (ADRs)

| ADR | Título | Decisión |
|-----|--------|----------|
| [ADR-001](./docs/adr/ADR-001-typescript.md) | TypeScript | Tipado fuerte para frontend y backend |
| [ADR-002](./docs/adr/ADR-002-postgresql.md) | PostgreSQL | Base de datos relacional ACID |
| [ADR-003](./docs/adr/ADR-003-typeorm.md) | TypeORM | ORM con soporte para arquitectura hexagonal |
| [ADR-004](./docs/adr/ADR-004-react-vite.md) | React + Vite | SPA sin SSR necesario |
| [ADR-005](./docs/adr/ADR-005-tailwind.md) | Tailwind CSS | Estilos utilitarios, bundle pequeño |
| [ADR-006](./docs/adr/ADR-006-gateway.md) | API Gateway | CORS centralizado, logging unificado |
| [ADR-007](./docs/adr/ADR-007-hexagonal.md) | Hexagonal | Independencia de frameworks y testabilidad |
| [ADR-008](./docs/adr/ADR-008-dockerfile-optimization.md) | Docker Optimization | Multi-stage builds, usuarios no-root |
| [ADR-009](./docs/adr/ADR-009-serenity-bdd-e2e.md) | Serenity BDD | Testing E2E con Screenplay Pattern |

## 🔄 Flujo de Cotización

1. **Datos Generales** - Empresa, RFC, giro, agente
2. **Ubicaciones** - Cantidad de inmuebles (1-100)
3. **Propiedades** - Dirección, construcción, valores asegurados
4. **Coberturas** - Selección de coberturas (obligatorias + opcionales)
5. **Resumen** - Confirmación y cálculo de prima
6. **Éxito** - Folio generado, PDF, email

## 🔧 Comandos Útiles

```bash
# Docker Compose
docker-compose up -d                    # Iniciar todos los servicios
docker-compose down                     # Detener
docker-compose logs -f ms-core          # Ver logs del backend
docker-compose logs -f ms-catalogos     # Ver logs de catálogos
docker-compose logs -f frontend         # Ver logs del frontend

# Backend (ms-core)
npm run migration:generate -- -n NombreMigration
npm run migration:run

# Catálogos (ms-catalogos)
npm run test:cov                        # Tests con cobertura
npm run test:integration                # Tests de integración

# Gateway
mvn spring-boot:run
mvn clean package -DskipTests

# E2E Tests
cd e2e && mvn clean verify              # Ejecutar todos los tests E2E
mvn serenity:aggregate                  # Generar reporte Serenity
```

## 🤝 Contribución

1. Crear rama: `git checkout -b feature/nueva-funcionalidad`
2. Commits: Seguir [Conventional Commits](https://www.conventionalcommits.org/)
3. Pull Request: Incluir tests y documentación
4. Review: Mínimo 1 aprobación

## 📄 Licencia

MIT License
