---
id: SPEC-008
status: APPROVED
feature: quote-list-and-onboarding
created: 2026-04-18
updated: 2026-04-18
author: spec-generator
version: "1.0"
related-specs: ["unify-naming-english", "cotizador-backend"]
---

# Spec: Lista de Cotizaciones y Onboarding Wizard

> **Estado:** `DRAFT` → aprobar con `status: APPROVED` antes de iniciar implementación.
> **Ciclo de vida:** DRAFT → APPROVED → IN_PROGRESS → IMPLEMENTED → DEPRECATED

---

## 1. REQUERIMIENTOS

### Descripción
Crear una página de listado de cotizaciones que muestre solo las cotizaciones en estado DRAFT (borrador). Al hacer clic en una cotización, se despliega un wizard de onboarding en formato de pasos (stepper) donde el usuario puede completar: datos del asegurado, datos del agente y fecha de vigencia. El diseño debe mantener consistencia visual con la landing page de SeguraX.

### Requerimiento de Negocio
> "Necesito ver todas las cotizaciones que estén en borrador. Al hacer clic en una, quiero un wizard tipo onboarding que me guíe para completar los datos: primero el asegurado, luego el agente y por último la fecha de vigencia. Que siga el estilo dorado y elegante de la página."

### Historias de Usuario

#### HU-01: Ver Lista de Cotizaciones en Borrador

```
Como: Usuario del sistema
Quiero: Ver todas las cotizaciones con estado DRAFT en una lista
Para: Identificar qué cotizaciones necesitan ser completadas

Prioridad: Alta
Estimación: M
Dependencias: SPEC-006 (unify-naming-english)
Capa: Frontend
```

#### Criterios de Aceptación — HU-01

**Happy Path**
```gherkin
CRITERIO-1.1: Listar cotizaciones DRAFT
Dado que: Existen cotizaciones con diferentes estados en la base de datos
Cuando: El usuario accede a la página de cotizaciones
Entonces: Solo se muestran las cotizaciones con status "DRAFT"
Y: Cada item muestra folioNumber, fecha de creación y estado
Y: La lista se actualiza automáticamente al cambiar de estado
```

**Empty State**
```gherkin
CRITERIO-1.2: Lista vacía
Dado que: No existen cotizaciones en estado DRAFT
Cuando: El usuario accede a la página
Entonces: Se muestra un mensaje "No hay cotizaciones pendientes"
Y: Se muestra un botón "Crear nueva cotización"
```

#### HU-02: Wizard de Onboarding al Seleccionar Cotización

```
Como: Usuario del sistema
Quiero: Completar los datos de una cotización mediante un wizard de pasos
Para: Finalizar la información requerida para el seguro

Prioridad: Alta
Estimación: L
Dependencias: HU-01
Capa: Frontend
```

#### Criterios de Aceptación — HU-02

**Flujo Completo**
```gherkin
CRITERIO-2.1: Abrir wizard al hacer clic
Dado que: El usuario está viendo la lista de cotizaciones DRAFT
Cuando: Hace clic en una cotización específica
Entonces: Se abre un modal/wizard con diseño de onboarding
Y: Se muestra el folioNumber de la cotización seleccionada
Y: El wizard tiene 3 pasos visibles
```

**Paso 1: Datos del Asegurado 🏢**
```gherkin
CRITERIO-2.2: Completar datos del asegurado
Dado que: El wizard está en el paso 1
Cuando: El usuario ve el formulario
Entonces: Se muestran campos:
  - Nombre empresa (obligatorio, max 150 chars)
  - RFC (obligatorio, 12-13 caracteres alfanuméricos)
  - Giro del negocio (obligatorio, dropdown/select)
  - Tipo de negocio (obligatorio, dropdown/select)
Y: El botón "Siguiente" está deshabilitado hasta completar todos los campos
Y: RFC valida formato mexicano (XXXX######XXX para empresas)
Y: Dropdowns de giro y tipo tienen búsqueda predictiva
```

**Paso 2: Conducción (Datos del Agente) 🧑‍💼**
```gherkin
CRITERIO-2.3: Completar datos del agente/conductor
Dado que: El usuario completó el paso 1 y avanzó
Cuando: Ve el paso 2
Entonces: Se muestran campos:
  - Clave del agente (obligatorio, código único del agente)
  - Nombre agente (obligatorio, nombre completo)
  - Suscriptor (obligatorio, nombre del suscriptor)
  - Oficina (obligatorio, sucursal u oficina)
Y: Hay búsqueda de agente por clave (autocompletado)
Y: Al seleccionar agente, se autocompletan: nombre, suscriptor, oficina
Y: Puede retroceder al paso anterior
```

**Paso 3: Vigencia 📅**
```gherkin
CRITERIO-2.4: Seleccionar vigencia y condiciones
Dado que: El usuario completó el paso 2
Cuando: Ve el paso 3
Entonces: Se muestran campos:
  - Fecha inicio (obligatorio, calendar, min=hoy)
  - Fecha fin (obligatorio, calendar, debe ser > inicio)
  - Moneda (obligatorio, dropdown: MXN, USD)
  - Tipo de pago (obligatorio, dropdown: Contado, Mensual, Trimestral, Semestral, Anual)
Y: Se muestra el resumen de toda la información ingresada
Y: El botón "Completar Cotización" finaliza el proceso
```

**Guardado y Transición de Estado**
```gherkin
CRITERIO-2.5: Guardar datos y cambiar estado
Dado que: El usuario completó todos los pasos
Cuando: Presiona "Completar Cotización"
Entonces: Se envía la información al backend
Y: El estado cambia de "DRAFT" a "IN_PROGRESS"
Y: Se cierra el wizard
Y: La cotización desaparece de la lista (porque ya no es DRAFT)
Y: Se muestra mensaje de éxito
```

### Reglas de Negocio

1. **Filtro por estado**: Solo mostrar quotes con `status === 'DRAFT'`
2. **Ordenamiento**: Más recientes primero (por createdAt desc)
3. **Validaciones de formulario**:
   - **Paso 1 - Asegurado**:
     - Nombre empresa: obligatorio, máximo 150 caracteres
     - RFC: obligatorio, 12-13 caracteres, formato mexicano (XXXX######XXX)
     - Giro del negocio: obligatorio, selección de catálogo
     - Tipo de negocio: obligatorio, selección de catálogo
   - **Paso 2 - Conducción**:
     - Clave del agente: obligatorio, búsqueda de catálogo
     - Nombre agente: autocompletado desde catálogo
     - Suscriptor: autocompletado desde catálogo
     - Oficina: autocompletado desde catálogo
   - **Paso 3 - Vigencia**:
     - Fecha inicio: obligatorio, mínimo hoy
     - Fecha fin: obligatorio, debe ser posterior a inicio
     - Moneda: obligatorio (MXN, USD)
     - Tipo de pago: obligatorio (Contado, Mensual, Trimestral, Semestral, Anual)
4. **Formato campos**:
   - Fechas: DD/MM/YYYY en español
   - RFC: Mayúsculas automáticas
   - Moneda: Símbolo $ para MXN, US$ para USD
5. **Auto-guardado**: Guardar progreso en localStorage por quote ID
6. **Cancelar**: Confirmación si hay datos ingresados
7. **Diseño**: Seguir paleta de colores de SeguraX:
   - Dorado primario: `#C9A84C`
   - Fondo oscuro: `#1A1A2E`
   - Texto claro: `#FFFFFF`, `#F5F5F5`

---

## 2. DISEÑO

### Diseño Visual - Referencias

Basado en componentes existentes de SeguraX:
- **HeroSection**: Estilo hero con gradientes
- **Navbar**: Con logo dorado y navegación
- **Stepper**: Componente ya existente en `components/Stepper/`
- **Paleta**: Dorado `#C9A84C`, fondo oscuro `#1A1A2E`

### Estructura de Componentes

```
frontend/src/
├── pages/
│   └── QuotesListPage.tsx          # Página principal de listado
├── components/
│   ├── quotes/
│   │   ├── QuoteListItem.tsx       # Card de cotización individual
│   │   ├── QuoteEmptyState.tsx     # Estado vacío
│   │   └── QuoteOnboardingWizard.tsx # Wizard completo
│   └── wizard/
│       ├── WizardStepIndicator.tsx # Indicador de pasos (1, 2, 3)
│       ├── StepAseguradoForm.tsx   # Formulario paso 1
│       ├── StepAgenteForm.tsx      # Formulario paso 2
│       ├── StepVigenciaForm.tsx    # Formulario paso 3
│       └── StepSummary.tsx         # Resumen antes de guardar
├── hooks/
│   └── queries/
│       └── useQuotesQuery.ts       # Hook para obtener quotes DRAFT
├── types/
│   └── quote.ts                    # Tipos extendidos (QuoteWithDetails)
└── services/
    └── quoteService.ts             # Nuevos métodos API
```

### Modelos de Datos

#### Tipos Extendidos (Frontend)

```typescript
// types/quote.ts

export interface QuoteDetail {
  // Paso 1: Asegurado 🏢
  companyName: string;        // Nombre empresa
  rfc: string;                // RFC (12-13 caracteres)
  businessLine: string;       // Giro del negocio
  businessType: string;       // Tipo de negocio

  // Paso 2: Conducción 🧑‍💼
  agentKey: string;           // Clave del agente
  agentName: string;           // Nombre agente
  subscriber: string;         // Suscriptor
  office: string;             // Oficina

  // Paso 3: Vigencia 📅
  validityStart: string;      // Fecha inicio (ISO date)
  validityEnd: string;        // Fecha fin (ISO date)
  currency: 'MXN' | 'USD';    // Moneda
  paymentType: PaymentType;   // Tipo de pago
}

export enum PaymentType {
  CONTADO = 'Contado',
  MENSUAL = 'Mensual',
  TRIMESTRAL = 'Trimestral',
  SEMESTRAL = 'Semestral',
  ANUAL = 'Anual',
}

export interface Quote {
  id: string;
  folioNumber: string;
  status: QuoteStatus;
  createdAt: string;
  updatedAt: string;
  details?: QuoteDetail; // Opcional, solo cuando está completo
}

export interface UpdateQuoteRequest {
  // Paso 1: Asegurado
  companyName?: string;
  rfc?: string;
  businessLine?: string;
  businessType?: string;

  // Paso 2: Conducción
  agentKey?: string;
  agentName?: string;
  subscriber?: string;
  office?: string;

  // Paso 3: Vigencia
  validityStart?: string;
  validityEnd?: string;
  currency?: 'MXN' | 'USD';
  paymentType?: PaymentType;

  // Cambio de estado
  status?: QuoteStatus;
}

// Catálogos (simulados, pueden venir de API)
export interface BusinessLine {
  id: string;
  name: string;
}

export interface BusinessType {
  id: string;
  name: string;
}

export interface Agent {
  key: string;
  name: string;
  subscriber: string;
  office: string;
}
```

### API Endpoints

#### GET /api/v1/quotes?status=DRAFT
- **Descripción**: Obtener todas las quotes en estado DRAFT
- **Auth**: No requerido actualmente
- **Response 200**:
```json
[
  {
    "id": "uuid",
    "folioNumber": "COT-2026-00008",
    "status": "DRAFT",
    "createdAt": "2026-04-18T18:23:36.877Z",
    "updatedAt": "2026-04-18T18:23:36.877Z"
  }
]
```

#### GET /api/v1/quotes/{id}
- **Descripción**: Obtener detalle de una quote
- **Response 200**: Quote con details si existe

#### PATCH /api/v1/quotes/{id}
- **Descripción**: Actualizar quote con datos del formulario
- **Request Body**: UpdateQuoteRequest
- **Response 200**: Quote actualizada

### Diseño de la Página de Listado

```
┌─────────────────────────────────────────────────────────┐
│  [Navbar SeguraX - Logo dorado]                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [Hero pequeño]                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Mis Cotizaciones Pendientes                    │   │
│  │  Gestiona tus cotizaciones en borrador          │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │                                                 │   │
│  │  [Card 1]              [Card 2]              │   │
│  │  ┌────────────┐        ┌────────────┐        │   │
│  │  │ COT-2026-  │        │ COT-2026-  │        │   │
│  │  │ 00008      │        │ 00009      │        │   │
│  │  │            │        │            │        │   │
│  │  │ Creado:    │        │ Creado:    │        │   │
│  │  │ 18/04/2026 │        │ 18/04/2026 │        │   │
│  │  │            │        │            │        │   │
│  │  │ [Completar]│        │ [Completar]│        │   │
│  │  └────────────┘        └────────────┘        │   │
│  │                                               │   │
│  │  [Card 3] ...                                │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  [Footer]                                               │
└─────────────────────────────────────────────────────────┘
```

### Diseño del Wizard de Onboarding

```
┌─────────────────────────────────────────────────────────┐
│ [Modal Oscuro con bordes dorados]                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [Stepper con iconos]                                   │
│  🏢────🧑‍💼────📅                                        │
│   1      2      3                                       │
│  Asegurado Conducción Vigencia                         │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │                                                 │   │
│  │  🏢 [Paso 1: Datos del Asegurado]              │   │
│  │                                                 │   │
│  │  Nombre empresa *                               │   │
│  │  ┌─────────────────────────────────────────┐   │   │
│  │  │ Ejemplo: Grupo Constructor del Norte  │   │   │
│  │  └─────────────────────────────────────────┘   │   │
│  │                                                 │   │
│  │  RFC *                     [Buscar RFC 🔍]    │   │
│  │  ┌────────────────────┐                     │   │
│  │  │ ABC010101ABC       │                     │   │
│  │  └────────────────────┘                     │   │
│  │                                                 │   │
│  │  Giro del negocio *                           │   │
│  │  ┌─────────────────────────────────────────┐   │   │
│  │  │ [Dropdown: Construcción ▼]            │   │   │
│  │  └─────────────────────────────────────────┘   │   │
│  │                                                 │   │
│  │  Tipo de negocio *                            │   │
│  │  ┌─────────────────────────────────────────┐   │   │
│  │  │ [Dropdown: Constructora ▼]            │   │   │
│  │  └─────────────────────────────────────────┘   │   │
│  │                                                 │   │
│  │           [Cancelar]  [Siguiente →]           │   │
│  │                                                 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  🧑‍💼 [Paso 2: Conducción]                           │
│                                                         │
│  Clave del agente *        [🔍 Buscar agente]       │
│  ┌────────────────┐                                     │
│  │ AGT-001234     │                                     │
│  └────────────────┘                                     │
│                                                         │
│  Nombre agente                                          │
│  ┌─────────────────────────────────────────┐             │
│  │ Juan Pérez García                       │             │
│  └─────────────────────────────────────────┘             │
│                                                         │
│  Suscriptor                                             │
│  ┌─────────────────────────────────────────┐             │
│  │ María González                          │             │
│  └─────────────────────────────────────────┘             │
│                                                         │
│  Oficina                                                │
│  ┌─────────────────────────────────────────┐             │
│  │ Sucursal Centro CDMX                    │             │
│  └─────────────────────────────────────────┘             │
│                                                         │
│           [← Anterior]  [Siguiente →]                   │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  📅 [Paso 3: Vigencia]                               │
│                                                         │
│  Fecha inicio *              Fecha fin *             │
│  ┌──────────────┐            ┌──────────────┐         │
│  │ 📅 18/04/2026│            │ 📅 18/04/2027│         │
│  └──────────────┘            └──────────────┘         │
│                                                         │
│  Moneda *                  Tipo de pago *          │
│  ┌────────────┐            ┌──────────────────┐       │
│  │ [💲 MXN ▼] │            │ [Mensual ▼]      │       │
│  └────────────┘            └──────────────────┘       │
│                                                         │
│  ─────────────────────────────────────────────         │
│  RESUMEN                                                │
│  ┌─────────────────────────────────────────┐           │
│  │ 🏢 Grupo Constructor del Norte        │           │
│  │ 🧑‍💼 Juan Pérez García (AGT-001234)   │           │
│  │ 📅 18/04/2026 - 18/04/2027 (Anual)    │           │
│  └─────────────────────────────────────────┘           │
│                                                         │
│           [← Anterior]  [Completar Cotización ✓]       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```
┌─────────────────────────────────────────────────────────┐
│  [Modal Oscuro con bordes dorados]                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [Stepper]                                              │
│  ◉───◯───◯                                             │
│  1    2    3                                            │
│  Asegurado  Agente  Vigencia                           │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │                                                 │   │
│  │  [Paso 1: Datos del Asegurado]                  │   │
│  │                                                 │   │
│  │  Nombre completo *                              │   │
│  │  ┌─────────────────────────────────────────┐   │   │
│  │  │                                         │   │   │
│  │  └─────────────────────────────────────────┘   │   │
│  │                                                 │   │
│  │  Cédula/RUC *              Email *           │   │
│  │  ┌────────────┐  ┌──────────────────────┐   │   │
│  │  │            │  │                      │   │   │
│  │  └────────────┘  └──────────────────────┘   │   │
│  │                                                 │   │
│  │  Teléfono *                Dirección *       │   │
│  │  ┌────────────┐  ┌──────────────────────┐   │   │
│  │  │            │  │                      │   │   │
│  │  └────────────┘  └──────────────────────┘   │   │
│  │                                                 │   │
│  │           [Cancelar]  [Siguiente →]           │   │
│  │                                                 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Componentes Detallados

#### QuoteListItem
```typescript
interface Props {
  quote: Quote;
  onComplete: (quote: Quote) => void;
}

// Card con:
// - Icono dorado de documento/building
// - Folio number destacado (ej: COT-2026-00008)
// - Fecha de creación en formato legible
// - Badge "Pendiente" en dorado con icono de reloj
// - Botón "Completar Datos" dorado con icono de lápiz
// - Hover effect con sombra dorada
```

#### WizardStepIndicator
```typescript
interface Props {
  currentStep: number;  // 1, 2, o 3
  steps: Array<{
    label: string;
    icon: string;  // 🏢, 🧑‍💼, 📅
  }>;
}

// Línea conectando pasos en color dorado
// Paso actual: círculo dorado relleno #C9A84C
// Pasos previos: círculo dorado con checkmark verde
// Pasos futuros: círculo gris outline
// Labels debajo de cada paso
```

#### StepAseguradoForm (Paso 1 🏢)
```typescript
interface StepAseguradoFormProps {
  data: {
    companyName: string;
    rfc: string;
    businessLine: string;
    businessType: string;
  };
  onChange: (field: string, value: string) => void;
  errors: Record<string, string>;
  businessLines: BusinessLine[];  // Catálogo
  businessTypes: BusinessType[];  // Filtrado por giro
}

// Campos:
// - companyName: InputText con placeholder "Nombre de la empresa"
// - rfc: InputMask o InputText con validación RFC
//   └─ Transformar a mayúsculas automáticamente
//   └─ Validar formato: 3-4 letras + 6 dígitos fecha + 2-3 homoclave
// - businessLine: Dropdown con búsqueda (PrimeReact Dropdown con filter)
// - businessType: Dropdown dependiente (cambia según businessLine)

// Catálogos ejemplo:
// businessLines: [
//   { id: 'construccion', name: 'Construcción' },
//   { id: 'manufactura', name: 'Manufactura' },
//   { id: 'comercio', name: 'Comercio' },
//   { id: 'servicios', name: 'Servicios' },
// ]
//
// businessTypes (filtrados por giro):
//   construccion: ['Constructora', 'Desarrolladora', 'Contratista', 'Subcontratista']
//   manufactura: ['Maquiladora', 'Fabricante', 'Ensambladora']
//   ...
```

#### StepConduccionForm (Paso 2 🧑‍💼)
```typescript
interface StepConduccionFormProps {
  data: {
    agentKey: string;
    agentName: string;
    subscriber: string;
    office: string;
  };
  onChange: (field: string, value: string) => void;
  onAgentSelect: (agent: Agent) => void;  // Autocomplete
  errors: Record<string, string>;
}

// Campos:
// - agentKey: AutoComplete con búsqueda
//   └─ Placeholder: "Ej: AGT-001234"
//   └─ Al seleccionar, autocompletar los demás campos
//   └─ Mostrar sugerencias con: "AGT-001234 - Juan Pérez"
// - agentName: InputText (readonly, autocompletado)
// - subscriber: InputText (readonly, autocompletado)
// - office: InputText (readonly, autocompletado)

// Catálogo de agentes ejemplo:
// agents: [
//   {
//     key: 'AGT-001234',
//     name: 'Juan Pérez García',
//     subscriber: 'María González',
//     office: 'Sucursal Centro CDMX'
//   },
//   ...
// ]
```

#### StepVigenciaForm (Paso 3 📅)
```typescript
interface StepVigenciaFormProps {
  data: {
    validityStart: Date | null;
    validityEnd: Date | null;
    currency: 'MXN' | 'USD';
    paymentType: PaymentType;
  };
  onChange: (field: string, value: unknown) => void;
  errors: Record<string, string>;
  summary: {
    companyName: string;
    agentKey: string;
    agentName: string;
  };
}

// Campos:
// - validityStart: Calendar con minDate=hoy, locale=es
//   └─ Formato: DD/MM/YYYY
//   └─ Placeholder: "Selecciona fecha inicio"
// - validityEnd: Calendar con minDate=fechaInicio+1día
//   └─ Validar que sea mayor a fecha inicio
// - currency: Dropdown con opciones:
//   ├─ { label: '💲 Pesos Mexicanos (MXN)', value: 'MXN' }
//   └─ { label: '💵 Dólares (USD)', value: 'USD' }
// - paymentType: Dropdown con opciones:
//   ├─ { label: '💰 Contado', value: 'CONTADO' }
//   ├─ { label: '📅 Mensual', value: 'MENSUAL' }
//   ├─ { label: '📆 Trimestral', value: 'TRIMESTRAL' }
//   ├─ { label: '📋 Semestral', value: 'SEMESTRAL' }
//   └─ { label: '📘 Anual', value: 'ANUAL' }
//
// Resumen visual al final:
// ┌─────────────────────────────────────┐
// │ 📋 RESUMEN DE COTIZACIÓN            │
// ├─────────────────────────────────────┤
// │ 🏢 Empresa: [companyName]          │
// │ 🆔 RFC: [rfc]                        │
// │ 🏭 Giro: [businessLine]              │
// │ 📊 Tipo: [businessType]              │
// ├─────────────────────────────────────┤
// │ 🧑‍💼 Agente: [agentName]            │
// │ 🔑 Clave: [agentKey]                 │
// │ 📋 Suscriptor: [subscriber]        │
// │ 🏢 Oficina: [office]                 │
// ├─────────────────────────────────────┤
// │ 📅 Vigencia: [start] - [end]       │
// │ 💵 Moneda: [currency]              │
// │ 💳 Pago: [paymentType]               │
// └─────────────────────────────────────┘
```

### Hooks Necesarios

#### useQuotesQuery
```typescript
export function useQuotesQuery(status: QuoteStatus = 'DRAFT') {
  return useQuery({
    queryKey: ['quotes', status],
    queryFn: () => quoteService.getQuotesByStatus(status),
  });
}
```

#### useUpdateQuoteMutation
```typescript
export function useUpdateQuoteMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateQuoteRequest }) =>
      quoteService.updateQuote(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
    },
  });
}
```

### Servicios Actualizados

#### quoteService.ts
```typescript
export const quoteService = {
  async getQuotes(): Promise<Quote[]> {
    const response = await axios.get(`${API_URL}/api/v1/quotes`);
    return response.data;
  },

  async getQuotesByStatus(status: QuoteStatus): Promise<Quote[]> {
    const response = await axios.get(`${API_URL}/api/v1/quotes`, {
      params: { status },
    });
    return response.data;
  },

  async getQuoteById(id: string): Promise<Quote> {
    const response = await axios.get(`${API_URL}/api/v1/quotes/${id}`);
    return response.data;
  },

  async updateQuote(id: string, data: UpdateQuoteRequest): Promise<Quote> {
    const response = await axios.patch(`${API_URL}/api/v1/quotes/${id}`, data);
    return response.data;
  },

  async createQuote(): Promise<Quote> {
    // ... existing
  },
};
```

---

## 3. LISTA DE TAREAS

### Fase 1: Tipos y Servicios

- [ ] Extender `types/quote.ts` con QuoteDetail y UpdateQuoteRequest
- [ ] Agregar método `getQuotesByStatus` en quoteService
- [ ] Agregar método `getQuoteById` en quoteService
- [ ] Agregar método `updateQuote` en quoteService
- [ ] Crear hook `useQuotesQuery` con filtro por status
- [ ] Crear hook `useUpdateQuoteMutation`

### Fase 2: Componentes Base

- [ ] Crear componente `QuoteListItem` con diseño de card
- [ ] Crear componente `QuoteEmptyState` para lista vacía
- [ ] Crear componente `WizardStepIndicator` (reusar Stepper existente)
- [ ] Crear componente `StepAseguradoForm` con validaciones
- [ ] Crear componente `StepAgenteForm` con checkbox "Yo soy el agente"
- [ ] Crear componente `StepVigenciaForm` con date pickers
- [ ] Crear componente `StepSummary` para resumen final

### Fase 3: Wizard Completo

- [ ] Crear componente `QuoteOnboardingWizard` contenedor
- [ ] Implementar manejo de estado del wizard (currentStep, formData)
- [ ] Implementar navegación entre pasos (anterior/siguiente)
- [ ] Implementar validación por paso
- [ ] Implementar guardado de progreso en localStorage
- [ ] Implementar confirmación al cancelar con datos ingresados
- [ ] Integrar mutación de actualización al finalizar

### Fase 4: Página de Listado

- [ ] Crear página `QuotesListPage`
- [ ] Implementar layout con Navbar y Footer
- [ ] Integrar useQuotesQuery para cargar DRAFT quotes
- [ ] Implementar grid de cards responsive
- [ ] Implementar empty state
- [ ] Integrar wizard con onComplete handler
- [ ] Implementar actualización de lista tras completar

### Fase 5: Ruta y Navegación

- [ ] Agregar ruta `/quotes` en App.tsx
- [ ] Agregar link en Navbar si existe
- [ ] Implementar navegación desde empty state a crear quote
- [ ] Implementar redirect después de crear quote en QuotePage

### Fase 6: Estilos y UX

- [ ] Aplicar estilos consistentes con SeguraX (colores, tipografía)
- [ ] Implementar animaciones de transición entre pasos
- [ ] Implementar loading states
- [ ] Implementar mensajes de error de validación
- [ ] Verificar responsive design
- [ ] Verificar accesibilidad (ARIA labels, keyboard nav)

### Fase 7: Integración Backend

- [ ] Verificar endpoints existen o crear spec para backend
- [ ] Probar flujo completo end-to-end
- [ ] Verificar cambio de estado DRAFT → IN_PROGRESS
- [ ] Verificar que quotes completadas desaparecen del listado

### QA

- [ ] Verificar filtro solo muestra DRAFT
- [ ] Verificar ordenamiento por fecha
- [ ] Verificar validaciones de campos obligatorios
- [ ] Verificar formato de email
- [ ] Verificar longitud de cédula
- [ ] Verificar fechas (inicio >= hoy, fin > inicio)
- [ ] Verificar persistencia en localStorage
- [ ] Verificar que el wizard se cierra al completar
- [ ] Verificar mensaje de éxito

---

## Notas de Implementación

### Diseño Visual
Reusar estilos existentes de:
- `HeroSection` - Para hero pequeño de la página
- `ProductCard` - Como base para cards de cotización
- `Stepper` - Componente existente para indicador de pasos
- Colores: `#C9A84C` (dorado), `#1A1A2E` (fondo oscuro)

### Componentes PrimeReact a Usar
| Componente | Uso |
|------------|-----|
| `Dialog` | Modal del wizard |
| `InputText` | Campos de texto |
| `InputMask` | Teléfono, cédula |
| `Calendar` | Fechas de vigencia |
| `Checkbox` | "Yo soy el agente" |
| `Button` | Botones de navegación |
| `Card` | Cards de cotización |
| `Stepper` | Indicador de pasos |
| `DataTable` | Alternativa para lista (opcional) |

### Consideraciones
- **Responsive**: Grid de 1 columna en mobile, 2 en tablet, 3 en desktop
- **Estado**: Usar Zustand o React useState + Context para wizard
- **Validación**: Validar en cada paso antes de permitir avanzar
- **Cancelar**: Guardar en localStorage para recuperar si cierra accidentalmente

---
*Fin de la especificación*
