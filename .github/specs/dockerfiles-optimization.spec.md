---
id: SPEC-001
status: COMPLETED
feature: dockerfiles-optimization
created: 2025-01-21
updated: 2025-01-21
author: spec-generator
version: "1.0"
related-specs: []
---

# Optimización de Dockerfiles - Todos los Microservicios

## 1. REQUERIMIENTOS

### Historias de Usuario

**HU-001: Como** DevOps Engineer **quiero** que ms-catalogos tenga un Dockerfile optimizado **para que** la imagen sea segura, liviana y siga mejores prácticas.

**HU-002: Como** DevOps Engineer **quiero** que ms-gateway tenga un Dockerfile con multi-stage build **para que** la imagen final solo contenga el runtime necesario.

**HU-003: Como** DevOps Engineer **quiero** que ms-core tenga el Dockerfile actualizado con mejores prácticas **para que** sea consistente con los demás microservicios.

**HU-004: Como** DevOps Engineer **quiero** que el frontend tenga el Dockerfile optimizado **para que** use mejores prácticas de contenedores.

**HU-005: Como** DevOps Engineer **quiero** que todos los microservicios ejecuten como usuario no-root **para que** se aplique el principio de mínimo privilegio.

### Criterios de Aceptación (Gherkin)

```gherkin
Feature: Dockerfiles con mejores prácticas sin HEALTHCHECK

  Scenario: ms-catalogos usa multi-stage build optimizado
    Dado que el Dockerfile de ms-catalogos existe
    Cuando construyo la imagen
    Entonces debe tener al menos 2 stages (builder y production)
    Y el stage final debe basarse en node:20-alpine
    Y debe instalar solo dependencias de producción con --omit=dev
    Y NO debe contener HEALTHCHECK

  Scenario: ms-gateway usa multi-stage build
    Dado que el Dockerfile de ms-gateway existe
    Cuando construyo la imagen
    Entonces debe tener un stage de build con Maven
    Y debe tener un stage de producción con JRE alpine
    Y el JAR debe ser copiado desde el stage de build
    Y NO debe contener HEALTHCHECK

  Scenario: ms-core mantiene optimizaciones sin HEALTHCHECK
    Dado que el Dockerfile de ms-core existe
    Cuando construyo la imagen
    Entonces debe mantener el multi-stage existente
    Y debe ejecutar como usuario no-root
    Y NO debe contener HEALTHCHECK

  Scenario: frontend mantiene optimizaciones sin HEALTHCHECK
    Dado que el Dockerfile del frontend existe
    Cuando construyo la imagen
    Entonces debe mantener el multi-stage existente
    Y debe ejecutar Nginx como usuario no-root
    Y NO debe contener HEALTHCHECK

  Scenario: Todos los microservicios ejecutan como usuario no-root
    Dado que construyo todas las imágenes
    Cuando ejecuto los contenedores
    Entonces el proceso debe correr con un usuario diferente a root
    Y el UID debe ser > 1000
    Y el usuario debe tener un grupo propio

  Scenario: Labels de metadata presentes
    Dado que construyo las imágenes
    Cuando inspecciono las imágenes
    Entonces debe tener labels: org.opencontainers.image.title
    Y debe tener labels: org.opencontainers.image.version
    Y debe tener labels: org.opencontainers.image.description
```

### Reglas de Negocio

1. **Seguridad**: Ningún contenedor debe ejecutar procesos como root (UID 0)
2. **Optimización**: Las imágenes deben usar multi-stage build para minimizar el tamaño
3. **Base Alpine**: Las imágenes de producción deben basarse en variantes Alpine
4. **NO HEALTHCHECK**: Ningún Dockerfile debe incluir HEALTHCHECK (el usuario lo solicitó explícitamente)
5. **Metadata**: Las imágenes deben incluir labels estándar OCI

---

## 2. DISEÑO

### 2.1 Análisis de Estado Actual

#### ms-catalogos (Node.js/NestJS) - REVISAR

**Estado actual - Problemas identificados:**
```dockerfile
# Build stage
FROM node:20-alpine AS builder
...
RUN npm ci --only=production  # DEPRECATED: usar --omit=dev
...
RUN adduser -S nodejs -u 1001  # Grupo también llamado "nodejs" puede causar confusión
```

**Problemas:**
1. `--only=production` está deprecado → usar `--omit=dev`
2. Nombre de usuario y grupo iguales pueden causar confusión
3. Falta metadata LABEL
4. NOTA: No debe tener HEALTHCHECK

#### ms-gateway (Spring Boot/Java) - REESCRIBIR

**Estado actual - Problemas identificados:**
```dockerfile
FROM eclipse-temurin:17-jre-alpine
COPY target/ms-gateway-*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
```

**Problemas:**
1. No tiene multi-stage build
2. Ejecuta como root
3. No tiene metadata LABEL
4. No optimiza layers (copia directo de target/)

#### ms-core (Node.js/NestJS) - ACTUALIZAR (Quitar HEALTHCHECK)

**Estado actual - Problemas identificados:**
```dockerfile
FROM node:20-alpine AS production
...
# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', ...)"
```

**Problemas:**
1. Ya tiene multi-stage (3 stages)
2. Ya usa usuario no-root (USER node)
3. Usa `--only=production` (deprecado) → cambiar a `--omit=dev`
4. Tiene HEALTHCHECK → ELIMINAR
5. Falta metadata LABEL

#### frontend (React + Nginx) - ACTUALIZAR (Quitar HEALTHCHECK)

**Estado actual - Problemas identificados:**
```dockerfile
FROM nginx:1.25-alpine AS production
...
# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:8080/ || exit 1
```

**Problemas:**
1. Ya tiene multi-stage (2 stages)
2. Ya usa usuario no-root
3. Usa puerto no-privilegiado (8080)
4. Tiene HEALTHCHECK → ELIMINAR
5. Falta metadata LABEL

---

### 2.2 Diseño de Dockerfiles Optimizados

#### ms-catalogos/Dockerfile (Corregido)

```dockerfile
# ============================================================================
# STAGE 1: Build
# ============================================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies for native modules
RUN apk add --no-cache python3 make g++

# Copy dependency files
COPY package*.json ./
COPY tsconfig.json ./
COPY nest-cli.json ./

# Install ALL dependencies (including devDependencies for build)
RUN npm ci && npm cache clean --force

# Copy source code
COPY src ./src

# Build the application
RUN npm run build

# ============================================================================
# STAGE 2: Production
# ============================================================================
FROM node:20-alpine AS production

# Metadata labels (OCI standard)
LABEL org.opencontainers.image.title="ms-catalogos"
LABEL org.opencontainers.image.description="Microservicio de Catálogos - SeguraX Cotizador"
LABEL org.opencontainers.image.version="1.0.0"
LABEL org.opencontainers.image.authors="DevOps Team"

WORKDIR /app

# Create non-root user and group
# Using numeric UID/GID to avoid issues with user resolution in Kubernetes
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# Copy dependency files
COPY package*.json ./

# Install only production dependencies
# --omit=dev es la forma moderna (npm 8.0+)
RUN npm ci --omit=dev && \
    npm cache clean --force && \
    rm -rf /tmp/*

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Change ownership to non-root user
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose application port
EXPOSE 3001

# NO HEALTHCHECK - Segun requerimiento del usuario

# Run the application
CMD ["node", "dist/main.js"]
```

#### ms-gateway/Dockerfile (Nuevo Multi-Stage)

```dockerfile
# ============================================================================
# STAGE 1: Build
# ============================================================================
FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /build

# Install Maven
RUN apk add --no-cache maven

# Copy pom.xml first (for layer caching)
COPY pom.xml .

# Download dependencies (cached layer)
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application (skip tests for faster build, run tests separately)
RUN mvn clean package -DskipTests -B && \
    mkdir -p target/dependency && \
    cd target/dependency && \
    jar -xf ../*.jar

# ============================================================================
# STAGE 2: Production
# ============================================================================
FROM eclipse-temurin:17-jre-alpine AS production

# Metadata labels (OCI standard)
LABEL org.opencontainers.image.title="ms-gateway"
LABEL org.opencontainers.image.description="API Gateway for Cotizador SeguraX"
LABEL org.opencontainers.image.version="1.0.0"
LABEL org.opencontainers.image.authors="DevOps Team"

WORKDIR /app

# Create non-root user and group
# Using numeric UID/GID for Kubernetes compatibility
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# Copy the built JAR from builder stage
COPY --from=builder /build/target/*.jar app.jar

# Change ownership to non-root user
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose application port
EXPOSE 8080

# NO HEALTHCHECK - Segun requerimiento del usuario

# Run the application
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
```

#### ms-core/Dockerfile (Corregido - Sin HEALTHCHECK)

```dockerfile
# ============================================================================
# Stage 1: Dependencies
# ============================================================================
FROM node:20-alpine AS dependencies

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install only production dependencies
# --omit=dev es la forma moderna (npm 8.0+)
RUN npm ci --omit=dev && npm cache clean --force

# ============================================================================
# Stage 2: Builder
# ============================================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependencies from previous stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy configuration files
COPY package*.json tsconfig.json ./

# Copy source code
COPY src/ ./src/

# Compile TypeScript
RUN npm run build

# ============================================================================
# Stage 3: Production
# ============================================================================
FROM node:20-alpine AS production

# Metadata labels (OCI standard)
LABEL org.opencontainers.image.title="ms-core"
LABEL org.opencontainers.image.description="Backend Core API - SeguraX Cotizador"
LABEL org.opencontainers.image.version="1.0.0"
LABEL org.opencontainers.image.authors="DevOps Team"

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Working directory
WORKDIR /app

# Copy production dependencies
COPY --from=dependencies /app/node_modules ./node_modules

# Copy compiled files
COPY --from=builder /app/dist ./dist

# Copy package.json (for metadata)
COPY --from=builder /app/package.json ./

# Create log directory
RUN mkdir -p /app/logs && chown -R node:node /app

# Change to non-root user (node already exists in official image)
USER node

# Expose port
EXPOSE 3000

# NO HEALTHCHECK - Segun requerimiento del usuario

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]

# Start command
CMD ["node", "dist/main.js"]
```

#### frontend/Dockerfile (Corregido - Sin HEALTHCHECK)

```dockerfile
# ============================================================================
# Stage 1: Builder
# ============================================================================
FROM node:20-alpine AS builder

# Create non-root user
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# Working directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies (includes devDependencies for build)
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Build application
RUN npm run build

# Change permissions
RUN chown -R appuser:appgroup /app

# ============================================================================
# Stage 2: Production (Nginx)
# ============================================================================
FROM nginx:1.25-alpine AS production

# Metadata labels (OCI standard)
LABEL org.opencontainers.image.title="frontend"
LABEL org.opencontainers.image.description="Frontend React - SeguraX Cotizador"
LABEL org.opencontainers.image.version="1.0.0"
LABEL org.opencontainers.image.authors="DevOps Team"

# Create non-root user for Nginx
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/conf.d/default.conf

# Copy static files from builder
COPY --from=builder --chown=appuser:appgroup /app/dist /usr/share/nginx/html

# Create directories for logs and cache
RUN mkdir -p /var/cache/nginx /var/log/nginx /tmp/nginx && \
    chown -R appuser:appgroup /var/cache/nginx /var/log/nginx /tmp/nginx /usr/share/nginx/html && \
    chmod -R 755 /var/cache/nginx /var/log/nginx /tmp/nginx /usr/share/nginx/html

# Change Nginx configuration to use non-privileged port
RUN sed -i 's/listen 80/listen 8080/g' /etc/nginx/conf.d/default.conf && \
    sed -i 's/user nginx/user appuser/g' /etc/nginx/nginx.conf

# Change user
USER appuser

# Expose non-privileged port
EXPOSE 8080

# NO HEALTHCHECK - Segun requerimiento del usuario

# Start command
CMD ["nginx", "-g", "daemon off;"]
```

---

### 2.3 Comparativa de Mejoras

| Aspecto | ms-catalogos (Antes) | ms-catalogos (Despues) | ms-gateway (Antes) | ms-gateway (Despues) |
|---------|----------------------|------------------------|--------------------|----------------------|
| Multi-stage | Sí | Sí (optimizado) | No | Sí |
| Base Alpine | Sí | Sí | Sí | Sí |
| Usuario no-root | Sí | Sí (mejorado) | No | Sí |
| UID/GID numerico | Sí | Sí | N/A | Sí |
| --omit=dev | --only=production | --omit=dev | N/A | N/A |
| HEALTHCHECK | No | No (eliminado) | No | No |
| Labels OCI | No | Sí | No | Sí |
| Cache de deps | Basico | Mejorado | No | Sí |
| Clean cache | No | Sí | N/A | N/A |

| Aspecto | ms-core (Antes) | ms-core (Despues) | frontend (Antes) | frontend (Despues) |
|---------|-----------------|-------------------|------------------|------------------|
| Multi-stage | 3 stages | 3 stages | 2 stages | 2 stages |
| Base Alpine | Sí | Sí | Sí | Sí |
| Usuario no-root | Sí | Sí | Sí | Sí |
| --omit=dev | --only=production | --omit=dev | N/A | N/A |
| HEALTHCHECK | Sí | No (eliminado) | Sí | No (eliminado) |
| Labels OCI | No | Sí | No | Sí |
| dumb-init | Sí | Sí | N/A | N/A |

---

## 3. LISTA DE TAREAS

### Backend - ms-catalogos

- [ ] Actualizar Dockerfile con --omit=dev en lugar de --only=production
- [ ] Renombrar usuario/grupo a appuser/appgroup para claridad
- [ ] Agregar metadata LABELs (OCI standard)
- [ ] Agregar npm cache clean --force para reducir tamano
- [ ] Verificar que el puerto 3001 este documentado
- [ ] Probar build: docker build -t ms-catalogos:test .
- [ ] Verificar usuario: docker run --rm ms-catalogos:test id

### Backend - ms-gateway

- [ ] Crear nuevo Dockerfile con multi-stage build
- [ ] Stage 1: Build con eclipse-temurin:17-jdk-alpine + Maven
- [ ] Stage 2: Production con eclipse-temurin:17-jre-alpine
- [ ] Configurar cache de dependencias Maven (dependency:go-offline)
- [ ] Crear usuario no-root appuser (UID 1001)
- [ ] Agregar metadata LABELs (OCI standard)
- [ ] Configurar USER appuser antes de ENTRYPOINT
- [ ] Probar build: docker build -t ms-gateway:test .
- [ ] Verificar que el JAR se copie correctamente del stage builder

### Backend - ms-core

- [ ] Actualizar Dockerfile cambiando --only=production a --omit=dev
- [ ] Agregar metadata LABELs (OCI standard)
- [ ] ELIMINAR el HEALTHCHECK existente
- [ ] Verificar que sigue usando usuario node (no cambiar)
- [ ] Probar build: docker build -t ms-core:test .

### Frontend

- [ ] Actualizar Dockerfile agregando metadata LABELs (OCI standard)
- [ ] ELIMINAR el HEALTHCHECK existente
- [ ] Verificar que sigue usando multi-stage con Nginx
- [ ] Verificar que sigue usando puerto 8080 (no privilegiado)
- [ ] Probar build: docker build -t frontend:test .

### QA / Validacion

- [ ] Verificar que ningun Dockerfile contiene HEALTHCHECK
- [ ] Verificar que ms-catalogos no corre como root
- [ ] Verificar que ms-gateway no corre como root
- [ ] Verificar que ms-core no corre como root
- [ ] Verificar que frontend no corre como root
- [ ] Medir tamano de imagenes antes/despues
- [ ] Verificar que todas las imagenes tienen labels OCI
- [ ] Validar que ms-catalogos responde en puerto 3001
- [ ] Validar que ms-gateway responde en puerto 8080
- [ ] Validar que ms-core responde en puerto 3000
- [ ] Validar que frontend responde en puerto 8080

---

## 4. NOTAS DE IMPLEMENTACION

### Construccion de imagenes

```bash
# ms-catalogos
cd ms-catalogos
docker build -t ms-catalogos:optimized .

# ms-gateway
cd ms-gateway
docker build -t ms-gateway:optimized .

# ms-core
cd ms-core
docker build -t ms-core:optimized .

# frontend
cd frontend
docker build -t frontend:optimized .
```

### Verificacion de usuario no-root

```bash
# ms-catalogos
docker run --rm ms-catalogos:optimized id
# Debe mostrar: uid=1001(appuser) gid=1001(appgroup)

# ms-gateway
docker run --rm ms-gateway:optimized id
# Debe mostrar: uid=1001(appuser) gid=1001(appgroup)

# ms-core
docker run --rm ms-core:optimized id
# Debe mostrar: uid=1000(node) gid=1000(node)

# frontend
docker run --rm frontend:optimized id
# Debe mostrar: uid=1001(appuser) gid=1001(appgroup)
```

### Verificacion de NO HEALTHCHECK

```bash
# Todas las imagenes deben retornar nada o vacio
docker inspect ms-catalogos:optimized --format='{{.Config.Healthcheck}}'
docker inspect ms-gateway:optimized --format='{{.Config.Healthcheck}}'
docker inspect ms-core:optimized --format='{{.Config.Healthcheck}}'
docker inspect frontend:optimized --format='{{.Config.Healthcheck}}'
```

### Buenas practicas aplicadas

1. **Multi-stage builds**: Separar build de runtime para imagenes mas pequenas
2. **Non-root user**: Ejecutar con minimos privilegios de seguridad
3. **Alpine base**: Imagenes mas pequenas y con menos superficie de ataque
4. **Layer caching**: Copiar pom.xml/package.json antes del codigo fuente
5. **Metadata labels**: Labels OCI estandar para trazabilidad
6. **NO HEALTHCHECK**: Segun requerimiento explicito del usuario
7. **Clean up**: Limpiar caches y archivos temporales
8. **Explicit UID/GID**: Usar IDs numericos para compatibilidad con Kubernetes

---

## 5. RIESGOS Y CONSIDERACIONES

| Riesgo | Impacto | Mitigacion |
|--------|---------|------------|
| Maven no disponible en imagen base de build | Medio | Instalar maven con apk add en el stage de build |
| Permisos de archivos al cambiar de usuario | Medio | Asegurar chown correcto antes de USER |
| Cache de dependencias puede quedar obsoleto | Bajo | Usar dependency:go-offline para pre-cachear |
| Eliminacion de HEALTHCHECK afecta monitoreo | Medio | El orquestador debe implementar su propio health check |

### Nota sobre HEALTHCHECK

Segun el requerimiento del usuario, NINGUN Dockerfile debe incluir HEALTHCHECK. Esto significa:
- Los orquestadores (Kubernetes, Docker Swarm) deben configurar sus propios health checks
- El monitoreo de salud de contenedores es responsabilidad de la infraestructura, no de la imagen
- Las imagenes son mas simples y no dependen de endpoints especificos de health
