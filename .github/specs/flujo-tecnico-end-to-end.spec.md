---
id: SPEC-023
status: DRAFT
feature: flujo-tecnico-end-to-end
created: 2026-04-21
updated: 2026-04-21
author: spec-generator
version: "1.0"
related-specs:
  - SPEC-021
  - SPEC-016
  - SPEC-022
---

# SPEC-023: Flujo Tecnico End-to-End

> **Estado:** `DRAFT` → aprobar con `status: APPROVED` antes de iniciar implementacion.

---

## 1. REQUERIMIENTOS

### 1.1 Descripcion

Documentar y validar el **flujo tecnico completo** de una peticion HTTP desde el frontend, pasando por el API Gateway, llegando al microservicio correspondiente, interactuando con la base de datos, y retornando la respuesta al cliente.

### 1.2 Historia de Usuario

```
Como: Arquitecto de Software
Quiero: Visualizar el flujo completo de una peticion end-to-end
Para: Entender el recorrido de los datos, identificar cuellos de botella y depurar problemas

Prioridad: Alta
Estimacion: L
Tipo: Documentacion Tecnica + Tests de Integracion
```

### 1.3 Flujo Tecnico - Paso a Paso

#### Paso 1: Frontend (React + Axios)
```
Usuario -> Componente React -> Hook (useState/useEffect)
  -> Service Layer (axios) 
  -> Request Interceptor (JWT, X-Request-ID)
  -> HTTP GET/POST/PUT/DELETE
  -> URL: http://localhost:8080/api/v1/catalogos/giros
```

#### Paso 2: API Gateway (Spring Cloud Gateway :8080)
```
Recibe Request -> CORS Validation -> Route Matching
  -> Filter: StripPrefix(2) [remueve /api/v1]
  -> Enruta a: http://ms-catalogos:3001/giros
  -> Forward Request
```

#### Paso 3: Microservicio (NestJS :3001)
```
Express Server -> Middleware -> Guards -> Interceptors
  -> Controller (@Get('/giros'))
  -> DTO Validation (class-validator)
  -> Service Layer (@Injectable) - Use Case
  -> Repository Port Interface
  -> Repository Adapter (TypeORM)
  -> SQL Query Generation
```

#### Paso 4: Base de Datos (PostgreSQL :5432)
```
Connection Pool -> SQL Query Execution
  -> SELECT * FROM catalog.giros WHERE activo = true
  -> Result Mapping (TypeORM)
  -> Return to Repository
```

#### Paso 5: Response Chain
```
Repository -> Service (Domain Entity)
  -> Controller (Response DTO)
  -> HTTP 200 OK (JSON)
  -> Gateway (CORS Headers)
  -> Frontend (Axios Response)
  -> State Update (React)
  -> UI Re-render
```

### 1.4 Criterios de Aceptacion

```gherkin
Feature: Flujo Tecnico End-to-End

  Scenario: Flujo GET /api/v1/catalogos/giros
    Given el frontend en localhost:5173
    And el Gateway en localhost:8080
    And ms-catalogos en localhost:3001
    And PostgreSQL en localhost:5432
    When el usuario navega a "Catálogos > Giros"
    Then el frontend realiza GET al Gateway
    And el Gateway enruta a ms-catalogos
    And el Controller recibe la peticion
    And el Use Case ejecuta la logica
    And el Repository consulta PostgreSQL
    And la respuesta fluye al frontend
    And la UI renderiza los datos
```

### 1.5 Reglas de Negocio

1. **Trazabilidad**: Cada peticion debe trazarse con X-Request-ID
2. **Timeouts**: Gateway debe tener timeout configurado
3. **Reintentos**: Gateway reintenta en caso de fallo
4. **Logs**: Cada capa loguea entrada y salida
5. **CORS**: Gateway maneja CORS, no los microservicios

---

## 2. DISENO

### 2.1 Diagrama de Secuencia (ASCII)

```
Usuario    Frontend    Gateway    ms-catalogos    Repository    PostgreSQL
   |            |          |             |             |             |
   |--click--->|          |             |             |             |
   |            |--axios->|             |             |             |
   |            |         |--route---->|             |             |
   |            |         |             |--useCase-->|             |
   |            |         |             |             |--SQL----->|
   |            |         |             |             |<--Result---|
   |            |         |             |<--Entity----|             |
   |            |         |<--DTO-------|             |             |
   |            |<--JSON--|             |             |             |
   |<-render---|         |             |             |             |
```

### 2.2 Tabla de Transformaciones

| Capa | Entrada | Transformacion | Salida |
|------|---------|----------------|--------|
| Frontend | User Click | HTTP Request | JSON Payload |
| Gateway | HTTP Request | Route Matching | Routed Request |
| Controller | HTTP Request | DTO Validation | DTO Instance |
| Use Case | DTO | Business Logic | Domain Entity |
| Repository | Domain Entity | toTypeOrm() | SQL Query |
| Database | SQL Query | Execution | ResultSet |
| Repository | ResultSet | toDomain() | Domain Entity |
| Use Case | Entity | mapToDto() | Response DTO |
| Controller | DTO | JSON Serialize | HTTP Response |
| Gateway | Response | CORS Headers | HTTP Response |
| Frontend | JSON | State Update | UI Render |

### 2.3 Headers HTTP

**Request Frontend → Gateway:**
```
GET /api/v1/catalogos/giros HTTP/1.1
Host: localhost:8080
Origin: http://localhost:5173
Authorization: Bearer ...
X-Request-ID: uuid-v4
```

**Request Gateway → Microservicio:**
```
GET /giros HTTP/1.1
Host: localhost:3001
X-Request-ID: uuid-v4
X-Forwarded-For: 127.0.0.1
```

**Response:**
```
HTTP/1.1 200 OK
Content-Type: application/json
Access-Control-Allow-Origin: http://localhost:5173

{ "items": [...], "total": 25 }
```

### 2.4 Logs por Capa

**Frontend:**
```
[Request] GET /api/v1/catalogos/giros
[Response] 200 OK (45ms)
```

**Gateway:**
```
Request: GET /api/v1/catalogos/giros
Route: ms-catalogos -> http://localhost:3001/giros
Response: 200 OK (32ms)
```

**NestJS:**
```
[GirosController] GET /giros?page=1&limit=10
[GetGirosUseCase] Executing pagination {page:1, limit:10}
[GiroRepository] Query: SELECT * FROM giros WHERE activo=true
[GirosController] Response: 200 OK, 25 items
```

**PostgreSQL:**
```
LOG: statement: SELECT * FROM catalog.giros WHERE activo=true
```

---

## 3. LISTA DE TAREAS

### Fase 1: Documentacion
- [ ] Diagrama de secuencia completo
- [ ] Diagrama de componentes
- [ ] Documentar headers HTTP
- [ ] Documentar codigos de error

### Fase 2: Tests E2E
- [ ] Test Happy Path GET
- [ ] Test Happy Path POST
- [ ] Test Error 404
- [ ] Test Error 409
- [ ] Test Error 400

### Fase 3: Observabilidad
- [ ] Implementar X-Request-ID propagation
- [ ] Configurar logs estructurados Gateway
- [ ] Configurar logs estructurados ms-catalogos
- [ ] Crear dashboard de metricas

### Fase 4: Optimizacion
- [ ] Medir tiempo por capa
- [ ] Identificar cuellos de botella
- [ ] Optimizar queries BD

---

## 4. EJEMPLOS DE CODIGO

### Frontend - Service
```typescript
// catalogoService.ts
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  timeout: 10000
});

apiClient.interceptors.request.use((config) => {
  config.headers['X-Request-ID'] = uuidv4();
  return config;
});

export const catalogoService = {
  getGiros: () => apiClient.get('/catalogos/giros')
};
```

### Gateway - Configuracion
```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: ms-catalogos
          uri: http://localhost:3001
          predicates:
            - Path=/api/v1/catalogos/**
          filters:
            - StripPrefix=2
```

### NestJS - Controller
```typescript
@Controller('giros')
export class GirosController {
  @Get()
  async getGiros(@Headers('x-request-id') requestId: string) {
    console.log(`[${requestId}] GET /giros`);
    return this.useCase.execute();
  }
}
```

### Repository
```typescript
async findAll() {
  const [results, total] = await this.repo.findAndCount({
    where: { activo: true }
  });
  return { items: results.map(GiroMapper.toDomain), total };
}
```

---

## 5. METRICAS

| Metrica | Umbral |
|---------|--------|
| E2E Response Time | < 500ms |
| Gateway Latency | < 50ms |
| Service Latency | < 200ms |
| DB Query Time | < 100ms |
| Error Rate | < 1% |

---

## 6. TROUBLESHOOTING

**Timeout 504:**
- Verificar conectividad: `ping ms-catalogos`
- Verificar logs Gateway
- Configurar retry en Gateway

**CORS Error:**
- Verificar config CORS en Gateway (no en microservicios)

**Query Lento:**
- Ejecutar: `EXPLAIN ANALYZE SELECT ...`
- Agregar indices faltantes

---

## 7. CHECKLIST VALIDACION

- [ ] Peticion llega Frontend → Gateway
- [ ] Gateway enruta correctamente
- [ ] Microservicio procesa peticion
- [ ] Query SQL ejecuta correctamente
- [ ] Respuesta fluye al frontend
- [ ] UI actualiza con datos
- [ ] Headers propagan correctamente
- [ ] Logs registran flujo completo
- [ ] Metricas se capturan

---

*SPEC-023: Flujo Tecnico End-to-End - ASDD Framework*
