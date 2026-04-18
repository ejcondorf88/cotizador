---
id: SPEC-007
status: DRAFT
feature: add-detailed-logging
created: 2025-01-18
updated: 2025-01-18
author: spec-generator
version: "1.0"
related-specs: ["unify-naming-english"]
---

# Spec: Agregar Logging Detallado en Backend

> **Estado:** `DRAFT` → aprobar con `status: APPROVED` antes de iniciar implementación.
> **Ciclo de vida:** DRAFT → APPROVED → IN_PROGRESS → IMPLEMENTED → DEPRECATED

---

## 1. REQUERIMIENTOS

### Descripción
Implementar un sistema de logging detallado en el backend para trazar el flujo completo de ejecución, facilitar debugging en producción y auditoría de operaciones críticas como la creación de cotizaciones con generación de folios.

### Requerimiento de Negocio
> "Necesitamos logs detallados para ver el flujo completo de ejecución, especialmente en operaciones críticas como la creación de cotizaciones. Queremos poder rastrear: (1) Entrada de requests, (2) Ejecución de casos de uso, (3) Operaciones de base de datos, (4) Transacciones, (5) Errores y excepciones, (6) Respuestas exitosas."

### Historias de Usuario

#### HU-01: Logging de Requests HTTP

```
Como: Desarrollador/DevOps
Quiero: Ver logs de cada request entrante con timestamp, método, path, IP y body
Para: Auditar tráfico y detectar problemas de integración

Prioridad: Alta
Estimación: S
Dependencias: Ninguna
Capa: Backend (Presentation)
```

#### Criterios de Aceptación — HU-01

**Happy Path**
```gherkin
CRITERIO-1.1: Log de request HTTP exitoso
Dado que: Un cliente hace POST /api/v1/quotes
Cuando: La request llega al servidor
Entonces: Se loguea: timestamp, método, path, IP, user-agent, request_id
Y: Se loguea el tiempo de respuesta (duration_ms)
Y: Se loguea el status code de respuesta
```

#### HU-02: Logging de Casos de Uso

```
Como: Desarrollador
Quiero: Ver logs al inicio y fin de cada caso de uso con sus parámetros y resultados
Para: Trazar la lógica de negocio y detectar errores de dominio

Prioridad: Alta
Estimación: S
Dependencias: Ninguna
Capa: Backend (Application)
```

#### Criterios de Aceptación — HU-02

```gherkin
CRITERIO-2.1: Log de ejecución de caso de uso
Dado que: Se ejecuta CreateQuoteUseCase
Cuando: Comienza la ejecución
Entonces: Se loguea: [QUOTE_CREATE_START] with context {year}
Y: Al finalizar se loguea: [QUOTE_CREATE_SUCCESS] with result {id, folioNumber}
Y: Si falla se loguea: [QUOTE_CREATE_ERROR] with error {message, stack}
```

#### HU-03: Logging de Transacciones de Base de Datos

```
Como: Desarrollador
Quiero: Ver logs de operaciones críticas de base de datos (queries, transacciones)
Para: Detectar problemas de concurrencia, deadlocks y performance

Prioridad: Alta
Estimación: M
Dependencias: Ninguna
Capa: Backend (Infrastructure)
```

#### Criterios de Aceptación — HU-03

```gherkin
CRITERIO-3.1: Log de transacción serializable
Dado que: Se ejecuta createWithFolioNumber dentro de transacción SERIALIZABLE
Cuando: Comienza la transacción
Entonces: Se loguea: [DB_TX_START] {isolation_level}
Y: Se loguea cada query ejecutada con parámetros
Y: Se loguea el tiempo de cada query
Y: Se loguea: [DB_TX_COMMIT] o [DB_TX_ROLLBACK] al finalizar
```

#### HU-04: Logging Estructurado con Correlation ID

```
Como: DevOps
Quiero: Que todos los logs de un request tengan el mismo correlation ID
Para: Rastrear el flujo completo de una operación distribuida

Prioridad: Media
Estimación: M
Dependencias: HU-01
Capa: Backend (Todos los layers)
```

#### Criterios de Aceptación — HU-04

```gherkin
CRITERIO-4.1: Correlation ID en toda la cadena
Dado que: Un request entra con header X-Request-ID
Cuando: Se procesa a través de controller, use case, repository
Entonces: Todos los logs llevan el mismo correlation_id
Y: Si no existe header, se genera uno automáticamente (UUID)
Y: El correlation_id se propaga a través de AsyncLocalStorage
```

### Reglas de Negocio

1. **Niveles de log**: 
   - `DEBUG`: Información detallada para desarrollo
   - `INFO`: Flujo normal de operaciones
   - `WARN`: Situaciones no esperadas pero manejables
   - `ERROR`: Errores que requieren atención

2. **Formato estructurado**: JSON para facilitar parsing con herramientas como ELK Stack
   ```json
   {
     "timestamp": "2026-01-18T10:30:00.000Z",
     "level": "INFO",
     "correlation_id": "uuid",
     "service": "ms-core",
     "layer": "application",
     "component": "CreateQuoteUseCase",
     "event": "QUOTE_CREATE_START",
     "message": "Starting quote creation",
     "context": { "year": 2026 },
     "duration_ms": null
   }
   ```

3. **Campos obligatorios en cada log**:
   - `timestamp`: ISO8601 con milisegundos
   - `level`: Nivel del log
   - `correlation_id`: ID de trazabilidad
   - `service`: Nombre del microservicio
   - `layer`: presentation/application/infrastructure/domain
   - `component`: Nombre de la clase/componente
   - `event`: Identificador del evento (ej: QUOTE_CREATE_START)
   - `message`: Descripción legible

4. **Seguridad**: No loguear PII (datos personales), passwords ni tokens

---

## 2. DISEÑO

### Arquitectura de Logging

```
┌─────────────────────────────────────────────────────────────┐
│                    REQUEST MIDDLEWARE                        │
│              (Correlation ID + Request Logger)               │
└──────────────────────┬──────────────────────────────────────┘
                       │ correlation_id en AsyncLocalStorage
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  Controller (QuoteController)                               │
│  ├─ Log: [HTTP_REQUEST_START]                                │
│  └─ Log: [HTTP_RESPONSE_SUCCESS/ERROR]                       │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  Use Case (CreateQuoteUseCase)                               │
│  ├─ Log: [USE_CASE_START]                                    │
│  └─ Log: [USE_CASE_SUCCESS/ERROR]                          │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  Repository (QuoteRepositoryAdapter)                         │
│  ├─ Log: [DB_TX_START]                                       │
│  ├─ Log: [DB_QUERY]                                          │
│  ├─ Log: [DB_TX_COMMIT/ROLLBACK]                           │
│  └─ Log: [DB_OPERATION_SUCCESS/ERROR]                       │
└─────────────────────────────────────────────────────────────┘
```

### Estructura de Carpetas

```
ms-core/src/
├── common/
│   ├── logger/
│   │   ├── logger.module.ts          # NestJS module
│   │   ├── logger.service.ts         # Servicio de logging
│   │   ├── correlation-id.middleware.ts  # Middleware para correlation ID
│   │   └── async-local-storage.ts    # Contexto async para correlation ID
│   └── interceptors/
│       ├── logging.interceptor.ts    # Interceptor HTTP para logging
│       └── timing.interceptor.ts     # Interceptor para medir tiempos
├── presentation/
│   └── filters/
│       └── http-exception.filter.ts  # Filtro global de excepciones con logging
```

### Dependencias

```bash
# NestJS logger integrado (ya incluido)
# Para logging estructurado en producción:
npm install nest-winston winston winston-daily-rotate-file
```

### Configuración de Winston (Producción)

**infrastructure/logger/winston.config.ts**
```typescript
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

export const winstonConfig = WinstonModule.createLogger({
  transports: [
    // Consola para desarrollo
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
    // Archivos rotativos para producción
    new DailyRotateFile({
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: winston.format.json(),
    }),
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: winston.format.json(),
    }),
  ],
});
```

### Implementación del Logger Service

**common/logger/logger.service.ts**
```typescript
import { Injectable, Logger } from '@nestjs/common';
import { getCorrelationId } from './async-local-storage';

interface LogContext {
  [key: string]: unknown;
}

@Injectable()
export class StructuredLogger {
  private readonly logger = new Logger('StructuredLogger');

  private formatLog(
    level: string,
    layer: string,
    component: string,
    event: string,
    message: string,
    context?: LogContext,
    durationMs?: number,
  ): string {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      correlation_id: getCorrelationId() || 'unknown',
      service: 'ms-core',
      layer,
      component,
      event,
      message,
      context,
      duration_ms: durationMs,
    };
    return JSON.stringify(logEntry);
  }

  info(
    layer: string,
    component: string,
    event: string,
    message: string,
    context?: LogContext,
    durationMs?: number,
  ): void {
    this.logger.log(
      this.formatLog('INFO', layer, component, event, message, context, durationMs),
    );
  }

  error(
    layer: string,
    component: string,
    event: string,
    message: string,
    error: Error,
    context?: LogContext,
  ): void {
    this.logger.error(
      this.formatLog('ERROR', layer, component, event, message, {
        ...context,
        error_message: error.message,
        error_stack: error.stack,
      }),
    );
  }

  debug(
    layer: string,
    component: string,
    event: string,
    message: string,
    context?: LogContext,
  ): void {
    this.logger.debug(
      this.formatLog('DEBUG', layer, component, event, message, context),
    );
  }
}
```

### Middleware de Correlation ID

**common/logger/correlation-id.middleware.ts**
```typescript
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuid } from 'uuid';
import { setCorrelationId } from './async-local-storage';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const correlationId = req.headers['x-request-id'] as string || uuid();
    setCorrelationId(correlationId);
    res.setHeader('x-request-id', correlationId);
    next();
  }
}
```

### Async Local Storage

**common/logger/async-local-storage.ts**
```typescript
import { AsyncLocalStorage } from 'async_hooks';

const asyncLocalStorage = new AsyncLocalStorage<string>();

export function setCorrelationId(id: string): void {
  asyncLocalStorage.run(id, () => {});
}

export function getCorrelationId(): string | undefined {
  return asyncLocalStorage.getStore();
}
```

### Interceptor HTTP para Logging

**common/interceptors/logging.interceptor.ts**
```typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { StructuredLogger } from '../logger/logger.service';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: StructuredLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip, body } = request;
    const startTime = Date.now();

    this.logger.info(
      'presentation',
      'HttpLoggingInterceptor',
      'HTTP_REQUEST_START',
      `${method} ${url}`,
      { method, url, ip, body: this.sanitizeBody(body) },
    );

    return next.handle().pipe(
      tap({
        next: (data) => {
          const duration = Date.now() - startTime;
          this.logger.info(
            'presentation',
            'HttpLoggingInterceptor',
            'HTTP_RESPONSE_SUCCESS',
            `${method} ${url} completed`,
            { method, url, statusCode: 200 },
            duration,
          );
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          this.logger.error(
            'presentation',
            'HttpLoggingInterceptor',
            'HTTP_RESPONSE_ERROR',
            `${method} ${url} failed`,
            error,
            { method, url, statusCode: error.status },
            duration,
          );
        },
      }),
    );
  }

  private sanitizeBody(body: unknown): unknown {
    if (!body || typeof body !== 'object') return body;
    const sanitized = { ...body } as Record<string, unknown>;
    delete sanitized.password;
    delete sanitized.token;
    delete sanitized.secret;
    return sanitized;
  }
}
```

### Logs en Capas Específicas

#### Controller (QuoteController)

```typescript
@Controller('quotes')
export class QuoteController {
  private readonly logger = new Logger(QuoteController.name);

  constructor(
    private readonly createQuoteUseCase: CreateQuoteUseCase,
    private readonly structuredLogger: StructuredLogger,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(): Promise<QuoteResponseDto> {
    this.structuredLogger.info(
      'presentation',
      'QuoteController',
      'QUOTE_CREATE_REQUEST',
      'Received request to create quote',
    );

    try {
      const quote = await this.createQuoteUseCase.execute();
      
      this.structuredLogger.info(
        'presentation',
        'QuoteController',
        'QUOTE_CREATE_SUCCESS',
        'Quote created successfully',
        { quoteId: quote.id, folioNumber: quote.folioNumber },
      );

      return QuoteMapper.toResponseDto(quote);
    } catch (error) {
      this.structuredLogger.error(
        'presentation',
        'QuoteController',
        'QUOTE_CREATE_ERROR',
        'Failed to create quote',
        error as Error,
      );
      throw error;
    }
  }
}
```

#### Use Case (CreateQuoteUseCase)

```typescript
@Injectable()
export class CreateQuoteUseCase {
  constructor(
    @Inject('QuoteRepositoryPort')
    private readonly quoteRepo: QuoteRepositoryPort,
    private readonly logger: StructuredLogger,
  ) {}

  async execute(): Promise<Quote> {
    const startTime = Date.now();
    const year = new Date().getFullYear();

    this.logger.info(
      'application',
      'CreateQuoteUseCase',
      'USE_CASE_START',
      'Starting quote creation use case',
      { year },
    );

    try {
      const quote = await this.quoteRepo.createWithFolioNumber(year);
      
      const duration = Date.now() - startTime;
      this.logger.info(
        'application',
        'CreateQuoteUseCase',
        'USE_CASE_SUCCESS',
        'Quote created successfully',
        { 
          quoteId: quote.id, 
          folioNumber: quote.folioNumber,
          status: quote.status,
        },
        duration,
      );

      return quote;
    } catch (error) {
      this.logger.error(
        'application',
        'CreateQuoteUseCase',
        'USE_CASE_ERROR',
        'Failed to create quote',
        error as Error,
        { year },
      );
      throw error;
    }
  }
}
```

#### Repository (QuoteRepositoryAdapter)

```typescript
@Injectable()
export class QuoteRepositoryAdapter implements QuoteRepositoryPort {
  constructor(
    @InjectRepository(QuoteTypeOrmEntity)
    private readonly quoteRepo: Repository<QuoteTypeOrmEntity>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly logger: StructuredLogger,
  ) {}

  async createWithFolioNumber(year: number): Promise<Quote> {
    const txStartTime = Date.now();
    
    this.logger.info(
      'infrastructure',
      'QuoteRepositoryAdapter',
      'DB_TX_START',
      'Starting transaction for quote creation',
      { year, isolationLevel: 'SERIALIZABLE' },
    );

    return this.entityManager.transaction(
      'SERIALIZABLE',
      async (transactionalEntityManager) => {
        try {
          // Get last folio with lock
          const queryStart = Date.now();
          const lastQuote = await transactionalEntityManager
            .createQueryBuilder(QuoteTypeOrmEntity, 'quote')
            .setLock('pessimistic_write')
            .where('quote.folioNumber LIKE :prefix', { prefix: `COT-${year}-%` })
            .orderBy('quote.folioNumber', 'DESC')
            .getOne();

          this.logger.debug(
            'infrastructure',
            'QuoteRepositoryAdapter',
            'DB_QUERY',
            'Executed query to get last folio',
            { 
              query: 'SELECT ... WITH LOCK',
              durationMs: Date.now() - queryStart,
              found: !!lastQuote,
            },
          );

          // Calculate next number
          let nextNumber = 1;
          if (lastQuote) {
            const match = lastQuote.folioNumber.match(/COT-\d{4}-(\d{5})/);
            if (match) {
              nextNumber = parseInt(match[1], 10) + 1;
            }
          }

          const folioNumber = `COT-${year}-${String(nextNumber).padStart(5, '0')}`;
          
          this.logger.debug(
            'infrastructure',
            'QuoteRepositoryAdapter',
            'FOLIO_CALCULATED',
            'Calculated next folio number',
            { folioNumber, year, sequenceNumber: nextNumber },
          );

          // Create and save quote
          const quote = Quote.create(folioNumber);
          const entity = QuoteMapper.toEntity(quote);
          
          const insertStart = Date.now();
          const saved = await transactionalEntityManager.save(
            QuoteTypeOrmEntity, 
            entity,
          );

          this.logger.debug(
            'infrastructure',
            'QuoteRepositoryAdapter',
            'DB_INSERT',
            'Inserted quote into database',
            { 
              quoteId: saved.id,
              folioNumber: saved.folioNumber,
              durationMs: Date.now() - insertStart,
            },
          );

          const txDuration = Date.now() - txStartTime;
          this.logger.info(
            'infrastructure',
            'QuoteRepositoryAdapter',
            'DB_TX_COMMIT',
            'Transaction committed successfully',
            { 
              quoteId: saved.id,
              folioNumber: saved.folioNumber,
            },
            txDuration,
          );

          return QuoteMapper.toDomain(saved);
        } catch (error) {
          this.logger.error(
            'infrastructure',
            'QuoteRepositoryAdapter',
            'DB_TX_ROLLBACK',
            'Transaction rolled back due to error',
            error as Error,
            { year, durationMs: Date.now() - txStartTime },
          );
          throw error;
        }
      }
    );
  }
}
```

### Ejemplo de Output de Logs

**Request Exitoso:**
```json
{"timestamp":"2026-01-18T10:30:00.123Z","level":"INFO","correlation_id":"abc-123","service":"ms-core","layer":"presentation","component":"HttpLoggingInterceptor","event":"HTTP_REQUEST_START","message":"POST /api/v1/quotes","context":{"method":"POST","url":"/api/v1/quotes","ip":"127.0.0.1"}}
{"timestamp":"2026-01-18T10:30:00.124Z","level":"INFO","correlation_id":"abc-123","service":"ms-core","layer":"presentation","component":"QuoteController","event":"QUOTE_CREATE_REQUEST","message":"Received request to create quote"}
{"timestamp":"2026-01-18T10:30:00.125Z","level":"INFO","correlation_id":"abc-123","service":"ms-core","layer":"application","component":"CreateQuoteUseCase","event":"USE_CASE_START","message":"Starting quote creation use case","context":{"year":2026}}
{"timestamp":"2026-01-18T10:30:00.126Z","level":"INFO","correlation_id":"abc-123","service":"ms-core","layer":"infrastructure","component":"QuoteRepositoryAdapter","event":"DB_TX_START","message":"Starting transaction for quote creation","context":{"year":2026,"isolationLevel":"SERIALIZABLE"}}
{"timestamp":"2026-01-18T10:30:00.127Z","level":"DEBUG","correlation_id":"abc-123","service":"ms-core","layer":"infrastructure","component":"QuoteRepositoryAdapter","event":"DB_QUERY","message":"Executed query to get last folio","context":{"query":"SELECT ... WITH LOCK","durationMs":1,"found":true}}
{"timestamp":"2026-01-18T10:30:00.128Z","level":"DEBUG","correlation_id":"abc-123","service":"ms-core","layer":"infrastructure","component":"QuoteRepositoryAdapter","event":"FOLIO_CALCULATED","message":"Calculated next folio number","context":{"folioNumber":"COT-2026-00042","year":2026,"sequenceNumber":42}}
{"timestamp":"2026-01-18T10:30:00.129Z","level":"DEBUG","correlation_id":"abc-123","service":"ms-core","layer":"infrastructure","component":"QuoteRepositoryAdapter","event":"DB_INSERT","message":"Inserted quote into database","context":{"quoteId":"uuid","folioNumber":"COT-2026-00042","durationMs":1}}
{"timestamp":"2026-01-18T10:30:00.130Z","level":"INFO","correlation_id":"abc-123","service":"ms-core","layer":"infrastructure","component":"QuoteRepositoryAdapter","event":"DB_TX_COMMIT","message":"Transaction committed successfully","context":{"quoteId":"uuid","folioNumber":"COT-2026-00042"},"duration_ms":4}
{"timestamp":"2026-01-18T10:30:00.131Z","level":"INFO","correlation_id":"abc-123","service":"ms-core","layer":"application","component":"CreateQuoteUseCase","event":"USE_CASE_SUCCESS","message":"Quote created successfully","context":{"quoteId":"uuid","folioNumber":"COT-2026-00042","status":"DRAFT"},"duration_ms":6}
{"timestamp":"2026-01-18T10:30:00.132Z","level":"INFO","correlation_id":"abc-123","service":"ms-core","layer":"presentation","component":"QuoteController","event":"QUOTE_CREATE_SUCCESS","message":"Quote created successfully","context":{"quoteId":"uuid","folioNumber":"COT-2026-00042"}}
{"timestamp":"2026-01-18T10:30:00.133Z","level":"INFO","correlation_id":"abc-123","service":"ms-core","layer":"presentation","component":"HttpLoggingInterceptor","event":"HTTP_RESPONSE_SUCCESS","message":"POST /api/v1/quotes completed","context":{"method":"POST","url":"/api/v1/quotes","statusCode":201},"duration_ms":10}
```

---

## 3. LISTA DE TAREAS

### Fase 1: Setup del Logger

- [ ] Instalar dependencias: `nest-winston`, `winston`, `winston-daily-rotate-file`
- [ ] Crear `common/logger/winston.config.ts` con configuración de transportes
- [ ] Crear `common/logger/logger.module.ts` con registro del servicio
- [ ] Crear `common/logger/logger.service.ts` con StructuredLogger
- [ ] Crear `common/logger/async-local-storage.ts` para correlation ID
- [ ] Crear `common/logger/correlation-id.middleware.ts`
- [ ] Crear `common/logger/index.ts` para exports

### Fase 2: Interceptores y Middleware

- [ ] Crear `common/interceptors/logging.interceptor.ts`
- [ ] Crear `common/interceptors/timing.interceptor.ts`
- [ ] Crear `presentation/filters/http-exception.filter.ts` con logging de errores
- [ ] Registrar middleware en `app.module.ts`
- [ ] Registrar interceptores globalmente en `main.ts`

### Fase 3: Agregar Logs en Capas Existentes

#### Controller Layer
- [ ] Inyectar StructuredLogger en `QuoteController`
- [ ] Agregar log `QUOTE_CREATE_REQUEST` al inicio de POST
- [ ] Agregar log `QUOTE_CREATE_SUCCESS` al finalizar exitosamente
- [ ] Agregar log `QUOTE_CREATE_ERROR` en catch block

#### Application Layer  
- [ ] Inyectar StructuredLogger en `CreateQuoteUseCase`
- [ ] Agregar log `USE_CASE_START` al inicio de execute()
- [ ] Agregar log `USE_CASE_SUCCESS` con duration al finalizar
- [ ] Agregar log `USE_CASE_ERROR` con error details

#### Infrastructure Layer
- [ ] Inyectar StructuredLogger en `QuoteRepositoryAdapter`
- [ ] Agregar log `DB_TX_START` al inicio de transacción
- [ ] Agregar log `DB_QUERY` para cada query ejecutada
- [ ] Agregar log `FOLIO_CALCULATED` con valores calculados
- [ ] Agregar log `DB_INSERT` con resultado
- [ ] Agregar log `DB_TX_COMMIT` o `DB_TX_ROLLBACK` al finalizar

### Fase 4: Configuración por Ambiente

- [ ] Crear `.env` entries: `LOG_LEVEL`, `LOG_FORMAT`
- [ ] Configurar logger diferente para development (coloreado) vs production (JSON)
- [ ] Agregar validación de variables de entorno
- [ ] Configurar rotación de archivos de log

### Fase 5: Testing y Verificación

- [ ] Ejecutar `npm run build` sin errores
- [ ] Iniciar servidor y verificar logs en consola
- [ ] Hacer POST /api/v1/quotes y verificar flujo completo de logs
- [ ] Verificar correlation_id es el mismo en toda la cadena
- [ ] Simular error y verificar log de error con stack trace
- [ ] Verificar que no se loguea información sensible (passwords)

### Fase 6: Documentación

- [ ] Actualizar `README.md` con sección de logging
- [ ] Documentar cómo leer logs estructurados
- [ ] Agregar ejemplos de búsquedas comunes
- [ ] Actualizar spec a `status: IMPLEMENTED`

### QA
- [ ] Verificar que todos los logs tienen correlation_id
- [ ] Verificar formato JSON válido en production
- [ ] Verificar que no hay PII en logs
- [ ] Verificar performance: logging no debe afectar tiempos de respuesta

---

## Notas de Implementación

### Correlation ID Header
El frontend debe enviar header `X-Request-ID` para trazabilidad end-to-end:
```typescript
// frontend service
const response = await axios.post('/api/v1/quotes', {}, {
  headers: {
    'X-Request-ID': crypto.randomUUID(),
  },
});
```

### Performance
- Logs DEBUG deben estar deshabilitados en producción (`LOG_LEVEL=INFO`)
- Usar `AsyncLocalStorage` tiene overhead mínimo (~1-2 microsegundos)
- Logs síncronos pueden bloquear, considerar `winston-async` para alta carga

### Seguridad
- Siempre sanitizar body antes de loguear
- Nunca loguear: passwords, tokens JWT, secrets, tarjetas de crédito
- Usar `level: 'error'` para errores de seguridad (intentos de acceso no autorizado)

---
*Fin de la especificación*
