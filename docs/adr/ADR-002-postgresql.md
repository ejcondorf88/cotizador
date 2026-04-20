# ADR-002: PostgreSQL como Base de Datos

## Status
Accepted

## Date
2025-01-20

## Context
Necesitábamos elegir una base de datos para persistir:
- Cotizaciones (quotes)
- Propiedades (properties) - relacionadas N:1 con quotes
- Coberturas (coverages) - catálogo + relación N:M con quotes

Las opciones consideradas fueron:

- **PostgreSQL**: Base de datos relacional ACID
- **MySQL**: Alternativa relacional popular
- **MongoDB**: Base de datos documental NoSQL

## Decision
**Usar PostgreSQL 16** como base de datos principal.

## Consequences

### Positive
- **ACID Compliance**: Transacciones confiables para operaciones financieras
- **Joins complejos**: Relaciones N:1 (quote:properties) y N:M (quote:coverage) nativas
- **JSON support**: PostgreSQL soporta JSONB para campos flexibles
- **Migrations**: TypeORM maneja migraciones de esquema
- **Community**: Extensa documentación y soporte
- **PostgreSQL 16**: Mejoras en performance y replication

### Negative
- **Escalado horizontal**: Más complejo que MongoDB para sharding
- **Esquema rígido**: Cambios requieren migraciones
- **Setup inicial**: Requiere configuración de PostgreSQL server

## Alternatives Considered

| Alternativa | Razón de rechazo |
|-------------|------------------|
| MongoDB | Joins complejos requieren múltiples queries; datos relacionales |
| MySQL | PostgreSQL tiene mejor soporte de JSON y tipos avanzados |

## Schema

```sql
-- Quotes: Cotizaciones principales
CREATE TABLE quotes (
    id UUID PRIMARY KEY,
    folio_number VARCHAR(20) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'draft',
    company_name VARCHAR(255),
    rfc VARCHAR(13),
    business_line VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Properties: Inmuebles por cotización (N:1 con quotes)
CREATE TABLE properties (
    id UUID PRIMARY KEY,
    quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE,
    name VARCHAR(255),
    street TEXT,
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(5),
    construction_type VARCHAR(50),
    coverage_building DECIMAL(15,2),
    coverage_contents DECIMAL(15,2),
    status VARCHAR(20) DEFAULT 'incomplete'
);

-- Coverages: Catálogo de coberturas
CREATE TABLE coverages (
    id UUID PRIMARY KEY,
    name VARCHAR(100),
    code VARCHAR(20) UNIQUE,
    type VARCHAR(20), -- 'mandatory' | 'optional'
    base_rate DECIMAL(5,4),
    description TEXT
);

-- Quote Coverages: Relación N:M con selección
CREATE TABLE quote_coverages (
    id UUID PRIMARY KEY,
    quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE,
    coverage_id UUID REFERENCES coverages(id),
    is_selected BOOLEAN DEFAULT false,
    selected_at TIMESTAMP
);
```

## Related Decisions
- ADR-003: TypeORM (ORM para PostgreSQL)
- ADR-007: Hexagonal Architecture (repositorios abstraen PostgreSQL)
