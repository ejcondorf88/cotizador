# ASDD en OpenCode

> **ASDD** (Agent Spec-Driven Development) es un framework de desarrollo asistido por IA que organiza el trabajo de software en cinco fases orquestadas por agentes especializados.

## Flujo de trabajo ASDD

```
Requerimiento → Spec → [Backend ∥ Frontend ∥ DB] → [Tests BE ∥ Tests FE] → QA → Docs (opcional)
```

## Flujo paso a paso

### Paso 1 — Generar Spec (obligatorio, siempre primero)

```
/generate-spec <nombre-feature>
```

O describe el requerimiento:
```
/generate-spec user-management: Crear CRUD de usuarios con roles
```

El agente genera `.github/specs/<feature>.spec.md` con estado `DRAFT`.

### Paso 2 — Aprobar la Spec

1. Revisa el archivo `.github/specs/<feature>.spec.md`
2. Cambia `status: DRAFT` → `status: APPROVED`
3. **Ningún agente escribe código sin status: APPROVED**

### Paso 3 — Implementar (paralelo)

```
/implement-backend <nombre-feature>
/implement-frontend <nombre-feature>
```

Ejecuta ambos en paralelo si es necesario.

### Paso 4 — Generar Tests (paralelo)

```
/unit-testing <nombre-feature> backend
/unit-testing <nombre-feature> frontend
/unit-testing <nombre-feature> ambos
```

### Paso 5 — Ejecutar QA

```
/gherkin-case-generator <nombre-feature>
/risk-identifier <nombre-feature>
/performance-analyzer <nombre-feature>  # solo si hay SLAs en la spec
/automation-flow-proposer <nombre-feature>  # opcional
```

### Paso 6 — Generar Documentación (opcional)

El agente `documentation-agent` se activa al completar QA.

---

## Regla de Oro 🔴

> **Ningún agente escribe código si la spec no tiene `status: APPROVED`**

Sin excepciones. El ciclo de vida es:
```
DRAFT → APPROVED → IN_PROGRESS → IMPLEMENTED → DEPRECATED
```

---

## Agentes disponibles

| Agente | Descripción | Cuándo usarlo |
|--------|-------------|---------------|
| **orchestrator** | Orquesta todo el flujo ASDD | Para flujo completo con `/asdd-orchestrate` |
| **spec-generator** | Genera especificaciones técnicas | Siempre primero, antes de cualquier código |
| **backend-developer** | Implementa backend (NestJS + Arquitectura Hexagonal + PostgreSQL + TypeORM) | Con spec APPROVED |
| **frontend-developer** | Implementa frontend (React + CSS Modules) | Con spec APPROVED, paralelo con backend |
| **database-agent** | Diseña modelos, migraciones, seeders | Si hay cambios de DB en la spec |
| **test-engineer-backend** | Genera tests unitarios para backend | Después de implementación backend |
| **test-engineer-frontend** | Genera tests unitarios para frontend | Después de implementación frontend |
| **qa-agent** | Genera estrategia QA completa | Después de tests completos |
| **documentation-agent** | Genera README, API docs, ADRs | Opcional, al cerrar feature |

---

## Skills disponibles

| Skill | Trigger | Agente | Descripción |
|-------|---------|--------|-------------|
| `/asdd-orchestrate` | `/asdd-orchestrate <feature>` | orchestrator | Orquesta flujo completo o consulta estado |
| `/generate-spec` | `/generate-spec <feature>` | spec-generator | Genera spec técnica en `.github/specs/` |
| `/implement-backend` | `/implement-backend <feature>` | backend-developer | Implementa feature en backend |
| `/implement-frontend` | `/implement-frontend <feature>` | frontend-developer | Implementa feature en frontend |
| `/unit-testing` | `/unit-testing <feature> [scope]` | test-engineer-* | Genera tests unitarios |
| `/gherkin-case-generator` | `/gherkin-case-generator <feature>` | qa-agent | Casos Given-When-Then |
| `/risk-identifier` | `/risk-identifier <feature>` | qa-agent | Matriz de riesgos ASD |
| `/performance-analyzer` | `/performance-analyzer <feature>` | qa-agent | Plan de performance con k6 |
| `/automation-flow-proposer` | `/automation-flow-proposer <feature>` | qa-agent | Propuesta de automatización |

---

## Configuración del proyecto

Los archivos de configuración viven en `.opencode/`:

- `config.yaml` — Configuración del framework ASDD
- `agents/` — Definiciones de agentes
- `skills/` — Instrucciones de skills
- `rules/` — Reglas por capa (backend, frontend, testing, etc.)

Los specs se guardan en `.github/specs/` y los requerimientos en `.github/requirements/`.

---

## Ejemplo completo

```bash
# 1. Crear spec
/generate-spec user-management

# 2. Revisar y aprobar archivo generado
# Editar .github/specs/user-management.spec.md
# Cambiar status: DRAFT → status: APPROVED

# 3. Implementar en paralelo
/implement-backend user-management
/implement-frontend user-management

# 4. Generar tests
/unit-testing user-management ambos

# 5. Ejecutar QA
/gherkin-case-generator user-management
/risk-identifier user-management

# 6. Actualizar estado
# Editar spec: status: IN_PROGRESS → status: IMPLEMENTED
```

---

## Referencias

- Especificaciones: `.github/specs/`
- Requerimientos: `.github/requirements/`
- Lineamientos: `.opencode/docs/lineamientos/`
- Reglas de código: `.opencode/rules/`
