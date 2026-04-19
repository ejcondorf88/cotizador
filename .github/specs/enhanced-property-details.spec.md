---
id: SPEC-012
status: APPROVED
feature: enhanced-property-details
created: 2026-04-19
updated: 2026-04-19
author: spec-generator
version: "1.0"
related-specs: ["dynamic-property-forms", "add-insured-properties-flow"]
---

# Spec: Fichas de Inmueble con Datos Completos

> **Estado:** `DRAFT` → aprobar con `status: APPROVED` antes de iniciar implementación.

---

## 1. REQUERIMIENTOS

### Descripción
Extender las fichas de inmueble para capturar información completa en 4 grupos de datos: Ubicación, Construcción, Garantías y Validación. Cada ficha debe tener estado COMPLETA o INCOMPLETA basado en validaciones específicas.

### Requerimiento de Negocio
> "Cada inmueble debe capturar: datos de ubicación completos, características de construcción, garantías asegurables (edificio, contenidos, equipo, maquinaria, existencias) y validaciones específicas como CP válido en core y giro con clave. El sistema debe indicar si la ficha está COMPLETA o INCOMPLETA."

---

### Historias de Usuario

#### HU-01: Capturar datos de Ubicación

```
Como: Usuario capturando datos de un inmueble
Quiero: Ingresar información de ubicación completa
Para: Identificar claramente la propiedad a asegurar

Prioridad: Alta
Estimación: M
Capa: Frontend + Backend
```

**Criterios de Aceptación:**

```gherkin
CRITERIO-1.1: Campos obligatorios de ubicación
Dado que: El usuario edita la sección "Ubicación"
Cuando: Visualiza el formulario
Entonces: Debe completar obligatoriamente:
  - Nombre del inmueble (string, max 100 caracteres)
  - Calle y número (string, max 200 caracteres)
  - Código postal (string, 5 dígitos numéricos)
  - Estado (dropdown de estados de México)
  - Ciudad (string, max 100 caracteres)
  - Colonia (string, max 100 caracteres)
```

```gherkin
CRITERIO-1.2: Validación de CP
Dado que: El usuario ingresa un código postal
Cuando: Pierde el foco del campo
Entonces: El sistema valida que sea un CP existente en México
Y: Si es inválido, muestra error: "Código postal no válido"
```

---

#### HU-02: Capturar datos de Construcción

```
Como: Usuario capturando datos de un inmueble
Quiero: Especificar características de la construcción
Para: Determinar la prima del seguro

Prioridad: Alta
Estimación: M
Capa: Frontend + Backend
```

**Criterios de Aceptación:**

```gherkin
CRITERIO-2.1: Campos de construcción
Dado que: El usuario edita la sección "Construcción"
Cuando: Visualiza el formulario
Entonces: Puede completar:
  - Tipo constructivo (dropdown: CONCRETO, ACERO, MAMPOSTERIA, MADERA, OTRO)
  - Año de construcción (number, 1900-año actual)
  - Número de niveles (number, min 1, max 50)
  - Uso del inmueble (dropdown: COMERCIAL, INDUSTRIAL, OFICINA, RESIDENCIAL, MIXTO)
  - Giro específico (string, max 100, ej: "Tienda de ropa", "Restaurante")
  - Clave de giro (string, opcional, catálogo de actividades)
```

```gherkin
CRITERIO-2.2: Validación de año
Dado que: El usuario ingresa el año de construcción
Cuando: El año es menor a 1900 o mayor al año actual
Entonces: Se muestra error: "Año de construcción inválido"
```

```gherkin
CRITERIO-2.3: Giro con clave
Dado que: El usuario selecciona un giro específico
Cuando: El giro corresponde a una actividad catalogada
Entonces: El sistema sugiere o asigna automáticamente la clave de giro
Y: El usuario puede modificarla si es necesario
```

---

#### HU-03: Capturar Garantías Asegurables

```
Como: Usuario capturando datos de un inmueble
Quiero: Especificar las garantías y sus valores asegurables
Para: Calcular la prima del seguro

Prioridad: Alta
Estimación: L
Capa: Frontend + Backend
```

**Criterios de Aceptación:**

```gherkin
CRITERIO-3.1: Tipos de garantías
Dado que: El usuario edita la sección "Garantías"
Cuando: Visualiza el formulario
Entonces: Puede especificar valor asegurable para:
  - Edificio (number, min 0, max $100,000,000 MXN)
  - Contenidos (number, min 0, max $50,000,000 MXN)
  - Equipo electrónico (number, min 0, max $20,000,000 MXN)
  - Maquinaria (number, min 0, max $30,000,000 MXN)
  - Existencias (number, min 0, max $20,000,000 MXN)
```

```gherkin
CRITERIO-3.2: Al menos una garantía obligatoria
Dado que: El usuario está completando garantías
Cuando: Intenta marcar la ficha como completa
Entonces: El sistema valida que al menos una garantía tenga valor > 0
Y: Si todas son 0, muestra error: "Debe especificar al menos una garantía con valor mayor a 0"
```

```gherkin
CRITERIO-3.3: Suma asegurada total
Dado que: El usuario ha completado garantías
Cuando: Visualiza la ficha
Entonces: Se muestra el total de suma asegurada
Y: Si supera $100,000,000 MXN, muestra advertencia de reinspección
```

---

#### HU-04: Estado de Ficha (Completa/Incompleta)

```
Como: Usuario visualizando la lista de inmuebles
Quiero: Ver claramente qué fichas están completas e incompletas
Para: Saber qué falta por capturar

Prioridad: Alta
Estimación: S
Capa: Frontend + Backend
```

**Criterios de Aceptación:**

```gherkin
CRITERIO-4.1: Cálculo de estado
Dado que: El usuario guarda una ficha
Cuando: El sistema procesa la información
Entonces: Marca la ficha como "COMPLETA" si:
  - Todos los campos obligatorios de ubicación están llenos
  - CP es válido en core
  - Tipo constructivo está seleccionado
  - Uso del inmueble está seleccionado
  - Al menos una garantía tiene valor > 0
Y: De lo contrario, marca "INCOMPLETA" indicando qué falta
```

```gherkin
CRITERIO-4.2: Visualización de estado
Dado que: El usuario ve la lista de inmuebles
Cuando: Una ficha está completa
Entonces: Se muestra checkmark verde y badge "Completa"
Y: Se puede finalizar la cotización

Dado que: Una ficha está incompleta
Cuando: El usuario la visualiza
Entonces: Se muestra badge "Incompleta" con conteo de campos faltantes
Y: Se resaltan los campos pendientes
```

---

### Reglas de Negocio

1. **CP Válido**: Solo CPs existentes en la base de datos de correos de México
2. **Giro con Clave**: El sistema debe sugerir clave de giro basada en el texto ingresado
3. **Mínimo una garantía**: Al menos una garantía debe tener valor > $0
4. **Valores máximos por garantía**: 
   - Edificio: $100M
   - Contenidos: $50M
   - Equipo: $20M
   - Maquinaria: $30M
   - Existencias: $20M
5. **Estado automático**: El sistema calcula COMPLETA/INCOMPLETA, no el usuario
6. **Validación en tiempo real**: El CP se valida al salir del campo

---

## 2. DISEÑO

### Arquitectura de Datos (4 Grupos)

```
┌─────────────────────────────────────────────────────────────────┐
│ FICHA DE INMUEBLE - 4 GRUPOS                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📍 UBICACIÓN (Requerido)                                       │
│  ├─ Nombre del inmueble *                                        │
│  ├─ Calle y número *                                             │
│  ├─ Código postal *                                              │
│  ├─ Estado * (dropdown)                                          │
│  ├─ Ciudad *                                                     │
│  └─ Colonia *                                                    │
│                                                                 │
│  🏗 CONSTRUCCIÓN (Requerido)                                     │
│  ├─ Tipo constructivo * (dropdown)                               │
│  ├─ Año de construcción                                          │
│  ├─ Número de niveles                                            │
│  ├─ Uso del inmueble * (dropdown)                                │
│  ├─ Giro específico *                                            │
│  └─ Clave de giro (autocomplete)                                  │
│                                                                 │
│  🛡 GARANTÍAS (Al menos 1 > 0)                                   │
│  ├─ Edificio ($)                                                 │
│  ├─ Contenidos ($)                                               │
│  ├─ Equipo electrónico ($)                                       │
│  ├─ Maquinaria ($)                                               │
│  └─ Existencias ($)                                              │
│                                                                 │
│  ✅ ESTADO                                                        │
│  └─ COMPLETA / INCOMPLETA (calculado automático)                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Modelo de Datos Backend

#### Property Entity (Actualizado)

```typescript
// domain/property/entities/property.entity.ts
export interface PropertyAddress {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface ConstructionDetails {
  type: ConstructionType;
  year?: number;
  levels?: number;
  usage: PropertyUsage;
  specificActivity: string;
  activityCode?: string;
}

export interface PropertyCoverages {
  building: number;
  contents: number;
  electronicEquipment: number;
  machinery: number;
  stock: number;
}

export enum PropertyStatus {
  INCOMPLETE = 'INCOMPLETE',
  COMPLETE = 'COMPLETE',
}

export class Property {
  constructor(
    public readonly id: string,
    public readonly quoteId: string,
    public name: string,
    public address: PropertyAddress,
    public construction: ConstructionDetails,
    public coverages: PropertyCoverages,
    public status: PropertyStatus,
    public completionPercentage: number,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}
  
  // Método para calcular estado
  recalculateStatus(): void {
    const required = [
      this.name?.trim().length > 0,
      this.address?.street?.trim().length > 0,
      /^\d{5}$/.test(this.address?.zipCode),
      this.address?.state?.trim().length > 0,
      this.address?.city?.trim().length > 0,
      this.address?.neighborhood?.trim().length > 0,
      this.construction?.type !== null,
      this.construction?.usage !== null,
      this.construction?.specificActivity?.trim().length > 0,
      this.getTotalSumInsured() > 0,
    ];
    
    const completed = required.filter(Boolean).length;
    this.completionPercentage = Math.round((completed / required.length) * 100);
    this.status = this.completionPercentage === 100 
      ? PropertyStatus.COMPLETE 
      : PropertyStatus.INCOMPLETE;
  }
  
  getTotalSumInsured(): number {
    return Object.values(this.coverages).reduce((a, b) => a + (b || 0), 0);
  }
}
```

#### TypeORM Entity (Actualizado)

```typescript
@Entity('properties')
export class PropertyTypeOrmEntity {
  // ... campos existentes ...
  
  // Ubicación (ya existen)
  @Column({ name: 'name', length: 100 })
  name: string;
  
  @Column({ name: 'street', length: 200 })
  street: string;
  
  @Column({ name: 'zip_code', length: 5 })
  zipCode: string;
  
  @Column({ name: 'state', length: 50 })
  state: string;
  
  @Column({ name: 'city', length: 100 })
  city: string;
  
  @Column({ name: 'neighborhood', length: 100 })
  neighborhood: string;
  
  // Construcción (NUEVO)
  @Column({ name: 'construction_type', type: 'enum', enum: ConstructionType })
  constructionType: ConstructionType;
  
  @Column({ name: 'construction_year', nullable: true, type: 'int' })
  constructionYear: number;
  
  @Column({ name: 'levels', nullable: true, type: 'int' })
  levels: number;
  
  @Column({ name: 'property_usage', type: 'enum', enum: PropertyUsage })
  propertyUsage: PropertyUsage;
  
  @Column({ name: 'specific_activity', length: 100 })
  specificActivity: string;
  
  @Column({ name: 'activity_code', length: 20, nullable: true })
  activityCode: string;
  
  // Garantías (NUEVO)
  @Column({ name: 'coverage_building', type: 'decimal', precision: 15, scale: 2, default: 0 })
  coverageBuilding: number;
  
  @Column({ name: 'coverage_contents', type: 'decimal', precision: 15, scale: 2, default: 0 })
  coverageContents: number;
  
  @Column({ name: 'coverage_electronic', type: 'decimal', precision: 15, scale: 2, default: 0 })
  coverageElectronic: number;
  
  @Column({ name: 'coverage_machinery', type: 'decimal', precision: 15, scale: 2, default: 0 })
  coverageMachinery: number;
  
  @Column({ name: 'coverage_stock', type: 'decimal', precision: 15, scale: 2, default: 0 })
  coverageStock: number;
  
  // Estado (NUEVO)
  @Column({ name: 'status', type: 'enum', enum: PropertyStatus, default: PropertyStatus.INCOMPLETE })
  status: PropertyStatus;
  
  @Column({ name: 'completion_percentage', type: 'int', default: 0 })
  completionPercentage: number;
}
```

### Nuevos DTOs

```typescript
// application/property/dto/update-property.dto.ts
export class UpdatePropertyDto {
  // Ubicación
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() street?: string;
  @IsOptional() @IsString() zipCode?: string;
  @IsOptional() @IsString() state?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() neighborhood?: string;
  
  // Construcción
  @IsOptional() @IsEnum(ConstructionType) constructionType?: ConstructionType;
  @IsOptional() @IsNumber() @Min(1900) constructionYear?: number;
  @IsOptional() @IsNumber() @Min(1) levels?: number;
  @IsOptional() @IsEnum(PropertyUsage) propertyUsage?: PropertyUsage;
  @IsOptional() @IsString() specificActivity?: string;
  @IsOptional() @IsString() activityCode?: string;
  
  // Garantías
  @IsOptional() @IsNumber() @Min(0) coverageBuilding?: number;
  @IsOptional() @IsNumber() @Min(0) coverageContents?: number;
  @IsOptional() @IsNumber() @Min(0) coverageElectronic?: number;
  @IsOptional() @IsNumber() @Min(0) coverageMachinery?: number;
  @IsOptional() @IsNumber() @Min(0) coverageStock?: number;
}
```

### Componentes Frontend

#### PropertyCard (Rediseñado)

```
┌─────────────────────────────────────────────────────────────┐
│ [icon] Inmueble 1 de 3           [BADGE: Completa/Incompleta] │
├─────────────────────────────────────────────────────────────┤
│ 📍 Ubicación                                                │
│ ├─ Oficinas Corporativas                                    │
│ └─ Av. Reforma 100, Juárez, CDMX, 06600                   │
│                                                             │
│ 🏗 Construcción: Concreto, 5 niveles, Oficina              │
│                                                             │
│ 🛡 Suma Asegurada Total: $5,000,000 MXN                    │
│ └─ Edificio: $5M | Contenidos: $0 | ...                    │
│                                                             │
│ [Expandir/Collapse]          [Editar] [Eliminar]           │
└─────────────────────────────────────────────────────────────┘
```

#### PropertyForm (4 Secciones)

```
┌─────────────────────────────────────────────────────────────┐
│ STEPPER: [Ubicación] → [Construcción] → [Garantías] → [Resumen]│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 📍 SECCIÓN: UBICACIÓN                                       │
│ ├─ Nombre *                                                │
│ ├─ Calle y número *                                        │
│ ├─ CP *              [🔍 Validar]                          │
│ ├─ Estado *          Ciudad *                             │
│ └─ Colonia *                                               │
│                                                             │
│                    [Siguiente]                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 🏗 SECCIÓN: CONSTRUCCIÓN                                    │
│ ├─ Tipo constructivo *      Año construcción               │
│ ├─ Número de niveles        Uso del inmueble *            │
│ ├─ Giro específico *                                       │
│ └─ Clave de giro: [Autocomplete]                          │
│                                                             │
│              [Anterior] [Siguiente]                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 🛡 SECCIÓN: GARANTÍAS                                       │
│                                                             │
│  💰 Edificio          [$___________] MXN                    │
│  📦 Contenidos        [$___________] MXN                    │
│  💻 Equipo Electrónico [$___________] MXN                  │
│  ⚙️ Maquinaria        [$___________] MXN                    │
│  📋 Existencias       [$___________] MXN                    │
│                                                             │
│  Suma Asegurada Total: $___________ MXN                   │
│                                                             │
│  ⚠️ Debe especificar al menos una garantía > $0           │
│                                                             │
│              [Anterior] [Siguiente]                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ✅ SECCIÓN: RESUMEN Y VALIDACIÓN                            │
│                                                             │
│  Estado: [✓ COMPLETA] / [⚠ INCOMPLETA]                     │
│                                                             │
│  Campos completados: 9/9                                  │
│                                                             │
│  Ubicación:        [✓]                                     │
│  Construcción:     [✓]                                     │
│  Garantías:        [✓] ($5,000,000 total)                 │
│                                                             │
│              [Anterior] [Guardar]                           │
└─────────────────────────────────────────────────────────────┘
```

### API Endpoints (Actualizados)

```
POST /api/v1/quotes/:quoteId/properties/bulk
- Crear N propiedades vacías con estructura completa

GET /api/v1/quotes/:quoteId/properties
- Obtener todas las propiedades con datos completos

PATCH /api/v1/properties/:id
- Actualizar cualquier campo (ubicación, construcción, garantías)
- Recalcula estado automáticamente

GET /api/v1/cp/:cp/validate
- Validar si un código postal existe (nuevo endpoint)

GET /api/v1/activities/search?query=
- Buscar clave de giro por texto (nuevo endpoint)
```

---

## 3. LISTA DE TAREAS

### Fase 1: Backend - Modelo de Datos

- [ ] Actualizar `Property` entity con nuevos campos (construcción, garantías)
- [ ] Actualizar `PropertyTypeOrmEntity` con nuevas columnas
- [ ] Actualizar `PropertyMapper` para mapear nuevos campos
- [ ] Crear migración `AddPropertyDetailsColumns`
- [ ] Crear enum `PropertyStatus` (INCOMPLETE, COMPLETE)

### Fase 2: Backend - API

- [ ] Actualizar `UpdatePropertyDto` con nuevos campos
- [ ] Actualizar `PropertyResponseDto` con nuevos campos
- [ ] Crear endpoint `GET /cp/:cp/validate`
- [ ] Crear endpoint `GET /activities/search`
- [ ] Actualizar `UpdatePropertyUseCase` para recalcular estado automáticamente

### Fase 3: Frontend - Types

- [ ] Actualizar `types/property.ts` con nuevas interfaces
- [ ] Agregar enum `PropertyStatus`
- [ ] Actualizar `UpdatePropertyRequest`

### Fase 4: Frontend - Componentes

- [ ] Crear `PropertyStepper.tsx` (4 pasos: Ubicación → Construcción → Garantías → Resumen)
- [ ] Rediseñar `PropertyForm.tsx` con 4 secciones
- [ ] Crear `PropertyLocationSection.tsx` (nombre, calle, CP, estado, ciudad, colonia)
- [ ] Crear `PropertyConstructionSection.tsx` (tipo, año, niveles, uso, giro, clave)
- [ ] Crear `PropertyCoverageSection.tsx` (5 garantías con inputs de valor)
- [ ] Crear `PropertySummarySection.tsx` (estado, validaciones, suma total)
- [ ] Actualizar `PropertyCard.tsx` para mostrar resumen de los 4 grupos
- [ ] Crear validación de CP en tiempo real
- [ ] Crear autocomplete de clave de giro

### Fase 5: Frontend - Servicios

- [ ] Actualizar `propertyService.ts` con nuevos endpoints
- [ ] Agregar método `validateZipCode(cp)`
- [ ] Agregar método `searchActivity(query)`

### Fase 6: Integración

- [ ] Conectar formularios con API
- [ ] Implementar auto-save cada 3 segundos
- [ ] Mostrar estado COMPLETA/INCOMPLETA en tiempo real
- [ ] Validar al menos una garantía > 0 antes de guardar

### Fase 7: QA

- [ ] Verificar validación de CP
- [ ] Verificar cálculo de estado COMPLETA/INCOMPLETA
- [ ] Verificar suma asegurada total
- [ ] Verificar que se requiera al menos una garantía
- [ ] Verificar persistencia de todos los campos

---

## 4. VALIDACIONES TÉCNICAS

### Validación de CP

```typescript
// Frontend - validación en tiempo real
async function validateZipCode(cp: string): Promise<boolean> {
  if (!/^\d{5}$/.test(cp)) return false;
  try {
    const response = await fetch(`/api/v1/cp/${cp}/validate`);
    return response.ok;
  } catch {
    return false;
  }
}
```

### Cálculo de Estado

```typescript
function calculatePropertyStatus(property: Property): PropertyStatus {
  const validations = [
    property.name?.trim().length > 0,
    property.address?.street?.trim().length > 0,
    /^\d{5}$/.test(property.address?.zipCode),
    property.address?.state?.length > 0,
    property.address?.city?.length > 0,
    property.address?.neighborhood?.length > 0,
    property.construction?.type !== null,
    property.construction?.usage !== null,
    property.construction?.specificActivity?.trim().length > 0,
    getTotalCoverage(property) > 0,
  ];
  
  return validations.every(Boolean) 
    ? PropertyStatus.COMPLETE 
    : PropertyStatus.INCOMPLETE;
}
```

---

*Fin de la especificación*
