# ADR-006: API Gateway Pattern

## Status
Accepted

## Date
2025-01-20

## Context
Necesitábamos decidir cómo estructurar la comunicación entre frontend y backend. Las opciones consideradas fueron:

- **Sin Gateway**: Frontend conecta directamente al backend
- **API Gateway**: Intermediario entre frontend y servicios
- **BFF (Backend for Frontend)**: Gateway específico por frontend

## Decision
**Implementar API Gateway con Spring Cloud Gateway**.

### Componentes
- **ms-gateway**: Spring Cloud Gateway (WebFlux)
- **Rutas**: `/api/v1/**` → ms-core
- **Puerto**: 8080

## Consequences

### Positive
- **CORS centralizado**: Configuración en un solo lugar
- **Logging unificado**: Request/Response logging con correlation ID
- **Frontend simplificado**: Solo conoce una URL (gateway)
- **Escalabilidad**: Fácil agregar nuevos microservicios
- **Rate limiting**: Punto único para throttling
- **Autenticación**: Punto único para auth (futuro)

### Negative
- **Single point of failure**: Si el gateway cae, nada funciona
- **Latencia extra**: Hop adicional
- **Complejidad**: Servicio adicional a mantener

## Arquitectura

### Sin Gateway (Alternativa Rechazada)
```
Frontend (5173) ──CORS──→ Backend (3000)
             └──CORS──→ Otro servicio
             └──CORS──→ Otro servicio
```
- Frontend debe conocer todas las URLs
- CORS configurado en cada servicio
- Logging disperso

### Con Gateway (Implementado)
```
                    ┌─────────────────┐
Frontend (5173)────→│  API Gateway    │────→ ms-core (3000)
                    │    (8080)       │
                    └─────────────────┘
                         │
                    ┌────┴────────────┐
                    │  • CORS          │
                    │  • Logging       │
                    │  • Routing       │
                    │  • Rate Limiting │
                    └──────────────────┘
```
- Frontend solo conoce: `http://localhost:8080`
- CORS centralizado
- Logging unificado

## Configuración

```yaml
# application.yml
server:
  port: 8080

spring:
  cloud:
    gateway:
      routes:
        # Backend API
        - id: ms-core
          uri: http://localhost:3000
          predicates:
            - Path=/api/v1/**
          filters:
            - StripPrefix=1
        
        # Frontend SPA
        - id: ms-frontend
          uri: http://localhost:5173
          predicates:
            - Path=/**
      
      # CORS global
      globalcors:
        cors-configurations:
          '[/**]':
            allowedOrigins: ["http://localhost:5173"]
            allowedMethods: [GET, POST, PUT, DELETE, PATCH, OPTIONS]
            allowedHeaders: ["*"]
            allowCredentials: true
```

## Alternatives Considered

| Alternativa | Razón de rechazo |
|-------------|------------------|
| Sin Gateway | Frontend conoce múltiples URLs, CORS disperso |
| Kong/AWS API Gateway | Overkill para proyecto local, dependencia externa |
| Nginx como proxy | Menos features de routing dinámico |
| Node.js Express Gateway | Menos robusto que Spring Cloud Gateway |

## Related Decisions
- ADR-001: TypeScript (gateway en Java separado)
- ADR-007: Hexagonal (backend expone API REST)
