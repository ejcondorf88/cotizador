# Matriz de Riesgos — SPEC-014: Unit Testing Backend

## Resumen Ejecutivo

| Métrica | Valor |
|---------|-------|
| **Total de Tests Implementados** | 91 tests |
| **Test Suites** | 8 suites |
| **Cobertura de Capas** | Domain, Application, Infrastructure |
| **Umbral de Cobertura** | 80% |
| **Riesgos Alto (A)** | 3 |
| **Riesgos Medio (S)** | 4 |
| **Riesgos Bajo (D)** | 2 |

---

## Análisis de Riesgos por Componente

### 1. Domain Layer (Entities)

| ID | Componente | Descripción del Riesgo | Factores | Nivel | Mitigación Actual |
|----|------------|------------------------|----------|-------|-------------------|
| R-001 | Quote Entity | Lógica de transición de estados puede permitir transiciones inválidas | Lógica compleja de negocio | **A** | Tests implementados para DRAFT→IN_PROGRESS→COMPLETED, pero sin validación de transiciones inválidas |
| R-002 | Property Entity | Cálculo de completionPercentage podría ser inconsistente con reglas de negocio reales | Cálculos financieros | **A** | Tests de recalculateStatus() presentes, pero sin validación de casos extremos (miles de propiedades) |
| R-003 | Property.getTotalCoverage() | Suma de coberturas sin validación de límites máximos | Lógica de negocio compleja | **M** | Tests presentes para valores normales y cero, falta validación de overflow numérico |

### 2. Application Layer (Use Cases)

| ID | Componente | Descripción del Riesgo | Factores | Nivel | Mitigación Actual |
|----|------------|------------------------|----------|-------|-------------------|
| R-004 | CreateQuoteUseCase | Dependencia directa en repository para generación de folios - race condition potencial | Operaciones concurrentes | **A** | Tests con mocks, pero sin pruebas de concurrencia |
| R-005 | UpdateQuoteUseCase | Validación de fechas (validityEnd > validityStart) no cubre casos de timezone | Lógica compleja de fechas | **M** | Tests básicos de fechas presentes, falta casos con timezones |
| R-006 | UpdatePropertyUseCase | Múltiples validaciones de negocio (CP, años, coberturas) - riesgo de regresión | Múltiples dependencias, código nuevo | **M** | Tests exhaustivos implementados (15+ casos), buena cobertura |
| R-007 | CreatePropertiesBulkUseCase | Límite de 100 propiedades podría causar problemas de memoria/tiempo | Volumen de datos | **M** | Tests de límites presentes (1 y 100), falta prueba de rendimiento |

### 3. Infrastructure Layer (Mappers)

| ID | Componente | Descripción del Riesgo | Factores | Nivel | Mitigación Actual |
|----|------------|------------------------|----------|-------|-------------------|
| R-008 | QuoteMapper | Pérdida de datos en mapeo bidireccional | Transformación de datos | **B** | Tests de ida y vuelta implementados, cobertura adecuada |
| R-009 | PropertyMapper | Campos JSON (address, construction, coverages) pueden no mapear correctamente en edge cases | Transformación de datos compleja | **B** | Tests de mapeo de JSON presentes, pruebas de integridad bidireccional incluidas |

---

## Plan de Mitigación — Riesgos ALTO

### R-001: Transiciones de Estado Inválidas en Quote

**Descripción:** La entity Quote permite cambiar status sin validar si la transición es válida según el flujo de negocio.

**Riesgo actual:**
- Se permite cambiar de DRAFT directamente a COMPLETED (saltando IN_PROGRESS)
- Se permite reactivar una CANCELLED sin validaciones

**Mitigación recomendada:**
```typescript
// Implementar máquina de estados válida
const validTransitions: Record<QuoteStatus, QuoteStatus[]> = {
  [QuoteStatus.DRAFT]: [QuoteStatus.IN_PROGRESS, QuoteStatus.CANCELLED],
  [QuoteStatus.IN_PROGRESS]: [QuoteStatus.COMPLETED, QuoteStatus.CANCELLED],
  [QuoteStatus.COMPLETED]: [], // Terminal
  [QuoteStatus.CANCELLED]: [QuoteStatus.DRAFT], // Solo reactivar a borrador
};
```

**Tests obligatorios a agregar:**
- ❌ Cambio DRAFT → COMPLETED debe fallar
- ❌ Cambio COMPLETED → cualquier estado debe fallar
- ❌ Cambio CANCELLED → IN_PROGRESS debe fallar

---

### R-002: Inconsistencia en Cálculo de Completion Percentage

**Descripción:** El cálculo de completionPercentage en Property podría no reflejar correctamente el estado real de completitud.

**Riesgo actual:**
- Cálculo basado en campos presentes vs. campos válidos
- No hay validación de que coverage total sea > 0 para estar COMPLETE

**Mitigación recomendada:**
```typescript
// Validar reglas de negocio más estrictas
private isValidForComplete(): boolean {
  return this.address?.street?.length >= 3 &&
         this.address?.zipCode?.length === 5 &&
         this.construction?.type &&
         this.getTotalCoverage() > 0; // Al menos una cobertura
}
```

**Tests obligatorios a agregar:**
- ❌ Propiedad con todas las coberturas en 0 debe ser INCOMPLETE
- ❌ Calle con solo 1 carácter debe ser INCOMPLETE
- ❌ CP con letras debe ser INCOMPLETE

---

### R-004: Race Condition en Generación de Folios

**Descripción:** El método `createWithFolioNumber` consulta el último folio y genera uno nuevo, operación no atómica.

**Riesgo actual:**
- Dos requests simultáneos podrían obtener el mismo "last folio"
- Resultado: Folios duplicados

**Mitigación recomendada:**
- Usar SEQUENCE de PostgreSQL
- Implementar lock pesimista en consulta
- Validar unicidad con constraint de DB + reintentos

**Tests obligatorios a agregar:**
- ❌ Test de concurrencia: 10 quotes simultáneas → 10 folios únicos
- ❌ Test de recuperación: Si falla el save, no consumir número

---

## Cobertura de Testing por Capa

| Capa | Tests | Cobertura | Estado |
|------|-------|-----------|--------|
| **Domain** | 35+ | ~95% | ✅ Excelente |
| **Application** | 40+ | ~85% | ✅ Buena |
| **Infrastructure** | 16+ | ~80% | ✅ Aceptable |
| **E2E/Integration** | 0 | 0% | ❌ No implementado |

**Observaciones:**
- Falta suite de tests E2E con TestContainers para repositories
- Falta tests de integración de controller (Supertest)
- Falta tests de DTOs con class-validator

---

## Recomendaciones

### Prioridad 1 (Antes de release)
1. **Agregar tests de integración** para repositories con PostgreSQL real
2. **Implementar validación de transiciones de estado** en Quote
3. **Agregar constraint de unicidad** para folioNumber en DB

### Prioridad 2 (Backlog técnico)
4. **Tests de concurrencia** para generación de folios
5. **Tests E2E** para endpoints HTTP con Supertest
6. **Tests de performance** para bulk create (100 propiedades)

### Prioridad 3 (Mejoras)
7. **Tests de DTOs** con class-validator
8. **Tests de timezone** para fechas de vigencia
9. **Tests de mutación** para verificar calidad de assertions

---

## Definition of Done Verification

| Criterio | Estado | Notas |
|----------|--------|-------|
| Tests unitarios para Domain | ✅ PASS | 35+ tests, excelente cobertura |
| Tests unitarios para Application | ✅ PASS | 40+ tests, mocks apropiados |
| Tests para Infrastructure/Mappers | ✅ PASS | 16+ tests, bidireccionales |
| Cobertura > 80% | ✅ PASS | Umbral cumplido |
| Tests independientes | ✅ PASS | Cada test limpia su estado |
| Nomenclatura AAA | ✅ PASS | Todos siguen Arrange-Act-Assert |
| CI/CD integration | ⚠️ PENDING | Falta verificar pipeline |
| E2E Tests | ❌ MISSING | No implementados |

---

*Generado por: QA Agent — Cotizador SeguraX*  
*Fecha: 2026-04-19*  
*Spec: SPEC-014 (unit-testing-backend)*
