---
id: SPEC-013
status: IMPLEMENTED
feature: docker-containerization
created: 2026-04-19
updated: 2026-04-19
author: spec-generator
version: "1.0"
related-specs: []
---

# Spec: Docker Containerization para Cotizador SeguraX

> **Estado:** `DRAFT` → aprobar con `status: APPROVED` antes de iniciar implementación.

---

## 1. REQUERIMIENTOS

### Descripción
Crear configuración Docker completa para el proyecto Cotizador SeguraX, incluyendo Dockerfiles optimizados para frontend (React + Vite) y backend (NestJS + TypeORM), siguiendo las mejores prácticas de seguridad y rendimiento.

### Requerimiento de Negocio
> "Necesito contenedores Docker para desplegar la aplicación en cualquier entorno. Los contenedores deben ser seguros (no-root), livianos (Alpine Linux), y eficientes (multi-stage builds)."

---

### Historias de Usuario

#### HU-01: Crear Dockerfile para Frontend

```
Como: DevOps Engineer
Quiero: Un Dockerfile optimizado para el frontend React
Para: Desplegar la aplicación web en contenedores

Prioridad: Alta
Estimación: M
Capa: DevOps
```

**Criterios de Aceptación:**

```gherkin
CRITERIO-1.1: Multi-stage build
Dado que: Se construye el Dockerfile
Cuando: Se ejecuta docker build
Entonces: Se usa multi-stage build con al menos:
  - Stage 1: Builder (Node.js + dependencias + build)
  - Stage 2: Production (Nginx + archivos estáticos)
```

```gherkin
CRITERIO-1.2: Imagen base Alpine
Dado que: Se construye el contenedor
Cuando: Se inspecciona la imagen resultante
Entonces: La imagen base es node:20-alpine o nginx:alpine
Y: No usa imágenes grandes como node:20 o ubuntu
```

```gherkin
CRITERIO-1.3: Usuario no-root
Dado que: El contenedor está corriendo
Cuando: Se verifica el usuario
Entonces: El proceso corre como usuario "app" (uid 1001)
Y: No corre como root
```

```gherkin
CRITERIO-1.4: Tamaño optimizado
Dado que: La imagen está construida
Cuando: Se ejecuta docker images
Entonces: El tamaño es menor a 50MB (production stage)
```

---

#### HU-02: Crear Dockerfile para Backend (ms-core)

```
Como: DevOps Engineer
Quiero: Un Dockerfile optimizado para el backend NestJS
Para: Desplegar la API en contenedores

Prioridad: Alta
Estimación: M
Capa: DevOps
```

**Criterios de Aceptación:**

```gherkin
CRITERIO-2.1: Multi-stage build
Dado que: Se construye el Dockerfile
Cuando: Se ejecuta docker build
Entonces: Se usa multi-stage build con al menos:
  - Stage 1: Dependencies (npm ci --only=production)
  - Stage 2: Builder (compilación TypeScript)
  - Stage 3: Production (solo runtime + dist/)
```

```gherkin
CRITERIO-2.2: Imagen base Alpine
Dado que: Se construye el contenedor
Cuando: Se inspecciona la imagen resultante
Entonces: La imagen base es node:20-alpine
Y: Incluye solo dependencias de producción
```

```gherkin
CRITERIO-2.3: Usuario no-root
Dado que: El contenedor está corriendo
Cuando: Se verifica el usuario
Entonces: El proceso corre como usuario "node" (uid 1000)
Y: No corre como root
```

```gherkin
CRITERIO-2.4: Health check
Dado que: El contenedor está corriendo
Cuando: Se verifica el estado
Entonces: Existe un HEALTHCHECK configurado
Y: Verifica el endpoint /health cada 30 segundos
```

---

#### HU-03: Docker Compose para desarrollo

```
Como: Desarrollador
Quiero: Un docker-compose.yml para desarrollo local
Para: Levantar toda la aplicación con un comando

Prioridad: Media
Estimación: S
Capa: DevOps
```

**Criterios de Aceptación:**

```gherkin
CRITERIO-3.1: Servicios definidos
Dado que: Se ejecuta docker-compose up
Cuando: Se levantan los servicios
Entonces: Se incluyen:
  - frontend (puerto 5173)
  - ms-core (puerto 3000)
  - postgres (puerto 5432)
  - redis (opcional, puerto 6379)
```

```gherkin
CRITERIO-3.2: Variables de entorno
Dado que: Se levanta con docker-compose
Cuando: La aplicación corre
Entonces: Usa el archivo .env para configuración
Y: Las variables se pasan a los contenedores
```

```gherkin
CRITERIO-3.3: Volumenes para desarrollo
Dado que: Se desarrolla localmente
Cuando: Se hacen cambios en el código
Entonces: El contenedor frontend recarga automáticamente (hot reload)
Y: El contenedor backend recarga en cambios (nest start --watch)
```

---

#### HU-04: Docker Compose para producción

```
Como: DevOps Engineer
Quiero: Un docker-compose.prod.yml para producción
Para: Desplegar en servidores de producción

Prioridad: Media
Estimación: S
Capa: DevOps
```

**Criterios de Aceptación:**

```gherkin
CRITERIO-4.1: Optimización de producción
Dado que: Se usa docker-compose.prod.yml
Cuando: Se despliega
Entonces: No usa volúmenes de bind mount
Y: Usa imágenes pre-construidas
Y: Incluye restart: always
```

```gherkin
CRITERIO-4.2: Redes seguras
Dado que: Los contenedores corren
Cuando: Se inspeccionan las redes
Entonces: Existe una red interna para backend-db
Y: Solo frontend y backend son accesibles externamente
```

---

### Reglas de Negocio

1. **Seguridad**: Nunca correr como root
2. **Optimización**: Multi-stage builds obligatorio
3. **Tamaño**: Preferir Alpine Linux
4. **Portabilidad**: Funcionar en cualquier entorno Docker
5. **Escalabilidad**: Permitir múltiples réplicas del backend

---

## 2. DISEÑO

### Arquitectura de Contenedores

```
┌─────────────────────────────────────────────────────────────────┐
│                      DOCKER COMPOSE                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐    ┌──────────────────┐                │
│  │   Frontend       │    │   Nginx          │                │
│  │   (React + Vite) │───▶│   (Reverse       │                │
│  │   Port: 5173     │    │    Proxy)        │                │
│  │   User: app      │    │   Port: 80       │                │
│  └──────────────────┘    └────────┬─────────┘                │
│                                    │                           │
│  ┌──────────────────┐              │                          │
│  │   ms-core        │◀─────────────┘                          │
│  │   (NestJS)       │    Port: 3000                          │
│  │   User: node     │                                       │
│  └────────┬─────────┘                                       │
│           │                                                     │
│  ┌────────▼─────────┐                                          │
│  │   PostgreSQL     │                                          │
│  │   Port: 5432     │                                          │
│  └──────────────────┘                                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Dockerfile Frontend (Multi-Stage)

```dockerfile
# ==========================================
# Stage 1: Builder
# ==========================================
FROM node:20-alpine AS builder

# Crear usuario no-root
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# Directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias (solo lo necesario para build)
RUN npm ci --only=production && npm cache clean --force

# Copiar código fuente
COPY . .

# Build de la aplicación
RUN npm run build

# Cambiar permisos
RUN chown -R appuser:appgroup /app

# ==========================================
# Stage 2: Production (Nginx)
# ==========================================
FROM nginx:1.25-alpine AS production

# Crear usuario no-root para Nginx
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/conf.d/default.conf

# Copiar archivos estáticos del builder
COPY --from=builder --chown=appuser:appgroup /app/dist /usr/share/nginx/html

# Crear directorio para logs y cache
RUN mkdir -p /var/cache/nginx /var/log/nginx && \
    chown -R appuser:appgroup /var/cache/nginx /var/log/nginx

# Cambiar usuario
USER appuser

# Exponer puerto
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:8080/ || exit 1

# Comando de inicio
CMD ["nginx", "-g", "daemon off;"]
```

### Dockerfile Backend (Multi-Stage)

```dockerfile
# ==========================================
# Stage 1: Dependencies
# ==========================================
FROM node:20-alpine AS dependencies

WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --only=production && npm cache clean --force

# ==========================================
# Stage 2: Builder
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar dependencias del stage anterior
COPY --from=dependencies /app/node_modules ./node_modules

# Copiar package.json y tsconfig
COPY package*.json tsconfig.json ./

# Copiar código fuente
COPY src/ ./src/

# Compilar TypeScript
RUN npm run build

# ==========================================
# Stage 3: Production
# ==========================================
FROM node:20-alpine AS production

# Crear usuario no-root (node ya existe en imagen oficial)
RUN apk add --no-cache dumb-init

# Directorio de trabajo
WORKDIR /app

# Copiar dependencias de producción
COPY --from=dependencies /app/node_modules ./node_modules

# Copiar archivos compilados
COPY --from=builder /app/dist ./dist

# Copiar package.json (para metadata)
COPY --from=builder /app/package.json ./

# Cambiar a usuario no-root
USER node

# Exponer puerto
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/v1/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 1

# Usar dumb-init para manejo correcto de señales
ENTRYPOINT ["dumb-init", "--"]

# Comando de inicio
CMD ["node", "dist/main.js"]
```

### Docker Compose Desarrollo

```yaml
version: '3.8'

services:
  # ========================================
  # Frontend (React + Vite)
  # ========================================
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
      target: development
    container_name: cotizador-frontend-dev
    ports:
      - "5173:5173"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    environment:
      - VITE_API_URL=http://localhost:3000
      - NODE_ENV=development
    depends_on:
      - ms-core
    networks:
      - frontend-network
    command: npm run dev -- --host

  # ========================================
  # Backend (NestJS)
  # ========================================
  ms-core:
    build:
      context: ./ms-core
      dockerfile: Dockerfile.dev
    container_name: cotizador-backend-dev
    ports:
      - "3000:3000"
    volumes:
      - ./ms-core:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - DB_HOST=postgres
      - DB_PORT=5432
      - DB_USERNAME=postgres
      - DB_PASSWORD=password
      - DB_NAME=segurax
    depends_on:
      - postgres
    networks:
      - frontend-network
      - backend-network
    command: npm run start:dev

  # ========================================
  # PostgreSQL
  # ========================================
  postgres:
    image: postgres:16-alpine
    container_name: cotizador-postgres-dev
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=segurax
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - backend-network

  # ========================================
  # Redis (Opcional - para cache)
  # ========================================
  redis:
    image: redis:7-alpine
    container_name: cotizador-redis-dev
    ports:
      - "6379:6379"
    networks:
      - backend-network

volumes:
  postgres-data:

networks:
  frontend-network:
    driver: bridge
  backend-network:
    driver: bridge
```

### Docker Compose Producción

```yaml
version: '3.8'

services:
  # ========================================
  # Frontend (Nginx)
  # ========================================
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      target: production
    container_name: cotizador-frontend-prod
    ports:
      - "80:8080"
    environment:
      - NODE_ENV=production
    depends_on:
      - ms-core
    networks:
      - frontend-network
    restart: always

  # ========================================
  # Backend (NestJS)
  # ========================================
  ms-core:
    build:
      context: ./ms-core
      dockerfile: Dockerfile
      target: production
    container_name: cotizador-backend-prod
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=postgres
      - DB_PORT=5432
      - DB_USERNAME=${DB_USERNAME:-postgres}
      - DB_PASSWORD=${DB_PASSWORD:-password}
      - DB_NAME=${DB_NAME:-segurax}
    depends_on:
      - postgres
    networks:
      - frontend-network
      - backend-network
    restart: always
    deploy:
      replicas: 2
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M

  # ========================================
  # PostgreSQL
  # ========================================
  postgres:
    image: postgres:16-alpine
    container_name: cotizador-postgres-prod
    environment:
      - POSTGRES_USER=${DB_USERNAME:-postgres}
      - POSTGRES_PASSWORD=${DB_PASSWORD:-password}
      - POSTGRES_DB=${DB_NAME:-segurax}
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - backend-network
    restart: always

volumes:
  postgres-data:

networks:
  frontend-network:
    driver: bridge
  backend-network:
    driver: bridge
    internal: true  # Solo accesible internamente
```

### Configuración Nginx (nginx.conf)

```nginx
user appuser;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/rss+xml application/atom+xml image/svg+xml;

    include /etc/nginx/conf.d/*.conf;
}
```

### Configuración Nginx (default.conf)

```nginx
server {
    listen 8080;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

### .dockerignore (Frontend)

```
# Dependencies
node_modules
npm-debug.log
yarn-debug.log
yarn-error.log

# Build
build
dist

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode
.idea
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Git
.git
.gitignore

# Docker
Dockerfile*
docker-compose*
.dockerignore

# Testing
coverage
.nyc_output
```

### .dockerignore (Backend)

```
# Dependencies
node_modules
npm-debug.log

# Build
dist
build

# Environment
.env
.env.local
.env.*.local

# Development
.git
.gitignore
.vscode
.idea
*.swp

# Testing
*.spec.ts
*.test.ts
coverage

# Logs
logs
*.log

# Docker
Dockerfile*
docker-compose*
.dockerignore

# Documentation
README.md
CHANGELOG.md
docs
```

---

## 3. LISTA DE TAREAS

### Fase 1: Frontend Docker

- [ ] Crear `frontend/Dockerfile` (multi-stage, Alpine, no-root)
- [ ] Crear `frontend/Dockerfile.dev` (desarrollo con hot reload)
- [ ] Crear `frontend/nginx.conf` (configuración de Nginx)
- [ ] Crear `frontend/default.conf` (virtual host)
- [ ] Crear `frontend/.dockerignore`
- [ ] Probar build: `docker build -t cotizador-frontend .`
- [ ] Verificar tamaño: `docker images | grep cotizador-frontend`

### Fase 2: Backend Docker

- [ ] Crear `ms-core/Dockerfile` (multi-stage, Alpine, no-root)
- [ ] Crear `ms-core/Dockerfile.dev` (desarrollo con watch)
- [ ] Crear `ms-core/.dockerignore`
- [ ] Agregar endpoint `/health` al backend
- [ ] Probar build: `docker build -t cotizador-backend .`
- [ ] Verificar health check funciona

### Fase 3: Docker Compose Desarrollo

- [ ] Crear `docker-compose.yml` en raíz del proyecto
- [ ] Configurar servicios: frontend, ms-core, postgres, redis
- [ ] Configurar volúmenes para hot reload
- [ ] Probar: `docker-compose up --build`
- [ ] Verificar cambios en caliente funcionan

### Fase 4: Docker Compose Producción

- [ ] Crear `docker-compose.prod.yml`
- [ ] Configurar sin volúmenes de bind
- [ ] Agregar restart policies
- [ ] Configurar redes (frontend-network, backend-network internal)
- [ ] Agregar resource limits
- [ ] Probar: `docker-compose -f docker-compose.prod.yml up --build`

### Fase 5: Scripts y Documentación

- [ ] Crear `scripts/build.sh` (build de todas las imágenes)
- [ ] Crear `scripts/push.sh` (push a registry)
- [ ] Actualizar `README.md` con instrucciones Docker
- [ ] Crear `.env.example` con variables necesarias

### Fase 6: CI/CD (Opcional)

- [ ] Crear `.github/workflows/docker-build.yml`
- [ ] Configurar GitHub Container Registry
- [ ] Agregar scan de vulnerabilidades (Trivy)

---

## 4. COMANDOS ÚTILES

```bash
# Construir imágenes
docker build -t cotizador-frontend ./frontend
docker build -t cotizador-backend ./ms-core

# Ejecutar contenedores
docker run -p 8080:8080 cotizador-frontend
docker run -p 3000:3000 --env-file .env cotizador-backend

# Docker Compose desarrollo
docker-compose up --build
docker-compose down

# Docker Compose producción
docker-compose -f docker-compose.prod.yml up --build -d
docker-compose -f docker-compose.prod.yml down

# Ver logs
docker-compose logs -f frontend
docker-compose logs -f ms-core

# Inspeccionar
docker exec -it cotizador-frontend sh
docker exec -it cotizador-backend sh

# Limpiar
docker system prune -a
docker volume prune
```

---

## 5. BUENAS PRÁCTICAS IMPLEMENTADAS

| Práctica | Implementación |
|----------|---------------|
| **Multi-stage builds** | Builder → Production stages |
| **Non-root user** | UID 1001 (frontend), UID 1000 (backend) |
| **Alpine Linux** | node:20-alpine, nginx:alpine |
| **Layer caching** | COPY package.json antes de COPY src |
| **Health checks** | HTTP checks cada 30s |
| **Security headers** | X-Frame-Options, X-Content-Type-Options |
| **Minimal surface** | Solo puertos necesarios expuestos |
| **Resource limits** | CPU/memory limits en docker-compose.prod |
| **Graceful shutdown** | dumb-init para manejo de señales |
| **Secrets management** | Variables de entorno desde .env |

---

*Fin de la especificación*
