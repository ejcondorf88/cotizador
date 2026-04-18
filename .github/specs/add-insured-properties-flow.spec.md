---
id: SPEC-010
status: APPROVED
feature: add-insured-properties-flow
created: 2026-04-18
updated: 2026-04-18
author: spec-generator
version: "1.0"
related-specs: ["quote-list-and-onboarding"]
---

# Spec: Agregar Flujo de Inmuebles Asegurados

> **Estado:** `DRAFT` → aprobar con `status: APPROVED` antes de iniciar implementación.

---

## 1. REQUERIMIENTOS

### Descripción
Crear una pantalla adicional en el flujo de cotización que se muestre **después** de completar el onboarding wizard. Esta pantalla preguntará "¿Cuántos inmuebles quiere asegurar la empresa?" y solo será accesible mediante el flujo completo del wizard (no por URL directa).

### Requerimiento de Negocio
> "Después de que el usuario complete todos los datos del wizard (asegurado, agente y vigencia), quiero que se redirija a una pantalla donde pregunte cuántos inmuebles quiere asegurar. Esta pantalla solo debe aparecer si se completó el wizard exitosamente, no debe ser accesible directamente."

### Historias de Usuario

#### HU-01: Redirigir después de completar Onboarding

```
Como: Usuario completando el wizard de cotización
Quiero: Ser redirigido a la pantalla de inmuebles después de completar exitosamente
Para: Continuar el flujo de cotización agregando los inmuebles a asegurar

Prioridad: Alta
Estimación: S
Capa: Frontend
```

#### Criterios de Aceptación — HU-01

```gherkin
CRITERIO-1.1: Redirección tras éxito del wizard
Dado que: El usuario completó todos los pasos del wizard (3/3)
Cuando: Presiona "Completar Cotización" y la actualización es exitosa
Entonces: Se redirige automáticamente a /quote/{id}/properties
Y: Se pasa el ID de la cotización en la URL
Y: El estado de navegación incluye { fromWizard: true }
```

**Bloqueo de acceso directo**
```gherkin
CRITERIO-1.2: Bloquear acceso directo por URL
Dado que: Un usuario intenta acceder directamente a /quote/{id}/properties
Cuando: No viene del flujo del wizard (no hay state.fromWizard)
Entonces: Se redirige automáticamente a /quotes (lista)
Y: Se muestra un toast: "Por favor complete el wizard primero"
```

#### HU-02: Pantalla de Selección de Inmuebles

```
Como: Usuario que completó el wizard
Quiero: Ver una pantalla que pregunte cuántos inmuebles asegurar
Para: Indicar la cantidad de inmuebles que tendrá la póliza

Prioridad: Alta
Estimación: M
Capa: Frontend
```

#### Criterios de Aceptación — HU-02

```gherkin
CRITERIO-2.1: Pregunta principal
Dado que: El usuario llegó a la pantalla desde el wizard
Cuando: La página carga
Entonces: Se muestra el título: "¿Cuántos inmuebles quiere asegurar la empresa?"
Y: Se muestra el nombre de la empresa (del paso 1)
Y: Se muestra un selector numérico (input tipo number o stepper)
Y: El valor mínimo es 1
Y: El valor máximo es 100
```

**Input numérico**
```gherkin
CRITERIO-2.2: Input de cantidad
Dado que: El usuario ve la pantalla
Cuando: Quiere seleccionar cantidad
Entonces: Puede usar:
  - Input number directo
  - Botones + y - para incrementar/decrementar
Y: No permite valores menores a 1
Y: No permite valores mayores a 100
Y: Muestra mensaje de error si intenta poner 0
```

**Navegación**
```gherkin
CRITERIO-2.3: Acciones disponibles
Dado que: El usuario seleccionó una cantidad válida
Cuando: Presiona "Continuar"
Entonces: Se guarda la cantidad en la cotización (vía API PATCH)
Y: Se redirige a la siguiente pantalla (por ahora placeholder)

Dado que: El usuario no seleccionó cantidad
Cuando: Presiona "Continuar"
Entonces: Se muestra error: "Seleccione al menos 1 inmueble"
```

**Cancelar**
```gherkin
CRITERIO-2.4: Cancelar flujo
Dado que: El usuario está en la pantalla de inmuebles
Cuando: Presiona "Cancelar"
Entonces: Se muestra confirmación: "¿Desea cancelar? Se perderá el progreso"
Y: Si confirma, redirige a /quotes
Y: Si cancela, permanece en la pantalla
```

### Reglas de Negocio

1. **Acceso protegido**: La ruta `/quote/:id/properties` solo accesible con state `fromWizard: true`
2. **Cantidad mínima**: 1 inmueble
3. **Cantidad máxima**: 100 inmuebles
4. **Persistencia**: La cantidad se guarda en el campo `propertyCount` de la quote (nuevo campo backend)
5. **Flujo lineal**: No se puede saltear pasos
6. **Cancelación**: Confirmación antes de salir para evitar pérdida de datos

---

## 2. DISEÑO

### Arquitectura del Flujo

```
┌─────────────────────────────────────────────────────────────────┐
│  FLUJO COMPLETO                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. QuotesListPage                                              │
│     └─→ Usuario hace clic en "Completar Datos"                 │
│         │                                                        │
│         ▼                                                        │
│  2. QuoteOnboardingWizard (3 pasos)                           │
│     └─→ Usuario completa paso 1, 2, 3                           │
│         │                                                        │
│         ▼                                                        │
│  3. Al presionar "Completar Cotización"                         │
│     ├─→ PATCH /api/v1/quotes/{id} (estado IN_PROGRESS)          │
│     └─→ navigate('/quote/{id}/properties', {                   │
│           state: { fromWizard: true }                           │
│         })                                                       │
│         │                                                        │
│         ▼                                                        │
│  4. InsuredPropertiesPage                                        │
│     ├─→ Pregunta: "¿Cuántos inmuebles?"                        │
│     ├─→ Input numérico (1-100)                                 │
│     │                                                            │
│     ├─→ [Continuar] → PATCH propertyCount                       │
│     │               → navigate('/quote/{id}/summary')          │
│     │                                                            │
│     └─→ [Cancelar] → Confirmación → /quotes                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Estructura de Componentes

```
frontend/src/
├── pages/
│   └── InsuredPropertiesPage.tsx          # Nueva página
├── components/
│   └── properties/
│       ├── PropertyCountSelector.tsx      # Componente de selección
│       └── PropertyConfirmation.tsx       # Modal de confirmación
└── hooks/
    └── queries/
        └── useUpdatePropertyCount.ts      # Hook para guardar cantidad
```

### API Endpoint (Backend)

#### PATCH /api/v1/quotes/{id}

**Request Body (extensión):**
```json
{
  "propertyCount": 5
}
```

**Response:** Quote actualizada con propertyCount

### Modelo de Datos

#### Frontend - Tipos extendidos

```typescript
// types/quote.ts
export interface Quote {
  id: string;
  folioNumber: string;
  status: QuoteStatus;
  createdAt: string;
  updatedAt: string;
  details?: QuoteDetail;
  propertyCount?: number;  // NUEVO - cantidad de inmuebles
}

export interface UpdateQuoteRequest {
  // ... campos existentes ...
  propertyCount?: number;    // NUEVO
}
```

#### Backend - Migración

```typescript
// Nueva migración: AddPropertyCountToQuotes
export class AddPropertyCountToQuotes implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('quotes', new TableColumn({
      name: 'property_count',
      type: 'int',
      isNullable: true,
      default: null,
    }));
  }
}
```

### Diseño de la Pantalla

```
┌─────────────────────────────────────────────────────────┐
│  [Navbar SeguraX]                                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │                                                  │   │
│  │  [Icono: 🏢]                                      │   │
│  │                                                  │   │
│  │  ¿Cuántos inmuebles quiere asegurar              │   │
│  │  la empresa?                                     │   │
│  │                                                  │   │
│  │  ┌─────────────────────────────────────────┐    │   │
│  │  │ 🏢 Constructora del Norte S.A. de C.V.  │    │   │
│  │  └─────────────────────────────────────────┘    │   │
│  │                                                  │   │
│  │  Seleccione la cantidad:                         │   │
│  │                                                  │   │
│  │  ┌─────────┐  ┌─────┐  ┌─────────┐            │   │
│  │  │   ─     │  │  5  │  │   +     │            │   │
│  │  │ (menos) │  │     │  │  (más)  │            │   │
│  │  └─────────┘  └─────┘  └─────────┘            │   │
│  │                                                  │   │
│  │  [Texto de ayuda]                               │   │
│  │  Puede asegurar entre 1 y 100 inmuebles         │   │
│  │                                                  │   │
│  │           [Cancelar]  [Continuar →]             │   │
│  │                                                  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Componente PropertyCountSelector

```typescript
interface PropertyCountSelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  companyName: string;
}
```

---

## 3. LISTA DE TAREAS

### Fase 1: Backend (Migración)

- [ ] Crear migración `AddPropertyCountToQuotes`
- [ ] Agregar campo `propertyCount` (integer, nullable) a Quote entity
- [ ] Actualizar UpdateQuoteDto para aceptar propertyCount
- [ ] Actualizar UpdateQuoteUseCase para manejar propertyCount
- [ ] Ejecutar migración en DB

### Fase 2: Tipos Frontend

- [ ] Extender `types/quote.ts` con `propertyCount?: number`
- [ ] Agregar `propertyCount` a UpdateQuoteRequest

### Fase 3: Componentes Frontend

- [ ] Crear `components/properties/PropertyCountSelector.tsx`
  - [ ] Input numérico con botones +/-
  - [ ] Validación min=1, max=100
  - [ ] Mostrar nombre de empresa
  - [ ] Estilo SeguraX (dorado)
  
- [ ] Crear `pages/InsuredPropertiesPage.tsx`
  - [ ] Layout con Navbar y Footer
  - [ ] Tarjeta central con pregunta
  - [ ] Integrar PropertyCountSelector
  - [ ] Botón "Continuar" y "Cancelar"
  - [ ] Validación antes de continuar

### Fase 4: Navegación Protegida

- [ ] Crear hook `useRequireWizardCompletion`
  - [ ] Verificar location.state.fromWizard
  - [ ] Redirigir a /quotes si no cumple
  
- [ ] Agregar ruta `/quote/:id/properties` en App.tsx
- [ ] Integrar hook de protección en InsuredPropertiesPage

### Fase 5: Integración con Wizard

- [ ] Modificar `QuoteOnboardingWizard.tsx`
  - [ ] Cambiar `onSuccess` para redirigir a properties
  - [ ] Pasar state: { fromWizard: true }
  - [ ] Incluir ID de quote en la URL

### Fase 6: Hook de Guardado

- [ ] Crear `hooks/queries/useUpdatePropertyCount.ts`
  - [ ] Mutation para PATCH propertyCount
  - [ ] Invalidar queries de quotes
  - [ ] Manejar errores

### Fase 7: Flujo de Navegación

- [ ] Implementar acción "Continuar"
  - [ ] Guardar propertyCount vía API
  - [ ] Redirigir a siguiente pantalla (placeholder por ahora)
  
- [ ] Implementar acción "Cancelar"
  - [ ] Mostrar modal de confirmación
  - [ ] Redirigir a /quotes si confirma

### QA

- [ ] Verificar que solo se accede desde wizard completado
- [ ] Verificar redirección si se intenta acceso directo
- [ ] Verificar validaciones de cantidad (1-100)
- [ ] Verificar que se guarda en backend
- [ ] Verificar que aparece en resumen de quote
- [ ] Verificar flujo de cancelación

---

## Notas Técnicas

### Protección de Ruta

```typescript
// hooks/useRequireWizardCompletion.ts
export function useRequireWizardCompletion() {
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!location.state?.fromWizard) {
      navigate('/quotes', { 
        replace: true,
        state: { error: 'Por favor complete el wizard primero' }
      });
    }
  }, [location, navigate]);
}
```

### Redirección desde Wizard

```typescript
// En QuoteOnboardingWizard al completar
const handleComplete = async () => {
  await completeMutation.mutateAsync({ id, data });
  navigate(`/quote/${quote.id}/properties`, {
    state: { fromWizard: true }
  });
};
```

---
*Fin de la especificación*
