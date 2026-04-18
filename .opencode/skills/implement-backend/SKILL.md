---
name: implement-backend
description: Implementa un feature completo en el backend con Arquitectura Hexagonal + TypeORM + PostgreSQL. Requiere spec con status APPROVED en .github/specs/.
argumentHint: "<nombre-feature>"
---

# Implement Backend (Arquitectura Hexagonal + TypeORM)

## Prerequisitos

1. Leer spec: `.github/specs/<feature>.spec.md` — sección 2 (modelos, endpoints)
2. Leer stack: `.github/rules/backend.md` y `.github/rules/database.md`
3. Leer arquitectura: Arquitectura Hexagonal (Ports & Adapters) + TypeORM

## Orden de Implementación (Hexagonal + TypeORM)

```
1. Domain/
   ├── entities/<feature>.entity.ts          # Entidad pura TypeScript
   └── ports/<feature>.repository.port.ts    # Interface del puerto

2. Application/
   ├── dto/create-<feature>.dto.ts          # Validación class-validator
   └── use-cases/create-<feature>.use-case.ts  # Lógica de negocio

3. Infrastructure/
   ├── database/migrations/YYYYMMDDHHMMSS-create_<feature>_table.ts
   ├── entities/<feature>.typeorm.entity.ts  # Entidad TypeORM con decoradores
   ├── adapters/<feature>-repository.adapter.ts  # Implementa puerto
   └── mappers/<feature>.mapper.ts         # Conversión obligatoria

4. Presentation/
   ├── <feature>.controller.ts             # HTTP + decoradores NestJS
   └── <feature>.module.ts                 # Wiring TypeORM + providers
```

## Diferencia Clave: TypeORM

**TypeORM usa decoradores en clases TypeScript** (a diferencia de Prisma que usa un schema DSL):

| Prisma | TypeORM |
|--------|---------|
| Archivo `schema.prisma` | Decoradores `@Entity()`, `@Column()` |
| Cliente generado | Repository pattern con `@InjectRepository()` |
| `prisma.feature.create()` | `typeormRepo.save(entity)` |
| Relaciones en schema | Decoradores `@OneToMany()`, `@ManyToOne()` |

## Arquitectura Hexagonal

```
┌─────────────────────────────────────────────────────────┐
│                    INFRAESTRUCTURA                      │
│         (Controllers, Adapters, TypeORM)                    │
└─────────────────────────┬───────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────┐
│                      APLICACIÓN                         │
│                    (Use Cases)                          │
└─────────────────────────┬───────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────┐
│                       DOMINIO                           │
│              (Entities + Repository Port)               │
└─────────────────────────────────────────────────────────┘
```

### Principios

1. **Domain es puro**: Sin dependencias externas, sin decoradores TypeORM
2. **Ports definen contratos**: Interfaces en el dominio
3. **Adapters implementan puertos**: La infraestructura se adapta
4. **Dependencia inward**: Todo apunta al dominio
5. **Mappers obligatorios**: Entre infraestructura y dominio

## Paso 1: Domain (Entidad + Puerto)

```typescript
// domain/feature/entities/feature.entity.ts
export class Feature {
  constructor(
    public readonly id: string,
    public name: string,
    public description: string | null,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  static create(props: CreateFeatureProps): Feature {
    return new Feature(
      uuid(),
      props.name,
      props.description ?? null,
      new Date(),
      new Date(),
    );
  }

  updateName(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new Error('Name cannot be empty');
    }
    this.name = newName;
    this.updatedAt = new Date();
  }
}

// domain/feature/ports/feature.repository.port.ts
export interface FeatureRepositoryPort {
  create(feature: Feature): Promise<Feature>;
  findById(id: string): Promise<Feature | null>;
  findAll(): Promise<Feature[]>;
  update(id: string, feature: Feature): Promise<Feature>;
  delete(id: string): Promise<void>;
}
```

## Paso 2: Application (DTO + Use Case)

```typescript
// application/feature/dto/create-feature.dto.ts
import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateFeatureDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}

// application/feature/use-cases/create-feature.use-case.ts
@Injectable()
export class CreateFeatureUseCase {
  constructor(
    @Inject('FeatureRepositoryPort')
    private readonly repo: FeatureRepositoryPort,
  ) {}

  async execute(dto: CreateFeatureDto): Promise<Feature> {
    const feature = Feature.create(dto);
    return this.repo.create(feature);
  }
}
```

## Paso 3: Infrastructure (TypeORM Entity + Adapter + Mapper)

### 3.1 Migración TypeORM

```typescript
// infrastructure/database/migrations/YYYYMMDDHHMMSS-CreateFeatureTable.ts
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateFeatureTableYYYYMMDDHHMMSS implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'features',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'name', type: 'varchar', length: '100' },
          { name: 'description', type: 'varchar', length: '500', isNullable: true },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('features');
  }
}
```

### 3.2 Entidad TypeORM

```typescript
// infrastructure/feature/entities/feature.typeorm.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('features')
export class FeatureTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

### 3.3 Mapper

```typescript
// infrastructure/feature/mappers/feature.mapper.ts
import { FeatureTypeOrmEntity } from '../entities/feature.typeorm.entity';
import { Feature } from '../../../domain/feature/feature.entity';

export class FeatureMapper {
  static toDomain(typeormEntity: FeatureTypeOrmEntity): Feature {
    return new Feature(
      typeormEntity.id,
      typeormEntity.name,
      typeormEntity.description,
      typeormEntity.createdAt,
      typeormEntity.updatedAt,
    );
  }

  static toTypeOrm(entity: Feature): FeatureTypeOrmEntity {
    const typeormEntity = new FeatureTypeOrmEntity();
    typeormEntity.id = entity.id;
    typeormEntity.name = entity.name;
    typeormEntity.description = entity.description;
    typeormEntity.createdAt = entity.createdAt;
    typeormEntity.updatedAt = entity.updatedAt;
    return typeormEntity;
  }
}
```

### 3.4 Adapter

```typescript
// infrastructure/feature/adapters/feature-repository.adapter.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeatureTypeOrmEntity } from '../entities/feature.typeorm.entity';
import { FeatureMapper } from '../mappers/feature.mapper';
import { FeatureRepositoryPort } from '../../../domain/feature/ports/feature.repository.port';
import { Feature } from '../../../domain/feature/feature.entity';

@Injectable()
export class FeatureRepositoryAdapter implements FeatureRepositoryPort {
  constructor(
    @InjectRepository(FeatureTypeOrmEntity)
    private readonly typeormRepo: Repository<FeatureTypeOrmEntity>,
  ) {}

  async create(feature: Feature): Promise<Feature> {
    const typeormEntity = FeatureMapper.toTypeOrm(feature);
    const saved = await this.typeormRepo.save(typeormEntity);
    return FeatureMapper.toDomain(saved);
  }

  async findById(id: string): Promise<Feature | null> {
    const found = await this.typeormRepo.findOne({ where: { id } });
    return found ? FeatureMapper.toDomain(found) : null;
  }

  async findAll(): Promise<Feature[]> {
    const results = await this.typeormRepo.find();
    return results.map(FeatureMapper.toDomain);
  }

  async update(id: string, feature: Feature): Promise<Feature> {
    const typeormEntity = FeatureMapper.toTypeOrm(feature);
    await this.typeormRepo.update(id, typeormEntity);
    const updated = await this.typeormRepo.findOne({ where: { id } });
    if (!updated) throw new Error('Feature not found');
    return FeatureMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.typeormRepo.delete(id);
  }
}
```

## Paso 4: Presentation (Controller)

```typescript
// presentation/feature/feature.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CreateFeatureUseCase } from '../../application/feature/use-cases/create-feature.use-case';
import { GetFeatureUseCase } from '../../application/feature/use-cases/get-feature.use-case';
import { UpdateFeatureUseCase } from '../../application/feature/use-cases/update-feature.use-case';
import { DeleteFeatureUseCase } from '../../application/feature/use-cases/delete-feature.use-case';
import { CreateFeatureDto } from '../../application/feature/dto/create-feature.dto';
import { UpdateFeatureDto } from '../../application/feature/dto/update-feature.dto';

@Controller('api/v1/features')
export class FeatureController {
  constructor(
    private readonly createUseCase: CreateFeatureUseCase,
    private readonly getUseCase: GetFeatureUseCase,
    private readonly updateUseCase: UpdateFeatureUseCase,
    private readonly deleteUseCase: DeleteFeatureUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateFeatureDto) {
    const feature = await this.createUseCase.execute(dto);
    return {
      id: feature.id,
      name: feature.name,
      description: feature.description,
      createdAt: feature.createdAt,
      updatedAt: feature.updatedAt,
    };
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.getUseCase.execute(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateFeatureDto) {
    return this.updateUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.deleteUseCase.execute(id);
  }
}
```

## Paso 5: Module (Wiring TypeORM)

```typescript
// presentation/feature/feature.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeatureController } from './feature.controller';
import { CreateFeatureUseCase } from '../../application/feature/use-cases/create-feature.use-case';
import { GetFeatureUseCase } from '../../application/feature/use-cases/get-feature.use-case';
import { UpdateFeatureUseCase } from '../../application/feature/use-cases/update-feature.use-case';
import { DeleteFeatureUseCase } from '../../application/feature/use-cases/delete-feature.use-case';
import { FeatureRepositoryAdapter } from '../../infrastructure/feature/adapters/feature-repository.adapter';
import { FeatureTypeOrmEntity } from '../../infrastructure/feature/entities/feature.typeorm.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FeatureTypeOrmEntity]),
  ],
  controllers: [FeatureController],
  providers: [
    // Use cases
    CreateFeatureUseCase,
    GetFeatureUseCase,
    UpdateFeatureUseCase,
    DeleteFeatureUseCase,
    
    // Port injection: el puerto se implementa con el adapter
    {
      provide: 'FeatureRepositoryPort',
      useClass: FeatureRepositoryAdapter,
    },
  ],
})
export class FeatureModule {}
```

## Decoradores TypeORM Comunes

| Decorador | Uso | Ejemplo |
|-----------|-----|---------|
| `@Entity('name')` | Definir tabla | `@Entity('features')` |
| `@PrimaryGeneratedColumn('uuid')` | UUID auto-generado | `@PrimaryGeneratedColumn('uuid')` |
| `@PrimaryGeneratedColumn('increment')` | ID auto-increment | `@PrimaryGeneratedColumn('increment')` |
| `@Column()` | Columna simple | `@Column()` |
| `@Column({ nullable: true })` | Nullable | `@Column({ nullable: true })` |
| `@Column({ type: 'varchar', length: 100 })` | Con tipo y longitud | `@Column({ type: 'varchar', length: 100 })` |
| `@CreateDateColumn()` | Auto fecha creación | `@CreateDateColumn()` |
| `@UpdateDateColumn()` | Auto fecha actualización | `@UpdateDateColumn()` |
| `@OneToMany(() => Entity, e => e.relation)` | Relación 1:N | `@OneToMany(() => Item, item => item.feature)` |
| `@ManyToOne(() => Entity, e => e.relation)` | Relación N:1 | `@ManyToOne(() => User, user => user.features)` |
| `@JoinColumn({ name: 'fk' })` | Especificar FK | `@JoinColumn({ name: 'user_id' })` |
| `@Index()` | Índice | `@Index(['name'])` |

## Reglas

Ver `.github/rules/backend.md` y `.github/rules/database.md`:
- Entidades de dominio puras (sin decoradores)
- Entidades TypeORM con decoradores en infraestructura
- Mappers obligatorios entre capas
- Puerto como interface, Adapter como implementación
- TypeORM solo en Infrastructure
- Migraciones TypeORM obligatorias
- DTOs con class-validator

## Comandos TypeORM

```bash
# Crear migración manual
npx typeorm migration:create -n CreateFeatureTable

# Generar migración desde entidades (desarrollo)
npx typeorm migration:generate -n AddFeatureTable

# Ejecutar migraciones
npx typeorm migration:run

# Revertir
npx typeorm migration:revert

# Ver estado
npx typeorm migration:show
```

## Templates

Ver `.opencode/skills/implement-backend/templates/patterns.ts` para ejemplos completos de arquitectura hexagonal con TypeORM.

## Restricciones

- **SOLO** directorio `backend/src/`. No tocar frontend.
- **NO** generar tests (responsabilidad de `test-engineer-backend`).
- **NUNCA** usar decoradores TypeORM en entidades de dominio.
- **SIEMPRE** separar entidad pura de entidad TypeORM.
- **SIEMPRE** usar mappers entre infraestructura y dominio.
- Tipado estricto: sin `any`.
- Ejecutar migraciones antes de usar la DB.
