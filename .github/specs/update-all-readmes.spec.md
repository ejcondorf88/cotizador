---
id: SPEC-024
status: IN_PROGRESS
feature: update-all-readmes
created: 2026-04-21
updated: 2026-04-21
author: spec-generator
version: "1.0"
related-specs:
  - SPEC-001
  - SPEC-021
  - SPEC-022
  - SPEC-023
  - SPEC-019
---

# Spec: Actualización de READMEs del Proyecto Cotizador SeguraX

> **Estado:** `DRAFT` → aprobar con `status: APPROVED` antes de iniciar implementación.
> **Ciclo de vida:** DRAFT → APPROVED → IN_PROGRESS → IMPLEMENTED → DEPRECATED

---

## 1. REQUERIMIENTOS

### Descripción

Actualizar y mejorar la documentación README de todo el proyecto Cotizador SeguraX para reflejar:
1. Las nuevas implementaciones de Dockerfiles optimizados (SPEC-001)
2. La suite de tests E2E con Serenity BDD (SPEC-021)
3. Los tests unitarios del microservicio de catálogos (SPEC-022)
4. El flujo técnico end-to-end documentado (SPEC-023)
5. Los diagramas C4 y ADRs generados (SPEC-019)

### Historias de Usuario

#### HU-01: README Raíz Actualizado

```
Como: Nuevo desarrollador en el proyecto
Quiero: Un README principal actualizado y completo
Para: Entender rápidamente la arquitectura, stack tecnológico y cómo ejecutar el proyecto

Prioridad: Alta
Estimación: M
Dependencias: Ninguna
Capa: Documentación
```

#### Criterios de Aceptación — HU-01

**Happy Path**
```gherkin
CRITERIO-1.1: README raíz actualizado
Dado que: Un nuevo desarrollador clona el repositorio
Cuando: Lee el README.md en la raíz
Entonces: Encuentra información actualizada sobre:
  - Arquitectura completa con ms-catalogos
  - Stack tecnológico con versiones exactas
  - Dockerfiles optimizados documentados
  - Tests E2E disponibles
  - Tests unitarios configurados
  - Instrucciones de ejecución claras

CRITERIO-1.2: Referencias cruzadas
Dado que: El README contiene enlaces a otros documentos
Cuando: El usuario hace clic en un enlace
Entonces: El enlace lleva al documento correcto y existente
```

#### HU-02: READMEs de Microservicios Actualizados

```
Como: Desarrollador backend
Quiero: READMEs específicos por microservicio actualizados
Para: Configurar y ejecutar cada servicio correctamente

Prioridad: Alta
Estimación: M
Dependencias: HU-01
Capa: Documentación
```

#### Criterios de Aceptación — HU-02

**Happy Path**
```gherkin
CRITERIO-2.1: README ms-catalogos actualizado
Dado que: El microservicio ms-catalogos tiene nuevos tests unitarios
Cuando: Leo su README
Entonces: Encuentro:
  - Comandos de testing completos (test, test:cov, test:e2e)
  - Estructura de carpetas con tests
  - Configuración de TestContainers
  - Cobertura mínima requerida (80%)

CRITERIO-2.2: README ms-core actualizado
Dado que: El Dockerfile fue optimizado
Cuando: Leo su README
Entonces: Encuentro:
  - Instrucciones de build optimizadas
  - Nota sobre usuario no-root
  - Labels de metadata OCI

CRITERIO-2.3: README ms-gateway actualizado
Dado que: El Gateway usa multi-stage build
Cuando: Leo su README
Entonces: Encuentro:
  - Configuración de rutas actualizada
  - Instrucciones de build multi-stage
  - Integración con ms-catalogos

CRITERIO-2.4: README frontend actualizado
Dado que: El Dockerfile fue optimizado
Cuando: Leo su README
Entonces: Encuentro:
  - Instrucciones de build multi-stage
  - Integración con tests E2E
  - Comandos de linting y testing
```

#### HU-03: Documentación de Tests E2E

```
Como: QA Engineer
Quiero: README del proyecto E2E actualizado
Para: Ejecutar y mantener los tests de Serenity BDD

Prioridad: Alta
Estimación: S
Dependencias: SPEC-021
Capa: Documentación
```

#### Criterios de Aceptación — HU-03

**Happy Path**
```gherkin
CRITERIO-3.1: README e2e completo
Dado que: El proyecto tiene tests E2E con Serenity BDD
Cuando: Leo e2e/README.md
Entonces: Encuentro:
  - Estructura del proyecto Screenplay Pattern
  - Comandos de ejecución por tags
  - Cómo ver reportes Serenity
  - Tags disponibles (@happy-path, @microflujo-N)
  - Requisitos previos (Java 17, Maven, Chrome)
```

### Reglas de Negocio

1. **Consistencia**: Todos los READMEs deben seguir el mismo formato y estilo
2. **Actualidad**: La información debe reflejar el estado actual del código
3. **Completitud**: Incluir todos los comandos necesarios para ejecutar cada servicio
4. **Enlaces válidos**: Todos los enlaces internos deben funcionar
5. **Stack actualizado**: Las versiones de tecnologías deben ser precisas

---

## 2. DISEÑO

### 2.1 Archivos README a Actualizar

| Archivo | Estado Actual | Cambios Requeridos | Prioridad |
|---------|---------------|-------------------|-----------|
| `/README.md` | Bueno | Agregar ms-catalogos, tests E2E, Docker optimizado | Alta |
| `/frontend/README.md` | Bueno | Agregar testing, Docker multi-stage | Media |
| `/ms-core/README.md` | Bueno | Agregar Docker optimizado, integración con gateway | Media |
| `/ms-gateway/README.md` | Bueno | Agregar rutas a ms-catalogos, multi-stage build | Media |
| `/ms-catalogos/README.md` | Básico | Expandir con testing, TestContainers, estructura completa | Alta |
| `/e2e/README.md` | Muy completo | Actualizar referencias a specs, añadir tags recientes | Media |

### 2.2 Estructura de READMEs Propuesta

#### README Raíz (Estructura)

```markdown
# Cotizador SeguraX

Sistema de cotización de seguros de daños para empresas.

## 🏗️ Arquitectura
[Diagrama C4 actualizado con ms-catalogos]

## 📋 Stack Tecnológico
| Capa | Tecnología | Versión | Propósito |
|------|-----------|---------|-----------|
| Frontend | React + Vite | 19 + 8 | SPA con wizard |
| Gateway | Spring Cloud Gateway | 2023.0.0 | Enrutamiento, CORS |
| Backend | NestJS + TypeORM | 10 + 0.3 | Lógica de negocio |
| Catalogos | NestJS + TypeORM | 10 + 0.3 | Catálogos maestros |
| Base de Datos | PostgreSQL | 16 | Persistencia |
| Testing E2E | Serenity BDD | 4.2.15 | Tests automatizados |

## 🚀 Quick Start

### Opción 1: Docker Compose (Recomendado)
...

### Opción 2: Desarrollo Local
...

## 🧪 Testing

### Tests Unitarios
```bash
cd ms-catalogos && npm run test:cov
cd ms-core && npm run test:cov
```

### Tests E2E
```bash
cd e2e && mvn clean verify
```

## 📚 Documentación
- [README Frontend](./frontend/README.md)
- [README Backend](./ms-core/README.md)
- [README Gateway](./ms-gateway/README.md)
- [README Catálogos](./ms-catalogos/README.md)
- [README E2E](./e2e/README.md)
- [Diagramas C4](./docs/diagrams/)
- [ADRs](./docs/adr/)
```

#### README ms-catalogos (Estructura Ampliada)

```markdown
# MS-Catalogos

Microservicio de Catálogos para el sistema SeguraX Cotizador.

## 📋 Stack Tecnológico

## 🏗️ Arquitectura
[N-Capas con diagrama]

## 📦 Catálogos Disponibles
- Giros
- Agentes
- Suscriptores
- Oficinas

## 🧪 Testing

### Configuración de Tests
- Jest + TypeScript
- TestContainers para PostgreSQL
- Cobertura mínima: 80%

### Comandos
```bash
# Tests unitarios
npm run test

# Tests con cobertura
npm run test:cov

# Tests de integración (con TestContainers)
npm run test:integration

# Tests E2E
npm run test:e2e
```

### Estructura de Tests
```
src/
├── domain/
│   └── giros/
│       └── entities/__tests__/
│           └── giro.entity.spec.ts
├── application/
│   └── giros/
│       └── use-cases/__tests__/
│           └── create-giro.use-case.spec.ts
└── infrastructure/
    └── giros/
        ├── adapters/__tests__/
        │   └── giro-repository.adapter.spec.ts
        └── mappers/__tests__/
            └── giro.mapper.spec.ts
```

## 🔧 Configuración TestContainers

El proyecto usa TestContainers para tests de integración:

```typescript
// test/database.ts
import { PostgreSqlContainer } from '@testcontainers/postgresql';

export const testDatabase = new PostgreSqlContainer()
  .withDatabase('test_catalogos')
  .withUsername('test')
  .withPassword('test');
```

## 🐳 Docker

### Dockerfile Optimizado (Multi-stage)
```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
...

# Stage 2: Production
FROM node:20-alpine AS production
LABEL org.opencontainers.image.title="ms-catalogos"
...
```

### Build
```bash
docker build -t ms-catalogos .
```

### Verificar Usuario No-Root
```bash
docker run --rm ms-catalogos id
# uid=1001(appuser) gid=1001(appgroup)
```
```

### 2.3 Contenido Específico por README

#### README Raíz - Secciones a Actualizar

| Sección | Cambio | Prioridad |
|---------|--------|-----------|
| Arquitectura | Agregar ms-catalogos al diagrama | Alta |
| Stack Tecnológico | Agregar ms-catalogos y Serenity BDD | Alta |
| Docker y Contenedores | Agregar sección de verificación de seguridad | Media |
| Testing | Nueva sección con tests unitarios y E2E | Alta |
| Estructura del Proyecto | Incluir ms-catalogos y e2e | Media |
| Documentación | Agregar enlace a README e2e | Media |

#### README ms-catalogos - Secciones Nuevas

| Sección | Descripción | Prioridad |
|---------|-------------|-----------|
| Testing Overview | Explicación de estrategia de testing | Alta |
| TestContainers | Configuración y uso | Alta |
| Cobertura | Requisitos y cómo verificar | Media |
| Fixtures | Datos de prueba disponibles | Baja |
| Ejemplos de Tests | Código de ejemplo por capa | Media |

#### README E2E - Secciones a Verificar

| Sección | Verificación | Estado |
|---------|--------------|--------|
| Estructura del Proyecto | Confirmar estructura Screenplay | ✅ OK |
| Tags de Cucumber | Verificar tags @microflujo-N | ✅ OK |
| Ejecución | Comandos Maven correctos | ✅ OK |
| Reportes | Ubicación y cómo visualizar | ✅ OK |
| Spec Relacionada | Enlace a SPEC-021 | Añadir |

---

## 3. LISTA DE TAREAS

### Backend - Actualización README Raíz

- [ ] Actualizar diagrama de arquitectura con ms-catalogos
- [ ] Agregar ms-catalogos al stack tecnológico
- [ ] Nueva sección "Testing" con:
  - [ ] Tests unitarios por microservicio
  - [ ] Tests E2E con Serenity BDD
  - [ ] Cómo ejecutar cada suite
- [ ] Actualizar estructura de carpetas:
  - [ ] Agregar ms-catalogos/
  - [ ] Agregar e2e/
- [ ] Agregar sección Docker optimizado:
  - [ ] Tabla de puertos por microservicio
  - [ ] Verificación de usuario no-root
  - [ ] Labels OCI
- [ ] Actualizar enlaces a READMEs:
  - [ ] Agregar enlace a ms-catalogos/README.md
  - [ ] Agregar enlace a e2e/README.md
- [ ] Agregar sección de decisiones arquitectónicas (ADRs)

### Backend - Actualización README ms-catalogos

- [ ] Expandir descripción del propósito
- [ ] Agregar diagrama de arquitectura N-Capas
- [ ] Completar endpoints API para todos los catálogos
- [ ] Nueva sección "Testing":
  - [ ] Resumen de estrategia (N-Capas testing)
  - [ ] Tecnologías: Jest, TestContainers, ts-jest
  - [ ] Comandos: test, test:cov, test:watch, test:e2e
  - [ ] Estructura de carpetas de tests
  - [ ] Ejemplos de tests por capa (Domain, Application, Infrastructure)
- [ ] Sección TestContainers:
  - [ ] Configuración de PostgreSQL en contenedor
  - [ ] Cómo funciona el helper test/database.ts
- [ ] Sección Cobertura:
  - [ ] Requisito mínimo 80%
  - [ ] Umbros por capa (Domain 90%, Application 80%)
  - [ ] Cómo generar reporte
- [ ] Sección Fixtures:
  - [ ] Datos de prueba disponibles
  - [ ] Cómo extender
- [ ] Actualizar sección Docker:
  - [ ] Multi-stage build
  - [ ] Usuario no-root
  - [ ] Labels OCI
  - [ ] Comando de verificación

### Backend - Actualización README ms-core

- [ ] Agregar nota sobre Dockerfile optimizado
- [ ] Sección de verificación de usuario no-root
- [ ] Agregar labels OCI en descripción de Docker
- [ ] Agregar sección de integración con ms-catalogos (si aplica)
- [ ] Actualizar comandos de testing si hay nuevos

### Backend - Actualización README ms-gateway

- [ ] Agregar ruta a ms-catalogos en tabla de rutas
- [ ] Actualizar sección Docker con multi-stage build
- [ ] Agregar nota sobre usuario no-root
- [ ] Verificar que variables de entorno estén completas

### Frontend - Actualización README frontend

- [ ] Agregar sección de testing:
  - [ ] Comandos npm run test (si existen)
  - [ ] Integración con tests E2E
- [ ] Actualizar sección Docker:
  - [ ] Multi-stage build
  - [ ] Usuario no-root
  - [ ] Labels OCI
- [ ] Agregar sección de hooks y servicios nuevos (si aplica)
- [ ] Verificar que stack tecnológico esté actualizado

### QA - Actualización README e2e

- [ ] Verificar estado de implementación (marcar IMPLEMENTED)
- [ ] Agregar enlace a SPEC-021
- [ ] Verificar que todos los tags estén documentados
- [ ] Confirmar estructura de carpetas actual
- [ ] Verificar enlaces a documentación externa

### QA - Validación Final

- [ ] Todos los READMEs tienen formato Markdown válido
- [ ] Todos los enlaces internos funcionan
- [ ] Las versiones de tecnologías son consistentes
- [ ] Los comandos de Docker funcionan
- [ ] La información de testing es precisa
- [ ] Las instrucciones de ejecución son claras

---

## 4. CONTENIDO DE REFERENCIA

### 4.1 Docker Optimizado - Ejemplo ms-catalogos

```dockerfile
# ============================================================================
# STAGE 1: Build
# ============================================================================
FROM node:20-alpine AS builder

WORKDIR /app
RUN apk add --no-cache python3 make g++

COPY package*.json ./
COPY tsconfig.json ./
COPY nest-cli.json ./
RUN npm ci && npm cache clean --force

COPY src ./src
RUN npm run build

# ============================================================================
# STAGE 2: Production
# ============================================================================
FROM node:20-alpine AS production

LABEL org.opencontainers.image.title="ms-catalogos"
LABEL org.opencontainers.image.description="Microservicio de Catálogos - SeguraX Cotizador"
LABEL org.opencontainers.image.version="1.0.0"
LABEL org.opencontainers.image.authors="DevOps Team"

WORKDIR /app

RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

COPY package*.json ./
RUN npm ci --omit=dev && \
    npm cache clean --force && \
    rm -rf /tmp/*

COPY --from=builder /app/dist ./dist
RUN chown -R appuser:appgroup /app

USER appuser
EXPOSE 3001

CMD ["node", "dist/main.js"]
```

### 4.2 Tests E2E - Comandos de Ejecución

```bash
# Ejecutar todo el happy path
cd e2e
mvn clean verify

# Ejecutar por tag específico
mvn clean verify -Dcucumber.filter.tags="@happy-path"
mvn clean verify -Dcucumber.filter.tags="@microflujo-1"

# Modo headless (CI/CD)
mvn clean verify -Dheadless.mode=true

# Ver reporte
start target/site/serenity/index.html
```

### 4.3 Tests Unitarios ms-catalogos - Ejemplo

```typescript
// Domain Entity Test
describe('Domain/Giros - Giro Entity', () => {
  describe('create()', () => {
    it('should create a giro with generated UUID', () => {
      const giro = Giro.create({
        clave: 'COM-001',
        descripcion: 'Comercio de prueba',
      });

      expect(giro.id).toBeDefined();
      expect(giro.id).toMatch(/^[0-9a-f-]{36}$/);
    });
  });
});

// Repository Integration Test
describe('Infrastructure/Giros - GiroRepositoryAdapter', () => {
  it('should persist giro with UUID', async () => {
    const giro = Giro.create({
      clave: 'COM-001',
      descripcion: 'Comercio de prueba',
    });

    const saved = await repository.create(giro);
    expect(saved.id).toMatch(/^[0-9a-f-]{36}$/);
  });
});
```

---

## 5. RIESGOS Y CONSIDERACIONES

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Información desactualizada en READMEs | Alto | Revisar cada README contra el código actual |
| Enlaces rotos | Medio | Verificar todos los enlaces internos |
| Inconsistencia de versiones | Medio | Mantener tabla de versiones centralizada |
| READMEs muy largos | Bajo | Usar secciones colapsables, índice |

---

## 6. DEFINITION OF DONE

- [ ] README raíz actualizado con arquitectura completa
- [ ] README ms-catalogos expandido con sección de testing
- [ ] README ms-core actualizado con Docker optimizado
- [ ] README ms-gateway actualizado con multi-stage build
- [ ] README frontend actualizado con testing y Docker
- [ ] README e2e verificado y actualizado
- [ ] Todos los enlaces internos funcionan
- [ ] Formato Markdown válido en todos los archivos
- [ ] Información consistente entre READMEs
- [ ] Estatus de spec cambiado a IMPLEMENTED

---

*SPEC-024: Actualización de READMEs - Cotizador SeguraX*
