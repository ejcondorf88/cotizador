# ADR-003: TypeORM como ORM

## Status
Accepted

## Date
2025-01-20

## Context
Necesitábamos un ORM para interactuar con PostgreSQL desde TypeScript. Las opciones consideradas fueron:

- **TypeORM**: ORM tradicional con decoradores
- **Prisma**: ORM moderno con cliente generado
- **Sequelize**: ORM más antiguo para Node.js
- **Query builders (Knex, Kysely)**: Más flexibles pero menos abstractos

## Decision
**Usar TypeORM 0.3.x** como ORM.

### Motivación Principal
TypeORM tiene mejor soporte para **arquitectura hexagonal**:

1. **Entidades decoradas** pueden usarse en capa de infraestructura
2. **Repository pattern** integrado
3. **Decoradores permiten** separar entidades de dominio de entidades de persistencia
4. **Migrations** integradas y automáticas

## Consequences

### Positive
- **Active Record y Data Mapper**: Soporta ambos patrones
- **Decoradores**: `@Entity()`, `@Column()`, `@OneToMany()` integran bien con TypeScript
- **Migrations CLI**: `typeorm-ts-node-commonjs migration:generate`
- **Relaciones**: Configuración declarativa de relaciones
- **Query Builder**: Para queries complejos cuando es necesario
- **Hexagonal-friendly**: Separamos Entities de Domain Entities

### Negative
- **Performance**: Ligeramente más lento que Prisma en benchmarks
- **Curva de aprendizaje**: Decoradores pueden ser confusos inicialmente
- **Inconsistencias**: Versiones mayores tienen breaking changes

## Pattern de Implementación

```typescript
// Domain Entity (pura, sin dependencias)
// src/domain/quote/entities/quote.entity.ts
export class Quote {
  constructor(
    public readonly id: string,
    public folioNumber: string,
    public status: QuoteStatus,
    // ...
  ) {}
  
  calculatePremium(): number { /* lógica de negocio */ }
}

// TypeORM Entity (infraestructura)
// src/infrastructure/quote/entities/quote.typeorm.entity.ts
@Entity('quotes')
export class QuoteTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column({ name: 'folio_number', unique: true })
  folioNumber: string;
  
  @Column()
  status: string;
  
  @OneToMany(() => PropertyTypeOrmEntity, property => property.quote)
  properties: PropertyTypeOrmEntity[];
}

// Mapper (convierte entre ambas)
// src/infrastructure/quote/mappers/quote.mapper.ts
export class QuoteMapper {
  static toDomain(entity: QuoteTypeOrmEntity): Quote {
    return new Quote(entity.id, entity.folioNumber, entity.status as QuoteStatus);
  }
  
  static toEntity(domain: Quote): QuoteTypeOrmEntity {
    const entity = new QuoteTypeOrmEntity();
    entity.id = domain.id;
    entity.folioNumber = domain.folioNumber;
    return entity;
  }
}
```

## Alternatives Considered

| Alternativa | Razón de rechazo |
|-------------|------------------|
| Prisma | Generador de cliente dificulta arquitectura hexagonal; menos flexible |
| Sequelize | Menos soporte TypeScript, API más antigua |
| Knex.js | Query builder, no ORM completo |

## Related Decisions
- ADR-002: PostgreSQL (TypeORM trabaja con PostgreSQL)
- ADR-007: Hexagonal Architecture (TypeORM en capa infrastructure)
