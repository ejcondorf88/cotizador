# ADR-007: Arquitectura Hexagonal (Ports & Adapters)

## Status
Accepted

## Date
2025-01-20

## Context
Necesitábamos elegir la arquitectura para el backend ms-core. Las opciones consideradas fueron:

- **Arquitectura Hexagonal (Ports & Adapters)**: Dominio puro, dependencias externas en capas externas
- **MVC tradicional**: Model-View-Controller anidado
- **Clean Architecture**: Similar a hexagonal, capas concéntricas
- **CQRS**: Separación de comandos y queries
- **Microservicios**: Dividir en servicios más pequeños

## Decision
**Implementar Arquitectura Hexagonal (Ports & Adapters)**.

## Consequences

### Positive
- **Independencia de frameworks**: Domain no depende de NestJS
- **Testabilidad**: Use cases testeables con mocks
- **Independencia de UI**: Domain no sabe del frontend
- **Independencia de BD**: Repository ports permiten cambiar PostgreSQL
- **Cambio de tecnología**: Podemos cambiar NestJS sin tocar lógica de negocio
- **Desarrollo paralelo**: Frontend y backend pueden evolucionar independientemente

### Negative
- **Curva de aprendizaje**: Concepto de ports/adapters puede confundir
- **Verbosity**: Mappers entre capas
- **Overhead**: Capas adicionales para apps simples
- **Boilerplate**: Más archivos que MVC tradicional

## Arquitectura Hexagonal

```
┌─────────────────────────────────────────────────────────────────┐
│                      ADAPTERS (INFRASTRUCTURE)                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │  Controllers    │  │  Repositories   │  │   Mappers       │ │
│  │  (NestJS)       │  │  (TypeORM)      │  │  (Domain<->Inf) │ │
│  └────────┬────────┘  └────────┬────────┘  └─────────────────┘ │
│           │                  │                                 │
│           └──────────────────┘                                 │
│                      │                                          │
└──────────────────────┼──────────────────────────────────────────┘
                       │ uses
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    APPLICATION (Use Cases)                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │ CreateQuoteUC   │  │ QuoteRepository │  │     DTOs        │ │
│  │ UpdateQuoteUC   │  │    PORT         │  │                 │ │
│  │ GetQuotesUC     │  │ (Interface)     │  │                 │ │
│  └────────┬────────┘  └─────────────────┘  └─────────────────┘ │
│           │                                                      │
│           │ depends on                                           │
└───────────┼──────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DOMAIN (Entities)                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │     Quote       │  │  Property       │  │   Coverage      │ │
│  │   (Entity)      │  │  (Entity)       │  │   (Entity)      │ │
│  │                 │  │                 │  │                 │ │
│  │ • id            │  │ • id            │  │ • id            │ │
│  │ • folioNumber   │  │ • quoteId       │  │ • name          │ │
│  │ • status        │  │ • name          │  │ • baseRate      │ │
│  │ • calculate()   │  │ • status        │  │                 │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                                                   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   QuoteStatus   │  │ PropertyStatus  │  │   Enums         │ │
│  │     (Enum)      │  │    (Enum)       │  │                 │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Value Objects                               │   │
│  │   Address, Construction, Coverages, etc.              │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Reglas de Dependencia

```
Presentation ──► Application ──► Domain
      ▲              ▲              │
      │              │              │
      └──────────────┴──────────────┘
              Dependency Inversion

Infrastructure implements Application Ports
```

## Implementación

```
src/
├── domain/                      # Sin dependencias externas
│   ├── quote/
│   │   ├── entities/
│   │   │   └── quote.entity.ts      # Entidad pura
│   │   ├── enums/
│   │   │   └── quote-status.enum.ts
│   │   └── value-objects/
│   ├── property/
│   │   └── ...
│   └── coverage/
│       └── ...
│
├── application/                 # Solo depende de domain
│   ├── quote/
│   │   ├── use-cases/
│   │   │   ├── create-quote.use-case.ts
│   │   │   ├── update-quote.use-case.ts
│   │   │   └── get-quotes.use-case.ts
│   │   ├── dto/
│   │   │   ├── quote-response.dto.ts
│   │   │   └── update-quote.dto.ts
│   │   └── ports/
│   │       └── quote.repository.port.ts  # Interface
│   └── property/
│       └── ...
│
├── infrastructure/              # Implementa ports
│   ├── quote/
│   │   ├── repositories/
│   │   │   └── quote.typeorm.repository.ts  # Implementa port
│   │   ├── entities/
│   │   │   └── quote.typeorm.entity.ts
│   │   └── mappers/
│   │       └── quote.mapper.ts
│   └── database/
│       └── migrations/
│
└── presentation/                # Controllers HTTP
    ├── quote/
    │   └── quote.controller.ts
    └── property/
        └── property.controller.ts
```

## Ejemplo de Implementación

### 1. Domain (Puro)
```typescript
// domain/quote/entities/quote.entity.ts
export class Quote {
  constructor(
    public readonly id: string,
    public folioNumber: string,
    public status: QuoteStatus,
    public companyName: string | null,
    public propertyCount: number,
  ) {}
  
  isDraft(): boolean {
    return this.status === QuoteStatus.DRAFT;
  }
  
  canBeUpdated(): boolean {
    return this.status === QuoteStatus.DRAFT || 
           this.status === QuoteStatus.ACTIVE;
  }
}
```

### 2. Port (Interface)
```typescript
// application/quote/ports/quote.repository.port.ts
export interface QuoteRepositoryPort {
  findById(id: string): Promise<Quote | null>;
  findAll(filter?: QuoteStatus): Promise<Quote[]>;
  save(quote: Quote): Promise<Quote>;
  update(quote: Quote): Promise<Quote>;
}
```

### 3. Use Case (Application)
```typescript
// application/quote/use-cases/create-quote.use-case.ts
@Injectable()
export class CreateQuoteUseCase {
  constructor(
    @Inject('QuoteRepositoryPort')
    private readonly quoteRepository: QuoteRepositoryPort,
  ) {}
  
  async execute(): Promise<Quote> {
    const quote = new Quote(
      uuid(),
      generateFolio(),
      QuoteStatus.DRAFT,
      null,
      0,
    );
    return this.quoteRepository.save(quote);
  }
}
```

### 4. Repository (Infrastructure)
```typescript
// infrastructure/quote/repositories/quote.typeorm.repository.ts
@Injectable()
export class QuoteTypeOrmRepository implements QuoteRepositoryPort {
  constructor(
    @InjectRepository(QuoteTypeOrmEntity)
    private readonly repository: Repository<QuoteTypeOrmEntity>,
  ) {}
  
  async findById(id: string): Promise<Quote | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? QuoteMapper.toDomain(entity) : null;
  }
  
  async save(quote: Quote): Promise<Quote> {
    const entity = QuoteMapper.toEntity(quote);
    const saved = await this.repository.save(entity);
    return QuoteMapper.toDomain(saved);
  }
}
```

### 5. Controller (Presentation)
```typescript
// presentation/quote/quote.controller.ts
@Controller('quotes')
export class QuoteController {
  constructor(
    private readonly createQuoteUseCase: CreateQuoteUseCase,
  ) {}
  
  @Post()
  async create(): Promise<QuoteResponseDto> {
    const quote = await this.createQuoteUseCase.execute();
    return QuoteMapper.toResponseDto(quote);
  }
}
```

## Alternatives Considered

| Alternativa | Razón de rechazo |
|-------------|------------------|
| MVC tradicional | Acoplamiento de lógica de negocio con framework |
| Clean Architecture | Similar a hexagonal, hexagonal más conocido en NestJS |
| CQRS | Overkill para CRUD simple |
| Microservicios | Dividir ahora sería premature optimization |

## Related Decisions
- ADR-001: TypeScript (tipado en todas las capas)
- ADR-002: PostgreSQL (persistencia en infrastructure)
- ADR-003: TypeORM (implementa repository port)
