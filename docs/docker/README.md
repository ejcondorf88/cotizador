# Documentación Técnica de Docker

Documentación técnica de los Dockerfiles implementados en el proyecto Cotizador SeguraX.

## Arquitectura de Contenedores

### Diagrama de Contenedores

```
┌─────────────────────────────────────────────────────────────────────┐
│                          RED INTERNA                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐│
│  │  Frontend   │  │   Gateway   │  │   ms-core   │  │ ms-catalogos││
│  │   (React)   │──│  (Spring)   │──│  (NestJS)   │──│  (NestJS)   ││
│  │  Port:8080  │  │  Port:8080  │  │  Port:3000  │  │  Port:3001  ││
│  │  User:1001  │  │  User:1001  │  │  User:1000  │  │  User:1001  ││
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘│
└─────────────────────────────────────────────────────────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │     PostgreSQL      │
                    │      Port:5432      │
                    └─────────────────────┘
```

### Flujo de Construcción Multi-Stage

```
ms-catalogos (2 stages):          ms-gateway (2 stages):
┌─────────────┐                   ┌─────────────┐
│   BUILDER   │                   │   BUILDER   │
│ node:20-alp │                   │ temurin:17  │
│ Install deps│                   │ Maven build │
│ npm run     │                   │ Package JAR │
│    build    │                   └──────┬──────┘
└──────┬──────┘                          │
       │                                 │
       ▼                                 ▼
┌─────────────┐                   ┌─────────────┐
│ PRODUCTION  │                   │ PRODUCTION  │
│ node:20-alp │                   │ temurin:17  │
│ Prod deps   │                   │  JRE only   │
│ Dist files  │                   │ app.jar     │
│ USER 1001   │                   │ USER 1001   │
└─────────────┘                   └─────────────┘


ms-core (3 stages):               frontend (2 stages):
┌─────────────┐                   ┌─────────────┐
│ DEPENDENCIES│                   │   BUILDER   │
│ node:20-alp │                   │ node:20-alp │
│ npm ci      │                   │ npm ci      │
│ --omit=dev  │                   │ npm run     │
└──────┬──────┘                   │    build    │
       │                          └──────┬──────┘
       │                                 │
       ▼                                 ▼
┌─────────────┐                   ┌─────────────┐
│   BUILDER   │                   │ PRODUCTION  │
│ Copy deps   │                   │ nginx:alpine│
│ Build app   │                   │ Static HTML │
└──────┬──────┘                   │ User:1001   │
       │                          │ Port:8080   │
       │                          └─────────────┘
       ▼
┌─────────────┐
│ PRODUCTION  │
│ dumb-init   │
│ Dist + deps │
│ USER node   │
└─────────────┘
```

## Mejores Prácticas Aplicadas

### 1. Multi-Stage Builds

- **Reducción de tamaño**: Solo se copian los artefactos necesarios a la imagen final
- **Separación de responsabilidades**: Build tools no van a producción
- **Caché optimizada**: Las capas de dependencias se cachean independientemente

```dockerfile
# Ejemplo ms-core (3 stages)
FROM node:20-alpine AS dependencies    # Stage 1: Solo dependencias prod
FROM node:20-alpine AS builder         # Stage 2: Compilación
FROM node:20-alpine AS production      # Stage 3: Runtime final
```

### 2. Imágenes Base Alpine

Todas las imágenes usan variantes Alpine Linux:

- `node:20-alpine` (~150MB vs ~900MB standard)
- `eclipse-temurin:17-jre-alpine` (~180MB vs ~500MB standard)
- `nginx:1.25-alpine` (~25MB vs ~150MB standard)

**Beneficios:**
- Menor superficie de ataque
- Menor tiempo de descarga
- Menor uso de memoria

### 3. Usuario No-Root

Todos los contenedores ejecutan con usuario no privilegiado:

| Servicio | UID | GID | Comando |
|----------|-----|-----|---------|
| ms-catalogos | 1001 | 1001 | `USER appuser` |
| ms-gateway | 1001 | 1001 | `USER appuser` |
| ms-core | 1000 | 1000 | `USER node` |
| frontend | 1001 | 1001 | `USER appuser` |

### 4. Labels OCI Standard

Todas las imágenes incluyen metadatos estandarizados:

```dockerfile
LABEL org.opencontainers.image.title="ms-core"
LABEL org.opencontainers.image.description="Backend Core API - SeguraX"
LABEL org.opencontainers.image.version="1.0.0"
LABEL org.opencontainers.image.authors="DevOps Team"
```

### 5. Limpieza de Caché

```dockerfile
RUN npm ci --omit=dev && \
    npm cache clean --force && \
    rm -rf /tmp/*
```

### 6. Signal Handling

ms-core usa `dumb-init` para manejar señales correctamente:

```dockerfile
RUN apk add --no-cache dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]
```

## Comparativa de Tamaños

| Servicio | Dockerfile.dev | Dockerfile (Final) | Optimización |
|----------|----------------|-------------------|--------------|
| ms-catalogos | ~900MB | ~200MB | 78% |
| ms-gateway | ~800MB | ~350MB | 56% |
| ms-core | ~900MB | ~220MB | 76% |
| frontend | ~900MB | ~30MB | 97% |

**Total del stack:** ~65MB (Nginx) + ~770MB (Node.js services) + ~350MB (Java) = **~1.1GB**

## Troubleshooting Común

### Error: "Cannot find module"

**Causa**: Dependencias de desarrollo no instaladas en build stage

**Solución**:
```dockerfile
# En stage builder, instalar TODAS las dependencias
RUN npm ci  # sin --omit=dev
```

### Error: "Permission denied" al escribir logs

**Causa**: Usuario no-root no tiene permisos en directorio

**Solución**:
```dockerfile
RUN mkdir -p /app/logs && chown -R appuser:appgroup /app
USER appuser
```

### Error: Puerto privilegiado (80) en frontend

**Causa**: Usuario no-root no puede usar puertos <1024

**Solución**:
```dockerfile
# Cambiar a puerto no-privilegiado
RUN sed -i 's/listen 80/listen 8080/g' /etc/nginx/conf.d/default.conf
EXPOSE 8080
```

### Build cache no funciona

**Causa**: Archivos copiados invalidan cache prematuramente

**Solución** - Orden correcto de COPY:
```dockerfile
# 1. Archivos que casi nunca cambian (mejor cache)
COPY package*.json ./
RUN npm ci

# 2. Archivos que cambian frecuentemente (peor cache)
COPY src ./src
RUN npm run build
```

### Error: "jar: command not found" en ms-gateway

**Causa**: Comando `jar` no disponible en JRE, solo en JDK

**Solución**: Extraer JAR en stage builder (donde está JDK), no en production

```dockerfile
# En stage builder (tiene JDK)
RUN jar -xf ../*.jar

# En production (solo JRE) - copiar archivos ya extraídos
COPY --from=builder /build/target/dependency .
```

### Container no responde a SIGTERM

**Causa**: Node.js no maneja señales por defecto en PID 1

**Solución**: Usar `dumb-init` o `tini`:

```dockerfile
# Opción 1: dumb-init
RUN apk add --no-cache dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]

# Opción 2: tini
RUN apk add --no-cache tini
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/main.js"]
```

## Comandos Útiles

```bash
# Verificar usuario dentro del contenedor
docker exec <container> id
docker exec <container> ps aux

# Inspeccionar imagen
docker inspect <image> --format='{{.Config.User}}'
docker inspect <image> --format='{{.ContainerConfig.ExposedPorts}}'

# Ver capas de imagen
docker history <image>

# Tamaño de imágenes
docker images --format "table {{.Repository}}\t{{.Size}}"

# Build con cache deshabilitado
docker build --no-cache -t <image> .

# Ver logs en tiempo real
docker-compose logs -f <service>

# Ejecutar shell como root (debugging)
docker exec -u 0 -it <container> sh
```

## Decisiones Documentadas

- [ADR-001-dockerfile-optimization](../../.github/adr/ADR-001-dockerfile-optimization.md) - Optimización de Dockerfiles
