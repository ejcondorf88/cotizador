---
id: SPEC-018
status: IMPLEMENTED
feature: coverage-selection
created: 2026-04-20
updated: 2026-04-20
author: spec-generator
version: "1.0"
related-specs:
  - SPEC-011
  - SPEC-012
  - SPEC-017
---

# Spec: Micro-flujo 5 - Configuración de Coberturas

> **Estado:** `DRAFT` → aprobar con `status: APPROVED` antes de iniciar implementación.

---

## 1. REQUERIMIENTOS

### Descripción
Pantalla de configuración de coberturas de seguros de daños. El agente selecciona qué coberturas aplican para **toda la cotización** (no por ubicación individual). Las coberturas se eligen una sola vez para todo el folio.

**Contexto del flujo:**
1. ✅ Datos generales de la cotización (empresa, RFC, giro)
2. ✅ Layout de ubicaciones (cuántos inmuebles)
3. ✅ Datos de cada inmueble (dirección, construcción, valores)
4. ⏩ **Configuración de coberturas** ← ESTE PASO
5. Resumen y confirmación

### Requerimiento de Negocio
> "Después de capturar todos los datos de los inmuebles, necesito que el agente seleccione las coberturas de seguro que aplicarán a toda la cotización. Las coberturas obligatorias (Incendio y CAT) deben estar siempre activas y bloqueadas. Las coberturas opcionales deben poder activarse/desactivarse con toggles. El diseño debe ser un checklist interactivo, limpio e institucional, coherente con el estilo dorado/negro de SeguraX."

---

### Tipos de Coberturas

#### Coberturas Obligatorias (Siempre activas)
| Cobertura | Descripción | Estado |
|-----------|-------------|--------|
| **Incendio** | Daños por incendio, rayo, explosión | 🔒 ON (bloqueado) |
| **CAT** | Terremoto, huracán, inundación | 🔒 ON (bloqueado) |

#### Coberturas Opcionales (Activables por el agente)
| Cobertura | Descripción | Tipo |
|-----------|-------------|------|
| **Cristales** | Rotura de cristales y vidrios | Toggle |
| **Daños por Agua** | Fugas, inundaciones menores | Toggle |
| **Robo** | Robo y hurto de contenidos | Toggle |
| **Responsabilidad Civil** | Daños a terceros | Toggle |
| **Equipo Electrónico** | Cortocircuitos, daños eléctricos | Toggle |
| **Gastos Extra** | Gastos adicionales por siniestro | Toggle |

---

### Historias de Usuario

#### HU-01: Ver Coberturas Obligatorias
```gherkin
# language: es
Característica: Visualizar coberturas obligatorias
  Como agente
  Quiero ver las coberturas obligatorias siempre activas
  Para confirmar que están incluidas por defecto

  @coverage @mandatory @ui
  Escenario: Ver Incendio y CAT bloqueadas en ON
    Dado que estoy en el paso "Configuración de Coberturas"
    Cuando la pantalla carga
    Entonces debe mostrar sección "Coberturas Obligatorias"
    Y debe mostrar "Incendio" con toggle en ON y bloqueado 🔒
    Y debe mostrar "CAT" con toggle en ON y bloqueado 🔒
    Y debe mostrar icono de candado junto a cada una
    Y NO puedo interactuar con estos toggles
```

#### HU-02: Activar/Desactivar Coberturas Opcionales
```gherkin
# language: es
Característica: Seleccionar coberturas opcionales
  Como agente
  Quiero activar o desactivar coberturas opcionales
  Para personalizar la póliza según necesidades del cliente

  @coverage @optional @ui @interactive
  Escenario: Activar cobertura de Cristales
    Dado que estoy en "Configuración de Coberturas"
    Y veo la sección "Coberturas Opcionales"
    Cuando hago clic en el toggle de "Cristales"
    Entonces el toggle cambia a ON ✅
    Y se actualiza el resumen de prima estimada
    Y el color del toggle cambia a dorado (activo)

  @coverage @optional @ui @interactive
  Escenario: Desactivar cobertura de Robo
    Dado que "Robo" está activado
    Cuando hago clic en el toggle de "Robo"
    Entonces el toggle cambia a OFF ⭕
    Y se actualiza el resumen de prima
    Y el color del toggle cambia a gris (inactivo)

  @coverage @optional @ui
  Escenario: Ver todas las opcionales desactivadas inicialmente
    Dado que cargo el paso de coberturas
    Entonces todas las coberturas opcionales están en OFF
    Y puedo activarlas individualmente
```

#### HU-03: Ver Resumen de Coberturas
```gherkin
# language: es
Característica: Resumen de coberturas seleccionadas
  Como agente
  Quiero ver un resumen de lo seleccionado
  Para confirmar antes de continuar

  @coverage @summary @ui
  Escenario: Ver resumen de coberturas activas
    Dado que seleccioné algunas coberturas opcionales
    Cuando miro la sección inferior
    Entonces veo "Resumen de Coberturas"
    Y muestra: X obligatorias + Y opcionales = Z total
    Y muestra prima estimada base

  @coverage @summary @ui
  Escenario: Ver alerta si no hay opcionales seleccionadas
    Dado que no seleccioné ninguna cobertura opcional
    Cuando intento continuar
    Entonces muestro mensaje: "Solo coberturas obligatorias serán incluidas"
    Y permito continuar (es válido)
```

#### HU-04: Persistencia de Selección
```gherkin
# language: es
Característica: Guardar selección de coberturas
  Como agente
  Quiero que mis selecciones se guarden
  Para no perderlas al navegar

  @coverage @persistence @backend
  Escenario: Guardar coberturas al continuar
    Dado que seleccioné coberturas
    Cuando hago clic en "Continuar"
    Entonces se guarda PATCH a /api/v1/quotes/{id}/coverages
    Y el body incluye array de coverageIds activos
    Y el backend calcula prima total
```

---

### Reglas de Negocio

1. **Una sola vez por cotización**: Las coberturas se aplican a todo el folio, no por inmueble
2. **Obligatorias siempre activas**: Incendio y CAT no se pueden desactivar
3. **Opcionales desactivadas por defecto**: El agente debe activarlas explícitamente
4. **Prima dinámica**: Cada cobertura opcional suma a la prima base
5. **Visualización clara**: Diferencia visual entre obligatorias (bloqueadas) y opcionales (interactivas)
6. **Estado persistente**: Al volver atrás y adelante, mantener selección

---

## 2. DISEÑO

### Arquitectura del Componente

```
┌─────────────────────────────────────────────────────────────────┐
│                  COVERAGE SELECTION SCREEN                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  STEP 5: Configuración de Coberturas                    │   │
│  │  Indicador de pasos: [1] [2] [3] [4] [★5] [6]          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  COBERTURAS OBLIGATORIAS                                │   │
│  │  ─────────────────────────────────────────────────────  │   │
│  │                                                           │   │
│  │  🔥 Incendio y Rayo                    [🟡 ON] 🔒      │   │
│  │     Daños por incendio, rayo, explosión                   │   │
│  │                                                           │   │
│  │  🌪️  CAT (Terremoto/Huracán)            [🟡 ON] 🔒      │   │
│  │     Terremoto, huracán, inundación catastrófica          │   │
│  │                                                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  COBERTURAS OPCIONALES                                  │   │
│  │  ─────────────────────────────────────────────────────  │   │
│  │                                                           │   │
│  │  🪟 Cristales y Vidrios                  [⭕ OFF]        │   │
│  │     Rotura accidental de cristales                        │   │
│  │                                                           │   │
│  │  💧 Daños por Agua                     [🟡 ON]         │   │
│  │     Fugas, inundaciones menores, derrames                 │   │
│  │                                                           │   │
│  │  🦹 Robo y Hurto                       [⭕ OFF]        │   │
│  │     Hurto de contenidos                                   │   │
│  │                                                           │   │
│  │  ⚖️ Responsabilidad Civil              [⭕ OFF]        │   │
│  │     Daños a terceros                                      │   │
│  │                                                           │   │
│  │  🔌 Equipo Electrónico                  [🟡 ON]         │   │
│  │     Cortocircuitos, sobrecargas                           │   │
│  │                                                           │   │
│  │  💸 Gastos Extraordinarios             [⭕ OFF]        │   │
│  │     Gastos adicionales por siniestro                      │   │
│  │                                                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  RESUMEN                                                │   │
│  │  ─────────────────────────────────────────────────────  │   │
│  │                                                           │   │
│  │  Coberturas incluidas:           3 de 8                  │   │
│  │  Obligatorias:                   2                         │   │
│  │  Opcionales activas:            1                        │   │
│  │                                                           │   │
│  │  Prima estimada base:          $XX,XXX.XX MXN          │   │
│  │                                                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  [← Atrás]                    [Continuar →]             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Estructura del Componente (Frontend)

```
frontend/src/
├── pages/
│   └── wizard/
│       └── CoverageStep.tsx          # Página del paso 5
├── components/
│   └── coverage/
│       ├── CoverageSelection.tsx     # Componente principal
│       ├── MandatoryCoverage.tsx     # Coberturas obligatorias
│       ├── OptionalCoverage.tsx      # Coberturas opcionales
│       ├── CoverageToggle.tsx        # Toggle individual
│       ├── CoverageSummary.tsx       # Resumen inferior
│       └── CoverageIcon.tsx          # Iconos por cobertura
├── hooks/
│   └── useCoverages.ts               # Hook para manejo de estado
├── types/
│   └── coverage.types.ts             # Tipos TypeScript
└── services/
    └── coverageService.ts            # API calls
```

### Modelo de Datos (Backend)

#### Coverage Entity (ms-core)
```typescript
// Backend - Coverage Entity
export enum CoverageType {
  MANDATORY = 'MANDATORY',
  OPTIONAL = 'OPTIONAL'
}

export enum CoverageCode {
  FIRE = 'FIRE',                    // Incendio
  CAT = 'CAT',                      // Terremoto/Huracán
  GLASS = 'GLASS',                  // Cristales
  WATER = 'WATER',                  // Daños por agua
  THEFT = 'THEFT',                  // Robo
  LIABILITY = 'LIABILITY',          // Responsabilidad Civil
  ELECTRONIC = 'ELECTRONIC',       // Equipo electrónico
  EXTRA_EXPENSES = 'EXTRA_EXPENSES' // Gastos extra
}

@Entity()
export class Coverage {
  @PrimaryColumn()
  id: CoverageCode;
  
  @Column()
  name: string;              // "Incendio y Rayo"
  
  @Column()
  description: string;         // "Daños por incendio..."
  
  @Column({ type: 'enum', enum: CoverageType })
  type: CoverageType;        // MANDATORY | OPTIONAL
  
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  baseRate: number;          // Tasa base para cálculo de prima
  
  @Column()
  icon: string;              // Emoji o nombre de icono
  
  @Column({ default: false })
  isActive: boolean;         // Para soft-delete
}
```

#### Quote Coverage Configuration
```typescript
// Relación quote - coverages seleccionadas
export class QuoteCoverage {
  quoteId: string;
  coverageId: CoverageCode;
  isActive: boolean;
  selectedAt: Date;
}
```

### API Endpoints (Backend)

```typescript
// GET /api/v1/coverages
// Retorna todas las coberturas disponibles
{
  "data": {
    "mandatory": [
      {
        "id": "FIRE",
        "name": "Incendio y Rayo",
        "description": "Daños por incendio, rayo, explosión",
        "type": "MANDATORY",
        "icon": "🔥",
        "baseRate": 0.0
      },
      {
        "id": "CAT",
        "name": "CAT (Terremoto/Huracán)",
        "description": "Terremoto, huracán, inundación",
        "type": "MANDATORY",
        "icon": "🌪️",
        "baseRate": 0.0
      }
    ],
    "optional": [
      {
        "id": "GLASS",
        "name": "Cristales y Vidrios",
        "description": "Rotura accidental de cristales",
        "type": "OPTIONAL",
        "icon": "🪟",
        "baseRate": 0.002
      },
      // ... más coberturas
    ]
  }
}

// PATCH /api/v1/quotes/{id}/coverages
// Guarda selección de coberturas
{
  "coverageIds": ["FIRE", "CAT", "GLASS", "ELECTRONIC"]
}

// Response
{
  "data": {
    "quoteId": "uuid",
    "selectedCoverages": [...],
    "basePremium": 50000.00,
    "totalPremium": 67500.00
  }
}
```

### Componentes React (Detalle)

#### CoverageSelection.tsx
```typescript
interface CoverageSelectionProps {
  quoteId: string;
  onContinue: (coverages: CoverageCode[]) => void;
  onBack: () => void;
}

export const CoverageSelection: React.FC<CoverageSelectionProps> = ({
  quoteId,
  onContinue,
  onBack
}) => {
  const { coverages, mandatory, optional, selected, toggle, loading } = 
    useCoverages(quoteId);
  
  const handleContinue = () => {
    onContinue(selected);
  };
  
  if (loading) return <CoverageSkeleton />;
  
  return (
    <div className="coverage-selection">
      <StepIndicator currentStep={5} totalSteps={6} />
      
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Configuración de Coberturas
      </h2>
      <p className="text-gray-600 mb-6">
        Selecciona las coberturas que aplicarán a toda la cotización
      </p>
      
      {/* Obligatorias */}
      <MandatoryCoverage 
        coverages={mandatory} 
      />
      
      {/* Opcionales */}
      <OptionalCoverage 
        coverages={optional}
        selected={selected}
        onToggle={toggle}
      />
      
      {/* Resumen */}
      <CoverageSummary 
        mandatoryCount={mandatory.length}
        optionalSelected={selected.filter(s => s.type === 'OPTIONAL').length}
        estimatedPremium={calculatePremium(selected)}
      />
      
      {/* Navegación */}
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onBack}>
          ← Atrás
        </Button>
        <Button variant="primary" onClick={handleContinue}>
          Continuar →
        </Button>
      </div>
    </div>
  );
};
```

#### CoverageToggle.tsx (Estilo SeguraX)
```typescript
interface CoverageToggleProps {
  coverage: Coverage;
  isActive: boolean;
  isLocked?: boolean;
  onToggle?: () => void;
}

export const CoverageToggle: React.FC<CoverageToggleProps> = ({
  coverage,
  isActive,
  isLocked = false,
  onToggle
}) => {
  return (
    <div className={`coverage-item ${isActive ? 'active' : ''} ${isLocked ? 'locked' : ''}`}>
      <div className="coverage-icon text-2xl">{coverage.icon}</div>
      
      <div className="coverage-info flex-1">
        <h3 className="font-semibold text-gray-900">{coverage.name}</h3>
        <p className="text-sm text-gray-500">{coverage.description}</p>
      </div>
      
      <div className="coverage-status">
        {isLocked && <span className="lock-icon">🔒</span>}
        
        <button
          className={`
            toggle-button
            ${isActive ? 'bg-amber-500' : 'bg-gray-300'}
            ${isLocked ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}
          `}
          onClick={!isLocked ? onToggle : undefined}
          disabled={isLocked}
          aria-label={`${coverage.name}: ${isActive ? 'Activo' : 'Inactivo'}`}
        >
          <span className={`toggle-slider ${isActive ? 'translate-x-6' : 'translate-x-0'}`}>
            {isActive ? '✓' : ''}
          </span>
        </button>
        
        <span className={`status-label ${isActive ? 'text-amber-600' : 'text-gray-500'}`}>
          {isLocked ? 'Obligatoria' : isActive ? 'Activa' : 'Inactiva'}
        </span>
      </div>
    </div>
  );
};
```

### Estilos (Tailwind CSS)

```css
/* Estilo SeguraX - Dorado y Negro */

.coverage-selection {
  @apply max-w-4xl mx-auto p-6;
}

.coverage-section {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6;
}

.coverage-section-title {
  @apply text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-amber-500;
}

.coverage-item {
  @apply flex items-center gap-4 p-4 rounded-lg border border-gray-200 
         transition-all duration-200 hover:shadow-md;
}

.coverage-item.active {
  @apply border-amber-300 bg-amber-50;
}

.coverage-item.locked {
  @apply bg-gray-50 border-gray-300;
}

.toggle-button {
  @apply relative w-14 h-8 rounded-full transition-colors duration-200
         focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2;
}

.toggle-slider {
  @apply absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md 
         transition-transform duration-200 flex items-center justify-center
         text-amber-600 font-bold text-sm;
}

.lock-icon {
  @apply text-gray-400 mr-2;
}
```

---

## 3. LISTA DE TAREAS

### Fase 1: Backend (ms-core)

- [ ] Crear entity `Coverage` con tipos y códigos
- [ ] Crear enum `CoverageType` y `CoverageCode`
- [ ] Crear repository `CoverageRepository`
- [ ] Crear endpoint `GET /api/v1/coverages`
- [ ] Actualizar entity `Quote` con relación a coverages
- [ ] Crear endpoint `PATCH /api/v1/quotes/{id}/coverages`
- [ ] Crear seeder/migration con coberturas por defecto
- [ ] Agregar cálculo de prima basado en coverages

### Fase 2: Frontend (Modelos y Tipos)

- [ ] Crear `coverage.types.ts` con interfaces
- [ ] Crear enum `CoverageCode` en frontend
- [ ] Crear `coverageService.ts` con API calls
- [ ] Crear hook `useCoverages.ts`

### Fase 3: Frontend (Componentes)

- [ ] Crear `CoverageIcon.tsx` con iconos/emojis
- [ ] Crear `CoverageToggle.tsx` (toggle con estilo SeguraX)
- [ ] Crear `MandatoryCoverage.tsx` (sección obligatorias)
- [ ] Crear `OptionalCoverage.tsx` (sección opcionales)
- [ ] Crear `CoverageSummary.tsx` (resumen inferior)
- [ ] Crear `CoverageStep.tsx` (página del wizard)

### Fase 4: Integración Wizard

- [ ] Agregar ruta `/wizard/coverage` o paso 5
- [ ] Integrar con wizard existente
- [ ] Agregar validación del paso
- [ ] Manejar navegación Atrás/Continuar
- [ ] Guardar estado en store global

### Fase 5: Estilos y UX

- [ ] Aplicar estilos dorado/negro SeguraX
- [ ] Animaciones de toggle
- [ ] Estados de loading
- [ ] Mensajes de error
- [ ] Responsive design

### Fase 6: Testing

- [ ] Unit tests para componentes
- [ ] Integration tests API
- [ ] Test E2E flujo completo
- [ ] Verificar cálculo de prima

---

## 4. CRITERIOS DE ACEPTACIÓN

| # | Criterio | Validación |
|---|----------|------------|
| 1 | Incendio y CAT siempre activas | Toggle bloqueado en ON, icono candado |
| 2 | Opcionales desactivadas por defecto | Todos los toggles en OFF al cargar |
| 3 | Toggle funcional | Click alterna entre ON/OFF con animación |
| 4 | Estilo SeguraX | Colores dorado (#D4AF37) y negro, tipografía consistente |
| 5 | Persistencia | Al recargar, mantener selección guardada |
| 6 | Resumen actualizado | Muestra cuenta de activas y prima estimada |
| 7 | API funciona | PATCH guarda correctamente, GET recupera |
| 8 | Wizard integrado | Paso 5 del wizard, navegación fluida |

---

## 5. NOTAS TÉCNICAS

### Colores SeguraX
```
Dorado principal: #D4AF37 (amber-600)
Dorado claro: #F4E8C1 (amber-100)
Negro: #1F2937 (gray-800)
Gris texto: #6B7280 (gray-500)
```

### Iconos Sugeridos (Emojis o Lucide)
- Incendio: 🔥 o `Flame`
- CAT: 🌪️ o `CloudLightning`
- Cristales: 🪟 o `LayoutGrid`
- Agua: 💧 o `Droplets`
- Robo: 🦹 o `ShieldAlert`
- Responsabilidad: ⚖️ o `Scale`
- Electrónico: 🔌 o `Plug`
- Gastos: 💸 o `Receipt`

### Cálculo de Prima
```typescript
const calculatePremium = (coverages: Coverage[], propertyValues: number[]): number => {
  let total = 0;
  
  // Coberturas obligatorias (base)
  const basePremium = propertyValues.reduce((sum, val) => sum + val * 0.002, 0);
  total += basePremium;
  
  // Coberturas opcionales (tasa aplicada)
  const activeOptional = coverages.filter(c => c.type === 'OPTIONAL' && c.isActive);
  activeOptional.forEach(coverage => {
    const coveragePremium = propertyValues.reduce((sum, val) => 
      sum + val * coverage.baseRate, 0);
    total += coveragePremium;
  });
  
  return total;
};
```

---

## 6. RIESGOS Y CONSIDERACIONES

| Riesgo | Mitigación |
|--------|------------|
| Usuario confundido por obligatorias bloqueadas | Agregar tooltip explicativo |
| Prima calculada incorrectamente | Tests unitarios extensivos |
| Performance con muchas coberturas | Virtualización si son >20 |
| Estado no persiste al recargar | Guardar en localStorage + backend |

---

*Fin de la especificación*
