---
id: SPEC-019
status: IMPLEMENTED
feature: project-documentation
created: 2026-04-20
updated: 2026-04-20
author: spec-generator
version: "1.0"
related-specs:
  - SPEC-016
  - SPEC-017
  - SPEC-018
---

# Spec: Documentación del Proyecto Cotizador SeguraX

> **Estado:** `DRAFT` → aprobar con `status: APPROVED` antes de iniciar.

---

## 1. REQUERIMIENTOS

### Descripción
Generar documentación técnica completa del proyecto Cotizador SeguraX incluyendo:
1. README individual para cada microservicio (ms-core, ms-gateway, frontend)
2. README general del proyecto (raíz)
3. Diagrama C4 (Context, Container, Component, Code)
4. Justificación de la arquitectura hexagonal y decisiones de diseño

### Objetivos
- Facilitar onboarding de nuevos desarrolladores
- Documentar decisiones arquitectónicas (ADRs)
- Establecer guías de contribución
- Crear diagramas visuales de la arquitectura

---

## 2. DISEÑO - Arquitectura del Sistema

### 2.1 Diagrama C4 - Nivel 1: Contexto del Sistema

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            COTIZADOR SEGURAX                                 │
│                         Sistema de Cotización de Seguros                     │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
         ┌──────────────────────────┼──────────────────────────┐
         │                          │                          │
         ▼                          ▼                          ▼
┌─────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│   AGENTES       │    │  ADMINISTRADORES    │    │    CLIENTES         │
│  (Usuarios      │    │  (Configuración,    │    │  (Ver cotizaciones, │
│   internos)     │    │   reportes)         │    │   aceptar pólizas)  │
└────────┬────────┘    └──────────┬──────────┘    └──────────┬──────────┘
         │                        │                          │
         │                        │                          │
         │    ┌───────────────────┴───────────────────┐     │
         │    │                                       │     │
         │    ▼                                       │     │
         │    ┌───────────────────────────────────────────────┐ │
         │    │             COTIZADOR SEGURAX                │ │
         │    │        Sistema de Cotización Web              │ │
         └────┤  - Crear/editar cotizaciones                 │ │
              │  - Configurar coberturas                       │ │
              │  - Generar pólizas                           │ │
              │  - Administrar usuarios                      │◄┘
              └───────────────────┬───────────────────────────┘
                                  │
                                  │ HTTP/HTTPS
                                  ▼
                    ┌─────────────────────────┐
                    │   Sistema Externo:      │
                    │   - Email/SMS           │
                    │   - PDF Generator       │
                    │   - Storage (opcional)  │
                    └─────────────────────────┘
```

### 2.2 Diagrama C4 - Nivel 2: Contenedores

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                           COTIZADOR SEGURAX                                   │
│                         Diagrama de Contenedores                             │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                              CLIENTE (Browser)                               │
└──────────────────────────────────────────────────────────────────────────────┘
        │
        │ HTTP/HTTPS
        │
        ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │                           FRONTEND                                     │  │
│  │  ┌──────────────────────────────────────────────────────────────────┐  │  │
│  │  │  React 19 + TypeScript + Tailwind CSS + Vite                    │  │  │
│  │  │  ┌────────────────────────────────────────────────────────────┐ │  │  │
│  │  │  │ • Wizard de cotización (6 pasos)                        │ │  │  │
│  │  │  │ • Formularios dinámicos de propiedades                    │ │  │  │
│  │  │  │ • Selección de coberturas (toggles)                       │ │  │  │
│  │  │  │ • Resumen y PDF                                           │ │  │  │
│  │  │  └────────────────────────────────────────────────────────────┘ │  │  │
│  │  │  Puerto: 5173                                                  │  │  │
│  │  └──────────────────────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                    │ Puerto: 8080                            │
│                                    │ HTTP/REST                               │
│                                    ▼                                         │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │                           API GATEWAY                                  │  │
│  │  ┌──────────────────────────────────────────────────────────────────┐  │  │
│  │  │  Spring Cloud Gateway (WebFlux)                                   │  │  │
│  │  │  ┌────────────────────────────────────────────────────────────┐ │  │  │
│  │  │  │ • Enrutamiento: /api/v1/** → ms-core                    │ │  │  │
│  │  │  │ • CORS centralizado                                      │ │  │  │
│  │  │  │ • Logging de requests/responses                          │ │  │  │
│  │  │  │ • Health checks                                            │ │  │  │
│  │  │  └────────────────────────────────────────────────────────────┘ │  │  │
│  │  │  Puerto: 8080                                                  │  │  │
│  │  └──────────────────────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                    │ Puerto: 3000                            │
│                                    │ HTTP/REST                               │
│                                    ▼                                         │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │                           MS-CORE (Backend)                            │  │
│  │  ┌──────────────────────────────────────────────────────────────────┐  │  │
│  │  │  NestJS + TypeScript + TypeORM + PostgreSQL                      │  │  │
│  │  │  ┌────────────────────────────────────────────────────────────┐ │  │  │
│  │  │  │ • Arquitectura Hexagonal                                  │ │  │  │
│  │  │  │ • Domain: Entities, Value Objects                         │ │  │  │
│  │  │  │ • Application: Use Cases, DTOs                          │  │  │  │
│  │  │  │ • Infrastructure: Repositories, Mappers, Controllers        │ │  │  │
│  │  │  │ • Modules: Quotes, Properties, Coverages                  │ │  │  │
│  │  │  └────────────────────────────────────────────────────────────┘ │  │  │
│  │  │  Puerto: 3000                                                  │  │  │
│  │  └──────────────────────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                    │ Puerto: 5432                            │
│                                    │ PostgreSQL Protocol                     │
│                                    ▼                                         │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │                           BASE DE DATOS                                │  │
│  │  ┌──────────────────────────────────────────────────────────────────┐  │  │
│  │  │  PostgreSQL 15                                                   │  │  │
│  │  │  ┌────────────────────────────────────────────────────────────┐ │  │  │
│  │  │  │ • quotes, properties, coverages                           │ │  │  │
│  │  │  │ • quote_coverages (relación)                               │ │  │  │
│  │  │  │ • migrations con TypeORM                                  │  │  │  │
│  │  │  └────────────────────────────────────────────────────────────┘ │  │  │
│  │  │  Puerto: 5432                                                  │  │  │
│  │  └──────────────────────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 2.3 Diagrama C4 - Nivel 3: Componentes (ms-core)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                     MS-CORE: Componentes (Arquitectura Hexagonal)          │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                           CAPA DE PRESENTACIÓN                               │
│                    (Controllers, DTOs, Exception Filters)                    │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────────────┐  │
│  │ QuoteController   │  │PropertyController │  │ CoverageController        │  │
│  │ • POST /quotes    │  │ • CRUD props      │  │ • GET /coverages          │  │
│  │ • GET /quotes/:id │  │ • PATCH /:id      │  │ • PATCH /quotes/:id/covs  │  │
│  │ • PATCH /:id      │  │                   │  │                           │  │
│  └─────────┬─────────┘  └─────────┬─────────┘  └────────────┬──────────────┘  │
│            │                      │                         │                 │
└────────────┼──────────────────────┼─────────────────────────┼─────────────────┘
             │                      │                         │
             ▼                      ▼                         ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                           CAPA DE APLICACIÓN                                 │
│                           (Use Cases, Ports)                                 │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                        USE CASES                                      │   │
│  │  ┌─────────────────┐ ┌─────────────────┐ ┌────────────────────────┐│   │
│  │  │CreateQuoteUseCase│ │UpdateQuoteUseCase│ │GetCoveragesUseCase    ││   │
│  │  │CreatePropertyUC  │ │UpdatePropertyUC   │ │UpdateQuoteCoveragesUC ││   │
│  │  │CalculatePremiumUC│ │ ...               │ │ ...                    ││   │
│  │  └─────────────────┘ └─────────────────┘ └────────────────────────┘│   │
│  │                                                                      │   │
│  │  ┌────────────────────────────────────────────────────────────────┐  │   │
│  │  │                      PORTS (Interfaces)                         │  │   │
│  │  │  QuoteRepositoryPort │ PropertyRepositoryPort │ ...          │  │   │
│  │  └────────────────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
             │                      │                         │
             ▼                      ▼                         ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                              CAPA DE DOMINIO                                 │
│                        (Entities, Value Objects, Enums)                      │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐  │
│  │ Quote           │  │ Property        │  │ Coverage                    │  │
│  │ • id, folio     │  │ • id, quoteId   │  │ • id, name, type            │  │
│  │ • status        │  │ • name, address │  │ • baseRate, icon            │  │
│  │ • companyName   │  │ • construction  │  │                             │  │
│  │ • calculate()   │  │ • coverages     │  │                             │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────────┘  │
│                                                                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐  │
│  │ Enums:          │  │ Value Objects:  │  │                             │  │
│  │ • QuoteStatus   │  │ • Address       │  │                             │  │
│  │ • PropertyStatus│  │ • Coverages       │  │                             │  │
│  │ • CoverageCode  │  │ • Construction    │  │                             │  │
│  │ • CoverageType  │  │                 │  │                             │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────────┘  │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
             │                      │                         │
             ▼                      ▼                         ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                           CAPA DE INFRAESTRUCTURA                            │
│              (Repositories, Mappers, Entities TypeORM, DB)                 │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                     REPOSITORIOS (implementan ports)                 │    │
│  │  ┌────────────────┐ ┌────────────────┐ ┌───────────────────────────┐ │    │
│  │  │QuoteTypeOrmRepo│ │PropertyTypeOrmR│ │ CoverageTypeOrmRepository │ │    │
│  │  │ • findById()   │ │ • findById()   │ │ • findAll()               │ │    │
│  │  │ • save()       │ │ • save()       │ │ • findByType()            │ │    │
│  │  │ • update()     │ │ • update()     │ │                           │ │    │
│  │  └────────────────┘ └────────────────┘ └───────────────────────────┘ │    │
│  │                                                                      │    │
│  │  ┌────────────────────────────────────────────────────────────────┐ │    │
│  │  │                      MAPPERS                                     │ │    │
│  │  │  QuoteMapper │ PropertyMapper │ CoverageMapper                   │ │    │
│  │  │  • toDomain() │ toDomain() │ toDomain()                        │ │    │
│  │  │  • toEntity() │ toEntity() │ toEntity()                        │ │    │
│  │  └────────────────────────────────────────────────────────────────┘ │    │
│  │                                                                      │    │
│  │  ┌────────────────────────────────────────────────────────────────┐ │    │
│  │  │                      ENTITIES TYPEORM                          │ │    │
│  │  │  QuoteTypeOrmEntity │ PropertyTypeOrmEntity │ CoverageTypeOrm  │ │    │
│  │  │  @Entity @Column @PrimaryColumn @OneToMany @ManyToOne         │ │    │
│  │  └────────────────────────────────────────────────────────────────┘ │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                              BASE DE DATOS                                   │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │  PostgreSQL                                                            │  │
│  │  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐              │  │
│  │  │ quotes        │  │ properties    │  │ coverages     │              │  │
│  │  │ ───────────── │  │ ───────────── │  │ ───────────── │              │  │
│  │  │ id (PK)       │  │ id (PK)       │  │ id (PK)       │              │  │
│  │  │ folio         │  │ quote_id (FK) │  │ name          │              │  │
│  │  │ status        │  │ name          │  │ description   │              │  │
│  │  │ company_name  │  │ ...           │  │ type          │              │  │
│  │  │ ...           │  │               │  │ base_rate     │              │  │
│  │  └───────────────┘  └───────────────┘  └───────────────┘              │  │
│  │                                                                        │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐ │  │
│  │  │ quote_coverages (junction)                                       │ │  │
│  │  │ id │ quote_id │ coverage_id │ is_selected │ selected_at         │ │  │
│  │  └─────────────────────────────────────────────────────────────────┘ │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 2.4 Diagrama de Flujo de Datos (Data Flow)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                         FLUJO DE COTIZACIÓN                                 │
└──────────────────────────────────────────────────────────────────────────────┘

USUARIO (Agente)
       │
       │ 1. Crea cotización
       ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│ PASO 1: Datos Generales                                                     │
│ • Empresa, RFC, Giro, Contacto                                              │
└──────────────────────────────────────────────────────────────────────────────┘
       │
       │ 2. Selecciona cantidad de ubicaciones
       ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│ PASO 2: Layout de Ubicaciones                                               │
│ • ¿Cuántos inmuebles? (1-100)                                               │
└──────────────────────────────────────────────────────────────────────────────┘
       │
       │ 3. Captura datos de cada propiedad
       ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│ PASO 3: Datos de Propiedades (por cada una)                                 │
│ • Ubicación: Calle, CP, Ciudad, Estado                                     │
│ • Construcción: Tipo, Año, Niveles, Uso                                     │
│ • Garantías: Valores asegurados (edificio, contenido, etc.)                 │
│ • Estado: Completo/Incompleto                                               │
└──────────────────────────────────────────────────────────────────────────────┘
       │
       │ 4. Selecciona coberturas (una vez para todo el folio)
       ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│ PASO 4: Configuración de Coberturas                                         │
│ • Obligatorias: Incendio 🔥, CAT 🌪️ (siempre ON)                            │
│ • Opcionales: Cristales 🪟, Agua 💧, Robo 🦹, etc. (toggle)                  │
│ • Prima calculada: Σ(baseRate × valorAsegurado)                             │
└──────────────────────────────────────────────────────────────────────────────┘
       │
       │ 5. Revisa resumen
       ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│ PASO 5: Resumen y Confirmación                                            │
│ • Datos del asegurado                                                       │
│ • Lista de propiedades                                                      │
│ • Coberturas seleccionadas                                                  │
│ • Prima total estimada                                                      │
│ • Generar PDF / Enviar por email                                           │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. JUSTIFICACIÓN DE LA ARQUITECTURA

### 3.1 ¿Por qué Arquitectura Hexagonal?

| Principio | Implementación | Beneficio |
|-----------|---------------|-----------|
| **Independencia de frameworks** | Domain no depende de NestJS | Podemos cambiar framework sin tocar lógica de negocio |
| **Testabilidad** | Use cases con mocks fáciles | Tests unitarios rápidos y aislados |
| **Independencia de UI** | Domain no sabe del frontend | Puede usarse con web, mobile, CLI |
| **Independencia de BD** | Repository ports | Cambiamos PostgreSQL por MongoDB sin afectar lógica |
| **Independencia de agentes externos** | Logging abstracto | Swappeable implementación |

### 3.2 ¿Por qué Microservicios vs Monolito?

```
MONOLITO (Alternativa descartada)
├── Pros: Más simple inicialmente
└── Contras: 
    ├── Frontend y backend acoplados
    ├── No se puede escalar independientemente
    ├── Un cambio en frontend obliga deploy de todo
    └── Equipo frontend bloqueado por backend

MICROSERVICIOS (Elegido)
├── Pros:
│   ├── Frontend y backend desacoplados
│   ├── Escalamiento independiente
│   ├── Equipos pueden trabajar en paralelo
│   ├── Gateway centraliza CORS, logging
│   └── Despliegues independientes
└── Contras:
    └── Mayor complejidad inicial (aceptable)
```

### 3.3 ¿Por qué API Gateway?

```
SIN GATEWAY (Alternativa descartada)
Frontend → Backend directo (localhost:3000)
├── CORS configurado en cada servicio
├── Logging disperso
├── Frontend conoce URLs de todos los servicios
└── Difícil agregar autenticación

CON GATEWAY (Elegido)
Frontend → Gateway (8080) → Backend (3000)
├── CORS centralizado en gateway
├── Logging unificado
├── Frontend solo conoce gateway
├── Punto único para auth, rate limiting
└── Fácil agregar nuevos servicios
```

### 3.4 Decisiones Clave (ADRs)

#### ADR-001: TypeScript para Frontend y Backend
- **Contexto:** Necesitamos tipado fuerte para evitar errores
- **Decisión:** TypeScript en ambos lados
- **Consecuencias:** Compartimos interfaces DTO, mejor DX

#### ADR-002: PostgreSQL como Base de Datos
- **Contexto:** Datos relacionales (quotes, properties, coverages)
- **Decisión:** PostgreSQL 15
- **Alternativas:** MongoDB (rechazado: joins complejos)
- **Consecuencias:** ACID, joins, transacciones

#### ADR-003: TypeORM sobre Prisma
- **Contexto:** ORM para arquitectura hexagonal
- **Decisión:** TypeORM (mejor soporte para arquitectura limpia)
- **Consecuencias:** Decoradores, migraciones automáticas

#### ADR-004: React + Vite sobre Next.js
- **Contexto:** SPA interactiva con wizard
- **Decisión:** React 19 + Vite
- **Alternativas:** Next.js (rechazado: no necesitamos SSR)
- **Consecuencias:** Fast HMR, bundle optimizado

#### ADR-005: Tailwind CSS sobre Material-UI
- **Contexto:** Diseño custom institucional dorado/negro
- **Decisión:** Tailwind CSS
- **Consecuencias:** CSS personalizado, bundle más pequeño

---

## 4. LISTA DE TAREAS - Documentación

### Fase 1: README Individual de Servicios

#### 4.1 README ms-core (backend)
Ubicación: `ms-core/README.md`

Contenido:
- [ ] Título y descripción
- [ ] Stack tecnológico (NestJS, TypeScript, TypeORM, PostgreSQL)
- [ ] Arquitectura Hexagonal (explicación breve)
- [ ] Instalación y configuración
- [ ] Variables de entorno (.env)
- [ ] Comandos disponibles (npm run start:dev, npm run test, npm run build)
- [ ] Estructura de carpetas
- [ ] Endpoints API principales
- [ ] Testing
- [ ] Docker

#### 4.2 README ms-gateway
Ubicación: `ms-gateway/README.md`

Contenido:
- [ ] Título y descripción
- [ ] Stack tecnológico (Spring Cloud Gateway, WebFlux)
- [ ] Propósito (enrutamiento, CORS, logging)
- [ ] Instalación (Maven)
- [ ] Configuración (application.yml)
- [ ] Comandos (mvn spring-boot:run, mvn clean package)
- [ ] Rutas configuradas
- [ ] Health checks
- [ ] Docker

#### 4.3 README frontend
Ubicación: `frontend/README.md`

Contenido:
- [ ] Título y descripción
- [ ] Stack tecnológico (React 19, TypeScript, Tailwind, Vite)
- [ ] Instalación y configuración
- [ ] Variables de entorno (.env)
- [ ] Comandos (npm run dev, npm run build, npm run preview)
- [ ] Estructura de carpetas
- [ ] Wizard de 6 pasos
- [ ] Testing
- [ ] Docker

### Fase 2: README General del Proyecto

Ubicación: `README.md` (raíz)

Contenido:
- [ ] Título y descripción del proyecto
- [ ] Arquitectura general (diagrama C4)
- [ ] Stack tecnológico completo
- [ ] Requisitos previos (Node, Java, Docker)
- [ ] Quick Start (docker-compose up)
- [ ] Estructura de monorepo
- [ ] Comandos por servicio
- [ ] Enlaces a READMEs específicos
- [ ] Contribución
- [ ] Licencia

### Fase 3: Diagramas C4

- [ ] Crear `docs/diagrams/c4-context.puml` (PlantUML)
- [ ] Crear `docs/diagrams/c4-containers.puml`
- [ ] Crear `docs/diagrams/c4-components.puml`
- [ ] Exportar como PNG/SVG
- [ ] Incluir en READMEs

### Fase 4: ADRs (Architecture Decision Records)

Ubicación: `docs/adr/`

- [ ] ADR-001: TypeScript
- [ ] ADR-002: PostgreSQL
- [ ] ADR-003: TypeORM
- [ ] ADR-004: React + Vite
- [R] ADR-005: Tailwind CSS
- [ ] ADR-006: API Gateway
- [ ] ADR-007: Hexagonal Architecture

---

## 5. CONTENIDO DE LOS README

### 5.1 README ms-core

```markdown
# ms-core - Backend API SeguraX

Microservicio backend para Cotizador SeguraX. Maneja cotizaciones, 
propiedades, coberturas y cálculo de primas.

## Stack

- **Framework:** NestJS 10
- **Lenguaje:** TypeScript 5
- **ORM:** TypeORM 0.3
- **Base de datos:** PostgreSQL 15
- **Arquitectura:** Hexagonal (Ports & Adapters)
- **Testing:** Jest + ts-jest

## Arquitectura

```
src/
├── domain/          # Entidades, enums, value objects (sin dependencias)
├── application/     # Use cases, DTOs, ports (solo depende de domain)
├── infrastructure/# Repositories, mappers, TypeORM entities
├── presentation/    # Controllers, DTOs HTTP, exception filters
└── common/          # Utilidades, logger
```

## Instalación

```bash
npm install
cp .env.example .env
# Editar .env con credenciales PostgreSQL
npm run migration:run
npm run seed:run  # Opcional: datos de ejemplo
```

## Comandos

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod

# Testing
npm run test
npm run test:cov

# Migraciones
npm run migration:generate -- -n NombreMigration
npm run migration:run
npm run migration:revert
```

## Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| DB_HOST | Host PostgreSQL | localhost |
| DB_PORT | Puerto | 5432 |
| DB_NAME | Nombre BD | segurax |
| DB_USER | Usuario | postgres |
| DB_PASS | Contraseña | secret |
| PORT | Puerto API | 3000 |

## API Endpoints

### Cotizaciones
- `GET /api/v1/quotes` - Listar
- `POST /api/v1/quotes` - Crear
- `GET /api/v1/quotes/:id` - Obtener
- `PATCH /api/v1/quotes/:id` - Actualizar

### Propiedades
- `GET /api/v1/quotes/:id/properties` - Listar
- `POST /api/v1/properties/bulk` - Crear múltiples
- `PATCH /api/v1/properties/:id` - Actualizar

### Coberturas
- `GET /api/v1/coverages` - Listar disponibles
- `PATCH /api/v1/quotes/:id/coverages` - Actualizar selección

## Docker

```bash
docker build -t ms-core .
docker run -p 3000:3000 --env-file .env ms-core
```

## Testing

```bash
# Unit tests
npm run test

# Coverage
npm run test:cov

# E2E
npm run test:e2e
```
```

### 5.2 README ms-gateway

```markdown
# ms-gateway - API Gateway SeguraX

API Gateway para Cotizador SeguraX. Enruta peticiones al backend,
centraliza CORS y logging.

## Stack

- **Framework:** Spring Cloud Gateway (WebFlux)
- **Lenguaje:** Java 17
- **Build:** Maven 3.9+
- **Spring Boot:** 3.2.0
- **Spring Cloud:** 2023.0.0

## Propósito

- **Enrutamiento:** `/api/v1/**` → ms-core
- **CORS:** Configuración centralizada
- **Logging:** Request/Response con duration
- **Health Checks:** Actuator endpoints

## Instalación

```bash
mvn clean package
```

## Comandos

```bash
# Desarrollo
mvn spring-boot:run

# Producción
mvn clean package -DskipTests
java -jar target/ms-gateway-*.jar

# Testing
mvn test
```

## Configuración

### application.yml
```yaml
server:
  port: 8080

spring:
  cloud:
    gateway:
      routes:
        - id: ms-core
          uri: http://localhost:3000
          predicates:
            - Path=/api/v1/**
        - id: ms-frontend
          uri: http://localhost:5173
          predicates:
            - Path=/**
```

## Variables de Entorno

| Variable | Descripción | Default |
|----------|-------------|---------|
| SERVER_PORT | Puerto gateway | 8080 |
| CORE_URL | URL backend | http://localhost:3000 |
| FRONTEND_URL | URL frontend | http://localhost:5173 |

## Health Checks

- `GET /actuator/health` - Estado del gateway
- `GET /actuator/gateway/routes` - Rutas configuradas
- `GET /actuator/info` - Información del servicio

## Docker

```bash
docker build -t ms-gateway .
docker run -p 8080:8080 ms-gateway
```

## Rutas Configuradas

| Ruta Gateway | Destino | Servicio |
|--------------|---------|----------|
| `/api/v1/**` | `http://localhost:3000` | ms-core |
| `/**` | `http://localhost:5173` | frontend |

## Logging

El gateway loguea todas las peticiones:
```
[REQUEST] [uuid] GET /api/v1/quotes
[RESPONSE] [uuid] GET /api/v1/quotes - 150ms - Status 200
```
```

### 5.3 README Frontend

```markdown
# SeguraX Frontend

Aplicación React para Cotizador SeguraX. Wizard de 6 pasos para 
crear cotizaciones de seguros de daños.

## Stack

- **Framework:** React 19
- **Lenguaje:** TypeScript 5
- **Estilos:** Tailwind CSS
- **Build Tool:** Vite 6
- **HTTP Client:** Fetch API
- **Estado:** Zustand / React Context

## Características

- 🧙‍♂️ Wizard de 6 pasos
- 🏢 Captura datos de empresa
- 📍 Selección de ubicaciones
- 🏠 Formularios dinámicos de propiedades
- ☂️ Selección de coberturas
- 📄 Generación de resumen/PDF

## Instalación

```bash
npm install
cp .env.example .env
```

## Comandos

```bash
# Desarrollo
npm run dev

# Build producción
npm run build

# Preview producción
npm run preview

# Lint
npm run lint
```

## Variables de Entorno

```env
VITE_API_URL=http://localhost:8080/api/v1
```

## Estructura

```
src/
├── components/      # Componentes reutilizables
├── pages/           # Páginas del wizard
├── hooks/           # Custom hooks
├── services/        # API calls
├── store/           # Estado (Zustand)
├── types/           # TypeScript types
└── utils/           # Utilidades
```

## Wizard

1. **Datos Generales** - Empresa, RFC, giro
2. **Ubicaciones** - Cantidad de inmuebles
3. **Propiedades** - Dirección, construcción, valores
4. **Coberturas** - Selección de coberturas
5. **Resumen** - Confirmación
6. **Éxito** - PDF y envío

## Docker

```bash
docker build -t frontend .
docker run -p 5173:80 frontend
```

## Testing

```bash
# Unit tests (si existen)
npm run test
```

## Estilos

- Paleta: Dorado (#D4AF37) y Negro (#1F2937)
- Framework: Tailwind CSS
- Componentes: Custom con Tailwind
```

### 5.4 README General (Raíz)

```markdown
# Cotizador SeguraX

Sistema de cotización de seguros de daños para empresas.
Permite a agentes crear cotizaciones personalizadas con múltiples 
ubicaciones y coberturas.

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENTE                            │
│                   (Navegador Web)                        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   FRONTEND                               │
│              React + TypeScript + Vite                 │
│                   Puerto: 5173                          │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  API GATEWAY                             │
│           Spring Cloud Gateway (WebFlux)                 │
│                   Puerto: 8080                          │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   BACKEND                                │
│       NestJS + TypeScript + TypeORM + PostgreSQL       │
│                   Puerto: 3000                          │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                BASE DE DATOS                             │
│                   PostgreSQL 15                          │
│                   Puerto: 5432                            │
└─────────────────────────────────────────────────────────┘
```

## 📋 Stack Tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Frontend | React + Vite | 19 + 6 |
| Gateway | Spring Cloud Gateway | 2023.0.0 |
| Backend | NestJS + TypeORM | 10 + 0.3 |
| Base de Datos | PostgreSQL | 15 |
| Contenedores | Docker + Docker Compose | 24+ |

## 🚀 Quick Start

### Requisitos
- Node.js 20+
- Java 17+
- Maven 3.9+
- Docker 24+ (opcional)

### Opción 1: Docker Compose (Recomendado)

```bash
# Clonar repositorio
git clone <repo>
cd cotizador

# Iniciar todos los servicios
docker-compose up -d

# Frontend: http://localhost:5173
# Gateway: http://localhost:8080
```

### Opción 2: Desarrollo Local

```bash
# Terminal 1: Database
docker run -d -p 5432:5432 -e POSTGRES_DB=segurax \
  -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=secret \
  postgres:15

# Terminal 2: Backend
cd ms-core
npm install
npm run start:dev

# Terminal 3: Gateway
cd ms-gateway
mvn spring-boot:run

# Terminal 4: Frontend
cd frontend
npm install
npm run dev
```

## 📁 Estructura del Proyecto

```
cotizador/
├── ms-core/              # Backend (NestJS)
├── ms-gateway/           # API Gateway (Spring)
├── frontend/             # Frontend (React)
├── docker-compose.yml    # Orquestación Docker
└── .github/
    └── specs/            # Especificaciones ASDD
```

## 📚 Documentación

- [README ms-core](./ms-core/README.md)
- [README ms-gateway](./ms-gateway/README.md)
- [README frontend](./frontend/README.md)
- [Arquitectura](./docs/architecture.md)
- [Decisiones (ADRs)](./docs/adr/)

## 🧪 Testing

```bash
# Backend
cd ms-core && npm run test:cov

# Gateway
cd ms-gateway && mvn test

# Frontend
cd frontend && npm run test
```

## 🤝 Contribución

1. Crear rama: `git checkout -b feature/nueva-funcionalidad`
2. Commits: Seguir [Conventional Commits](https://www.conventionalcommits.org/)
3. Pull Request: Incluir tests y documentación
4. Review: Mínimo 1 aprobación

## 📄 Licencia

MIT License - Ver [LICENSE](./LICENSE)
```

---

## 6. DIAGRAMAS C4 (PlantUML)

### 6.1 Context Diagram

```plantuml
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Context.puml

LAYOUT_WITH_LEGEND()

Person(agente, "Agente Seguros", "Crea cotizaciones para clientes")
Person(admin, "Administrador", "Gestiona usuarios y configuración")

System(cotizador, "Cotizador SeguraX", "Sistema de cotización de seguros de daños")

System_Ext(email, "Servicio Email", "Envío de cotizaciones")
System_Ext(pdf, "Generador PDF", "Generación de pólizas")

Rel(agente, cotizador, "Crea y gestiona cotizaciones", "HTTPS")
Rel(admin, cotizador, "Administración", "HTTPS")
Rel(cotizador, email, "Envía cotizaciones", "SMTP/HTTPS")
Rel(cotizador, pdf, "Genera documentos", "HTTP/REST")

@enduml
```

### 6.2 Container Diagram

```plantuml
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml

LAYOUT_WITH_LEGEND()

Person(agente, "Agente")

System_Boundary(cotizador, "Cotizador SeguraX") {
    Container(frontend, "Frontend", "React + TypeScript", "Interfaz de usuario, wizard de cotización")
    Container(gateway, "API Gateway", "Spring Cloud Gateway", "Enrutamiento, CORS, logging")
    Container(backend, "Backend", "NestJS + TypeORM", "Lógica de negocio, cálculo de primas")
    ContainerDb(db, "Database", "PostgreSQL", "Cotizaciones, propiedades, coberturas")
}

System_Ext(email, "Email Service")

Rel(agente, frontend, "Usa", "HTTPS")
Rel(frontend, gateway, "API calls", "HTTP/REST")
Rel(gateway, backend, "Enruta", "HTTP/REST")
Rel(backend, db, "Lee/Escribe", "PostgreSQL")
Rel(backend, email, "Envía emails", "SMTP")

@enduml
```

---

## 7. CHECKLIST

### Documentación Servicios
- [ ] Crear `ms-core/README.md`
- [ ] Crear `ms-gateway/README.md`
- [ ] Crear `frontend/README.md`
- [ ] Actualizar `README.md` raíz

### Diagramas
- [ ] Crear `docs/diagrams/c4-context.puml`
- [ ] Crear `docs/diagrams/c4-containers.puml`
- [ ] Crear `docs/diagrams/c4-components.puml`
- [ ] Generar PNGs

### ADRs
- [ ] Crear `docs/adr/ADR-001-typescript.md`
- [ ] Crear `docs/adr/ADR-002-postgresql.md`
- [ ] Crear `docs/adr/ADR-003-typeorm.md`
- [ ] Crear `docs/adr/ADR-004-react-vite.md`
- [ ] Crear `docs/adr/ADR-005-tailwind.md`
- [ ] Crear `docs/adr/ADR-006-gateway.md`
- [ ] Crear `docs/adr/ADR-007-hexagonal.md`

### Docker Compose
- [ ] Crear/actualizar `docker-compose.yml` en raíz
- [ ] Incluir: PostgreSQL, ms-core, ms-gateway, frontend
- [ ] Health checks
- [ ] Volúmenes persistentes

---

*Fin de la especificación*
