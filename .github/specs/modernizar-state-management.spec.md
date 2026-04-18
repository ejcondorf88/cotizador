---
id: SPEC-005
status: APPROVED
feature: modernizar-state-management
created: 2025-01-18
updated: 2025-01-18
author: spec-generator
version: "1.0"
related-specs: ["integracion-frontend-backend"]
---

# Spec: Modernizar State Management - TanStack Query + Zustand

> **Estado:** `DRAFT` → aprobar con `status: APPROVED` antes de iniciar implementación.
> **Ciclo de vida:** DRAFT → APPROVED → IN_PROGRESS → IMPLEMENTED → DEPRECATED

---

## 1. REQUERIMIENTOS

### Descripción
Migrar el manejo de estado y datos del frontend de React hooks manuales a librerías modernas: **TanStack Query (React Query)** para datos del servidor y **Zustand** para estado global. Esto simplificará el código, eliminará boilerplate y agregará características avanzadas como caching, retry automático y persistencia.

### Requerimiento de Negocio
> "Actualmente tenemos hooks manuales con useState/useEffect que manejan loading, error y datos. Queremos modernizar esto usando librerías como Zustand o React Query que simplifican estas tareas. React Query parece ideal para las llamadas al backend porque maneja caching, retry automático y estados sin necesidad de useState manual."
>
> Stack: React + TypeScript + TanStack Query v5 + Zustand + Axios

### Historias de Usuario

#### HU-01: Simplificar Creación de Cotización con TanStack Query

```
Como: Desarrollador frontend
Quiero: Usar TanStack Query para la creación de cotizaciones
Para: Eliminar código boilerplate de useState/useEffect y obtener caching automático

Prioridad: Alta
Estimación: M
Dependencias: SPEC-004 (integración actual)
Capa: Frontend
```

#### Criterios de Aceptación — HU-01

**Happy Path**
```gherkin
CRITERIO-1.1: Crear cotización con TanStack Query
Dado que: El usuario está en la página del cotizador
Cuando: Se ejecuta el mutation de crear cotización
Entonces: TanStack Query maneja automáticamente los estados: loading, error, success
Y: No es necesario useState manual para estos estados
Y: El mutation tiene retry automático (3 intentos) ante errores de red
Y: Los datos se cachean y se invalidan correctamente
```

**Before (Hook manual):**
```typescript
// 46 líneas de código
const [cotizacion, setCotizacion] = useState<Cotizacion | null>(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const crearCotizacion = useCallback(async () => {
  setLoading(true);
  setError(null);
  try {
    const data = await cotizacionService.crearCotizacion();
    setCotizacion(data);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}, []);
```

**After (TanStack Query):**
```typescript
// 15 líneas de código
const { mutate: crearCotizacion, data: cotizacion, isPending: loading, error } = useMutation({
  mutationFn: cotizacionService.crearCotizacion,
  retry: 3,
});
```

#### HU-02: Estado Global con Zustand

```
Como: Desarrollador frontend
Quiero: Usar Zustand para estado global de la aplicación
Para: Compartir estado entre componentes sin Context/Provider boilerplate

Prioridad: Media
Estimación: S
Dependencias: HU-01
Capa: Frontend
```

#### Criterios de Aceptación — HU-02

```gherkin
CRITERIO-2.1: Store global con Zustand
Dado que: Múltiples componentes necesitan acceder al estado
Cuando: Se crea un store con Zustand
Entonces: No se requiere Context ni Provider
Y: El store es accesible desde cualquier componente
Y: Soporta persistencia opcional
Y: Soporta TypeScript sin configuración extra

CRITERIO-2.2: Comparación de código
Dado que: Se implementa estado global
Cuando: Se usa Zustand vs Redux/Context
Entonces: Zustand requiere significativamente menos código
Y: No hay necesidad de reducers, actions ni dispatch
```

### Reglas de Negocio

1. **TanStack Query v5**: Usar la última versión con sintaxis de objetos (no tuplas)
2. **React Query DevTools**: Instalar para debugging en desarrollo
3. **Zustand**: Usar con persist middleware opcional
4. **Separación de responsabilidades**:
   - TanStack Query: Datos del servidor (server state)
   - Zustand: Estado global de UI (client state)
5. **Mantener Axios**: TanStack Query trabaja bien con Axios
6. **TypeScript**: Todo tipado estrictamente
7. **Eliminar código legacy**: Borrar hooks manuales antiguos tras migración

---

## 2. DISEÑO

### Comparación: Antes vs Después

#### Manejo de Datos del Servidor

| Característica | React Hooks Manual | TanStack Query |
|----------------|-------------------|----------------|
| Líneas de código | 30-50 | 10-15 |
| Caching | Manual | Automático |
| Background refetch | No | Sí |
| Retry automático | Manual | Configurable |
| Stale-while-revalidate | No | Sí |
| Optimistic updates | Complejo | Simplificado |
| Manejo de errores | Manual | Integrado |

#### Estado Global

| Característica | Context API | Zustand |
|----------------|-------------|---------|
| Boilerplate | Alto (Provider, Consumer) | Ninguno |
| Líneas para setup | 20+ | 5 |
| Renderizado | Puede causar re-renders | Selectivo |
| Middleware | Complejo | Simple |
| Persistencia | Manual | Built-in |

### Arquitectura Propuesta

```
frontend/src/
├── lib/
│   ├── queryClient.ts           # Configuración TanStack Query
│   └── store/                   # Zustand stores
│       └── cotizacion.store.ts
├── hooks/
│   └── queries/                 # TanStack Query hooks
│       └── useCotizacionMutation.ts
├── services/
│   └── cotizacionService.ts    # Se mantiene igual
└── pages/
    └── CotizadorPage.tsx        # Simplificado con TanStack Query
```

### Diseño de Implementación

#### Paso 1: Configurar TanStack Query

**lib/queryClient.ts**
```typescript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      retry: 3,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 3,
    },
  },
});
```

**main.tsx** (o App.tsx)
```typescript
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './lib/queryClient';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <App />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
```

#### Paso 2: Crear Hook con TanStack Query

**hooks/queries/useCotizacionMutation.ts**
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cotizacionService } from '../../services/cotizacionService';
import type { Cotizacion } from '../../types/cotizacion';

export const COTIZACIONES_KEY = 'cotizaciones';

export function useCotizacionMutation() {
  const queryClient = useQueryClient();

  return useMutation<Cotizacion, Error>({
    mutationFn: cotizacionService.crearCotizacion,
    retry: 3,
    onSuccess: (data) => {
      // Invalidar cache si es necesario
      queryClient.invalidateQueries({ queryKey: [COTIZACIONES_KEY] });
      
      // O setear directamente
      queryClient.setQueryData([COTIZACIONES_KEY, data.id], data);
    },
    onError: (error) => {
      console.error('Error al crear cotización:', error);
    },
  });
}
```

#### Paso 3: Store Zustand (Opcional para esta feature)

**lib/store/cotizacion.store.ts**
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Cotizacion } from '../../types/cotizacion';

interface CotizacionState {
  // Estado local de UI
  mostrarDetalles: boolean;
  cotizacionSeleccionada: Cotizacion | null;
  
  // Acciones
  setMostrarDetalles: (mostrar: boolean) => void;
  seleccionarCotizacion: (cotizacion: Cotizacion | null) => void;
}

export const useCotizacionStore = create<CotizacionState>()(
  persist(
    (set) => ({
      mostrarDetalles: false,
      cotizacionSeleccionada: null,
      setMostrarDetalles: (mostrar) => set({ mostrarDetalles: mostrar }),
      seleccionarCotizacion: (cotizacion) => set({ cotizacionSeleccionada: cotizacion }),
    }),
    {
      name: 'cotizacion-storage',
    }
  )
);
```

#### Paso 4: Componente Actualizado

**pages/CotizadorPage.tsx (Simplificado)**
```typescript
import { useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';
import { useCotizacionMutation } from '../hooks/queries/useCotizacionMutation';
import { useCotizacionStore } from '../lib/store/cotizacion.store';

export function CotizadorPage() {
  // TanStack Query maneja todo: loading, error, data
  const { mutate: crearCotizacion, data: cotizacion, isPending: loading, error, isSuccess } = useCotizacionMutation();
  
  // Zustand para estado de UI
  const { setMostrarDetalles } = useCotizacionStore();

  // Auto-crear al cargar
  useEffect(() => {
    if (!cotizacion && !loading && !error) {
      crearCotizacion();
    }
  }, []);

  const handleReintentar = () => {
    crearCotizacion();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 py-20">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="shadow-lg">
            <div className="text-center py-8">
              {/* TanStack Query maneja los estados automáticamente */}
              {loading && <LoadingState />}
              {error && <ErrorState error={error.message} onRetry={handleReintentar} />}
              {isSuccess && cotizacion && <SuccessState cotizacion={cotizacion} />}
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
```

### Arquitectura y Dependencias

**Nuevas dependencias:**
```bash
# TanStack Query v5
npm install @tanstack/react-query

# DevTools (solo desarrollo)
npm install -D @tanstack/react-query-devtools

# Zustand
npm install zustand
```

**Versión actual vs Nueva:**

| Dependencia | Actual | Nueva |
|-------------|--------|-------|
| react-query | No | @tanstack/react-query v5 |
| zustand | No | v5.x |
| axios | Sí | Se mantiene |

### Migración Gradual

**Fase 1: Instalación (sin romper nada)**
1. Instalar dependencias
2. Configurar QueryClientProvider (sin usar aún)
3. Verificar que todo sigue funcionando

**Fase 2: Migrar Hooks (feature por feature)**
1. Crear nuevo hook con TanStack Query
2. Actualizar componente para usar nuevo hook
3. Testear feature
4. Eliminar hook manual antiguo

**Fase 3: Agregar Zustand (opcional)**
1. Identificar estado global necesario
2. Crear stores
3. Migrar componentes

### Ventajas de la Migración

1. **Menos código**: ~70% reducción en líneas de hooks
2. **Mejor UX**: Caching, refetching automático
3. **Mejor DX**: DevTools visuales, debugging más fácil
4. **Performance**: Optimizaciones automáticas
5. **Mantenibilidad**: Código más declarativo

---

## 3. LISTA DE TAREAS

### Fase 1: Setup

- [ ] Instalar `@tanstack/react-query`
- [ ] Instalar `@tanstack/react-query-devtools` (dev)
- [ ] Instalar `zustand`
- [ ] Crear `lib/queryClient.ts` con configuración
- [ ] Actualizar `main.tsx` con QueryClientProvider
- [ ] Verificar que la app sigue funcionando

### Fase 2: Migrar Hook de Cotización

- [ ] Crear `lib/queryClient.ts`
- [ ] Crear `hooks/queries/useCotizacionMutation.ts`
- [ ] Actualizar `pages/CotizadorPage.tsx` para usar nuevo hook
- [ ] Testear: crear cotización funciona
- [ ] Testear: retry automático (simular error de red)
- [ ] Eliminar `hooks/useCrearCotizacion.ts` (antiguo)

### Fase 3: Agregar Store Zustand (Opcional)

- [ ] Crear `lib/store/cotizacion.store.ts`
- [ ] Identificar estado de UI que debería ser global
- [ ] Migrar componentes para usar Zustand
- [ ] Agregar persistencia si es necesario

### Fase 4: Limpieza

- [ ] Revisar código muerto (hooks manuales no usados)
- [ ] Actualizar imports en toda la app
- [ ] Documentar nueva arquitectura en README
- [ ] Actualizar spec: `status: IMPLEMENTED`

### QA
- [ ] Verificar que TanStack Query DevTools funciona
- [ ] Testear caching: segunda llamada usa cache
- [ ] Testear retry: error de red reintenta 3 veces
- [ ] Testear error handling: errores del backend se muestran
- [ ] Verificar TypeScript: todos los tipos correctos
- [ ] Performance: comparar bundle size antes/después
