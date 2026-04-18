---
description: Reglas de acceso a datos para este proyecto (PostgreSQL + TypeORM + Arquitectura Hexagonal). Se aplica automáticamente a archivos de base de datos.
paths:
  - "**/infrastructure/database/**"
  - "**/infrastructure/**/adapters/**"
  - "**/infrastructure/**/entities/**"
  - "**/infrastructure/**/mappers/**"
  - "**/domain/**/ports/**"
  - "**/infrastructure/**/migrations/**"
---

# Reglas de Base de Datos — PostgreSQL + TypeORM + Arquitectura Hexagonal

## Stack Aprobado

- **PostgreSQL** — base de datos relacional (prohibido MongoDB)
- **TypeORM** — ORM type-safe para PostgreSQL
- **TypeORM Repository** — acceso a datos desde adaptadores
- **TypeORM Migrations** — migraciones de esquema
- **Domain-Driven Design** — entidades de dominio puras

**Prohibido:**
- MongoDB, Mongoose, Motor
- Prisma, Sequelize, Knex.js
- SQL nativo sin TypeORM
- Acceso directo a PostgreSQL sin TypeORM Repository
- Entidades de TypeORM expuestas al dominio
- Decoradores TypeORM en entidades de dominio

## Arquitectura de Datos (Hexagonal)

```
┌─────────────────────────────────────────────────────────┐
│                       DOMINIO                           │
│              entities/<feature>.entity.ts               │
│                  (pura TypeScript)                      │
└─────────────────────────┬───────────────────────────────┘
                          │
                    ┌──────┴──────┐
                    │     Port      │
                    │ (interface)   │
                    └──────┬────────┘
                           │
┌──────────────────────────┼───────────────────────────────┐
│               INFRAESTRUCTURA                           │
│   ┌──────────────────────┼───────────────────────────┐  │
│   │    TypeORM Schema    │        Repository         │  │
│   │  (decoradores)       │       Adapter             │  │
│   │  • @Entity()         │   (implementa puerto)     │  │
│   │  • @Column()         │   • TypeORM Repository    │  │
│   │  • @OneToMany()      │   • Mapper to/from domain │  │
│   └──────────────────────┴───────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Estructura de Archivos

```
backend/src/
├── domain/
│   └── <feature>/
│       ├── entities/
│       │   └── <feature>.entity.ts          # Entidad pura
│       └── ports/
│           └── <feature>.repository.port.ts  # Interface
│
├── infrastructure/
│   ├── database/
│   │   ├── typeorm.config.ts               # Configuración
│   │   ├── database.module.ts              # Módulo TypeORM
│   │   └── migrations/                     # Migraciones
│   │       └── YYYYMMDDHHMMSS-*.ts
│   └── <feature>/
│       ├── adapters/
│       │   └── <feature>-repository.adapter.ts  # Implementa puerto
│       ├── entities/
│       │   └── <feature>.typeorm.entity.ts      # Entidad TypeORM
│       └── mappers/
│           └── <feature>.mapper.ts              # Conversión obligatoria
```

## Entidad de Dominio (Pura)

```typescript
// ✅ CORRECTO: Entidad sin dependencias externas
// domain/feature/feature.entity.ts
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
    this.name = newName;
    this.updatedAt = new Date();
  }
}
```

## Entidad TypeORM (Infraestructura)

```typescript
// ✅ CORRECTO: Entidad TypeORM separada en infraestructura
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

## Puerto del Repositorio (Interface)

```typescript
// ✅ CORRECTO: Contrato que define el dominio
// domain/feature/ports/feature.repository.port.ts
export interface FeatureRepositoryPort {
  create(feature: Feature): Promise<Feature>;
  findById(id: string): Promise<Feature | null>;
  findAll(): Promise<Feature[]>;
  update(id: string, feature: Feature): Promise<Feature>;
  delete(id: string): Promise<void>;
}
```

## Adaptador del Repositorio

```typescript
// ✅ CORRECTO: Implementa el puerto usando TypeORM
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
    if (!updated) throw new Error('Feature not found');
    return FeatureMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.typeormRepo.delete(id);
  }
}
```

## Mapper Obligatorio

```typescript
// ✅ CORRECTO: Mapper entre TypeORM y Dominio
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

## Tipos de Datos PostgreSQL → TypeScript

| PostgreSQL | TypeORM | TypeScript |
|------------|---------|------------|
| `uuid` | `@PrimaryGeneratedColumn('uuid')` | `string` |
| `varchar(n)` | `@Column({ length: n })` | `string` |
| `text` | `@Column('text')` | `string` |
| `integer` | `@Column('int')` | `number` |
| `bigint` | `@Column('bigint')` | `bigint` |
| `decimal` | `@Column('decimal')` | `number` |
| `boolean` | `@Column('boolean')` | `boolean` |
| `timestamp` | `@CreateDateColumn()` / `@UpdateDateColumn()` | `Date` |
| `json` | `@Column('json')` | `object` |
| `enum` | `@Column({ enum: MyEnum })` | `enum` |

## Convenciones de Naming

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| **Tabla** | lowercase, plural | `features`, `users` |
| **Columna** | camelCase | `createdAt`, `updatedAt` |
| **Entidad dominio** | PascalCase | `Feature`, `User` |
| **Entidad TypeORM** | PascalCase + TypeOrmEntity | `FeatureTypeOrmEntity` |
| **Puerto** | PascalCase + Port | `FeatureRepositoryPort` |
| **Adapter** | PascalCase + Adapter | `FeatureRepositoryAdapter` |
| **Mapper** | PascalCase + Mapper | `FeatureMapper` |

## Migraciones

```bash
# Crear migración manualmente
npx typeorm migration:create -n CreateFeatureTable

# Generar migración automáticamente desde entidades
npx typeorm migration:generate -n AddFeatureTable

# Ejecutar migraciones
npx typeorm migration:run

# Revertir última migración
npx typeorm migration:revert

# Ver estado de migraciones
npx typeorm migration:show
```

## Ejemplo de Migración

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

## Configuración TypeORM

```typescript
// infrastructure/database/typeorm.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [join(__dirname, '../**/*.typeorm.entity.{ts,js}')],
  migrations: [join(__dirname, 'migrations/**/*.{ts,js}')],
  synchronize: false, // Siempre usar migraciones en producción
  migrationsRun: true,
  logging: process.env.NODE_ENV === 'development',
};

// app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    // ...
  ],
})
export class AppModule {}
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

## Índices

```typescript
@Entity('features')
@Index(['name'])
@Index(['status'])
@Index(['name', 'status'])  // Índice compuesto
export class FeatureTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  status: string;
}
```

## Anti-patrones Prohibidos

| Anti-patrón | Razón | Solución |
|-------------|-------|----------|
| Entidad TypeORM en dominio | Acopla dominio a infraestructura | Entidad pura + entidad TypeORM separada |
| `getRepository()` sin DI | Pierde testeabilidad | Usar `@InjectRepository()` |
| `any` en queries | Pierde type safety | Tipos explícitos siempre |
| Sin mapper | Conversión manual, error-prone | Mapper obligatorio |
| Acceso a DB desde use case | Viola hexagonal | Usar puerto → adapter |
| Decoradores TypeORM en dominio | Acopla a ORM | Mantener entidades puras |
| Sincronización automática en prod | Riesgo de pérdida de datos | Usar migraciones siempre |
| Relaciones sin índices | Performance | `@Index()` en foreign keys |

## Comandos Útiles

```bash
# Sincronizar esquema (solo desarrollo)
npx typeorm schema:sync

# Generar DDL
npx typeorm schema:log

# Borrar esquema (cuidado!)
npx typeorm schema:drop

# Ejecutar query directo
npx typeorm query "SELECT * FROM features"

# Abrir CLI
npx typeorm -d ./dist/config/typeorm.config.js
```

## Configuración .env

```env
# .env (no commitear)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=mydatabase
```

## Lineamientos

`.claude/docs/lineamientos/dev-guidelines.md` — DDD, Hexagonal Architecture, PostgreSQL, TypeORM best practices.
