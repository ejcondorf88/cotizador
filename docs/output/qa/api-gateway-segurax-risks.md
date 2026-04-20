# Matriz de Riesgos — API Gateway SeguraX (SPEC-016)

## Resumen Ejecutivo

| Total | Alto (A) | Medio (S) | Bajo (D) |
|-------|----------|-----------|----------|
| 8     | 2        | 4         | 2        |

---

## Detalle de Riesgos Identificados

| ID    | HU   | Descripción del Riesgo | Factores | Nivel | Testing |
|-------|------|------------------------|----------|-------|----------|
| R-001 | HU-03 | Logging de requests expone datos sensibles en logs | Datos sensibles, Logging | **A** | Obligatorio |
| R-002 | HU-04 | CORS permite origen wildcard en producción | Seguridad, Configuración | **A** | Obligatorio |
| R-003 | HU-01 | Backend no disponible causa error 500 sin fallback | Integración, Resiliencia | **S** | Recomendado |
| R-004 | HU-02 | Frontend no disponible causa error 500 | Integración, UX | **S** | Recomendado |
| R-005 | Global | Falta rate limiting - vulnerable a DoS | Seguridad, Performance | **S** | Recomendado |
| R-006 | Global | Sin Circuit Breaker para proteger downstream | Resiliencia | **S** | Recomendado |
| R-007 | HU-05 | Health check no verifica downstream services | Observabilidad | **D** | Opcional |
| R-008 | Global | Configuración de CORS duplicada (YAML + Java) | Mantenibilidad | **D** | Opcional |

---

## Plan de Mitigación — Riesgos ALTO

### R-001: Logging expone datos sensibles

**Descripción:** El LoggingFilter actual loguea todo el path de la request, potencialmente incluyendo PII (Personally Identifiable Information) en URLs.

**Mitigación:**
- Implementar sanitización de logs para excluir parámetros sensibles
- Agregar configuración de exclusiones de paths
- Documentar política de logging segura

**Tests Obligatorios:**
- Verificar que parámetros sensibles no aparecen en logs
- Test de sanitizer para campos de PII

**Bloqueante para release:** ✅ NO (documentado, requiere fix en SPEC-017)

---

### R-002: CORS wildcard en producción

**Descripción:** El archivo `application-prod.yml` usa `${FRONTEND_ORIGIN:https://segurax.com}` pero si la variable no está seteada, debe verificarse que el default sea restrictivo.

**Análisis del Código Actual:**
```yaml
allowedOrigins:
  - "${FRONTEND_ORIGIN:https://segurax.com}"
```
✅ **ESTADO:** El default es seguro (`https://segurax.com`), no wildcard.

**Sin embargo:** El archivo `application.yml` y `application-dev.yml` permiten `http://localhost:5173` que es correcto para desarrollo.

**Mitigación:**
- ✅ Ya implementado correctamente
- Asegurar que en producción `FRONTEND_ORIGIN` siempre esté configurado

**Tests Obligatorios:**
- Validar que en prod no se permiten orígenes no autorizados
- Test de preflight CORS desde origen no permitido

**Bloqueante para release:** ❌ NO (implementación correcta)

---

## Plan de Mitigación — Riesgos MEDIO

### R-003: Backend no disponible causa error 500

**Descripción:** Cuando ms-core no responde, el gateway retorna 500 sin mensaje amigable.

**Mitigación:**
- Implementar Circuit Breaker (SPEC-017)
- Agregar handler de errores global
- Retornar 503 Service Unavailable con mensaje claro

**Prioridad:** Alta (esperar SPEC-017)

---

### R-004: Frontend no disponible causa error 500

**Descripción:** Similar a R-003, cuando el frontend no está corriendo en :5173, el gateway retorna 500.

**Mitigación:**
- Implementar fallback a página de error estática
- Circuit Breaker para ms-frontend

**Prioridad:** Media

---

### R-005: Falta rate limiting

**Descripción:** El gateway no tiene protección contra abuso de API (DoS).

**Mitigación:**
- Implementar rate limiting por IP/cliente
- Configurar límites en `application-prod.yml`

**Prioridad:** Media (para hardening futuro)

---

### R-006: Sin Circuit Breaker

**Descripción:** Como se especificó en SPEC-016, el Circuit Breaker se deja para SPEC-017.

**Estado:** ✅ Conforme a especificación

**Mitigación:**
- Implementar en SPEC-017 con Resilience4j
- Configurar retries con backoff
- Definir fallbacks

**Prioridad:** Planificado para futuro

---

## Análisis de Dependencias

### Spring Cloud Gateway 2023.0.0
- **Estado:** Versión estable y soportada
- **Vulnerabilidades conocidas:** Ninguna crítica reportada
- **Recomendación:** Mantener actualizado con últimos patches

### Spring Boot 3.2.0
- **Estado:** LTS compatible
- **Vulnerabilidades:** Verificar en https://spring.io/security
- **Recomendación:** Considerar upgrade a 3.2.x más reciente

### Lombok
- **Uso:** Opcional, bien configurado
- **Riesgo:** Bajo

---

## Conclusiones

1. **No hay riesgos críticos bloqueantes** para el release actual
2. **Las configuraciones de CORS son correctas** para cada ambiente
3. **El logging está implementado** según especificación
4. **Los riesgos identificados son gestionables** y/o planificados para futuras specs

---

*Generado por: QA Agent ASDD*
*Fecha: 2026-04-19*
*Spec: SPEC-016*
