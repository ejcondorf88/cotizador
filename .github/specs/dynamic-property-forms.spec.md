---
id: SPEC-011
status: APPROVED
feature: dynamic-property-forms
created: 2026-04-18
updated: 2026-04-18
author: spec-generator
version: "1.0"
related-specs: ["add-insured-properties-flow"]
---

# Spec: Formularios Dinámicos de Propiedades

> **Estado:** `DRAFT` → aprobar con `status: APPROVED` antes de iniciar implementación.

---

## 1. REQUERIMIENTOS

### Descripción
Extender el flujo de cotización para que, después de indicar la cantidad de inmuebles (N), se generen dinámicamente N formularios/tarjetas para capturar los datos específicos de cada propiedad. Cada inmueble tendrá: nombre, dirección completa, valor asegurable, tipo de construcción y uso.

### Requerimiento de Negocio
> "Después de que el usuario indique cuántos inmuebles quiere asegurar, quiero que se muestren N tarjetas (una por cada inmueble) donde pueda capturar: nombre del inmueble, dirección completa (calle, número, colonia, ciudad, estado, CP), valor asegurable en pesos, tipo de construcción y uso del inmueble. Debe poder guardar el progreso parcial y ver cuántas tarjetas completó de N."

---

### Historias de Usuario

#### HU-01: Generar N tarjetas dinámicas

```
Como: Usuario que ya indicó la cantidad de inmuebles (N)
Quiero: Ver N tarjetas de formulario, una por cada inmueble
Para: Capturar los datos específicos de cada propiedad

Prioridad: Alta
Estimación: L
Capa: Frontend + Backend
```

**Criterios de Aceptación:**

```gherkin
CRITERIO-1.1: Generación dinámica de tarjetas
Dado que: El usuario seleccionó N=3 en la pantalla anterior
Cuando: Presiona "Continuar"
Entonces: Se crean 3 registros de propiedad en estado "draft"
Y: Se redirige a /quote/{id}/properties/details
Y: Se muestran 3 tarjetas de formulario
Y: Cada tarjeta tiene número: "Inmueble 1 de 3"
```

```gherkin
CRITERIO-1.2: Progreso de completado
Dado que: Existen N tarjetas de inmuebles
Cuando: El usuario completa datos en una tarjeta
Entonces: Se muestra indicador visual de progreso
Y: Aparece checkmark en tarjetas completadas
Y: Se muestra "X de N completados"
```

```gherkin
CRITERIO-1.3: Guardado parcial automático
Dado que: El usuario está editando una tarjeta
Cuando: Cambia de tarjeta o pierde foco
Entonces: Se guarda automáticamente (auto-save)
Y: Se muestra toast "Guardado automático"
```

---

#### HU-02: Capturar datos de propiedad

```
Como: Usuario completando datos de un inmueble
Quiero: Ingresar información completa del inmueble
Para: Tener los datos necesarios para la cotización

Prioridad: Alta
Estimación: M
Capa: Frontend + Backend
```

**Criterios de Aceptación:**

```gherkin
CRITERIO-2.1: Campos obligatorios por inmueble
Dado que: El usuario edita una tarjeta de inmueble
Cuando: Visualiza el formulario
Entonces: Debe capturar obligatoriamente:
  - Nombre del inmueble (string, max 100)
  - Dirección: Calle y número (string, max 200)
  - Dirección: Colonia (string, max 100)
  - Dirección: Ciudad (string, max 100)
  - Dirección: Estado (string, max 50)
  - Dirección: Código Postal (string, 5 dígitos)
  - Valor asegurable (number, > 0, MXN)
  - Tipo de construcción (enum: CONCRETO, ACERO, MAMPOSTERIA, MADERA, OTRO)
  - Uso del inmueble (enum: COMERCIAL, INDUSTRIAL, OFICINA, RESIDENCIAL, MIXTO)
```

```gherkin
CRITERIO-2.2: Validaciones en campo
Dado que: El usuario ingresa datos inválidos
Cuando: Intenta guardar o cambiar de tarjeta
Entonces: Se muestran errores específicos:
  - Nombre requerido: "El nombre del inmueble es obligatorio"
  - CP inválido: "El código postal debe tener 5 dígitos"
  - Valor negativo: "El valor debe ser mayor a 0"
  - Valor excesivo: "El valor máximo es $100,000,000 MXN"
```

```gherkin
CRITERIO-2.3: Navegación entre tarjetas
Dado que: Existen múltiples tarjetas
Cuando: El usuario hace clic en una tarjeta
Entonces: La tarjeta seleccionada se expande/muestra
Y: Las demás se colapsan/se ocultan
Y: Se muestra indicador de tarjeta actual
```

---

#### HU-03: Guardar y finalizar

```
Como: Usuario que completó todos los inmuebles
Quiero: Guardar todos los datos y continuar
Para: Finalizar la captura de propiedades

Prioridad: Alta
Estimación: M
Capa: Frontend + Backend
```

**Criterios de Aceptación:**

```gherkin
CRITERIO-3.1: Validación antes de finalizar
Dado que: El usuario presiona "Finalizar"
Cuando: No todas las tarjetas están completas
Entonces: Se muestra error: "Complete todos los inmuebles (faltan X)"
Y: Se resaltan las tarjetas incompletas
```

```gherkin
CRITERIO-3.2: Finalizar propiedades
Dado que: Todas las N tarjetas están completas
Cuando: El usuario presiona "Finalizar"
Entonces: Se actualiza el estado de la cotización a "IN_PROGRESS"
Y: Se muestra mensaje de éxito
Y: Se redirige a /quote/{id}/summary
```

---

### Reglas de Negocio

1. **Cantidad fija**: Una vez creados N inmuebles, no se puede cambiar la cantidad sin cancelar y reiniciar
2. **Auto-guardado**: Cada 3 segundos de inactividad o al cambiar de tarjeta
3. **Valor máximo**: $100,000,000 MXN por inmueble
4. **Campos únicos**: El nombre del inmueble debe ser único dentro de la cotización
5. **Progreso mínimo**: Debe completarse al menos el 80% de campos para considerar "completa" una tarjeta
6. **Cancelación**: Al cancelar, se borran todos los inmuebles creados (confirmación previa)

---

## 2. DISEÑO

### Arquitectura del Flujo Extendido

```
┌─────────────────────────────────────────────────────────────────────────┐
│ FLUJO COMPLETO ACTUALIZADO                                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│ 1. QuotesListPage                                                       │
│    └─→ Usuario hace clic en "Completar Datos"                           │
│                                                                         │
│ 2. QuoteOnboardingWizard (3 pasos)                                      │
│    └─→ Completa paso 1, 2, 3                                            │
│                                                                         │
│ 3. Al presionar "Completar Cotización"                                  │
│    ├─→ PATCH /api/v1/quotes/{id} (estado IN_PROGRESS)                   │
│    └─→ navigate('/quote/{id}/properties', { state: { fromWizard: true } })│
│                                                                         │
│ 4. InsuredPropertiesPage (cantidad)                                     │
│    ├─→ Usuario selecciona N = 3                                         │
│    ├─→ POST /api/v1/quotes/{id}/properties/bulk (crea N inmuebles)      │
│    └─→ navigate('/quote/{id}/properties/details')                         │
│                                                                         │
│ 5. PropertyDetailsPage                                                  │
│    ├─→ GET /api/v1/quotes/{id}/properties (carga N inmuebles)           │
│    ├─→ Muestra N tarjetas de formulario                                 │
│    │   ├─→ Tarjeta 1: Inmueble 1 de 3 [Editando]                        │
│    │   ├─→ Tarjeta 2: Inmueble 2 de 3 [Pendiente]                        │
│    │   └─→ Tarjeta 3: Inmueble 3 de 3 [Pendiente]                        │
│    │                                                                     │
│    ├─→ PATCH /api/v1/properties/{id} (auto-save)                        │
│    ├─→ [Cancelar] → DELETE todos → /quotes                             │
│    └─→ [Finalizar] → PATCH status → /quote/{id}/summary                   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Modelo de Datos

#### Backend - Property Entity

```typescript
// domain/property/entities/property.entity.ts
export interface PropertyAddress {
  street: string;           // Calle y número
  neighborhood: string;    // Colonia
  city: string;             // Ciudad
  state: string;            // Estado
  zipCode: string;          // CP (5 dígitos)
}

export enum ConstructionType {
  CONCRETO = 'CONCRETO',
  ACERO = 'ACERO',
  MAMPOSTERIA = 'MAMPOSTERIA',
  MADERA = 'MADERA',
  OTRO = 'OTRO',
}

export enum PropertyUsage {
  COMERCIAL = 'COMERCIAL',
  INDUSTRIAL = 'INDUSTRIAL',
  OFICINA = 'OFICINA',
  RESIDENCIAL = 'RESIDENCIAL',
  MIXTO = 'MIXTO',
}

export class Property {
  constructor(
    public readonly id: string,
    public readonly quoteId: string,
    public name: string,
    public address: PropertyAddress,
    public insuredValue: number,        // Valor asegurable en MXN
    public constructionType: ConstructionType,
    public usage: PropertyUsage,
    public createdAt: Date,
    public updatedAt: Date,
    public completionPercentage: number, // 0-100
  ) {}
}
```

#### Backend - TypeORM Entity

```typescript
// infrastructure/property/entities/property.typeorm.entity.ts
@Entity('properties')
export class PropertyTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'quote_id' })
  @Index()
  quoteId: string;

  @Column({ name: 'name', length: 100 })
  name: string;

  @Column({ name: 'street', length: 200 })
  street: string;

  @Column({ name: 'neighborhood', length: 100 })
  neighborhood: string;

  @Column({ name: 'city', length: 100 })
  city: string;

  @Column({ name: 'state', length: 50 })
  state: string;

  @Column({ name: 'zip_code', length: 5 })
  zipCode: string;

  @Column({ name: 'insured_value', type: 'decimal', precision: 15, scale: 2 })
  insuredValue: number;

  @Column({ name: 'construction_type', type: 'enum', enum: ConstructionType })
  constructionType: ConstructionType;

  @Column({ name: 'usage', type: 'enum', enum: PropertyUsage })
  usage: PropertyUsage;

  @Column({ name: 'completion_percentage', type: 'int', default: 0 })
  completionPercentage: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => QuoteTypeOrmEntity, quote => quote.properties)
  @JoinColumn({ name: 'quote_id' })
  quote: QuoteTypeOrmEntity;
}
```

#### Frontend - Types

```typescript
// types/property.ts
export enum ConstructionType {
  CONCRETO = 'CONCRETO',
  ACERO = 'ACERO',
  MAMPOSTERIA = 'MAMPOSTERIA',
  MADERA = 'MADERA',
  OTRO = 'OTRO',
}

export enum PropertyUsage {
  COMERCIAL = 'COMERCIAL',
  INDUSTRIAL = 'INDUSTRIAL',
  OFICINA = 'OFICINA',
  RESIDENCIAL = 'RESIDENCIAL',
  MIXTO = 'MIXTO',
}

export interface PropertyAddress {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Property {
  id: string;
  quoteId: string;
  name: string;
  address: PropertyAddress;
  insuredValue: number;
  constructionType: ConstructionType;
  usage: PropertyUsage;
  completionPercentage: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePropertyRequest {
  name: string;
  address: PropertyAddress;
  insuredValue: number;
  constructionType: ConstructionType;
  usage: PropertyUsage;
}

export interface UpdatePropertyRequest {
  name?: string;
  address?: Partial<PropertyAddress>;
  insuredValue?: number;
  constructionType?: ConstructionType;
  usage?: PropertyUsage;
}

export interface BulkCreatePropertiesRequest {
  count: number;  // N - cantidad de inmuebles a crear
}
```

### API Endpoints

#### POST /api/v1/quotes/{quoteId}/properties/bulk
Crear N propiedades vacías en estado inicial

**Request:**
```json
{
  "count": 3
}
```

**Response:**
```json
{
  "properties": [
    {
      "id": "uuid-1",
      "quoteId": "quote-uuid",
      "name": "Inmueble 1",
      "address": {
        "street": "",
        "neighborhood": "",
        "city": "",
        "state": "",
        "zipCode": ""
      },
      "insuredValue": 0,
      "constructionType": null,
      "usage": null,
      "completionPercentage": 0,
      "createdAt": "2026-04-18T...",
      "updatedAt": "2026-04-18T..."
    },
    { ... },
    { ... }
  ]
}
```

#### GET /api/v1/quotes/{quoteId}/properties
Obtener todas las propiedades de una cotización

**Response:**
```json
{
  "properties": [
    {
      "id": "uuid-1",
      "quoteId": "quote-uuid",
      "name": "Oficinas Corporativas",
      "address": {
        "street": "Av. Reforma 100",
        "neighborhood": "Juárez",
        "city": "Ciudad de México",
        "state": "CDMX",
        "zipCode": "06600"
      },
      "insuredValue": 5000000,
      "constructionType": "CONCRETO",
      "usage": "OFICINA",
      "completionPercentage": 100,
      "createdAt": "2026-04-18T...",
      "updatedAt": "2026-04-18T..."
    }
  ],
  "total": 3,
  "completed": 1
}
```

#### PATCH /api/v1/properties/{id}
Actualizar una propiedad

**Request:**
```json
{
  "name": "Nuevo Nombre",
  "address": {
    "street": "Av. Insurgentes 500"
  },
  "insuredValue": 7500000
}
```

**Response:** Property actualizada

#### DELETE /api/v1/quotes/{quoteId}/properties
Eliminar todas las propiedades de una cotización (al cancelar)

**Response:** 204 No Content

### Estructura de Componentes

```
frontend/src/
├── pages/
│   └── PropertyDetailsPage.tsx          # Página principal N tarjetas
│
├── components/
│   └── properties/
│       ├── PropertyCard.tsx             # Tarjeta individual de inmueble
│       ├── PropertyForm.tsx             # Formulario dentro de la tarjeta
│       ├── PropertyProgress.tsx         # Barra de progreso X de N
│       └── PropertyCardList.tsx         # Lista de tarjetas
│
├── hooks/
│   └── queries/
│       ├── usePropertiesQuery.ts        # GET properties
│       ├── useCreatePropertiesMutation.ts  # POST bulk create
│       ├── useUpdatePropertyMutation.ts    # PATCH property
│       └── useDeletePropertiesMutation.ts  # DELETE all
│
└── types/
    └── property.ts                      # Types de propiedades
```

### Diseño de UI

```
┌─────────────────────────────────────────────────────────────────┐
│ [Navbar SeguraX]                                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │                                                           │   │
│ │  [Icono 🏢]  Detalle de Inmuebles                        │   │
│ │  Constructora del Norte S.A. de C.V.                     │   │
│ │                                                           │   │
│ │  ┌─────────────────────────────────────────────────┐     │   │
│ │  │ ████████████░░░░░░  1 de 3 completados (33%)   │     │   │
│ │  └─────────────────────────────────────────────────┘     │   │
│ │                                                           │   │
│ │  ┌────────────────────────────────────────────────────┐   │   │
│ │  │ ▼ Inmueble 1 de 3 [Editando]                     │   │   │
│ │  ├────────────────────────────────────────────────────┤   │   │
│ │  │                                                    │   │   │
│ │  │  Nombre del inmueble *                           │   │   │
│ │  │  ┌────────────────────────────────────────┐       │   │   │
│ │  │  │ Oficinas Corporativas                 │       │   │   │
│ │  │  └────────────────────────────────────────┘       │   │   │
│ │  │                                                    │   │   │
│ │  │  Dirección                                         │   │   │
│ │  │  ┌────────────────────────────────────────┐       │   │   │
│ │  │  │ Calle y número *                      │       │   │   │
│ │  │  │ Av. Reforma 100                       │       │   │   │
│ │  │  └────────────────────────────────────────┘       │   │   │
│ │  │  ┌──────────────┐ ┌──────────────┐               │   │   │
│ │  │  │ Colonia *    │ │ Ciudad *     │               │   │   │
│ │  │  │ Juárez       │ │ CDMX         │               │   │   │
│ │  │  └──────────────┘ └──────────────┘               │   │   │
│ │  │  ┌──────────────┐ ┌──────────────┐               │   │   │
│ │  │  │ Estado *     │ │ CP *         │               │   │   │
│ │  │  │ CDMX         │ │ 06600        │               │   │   │
│ │  │  └──────────────┘ └──────────────┘               │   │   │
│ │  │                                                    │   │   │
│ │  │  Valor asegurable *             $                 │   │   │
│ │  │  ┌────────────────────────────────────────┐       │   │   │
│ │  │  │ 5,000,000                             │       │   │   │
│ │  │  └────────────────────────────────────────┘       │   │   │
│ │  │                                                    │   │   │
│ │  │  Tipo de construcción *         Uso *             │   │   │
│ │  │  ┌──────────────┐             ┌──────────────┐   │   │   │
│ │  │  │ Concreto ▼   │             │ Oficina ▼    │   │   │   │
│ │  │  └──────────────┘             └──────────────┘   │   │   │
│ │  │                                                    │   │   │
│ │  │                    [Guardar] [Siguiente →]        │   │   │
│ │  └────────────────────────────────────────────────────┘   │   │
│ │                                                           │   │
│ │  ┌────────────────────────────────────────────────────┐   │   │
│ │  │ ▶ Inmueble 2 de 3 [Pendiente] ⚠️                 │   │   │
│ │  └────────────────────────────────────────────────────┘   │   │
│ │                                                           │   │
│ │  ┌────────────────────────────────────────────────────┐   │   │
│ │  │ ▶ Inmueble 3 de 3 [Pendiente] ⚠️                 │   │   │
│ │  └────────────────────────────────────────────────────┘   │   │
│ │                                                           │   │
│ │  [Cancelar]                           [Finalizar]       │   │
│ │                                                           │   │
│ └───────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. LISTA DE TAREAS

### Fase 1: Backend - Dominio y Persistencia

- [ ] Crear `domain/property/entities/property.entity.ts`
- [ ] Crear `domain/property/enums/` (construction-type, usage)
- [ ] Crear `domain/property/ports/property.repository.port.ts`
- [ ] Crear `infrastructure/property/entities/property.typeorm.entity.ts`
- [ ] Crear `infrastructure/property/mappers/property.mapper.ts`
- [ ] Crear `infrastructure/property/repositories/property.typeorm.repository.ts`
- [ ] Crear migración `CreatePropertiesTable`
- [ ] Actualizar `quote.typeorm.entity.ts` relación OneToMany

### Fase 2: Backend - Application Layer

- [ ] Crear DTOs:
  - `create-property.dto.ts`
  - `update-property.dto.ts`
  - `bulk-create-properties.dto.ts`
  - `property-response.dto.ts`
- [ ] Crear Use Cases:
  - `create-properties-bulk.use-case.ts`
  - `get-properties-by-quote.use-case.ts`
  - `update-property.use-case.ts`
  - `delete-properties-by-quote.use-case.ts`
- [ ] Crear `calculate-completion-percentage.service.ts`

### Fase 3: Backend - Presentation Layer

- [ ] Crear `property.controller.ts` con endpoints:
  - POST /quotes/:quoteId/properties/bulk
  - GET /quotes/:quoteId/properties
  - PATCH /properties/:id
  - DELETE /quotes/:quoteId/properties
- [ ] Crear `property.module.ts`
- [ ] Registrar módulo en `app.module.ts`

### Fase 4: Frontend - Types y Servicios

- [ ] Crear `types/property.ts` (interfaces, enums)
- [ ] Crear `services/propertyService.ts`:
  - createPropertiesBulk(quoteId, count)
  - getPropertiesByQuote(quoteId)
  - updateProperty(id, data)
  - deletePropertiesByQuote(quoteId)

### Fase 5: Frontend - Hooks

- [ ] Crear `hooks/queries/usePropertiesQuery.ts`
- [ ] Crear `hooks/queries/useCreatePropertiesMutation.ts`
- [ ] Crear `hooks/queries/useUpdatePropertyMutation.ts`
- [ ] Crear `hooks/queries/useDeletePropertiesMutation.ts`

### Fase 6: Frontend - Componentes

- [ ] Crear `components/properties/PropertyCard.tsx`
  - Header con número y estado
  - Formulario colapsable/expandible
  - Botones Guardar y Siguiente
- [ ] Crear `components/properties/PropertyForm.tsx`
  - Inputs para todos los campos
  - Dropdowns para enums
  - Validaciones inline
- [ ] Crear `components/properties/PropertyCardList.tsx`
  - Lista vertical de tarjetas
  - Navegación entre tarjetas
- [ ] Crear `components/properties/PropertyProgress.tsx`
  - Barra de progreso
  - Contador "X de N completados"

### Fase 7: Frontend - Página Principal

- [ ] Crear `pages/PropertyDetailsPage.tsx`
  - Layout con Navbar y Footer
  - Integrar PropertyCardList
  - Integrar PropertyProgress
  - Botones Cancelar y Finalizar
  - Validación antes de finalizar
  - Auto-save cada 3 segundos

### Fase 8: Frontend - Navegación

- [ ] Actualizar `InsuredPropertiesPage.tsx`
  - Cambiar "Continuar" para crear propiedades en bulk
  - Redirigir a `/quote/:id/properties/details`
- [ ] Agregar ruta `/quote/:id/properties/details` en `App.tsx`
- [ ] Actualizar tipos de navegación si es necesario

### Fase 9: QA

- [ ] Verificar creación bulk de N propiedades
- [ ] Verificar auto-save funciona correctamente
- [ ] Verificar navegación entre tarjetas
- [ ] Verificar validaciones de campos
- [ ] Verificar cálculo de completionPercentage
- [ ] Verificar que no permite finalizar con tarjetas incompletas
- [ ] Verificar cancelación borra todas las propiedades
- [ ] Verificar valor máximo de $100M
- [ ] Verificar CP de 5 dígitos

---

## Notas Técnicas

### Cálculo de Completion Percentage

```typescript
function calculateCompletionPercentage(property: Property): number {
  const requiredFields = [
    property.name,
    property.address.street,
    property.address.neighborhood,
    property.address.city,
    property.address.state,
    property.address.zipCode,
    property.insuredValue > 0,
    property.constructionType,
    property.usage,
  ];
  
  const completedFields = requiredFields.filter(Boolean).length;
  return Math.round((completedFields / requiredFields.length) * 100);
}
```

### Auto-Save con Debounce

```typescript
// Custom hook para auto-save
function useAutoSave(property: Property, onSave: (data: UpdatePropertyRequest) => void) {
  const debouncedSave = useDebounce(onSave, 3000);
  
  useEffect(() => {
    if (property && hasChanges) {
      debouncedSave(property);
    }
  }, [property, hasChanges]);
}
```

### Estructura de Estado Local

```typescript
interface PropertyFormState {
  properties: Property[];
  currentIndex: number;
  isDirty: boolean[];
  errors: Record<string, string[]>[];
}
```

---

## Dependencias

- **Requiere:** SPEC-010 (add-insured-properties-flow) - DEBE estar implementado
- **Relacionado:** quote-list-and-onboarding - Flujo existente

## Riesgos Identificados

1. **Alto**: Performance con N>50 (muchas tarjetas). Solución: Virtualización o paginación.
2. **Medio**: Pérdida de datos si el usuario cierra el navegador. Solución: LocalStorage backup.
3. **Medio**: Concurrencia si el usuario edita desde dos pestañas. Solución: Versioning o last-write-wins.

---
*Fin de la especificación*
