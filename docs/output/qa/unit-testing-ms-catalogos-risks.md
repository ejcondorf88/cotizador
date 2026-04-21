# Matriz de Riesgos - MS-Catalogos Tests Unitarios

> **SPEC**: SPEC-022 - Tests Unitarios - Microservicio de Catálogos (ms-catalogos)  
> **Stack**: NestJS + TypeORM + PostgreSQL + Jest + TestContainers  
> **Arquitectura**: N-Capas (Domain → Application → Infrastructure → Presentation)  
> **Generado**: 2026-04-21  
> **Feature**: unit-testing-ms-catalogos

---

## Resumen de Riesgos

| Nivel | Cantidad | Descripción |
|-------|----------|-------------|
| **ALTO (A)** | 6 | Testing OBLIGATORIO — bloquea el release |
| **MEDIO (S)** | 8 | Testing RECOMENDADO — documentar si se omite |
| **BAJO (D)** | 4 | Testing OPCIONAL — priorizar en el backlog |
| **TOTAL** | **18** | |

---

## Regla ASD (Alto-Suficiente-Deseable)

```
NIVEL ALTO (A) → Testing OBLIGATORIO — bloquea el release
NIVEL MEDIO (S) → Testing RECOMENDADO — documentar si se omite
NIVEL BAJO (D) → Testing OPCIONAL — priorizar en el backlog
```

---

## Detalle de Riesgos Identificados

| ID | HU | Capa | Descripción del Riesgo | Factores | Nivel | Testing |
|----|-----|------|------------------------|----------|-------|---------|
| **R-001** | HU-01 | Domain | Lógica de negocio en Entities sin cobertura | Complejidad, Sin historial | **A** | **Obligatorio** |
| **R-002** | HU-02 | Application | Orquestación de Use Cases con validaciones | Lógica compleja, Alta frecuencia | **A** | **Obligatorio** |
| **R-003** | HU-03 | Infrastructure | Integración PostgreSQL + TestContainers | Dependencias externas, Configuración | **A** | **Obligatorio** |
| **R-004** | HU-03 | Infrastructure | Mapeo ORM y queries personalizados | Lógica compleja, Sin historial | **A** | **Obligatorio** |
| **R-005** | HU-04 | Infrastructure | Conversión bidireccional Domain↔TypeORM | Alta frecuencia, Dependencias | **A** | **Obligatorio** |
| **R-006** | HU-06 | Presentation | Endpoints HTTP expuestos | Alta frecuencia, Integración total | **A** | **Obligatorio** |
| R-007 | HU-01 | Domain | Casos borde y valores nulos | Componentes con dependencias | S | Recomendado |
| R-008 | HU-02 | Application | Conflictos por duplicidad de códigos | Lógica compleja | S | Recomendado |
| R-009 | HU-02 | Application | Manejo de NotFoundException | Código nuevo sin historial | S | Recomendado |
| R-010 | HU-03 | Infrastructure | Soft delete y filtrado de activos | Lógica compleja | S | Recomendado |
| R-011 | HU-03 | Infrastructure | Paginación con grandes volúmenes | Lógica compleja | S | Recomendado |
| R-012 | HU-04 | Infrastructure | Manejo de valores opcionales null | Dependencias | S | Recomendado |
| R-013 | HU-05 | Application | Validaciones de DTOs con class-validator | Código nuevo sin historial | S | Recomendado |
| R-014 | HU-05 | Application | Validaciones de paginación | Componentes con dependencias | S | Recomendado |
| R-015 | HU-06 | Presentation | Status codes específicos | Código nuevo sin historial | S | Recomendado |
| D-001 | HU-01 | Domain | Propiedades calculadas (si existen) | Sin cambio de lógica | D | Opcional |
| D-002 | HU-05 | Application | Mensajes de error de validación | Ajustes estéticos | D | Opcional |
| D-003 | HU-06 | Presentation | Headers de respuesta HTTP | Sin impacto funcional | D | Opcional |
| D-004 | - | - | Performance de tests (>100ms) | Métrica de desarrollo | D | Opcional |

---

## Plan de Mitigación - Riesgos ALTO

### R-001: Lógica de negocio en Domain Entities sin cobertura

**Descripción**: Las entidades del dominio (Giro, Agente, Suscriptor, Oficina) contienen la lógica de negocio pura (create, update, deactivate, activate). Sin tests, errores en esta capa afectan toda la aplicación.

**Factores de Riesgo**:
- ✅ Complejidad: Lógica de negocio con invariantes
- ✅ Sin historial: Código nuevo sin métricas de confiabilidad
- ⚠️ Alta frecuencia: Métodos invocados en cada operación

**Mitigación**:
1. **Tests unitarios obligatorios** para cada método de entidad
2. Cobertura mínima: 90% en capa Domain
3. Validar invariantes: UUID generado, fechas automáticas, valores por defecto
4. Probar casos borde: valores nulos, strings vacíos

**Tests obligatorios**:
- [ ] `giro.entity.spec.ts` - create(), update(), deactivate(), activate()
- [ ] `agente.entity.spec.ts` - Campos opcionales (oficinaId, email)
- [ ] `suscriptor.entity.spec.ts` - Tipo opcional, validaciones
- [ ] `oficina.entity.spec.ts` - Ubicación opcional, código único

**Bloqueante para release**: ✅ **SÍ**

---

### R-002: Orquestación de Use Cases con validaciones

**Descripción**: Los casos de uso orquestan la lógica de negocio, validan duplicidad de códigos y manejan excepciones. Errores aquí pueden causar inconsistencias de datos.

**Factores de Riesgo**:
- ✅ Complejidad: Orquestación + validaciones + excepciones
- ✅ Alta frecuencia: Invocados por controllers en cada request
- ⚠️ Sin historial: Código nuevo

**Mitigación**:
1. **Tests unitarios con mocks** para cada Use Case
2. Mock de repositorios para aislar dependencias
3. Validar happy paths y error paths
4. Probar conflictos de duplicidad (código único)

**Tests obligatorios**:
- [ ] Create Use Cases - Éxito y conflicto
- [ ] Update Use Cases - NotFoundException
- [ ] Delete Use Cases - Soft delete
- [ ] Search Use Cases - Paginación, filtros
- [ ] Get Use Cases - Found y NotFound

**Bloqueante para release**: ✅ **SÍ**

---

### R-003: Integración PostgreSQL + TestContainers

**Descripción**: Los tests de infraestructura dependen de PostgreSQL real en contenedor Docker. Configuración incorrecta o problemas de TestContainers pueden causar falsos negativos o tests intermitentes.

**Factores de Riesgo**:
- ✅ Dependencias externas: Docker, PostgreSQL, TestContainers
- ✅ Configuración: Setup/teardown de contenedores
- ⚠️ Complejidad: Integración de múltiples tecnologías

**Mitigación**:
1. **Tests de integración con TestContainers** obligatorios
2. Configurar timeout adecuado (30s)
3. Asegurar cleanup entre tests (clear tables)
4. Manejo de errores de conexión

**Tests obligatorios**:
- [ ] `giro-repository.adapter.spec.ts` - CRUD completo con DB real
- [ ] `agente-repository.adapter.spec.ts` - Relaciones y búsquedas
- [ ] `suscriptor-repository.adapter.spec.ts` - Persistencia
- [ ] `oficina-repository.adapter.spec.ts` - Filtrado

**Configuración crítica**:
```typescript
// jest.config.ts
testTimeout: 30000, // 30s para TestContainers
setupFilesAfterEnv: ['../test/setup.ts'],
```

**Bloqueante para release**: ✅ **SÍ**

---

### R-004: Mapeo ORM y queries personalizadas

**Descripción**: Los repositorios ejecutan queries personalizadas (ILike para búsqueda, paginación, soft delete). Errores en queries pueden causar filtrado incorrecto o pérdida de datos.

**Factores de Riesgo**:
- ✅ Complejidad: Queries SQL generados por TypeORM
- ✅ Sin historial: Código nuevo sin probar
- ⚠️ Dependencias: Comportamiento de PostgreSQL

**Mitigación**:
1. **Probar cada query personalizada** con datos reales
2. Validar búsquedas case-insensitive (ILike)
3. Verificar paginación con grandes volúmenes
4. Confirmar soft delete (activo=false, no DELETE físico)

**Queries a probar**:
- [ ] `search()` - ILike por descripción/nombre
- [ ] `findAll()` - Filtro activo=true
- [ ] `findByOficina()` - Filtrado por relación
- [ ] `findByEstado()` - Filtrado por campo

**Bloqueante para release**: ✅ **SÍ**

---

### R-005: Conversión bidireccional Domain↔TypeORM

**Descripción**: Los mappers convierten entre entidades de dominio y TypeORM. Errores aquí causan corrupción de datos silenciosa.

**Factores de Riesgo**:
- ✅ Alta frecuencia: Cada operación CRUD pasa por mappers
- ✅ Dependencias: TypeORM, nombres de campos
- ⚠️ Complejidad: Conversión bidireccional, valores null

**Mitigación**:
1. **Tests unitarios para cada mapper**
2. Validar toDomain() y toTypeOrm()
3. Probar conversión bidireccional completa
4. Manejar valores null/undefined

**Tests obligatorios**:
- [ ] `giro.mapper.spec.ts` - Sector nullable
- [ ] `agente.mapper.spec.ts` - OficinaId, email, telefono nullable
- [ ] `suscriptor.mapper.spec.ts` - Tipo nullable
- [ ] `oficina.mapper.spec.ts` - Ciudad, estado nullable

**Cobertura esperada**: 95%+

**Bloqueante para release**: ✅ **SÍ**

---

### R-006: Endpoints HTTP expuestos

**Descripción**: Los controllers exponen endpoints HTTP que son el punto de entrada del sistema. Errores aquí afectan directamente a los consumidores de la API.

**Factores de Riesgo**:
- ✅ Alta frecuencia: Cada request pasa por controllers
- ✅ Integración total: Capa Presentation con todas las dependencias
- ⚠️ Sin historial: Código nuevo

**Mitigación**:
1. **Tests E2E con Supertest** obligatorios
2. TestContainers para base de datos real
3. Validar status codes, headers, body
4. Probar validaciones de entrada (400)
5. Probar recursos no encontrados (404)

**Tests obligatorios**:
- [ ] `giros.controller.e2e-spec.ts` - CRUD + search
- [ ] `agentes.controller.e2e-spec.ts` - CRUD + by-oficina
- [ ] `suscriptores.controller.e2e-spec.ts` - CRUD completo
- [ ] `oficinas.controller.e2e-spec.ts` - CRUD + by-estado

**Endpoints críticos**:
- `POST /{recurso}` → 201 Created
- `GET /{recurso}` → 200 + paginación
- `GET /{recurso}/:id` → 200 o 404
- `PATCH /{recurso}/:id` → 200 o 404
- `DELETE /{recurso}/:id` → 200 o 404

**Bloqueante para release**: ✅ **SÍ**

---

## Recomendaciones por Capa

### Domain Layer (HU-01)

**Prioridad**: 🔴 ALTA

**Estrategia**:
- Tests unitarios puros sin dependencias externas
- AAA Pattern: Arrange → Act → Assert
- Validar invariantes de negocio
- Probar valores por defecto y casos borde

**Riesgos a mitigar**:
- [x] R-001: Lógica de negocio
- [ ] R-007: Casos borde (MEDIO)

**Cobertura esperada**: 90%+

---

### Application Layer (HU-02, HU-05)

**Prioridad**: 🔴 ALTA

**Estrategia**:
- Tests unitarios con repositorios mockeados
- Probar orquestación y lógica de flujo
- Validar excepciones (NotFound, Conflict)
- Tests de DTOs con class-validator

**Riesgos a mitigar**:
- [x] R-002: Orquestación Use Cases
- [ ] R-008: Conflictos duplicidad (MEDIO)
- [ ] R-009: NotFoundException (MEDIO)
- [ ] R-013: Validaciones DTOs (MEDIO)
- [ ] R-014: Validaciones paginación (MEDIO)

**Cobertura esperada**: 80%+

---

### Infrastructure Layer (HU-03, HU-04)

**Prioridad**: 🔴 ALTA

**Estrategia**:
- Tests de integración con TestContainers (PostgreSQL real)
- Tests unitarios para mappers
- Validar queries SQL generadas
- Limpiar estado entre tests

**Riesgos a mitigar**:
- [x] R-003: Integración TestContainers
- [x] R-004: Mapeo ORM y queries
- [x] R-005: Conversión bidireccional
- [ ] R-010: Soft delete (MEDIO)
- [ ] R-011: Paginación (MEDIO)
- [ ] R-012: Valores null (MEDIO)

**Cobertura esperada**: 85%+

---

### Presentation Layer (HU-06)

**Prioridad**: 🟡 ALTA (Integración)

**Estrategia**:
- Tests E2E con Supertest + NestJS Testing Module
- TestContainers para DB real
- Validar HTTP status codes
- Probar serialización JSON

**Riesgos a mitigar**:
- [x] R-006: Endpoints HTTP
- [ ] R-015: Status codes específicos (MEDIO)

**Cobertura esperada**: 80%+

---

## Matriz de Testing por Riesgo

| Riesgo | Tipo Test | Framework | Prioridad Ejecución |
|--------|-----------|-----------|---------------------|
| R-001 | Unit | Jest | 1 (Primero) |
| R-002 | Unit + Mock | Jest | 2 |
| R-003 | Integration | Jest + TestContainers | 3 |
| R-004 | Integration | Jest + PostgreSQL | 3 |
| R-005 | Unit | Jest | 2 |
| R-006 | E2E | Supertest + TestContainers | 4 (Último) |
| R-007-R-015 | Unit/Integration | Jest | 5 (Backlog) |
| D-001-D-004 | Unit | Jest | 6 (Opcional) |

---

## Checklist de Validación Pre-Release

### Riesgos ALTO (Bloqueantes)

- [ ] **R-001**: Tests de Domain Entities pasan > 90% cobertura
- [ ] **R-002**: Tests de Use Cases pasan > 80% cobertura
- [ ] **R-003**: TestContainers inicia PostgreSQL correctamente
- [ ] **R-004**: Queries personalizadas retornan resultados correctos
- [ ] **R-005**: Mappers preservan todos los campos (bidireccional)
- [ ] **R-006**: Tests E2E de controllers pasan > 80% cobertura

### Métricas de Salida

| Métrica | Umbral | Estado |
|---------|--------|--------|
| Cobertura Global | ≥ 80% | ⏳ Pendiente |
| Cobertura Domain | ≥ 90% | ⏳ Pendiente |
| Cobertura Application | ≥ 80% | ⏳ Pendiente |
| Cobertura Infrastructure | ≥ 85% | ⏳ Pendiente |
| Cobertura Presentation | ≥ 80% | ⏳ Pendiente |
| Tests Exitosos | 100% | ⏳ Pendiente |
| Tests Fallidos | 0 | ⏳ Pendiente |
| Tiempo Promedio por Test | < 100ms (unit) | ⏳ Pendiente |

---

## Próximos Pasos

1. **Implementar tests de Domain** (R-001) → Alta prioridad
2. **Implementar tests de Application** (R-002) → Alta prioridad
3. **Configurar TestContainers** (R-003) → Bloqueante para Infrastructure
4. **Implementar tests de Infrastructure** (R-004, R-005)
5. **Implementar tests E2E** (R-006)
6. **Verificar cobertura > 80%** global

---

*Documento generado por risk-identifier skill - ASDD Framework*
*Regla ASD: Alto=Obligatorio, Medio=Recomendado, Bajo=Opcional*
