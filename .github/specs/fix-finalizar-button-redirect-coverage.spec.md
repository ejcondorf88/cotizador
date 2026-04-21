---
id: SPEC-020
status: DRAFT
feature: fix-finalizar-button-redirect-coverage
created: 2026-04-21
updated: 2026-04-21
author: spec-generator
version: "1.0"
related-specs: [SPEC-018]
---

## 1. REQUERIMIENTOS

### 1.1 Historias de Usuario

**HU-1: Como usuario, quiero que el botón "Finalizar" se bloquee durante la operación para evitar envíos duplicados**
- Criterio: El botón debe estar disabled mientras se procesa la petición
- Criterio: Debe mostrar estado de carga (spinner)
- Criterio: No debe permitir múltiples clics

**HU-2: Como usuario, quiero ser redirigido automáticamente a la selección de coberturas después de finalizar**
- Criterio: Después de éxito, redirigir a `/quote/{id}/coverage`
- Criterio: La redirección debe ser inmediata (< 500ms)
- Criterio: Si falla, mostrar error y quedarse en la página

### 1.2 Criterios Gherkin

```gherkin
Feature: Finalizar captura de inmuebles

  Scenario: Usuario hace clic múltiples veces en Finalizar
    Given que todos los inmuebles están completos
    When el usuario hace clic en "Finalizar"
    And hace clic nuevamente antes de que termine
    Then solo se debe enviar una petición al backend
    And el botón debe mostrar estado de carga

  Scenario: Finalización exitosa redirige a coberturas
    Given que todos los inmuebles están completos
    When el usuario hace clic en "Finalizar"
    And la actualización es exitosa
    Then debe redirigir a la página de coberturas
    And mostrar mensaje de éxito

  Scenario: Error en finalización
    Given que todos los inmuebles están completos
    When el usuario hace clic en "Finalizar"
    And ocurre un error
    Then debe mostrar mensaje de error
    And permanecer en la página de inmuebles
    And permitir reintentar
```

### 1.3 Reglas de Negocio
- **RN-1:** El botón debe estar disabled durante toda la operación de finalización
- **RN-2:** Después de éxito, redirigir automáticamente a MF5 (Coverage Selection)
- **RN-3:** El estado de navegación debe persistir hasta completar la redirección
- **RN-4:** Usar `replace: true` en navegación para evitar volver atrás con el botón del navegador

---

## 2. DISEÑO

### 2.1 Cambios en Componentes

#### PropertyDetailsPage.tsx

**Estados adicionales:**
```typescript
const [isFinalizing, setIsFinalizing] = useState(false);
const [hasNavigated, setHasNavigated] = useState(false);
```

**Función handleFinalize modificada:**
```typescript
const handleFinalize = useCallback(async () => {
  // Guards múltiples para prevenir doble submit
  if (!id || !allComplete || isFinalizing || hasNavigated) return;
  
  setIsFinalizing(true);
  
  try {
    await updateQuoteMutation.mutateAsync({
      id,
      data: { status: 'IN_PROGRESS' },
    });
    
    // Marcar que ya navegamos
    setHasNavigated(true);
    
    toast.current?.show({
      severity: 'success',
      summary: '¡Éxito!',
      detail: 'Redirigiendo a selección de coberturas...',
      life: 2000,
    });
    
    // Redirección con delay para UX
    setTimeout(() => {
      navigate(`/quote/${id}/coverage`, { replace: true });
    }, 500);
    
  } catch (error) {
    // Reset para permitir reintentar
    setHasNavigated(false);
    toast.current?.show({
      severity: 'error',
      summary: 'Error',
      detail: error instanceof Error ? error.message : 'Error al finalizar',
      life: 5000,
    });
  } finally {
    setIsFinalizing(false);
  }
}, [id, allComplete, isFinalizing, hasNavigated, updateQuoteMutation, navigate]);
```

**Botón Finalizar:**
```tsx
<Button
  label={isFinalizing ? 'Finalizando...' : 'Finalizar'}
  icon={isFinalizing ? 'pi pi-spin pi-spinner' : 'pi pi-check'}
  onClick={handleFinalize}
  loading={isFinalizing}
  disabled={isFinalizing || !allComplete || hasNavigated}
  className={`w-full sm:w-auto px-8 py-3 border-none ${
    allComplete
      ? 'bg-gradient-to-r from-green-600 to-green-700'
      : 'bg-gray-600 text-gray-300 cursor-not-allowed'
  }`}
/>
```

### 2.2 Flujo de Estados

```
[IDLE] --click--> [LOADING] --success--> [NAVIGATING] --timeout--> [REDIRECT]
                     |
                     --error--> [IDLE] (reset hasNavigated)
```

### 2.3 Manejo de Errores

| Escenario | Comportamiento |
|-----------|----------------|
| Error de red | Toast error, quedarse en página, reset hasNavigated |
| Error 500 | Toast error, quedarse en página, permitir reintentar |
| Error de validación | No debería ocurrir (todos los campos validados) |

---

## 3. LISTA DE TAREAS

### Backend
- [ ] No aplica - cambios solo en frontend

### Frontend
- [ ] Agregar estado `hasNavigated` en PropertyDetailsPage
- [ ] Modificar `handleFinalize` con guards múltiples
- [ ] Agregar `setHasNavigated(true)` después de éxito
- [ ] Implementar redirección con `setTimeout` y `replace: true`
- [ ] Actualizar prop `disabled` del botón para incluir `hasNavigated`
- [ ] Agregar mensaje de Toast indicando redirección
- [ ] Reset `hasNavigated` en caso de error
- [ ] Verificar que ruta `/quote/:id/coverage` existe en App.tsx

### QA
- [ ] Test: Doble clic en Finalizar solo envía una petición
- [ ] Test: Éxito redirige a /coverage
- [ ] Test: Error muestra mensaje y permite reintentar
- [ ] Test: Loading state es visible
- [ ] Test: No permite volver atrás después de redirección

---

## 4. NOTAS

### Decisiones Técnicas
- **hasNavigated vs isFinalizing:** Usar ambos porque `isFinalizing` se resetea en finally, pero `hasNavigated` persiste hasta completar redirección
- **setTimeout de 500ms:** Opcional, permite ver el toast de éxito antes de redirigir
- **replace: true:** Evita que el usuario pueda volver a la página de inmuebles con el botón atrás

### Consideraciones
- El estado `hasNavigated` debe resetearse si el componente se desmonta (useEffect cleanup)
- Considerar agregar un indicador visual de "Redirigiendo..." si el delay es perceptible

### Dependencias
- SPEC-018 (Coverage Selection) debe estar implementado
- Ruta `/quote/:id/coverage` debe existir en App.tsx
