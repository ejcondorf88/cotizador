# Pruebas de Dockerfiles - Guía de Verificación

## Introducción

Este documento describe los comandos manuales para validar los Dockerfiles de los microservicios backend del proyecto Cotizador SeguraX.

## Servicios a Validar

| Servicio | Puerto | Tecnología | Dockerfile |
|----------|--------|------------|------------|
| ms-catalogos | 3001 | Node.js/NestJS | `ms-catalogos/Dockerfile` |
| ms-gateway | 8080 | Java/Spring Boot | `ms-gateway/Dockerfile` |
| ms-core | 3000 | Node.js/Express | `ms-core/Dockerfile` |

---

## Test 1: Verificar Multi-Stage Build

**Objetivo:** Confirmar que el Dockerfile utiliza múltiples stages para optimizar el tamaño de la imagen.

### Comando:
```bash
# Verificar número de stages FROM en el Dockerfile
grep -c "^FROM" <servicio>/Dockerfile

# Debe retornar >= 2
```

### Verificación Manual:
```bash
# Para ms-catalogos
grep "^FROM" ms-catalogos/Dockerfile
# Output esperado: 2 líneas (builder + production)

# Para ms-gateway  
grep "^FROM" ms-gateway/Dockerfile
# Output esperado: 2 líneas (builder + production)

# Para ms-core
grep "^FROM" ms-core/Dockerfile
# Output esperado: 3 líneas (dependencies + builder + production)
```

**Criterio de Aceptación:** Al menos 2 stages (FROM) deben estar presentes en cada Dockerfile.

---

## Test 2: Verificar Usuario No-Root

**Objetivo:** Asegurar que la imagen ejecuta el contenedor con un usuario no privilegiado.

### Comando:
```bash
# Construir la imagen
docker build -t test-<servicio>:latest <servicio>/

# Verificar UID dentro del contenedor
docker run --rm test-<servicio>:latest id -u
```

### Verificación Manual:
```bash
# ms-catalogos
docker build -t test-ms-catalogos:latest ms-catalogos/
docker run --rm test-ms-catalogos:latest id -u
# Output esperado: 1001 (no 0)

# ms-gateway
docker build -t test-ms-gateway:latest ms-gateway/
docker run --rm test-ms-gateway:latest id -u
# Output esperado: 1001 (no 0)

# ms-core
docker build -t test-ms-core:latest ms-core/
docker run --rm test-ms-core:latest id -u
# Output esperado: 1000 (usuario 'node' nativo)
```

**Criterio de Aceptación:** El UID debe ser diferente de 0 (no root).

---

## Test 3: Verificar NO HEALTHCHECK

**Objetivo:** Confirmar que no existe configuración de HEALTHCHECK en la imagen.

### Comando:
```bash
# Inspeccionar configuración de Healthcheck
docker inspect --format='{{.Config.Healthcheck}}' test-<servicio>:latest
```

### Verificación Manual:
```bash
# Para cada servicio
docker inspect --format='{{.Config.Healthcheck}}' test-ms-catalogos:latest
# Output esperado: <nil> o vacío

docker inspect --format='{{.Config.Healthcheck}}' test-ms-gateway:latest
# Output esperado: <nil> o vacío

docker inspect --format='{{.Config.Healthcheck}}' test-ms-core:latest
# Output esperado: <nil> o vacío
```

**Criterio de Aceptación:** No debe existir HEALTHCHECK configurado (retornar vacío o `<nil>`).

---

## Test 4: Verificar Labels OCI

**Objetivo:** Validar que la imagen incluye los labels estándar de Open Containers Initiative.

### Comando:
```bash
# Obtener todos los labels
docker inspect --format='{{.Config.Labels}}' test-<servicio>:latest
```

### Verificación Manual:
```bash
# Para cada servicio
docker inspect --format='{{.Config.Labels}}' test-ms-catalogos:latest
docker inspect --format='{{.Config.Labels}}' test-ms-gateway:latest
docker inspect --format='{{.Config.Labels}}' test-ms-core:latest

# Labels requeridos que deben estar presentes:
# - org.opencontainers.image.title
# - org.opencontainers.image.description
# - org.opencontainers.image.version
# - org.opencontainers.image.authors
```

### Verificación con jq:
```bash
# Para una salida más legible
docker inspect test-ms-catalogos:latest | jq '.[0].Config.Labels'
```

**Criterio de Aceptación:** Los 4 labels OCI deben estar presentes con valores no vacíos.

---

## Test 5: Verificar Puerto Expuesto

**Objetivo:** Confirmar que el puerto correcto está expuesto en la imagen.

### Comando:
```bash
# Verificar puertos expuestos
docker inspect --format='{{.Config.ExposedPorts}}' test-<servicio>:latest
```

### Verificación Manual:
```bash
# ms-catalogos - Puerto 3001
docker inspect --format='{{.Config.ExposedPorts}}' test-ms-catalogos:latest
# Output esperado: map[3001/tcp:{}]

# ms-gateway - Puerto 8080
docker inspect --format='{{.Config.ExposedPorts}}' test-ms-gateway:latest
# Output esperado: map[8080/tcp:{}]

# ms-core - Puerto 3000
docker inspect --format='{{.Config.ExposedPorts}}' test-ms-core:latest
# Output esperado: map[3000/tcp:{}]
```

**Criterio de Aceptación:** El puerto específico para cada servicio debe estar expuesto.

---

## Script Automatizado

Para ejecutar todos los tests de forma automatizada, usar el script:

```bash
# Hacer ejecutable y correr
chmod +x scripts/test-dockerfiles.sh
./scripts/test-dockerfiles.sh
```

### Salida Esperada:
```
=============================================================================
            DOCKERFILE TEST SUITE - MICROSERVICES VALIDATION
=============================================================================

[INFO] Starting Docker validation tests...
...

=============================================================================
                              FINAL RESULTS
=============================================================================
Total Tests:  18
Passed:       18
Failed:       0
=============================================================================
All tests PASSED! ✓
```

---

## Resumen de Criterios de Aceptación

| Test | Criterio | ms-catalogos | ms-gateway | ms-core |
|------|----------|--------------|------------|---------|
| 1. Multi-Stage | ≥ 2 stages | ✅ 2 stages | ✅ 2 stages | ✅ 3 stages |
| 2. Non-Root | UID ≠ 0 | ✅ UID 1001 | ✅ UID 1001 | ✅ UID 1000 |
| 3. No Healthcheck | Ausente | ✅ | ✅ | ✅ |
| 4. OCI Labels | 4 presentes | ✅ | ✅ | ✅ |
| 5. Exposed Port | Correcto | ✅ 3001 | ✅ 8080 | ✅ 3000 |

---

## Troubleshooting

### Error: "Docker daemon not running"
```bash
# Iniciar Docker Desktop o el daemon
sudo systemctl start docker  # Linux
open -a Docker              # macOS
```

### Error: "Permission denied al construir"
```bash
# Agregar usuario al grupo docker
sudo usermod -aG docker $USER
# Cerrar sesión y volver a iniciar
```

### Error: "Build failed - package not found"
```bash
# Verificar que existan los archivos de dependencias
ls -la ms-catalogos/package*.json
ls -la ms-gateway/pom.xml
```

---

## Referencias

- [OCI Image Specification](https://github.com/opencontainers/image-spec/blob/main/annotations.md)
- [Docker Multi-Stage Builds](https://docs.docker.com/build/building/multi-stage/)
- [Docker Security Best Practices](https://docs.docker.com/develop/security-best-practices/)
