# ADR-001: TypeScript para Frontend y Backend

## Status
Accepted

## Date
2025-01-20

## Context
Necesitábamos decidir el lenguaje de programación para ambos lados de la aplicación (frontend y backend). Las opciones consideradas fueron:

- **JavaScript**: Lenguaje dinámico, más rápido de escribir inicialmente
- **TypeScript**: Superset tipado de JavaScript, requiere compilación
- **Java**: Lenguaje tipado establecido, ampliamente usado en backend

## Decision
**Usar TypeScript** tanto para frontend como backend.

### Frontend
- React 19 con TypeScript
- Tipado estricto activado
- Interfaces compartidas con backend

### Backend
- NestJS con TypeScript
- Decoradores para metadata
- Tipado en DTOs y entidades

## Consequences

### Positive
- **Detección temprana de errores**: El compilador catcha errores de tipo antes del runtime
- **Mejor DX**: Autocompletado, navegación de código, refactoring seguro
- **Documentación viva**: Los tipos sirven como documentación
- **Compartir interfaces**: DTOs pueden compartirse entre frontend y backend
- **Escalabilidad**: El código es más mantenible a medida que crece

### Negative
- **Curva de aprendizaje**: Desarrolladores deben aprender tipos avanzados
- **Tiempo de compilación**: Build más lento que JavaScript puro
- **Configuración extra**: tsconfig.json, type definitions
- **Verbosity**: Más código para definir tipos

## Alternatives Considered

| Alternativa | Razón de rechazo |
|-------------|------------------|
| JavaScript | Errores de runtime por tipos, menor refactorabilidad |
| Java | Requería un solo lenguaje en ambos lados para compartir tipos |

## Related Decisions
- ADR-004: React + Vite (usa TypeScript)
- ADR-003: TypeORM (usa tipos TypeScript)
