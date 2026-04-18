---
# ASDD + OpenCode — Knowledge Base Completa

> Última actualización: 17 Abr 2026
> Versión: 1.0.0
> Framework: ASDD (Agent Spec-Driven Development)
> Plataforma: OpenCode (motor gentle-ai)

---

## 1. QUÉ ES ASDD

**ASDD (Agent Spec-Driven Development)** es un framework de desarrollo asistido por IA que organiza el trabajo de software en cinco fases orquestadas por agentes especializados.

### Propósito

Transformar requerimientos de negocio en código funcional mediante un proceso estructurado, trazable y colaborativo donde múltiples agentes de IA trabajan en paralelo bajo coordinación central.

### Filosofía

1. **Specs antes que código**: Ningún agente escribe código sin una especificación técnica aprobada
2. **Especialización**: Cada agente tiene una responsabilidad única y bien definida
3. **Paralelismo**: Backend y frontend se implementan simultáneamente
4. **Calidad incorporada**: Tests y QA son parte obligatoria del flujo
5. **Trazabilidad**: Todo cambio se vincula a una spec aprobada en `.github/specs/`

### Compatibilidad Multi-Plataforma

| Plataforma | Directorio | Motor | Estado |
|------------|------------|-------|--------|
| **OpenCode** | `.opencode/` | gentle-ai | ✅ Activo |
| **Claude Code CLI** | `.claude/` | Claude native | ✅ Original |
| **GitHub Copilot** | `.github/` | Copilot native | ✅ Original |

Las tres plataformas comparten las **mismas specs** y **mismos lineamientos**, cada una con su adaptación.

---

## 2. FLUJO DE TRABAJO COMPLETO

```
Requerimiento → Spec → [Backend ∥ Frontend ∥ DB] → [Tests BE ∥ Tests FE] → QA → Docs (opcional)
```

### Fase 1 — SPEC (Secuencial, siempre primero)

1. Usuario describe funcionalidad o requerimiento existe en `.github/requirements/`
2. Ejecutar `/generate-spec <nombre-feature>`
3. El agente `spec-generator` genera `.github/specs/<feature>.spec.md` con estado `DRAFT`
4. **Usuario revisa y aprueba**: cambia `status: DRAFT` → `status: APPROVED`

### Fase 2 — IMPLEMENTACIÓN (Paralelo)

Con spec `APPROVED`, el `orchestrator` lanza tres agentes simultáneamente:

```
- backend-developer → backend/routes, services, repositories, models
- frontend-developer → frontend/pages, components, hooks, services
- database-agent → modelos, migraciones, seeders (si hay cambios de DB)
```

Cada agente actualiza el checklist en la spec al completar sus tareas.

### Fase 3 — TESTS (Paralelo)

Cuando Fase 2 completa:

```
- test-engineer-backend → backend/tests/
- test-engineer-frontend → frontend/src/__tests__/
```

Cobertura mínima: ≥ 80% en lógica de negocio.

### Fase 4 — QA (Secuencial)

El `qa-agent` ejecuta:

1. `/gherkin-case-generator` → flujos críticos + escenarios Gherkin
2. `/risk-identifier` → matriz de riesgos ASD (Alto/Medio/Bajo)
3. `/performance-analyzer` → plan de performance (si hay SLAs en spec)
4. `/automation-flow-proposer` → propuesta de automatización (opcional)

### Fase 5 — DOCUMENTACIÓN (Opcional)

Si el usuario lo solicita, `documentation-agent` genera:
- README updates
- API docs en `docs/output/api/`
- ADRs en `docs/output/adr/` (si hubo decisiones arquitectónicas)

---

## 3. AGENTES DISPONIBLES

### orchestrator

| Campo | Valor |
|-------|-------|
| **Fase** | Entry point |
| **Propósito** | Coordina el flujo ASDD completo. NO implementa código. |
| **Cuándo usarlo** | Para nuevos features completos o consultar estado de specs |
| **Qué produce** | Ejecución orquestada de todas las fases + reporte de estado |
| **Herramientas** | `delegate`, `Read`, `Glob`, `Grep` |

**Ejemplo de uso**:
```
/asdd-orchestrate user-management
```

---

### spec-generator

| Campo | Valor |
|-------|-------|
| **Fase** | 1 |
| **Propósito** | Genera especificaciones técnicas ASDD a partir de requerimientos |
| **Cuándo usarlo** | SIEMPRE primero, antes de cualquier código. PROACTIVO. |
| **Qué produce** | `.github/specs/<feature>.spec.md` con `status: DRAFT` |
| **Herramientas** | `Read`, `Write`, `Grep`, `Glob` |

**Archivos que lee**:
- `.github/rules/backend.md`
- `.github/rules/frontend.md`
- `.github/skills/generate-spec/spec-template.md`
- `.github/requirements/<feature>.md` (si existe)

---

### backend-developer

| Campo | Valor |
|-------|-------|
| **Fase** | 2 |
| **Propósito** | Implementa backend: rutas, servicios, repositorios, modelos |
| **Cuándo usarlo** | Con spec `APPROVED`. Trabaja en paralelo con frontend-developer. |
| **Qué produce** | Código en capas: models → repositories → services → routes |
| **Herramientas** | `Read`, `Write`, `Edit`, `Bash`, `Grep`, `Glob` |

**Stack**: FastAPI + MongoDB + Motor async + Pydantic v2 + Firebase Admin SDK

**Orden de implementación**:
1. Models / Schemas
2. Repositories
3. Services
4. Routes / Controllers
5. Registrar en punto de entrada

---

### frontend-developer

| Campo | Valor |
|-------|-------|
| **Fase** | 2 |
| **Propósito** | Implementa frontend: páginas, componentes, hooks, servicios |
| **Cuándo usarlo** | Con spec `APPROVED`. Trabaja en paralelo con backend-developer. |
| **Qué produce** | Código en capas: services → hooks → components → pages |
| **Herramientas** | `Read`, `Write`, `Edit`, `Bash`, `Grep`, `Glob` |

**Stack**: React 19 + Vite + CSS Modules + React Router v6 + Firebase SDK + Axios

**Orden de implementación**:
1. Services (llamadas HTTP)
2. Hooks / State
3. Components
4. Pages / Views
5. Registrar ruta

---

### database-agent

| Campo | Valor |
|-------|-------|
| **Fase** | 2 (condicional) |
| **Propósito** | Diseña modelos, migraciones y seeders para cambios de DB |
| **Cuándo usarlo** | Cuando la spec incluye "Modelos de Datos" nuevos o modificados |
| **Qué produce** | Modelos Pydantic, índices, migraciones UP/DOWN, seeders |
| **Herramientas** | `Read`, `Write`, `Edit`, `Grep`, `Glob` |

**Entregables**:
- Modelos: Create, Update, Response, Document
- Índices (con justificación)
- Migraciones: UP + DOWN, reversibles
- Seeder: datos sintéticos, idempotente

---

### test-engineer-backend

| Campo | Valor |
|-------|-------|
| **Fase** | 3 |
| **Propósito** | Genera tests unitarios e integración para backend |
| **Cuándo usarlo** | Después de que backend-developer complete su trabajo |
| **Qué produce** | `backend/tests/routes/`, `services/`, `repositories/` |
| **Herramientas** | `Read`, `Write`, `Grep`, `Glob` |

**Cobertura obligatoria**:
- Routes: 200/201 happy path, 400 inválidos, 401 sin auth, 404 not found
- Services: happy path, errores de negocio, edge cases
- Repositories: insert/find/update/delete con DB mockeada

**Patrón AAA obligatorio**:
```python
# GIVEN — preparar mocks y datos
# WHEN — ejecutar la acción
# THEN — verificar resultado y llamadas
```

---

### test-engineer-frontend

| Campo | Valor |
|-------|-------|
| **Fase** | 3 |
| **Propósito** | Genera tests unitarios para frontend |
| **Cuándo usarlo** | Después de que frontend-developer complete su trabajo |
| **Qué produce** | `frontend/src/__tests__/components/`, `hooks/`, `pages/` |
| **Herramientas** | `Read`, `Write`, `Grep`, `Glob` |

**Cobertura obligatoria**:
- Components: render, interacciones (click, submit), props edge cases
- Hooks: estado inicial, updates async, error handling, loading states
- Pages: render con providers, navegación básica

---

### qa-agent

| Campo | Valor |
|-------|-------|
| **Fase** | 4 |
| **Propósito** | Genera estrategia QA completa |
| **Cuándo usarlo** | Después de implementación y tests completos |
| **Qué produce** | `docs/output/qa/<feature>-gherkin.md`, `<feature>-risks.md`, etc. |
| **Herramientas** | `Read`, `Write`, `Grep`, `Glob` |

**Skills que ejecuta** (en orden):
1. `/gherkin-case-generator` → **obligatorio**
2. `/risk-identifier` → **obligatorio**
3. `/performance-analyzer` → si hay SLAs
4. `/automation-flow-proposer` → si se solicita

---

### documentation-agent

| Campo | Valor |
|-------|-------|
| **Fase** | 5 (opcional) |
| **Propósito** | Genera documentación técnica del proyecto |
| **Cuándo usarlo** | Opcionalmente al cerrar un feature |
| **Qué produce** | README updates, API docs, ADRs, guías de onboarding |
| **Herramientas** | `Read`, `Write`, `Grep`, `Glob` |

**Entregables**:
1. `README.md` updates
2. `docs/output/api/<feature>-api.md`
3. `docs/output/adr/ADR-<NNN>-<titulo>.md` (si hubo decisiones arquitectónicas)

---

## 4. SKILLS DISPONIBLES

| Comando | Descripción | Argumentos | Ejemplo |
|---------|-------------|------------|---------|
| `/asdd-orchestrate` | Orquesta el flujo ASDD completo | `<nombre-feature>` o `status` | `/asdd-orchestrate user-management` |
| `/generate-spec` | Genera spec técnica en `.github/specs/` | `<nombre-feature>: <descripción>` | `/generate-spec user-management: CRUD de usuarios` |
| `/implement-backend` | Implementa feature completo en backend | `<nombre-feature>` | `/implement-backend user-management` |
| `/implement-frontend` | Implementa feature completo en frontend | `<nombre-feature>` | `/implement-frontend user-management` |
| `/unit-testing` | Genera suite de tests (backend + frontend) | `<nombre-feature> [backend\|frontend\|ambos]` | `/unit-testing user-management ambos` |
| `/gherkin-case-generator` | Casos Given-When-Then + datos de prueba | `<nombre-feature>` | `/gherkin-case-generator user-management` |
| `/risk-identifier` | Clasifica riesgos con Regla ASD | `<nombre-feature>` | `/risk-identifier user-management` |
| `/automation-flow-proposer` | Propone flujos a automatizar y framework | `<nombre-feature>` | `/automation-flow-proposer user-management` |
| `/performance-analyzer` | Planifica pruebas de performance con k6 | `<nombre-feature>` | `/performance-analyzer user-management` |

---

## 5. REGLAS DEL PROYECTO

Las reglas en `.opencode/rules/` definen convenciones por capa:

### backend.md

**Scope**: `backend/**`, `server/**`, `api/**`, `app/**`

**Stack aprobado**:
- Python 3.12 + FastAPI (async REST)
- Motor (async MongoDB)
- Pydantic v2
- Firebase Admin SDK
- Uvicorn

**Arquitectura en Capas**:
```
routes → services → repositories → MongoDB
```

**Nomenclatura**:
| Artefacto | Convención | Ejemplo |
|-----------|------------|---------|
| Router | `<feature>_router.py` | `faq_router.py` |
| Service | `<feature>_service.py` | `faq_service.py` |
| Repository | `<feature>_repository.py` | `faq_repository.py` |
| Model | `<feature>_model.py` | `faq_model.py` |
| Test | `test_<feature>_<layer>.py` | `test_faq_service.py` |

---

### frontend.md

**Scope**: `frontend/**`, `client/**`, `web/**`

**Stack aprobado**:
- React 19 + Vite
- CSS Modules (un `.module.css` por archivo)
- React Router v6
- Firebase SDK
- Axios

**Arquitectura**:
```
services → hooks → components → pages → App.jsx
```

**Nomenclatura**:
| Artefacto | Convención | Ejemplo |
|-----------|------------|---------|
| Page | `<Feature>Page.jsx` + `.module.css` | `FaqPage.jsx` |
| Component | `<Component>.jsx` + `.module.css` | `FaqFormModal.jsx` |
| Hook | `use<Feature>.js` | `useFaq.js` |
| Service | `<feature>Service.js` | `faqService.js` |

---

### database.md

**Scope**: `**/models/**`, `**/repositories/**`, `**/entities/**`, `**/schemas/**`, `**/migrations/**`

**Stack**: MongoDB + Motor async + Pydantic v2

**Separación de Modelos obligatoria**:
| Modelo | Propósito |
|--------|-----------|
| **Create / Input** | Datos que el cliente envía para crear |
| **Update / Patch** | Datos para actualizar |
| **Response / Output** | Lo que la API retorna (sin `_id`) |
| **Document / Entity** | Documento interno de MongoDB |

---

### testing.md

**Scope**: `**/tests/**`, `**/__tests__/**`, `**/*.test.*`, `**/test_*.py`

**Frameworks**: pytest (backend) + Vitest (frontend)

**Principios**:
- AAA: Arrange (Given) → Act (When) → Assert (Then)
- Pirámide: Unitarios ~70%, Integración ~20%, E2E ~10%
- Cobertura mínima ≥ 80%
- Independencia: cada test se ejecuta solo
- Aislamiento: mockear SIEMPRE dependencias externas

---

### specs.md

**Scope**: `.github/specs/**`, `.github/requirements/**`

**Ciclo de vida obligatorio**:
```
DRAFT → APPROVED → IN_PROGRESS → IMPLEMENTED → DEPRECATED
```

**Frontmatter obligatorio**:
```yaml
---
id: SPEC-001
status: DRAFT
feature: nombre-del-feature
created: YYYY-MM-DD
updated: YYYY-MM-DD
author: spec-generator
version: "1.0"
related-specs: []
---
```

---

## 6. FORMATO DE SPECS

### Ubicación

```
.github/specs/<nombre-feature-en-kebab-case>.spec.md
```

### Estructura completa

```markdown
---
id: SPEC-001
status: DRAFT
feature: user-management
created: 2026-04-17
updated: 2026-04-17
author: spec-generator
version: "1.0"
related-specs: []
---

# Spec: User Management

## 1. REQUERIMIENTOS

### Descripción
Resumen de la funcionalidad.

### Historias de Usuario

#### HU-01: Crear usuario
```
Como: Administrador
Quiero: Crear usuarios con roles
Para: Gestionar accesos al sistema

Prioridad: Alta
Estimación: M
Dependencias: Ninguna
Capa: Ambas
```

#### Criterios de Aceptación — HU-01

**Happy Path**
```gherkin
CRITERIO-1.1: Crear usuario exitosamente
Dado que: el administrador tiene permisos
Cuando: envía datos válidos del usuario
Entonces: el sistema crea el usuario y retorna 201
```

**Error Path**
```gherkin
CRITERIO-1.2: Email duplicado
Dado que: existe un usuario con ese email
Cuando: intenta crear usuario con el mismo email
Entonces: retorna error 409 con mensaje apropiado
```

### Reglas de Negocio
1. El email debe ser único
2. La contraseña debe tener mínimo 8 caracteres
3. Solo administradores pueden crear usuarios

## 2. DISEÑO

### Modelos de Datos

| Campo | Tipo | Obligatorio | Validación |
|-------|------|-------------|------------|
| `uid` | string | sí | Firebase UID |
| `email` | string | sí | formato email |
| `role` | enum | sí | admin, user |
| `created_at` | datetime | sí | auto UTC |
| `updated_at` | datetime | sí | auto UTC |

### API Endpoints

#### POST /api/v1/users
- **Auth**: Bearer token requerido
- **Body**: `{ "email": "string", "password": "string", "role": "string" }`
- **Response 201**: usuario creado
- **Response 400**: datos inválidos
- **Response 401**: no autenticado
- **Response 409**: email duplicado

### Diseño Frontend

| Componente | Props | Descripción |
|------------|-------|-------------|
| `UserFormModal` | `isOpen, onSubmit, onClose` | Modal creación/edición |
| `UserCard` | `user, onDelete` | Tarjeta de usuario |

| Hook | Retorna | Descripción |
|------|---------|-------------|
| `useUsers` | `{ users, loading, error, create, remove }` | CRUD de usuarios |

## 3. LISTA DE TAREAS

### Backend
- [ ] Crear modelos UserCreate, UserUpdate, UserResponse, UserDocument
- [ ] Implementar UserRepository
- [ ] Implementar UserService
- [ ] Implementar router /api/v1/users
- [ ] Registrar en punto de entrada

#### Tests Backend
- [ ] test_user_service_create_success
- [ ] test_user_service_duplicate_raises_conflict
- [ ] test_user_repo_insert_returns_document
- [ ] test_user_router_post_returns_201
- [ ] test_user_router_post_returns_401_no_token

### Frontend
- [ ] Crear userService
- [ ] Crear useUsers hook
- [ ] Implementar UserCard + estilos
- [ ] Implementar UserFormModal + estilos
- [ ] Implementar UsersPage + estilos
- [ ] Registrar ruta /users

#### Tests Frontend
- [ ] UserCard renders correctly
- [ ] UserCard calls onDelete when clicked
- [ ] UserFormModal submits with correct data
- [ ] useUsers loads items on mount

### QA
- [ ] Ejecutar /gherkin-case-generator
- [ ] Ejecutar /risk-identifier
- [ ] Validar cobertura de tests
- [ ] Actualizar status: IMPLEMENTED
```

### Ciclo de Vida

| Estado | Quién lo asigna | Condición |
|--------|-----------------|-----------|
| `DRAFT` | spec-generator | Spec recién generada |
| `APPROVED` | Usuario | Revisada y aprobada para implementar |
| `IN_PROGRESS` | orchestrator | Implementación iniciada |
| `IMPLEMENTED` | orchestrator | Código + tests + QA completos |
| `DEPRECATED` | Usuario | Feature descartado |

**REGLA DE ORO**: NUNCA escribir código si la spec no está en estado `APPROVED`.

---

## 7. QUÉ CAMBIOS SE HICIERON EN LA MIGRACIÓN

### 7.1. Frontmatter de Agentes

| Campo original (Claude) | Campo OpenCode | Notas |
|-------------------------|----------------|-------|
| `model: sonnet` | **Eliminado** | OpenCode usa modelo configurado globalmente |
| `permissionMode: acceptEdits` | **Eliminado** | OpenCode maneja permisos diferente |
| `memory: project` | `scope: project` | Equivalente funcional |
| `tools: Agent, Read...` | `tools: delegate, Read...` | `Agent` → `delegate` |

**Ejemplo - Agente en Claude:**
```yaml
---
name: orchestrator
tools: Agent, Read, Glob, Grep
model: sonnet
permissionMode: default
memory: project
---
```

**Ejemplo - Agente en OpenCode:**
```yaml
---
name: orchestrator
tools:
  delegate: true
  Read: true
  Glob: true
  Grep: true
---
```

### 7.2. Frontmatter de Skills

| Campo original | Campo OpenCode |
|----------------|----------------|
| `argument-hint` | `argumentHint` (camelCase) |

**Ejemplo - Skill en Claude:**
```yaml
---
name: generate-spec
argument-hint: "<nombre-feature>: <descripción>"
---
```

**Ejemplo - Skill en OpenCode:**
```yaml
---
name: generate-spec
argumentHint: "<nombre-feature>: <descripción>"
---
```

### 7.3. Referencias de Paths

Todas las referencias a `.claude/` fueron cambiadas a `.github/` en agentes/skills de OpenCode:

| Antes (Claude) | Después (OpenCode) |
|----------------|-------------------|
| `.claude/rules/backend.md` | `.github/rules/backend.md` |
| `.claude/docs/lineamientos/` | `.github/docs/lineamientos/` |

Esto permite que OpenCode use los mismos archivos que GitHub Copilot.

### 7.4. Invocación de Agentes

| Plataforma | Sintaxis |
|------------|----------|
| Claude Code | `@orchestrator` o `/asdd-orchestrate` |
| OpenCode | `/asdd-orchestrate` (comando slash) |
| Copilot | `@orchestrator` en chat |

### 7.5. Subagentes

| Plataforma | Mecanismo |
|------------|-----------|
| Claude Code | `Agent` tool nativo |
| OpenCode | `delegate` function |

### 7.6. Persistencia

| Plataforma | Mecanismo |
|------------|-----------|
| Claude Code | Project memory nativa |
| OpenCode | Engram (`mem_save`, `mem_search`) + OpenSpec |

---

## 8. QUÉ SE PERDIÓ EN LA MIGRACIÓN

### Settings de Claude Code

El archivo `.claude/settings.json` es específico de Claude Code y **NO** tiene equivalente directo en OpenCode:

| Feature Claude Code | Estado en OpenCode |
|--------------------|-------------------|
| Hooks (`PreToolUse`, `PostToolUse`, `Stop`, `SubagentStop`, `Notification`) | ❌ No disponible |
| `teammateMode: "in-process"` | ❌ No aplica |
| `autoApprove: true` | ❌ No disponible |
| `permissions.deny` con patterns | ⚠️ Reemplazado por `blocked_files` en `config.yaml` |
| Notificaciones de sonido | ❌ No aplica |

### Scripts de Hooks

Los scripts en `.claude/hooks/` funcionan solo con Claude Code:
- `pre-edit-protection.sh`
- `post-spec-validate.sh`
- `notify-sound.sh`

**Mitigación en OpenCode**: La protección de archivos sensibles está en `config.yaml`:

```yaml
hooks:
  pre_edit:
    blocked_files:
      - ".env"
      - "firebase_credentials.json"
      - "*.pem"
      - "secrets/**"
```

### Hooks Automáticos

| Feature | Claude Code | OpenCode |
|---------|-------------|----------|
| Validación de specs post-write | Automático (`post-spec-validate.sh`) | ⚠️ Manual o CI |
| Protección de archivos sensibles | Automático (`pre-edit-protection.sh`) | ⚠️ Configurado en `config.yaml` |
| Notificaciones sonoras | Sí | No aplica |

---

## 9. CÓMO USAR ASDD EN OPENCODE

### Instalación

1. **Instalar OpenCode** en tu editor (VS Code, Cursor, etc.)
2. **Clonar** este repositorio en tu proyecto
3. **Copiar** el framework:

```bash
# Copiar configuración OpenCode
cp -r .opencode/ /tu-proyecto/.opencode/

# Copiar specs y requirements compartidos
cp -r .github/ /tu-proyecto/.github/
```

### Flujo Paso a Paso

#### Paso 1 — Crear Requerimiento (Opcional)

```bash
# Crear archivo de requerimiento (lenguaje de negocio)
echo "El usuario debe poder convertir monedas en tiempo real" \
  > .github/requirements/conversiones.md
```

#### Paso 2 — Generar Spec

```
/generate-spec conversiones
```

El agente `spec-generator` creará `.github/specs/conversiones.spec.md` con `status: DRAFT`.

#### Paso 3 — Revisar y Aprobar Spec

1. Abre `.github/specs/conversiones.spec.md`
2. Revisa las secciones: Requerimientos, Diseño, Lista de Tareas
3. Cambia el frontmatter:
   ```yaml
   status: APPROVED
   updated: 2026-04-17
   ```

**⚠️ REGLA DE ORO**: Sin `status: APPROVED`, ningún agente escribirá código.

#### Paso 4 — Implementar (Opción A: Orquestación Automática)

```
/asdd-orchestrate conversiones
```

El `orchestrator` gestionará todo:
- Fase 2: Backend + Frontend + DB en paralelo
- Fase 3: Tests en paralelo
- Fase 4: QA secuencial
- Reporte final al usuario

#### Paso 4 — Implementar (Opción B: Control Manual)

```
# Implementar backend y frontend en paralelo
/implement-backend conversiones
/implement-frontend conversiones

# Generar tests
/unit-testing conversiones ambos

# Ejecutar QA
/gherkin-case-generator conversiones
/risk-identifier conversiones
```

#### Paso 5 — Actualizar Estado

Cuando todo esté completo, edita la spec:
```yaml
status: IMPLEMENTED
updated: 2026-04-17
```

### Reporte de Estado

Para ver el estado de todas las specs:

```
/asdd-orchestrate status
```

Muestra:
```
SPEC: ✅ APPROVED / ⏳ DRAFT / ❌ Faltante
BACKEND: ✅ Completo / 🔄 En progreso / ⏸ Pendiente
FRONTEND: ✅ Completo / 🔄 En progreso / ⏸ Pendiente
TESTS BE: ✅ Completo / 🔄 En progreso / ⏸ Pendiente
TESTS FE: ✅ Completo / 🔄 En progreso / ⏸ Pendiente
QA: ✅ Completo / ⏸ Pendiente
```

### Buenas Prácticas

1. **Siempre empezar con spec**: Nunca pedir código directamente
2. **Aprobar antes de continuar**: Cambiar `status: DRAFT` → `status: APPROVED`
3. **Usar nombres descriptivos**: `user-management` mejor que `feature1`
4. **Revisar checklist**: La spec tiene checklists accionables para cada fase
5. **No saltar fases**: El orchestrator valida dependencias

---

## 10. COMANDOS DE REFERENCIA RÁPIDA

### Comandos Principales

| Comando | Descripción | Uso típico |
|---------|-------------|------------|
| `/asdd-orchestrate <feature>` | Orquesta todo el flujo | Para features nuevos completos |
| `/asdd-orchestrate status` | Lista specs y estados | Para ver progreso del proyecto |
| `/generate-spec <feature>` | Genera spec técnica | Primero siempre |
| `/implement-backend <feature>` | Implementa backend | Después de spec aprobada |
| `/implement-frontend <feature>` | Implementa frontend | Después de spec aprobada |

### Comandos de Testing

| Comando | Descripción | Ejemplo |
|---------|-------------|---------|
| `/unit-testing <feature> backend` | Tests solo backend | `/unit-testing user-management backend` |
| `/unit-testing <feature> frontend` | Tests solo frontend | `/unit-testing user-management frontend` |
| `/unit-testing <feature> ambos` | Tests backend + frontend | `/unit-testing user-management ambos` |

### Comandos de QA

| Comando | Descripción | Cuándo usarlo |
|---------|-------------|---------------|
| `/gherkin-case-generator <feature>` | Escenarios Gherkin + datos | Siempre después de tests |
| `/risk-identifier <feature>` | Matriz de riesgos ASD | Siempre después de tests |
| `/performance-analyzer <feature>` | Plan de performance con k6 | Si la spec tiene SLAs |
| `/automation-flow-proposer <feature>` | Propuesta de automatización | Opcional, si se solicita |

### Checklist de Flujo Completo

```
□ 1. Crear requerimiento (opcional)
□ 2. /generate-spec <feature>
□ 3. Revisar .github/specs/<feature>.spec.md
□ 4. Cambiar status: DRAFT → status: APPROVED
□ 5. /asdd-orchestrate <feature>
   □ Fase 2: Backend + Frontend + DB (paralelo)
   □ Fase 3: Tests (paralelo)
   □ Fase 4: QA (secuencial)
□ 6. Validar entregables
□ 7. Cambiar status: IN_PROGRESS → status: IMPLEMENTED
```

---

## 11. REGLA DE ORO

> 🔴 **NINGÚN AGENTE ESCRIBE CÓDIGO SI LA SPEC NO TIENE `status: APPROVED`**

Sin excepciones.

El ciclo de vida de una spec es:

```
DRAFT → APPROVED → IN_PROGRESS → IMPLEMENTED → DEPRECATED
```

| Transición | Responsable | Acción requerida |
|------------|-------------|------------------|
| DRAFT → APPROVED | **Usuario humano** | Revisar y aprobar la spec |
| APPROVED → IN_PROGRESS | orchestrator | Iniciar implementación |
| IN_PROGRESS → IMPLEMENTED | orchestrator | Completar todas las fases |
| IMPLEMENTED → DEPRECATED | Usuario humano | Descartar feature |

**¿Por qué?**

- **Trazabilidad**: Cada línea de código vinculada a una spec aprobada
- **Calidad**: La spec fuerza análisis antes de código
- **Colaboración**: El equipo humano decide qué se implementa
- **Rollback**: Se puede deprecar specs sin tocar código

**Violaciones detectadas**:
- Si un agente intenta escribir código sin spec aprobada → el orchestrator bloquea
- Si la spec está en DRAFT → se solicita aprobación al usuario
- Si no existe spec → se ejecuta `/generate-spec` primero

---

## Archivos Leídos para este Documento

### Estructura ASDD Original:
- ✅ README.md (raíz)
- ✅ .claude/settings.json
- ✅ .claude/agents/*.md (9 archivos)
- ✅ .claude/skills/**/*.md (10 archivos)
- ✅ .claude/rules/*.md (5 archivos)

### Estructura GitHub Copilot:
- ✅ .github/AGENTS.md
- ✅ .github/copilot-instructions.md
- ✅ .github/agents/*.agent.md (9 archivos)
- ✅ .github/instructions/*.md (3 archivos)
- ✅ .github/skills/**/*.md (10 archivos)
- ✅ .github/skills/generate-spec/spec-template.md

### Estructura Migrada OpenCode:
- ✅ .opencode/config.yaml
- ✅ .opencode/AGENTS.md
- ✅ .opencode/MIGRATION-NOTES.md
- ✅ .opencode/agents/*.md (9 archivos)
- ✅ .opencode/skills/*.md (9 archivos)
- ✅ .opencode/rules/*.md (5 archivos)

**Total archivos leídos**: 69 archivos

**Archivos no encontrados**: Ninguno — todos los archivos esperados estaban presentes.

---

## Referencias

- Especificaciones: `.github/specs/`
- Requerimientos: `.github/requirements/`
- Lineamientos: `.github/docs/lineamientos/`
- Reglas de código: `.opencode/rules/`
- Configuración: `.opencode/config.yaml`
- Guía de uso: `.opencode/AGENTS.md`

---

*Documento generado automáticamente a partir del análisis del repositorio ASDD.*
*Para actualizar este documento, modificar los archivos fuente y regenerar.*
