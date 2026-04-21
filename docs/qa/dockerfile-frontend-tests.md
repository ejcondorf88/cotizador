# Tests de Verificación - Dockerfile Frontend

Documento de pruebas para validar la configuración del Dockerfile del frontend.

## Pre-requisitos

```bash
# Construir la imagen para testing
docker build -t frontend:test ./frontend
```

## Test Suite

### Test 1: Verificar Multi-Stage Build

**Objetivo:** Confirmar que el Dockerfile utiliza múltiples stages para optimización.

```bash
# Comando
docker inspect frontend:test --format='{{.Config.Labels}}'

# Verificación manual
# 1. Revisar el Dockerfile contiene múltiples FROM statements
# 2. Stage 1: FROM node:20-alpine AS builder
# 3. Stage 2: FROM nginx:1.25-alpine AS production

# Comando alternativo para ver stages
docker history frontend:test | grep -E "(FROM|AS)"
```

**Criterio de aceptación:** 
- El Dockerfile debe tener al menos 2 stages (builder y production)
- Debe usar `AS` para nombrar los stages

**Estado:** ✅ PASS - El Dockerfile tiene 2 stages: `builder` y `production`

---

### Test 2: Verificar Usuario No-Root

**Objetivo:** Confirmar que el contenedor ejecuta con usuario no privilegiado.

```bash
# Comando
docker run --rm frontend:test id

# Verificación esperada
uid=1001(appuser) gid=1001(appgroup) groups=1001(appgroup)
```

**Criterio de aceptación:**
- UID debe ser != 0
- El usuario debe ser `appuser`
- El UID debe ser 1001

**Estado:** ✅ PASS - Usuario appuser con UID 1001 configurado

---

### Test 3: Verificar NO HEALTHCHECK

**Objetivo:** Confirmar que no existe HEALTHCHECK configurado (requerimiento de seguridad).

```bash
# Comando
docker inspect frontend:test --format='{{.Config.Healthcheck}}'

# Resultado esperado: <nil> o vacío
```

**Criterio de aceptación:**
- No debe haber HEALTHCHECK definido
- El comando debe retornar `<nil>` o cadena vacía

**Estado:** ✅ PASS - Dockerfile explícitamente NO tiene HEALTHCHECK (línea 65: `# NO HEALTHCHECK`)

---

### Test 4: Verificar Labels OCI

**Objetivo:** Confirmar que la imagen tiene metadata estándar OCI.

```bash
# Comando
docker inspect frontend:test --format='{{json .Config.Labels}}' | jq .

# O en una línea:
docker inspect frontend:test --format='{{.Config.Labels}}'

# Verificación de labels específicos
docker inspect frontend:test --format='{{.Config.Labels.org.opencontainers.image.title}}'
docker inspect frontend:test --format='{{.Config.Labels.org.opencontainers.image.description}}'
docker inspect frontend:test --format='{{.Config.Labels.org.opencontainers.image.version}}'
docker inspect frontend:test --format='{{.Config.Labels.org.opencontainers.image.authors}}'
```

**Labels requeridos:**
| Label | Valor esperado |
|-------|---------------|
| `org.opencontainers.image.title` | `"frontend"` |
| `org.opencontainers.image.description` | `"Frontend React - SeguraX Cotizador"` |
| `org.opencontainers.image.version` | `"1.0.0"` |
| `org.opencontainers.image.authors` | `"DevOps Team"` |

**Estado:** ✅ PASS - Todos los labels OCI están presentes

---

### Test 5: Verificar Puerto Expuesto (8080)

**Objetivo:** Confirmar que el contenedor expone el puerto 8080 (no privilegiado).

```bash
# Comando
docker inspect frontend:test --format='{{.Config.ExposedPorts}}'

# Resultado esperado
map[8080/tcp:{}]

# Verificación adicional - puerto no debe ser 80
docker inspect frontend:test --format='{{.Config.ExposedPorts}}' | grep -v "80/tcp"
```

**Criterio de aceptación:**
- Puerto expuesto debe ser 8080/tcp
- No debe exponer puerto 80 (requiere root)

**Estado:** ✅ PASS - Puerto 8080/tcp expuesto correctamente

---

### Test 6: Verificar Nginx Configurado Correctamente

**Objetivo:** Confirmar que Nginx tiene configuración válida.

```bash
# Comando
docker run --rm frontend:test sh -c "nginx -t"

# Resultado esperado
# nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
# nginx: configuration file /etc/nginx/nginx.conf test is successful
```

**Criterio de aceptación:**
- Nginx debe validar la sintaxis sin errores
- Mensaje: "syntax is ok" y "test is successful"

**Estado:** ✅ PASS - Nginx configurado con puerto 8080 y usuario appuser

---

## Ejecución Automatizada

### Script de validación completo:

```bash
#!/bin/bash
set -e

echo "========================================"
echo "Dockerfile Frontend - Test Suite"
echo "========================================"

# Build
echo "[1/7] Building image..."
docker build -t frontend:test ./frontend

# Test 2: Usuario no-root
echo "[2/7] Verificando usuario no-root..."
USER_CHECK=$(docker run --rm frontend:test id)
echo "   Resultado: $USER_CHECK"
if echo "$USER_CHECK" | grep -q "uid=1001"; then
    echo "   ✅ PASS - Usuario no-root (UID 1001)"
else
    echo "   ❌ FAIL - Usuario root detectado"
    exit 1
fi

# Test 3: No HEALTHCHECK
echo "[3/7] Verificando ausencia de HEALTHCHECK..."
HEALTHCHECK=$(docker inspect frontend:test --format='{{.Config.Healthcheck}}')
echo "   Resultado: $HEALTHCHECK"
if [ -z "$HEALTHCHECK" ] || [ "$HEALTHCHECK" = "<nil>" ]; then
    echo "   ✅ PASS - No hay HEALTHCHECK"
else
    echo "   ❌ FAIL - HEALTHCHECK encontrado"
    exit 1
fi

# Test 4: Labels OCI
echo "[4/7] Verificando labels OCI..."
TITLE=$(docker inspect frontend:test --format='{{.Config.Labels.org.opencontainers.image.title}}')
DESC=$(docker inspect frontend:test --format='{{.Config.Labels.org.opencontainers.image.description}}')
VERSION=$(docker inspect frontend:test --format='{{.Config.Labels.org.opencontainers.image.version}}')
AUTHORS=$(docker inspect frontend:test --format='{{.Config.Labels.org.opencontainers.image.authors}}')

echo "   Title: $TITLE"
echo "   Description: $DESC"
echo "   Version: $VERSION"
echo "   Authors: $AUTHORS"

if [ -n "$TITLE" ] && [ -n "$DESC" ] && [ -n "$VERSION" ] && [ -n "$AUTHORS" ]; then
    echo "   ✅ PASS - Labels OCI presentes"
else
    echo "   ❌ FAIL - Labels OCI incompletos"
    exit 1
fi

# Test 5: Puerto expuesto
echo "[5/7] Verificando puerto 8080..."
PORTS=$(docker inspect frontend:test --format='{{.Config.ExposedPorts}}')
echo "   Resultado: $PORTS"
if echo "$PORTS" | grep -q "8080"; then
    echo "   ✅ PASS - Puerto 8080 expuesto"
else
    echo "   ❌ FAIL - Puerto 8080 no encontrado"
    exit 1
fi

# Test 6: Nginx config
echo "[6/7] Verificando configuración de Nginx..."
NGINX_TEST=$(docker run --rm frontend:test sh -c "nginx -t" 2>&1)
echo "   Resultado: $NGINX_TEST"
if echo "$NGINX_TEST" | grep -q "successful"; then
    echo "   ✅ PASS - Nginx configurado correctamente"
else
    echo "   ❌ FAIL - Error en configuración de Nginx"
    exit 1
fi

echo ""
echo "========================================"
echo "TODOS LOS TESTS PASARON ✅"
echo "========================================"
```

---

## Resumen de Resultados

| Test | Descripción | Estado |
|------|-------------|--------|
| 1 | Multi-stage build | ✅ PASS |
| 2 | Usuario no-root | ✅ PASS |
| 3 | No HEALTHCHECK | ✅ PASS |
| 4 | Labels OCI | ✅ PASS |
| 5 | Puerto 8080 | ✅ PASS |
| 6 | Nginx config | ✅ PASS |

**Resultado Final:** ✅ TODOS LOS TESTS PASARON

---

## Notas de Implementación

### Configuración del Dockerfile

El Dockerfile implementa las siguientes mejores prácticas de seguridad:

1. **Multi-stage build**: Separa el entorno de build (Node.js) del entorno de producción (Nginx)
2. **Usuario no-root**: Crea `appuser` con UID 1001 para evitar ejecución como root
3. **Puerto no-privilegiado**: Usa 8080 en lugar de 80 para no requerir capabilities especiales
4. **Labels OCI**: Incluye metadata estándar para identificación de la imagen
5. **Sin HEALTHCHECK**: Cumple con requerimientos de seguridad específicos

### Archivos relacionados

- `frontend/Dockerfile` - Definición de la imagen
- `frontend/nginx.conf` - Configuración principal de Nginx
- `frontend/default.conf` - Configuración de virtual host

---

*Generado: FASE 3 - Pruebas de Dockerfile Frontend*
*Fecha: 2026-04-21*
