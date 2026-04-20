---
id: SPEC-016
status: DRAFT
feature: api-gateway-segurax
created: 2026-04-20
updated: 2026-04-20
author: spec-generator
version: "1.0"
related-specs:
  - SPEC-015
---

# Spec: API Gateway SeguraX

> **Estado:** `DRAFT` → aprobar con `status: APPROVED` antes de iniciar implementación.

---

## 1. REQUERIMIENTOS

### Descripción
Implementar un **API Gateway** con Spring Cloud Gateway que actúe como punto de entrada único para el Cotizador SeguraX. El gateway enrutará el tráfico al backend (ms-core) y al frontend (React), proporcionando logging centralizado y configuración CORS.

> **Nota:** Circuit Breaker se deja como feature opcional para futura implementación (SPEC-017).

### Requerimiento de Negocio
> "Necesito un API Gateway que centralice el acceso a mis servicios. Las llamadas a /api/v1/** deben ir al backend, y el resto al frontend. Quiero logging de todas las requests para poder debuggear, y CORS configurado para que el frontend pueda comunicarse sin problemas."

---

### Historias de Usuario

#### HU-01: Enrutamiento a Backend
```gherkin
# language: es
Característica: Enrutamiento a ms-core
  Como usuario del cotizador
  Quiero que las llamadas API vayan al backend
  Para obtener datos de cotizaciones y propiedades

  @gateway @routing @happy-path
  Escenario: Enrutar llamadas a quotes
    Dado que el gateway está corriendo en puerto 8080
    Cuando hago GET a "/api/v1/quotes"
    Entonces la request debe llegar a ms-core en puerto 3000
    Y debe retornar lista de cotizaciones

  @gateway @routing @happy-path
  Escenario: Enrutar llamadas a properties
    Dado que el gateway está corriendo
    Cuando hago GET a "/api/v1/properties/123"
    Entonces la request debe llegar a ms-core
    Y debe retornar datos de la propiedad
```

#### HU-02: Enrutamiento a Frontend
```gherkin
# language: es
Característica: Enrutamiento a Frontend React
  Como usuario del cotizador
  Quiero acceder a la aplicación web
  Para usar la interfaz de usuario

  @gateway @routing @happy-path
  Escenario: Servir aplicación React
    Dado que el gateway está corriendo
    Cuando accedo a "/" o cualquier ruta no API
    Entonces debe servir el frontend React desde puerto 5173
    Y debe mostrar la aplicación correctamente

  @gateway @routing @spa
  Escenario: Soportar rutas SPA (Single Page Application)
    Dado que el frontend es una SPA
    Cuando accedo a "/quotes/new" directamente
    Entonces debe retornar index.html
    Y el frontend debe manejar la ruta
```

#### HU-03: Logging de Requests
```gherkin
# language: es
Característica: Logging centralizado
  Como desarrollador
  Quiero ver logs de todas las requests
  Para debuggear y monitorear el sistema

  @gateway @logging @observability
  Escenario: Log de request entrante
    Dado que el gateway recibe una request
    Cuando procesa GET "/api/v1/quotes"
    Entonces debe loguear: método, path, requestId
    Y debe loguear timestamp de inicio

  @gateway @logging @observability
  Escenario: Log de response completada
    Dado que el gateway procesó una request
    Cuando recibe response del backend
    Entonces debe loguear: status, duration ms, requestId
    Y debe loguear timestamp de fin
```

#### HU-04: Configuración CORS
```gherkin
# language: es
Característica: CORS para Frontend
  Como desarrollador frontend
  Quiero que el gateway permita CORS
  Para que el frontend pueda llamar al API

  @gateway @cors @security
  Escenario: Permitir CORS desde localhost:5173
    Dado que el frontend corre en localhost:5173
    Cuando hace una request cross-origin al gateway
    Entonces debe incluir header Access-Control-Allow-Origin
    Y debe permitir métodos GET, POST, PUT, DELETE, PATCH, OPTIONS
    Y debe permitir headers Authorization, Content-Type

  @gateway @cors @security
  Escenario: Manejar preflight OPTIONS
    Dado que el frontend hace preflight
    Cuando hace OPTIONS a "/api/v1/quotes"
    Entonces debe retornar 200 OK
    Y debe incluir headers CORS apropiados
```

#### HU-05: Health Check
```gherkin
# language: es
Característica: Health Checks
  Como operador
  Quiero verificar que el gateway está saludable
  Para monitoreo y orquestación

  @gateway @health @monitoring
  Escenario: Health check básico
    Dado que el gateway está corriendo
    Cuando hago GET a "/actuator/health"
    Entonces debe retornar status "UP"
    Y debe incluir detalles del servicio

  @gateway @health @monitoring
  Escenario: Info del servicio
    Dado que el gateway está corriendo
    Cuando hago GET a "/actuator/info"
    Entonces debe retornar nombre de aplicación
    Y debe retornar versión
```

---

### Reglas de Negocio

1. **Enrutamiento API**: Todas las rutas `/api/v1/**` → ms-core (puerto 3000)
2. **Enrutamiento Frontend**: Rutas `/**` (no API) → frontend (puerto 5173)
3. **Logging**: Cada request debe loguear método, path, requestId, duración, status
4. **CORS**: Permitir origen `localhost:5173` (dev) y dominios configurados (prod)
5. **Health**: Exponer endpoints de actuator en `/actuator/health` y `/actuator/info`
6. **Sin Circuit Breaker**: Se implementará en SPEC-017 (futuro)

---

## 2. DISEÑO

### Arquitectura del Gateway

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTE                                  │
│                    (Browser, Postman, etc.)                      │
└────────────────────┬────────────────────────────────────────────┘
                     │ HTTP
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY                                 │
│                       Puerto 8080                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐    ┌──────────────┐    ┌──────────────┐        │
│  │   Routes    │───▶│   Filters    │───▶│   Logging    │        │
│  │             │    │              │    │              │        │
│  │ /api/v1/**  │    │ StripPrefix  │    │ Request ID   │        │
│  │ /**         │    │ Add Headers  │    │ Duration     │        │
│  └─────────────┘    └──────────────┘    └──────────────┘        │
│         │                  │                   │                 │
│         └──────────────────┴──────────────────┘                 │
│                            │                                    │
│              ┌─────────────┴──────────────┐                     │
│              │      CORS Config           │                     │
│              │  (localhost:5173 permitido) │                     │
│              └─────────────────────────────┘                     │
│                            │                                    │
│              ┌─────────────┴──────────────┐                     │
│              │   Load Balancing (future)  │                     │
│              └─────────────────────────────┘                     │
└────────────────────────────┬────────────────────────────────────┘
              │                         │
              │ /api/v1/**              │ /**
              ▼                         ▼
┌────────────────────┐    ┌────────────────────┐
│     ms-core        │    │  Frontend React    │
│    Puerto 3000     │    │    Puerto 5173     │
│                    │    │                    │
│  /quotes           │    │  index.html        │
│  /properties       │    │  /assets/*         │
└────────────────────┘    └────────────────────┘
```

### Estructura del Proyecto

```
ms-gateway/
├── pom.xml
├── Dockerfile
├── src/
│   ├── main/
│   │   ├── java/com/segurax/gateway/
│   │   │   ├── MsGatewayApplication.java
│   │   │   ├── config/
│   │   │   │   └── CORSConfig.java
│   │   │   └── filters/
│   │   │       └── LoggingFilter.java
│   │   └── resources/
│   │       ├── application.yml
│   │       ├── application-dev.yml
│   │       └── application-prod.yml
│   └── test/
│       └── java/com/segurax/gateway/
│           └── GatewayIntegrationTest.java
```

### Configuración de Rutas (application.yml)

```yaml
server:
  port: 8080

spring:
  application:
    name: ms-gateway
  cloud:
    gateway:
      routes:
        # ms-core: Servicio de cotizaciones y propiedades
        - id: ms-core
          uri: http://localhost:3000
          predicates:
            - Path=/api/v1/**
          filters:
            - StripPrefix=1
            - AddRequestHeader=X-Gateway-Time, ${now}
        
        # ms-frontend: Aplicación React
        - id: ms-frontend
          uri: http://localhost:5173
          predicates:
            - Path=/**
          filters:
            - RemoveRequestHeader=Cookie
      
      # CORS Global
      globalcors:
        cors-configurations:
          '[/**]':
            allowedOrigins: 
              - "http://localhost:5173"
            allowedMethods:
              - GET
              - POST
              - PUT
              - DELETE
              - PATCH
              - OPTIONS
            allowedHeaders:
              - "*"
            allowCredentials: true

# Management / Actuator
management:
  endpoints:
    web:
      exposure:
        include: health,info,gateway
  endpoint:
    health:
      show-details: always

# Logging
logging:
  level:
    org.springframework.cloud.gateway: INFO
    com.segurax.gateway: DEBUG
```

### Componentes

#### MsGatewayApplication.java
```java
package com.segurax.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MsGatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(MsGatewayApplication.class, args);
    }
}
```

#### LoggingFilter.java
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
                
                log.info("[RESPONSE] [{}] {} {} - {}ms - Status {}",
                    requestId, method, path, duration.toMillis(), statusCode);
            });
    }

    @Override
    public int getOrder() {
        return -1;
    }
}
```

#### CORSConfig.java (Alternativa Java)
```java
package com.segurax.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class CORSConfig {

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOrigin("http://localhost:5173");
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.addAllowedHeader("*");
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        
        return new CorsWebFilter(source);
    }
}
```

### Dependencias (pom.xml)

```xml
<dependencies>
    <!-- Spring Cloud Gateway (WebFlux) -->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-gateway</artifactId>
    </dependency>
    
    <!-- Monitoring -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-actuator</artifactId>
    </dependency>
    
    <!-- Lombok -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
</dependencies>
```

### Dockerfile

```dockerfile
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

COPY target/ms-gateway-*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
```

---

## 3. LISTA DE TAREAS

### Fase 1: Configuración Base

- [ ] Crear directorio `ms-gateway/`
- [ ] Crear `pom.xml` con Spring Cloud Gateway
- [ ] Crear `application.yml` con rutas
- [ ] Crear `application-dev.yml` y `application-prod.yml`

### Fase 2: Implementación Gateway

- [ ] Crear `MsGatewayApplication.java`
- [ ] Crear `LoggingFilter.java` (GlobalFilter)
- [ ] Crear `CORSConfig.java` (alternativa a YAML)

### Fase 3: Documentación

- [ ] Crear `README.md` con:
  - Cómo ejecutar localmente
  - Configuración de rutas
  - Ejemplos de uso

### Fase 4: Verificación

- [ ] Compilar: `mvn clean package`
- [ ] Ejecutar: `mvn spring-boot:run`
- [ ] Verificar health: `curl http://localhost:8080/actuator/health`
- [ ] Verificar rutas: `curl http://localhost:8080/actuator/gateway/routes`
- [ ] Verificar logs funcionen
- [ ] Verificar CORS con frontend

### Fase 5: Docker

- [ ] Crear `Dockerfile`
- [ ] Verificar build Docker

---

## 4. COMANDOS ÚTILES

```bash
# Compilar
cd ms-gateway
mvn clean package -DskipTests

# Ejecutar local
mvn spring-boot:run

# Ejecutar con perfil dev
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Verificar rutas
curl http://localhost:8080/actuator/gateway/routes

# Health check
curl http://localhost:8080/actuator/health

# Test API via gateway
curl http://localhost:8080/api/v1/quotes

# Docker
docker build -t ms-gateway .
docker run -p 8080:8080 ms-gateway
```

---

## 5. CRITERIOS DE ACEPTACIÓN

| # | Criterio | Validación |
|---|----------|------------|
| 1 | `/api/v1/quotes` llega a ms-core | `curl` retorna datos de cotizaciones |
| 2 | `/api/v1/properties` llega a ms-core | `curl` retorna datos de propiedades |
| 3 | `/` sirve el frontend | Navegador muestra aplicación React |
| 4 | Logs muestran requests | Consola muestra `[REQUEST]` y `[RESPONSE]` |
| 5 | CORS funciona | Frontend en :5173 puede llamar al API |
| 6 | Health check disponible | `/actuator/health` retorna `{status: "UP"}` |
| 7 | Build exitoso | `mvn clean package` sin errores |
| 8 | Docker funciona | `docker run` levanta el gateway |

---

## 6. NOTAS

### Circuit Breaker (Futuro)
En SPEC-017 se implementará:
- Resilience4j Circuit Breaker
- Retry con backoff exponencial
- Fallbacks
- Rate limiting

### Service Discovery (Futuro)
En SPEC-018 se implementará:
- Eureka Client
- Load balancing
- Descubrimiento dinámico de servicios

---

*Fin de la especificación*
