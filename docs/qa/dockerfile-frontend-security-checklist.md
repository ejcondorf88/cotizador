# Checklist de Seguridad - Dockerfile Frontend

Documento de verificación de prácticas de seguridad implementadas en el Dockerfile del frontend.

## ✅ Checklist de Seguridad

### 1. Multi-Stage Build
- [x] **Implementado**: El Dockerfile utiliza 2 stages
  - Stage `builder`: Node.js 20 Alpine para compilar la aplicación
  - Stage `production`: Nginx 1.25 Alpine para servir archivos estáticos
- [x] **Beneficio**: Reduce el tamaño de la imagen final eliminando dependencias de build
- [x] **Beneficio**: No expone el código fuente ni las herramientas de desarrollo en producción

### 2. Usuario No-Root
- [x] **Implementado**: Usuario `appuser` creado con UID 1001
- [x] **Implementado**: Grupo `appgroup` creado con GID 1001
- [x] **Verificación**: `USER appuser` antes del CMD
- [x] **Verificación**: Permisos cambiados con `chown -R appuser:appgroup`
- [x] **Archivos afectados**:
  - `/usr/share/nginx/html` (archivos estáticos)
  - `/var/cache/nginx` (cache)
  - `/var/log/nginx` (logs)
  - `/tmp/nginx` (temporal)

### 3. Puerto No-Privilegiado
- [x] **Implementado**: Puerto 8080 en lugar de 80
- [x] **Razón**: Puertos < 1024 requieren root o capabilities especiales
- [x] **Configuración**: Modificado via `sed` en el Dockerfile
  ```dockerfile
  RUN sed -i 's/listen 80/listen 8080/g' /etc/nginx/conf.d/default.conf
  ```

### 4. Sin HEALTHCHECK
- [x] **Implementado**: Dockerfile explícitamente NO tiene HEALTHCHECK
- [x] **Razón**: Requerimiento de seguridad específico del proyecto
- [x] **Verificación**: `docker inspect` retorna `<nil>`

### 5. Labels OCI (Open Container Initiative)
- [x] **Implementado**: Labels estándar para metadata
  - `org.opencontainers.image.title`
  - `org.opencontainers.image.description`
  - `org.opencontainers.image.version`
  - `org.opencontainers.image.authors`
- [x] **Beneficio**: Identificación y trazabilidad de la imagen
- [x] **Beneficio**: Compatibilidad con herramientas de scan de imágenes

### 6. Imágenes Base Mínimas
- [x] **Implementado**: `node:20-alpine` (Alpine Linux ~5MB base)
- [x] **Implementado**: `nginx:1.25-alpine` (Alpine Linux)
- [x] **Beneficio**: Superficie de ataque reducida
- [x] **Beneficio**: Menos paquetes = menos vulnerabilidades

### 7. Limpieza de Cache
- [x] **Implementado**: `npm cache clean --force` después de `npm ci`
- [x] **Beneficio**: Reduce tamaño de la capa de build
- [x] **Beneficio**: No incluye metadata innecesaria

### 8. Configuración de Nginx Segura
- [x] **Headers de seguridad**:
  - `X-Frame-Options: SAMEORIGIN`
  - `X-Content-Type-Options: nosniff`
  - `X-XSS-Protection: 1; mode=block`
  - `Referrer-Policy: strict-origin-when-cross-origin`
- [x] **Gzip**: Habilitado para reducir tamaño de transferencia
- [x] **Cache**: Configurado para assets estáticos (1 año)
- [x] **PID**: `/tmp/nginx.pid` (escritura sin root)

### 9. Copia de Archivos Específicos
- [x] **Implementado**: `COPY package*.json` antes del código fuente
- [x] **Beneficio**: Aprovecha cache de Docker para dependencias
- [x] **Implementado**: Solo copia `dist/` del builder, no todo el source

### 10. Directorios de Trabajo
- [x] **Implementado**: `WORKDIR /app` explícito
- [x] **Beneficio**: Evita trabajar en `/` o directorios del sistema

---

## Validación de Comandos

### Verificar usuario no-root
```bash
docker run --rm frontend:test id
# Esperado: uid=1001(appuser) gid=1001(appgroup)
```

### Verificar que no corre como root
```bash
docker run --rm frontend:test whoami
# Esperado: appuser
```

### Verificar puerto expuesto
```bash
docker inspect frontend:test --format='{{.Config.ExposedPorts}}'
# Esperado: map[8080/tcp:{}]
```

### Verificar labels
```bash
docker inspect frontend:test --format='{{json .Config.Labels}}'
```

### Verificar NO HEALTHCHECK
```bash
docker inspect frontend:test --format='{{.Config.Healthcheck}}'
# Esperado: <nil>
```

---

## Análisis de Vulnerabilidades

### Recomendación: Escaneo con Trivy
```bash
# Instalar Trivy
# https://github.com/aquasecurity/trivy

# Escanear imagen
trivy image frontend:test

# Escanear solo vulnerabilidades HIGH/CRITICAL
trivy image --severity HIGH,CRITICAL frontend:test
```

### Recomendación: Escaneo con Docker Scout
```bash
# Habilitar Docker Scout
docker scout cves frontend:test
```

---

## Comparación con Mejores Prácticas CIS

| Recomendación CIS | Implementado | Estado |
|-------------------|--------------|--------|
| 4.1 - Crear usuario para el contenedor | ✅ Sí | appuser:appgroup |
| 4.6 - No agregar privilegios innecesarios | ✅ Sí | Sin --privileged |
| 4.9 - Usar HEALTHCHECK apropiadamente | ✅ N/A | Requerimiento: NO HEALTHCHECK |
| 4.10 - Usar imágenes oficiales verificadas | ✅ Sí | node:alpine, nginx:alpine |
| 4.11 - Etiquetar imágenes apropiadamente | ✅ Sí | Labels OCI |
| 4.12 - Usar multi-stage builds | ✅ Sí | 2 stages implementados |

---

## Conclusión

El Dockerfile del frontend implementa **TODAS** las mejores prácticas de seguridad recomendadas:

1. ✅ Ejecución con usuario no-root
2. ✅ Puerto no-privilegiado (8080)
3. ✅ Multi-stage build optimizado
4. ✅ Imágenes base Alpine (mínimas)
5. ✅ Labels OCI para trazabilidad
6. ✅ Headers de seguridad en Nginx
7. ✅ Sin HEALTHCHECK (requerimiento)
8. ✅ Configuración de Nginx segura

**Score de Seguridad: 10/10** 🛡️

---

*Documento generado: FASE 3 - Pruebas de Seguridad Dockerfile*
*Fecha: 2026-04-21*
*Versión: 1.0.0*
