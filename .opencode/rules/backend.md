---
description: Reglas de backend para este proyecto (NestJS + Arquitectura Hexagonal + PostgreSQL + TypeORM). Se aplica automáticamente a archivos backend.
paths:
  - "backend/**"
  - "server/**"
  - "api/**"
  - "app/**"
---

# Reglas de Backend — NestJS + Arquitectura Hexagonal + PostgreSQL + TypeORM

## Stack aprobado

- **Node.js 20+** + **NestJS** (framework progresivo)
- **TypeScript** — tipado estricto obligatorio
- **PostgreSQL** — base de datos relacional
- **TypeORM** — ORM para acceso a PostgreSQL
- **class-validator** + **class-transformer** — validación DTOs
- **Firebase Admin SDK** — verificación de `idToken` en guards
- **Jest** — testing (configurado por defecto en NestJS)

**Prohibido:**
- FastAPI, Python, MongoDB, Mongoose, Motor
- Prisma, Sequelize, Knex.js
- SQL nativo sin TypeORM
- Acceso directo a PostgreSQL sin TypeORM
- Código sin arquitectura hexagonal
- Acceso directo a DB desde controllers

## Arquitectura Hexagonal (Ports & Adapters)

```
┌─────────────────────────────────────────────────────────┐
│                    INFRAESTRUCTURA                      │
│    (Controllers, Repositories, External Services)       │
└─────────────────────────┬───────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────┐
│                      APLICACIÓN                         │
│                  (Casos de Uso)                         │
└─────────────────────────┬───────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────┐
│                       DOMINIO                           │
│              (Entidades + Puertos)                      │
└─────────────────────────────────────────────────────────┘
```

### Capas y Responsabilidades

| Capa | Ubicación | Responsabilidad | Prohibido |
|------|-----------|-----------------|-----------|
| **Domain** | `domain/` | Entidades puras, value objects, puertos (interfaces) | Dependencias externas, infraestructura |
| **Application** | `application/` | Casos de uso, DTOs, orquestación | Acceso directo a DB, lógica de dominio en use cases |
| **Infrastructure** | `infrastructure/` | Adaptadores (TypeORM), mappers, configuración | Lógica de negocio |
| **Presentation** | `presentation/` | Controllers HTTP, guards, middlewares, pipes | Lógica de negocio, acceso a DB |

## Estructura de Carpetas

```
backend/src/
├── domain/
│   └── <feature>/
│       ├── entities/
│       │   └── <feature>.entity.ts
│       ├── value-objects/
│       └── ports/
│           └── <feature>.repository.port.ts
├── application/
│   └── <feature>/
│       ├── use-cases/
│       │   ├── create-<feature>.use-case.ts
│       │   ├── update-<feature>.use-case.ts
│       │   ├── delete-<feature>.use-case.ts
│       │   └── get-<feature>.use-case.ts
│       └── dto/
│           ├── create-<feature>.dto.ts
│           └── update-<feature>.dto.ts
├── infrastructure/
│   ├── database/
│   │   ├── typeorm.config.ts
│   │   └── database.module.ts
│   └── <feature>/
│       ├── adapters/
│       │   └── <feature>-repository.adapter.ts
│       └── mappers/
│           └── <feature>.mapper.ts
├── presentation/
│   └── <feature>/
│       ├── <feature>.controller.ts
│       └── <feature>.module.ts
├── common/
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   └── pipes/
├── app.module.ts
└── main.ts
```

## Principios Hexagonales Obligatorios

### 1. El Dominio es Puro

```typescript
// ✅ CORRECTO: Entidad pura, sin dependencias externas
// domain/feature/feature.entity.ts
export class Feature {
  constructor(
    public readonly id: string,
    public name: string,
    public description?: string,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  static create(props: CreateFeatureProps): Feature {
    return new Feature(
      uuid(),
      props.name,
      props.description,
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

// ❌ INCORRECTO: Entidad con decoradores TypeORM en dominio
@Entity()  // Prohibido en capa de dominio
export class Feature {
  @PrimaryGeneratedColumn('uuid')  // Prohibido
  id: string;
}
```

### 2. Entidades TypeORM (Infraestructura)

```typescript
// ✅ CORRECTO: Entidad TypeORM en infraestructura
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### 3. Puertos Definen Contratos

```typescript
// ✅ CORRECTO: Puerto (interface) en dominio
// domain/feature/ports/feature.repository.port.ts
export interface FeatureRepositoryPort {
  create(feature: Feature): Promise<Feature>;
  findById(id: string): Promise<Feature | null>;
  findAll(): Promise<Feature[]>;
  update(id: string, feature: Feature): Promise<Feature>;
  delete(id: string): Promise<void>;
}
```

### 4. Adaptadores Implementan Puertos

```typescript
// ✅ CORRECTO: Adapter en infraestructura usando TypeORM
// infrastructure/feature/adapters/feature-repository.adapter.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
    if (!updated) throw new Error('Feature not found after update');
    return FeatureMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.typeormRepo.delete(id);
  }
}
```

### 5. Use Cases Usan Puertos

```typescript
// ✅ CORRECTO: Use case depende de puerto, no de implementación
// application/feature/use-cases/create-feature.use-case.ts
@Injectable()
export class CreateFeatureUseCase {
  constructor(
    @Inject('FeatureRepositoryPort')
    private readonly featureRepo: FeatureRepositoryPort,
  ) {}

  async execute(dto: CreateFeatureDto): Promise<Feature> {
    const feature = Feature.create(dto);
    return this.featureRepo.create(feature);
  }
}
```

### 6. Mappers Obligatorios

```typescript
// ✅ CORRECTO: Mapper entre TypeORM y Dominio
// infrastructure/feature/mappers/feature.mapper.ts
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
    typeormEntity.description = entity.description ?? null;
    typeormEntity.createdAt = entity.createdAt;
    typeormEntity.updatedAt = entity.updatedAt;
    return typeormEntity;
  }
}
```

## Configuración TypeORM

```typescript
// infrastructure/database/typeorm.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/../**/*.typeorm.entity{.ts,.js}'],
  synchronize: false, // Usar migraciones en producción
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  migrationsRun: true,
  logging: process.env.NODE_ENV === 'development',
};

// app.module.ts
@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    FeatureModule,
  ],
})
export class AppModule {}
```

## Wiring de Dependencias (NestJS + TypeORM)

```typescript
// presentation/feature/feature.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([FeatureTypeOrmEntity]),
  ],
  controllers: [FeatureController],
  providers: [
    // Casos de uso
    CreateFeatureUseCase,
    GetFeatureUseCase,
    UpdateFeatureUseCase,
    DeleteFeatureUseCase,
    
    // Inyección del puerto con su implementación
    {
      provide: 'FeatureRepositoryPort',
      useClass: FeatureRepositoryAdapter,
    },
  ],
})
export class FeatureModule {}
```

## Convenciones de Código

| Aspecto | Convención | Ejemplo |
|---------|-----------|---------|
| **Entidades dominio** | PascalCase, puras TypeScript | `Feature`, `User` |
| **Entidades TypeORM** | PascalCase + TypeOrmEntity | `FeatureTypeOrmEntity` |
| **Puertos** | Sufijo `Port` | `FeatureRepositoryPort` |
| **Adaptadores** | Sufijo `Adapter` | `FeatureRepositoryAdapter` |
| **Use cases** | Sufijo `UseCase` | `CreateFeatureUseCase` |
| **DTOs** | Sufijo `Dto`, camelCase | `CreateFeatureDto` |
| **Mappers** | Sufijo `Mapper` | `FeatureMapper` |
| **Variables** | camelCase | `featureName` |
| **Constantes** | SCREAMING_SNAKE_CASE | `MAX_ITEMS` |
| **Archivos** | kebab-case | `create-feature.dto.ts` |

## Decoradores TypeORM

| Decorador | Uso | Ejemplo |
|-----------|-----|---------|
| `@Entity('name')` | Definir tabla | `@Entity('features')` |
| `@PrimaryGeneratedColumn('uuid')` | UUID auto-generado | `@PrimaryGeneratedColumn('uuid')` |
| `@Column()` | Columna simple | `@Column()` |
| `@Column({ nullable: true })` | Nullable | `@Column({ nullable: true })` |
| `@CreateDateColumn()` | Auto fecha creación | `@CreateDateColumn()` |
| `@UpdateDateColumn()` | Auto fecha actualización | `@UpdateDateColumn()` |
| `@OneToMany()` | Relación 1:N | `@OneToMany(() => Item, item => item.feature)` |
| `@ManyToOne()` | Relación N:1 | `@ManyToOne(() => User, user => user.features)` |
| `@JoinColumn()` | Especificar FK | `@JoinColumn({ name: 'user_id' })` |

## DTOs con class-validator

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
```

## Anti-patrones Prohibidos

| Anti-patrón | Descripción | Solución |
|-------------|-------------|----------|
| Entidad TypeORM en dominio | Usar `@Entity()`, `@Column()` en entidades dominio | Entidades puras TypeScript + entidades TypeORM separadas |
| Acceso a DB desde controller | Queries TypeORM en controller | Usar puertos → use cases → adapters |
| Dependencia directa a infraestructura | Importar TypeORM en application o domain | Usar interfaces (puertos) y DI |
| Lógica de negocio en use cases | Validaciones complejas, reglas de dominio | Mover a entidades de dominio |
| Exponer entidades TypeORM | Retornar `FeatureTypeOrmEntity` desde API | Siempre mapear a DTOs o entidades dominio |
| `any` | Uso de tipo `any` | Tipado estricto en todas las capas |
| Query builder en services | `createQueryBuilder` en application | Usar repository pattern con puertos |
| Sin mapper | Conversión manual entre capas | Mapper obligatorio para cada feature |

## Migraciones TypeORM

```bash
# Generar migración
npx typeorm migration:create -n CreateFeatureTable

# O con CLI de NestJS
npm run typeorm migration:generate -- -n AddFeatureTable

# Ejecutar migraciones
npm run typeorm migration:run

# Revertir última migración
npm run typeorm migration:revert
```

```typescript
// infrastructure/database/migrations/YYYYMMDDHHMMSS-CreateFeatureTable.ts
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateFeatureTableYYYYMMDDHHMMSS implements MigrationInterface {
  name = 'CreateFeatureTableYYYYMMDDHHMMSS';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'features',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid' },
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

## Configuración .env

```env
# .env (no commitear)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=mydatabase

# Firebase
FIREBASE_PROJECT_ID=your-project
FIREBASE_PRIVATE_KEY=your-key
FIREBASE_CLIENT_EMAIL=your-email
```

## Relaciones con TypeORM

```typescript
// Relación 1:N
@Entity('users')
export class UserTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => FeatureTypeOrmEntity, feature => feature.user)
  features: FeatureTypeOrmEntity[];
}

@Entity('features')
export class FeatureTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserTypeOrmEntity, user => user.features)
  @JoinColumn({ name: 'user_id' })
  user: UserTypeOrmEntity;

  @Column({ name: 'user_id' })
  userId: string;
}
```

## Lineamientos completos

`.claude/docs/lineamientos/dev-guidelines.md` — Clean Code, SOLID, Hexagonal Architecture, TypeORM best practices.
