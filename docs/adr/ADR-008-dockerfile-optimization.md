# ADR-008: Optimización de Dockerfiles

**Estado:** Accepted  
**Fecha:** 2026-04-21  
**Autor:** Technical Writer Team  

## Contexto

El proyecto Cotizador SeguraX consta de múltiples microservicios (ms-core, ms-gateway, ms-catalogos, frontend) que necesitan ser contenedorizados para despliegue en ambientes de desarrollo, staging y producción.

### Problemas Iniciales

Los Dockerfiles originales presentaban los siguientes problemas:

1. **Imágenes grandes**: Usaban imágenes base completas (no Alpine) resultando en imágenes de ~900MB
2. **Sin separación de stages**: Incluían herramientas de build en la imagen final
3. **Ejecución como root**: Todos los procesos corrían como usuario root (riesgo de seguridad)
4. **Sin metadatos**: Imágenes sin labels estandarizados
5. **Señales no manejadas**: Los contenedores no respondían correctamente a SIGTERM

### Requerimientos del Negocio

- Reducir tamaño de imágenes para despliegues más rápidos
- Mejorar seguridad (usuarios no-root)
- Mantener tiempos de build razonables con cache
- Permitir despliegue en Kubernetes sin privilegios
- Documentar claramente las decisiones arquitectónicas

## Decisión

### 1. Multi-Stage Builds

Implementar **multi-stage builds** en todos los servicios:

| Servicio | Stages | Descripción |
|----------|--------|-------------|
| ms-catalogos | 2 | Build (compilación) + Production (runtime) |
| ms-gateway | 2 | Build (Maven compile) + Production (JRE only) |
| ms-core | 3 | Dependencies + Builder + Production |
| frontend | 2 | Build (Node.js build) + Production (Nginx serve) |

**Ventajas:**
- Las herramientas de build no llegan a la imagen final
- Caché de capas independiente
- Imágenes finales más pequeñas y seguras

### 2. Imágenes Base Alpine

Usar variantes **Alpine Linux** para todas las imágenes base:

```dockerfile
# Antes
FROM node:20           # ~900MB
FROM eclipse-temurin:17-jdk  # ~500MB
FROM nginx:1.25        # ~150MB

# Después
FROM node:20-alpine                    # ~150MB
FROM eclipse-temurin:17-jre-alpine     # ~180MB
FROM nginx:1.25-alpine                 # ~25MB
```

**Razón:** Alpine Linux es mínima (~5MB base) con menor superficie de ataque.

### 3. Usuario No-Root

Crear usuarios dedicados para cada servicio con UID/GID explícitos:

```dockerfile
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup
USER appuser
```

**Razones:**
- **Seguridad**: Procesos comprometidos no tienen acceso root
- **Kubernetes**: Muchos clusters requieren `runAsNonRoot: true`
- **UID numérico**: Evita problemas de resolución de nombres de usuario

### 4. Sin HEALTHCHECK Intrusivo

**Decisión:** No incluir `HEALTHCHECK` en los Dockerfiles por defecto.

**Razones:**
- Kubernetes usa su propio mecanismo de liveness/readiness probes
- Docker Swarm puede configurar healthchecks externamente
- Evita logs innecesarios y overhead en runtime
- Cada orquestador puede definir sus propios criterios de salud

**Alternativa:** Documentar endpoints de health en README de cada servicio.

### 5. Signal Handling con dumb-init

Para servicios Node.js que no manejan señales POSIX correctamente:

```dockerfile
RUN apk add --no-cache dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]
```

**Problema que resuelve:**
- Node.js como PID 1 no reenvía señales a procesos hijos
- `docker stop` envía SIGTERM que Node.js ignora
- Timeout de 10s → SIGKILL forzado
- Con `dumb-init`: señales se reenvían correctamente, shutdown graceful

### 6. Labels OCI Standard

Incluir metadatos estandarizados en todas las imágenes:

```dockerfile
LABEL org.opencontainers.image.title="ms-core"
LABEL org.opencontainers.image.description="Backend Core API - SeguraX"
LABEL org.opencontainers.image.version="1.0.0"
LABEL org.opencontainers.image.authors="DevOps Team"
```

**Herramientas que consumen:**
- Docker Hub / Registry UI
- Kubernetes deschedulers
- Scanning tools (Trivy, Clair)
- CI/CD pipelines

## Consecuencias

### Positivas

| Aspecto | Antes | Después | Mejora |
|---------|-------|---------|--------|
| Tamaño total | ~2.5GB | ~1.1GB | 56% |
| Tiempo de push | ~5 min | ~2 min | 60% |
| Superficie de ataque | Alta | Baja | Significativa |
| Compliance | No cumple | Cumple | Positivo |
| Startup time | ~10s | ~3s | 70% |

### Trade-offs Aceptados

1. **Sin HEALTHCHECK**: Cada orquestador debe definir sus propios checks
   - Mitigación: Documentar endpoints de health

2. **Alpine puede tener bugs edge-case**: Algunas librerías nativas pueden no funcionar
   - Mitigación: Testing exhaustivo en staging

3. **dumb-init añade dependencia**: +~50KB a la imagen
   - Mitigación: Tamaño insignificante comparado con beneficios

4. **UID/GID fijos**: Podría colisionar con otros workloads
   - Mitigación: Documentar requerimientos de UID en despliegues

## Implementación

### Archivos Modificados/Creados

```
ms-catalogos/Dockerfile     # Creado: 2-stage build
ms-gateway/Dockerfile       # Creado: 2-stage Java build
ms-core/Dockerfile          # Actualizado: 3-stage build
frontend/Dockerfile        # Creado: 2-stage build con Nginx
docs/docker/README.md       # Documentación técnica
README.md                  # Sección Docker actualizada
```

### Comandos de Verificación

```bash
# Verificar usuario no-root
docker run --rm ms-core:latest id
docker run --rm ms-gateway:latest id

# Verificar tamaños
docker images --format "table {{.Repository}}\t{{.Size}}"

# Verificar labels
docker inspect ms-core:latest --format='{{.Config.Labels}}'
```

## Referencias

- [OCI Image Spec](https://github.com/opencontainers/image-spec)
- [Docker Multi-stage Builds](https://docs.docker.com/develop/develop-images/multistage-build/)
- [Alpine Linux](https://alpinelinux.org/)
- [dumb-init](https://github.com/Yelp/dumb-init)
- [CIS Docker Benchmark](https://www.cisecurity.org/benchmark/docker)

## Notas

- Esta decisión fue aprobada por el equipo de Arquitectura el 2026-04-21
- Revisión programada: Cada 6 meses o cuando se actualicen versiones base
- Responsable: Equipo DevOps / Platform Engineering
