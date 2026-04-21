#!/bin/bash
# =============================================================================
# Script de Pruebas para Dockerfiles de Microservicios
# ASDD Phase 3 - Testing
# =============================================================================
# Este script valida los Dockerfiles de los microservicios backend:
# - ms-catalogos (Node.js/NestJS)
# - ms-gateway (Java/Spring Boot)
# - ms-core (Node.js/Express)
#
# Tests ejecutados:
# 1. Verificar multi-stage build
# 2. Verificar usuario no-root
# 3. Verificar NO HEALTHCHECK
# 4. Verificar labels OCI
# 5. Verificar puerto expuesto
# =============================================================================

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variables globales
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
BUILD_LOG="/tmp/docker-build-$$.log"
TEST_RESULTS=()
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Configuración de servicios
SERVICES=(
    "ms-catalogos:3001"
    "ms-gateway:8080"
    "ms-core:3000"
)

# =============================================================================
# Funciones de utilidad
# =============================================================================

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[PASS]${NC} $1"
}

log_error() {
    echo -e "${RED}[FAIL]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

record_test() {
    local service="$1"
    local test_name="$2"
    local result="$3"
    local message="$4"

    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    TEST_RESULTS+=("${service}|${test_name}|${result}|${message}")

    if [ "$result" == "PASS" ]; then
        PASSED_TESTS=$((PASSED_TESTS + 1))
        log_success "[${service}] ${test_name}: ${message}"
    else
        FAILED_TESTS=$((FAILED_TESTS + 1))
        log_error "[${service}] ${test_name}: ${message}"
    fi
}

# =============================================================================
# Test 1: Verificar Multi-Stage Build
# =============================================================================
test_multistage_build() {
    local service="$1"
    local image_tag="$2"

    log_info "Test 1: Verificando multi-stage build para ${service}..."

    # Obtener el historial de capas y verificar stages
    local stages
    stages=$(docker history --format '{{.CreatedBy}}' "${image_tag}" | grep -E "(FROM|AS)" | head -10)

    if [ -n "$stages" ]; then
        # Contar stages FROM distintos
        local stage_count
        stage_count=$(docker inspect --format='{{range .Config.Env}}{{println .}}{{end}}' "${image_tag}" 2>/dev/null | grep -c "NODE_ENV\|JAVA" || echo "0")

        # Verificar que el Dockerfile tenga múltiples stages
        local dockerfile_path="${PROJECT_ROOT}/${service}/Dockerfile"
        local from_count
        from_count=$(grep -c "^FROM" "$dockerfile_path" 2>/dev/null || echo "0")

        if [ "$from_count" -ge 2 ]; then
            record_test "$service" "Multi-Stage Build" "PASS" "Found ${from_count} stages in Dockerfile"
        else
            record_test "$service" "Multi-Stage Build" "FAIL" "Only ${from_count} stage(s) found, expected at least 2"
        fi
    else
        record_test "$service" "Multi-Stage Build" "FAIL" "Could not detect build stages"
    fi
}

# =============================================================================
# Test 2: Verificar Usuario No-Root
# =============================================================================
test_non_root_user() {
    local service="$1"
    local image_tag="$2"

    log_info "Test 2: Verificando usuario no-root para ${service}..."

    # Crear un contenedor temporal para verificar el usuario
    local container_id
    container_id=$(docker create "${image_tag}")

    # Obtener el usuario configurado
    local user_config
    user_config=$(docker inspect --format='{{.Config.User}}' "${container_id}")

    # Verificar UID dentro del contenedor
    local uid
    uid=$(docker run --rm --entrypoint sh "${image_tag}" -c "id -u" 2>/dev/null || echo "unknown")

    # Limpiar contenedor temporal
    docker rm "$container_id" > /dev/null 2>&1

    if [ "$uid" != "0" ] && [ "$uid" != "" ] && [ "$uid" != "unknown" ]; then
        record_test "$service" "Non-Root User" "PASS" "Running as UID ${uid} (non-root)"
    elif [ -n "$user_config" ]; then
        record_test "$service" "Non-Root User" "PASS" "USER directive set to: ${user_config}"
    else
        record_test "$service" "Non-Root User" "FAIL" "Container running as root (UID: ${uid})"
    fi
}

# =============================================================================
# Test 3: Verificar NO HEALTHCHECK
# =============================================================================
test_no_healthcheck() {
    local service="$1"
    local image_tag="$2"

    log_info "Test 3: Verificando ausencia de HEALTHCHECK para ${service}..."

    # Verificar si hay HEALTHCHECK configurado
    local healthcheck
    healthcheck=$(docker inspect --format='{{.Config.Healthcheck}}' "${image_tag}" 2>/dev/null)

    if [ -z "$healthcheck" ] || [ "$healthcheck" == "<nil>" ]; then
        record_test "$service" "No Healthcheck" "PASS" "No HEALTHCHECK defined (as required)"
    else
        record_test "$service" "No Healthcheck" "FAIL" "HEALTHCHECK found: ${healthcheck}"
    fi
}

# =============================================================================
# Test 4: Verificar Labels OCI
# =============================================================================
test_oci_labels() {
    local service="$1"
    local image_tag="$2"

    log_info "Test 4: Verificando labels OCI para ${service}..."

    # Obtener todos los labels
    local labels
    labels=$(docker inspect --format='{{json .Config.Labels}}' "${image_tag}" 2>/dev/null)

    local missing_labels=()
    local required_labels=(
        "org.opencontainers.image.title"
        "org.opencontainers.image.description"
        "org.opencontainers.image.version"
        "org.opencontainers.image.authors"
    )

    for label in "${required_labels[@]}"; do
        if ! echo "$labels" | grep -q "$label"; then
            missing_labels+=("$label")
        fi
    done

    if [ ${#missing_labels[@]} -eq 0 ]; then
        record_test "$service" "OCI Labels" "PASS" "All required OCI labels present"
    else
        record_test "$service" "OCI Labels" "FAIL" "Missing labels: ${missing_labels[*]}"
    fi
}

# =============================================================================
# Test 5: Verificar Puerto Expuesto
# =============================================================================
test_exposed_port() {
    local service="$1"
    local image_tag="$2"
    local expected_port="$3"

    log_info "Test 5: Verificando puerto expuesto ${expected_port} para ${service}..."

    # Obtener puertos expuestos
    local exposed_ports
    exposed_ports=$(docker inspect --format='{{json .Config.ExposedPorts}}' "${image_tag}" 2>/dev/null)

    if echo "$exposed_ports" | grep -q "${expected_port}/tcp"; then
        record_test "$service" "Exposed Port" "PASS" "Port ${expected_port}/tcp is exposed"
    else
        record_test "$service" "Exposed Port" "FAIL" "Port ${expected_port}/tcp not found. Exposed: ${exposed_ports}"
    fi
}

# =============================================================================
# Función para construir imagen
# =============================================================================
build_image() {
    local service="$1"
    local image_tag="$2"

    log_info "Building image for ${service}..."

    local service_dir="${PROJECT_ROOT}/${service}"

    if [ ! -d "$service_dir" ]; then
        log_error "Service directory not found: ${service_dir}"
        return 1
    fi

    if [ ! -f "${service_dir}/Dockerfile" ]; then
        log_error "Dockerfile not found in: ${service_dir}"
        return 1
    fi

    # Construir la imagen
    if docker build -t "${image_tag}" "${service_dir}" > "${BUILD_LOG}.${service}" 2>&1; then
        log_success "Image ${image_tag} built successfully"
        return 0
    else
        log_error "Failed to build image ${image_tag}"
        cat "${BUILD_LOG}.${service}"
        return 1
    fi
}

# =============================================================================
# Función para limpiar recursos
# =============================================================================
cleanup() {
    log_info "Cleaning up resources..."

    # Remover logs temporales
    rm -f "${BUILD_LOG}".*

    # Opcional: remover imágenes construidas (descomentar si se desea)
    # for service_pair in "${SERVICES[@]}"; do
    #     IFS=':' read -r service port <<< "$service_pair"
    #     local image_tag="test-${service}:latest"
    #     docker rmi "${image_tag}" > /dev/null 2>&1 || true
    # done
}

# =============================================================================
# Reporte Final
# =============================================================================
print_summary() {
    echo ""
    echo "============================================================================="
    echo "                         TEST SUMMARY REPORT"
    echo "============================================================================="
    echo ""

    # Agrupar por servicio
    for service_pair in "${SERVICES[@]}"; do
        IFS=':' read -r service port <<< "$service_pair"
        echo -e "${BLUE}Service: ${service}${NC}"
        echo "-----------------------------------------------------------------------------"

        for result in "${TEST_RESULTS[@]}"; do
            IFS='|' read -r svc test_name status message <<< "$result"
            if [ "$svc" == "$service" ]; then
                if [ "$status" == "PASS" ]; then
                    echo -e "  ${GREEN}✓${NC} ${test_name}: ${message}"
                else
                    echo -e "  ${RED}✗${NC} ${test_name}: ${message}"
                fi
            fi
        done
        echo ""
    done

    echo "============================================================================="
    echo "                              FINAL RESULTS"
    echo "============================================================================="
    echo -e "Total Tests:  ${TOTAL_TESTS}"
    echo -e "Passed:       ${GREEN}${PASSED_TESTS}${NC}"
    echo -e "Failed:       ${RED}${FAILED_TESTS}${NC}"
    echo "============================================================================="

    if [ $FAILED_TESTS -eq 0 ]; then
        echo -e "${GREEN}All tests PASSED! ✓${NC}"
        return 0
    else
        echo -e "${RED}Some tests FAILED! ✗${NC}"
        return 1
    fi
}

# =============================================================================
# Función principal
# =============================================================================
main() {
    echo "============================================================================="
    echo "            DOCKERFILE TEST SUITE - MICROSERVICES VALIDATION"
    echo "============================================================================="
    echo ""
    log_info "Starting Docker validation tests..."
    log_info "Project root: ${PROJECT_ROOT}"
    echo ""

    # Verificar que Docker está disponible
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed or not in PATH"
        exit 1
    fi

    if ! docker info &> /dev/null; then
        log_error "Docker daemon is not running"
        exit 1
    fi

    log_success "Docker is available"
    echo ""

    # Procesar cada servicio
    for service_pair in "${SERVICES[@]}"; do
        IFS=':' read -r service port <<< "$service_pair"
        local image_tag="test-${service}:latest"

        echo "-------------------------------------------------------------------------"
        log_info "Processing service: ${service} (port: ${port})"
        echo "-------------------------------------------------------------------------"

        # Construir la imagen
        if ! build_image "$service" "$image_tag"; then
            record_test "$service" "Build" "FAIL" "Docker build failed"
            continue
        fi

        record_test "$service" "Build" "PASS" "Docker build successful"

        # Ejecutar tests
        test_multistage_build "$service" "$image_tag"
        test_non_root_user "$service" "$image_tag"
        test_no_healthcheck "$service" "$image_tag"
        test_oci_labels "$service" "$image_tag"
        test_exposed_port "$service" "$image_tag" "$port"

        echo ""
    done

    # Mostrar resumen
    print_summary
    local exit_code=$?

    # Limpiar
    cleanup

    exit $exit_code
}

# Ejecutar función principal
main "$@"
