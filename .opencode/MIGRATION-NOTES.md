# Notas de Migración ASDD → OpenCode

## Resumen

Esta migración adapta el framework ASDD (originalmente diseñado para Claude Code) para funcionar con OpenCode, manteniendo compatibilidad con las versiones originales.

## Cambios realizados

### 1. Frontmatter de Agentes

| Campo original (Claude) | Campo OpenCode | Notas |
|-------------------------|----------------|-------|
| `model: sonnet` | Eliminado | OpenCode usa modelo configurado globalmente |
| `permissionMode: acceptEdits` | Eliminado | OpenCode maneja permisos diferente |
| `memory: project` | `scope: project` | Equivalente funcional |
| `tools: Agent, Read...` | `tools: delegate, Read...` | `Agent` → `delegate` |

### 2. Frontmatter de Skills

| Campo original | Campo OpenCode | Notas |
|----------------|----------------|-------|
| `argument-hint` | `argumentHint` | camelCase para OpenCode |

### 3. Referencias de paths

Todas las referencias a `.claude/` fueron cambiadas a `.github/` en los agentes/skills de OpenCode:

- `.claude/rules/backend.md` → `.github/rules/backend.md`
- `.claude/docs/lineamientos/` → `.github/docs/lineamientos/`

Esto permite que OpenCode use los mismos archivos que GitHub Copilot.

### 4. Directorios creados

```
.opencode/
├── config.yaml                 # Configuración del framework
├── AGENTS.md                   # Guía de uso para OpenCode
├── MIGRATION-NOTES.md          # Este archivo
├── agents/                     # 9 agentes adaptados
│   ├── orchestrator.md
│   ├── spec-generator.md
│   ├── backend-developer.md
│   ├── frontend-developer.md
│   ├── database-agent.md
│   ├── test-engineer-backend.md
│   ├── test-engineer-frontend.md
│   ├── qa-agent.md
│   └── documentation-agent.md
├── skills/                     # 9 skills adaptados
│   ├── asdd-orchestrate/
│   ├── generate-spec/
│   │   └── SKILL.md
│   ├── implement-backend/
│   │   ├── SKILL.md
│   │   └── templates/
│   │       ├── patterns.py
│   │       ├── Page.jsx
│   │       ├── Page.module.css
│   │       ├── Component.jsx
│   │       └── Component.module.css
│   ├── implement-frontend/
│   │   ├── SKILL.md
│   │   └── templates/
│   │       ├── Page.jsx
│   │       ├── Page.module.css
│   │       ├── Component.jsx
│   │       └── Component.module.css
│   ├── unit-testing/
│   │   ├── SKILL.md
│   │   └── templates/
│   │       ├── Component.test.jsx
│   │       ├── useHook.test.js
│   │       ├── test_service.py
│   │       ├── test_router.py
│   │       └── test_repository.py
│   ├── gherkin-case-generator/
│   ├── risk-identifier/
│   ├── performance-analyzer/
│   └── automation-flow-proposer/
└── rules/                      # Copiados sin cambios
    ├── backend.md
    ├── frontend.md
    ├── database.md
    ├── testing.md
    └── specs.md
```

## Lo que NO se migró

### Settings de Claude Code

El archivo `.claude/settings.json` es específico de Claude Code y NO tiene equivalente en OpenCode:

- Hooks (`PreToolUse`, `PostToolUse`, `Stop`, etc.)
- `teammateMode: "in-process"`
- `autoApprove`
- `permissions.deny` con patterns
- Notificaciones de sonido

En OpenCode, estos comportamientos se manejan de otra forma o no aplican.

### Scripts de hooks

Los scripts en `.claude/hooks/` funcionan solo con Claude Code:
- `pre-edit-protection.sh`
- `post-spec-validate.sh`
- `notify-sound.sh`

La protección de archivos sensibles debe implementarse manualmente o mediante linters en CI.

## Compatibilidad

| Plataforma | Directorio | Estado |
|------------|------------|--------|
| **Claude Code CLI** | `.claude/` | ✅ Original, sin cambios |
| **GitHub Copilot Chat** | `.github/` | ✅ Sin cambios |
| **OpenCode** | `.opencode/` | ✅ Nuevo, adaptado |

Los tres pueden coexistir. Cada herramienta usa su directorio correspondiente.

## Diferencias de comportamiento

| Feature | Claude Code | OpenCode | Notas |
|---------|-------------|------------|-------|
| Invocar agente | `@orchestrator` | `/asdd-orchestrate` | Comandos slash en OpenCode |
| Subagentes | `Agent` tool nativo | `delegate` function | Similar pero diferente sintaxis |
| Hooks automáticos | Sí (settings.json) | No | Requiere implementación manual |
| Persistencia | Nativa (project memory) | Engram/mem_save | Requiere llamadas explícitas |
| Notificaciones | Sonido integrado | No aplica | Depende del IDE/host |

## Uso recomendado

### Para usuarios de OpenCode:

1. Usar los skills con comandos slash: `/generate-spec`, `/implement-backend`, etc.
2. Los agentes se invocan automáticamente desde los skills
3. Seguir el flujo: Spec → Implementación → Tests → QA

### Para mantener compatibilidad triple:

- **Nunca modificar** `.claude/` ni `.github/` — son las fuentes originales
- **Solo añadir** archivos a `.opencode/` para OpenCode
- Si hay cambios en el framework, replicar en los tres directorios

## Problemas conocidos

1. **Hooks no funcionan**: La validación de specs y protección de archivos debe hacerse manualmente o en CI
2. **Settings.json no aplica**: OpenCode no tiene equivalente a `settings.json` de Claude
3. **Templates con imports ejemplo**: Los templates de testing tienen imports de ejemplo que causarán errores hasta que el usuario los complete (esto es intencional)

## Próximos pasos recomendados

1. Probar el flujo completo con un feature pequeño
2. Configurar hooks de validación en CI (GitHub Actions, etc.)
3. Documentar variaciones específicas del proyecto
4. Crear plantillas personalizadas si es necesario
