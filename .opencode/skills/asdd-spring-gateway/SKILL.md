---
name: asdd-spring-gateway
description: >
  Implementa API Gateway con Spring Boot y Spring Cloud Gateway siguiendo la arquitectura hexagonal
  y el flujo ASDD (Agent Spec Software Development).
  Trigger: Cuando se implementa un API Gateway, servicio de enrutamiento, o cuando se solicita
  crear un nuevo microservicio Gateway en el flujo ASDD.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## When to Use

- **Creación de API Gateway** para microservicios
- **Implementación de enrutamiento dinámico** entre servicios
- **Filtros y transformaciones** de requests/responses
- **Integración con Service Discovery** (Eureka, Consul)
- **Rate Limiting, Authentication, Logging** a nivel de gateway
- **Después de Phase 1 (Spec)** en flujo ASDD cuando el feature involucra gateway

## ASDD Integration Flow

```
[ASDD Phase 1 Complete]
    ↓
[Spec con status: APPROVED]
    ↓
[THIS SKILL ACTIVATES]
    ↓
[Phase 2: Implement Gateway]
    ↓
[Spring Boot + Cloud Gateway + Hexagonal]
```

## Critical Patterns

### 1. Estructura del Gateway (Arquitectura Hexagonal)

```
ms-gateway/
├── pom.xml
├── src/
│   ├── main/
│   │   ├── java/com/segurax/gateway/
│   │   │   ├── MsGatewayApplication.java
│   │   │   ├── config/
│   │   │   │   ├── GatewayConfig.java
│   │   │   │   ├── RouteConfig.java
│   │   │   │   └── CORSConfig.java
│   │   │   ├── filters/
│   │   │   │   ├── LoggingFilter.java
│   │   │   │   ├── AuthenticationFilter.java
│   │   │   │   └── RateLimitingFilter.java
│   │   │   ├── predicates/
│   │   │   │   └── CustomPredicates.java
│   │   │   └── handlers/
│   │   │       └── GlobalErrorHandler.java
│   │   └── resources/
│   │       ├── application.yml
│   │       ├── application-dev.yml
│   │       └── application-prod.yml
│   └── test/
│       └── java/com/segurax/gateway/
└── Dockerfile
```

### 2. Capas del Gateway (Hexagonal)

| Capa | Responsabilidad | Ejemplos |
|------|-----------------|----------|
| **Config** | Beans, rutas, propiedades | GatewayConfig, RouteConfig |
| **Filters** | Transformación de requests/responses | Logging, Auth, Rate Limit |
| **Predicates** | Condiciones de enrutamiento | Path, Header, Cookie |
| **Handlers** | Manejo de errores y fallback | GlobalErrorHandler |

### 3. Versiones y Dependencias

```xml
<properties>
    <java.version>17</java.version>
    <spring-boot.version>3.2.0</spring-boot.version>
    <spring-cloud.version>2023.0.0</spring-cloud.version>
</properties>

<dependencies>
    <!-- Spring Cloud Gateway -->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-gateway</artifactId>
    </dependency>
    
    <!-- Service Discovery (optional) -->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
    </dependency>
    
    <!-- Config Server (optional) -->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-config</artifactId>
    </dependency>
    
    <!-- Resilience4j (Circuit Breaker) -->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-circuitbreaker-reactor-resilience4j</artifactId>
    </dependency>
    
    <!-- Monitoring -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-actuator</artifactId>
    </dependency>
    
    <!-- Logging -->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-sleuth</artifactId>
    </dependency>
</dependencies>
```

### 4. Configuración de Rutas (application.yml)

```yaml
server:
  port: 8080

spring:
  application:
    name: ms-gateway
  cloud:
    gateway:
      discovery:
        locator:
          enabled: true
          lower-case-service-id: true
      routes:
        # Route to ms-core (cotizaciones)
        - id: ms-core
          uri: lb://ms-core
          predicates:
            - Path=/api/v1/quotes/**
            - Method=GET,POST,PUT,DELETE,PATCH
          filters:
            - StripPrefix=2
            - AddRequestHeader=X-Gateway-Time, ${now}
            - name: CircuitBreaker
              args:
                name: ms-core-cb
                fallbackUri: forward:/fallback/core
                
        # Route to ms-auth (if exists)
        - id: ms-auth
          uri: lb://ms-auth
          predicates:
            - Path=/api/v1/auth/**
          filters:
            - StripPrefix=2
            - name: CircuitBreaker
              args:
                name: ms-auth-cb
                fallbackUri: forward:/fallback/auth
      
      # Global Filters
      default-filters:
        - DedupeResponseHeader=Access-Control-Allow-Origin Access-Control-Allow-Credentials, RETAIN_UNIQUE
        - name: Retry
          args:
            retries: 3
            statuses: BAD_GATEWAY
            
      # CORS
      globalcors:
        cors-configurations:
          '[/**]':
            allowedOrigins: "*"
            allowedMethods: "*"
            allowedHeaders: "*"

# Circuit Breaker Configuration
resilience4j:
  circuitbreaker:
    configs:
      default:
        slidingWindowSize: 10
        failureRateThreshold: 50
        waitDurationInOpenState: 10000
        permittedNumberOfCallsInHalfOpenState: 3
        automaticTransitionFromOpenToHalfOpenEnabled: true
    instances:
      ms-core-cb:
        baseConfig: default
        slidingWindowSize: 5
      ms-auth-cb:
        baseConfig: default

# Rate Limiting (Redis required)
spring:
  redis:
    host: localhost
    port: 6379
  cloud:
    gateway:
      routes:
        - id: rate-limited-core
          uri: lb://ms-core
          predicates:
            - Path=/api/v1/quotes/**
          filters:
            - name: RequestRateLimiter
              args:
                redis-rate-limiter.replenishRate: 10
                redis-rate-limiter.burstCapacity: 20
                key-resolver: "#{@userKeyResolver}"
```

## Code Examples

### MsGatewayApplication.java
```java
package com.segurax.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class MsGatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(MsGatewayApplication.class, args);
    }
}
```

### RouteConfig.java (Java DSL)
```java
package com.segurax.gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuración de rutas usando Java DSL.
 * Alternativa a application.yml
 */
@Configuration
public class RouteConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
            // Route to ms-core
            .route("ms-core", r -> r
                .path("/api/v1/quotes/**", "/api/v1/properties/**")
                .and().method("GET", "POST", "PUT", "DELETE", "PATCH")
                .filters(f -> f
                    .stripPrefix(2)
                    .addRequestHeader("X-Gateway-Time", String.valueOf(System.currentTimeMillis()))
                    .circuitBreaker(config -> config
                        .setName("ms-core-cb")
                        .setFallbackUri("forward:/fallback/core")))
                .uri("lb://ms-core"))
                
            // Route to ms-frontend (static)
            .route("ms-frontend", r -> r
                .path("/**")
                .uri("http://localhost:5173"))
                
            .build();
    }
}
```

### LoggingFilter.java (GlobalFilter)
```java
package com.segurax.gateway.filters;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.time.Instant;

/**
 * GlobalFilter para logging de requests y responses.
 * Registra: method, path, status, duration, requestId
 */
@Slf4j
@Component
public class LoggingFilter implements GlobalFilter, Ordered {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String requestId = exchange.getRequest().getId();
        String method = exchange.getRequest().getMethodValue();
        String path = exchange.getRequest().getPath().value();
        Instant start = Instant.now();
        
        log.info("[REQUEST] [{}] {} {}", requestId, method, path);
        
        return chain.filter(exchange)
            .doFinally(signalType -> {
                Duration duration = Duration.between(start, Instant.now());
                int statusCode = exchange.getResponse().getStatusCode().value();
                
                log.info("[RESPONSE] [{}] {} {} - {}ms",
                    requestId, 
                    statusCode,
                    method,
                    path,
                    duration.toMillis());
            });
    }

    @Override
    public int getOrder() {
        return -1; // Highest precedence
    }
}
```

### AuthenticationFilter.java (GatewayFilter)
```java
package com.segurax.gateway.filters;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

/**
 * Filter para validación de JWT token.
 * Extrae token del header Authorization y valida.
 */
@Slf4j
@Component
public class AuthenticationFilter extends AbstractGatewayFilterFactory<AuthenticationFilter.Config> {

    public AuthenticationFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();
            
            String token = extractToken(request);
            
            if (token == null || token.isEmpty()) {
                log.warn("[AUTH] No token provided for path: {}", request.getPath());
                return unauthorized(exchange);
            }
            
            // Validate token (call auth service or validate locally)
            if (!isTokenValid(token)) {
                log.warn("[AUTH] Invalid token for path: {}", request.getPath());
                return unauthorized(exchange);
            }
            
            // Add user info to request headers for downstream services
            ServerHttpRequest mutatedRequest = request.mutate()
                .header("X-User-Id", extractUserId(token))
                .header("X-User-Roles", extractRoles(token))
                .build();
            
            return chain.filter(exchange.mutate().request(mutatedRequest).build());
        };
    }

    private String extractToken(ServerHttpRequest request) {
        String authHeader = request.getHeaders().getFirst("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }

    private boolean isTokenValid(String token) {
        // Implement JWT validation
        // Or call ms-auth service
        return true; // Placeholder
    }

    private String extractUserId(String token) {
        return "user-id";
    }

    private String extractRoles(String token) {
        return "USER";
    }

    private Mono<Void> unauthorized(ServerWebExchange exchange) {
        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
        return exchange.getResponse().setComplete();
    }

    public static class Config {
        // Configuration properties if needed
    }
}
```

### GlobalErrorHandler.java
```java
package com.segurax.gateway.handlers;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.web.ErrorProperties;
import org.springframework.boot.autoconfigure.web.reactive.error.DefaultErrorWebExceptionHandler;
import org.springframework.boot.web.reactive.error.ErrorAttributes;
import org.springframework.context.ApplicationContext;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.server.*;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

/**
 * Handler global para errores del Gateway.
 * Transforma errores técnicos en respuestas consistentes.
 */
@Slf4j
public class GlobalErrorHandler extends DefaultErrorWebExceptionHandler {

    public GlobalErrorHandler(ErrorAttributes errorAttributes, 
                              ErrorProperties errorProperties,
                              ApplicationContext applicationContext) {
        super(errorAttributes, errorProperties, applicationContext);
    }

    @Override
    protected RouterFunction<ServerResponse> getRoutingFunction(ErrorAttributes errorAttributes) {
        return RouterFunctions.route(RequestPredicates.all(), this::renderErrorResponse);
    }

    @Override
    protected Mono<ServerResponse> renderErrorResponse(ServerRequest request) {
        Map<String, Object> errorAttributes = getErrorAttributes(request, getErrorAttributeOptions(request, MediaType.ALL));
        Throwable error = getError(request);
        
        log.error("[ERROR] Path: {}, Error: {}", 
            request.path(), 
            error != null ? error.getMessage() : "Unknown");
        
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", errorAttributes.get("timestamp"));
        response.put("path", errorAttributes.get("path"));
        response.put("message", getErrorMessage(error));
        response.put("error", getErrorType(error));
        response.put("requestId", request.exchange().getRequest().getId());
        
        HttpStatus status = getHttpStatus(error);
        
        return ServerResponse.status(status)
            .contentType(MediaType.APPLICATION_JSON)
            .body(BodyInserters.fromValue(response));
    }

    private String getErrorMessage(Throwable error) {
        if (error instanceof TimeoutException) {
            return "El servicio no respondió a tiempo";
        }
        if (error instanceof CircuitBreakerOpenException) {
            return "El servicio no está disponible temporalmente";
        }
        return error != null ? error.getMessage() : "Error interno";
    }

    private String getErrorType(Throwable error) {
        if (error instanceof TimeoutException) return "TIMEOUT";
        if (error instanceof CircuitBreakerOpenException) return "CIRCUIT_BREAKER_OPEN";
        if (error instanceof ConnectException) return "SERVICE_UNAVAILABLE";
        return "INTERNAL_ERROR";
    }

    private HttpStatus getHttpStatus(Throwable error) {
        if (error instanceof TimeoutException) return HttpStatus.GATEWAY_TIMEOUT;
        if (error instanceof CircuitBreakerOpenException) return HttpStatus.SERVICE_UNAVAILABLE;
        if (error instanceof ConnectException) return HttpStatus.BAD_GATEWAY;
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
}
```

## Implementation Workflow

### Step 1: Project Structure

1. Create directory `ms-gateway/`
2. Create `pom.xml` with Spring Cloud Gateway dependencies
3. Create `src/main/java/com/segurax/gateway/` structure
4. Create `application.yml` with routes configuration

### Step 2: Routes Configuration

Based on the spec requirements:
```
/ms-core/**      → lb://ms-core
/ms-frontend/**  → http://localhost:5173
```

### Step 3: Global Filters

1. **LoggingFilter** - Request/Response logging
2. **AuthenticationFilter** - JWT validation
3. **RateLimitingFilter** - Throttling (if required)

### Step 4: Error Handling

1. GlobalErrorHandler for consistent error responses
2. FallbackController for circuit breaker fallbacks

### Step 5: Health Checks

```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info,gateway
  endpoint:
    health:
      show-details: always
```

## Commands

```bash
# Build
cd ms-gateway
mvn clean package -DskipTests

# Run locally
mvn spring-boot:run

# Run with profile
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Docker
docker build -t ms-gateway .
docker run -p 8080:8080 ms-gateway

# Test routes
curl http://localhost:8080/actuator/gateway/routes
curl http://localhost:8080/api/v1/quotes/health

# Logs
tail -f logs/gateway.log
```

## Dockerfile

```dockerfile
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

COPY target/ms-gateway-*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", 
    "-Djava.security.egd=file:/dev/./urandom",
    "-Dspring.profiles.active=docker",
    "-jar", 
    "app.jar"]
```

## Common Patterns

### Pattern 1: Path Rewriting
```java
.filters(f -> f
    .rewritePath("/api/v1/(?<path>.*)", "/${path}"))
```

### Pattern 2: Header Manipulation
```java
.filters(f -> f
    .addRequestHeader("X-Request-Source", "gateway")
    .removeRequestHeader("X-Internal-Token")
    .addResponseHeader("X-Gateway-Version", "1.0"))
```

### Pattern 3: Retry with Backoff
```yaml
filters:
  - name: Retry
    args:
      retries: 3
      statuses: BAD_GATEWAY,SERVICE_UNAVAILABLE
      methods: GET,POST
      backoff:
        firstBackoff: 50ms
        maxBackoff: 500ms
```

### Pattern 4: Circuit Breaker
```java
.filters(f -> f.circuitBreaker(config -> config
    .setName("service-cb")
    .setFallbackUri("forward:/fallback/service")))
```

## Testing

### Integration Test
```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureWebTestClient
public class GatewayIntegrationTest {

    @Autowired
    private WebTestClient webClient;

    @Test
    void shouldRouteToMsCore() {
        webClient.get()
            .uri("/api/v1/quotes/health")
            .exchange()
            .expectStatus().isOk();
    }
}
```

## Integration with Existing Services

When implementing alongside existing microservices:

1. **ms-core** (already exists) → Route `/api/v1/quotes/**` → `lb://ms-core`
2. **ms-frontend** (React app) → Route `/**` → `http://localhost:5173`
3. **New services** → Add routes to `application.yml` or `RouteConfig.java`

## Checklist

Before considering complete:
- [ ] pom.xml with Spring Cloud Gateway dependencies
- [ ] Routes configured (YAML or Java DSL)
- [ ] LoggingFilter implemented
- [ ] GlobalErrorHandler configured
- [ ] Health endpoints exposed
- [ ] Dockerfile created
- [ ] Routes tested with curl
- [ ] Circuit breaker configured (if required)
- [ ] CORS configured (if required)
- [ ] Documentation (README) updated

## Output

After execution:
- **Running Gateway**: Port 8080
- **Routes**: Configured and tested
- **Filters**: Logging, Auth (if required)
- **Monitoring**: Actuator endpoints
- **Docker**: Image ready for deployment
