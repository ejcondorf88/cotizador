---
id: SPEC-021
status: IMPLEMENTED
feature: microservicio-catalogos-ncapas
created: 2026-04-21
updated: 2026-04-21
author: spec-generator
version: "1.0"
related-specs: []
---

# SPEC-021: Microservicio de Catálogos - Arquitectura N-Capas

## 1. REQUERIMIENTOS

### 1.1 Contexto y Motivación

Actualmente el sistema tiene datos mock/hardcodeados en:

**Backend (ms-core):**
- `GET /activities/search` - Array hardcodeado de actividades SAT (líneas 164-175)
- Campos de Quote: `agentKey`, `subscriber`, `office` - strings libres sin validación

**Frontend:**
- Selectores de agente sin catálogo real
- Selectores de oficina sin catálogo real
- Búsqueda de giro usando datos hardcodeados

**Datos mock existentes:**
```typescript
// property.controller.ts (líneas 164-175)
const activities = [
  { code: '461110', description: 'Comercio al por mayor de abarrotes' },
  { code: '461121', description: 'Comercio al por mayor de bebidas' },
  // ... 10 actividades hardcodeadas
];
```

Estos catálogos deben persistir en base de datos real para:
- Eliminar datos hardcodeados
- Validar referencias (ej: agentKey debe existir en catálogo)
- Permitir mantenimiento por administradores
- Escalabilidad y consistencia de datos

### 1.2 Alcance (MVP - Fase 1)

**Catálogos a implementar (prioridad):**
1. **Giros/Actividades** - Reemplazar mock de `activities/search`
2. **Agentes** - Validar `agentKey` en Quote
3. **Suscriptores** - Validar `subscriber` en Quote
4. **Oficinas** - Validar `office` en Quote

**FUERA DE ALCANCE (futuras fases):**
- Códigos postales (CP) - usará integración SEPOMEX directa
- Estados - se mantienen hardcodeados por ahora

### 1.2 Historias de Usuario

**HU-1: Como administrador, quiero gestionar agentes de seguros**
- Criterio: CRUD completo de agentes (código, nombre, email, teléfono, oficina, estado activo/inactivo)
- Criterio: Búsqueda por código o nombre
- Criterio: Filtro por oficina y estado

**HU-2: Como administrador, quiero gestionar oficinas/regiones**
- Criterio: CRUD de oficinas (código, nombre, dirección, ciudad, estado, CP)
- Criterio: Jerarquía regional (región → zona → oficina)
- Criterio: Asociar agentes a oficinas

**HU-3: Como administrador, quiero gestionar giros de negocio**
- Criterio: CRUD de giros (clave, descripción, sector, categoría, riesgo)
- Criterio: Relación con actividades económicas (SAT)
- Criterio: Clasificación por nivel de riesgo

**HU-4: Como usuario del cotizador, quiero seleccionar agente desde catálogo**
- Criterio: Búsqueda autocomplete de agentes
- Criterio: Filtrar solo agentes activos
- Criterio: Precargar datos del agente seleccionado

**HU-5: Como usuario del cotizador, quiero buscar giro por actividad**
- Criterio: Búsqueda por descripción o clave
- Criterio: Autocomplete con mínimo 3 caracteres
- Criterio: Reemplazar el mock actual de activities
- Criterio: Mostrar descripción + clave del SAT

**HU-6: Como usuario del cotizador, quiero validar suscriptor**
- Criterio: Buscar suscriptor por código o nombre
- Criterio: Autocomplete desde catálogo real
- Criterio: Validar que exista en el sistema

**HU-7: Como usuario del cotizador, quiero seleccionar oficina**
- Criterio: Dropdown de oficinas activas
- Criterio: Relacionar agente con oficina
- Criterio: Filtrar por estado/región

### 1.3 Catálogos Requeridos (MVP)

| Catálogo | Campos Principales | Reemplaza | Prioridad |
|----------|-------------------|-----------|-----------|
| **Giros** | clave, descripción, sector, riesgo | Mock `activities/search` | ALTA |
| **Agentes** | código, nombre, email, teléfono, oficina_id | Campo libre `agentKey` | ALTA |
| **Suscriptores** | código, nombre, tipo | Campo libre `subscriber` | MEDIA |
| **Oficinas** | código, nombre, ciudad, estado_id | Campo libre `office` | MEDIA |

### 1.4 Fases de Implementación

**Fase 1 (MVP):**
- Giros (reemplaza mock de activities)
- Agentes (reemplaza agentKey libre)
- Suscriptores (reemplaza subscriber libre)
- Oficinas (reemplaza office libre)

**Fase 2 (Futuro):**
- Códigos postales (CP)
- Estados/Provincias
- Ciudades/Municipios

### 1.4 Reglas de Negocio

**RN-1: Integridad Referencial**
- Un agente debe estar asociado a una oficina activa
- Un giro debe tener clave válida
- Suscriptor debe existir en catálogo

**RN-2: Estados de Registros**
- Todos los catálogos tienen campo `activo` (boolean)
- Solo registros activos son visibles en el cotizador
- Eliminación lógica, no física

**RN-3: Cacheo Frontend**
- Catálogos estáticos (giros, agentes) cacheados en localStorage
- TTL de 24 horas para catálogos grandes
- Invalidación manual disponible

**RN-4: Búsqueda Optimizada**
- Índices de texto completo en descripciones
- Búsqueda case-insensitive
- Soporte para acentos y caracteres especiales

---

## 2. DISEÑO

### 2.1 Arquitectura N-Capas

```
┌─────────────────────────────────────────────────────────────┐
│                    API GATEWAY (8080)                       │
│         /api/v1/catalogos/* → ms-catalogos:3001             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              MS-CATALOGOS (Puerto 3001)                     │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐   │
│  │ Controller  │→│   Service   │→│    Repository       │   │
│  │   Layer     │  │   Layer    │  │      Layer          │   │
│  └─────────────┘  └─────────────┘  └─────────────────────┘   │
│         │                │                   │              │
│         ▼                ▼                   ▼              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐   │
│  │   DTOs      │  │   Entities  │  │   TypeORM Entities │   │
│  │ Validation  │  │   Domain    │  │   (catalog schema)  │   │
│  └─────────────┘  └─────────────┘  └─────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              POSTGRESQL (Schema: catalog)                 │
│   ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │
│   │  giros   │ │ agentes   │ │suscriptores│ │  oficinas   │  │
│   └──────────┘ └──────────┘ └──────────┘ └──────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Nota:** Códigos postales (CP) y Estados quedan FUERA de alcance para Fase 1.
Se usarán integraciones externas o datos hardcodeados por ahora.

### 2.2 Modelo de Datos (Database Schema)

#### Schema: catalog

```sql
-- Estados/Provincias
CREATE TABLE catalog.estados (
    id SERIAL PRIMARY KEY,
    clave VARCHAR(3) UNIQUE NOT NULL, -- 'BC', 'CDMX', etc.
    nombre VARCHAR(50) NOT NULL,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Oficinas
CREATE TABLE catalog.oficinas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    direccion VARCHAR(200),
    ciudad VARCHAR(100),
    estado_id INTEGER REFERENCES catalog.estados(id),
    codigo_postal VARCHAR(5),
    telefono VARCHAR(20),
    email VARCHAR(100),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Agentes
CREATE TABLE catalog.agentes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    email VARCHAR(100),
    telefono VARCHAR(20),
    oficina_id UUID REFERENCES catalog.oficinas(id),
    suscriptor_codigo VARCHAR(20), -- código del suscriptor asociado
    comision_porcentaje DECIMAL(5,2) DEFAULT 0,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Giros de negocio / Actividades económicas
CREATE TABLE catalog.giros (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clave_giro VARCHAR(20) UNIQUE NOT NULL, -- clave interna
    clave_sat VARCHAR(10) NOT NULL, -- clave del catálogo SAT
    descripcion TEXT NOT NULL,
    sector VARCHAR(100),
    categoria_riesgo VARCHAR(20) DEFAULT 'MEDIO', -- 'BAJO', 'MEDIO', 'ALTO', 'MUY_ALTO'
    tasa_base DECIMAL(8,4) DEFAULT 0.0000,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Códigos Postales
CREATE TABLE catalog.codigos_postales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cp VARCHAR(5) NOT NULL,
    colonia VARCHAR(100) NOT NULL,
    ciudad VARCHAR(100),
    municipio VARCHAR(100),
    estado_id INTEGER REFERENCES catalog.estados(id),
    tipo_asentamiento VARCHAR(50), -- 'Colonia', 'Fraccionamiento', etc.
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(cp, colonia)
);

-- Índices para búsqueda
CREATE INDEX idx_agentes_codigo ON catalog.agentes(codigo) WHERE activo = true;
CREATE INDEX idx_agentes_nombre ON catalog.agentes USING gin(to_tsvector('spanish', nombre)) WHERE activo = true;
CREATE INDEX idx_agentes_oficina ON catalog.agentes(oficina_id) WHERE activo = true;

CREATE INDEX idx_oficinas_codigo ON catalog.oficinas(codigo) WHERE activo = true;

CREATE INDEX idx_giros_clave ON catalog.giros(clave_giro) WHERE activo = true;
CREATE INDEX idx_giros_descripcion ON catalog.giros USING gin(to_tsvector('spanish', descripcion)) WHERE activo = true;
CREATE INDEX idx_giros_sat ON catalog.giros(clave_sat);

CREATE INDEX idx_cp_codigo ON catalog.codigos_postales(cp);
CREATE INDEX idx_cp_colonia ON catalog.codigos_postales USING gin(to_tsvector('spanish', colonia));
```

### 2.3 Estructura del Proyecto (N-Capas)

```
ms-catalogos/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── config/
│   │   ├── database.config.ts
│   │   └── swagger.config.ts
│   ├── common/
│   │   ├── dto/
│   │   │   ├── pagination.dto.ts
│   │   │   └── search.dto.ts
│   │   ├── entities/
│   │   │   └── base.entity.ts
│   │   └── exceptions/
│   │       └── catalog.exception.ts
│   ├── catalog/
│   │   ├── catalog.module.ts
│   │   ├── controllers/
│   │   │   ├── agentes.controller.ts
│   │   │   ├── oficinas.controller.ts
│   │   │   ├── giros.controller.ts
│   │   │   ├── codigos-postales.controller.ts
│   │   │   └── health.controller.ts
│   │   ├── services/
│   │   │   ├── agentes.service.ts
│   │   │   ├── oficinas.service.ts
│   │   │   ├── giros.service.ts
│   │   │   ├── codigos-postales.service.ts
│   │   │   └── cache.service.ts
│   │   ├── repositories/
│   │   │   ├── agentes.repository.ts
│   │   │   ├── oficinas.repository.ts
│   │   │   ├── giros.repository.ts
│   │   │   └── codigos-postales.repository.ts
│   │   ├── entities/
│   │   │   ├── agente.entity.ts
│   │   │   ├── oficina.entity.ts
│   │   │   ├── giro.entity.ts
│   │   │   ├── codigo-postal.entity.ts
│   │   │   └── estado.entity.ts
│   │   ├── dto/
│   │   │   ├── create-agente.dto.ts
│   │   │   ├── update-agente.dto.ts
│   │   │   ├── agente-response.dto.ts
│   │   │   ├── create-oficina.dto.ts
│   │   │   ├── create-giro.dto.ts
│   │   │   ├── search-giro.dto.ts
│   │   │   ├── cp-validation.dto.ts
│   │   │   └── paginated-response.dto.ts
│   │   └── interfaces/
│   │       └── catalog-repository.interface.ts
│   └── database/
│       ├── database.module.ts
│       └── migrations/
├── test/
│   ├── unit/
│   └── integration/
├── Dockerfile
├── docker-compose.yml
├── package.json
├── tsconfig.json
└── README.md
```

### 2.4 API Endpoints

#### Agentes
```
GET    /api/v1/catalogos/agentes              # Listar (paginado, con filtros)
GET    /api/v1/catalogos/agentes/:id           # Obtener por ID
GET    /api/v1/catalogos/agentes/buscar?q=     # Buscar por código/nombre
GET    /api/v1/catalogos/agentes/oficina/:id  # Por oficina
POST   /api/v1/catalogos/agentes              # Crear
PUT    /api/v1/catalogos/agentes/:id           # Actualizar
DELETE /api/v1/catalogos/agentes/:id           # Eliminar lógico
```

#### Oficinas
```
GET    /api/v1/catalogos/oficinas
GET    /api/v1/catalogos/oficinas/:id
GET    /api/v1/catalogos/oficinas/estado/:estadoId
POST   /api/v1/catalogos/oficinas
PUT    /api/v1/catalogos/oficinas/:id
DELETE /api/v1/catalogos/oficinas/:id
```

#### Giros
```
GET    /api/v1/catalogos/giros
GET    /api/v1/catalogos/giros/:id
GET    /api/v1/catalogos/giros/buscar?q=      # Búsqueda texto completo
GET    /api/v1/catalogos/giros/riesgo/:nivel  # Por nivel de riesgo
POST   /api/v1/catalogos/giros
PUT    /api/v1/catalogos/giros/:id
DELETE /api/v1/catalogos/giros/:id
```

#### Códigos Postales
```
GET    /api/v1/catalogos/codigos-postales/:cp                    # Obtener por CP
GET    /api/v1/catalogos/codigos-postales/:cp/validar            # Validar CP
GET    /api/v1/catalogos/codigos-postales/buscar?q=              # Buscar colonias
POST   /api/v1/catalogos/codigos-postales                        # Crear (admin)
```

### 2.5 DTOs (Data Transfer Objects)

#### CreateAgenteDto
```typescript
export class CreateAgenteDto {
  @IsString()
  @Length(3, 20)
  codigo: string;

  @IsString()
  @Length(3, 150)
  nombre: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsUUID()
  oficinaId: string;

  @IsString()
  @IsOptional()
  suscriptorCodigo?: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  comisionPorcentaje?: number;
}
```

#### SearchGirosDto
```typescript
export class SearchGirosDto {
  @IsString()
  @MinLength(3)
  query: string;

  @IsEnum(['BAJO', 'MEDIO', 'ALTO', 'MUY_ALTO'])
  @IsOptional()
  riesgo?: string;

  @IsNumber()
  @IsOptional()
  limit?: number = 20;
}
```

### 2.6 Configuración Gateway

#### application.yml (ms-gateway)
```yaml
spring:
  cloud:
    gateway:
      routes:
        # Route to ms-catalogos
        - id: ms-catalogos
          uri: http://localhost:3001
          predicates:
            - Path=/api/v1/catalogos/**
          filters:
            - StripPrefix=2  # /api/v1/catalogos → /
            - name: CircuitBreaker
              args:
                name: ms-catalogos-cb
                fallbackUri: forward:/fallback/catalogos
```

### 2.7 Frontend Integration

#### Service Layer (frontend)
```typescript
// src/services/catalogoService.ts
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

export const catalogoService = {
  // Agentes
  searchAgentes: (query: string) => 
    axios.get(`${API_BASE}/catalogos/agentes/buscar?q=${query}`),
  
  getAgenteById: (id: string) => 
    axios.get(`${API_BASE}/catalogos/agentes/${id}`),
  
  // Giros
  searchGiros: (query: string, limit = 20) => 
    axios.get(`${API_BASE}/catalogos/giros/buscar?q=${query}&limit=${limit}`),
  
  // CP
  validarCP: (cp: string) => 
    axios.get(`${API_BASE}/codigos-postales/${cp}/validar`),
  
  getColoniasByCP: (cp: string) => 
    axios.get(`${API_BASE}/codigos-postales/${cp}`),
};
```

#### Hook (frontend)
```typescript
// src/hooks/useCatalogos.ts
export function useAgentesSearch() {
  return useQuery({
    queryKey: ['agentes'],
    queryFn: () => catalogoService.searchAgentes(''),
    staleTime: 1000 * 60 * 5, // 5 min
  });
}

export function useGirosAutocomplete(query: string) {
  return useQuery({
    queryKey: ['giros', query],
    queryFn: () => catalogoService.searchGiros(query),
    enabled: query.length >= 3,
    staleTime: 1000 * 60 * 60 * 24, // 24h cache
  });
}
```

### 2.8 Endpoints a Reemplazar (Mock → Real)

| Endpoint Actual (Mock) | Nuevo Endpoint (Real) | Ubicación |
|------------------------|----------------------|-----------|
| `GET /cp/:cp/validate` | `GET /catalogos/codigos-postales/:cp/validar` | ms-catalogos |
| `GET /activities/search` | `GET /catalogos/giros/buscar` | ms-catalogos |
| Frontend hardcoded agentes | `GET /catalogos/agentes/buscar` | ms-catalogos |

---

## 3. LISTA DE TAREAS

### Fase 1: Database
- [ ] Crear schema "catalog" en PostgreSQL
- [ ] Crear tablas: giros, agentes, suscriptores, oficinas
- [ ] Agregar índices de búsqueda
- [ ] Crear seeders con datos iniciales (giros base, agentes de ejemplo)

### Fase 2: Backend (ms-catalogos)
- [ ] Inicializar proyecto NestJS en puerto 3001
- [ ] Configurar conexión a DB (schema catalog)
- [ ] Crear módulo CatalogModule
- [ ] **Controllers:**
  - [ ] GirosController (reemplaza mock de activities)
  - [ ] AgentesController
  - [ ] SuscriptoresController  
  - [ ] OficinasController
- [ ] **Services:**
  - [ ] GirosService (CRUD + búsqueda FTS)
  - [ ] AgentesService (búsqueda autocomplete)
  - [ ] SuscriptoresService
  - [ ] OficinasService
- [ ] **Repositories:**
  - [ ] Implementar con TypeORM
  - [ ] Métodos de búsqueda personalizados
- [ ] **Entities:**
  - [ ] TypeORM entities para cada catálogo
- [ ] **DTOs:**
  - [ ] Create/Update DTOs con validación class-validator
  - [ ] Response DTOs
- [ ] Documentación Swagger/OpenAPI
- [ ] Tests unitarios (Jest)

### Fase 3: Gateway
- [ ] Agregar ruta /catalogos/** en application.yml
- [ ] Configurar StripPrefix y CircuitBreaker
- [ ] Probar enrutamiento

### Fase 4: Frontend
- [ ] Crear catalogoService.ts
- [ ] Crear hooks useCatalogos.ts
- [ ] **Reemplazar mocks existentes:**
  - [ ] `GET /activities/search` hardcodeado → `GET /catalogos/giros/buscar`
  - [ ] Campo libre `agentKey` → Autocomplete con `/catalogos/agentes/buscar`
  - [ ] Campo libre `subscriber` → Autocomplete con `/catalogos/suscriptores/buscar`
  - [ ] Campo libre `office` → Dropdown con `/catalogos/oficinas`
- [ ] **Wizard de cotización (Step 2: Conducción):**
  - [ ] Campo "Agente": usar autocomplete con buscarAgentes
  - [ ] Campo "Suscriptor": usar autocomplete con buscarSuscriptores
  - [ ] Campo "Oficina": dropdown desde catálogo
- [ ] Cache en localStorage para catálogos estáticos

### Fase 5: Data Migration
- [ ] Script para cargar giros desde CSV/Excel del SAT
- [ ] Script para cargar agentes de ejemplo
- [ ] Validar integridad de datos

### Fase 6: QA
- [ ] Pruebas de búsqueda (performance)
- [ ] Pruebas de integridad referencial
- [ ] Pruebas de cache frontend
- [ ] Pruebas de integración frontend-backend

---

## 4. CRITERIOS DE ACEPTACIÓN

### Backend
1. [ ] Todos los endpoints responden en < 200ms (con índices)
2. [ ] Búsqueda de giros funciona con mínimo 3 caracteres
3. [ ] Búsqueda de agentes funciona con autocomplete
4. [ ] Solo registros activos visibles en el cotizador
5. [ ] Gateway enruta correctamente /catalogos/** → ms-catalogos:3001
6. [ ] Datos persisten correctamente en schema "catalog"

### Frontend
7. [ ] Reemplaza mock de activities hardcodeado
8. [ ] Reemplaza campos libres (agentKey, subscriber, office) por selects desde catálogo
9. [ ] Cacheo frontend reduce llamadas al backend
10. [ ] Autocomplete funciona con mínimo 3 caracteres

---

## 5. NOTAS TÉCNICAS

### Performance
- Usar `SELECT` específicos, no `SELECT *`
- Implementar paginación (cursor-based para datasets grandes)
- Cache Redis para catálogos que raramente cambian (CP, estados)

### Seguridad
- Validar JWT en endpoints sensibles (crear/actualizar)
- Rate limiting en búsquedas (prevenir scraping)
- Sanitizar inputs de búsqueda (SQL injection)

### Escalabilidad
- Read replicas para búsquedas intensivas
- Sharding por región si necesario (futuro)

### Monitoreo
- Métricas: tiempo de respuesta, cache hit/miss, queries/segundo
- Alertas: errores > 5%, latencia > 500ms

---

## 6. DEPENDENCIAS

- NestJS 10.x
- TypeORM 0.3.x
- PostgreSQL 15+
- Redis (opcional, para cache)
- class-validator, class-transformer

---

## 7. IMPLEMENTACIÓN CON ASDD (OpenCode)

Este proyecto utiliza el framework ASDD (Agent Spec-Driven Development) de `.opencode/`.

### Flujo de Implementación

#### Paso 1 — Aprobar Spec
```bash
# Manual: Editar archivo y cambiar status
# .github/specs/microservicio-catalogos-ncapas.spec.md
# status: DRAFT → APPROVED
```

#### Paso 2 — Implementar Backend (Paralelo)
```bash
# Usar skill de implementación backend
/implement-backend microservicio-catalogos-ncapas
```

**Agente:** `backend-developer`  
**Skill:** `/implement-backend` desde `.opencode/skills/implement-backend/SKILL.md`

**Tareas del agente:**
- Crear schema "catalog" en PostgreSQL
- Implementar ms-catalogos con arquitectura N-Capas:
  - Controllers: agentes, oficinas, giros, suscriptores
  - Services: lógica de negocio
  - Repositories: acceso a datos con TypeORM
- Configurar conexión a BD (mismo PostgreSQL, schema diferente)
- Exponer endpoints REST documentados con Swagger

#### Paso 3 — Implementar Frontend (Paralelo)
```bash
# Usar skill de implementación frontend  
/implement-frontend microservicio-catalogos-ncapas
```

**Agente:** `frontend-developer`  
**Skill:** `/implement-frontend` desde `.opencode/skills/implement-frontend/SKILL.md`

**Tareas del agente:**
- Crear catalogoService.ts con integración a ms-catalogos
- Crear hooks useCatalogos.ts con React Query
- Reemplazar mocks existentes:
  - `GET /activities/search` → `GET /catalogos/giros/buscar`
  - Campo libre `agentKey` → Autocomplete con `/catalogos/agentes/buscar`
  - Campo libre `subscriber` → Autocomplete con `/catalogos/suscriptores/buscar`
  - Campo libre `office` → Dropdown con `/catalogos/oficinas`
- Implementar cache en localStorage
- Integrar en wizard de cotización (Step 2: Conducción)

#### Paso 4 — Configurar Gateway
```bash
# Usar skill de Spring Cloud Gateway
/asdd-spring-gateway microservicio-catalogos-ncapas
```

**Agente:** Usa skill `asdd-spring-gateway`  
**Skill:** `/asdd-spring-gateway` desde `.opencode/skills/asdd-spring-gateway/SKILL.md`

**Tareas:**
- Agregar ruta `/api/v1/catalogos/**` → `ms-catalogos:3001`
- Configurar StripPrefix y CircuitBreaker

#### Paso 5 — Generar Tests (Paralelo)
```bash
# Backend tests
/unit-testing microservicio-catalogos-ncapas backend

# Frontend tests  
/unit-testing microservicio-catalogos-ncapas frontend
```

**Agentes:** `test-engineer-backend`, `test-engineer-frontend`  
**Skill:** `/unit-testing` desde `.opencode/skills/unit-testing/SKILL.md`

#### Paso 6 — QA y Casos de Prueba
```bash
# Generar casos Gherkin
/gherkin-case-generator microservicio-catalogos-ncapas

# Identificar riesgos
/risk-identifier microservicio-catalogos-ncapas
```

**Agente:** `qa-agent`  
**Skills:** `.opencode/skills/gherkin-case-generator/`, `.opencode/skills/risk-identifier/`

#### Paso 7 — Documentación (Opcional)
```bash
# Si se requiere documentación adicional
/documentation-agent microservicio-catalogos-ncapas
```

---

## 8. PRÓXIMOS PASOS (Resumen)

1. Aprobar spec
2. Crear schema y tablas en PostgreSQL
3. Implementar ms-catalogos (CRUD básico)
4. Configurar Gateway
5. Integrar en frontend (reemplazar mocks)
6. Cargar datos iniciales
7. QA y performance tuning
