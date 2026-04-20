# ms-gateway - API Gateway SeguraX

API Gateway para Cotizador SeguraX. Enruta peticiones al backend, centraliza CORS y logging.

## Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Spring Boot | 3.2.0 | Framework base |
| Spring Cloud Gateway | 2023.0.0 | Gateway con WebFlux |
| Java | 17 | Lenguaje |
| Maven | 3.9+ | Build tool |

## Propósito

- **Enrutamiento**: `/api/v1/**` → ms-core (backend)
- **CORS**: Configuración centralizada para frontend
- **Logging**: Request/Response con correlation ID
- **Health Checks**: Spring Boot Actuator

## Arquitectura

```
                    ┌─────────────────────────────────────┐
                    │           CLIENTES                │
                    │     (Navegadores, Apps)           │
                    └─────────────┬───────────────────────┘
                                  │ HTTPS
                                  ▼
                    ┌─────────────────────────────────────┐
                    │         API GATEWAY                 │
                    │      (ms-gateway:8080)              │
                    │  ┌─────────────────────────────┐  │
                    │  │  Spring Cloud Gateway         │  │
                    │  │  • Route Predicates           │  │
                    │  │  • Global Filters             │  │
                    │  │  • CORS Config                │  │
                    │  │  • Logging Filter             │  │
                    │  └─────────────────────────────┘  │
                    └──────────────┬──────────────────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                    │
              ▼                    │                    ▼
    ┌──────────────────┐           │          ┌──────────────────┐
    │   ms-core        │◄──────────┘          │   ms-frontend    │
    │   (NestJS:3000)  │                      │   (React:5173)   │
    └──────────────────┘                      └──────────────────┘
```

## Instalación

```bash
# Clonar y entrar al directorio
cd ms-gateway

# Compilar
mvn clean package

# O instalar sin tests
mvn clean package -DskipTests
```

## Comandos Disponibles

```bash
# Desarrollo
mvn spring-boot:run

# Compilar
mvn clean package

# Compilar sin tests
mvn clean package -DskipTests

# Ejecutar JAR
java -jar target/ms-gateway-1.0.0.jar

# Testing
mvn test

# Ver rutas configuradas (con gateway corriendo)
curl http://localhost:8080/actuator/gateway/routes
```

## Configuración

### application.yml (Desarrollo)

```yaml
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
            - StripPrefix=1  # Remueve /api

        # Frontend SPA
        - id: ms-frontend
          uri: http://localhost:5173
          predicates:
            - Path=/**
          filters:
            - RemoveRequestHeader=Cookie

      # CORS global
      globalcors:
        cors-configurations:
          '[/**]':
            allowedOrigins: ["http://localhost:5173"]
            allowedMethods: [GET, POST, PUT, DELETE, PATCH, OPTIONS]
            allowedHeaders: ["*"]
            allowCredentials: true

# Actuator endpoints
management:
  endpoints:
    web:
      exposure:
        include: health, info, gateway
```

## Variables de Entorno

| Variable | Descripción | Default |
|----------|-------------|---------|
| `SERVER_PORT` | Puerto del gateway | `8080` |
| `CORE_URL` | URL del backend | `http://localhost:3000` |
| `FRONTEND_URL` | URL del frontend | `http://localhost:5173` |

## Health Checks

| Endpoint | Descripción |
|----------|-------------|
| `GET /actuator/health` | Estado del servicio |
| `GET /actuator/info` | Información de build |
| `GET /actuator/gateway/routes` | Rutas configuradas |

## Rutas Configuradas

| Ruta Gateway | Destino | Servicio |
|--------------|---------|----------|
| `/api/v1/quotes/**` | `http://localhost:3000/quotes/**` | ms-core |
| `/api/v1/properties/**` | `http://localhost:3000/properties/**` | ms-core |
| `/**` | `http://localhost:5173/**` | frontend |

## Docker

```bash
# Build requiere JAR pre-compilado
mvn clean package -DskipTests

# Build imagen Docker
docker build -t ms-gateway .

# Run
docker run -p 8080:8080 \
  -e CORE_URL=http://host.docker.internal:3000 \
  -e FRONTEND_URL=http://host.docker.internal:5173 \
  ms-gateway
```

### Dockerfile

```dockerfile
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY target/ms-gateway-*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

## Logging

El gateway loguea todas las peticiones con información de:
- Correlation ID
- Método HTTP y ruta
- Duración de la request
- Status code de respuesta

```
2025-01-20 10:00:00 [reactor-http-epoll-1] INFO  c.s.g.logging.GatewayLoggingFilter -
  [REQUEST] [uuid] GET /api/v1/quotes

2025-01-20 10:00:00 [reactor-http-epoll-1] INFO  c.s.g.logging.GatewayLoggingFilter -
  [RESPONSE] [uuid] GET /api/v1/quotes - 150ms - Status 200
```

## Desarrollo Local

Para desarrollo sin Docker:

```bash
# Terminal 1: Backend
cd ms-core && npm run start:dev

# Terminal 2: Frontend
cd frontend && npm run dev

# Terminal 3: Gateway
cd ms-gateway && mvn spring-boot:run

# Acceso
Frontend: http://localhost:5173
Gateway API: http://localhost:8080/api/v1/quotes
```

## Licencia

MIT License
