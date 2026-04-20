# Casos de Prueba Gherkin — API Gateway SeguraX (SPEC-016)

## Resumen de Escenarios

| Tipo | Cantidad | Tags |
|------|----------|------|
| Happy Path | 6 | @happy-path @smoke |
| Error Path | 5 | @error-path |
| Edge Cases | 4 | @edge-case |
| CORS | 3 | @cors @security |
| **Total** | **18** | |

---

## HU-01: Enrutamiento a ms-core

### Escenarios Happy Path

```gherkin
@happy-path @smoke @routing
Escenario: Enrutar llamada GET a quotes
  Dado que el gateway está corriendo en puerto 8080
  Y ms-core está disponible en puerto 3000
  Cuando hago GET a "/api/v1/quotes"
  Entonces la request debe llegar a ms-core
  Y debe retornar lista de cotizaciones
  Y el header X-Gateway-Time debe estar presente

@happy-path @smoke @routing
Escenario: Enrutar llamada GET a properties con ID
  Dado que el gateway está corriendo
  Y ms-core está disponible
  Cuando hago GET a "/api/v1/properties/123"
  Entonces la request debe llegar a ms-core
  Y el path recibido por ms-core debe ser "/v1/properties/123"
  Y debe retornar datos de la propiedad

@happy-path @smoke @routing
Escenario: Enrutar llamada POST a quotes
  Dado que el gateway está corriendo
  Y tengo datos válidos de cotización
  Cuando hago POST a "/api/v1/quotes" con el payload
  Entonces la request debe llegar a ms-core
  Y debe retornar 201 Created
  Y el header Content-Type debe ser application/json
```

### Escenarios Error Path

```gherkin
@error-path @routing
Escenario: Backend no disponible retorna error apropiado
  Dado que el gateway está corriendo
  Y ms-core NO está disponible
  Cuando hago GET a "/api/v1/quotes"
  Entonces debe retornar 503 Service Unavailable
  Y el body debe indicar "Servicio temporalmente no disponible"

@error-path @routing
Escenario: Ruta API no existente
  Dado que el gateway está corriendo
  Y ms-core está disponible
  Cuando hago GET a "/api/v1/nonexistent"
  Entonces la request debe llegar a ms-core
  Y debe retornar 404 Not Found del backend
```

### Escenarios Edge Case

```gherkin
@edge-case @routing
Escenario: URL con caracteres especiales en query params
  Dado que el gateway está corriendo
  Cuando hago GET a "/api/v1/quotes?search=casa%20playa&filter=año=2024"
  Entonces la request debe llegar a ms-core con query params intactos
  Y debe retornar resultados filtrados

@edge-case @routing
Esquema del escenario: Diferentes métodos HTTP
  Dado que el gateway está corriendo
  Cuando hago <metodo> a "/api/v1/resource"
  Entonces debe retornar <status>

  Ejemplos:
    | metodo | status |
    | GET    | 200    |
    | POST   | 201    |
    | PUT    | 200    |
    | PATCH  | 200    |
    | DELETE | 204    |
```

---

## HU-02: Enrutamiento a Frontend React

### Escenarios Happy Path

```gherkin
@happy-path @smoke @routing @spa
Escenario: Servir aplicación React en raíz
  Dado que el gateway está corriendo
  Y el frontend está disponible en puerto 5173
  Cuando accedo a "/"
  Entonces debe servir el frontend React
  Y debe retornar index.html con status 200

@happy-path @smoke @routing @spa
Escenario: Soportar rutas SPA directamente
  Dado que el frontend es una SPA
  Cuando accedo a "/quotes/new" directamente
  Entonces debe retornar index.html
  Y el frontend debe manejar la ruta internamente
```

### Escenarios Error Path

```gherkin
@error-path @routing
Escenario: Frontend no disponible
  Dado que el gateway está corriendo
  Y el frontend NO está disponible
  Cuando accedo a "/"
  Entonces debe retornar 503 Service Unavailable
  Y debe mostrar página de error amigable
```

### Escenarios Edge Case

```gherkin
@edge-case @routing
Escenario: Archivos estáticos con extensiones variadas
  Dado que el gateway está corriendo
  Cuando solicito "/assets/main.js"
  Entonces debe servir el archivo desde el frontend
  Y debe incluir headers de caché apropiados
  
  Cuando solicito "/assets/styles.css"
  Entonces debe servir el archivo con Content-Type text/css
  
  Cuando solicito "/assets/logo.png"
  Entonces debe servir el archivo con Content-Type image/png
```

---

## HU-03: Logging de Requests

### Escenarios Happy Path

```gherkin
@happy-path @observability @logging
Escenario: Log de request y response exitosa
  Dado que el gateway recibe una request
  Cuando procesa GET "/api/v1/quotes"
  Entonces debe loguear "[REQUEST]" con requestId, método y path
  Y cuando completa la respuesta
  Entonces debe loguear "[RESPONSE]" con requestId, status y duración

@happy-path @observability @logging
Escenario: Request ID único por transacción
  Dado que el gateway recibe múltiples requests concurrentes
  Cuando procesa 10 requests simultáneos
  Entonces cada request debe tener un requestId único
  Y el requestId debe persistir entre request y response log
```

### Escenarios Error Path

```gherkin
@error-path @observability @logging
Escenario: Log cuando backend falla
  Dado que el gateway recibe una request
  Y el backend va a fallar
  Cuando procesa GET "/api/v1/quotes"
  Entonces debe loguear el request
  Y debe loguear la respuesta con status de error
  Y debe incluir duración aunque haya fallado
```

### Escenarios Edge Case

```gherkin
@edge-case @observability @logging
Escenario: Log de request con body grande
  Dado que el gateway recibe una request
  Cuando procesa POST "/api/v1/quotes" con body de 1MB
  Entonces debe loguear el request sin incluir el body completo
  Y debe loguear duración y status de respuesta
```

---

## HU-04: Configuración CORS

### Escenarios Happy Path

```gherkin
@happy-path @cors @security
Escenario: Permitir CORS desde origen permitido
  Dado que el frontend corre en http://localhost:5173
  Cuando hace una request cross-origin al gateway
  Entonces la response debe incluir header Access-Control-Allow-Origin
  Y debe permitir métodos GET, POST, PUT, DELETE, PATCH, OPTIONS

@happy-path @cors @security
Escenario: Manejar preflight OPTIONS correctamente
  Dado que el frontend hace preflight
  Cuando hace OPTIONS a "/api/v1/quotes"
  Entonces debe retornar 200 OK
  Y debe incluir headers CORS apropiados
  Y debe incluir Access-Control-Max-Age
```

### Escenarios Error Path

```gherkin
@error-path @cors @security
Escenario: Rechazar CORS desde origen no permitido
  Dado que una aplicación en http://evil.com intenta llamar al API
  Cuando hace una request cross-origin
  Entonces no debe incluir Access-Control-Allow-Origin
  O debe retornar 403 Forbidden
```

### Escenarios Edge Case

```gherkin
@edge-case @cors @security
Esquema del escenario: CORS con diferentes headers
  Dado que el frontend está en http://localhost:5173
  Cuando hace <metodo> a "/api/v1/quotes" con headers <headers>
  Entonces debe <resultado>

  Ejemplos:
    | metodo | headers              | resultado                           |
    | GET    | Authorization: Bearer | permitir y retornar 200            |
    | POST   | Content-Type: json  | permitir y retornar 201            |
    | PUT    | X-Custom-Header: x  | permitir si está en allowedHeaders |
    | PATCH  | Cookie: session     | manejar según allowCredentials     |
```

---

## HU-05: Health Checks

### Escenarios Happy Path

```gherkin
@happy-path @monitoring @health
Escenario: Health check básico retorna UP
  Dado que el gateway está corriendo
  Cuando hago GET a "/actuator/health"
  Entonces debe retornar status "UP"
  Y debe incluir detalles del servicio

@happy-path @monitoring @health
Escenario: Info endpoint retorna metadatos
  Dado que el gateway está corriendo
  Cuando hago GET a "/actuator/info"
  Entonces debe retornar nombre de aplicación "ms-gateway"
  Y debe retornar versión "1.0.0"

@happy-path @monitoring @health
Escenario: Gateway routes endpoint disponible
  Dado que el gateway está corriendo
  Cuando hago GET a "/actuator/gateway/routes"
  Entonces debe retornar lista de rutas configuradas
  Y debe incluir ms-core y ms-frontend
```

### Escenarios Edge Case

```gherkin
@edge-case @monitoring @health
Escenario: Health check bajo carga
  Dado que el gateway está procesando 100 requests/segundo
  Cuando hago GET a "/actuator/health"
  Entonces debe responder en menos de 100ms
  Y debe retornar status "UP"
```

---

## Datos de Prueba

### Escenarios de Routing

| Escenario | Endpoint Esperado | Puerto Destino | Path Transformado |
|-----------|-------------------|----------------|-------------------|
| GET quotes | /api/v1/quotes | 3000 | /v1/quotes |
| GET properties | /api/v1/properties/123 | 3000 | /v1/properties/123 |
| POST quotes | /api/v1/quotes | 3000 | /v1/quotes |
| SPA root | / | 5173 | / (index.html) |
| SPA route | /quotes/new | 5173 | / (index.html) |

### Escenarios CORS

| Origen | Esperado | Métodos Permitidos |
|--------|----------|-------------------|
| http://localhost:5173 | ✅ Permitido | GET, POST, PUT, DELETE, PATCH, OPTIONS |
| http://localhost:3000 | ✅ Permitido (dev only) | GET, POST, PUT, DELETE, PATCH, OPTIONS |
| https://segurax.com | ✅ Permitido (prod) | GET, POST, PUT, DELETE, PATCH, OPTIONS |
| http://evil.com | ❌ Bloqueado | - |
| null/empty | ❌ Bloqueado | - |

### Datos para Stress Testing

| Tipo | Valor |
|------|-------|
| Concurrent requests | 100-1000 |
| Ramp up time | 30 segundos |
| Duration | 5 minutos |
| Expected latency p95 | < 100ms |
| Expected error rate | < 1% |

---

## Cobertura de Criterios de Aceptación

| Criterio | Escenarios Gherkin | Estado |
|----------|-------------------|--------|
| `/api/v1/quotes` llega a ms-core | HU-01: Escenarios 1, 2 | ✅ Cubierto |
| `/api/v1/properties` llega a ms-core | HU-01: Escenario 2 | ✅ Cubierto |
| `/` sirve el frontend | HU-02: Escenario 1 | ✅ Cubierto |
| Logs muestran requests | HU-03: Todos | ✅ Cubierto |
| CORS funciona | HU-04: Todos | ✅ Cubierto |
| Health check disponible | HU-05: Escenarios 1-3 | ✅ Cubierto |

---

## Tags para Automatización

```
@smoke - Tests rápidos para validación básica
@happy-path - Flujos exitosos principales
@error-path - Manejo de errores y fallos
@edge-case - Casos límite y excepcionales
@routing - Enrutamiento de requests
@cors - Configuración CORS
@security - Aspectos de seguridad
@logging - Logging y observabilidad
@health - Health checks y monitoreo
@spa - Single Page Application behavior
```

---

*Generado por: QA Agent ASDD*
*Fecha: 2026-04-19*
*Spec: SPEC-016*
*Total escenarios: 18*
