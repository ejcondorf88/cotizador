---
id: SPEC-003
status: DRAFT
feature: cotizador-backend
created: 2025-01-18
updated: 2025-01-18
author: spec-generator
version: "1.0"
related-specs: ["segurax-homepage"]
---

# Spec: Backend Cotizador - SeguraX

> **Estado:** `DRAFT` → aprobar con `status: APPROVED` antes de iniciar implementación.
> **Ciclo de vida:** DRAFT → APPROVED → IN_PROGRESS → IMPLEMENTED → DEPRECATED

---

## 1. REQUERIMIENTOS

### Descripción
Backend API simple para el cotizador de SeguraX. Un único endpoint POST que crea un ticket con folio autogenerado y estado BORRADOR. **Sin autenticación**. Implementado con NestJS, Arquitectura Hexagonal, PostgreSQL y TypeORM.

### Requerimiento de Negocio
> "Cuando den clic en cotizar, hacer la llamada a API. Esta va a crear un nuevo ticket con los campos: id, numero_folio, estado. Por defecto el numero de folio va a ser autoincremental. El estado por defecto va a ser BORRADOR. Sin autenticación ni autorización por ahora."
>
> Stack: NestJS con Arquitectura Hexagonal + PostgreSQL + TypeORM

### Historias de Usuario

#### HU-01: Crear Nueva Cotización

```
Como: Agente de SeguraX
Quiero: Crear una nueva cotización desde el frontend
Para: Iniciar el proceso de cotización para un cliente

Prioridad: Alta
Estimación: M
Dependencias: Ninguna
Capa: Backend
```

#### Criterios de Aceptación — HU-01

**Happy Path**
```gherkin
CRITERIO-1.1: Creación exitosa de cotización
Dado que: El usuario hace clic en "Nueva Cotización"
Cuando: Se envía POST /api/v1/cotizaciones (sin body, sin auth)
Entonces: El sistema crea una nueva cotización con:
  - id: UUID generado automáticamente
  - numero_folio: formato COT-{YYYY}-{NNNNN} (autoincremental)
  - estado: "BORRADOR"
  - fecha_creacion: timestamp actual
Y: Retorna HTTP 201 con los datos de la cotización creada
Y: El folio sigue el patrón COT-2024-00001, COT-2024-00002, etc.
```

**Error Path**
```gherkin
CRITERIO-1.2: Error de generación de folio
Dado que: Hay un problema con la base de datos
Cuando: Intenta crear una cotización
Entonces: Retorna HTTP 500 Internal Server Error
Y: El mensaje indica "Error al generar cotización"
```

### Reglas de Negocio

1. **Generación de Folio**: El número de folio debe seguir el formato `COT-{YYYY}-{NNNNN}` donde:
   - COT: prefijo fijo
   - YYYY: año actual (4 dígitos)
   - NNNNN: número secuencial de 5 dígitos con ceros a la izquierda
   - Ejemplo: `COT-2024-00001`, `COT-2024-00042`, `COT-2025-00001`

2. **Estado**: El estado inicial siempre será "BORRADOR".

3. **Autenticación**: **NO requerida** en esta versión.

4. **Unicidad**: El numero_folio debe ser único en todo el sistema.

5. **Timestamps**: Toda cotización debe tener fecha_creacion y fecha_actualizacion automáticas.

---

## 2. DISEÑO

### Modelos de Datos

#### Entidad: Cotizacion
| Campo | Tipo DB | Constraints | Descripción |
|-------|---------|-------------|-------------|
| `id` | uuid | PRIMARY KEY, GENERATED | ID único |
| `numero_folio` | varchar(20) | UNIQUE, NOT NULL | Folio autogenerado |
| `estado` | varchar(20) | NOT NULL, DEFAULT 'BORRADOR' | Estado |
| `fecha_creacion` | timestamp | DEFAULT now() | Fecha creación |
| `fecha_actualizacion` | timestamp | DEFAULT now() | Fecha actualización |

#### Índices
- **PRIMARY KEY** en `id`
- **UNIQUE** en `numero_folio`

### Arquitectura Hexagonal (Simplificada)

```
backend/src/
├── domain/
│   └── cotizacion/
│       ├── entities/
│       │   └── cotizacion.entity.ts
│       └── ports/
│           └── cotizacion.repository.port.ts
├── application/
│   └── cotizacion/
│       ├── use-cases/
│       │   └── crear-cotizacion.use-case.ts
│       └── dto/
│           └── crear-cotizacion.dto.ts
├── infrastructure/
│   ├── database/
│   │   └── typeorm.config.ts
│   └── cotizacion/
│       ├── entities/
│       │   └── cotizacion.typeorm.entity.ts
│       ├── adapters/
│       │   └── cotizacion-repository.adapter.ts
│       └── mappers/
│           └── cotizacion.mapper.ts
└── presentation/
    └── cotizacion/
        ├── cotizacion.controller.ts
        └── cotizacion.module.ts
```

### API Endpoint

#### POST /api/v1/cotizaciones
- **Descripción**: Crea una nueva cotización con folio autogenerado
- **Auth requerida**: **NO**
- **Request Body**: Vacío
- **Response 201**:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "numeroFolio": "COT-2024-00042",
  "estado": "BORRADOR",
  "fechaCreacion": "2024-01-18T10:30:00.000Z",
  "fechaActualizacion": "2024-01-18T10:30:00.000Z"
}
```
- **Response 500**: Error interno del servidor

### Diseño Backend (Arquitectura Hexagonal)

#### Entidad de Dominio
```typescript
// domain/cotizacion/entities/cotizacion.entity.ts
export class Cotizacion {
  constructor(
    public readonly id: string,
    public readonly numeroFolio: string,
    public estado: string,
    public readonly fechaCreacion: Date,
    public fechaActualizacion: Date,
  ) {}

  static crear(numeroFolio: string): Cotizacion {
    return new Cotizacion(
      uuid(),
      numeroFolio,
      'BORRADOR',
      new Date(),
      new Date(),
    );
  }
}
```

#### Puerto
```typescript
// domain/cotizacion/ports/cotizacion.repository.port.ts
export interface CotizacionRepositoryPort {
  crear(cotizacion: Cotizacion): Promise<Cotizacion>;
  obtenerUltimoFolioDelYear(year: number): Promise<number>;
}
```

#### Use Case
```typescript
// application/cotizacion/use-cases/crear-cotizacion.use-case.ts
@Injectable()
export class CrearCotizacionUseCase {
  constructor(
    @Inject('CotizacionRepositoryPort')
    private readonly cotizacionRepo: CotizacionRepositoryPort,
  ) {}

  async execute(): Promise<Cotizacion> {
    const year = new Date().getFullYear();
    const ultimoNumero = await this.cotizacionRepo.obtenerUltimoFolioDelYear(year);
    const numeroFolio = `COT-${year}-${String(ultimoNumero + 1).padStart(5, '0')}`;
    
    const cotizacion = Cotizacion.crear(numeroFolio);
    return this.cotizacionRepo.crear(cotizacion);
  }
}
```

#### Entity TypeORM
```typescript
// infrastructure/cotizacion/entities/cotizacion.typeorm.entity.ts
@Entity('cotizaciones')
export class CotizacionTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'numero_folio', unique: true, length: 20 })
  numeroFolio: string;

  @Column({ name: 'estado', default: 'BORRADOR', length: 20 })
  estado: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;
}
```

#### Adaptador
```typescript
// infrastructure/cotizacion/adapters/cotizacion-repository.adapter.ts
@Injectable()
export class CotizacionRepositoryAdapter implements CotizacionRepositoryPort {
  constructor(
    @InjectRepository(CotizacionTypeOrmEntity)
    private readonly typeormRepo: Repository<CotizacionTypeOrmEntity>,
  ) {}

  async crear(cotizacion: Cotizacion): Promise<Cotizacion> {
    const entity = CotizacionMapper.toTypeOrm(cotizacion);
    const saved = await this.typeormRepo.save(entity);
    return CotizacionMapper.toDomain(saved);
  }

  async obtenerUltimoFolioDelYear(year: number): Promise<number> {
    const prefix = `COT-${year}-`;
    const result = await this.typeormRepo
      .createQueryBuilder('c')
      .where('c.numeroFolio LIKE :prefix', { prefix: `${prefix}%` })
      .orderBy('c.numeroFolio', 'DESC')
      .getOne();
    
    if (!result) return 0;
    return parseInt(result.numeroFolio.replace(prefix, ''), 10);
  }
}
```

#### Mapper
```typescript
// infrastructure/cotizacion/mappers/cotizacion.mapper.ts
export class CotizacionMapper {
  static toDomain(entity: CotizacionTypeOrmEntity): Cotizacion {
    return new Cotizacion(
      entity.id,
      entity.numeroFolio,
      entity.estado,
      entity.fechaCreacion,
      entity.fechaActualizacion,
    );
  }

  static toTypeOrm(entity: Cotizacion): CotizacionTypeOrmEntity {
    const typeormEntity = new CotizacionTypeOrmEntity();
    typeormEntity.id = entity.id;
    typeormEntity.numeroFolio = entity.numeroFolio;
    typeormEntity.estado = entity.estado;
    typeormEntity.fechaCreacion = entity.fechaCreacion;
    typeormEntity.fechaActualizacion = entity.fechaActualizacion;
    return typeormEntity;
  }
}
```

#### Controller (Sin Auth)
```typescript
// presentation/cotizacion/cotizacion.controller.ts
@Controller('api/v1/cotizaciones')
export class CotizacionController {
  constructor(
    private readonly crearCotizacionUseCase: CrearCotizacionUseCase,
  ) {}

  @Post()
  async crear(): Promise<CotizacionResponseDto> {
    const cotizacion = await this.crearCotizacionUseCase.execute();
    return CotizacionMapper.toResponseDto(cotizacion);
  }
}
```

### Arquitectura y Dependencias

**Stack:**
- NestJS 10+ con TypeScript
- TypeORM 0.3+ para PostgreSQL
- PostgreSQL 15+

**Paquetes:**
```bash
npm install @nestjs/core @nestjs/common @nestjs/platform-express @nestjs/typeorm typeorm pg uuid
npm install -D @types/node @types/uuid
```

---

## 3. LISTA DE TAREAS

### Backend

#### Setup
- [ ] Inicializar proyecto NestJS: `nest new backend`
- [ ] Configurar TypeORM con PostgreSQL
- [ ] Instalar dependencias

#### Dominio
- [ ] Crear entidad `Cotizacion`
- [ ] Crear puerto `CotizacionRepositoryPort`

#### Aplicación
- [ ] Crear DTOs
- [ ] Crear use case `CrearCotizacionUseCase`

#### Infraestructura
- [ ] Crear entity TypeORM
- [ ] Crear adapter `CotizacionRepositoryAdapter`
- [ ] Crear mapper `CotizacionMapper`
- [ ] Crear migración

#### Presentación
- [ ] Crear controller (sin auth)
- [ ] Crear module
- [ ] Registrar en `app.module.ts`

#### Tests
- [ ] Test: crear cotización genera folio único
- [ ] Test: folio tiene formato correcto
- [ ] Test: estado por defecto es BORRADOR
