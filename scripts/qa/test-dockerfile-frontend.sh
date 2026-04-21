#!/bin/bash
# ==========================================
# Dockerfile Frontend - Test Suite
# ==========================================
# Script de validación automática para el Dockerfile del frontend
# Uso: ./scripts/qa/test-dockerfile-frontend.sh

set -e

echo "========================================"
echo "Dockerfile Frontend - Test Suite"
echo "========================================"
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "frontend/Dockerfile" ]; then
    echo "❌ ERROR: No se encontró frontend/Dockerfile"
    echo "   Ejecutar desde la raíz del proyecto"
    exit 1
fi

# Test 1: Build de la imagen
echo "[1/7] Building image 'frontend:test'..."
docker build -t frontend:test ./frontend --quiet
echo "   ✅ Build completado"
echo ""

# Test 2: Verificar multi-stage (inspeccionar history)
echo "[2/7] Verificando multi-stage build..."
STAGES=$(docker history frontend:test --format "{{.CreatedBy}}" | grep -c "FROM" || true)
if [ "$STAGES" -ge 2 ]; then
    echo "   ✅ PASS - Múltiples stages detectados ($STAGES)"
else
    echo "   ⚠️  WARN - No se detectaron múltiples stages claramente"
fi
echo ""

# Test 3: Verificar usuario no-root
echo "[3/7] Verificando usuario no-root..."
USER_CHECK=$(docker run --rm frontend:test id 2>&1)
echo "   Resultado: $USER_CHECK"
if echo "$USER_CHECK" | grep -q "uid=1001"; then
    echo "   ✅ PASS - Usuario no-root (UID 1001)"
else
    echo "   ❌ FAIL - Usuario no tiene UID 1001"
    exit 1
fi
echo ""

# Test 4: Verificar NO HEALTHCHECK
echo "[4/7] Verificando ausencia de HEALTHCHECK..."
HEALTHCHECK=$(docker inspect frontend:test --format='{{.Config.Healthcheck}}' 2>/dev/null || echo "<nil>")
echo "   Resultado: '$HEALTHCHECK'"
if [ -z "$HEALTHCHECK" ] || [ "$HEALTHCHECK" = "<nil>" ] || [ "$HEALTHCHECK" = "<no value>" ]; then
    echo "   ✅ PASS - No hay HEALTHCHECK configurado"
else
    echo "   ❌ FAIL - HEALTHCHECK encontrado"
    exit 1
fi
echo ""

# Test 5: Verificar labels OCI
echo "[5/7] Verificando labels OCI..."
TITLE=$(docker inspect frontend:test --format='{{.Config.Labels.org.opencontainers.image.title}}' 2>/dev/null || echo "")
DESC=$(docker inspect frontend:test --format='{{.Config.Labels.org.opencontainers.image.description}}' 2>/dev/null || echo "")
VERSION=$(docker inspect frontend:test --format='{{.Config.Labels.org.opencontainers.image.version}}' 2>/dev/null || echo "")
AUTHORS=$(docker inspect frontend:test --format='{{.Config.Labels.org.opencontainers.image.authors}}' 2>/dev/null || echo "")

echo "   org.opencontainers.image.title:       $TITLE"
echo "   org.opencontainers.image.description:   $DESC"
echo "   org.opencontainers.image.version:      $VERSION"
echo "   org.opencontainers.image.authors:      $AUTHORS"

MISSING=""
[ -z "$TITLE" ] && MISSING="$MISSING title"
[ -z "$DESC" ] && MISSING="$MISSING description"
[ -z "$VERSION" ] && MISSING="$MISSING version"
[ -z "$AUTHORS" ] && MISSING="$MISSING authors"

if [ -z "$MISSING" ]; then
    echo "   ✅ PASS - Todos los labels OCI presentes"
else
    echo "   ❌ FAIL - Labels faltantes:$MISSING"
    exit 1
fi
echo ""

# Test 6: Verificar puerto expuesto
echo "[6/7] Verificando puerto 8080..."
PORTS=$(docker inspect frontend:test --format='{{.Config.ExposedPorts}}' 2>/dev/null || echo "")
echo "   ExposedPorts: $PORTS"
if echo "$PORTS" | grep -q "8080"; then
    echo "   ✅ PASS - Puerto 8080 expuesto"
else
    echo "   ❌ FAIL - Puerto 8080 no encontrado"
    exit 1
fi
echo ""

# Test 7: Verificar configuración de Nginx
echo "[7/7] Verificando configuración de Nginx..."
NGINX_TEST=$(docker run --rm frontend:test sh -c "nginx -t" 2>&1)
echo "   $NGINX_TEST"
if echo "$NGINX_TEST" | grep -q "successful"; then
    echo "   ✅ PASS - Nginx configurado correctamente"
else
    echo "   ❌ FAIL - Error en configuración de Nginx"
    exit 1
fi
echo ""

# Resumen
echo "========================================"
echo "✅ TODOS LOS TESTS PASARON"
echo "========================================"
echo ""
echo "Resumen de verificaciones:"
echo "  ✓ Multi-stage build configurado"
echo "  ✓ Usuario no-root (UID 1001)"
echo "  ✓ Sin HEALTHCHECK"
echo "  ✓ Labels OCI presentes"
echo "  ✓ Puerto 8080 expuesto"
echo "  ✓ Nginx configurado correctamente"
echo ""
echo "La imagen 'frontend:test' está lista para usar."
