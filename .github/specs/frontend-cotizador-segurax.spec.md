---
id: SPEC-024
status: DRAFT
feature: frontend-cotizador-segurax
created: 2026-04-21
updated: 2026-04-21
author: spec-generator
version: "1.0"
related-specs:
  - SPEC-021
  - SPEC-023
---

# SPEC-024: Frontend Cotizador SeguraX

> **URL Base:** `http://localhost:5173/`  
> **Stack:** React 18 + Vite + TypeScript + Tailwind CSS + React Query  
> **Estado:** `DRAFT` → aprobar con `status: APPROVED` antes de implementar cambios.

---

## 1. VISIÓN GENERAL

### 1.1 Descripción

Aplicación web React para el **Cotizador SeguraX** - sistema de cotización de seguros de propiedad. El frontend consume APIs REST a través del Gateway (`http://localhost:8080`) y proporciona una interfaz intuitiva para agentes de seguros.

### 1.2 Arquitectura Frontend

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FRONTEND COTIZADOR SEGURAX                              │
│                         http://localhost:5173/                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    CAPA DE PRESENTACIÓN                            │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │   │
│  │  │   Pages      │  │  Components  │  │     UI       │              │   │
│  │  │  (Views)     │  │   (Logic)    │  │  (Present.)  │              │   │
│  │  │              │  │              │  │              │              │   │
│  │  │ • HomePage   │  │ • QuoteForm  │  │ • Button     │              │   │
│  │  │ • QuotePage  │  │ • Property   │  │ • Input      │              │   │
│  │  │ • Wizard     │  │ • Coverage   │  │ • Modal      │              │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    CAPA DE ESTADO (Hooks)                            │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │   │
│  │  │  Custom      │  │  React       │  │  Context     │              │   │
│  │  │  Hooks       │  │  Query       │  │  (Auth)      │              │   │
│  │  │              │  │              │  │              │              │   │
│  │  │ useQuote     │  │ useQuery     │  │ AuthProvider │              │   │
│  │  │ useProperty  │  │ useMutation  │  │ QuoteContext │              │   │
│  │  │ useCoverage  │  │ Cache        │  │              │              │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    CAPA DE SERVICIOS (API)                           │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │   │
│  │  │   Axios      │  │   Services   │  │   DTOs       │              │   │
│  │  │   Config     │  │              │  │   (Types)    │              │   │
│  │  │              │  │ • Quote      │  │              │              │   │
│  │  │ Interceptors │  │ • Property   │  │ Interfaces   │              │   │
│  │  │ Error Handl. │  │ • Coverage   │  │ API Contracts│              │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    API GATEWAY                                       │   │
│  │              http://localhost:8080/api/v1/...                        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. ESTRUCTURA DE CARPETAS

```
frontend/
├── public/
│   ├── favicon.ico
│   └── assets/
│       └── images/
├── src/
│   ├── main.tsx              # Entry point
│   ├── App.tsx               # Router + Providers
│   ├── routes/               # Configuración de rutas
│   │   └── AppRouter.tsx
│   │
│   ├── pages/                # Vistas/Páginas
│   │   ├── HomePage/
│   │   │   └── HomePage.tsx
│   │   ├── QuotePage/
│   │   │   └── QuotePage.tsx
│   │   ├── WizardPage/
│   │   │   └── WizardPage.tsx
│   │   └── CatalogPage/
│   │       └── CatalogPage.tsx
│   │
│   ├── components/           # Componentes reutilizables
│   │   ├── common/           # UI genérica
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   ├── Select/
│   │   │   ├── Modal/
│   │   │   └── Table/
│   │   │
│   │   ├── quote/            # Dominio: Cotizaciones
│   │   │   ├── QuoteForm/
│   │   │   ├── QuoteList/
│   │   │   └── QuoteCard/
│   │   │
│   │   ├── property/         # Dominio: Propiedades
│   │   │   ├── PropertyForm/
│   │   │   ├── PropertyList/
│   │   │   └── PropertyCard/
│   │   │
│   │   ├── coverage/         # Dominio: Coberturas
│   │   │   ├── CoverageSelector/
│   │   │   └── CoverageSummary/
│   │   │
│   │   └── catalog/          # Dominio: Catálogos
│   │       ├── GiroSelector/
│   │       ├── AgenteSelector/
│   │       └── OficinaSelector/
│   │
│   ├── hooks/                # Custom Hooks
│   │   ├── useQuotes.ts
│   │   ├── useProperties.ts
│   │   ├── useCoverages.ts
│   │   ├── useCatalogs.ts
│   │   └── useAuth.ts
│   │
│   ├── services/             # Servicios API
│   │   ├── apiClient.ts      # Config Axios
│   │   ├── quoteService.ts
│   │   ├── propertyService.ts
│   │   ├── coverageService.ts
│   │   └── catalogService.ts
│   │
│   ├── types/                # Definiciones TypeScript
│   │   ├── quote.types.ts
│   │   ├── property.types.ts
│   │   ├── coverage.types.ts
│   │   ├── catalog.types.ts
│   │   └── api.types.ts
│   │
│   ├── contexts/             # React Context
│   │   ├── AuthContext.tsx
│   │   └── QuoteContext.tsx
│   │
│   ├── utils/                # Utilidades
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── constants.ts
│   │
│   ├── styles/               # Estilos globales
│   │   ├── index.css
│   │   └── tailwind.config.js
│   │
│   └── __tests__/            # Tests
│       ├── components/
│       ├── hooks/
│       └── services/
│
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── .env
```

---

## 3. RUTAS DE LA APLICACIÓN

| Ruta | Componente | Descripción | Acceso |
|------|------------|-------------|--------|
| `/` | `HomePage` | Página de inicio con menú | Público |
| `/quotes` | `QuotesPage` | Lista de cotizaciones | Autenticado |
| `/quotes/new` | `QuoteWizard` | Wizard nueva cotización | Autenticado |
| `/quotes/:id` | `QuoteDetailPage` | Detalle de cotización | Autenticado |
| `/quotes/:id/properties` | `PropertiesPage` | Propiedades de cotización | Autenticado |
| `/quotes/:id/coverage` | `CoveragePage` | Selección de coberturas | Autenticado |
| `/catalogs` | `CatalogsPage` | Gestión de catálogos | Admin |
| `/catalogs/giros` | `GirosPage` | Catálogo de giros | Admin |
| `/catalogs/agentes` | `AgentesPage` | Catálogo de agentes | Admin |
| `/login` | `LoginPage` | Inicio de sesión | Público |
| `/profile` | `ProfilePage` | Perfil de usuario | Autenticado |

---

## 4. CONFIGURACIÓN DE ENTORNO

### 4.1 Archivo `.env`

```bash
# API Configuration
VITE_API_URL=http://localhost:8080/api/v1
VITE_APP_NAME=SeguraX Cotizador
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_CATALOGS=true
VITE_ENABLE_ADVANCED_SEARCH=true

# Timeouts
VITE_API_TIMEOUT=10000

# Cache
VITE_CACHE_TTL=300000  # 5 minutos en ms
```

### 4.2 Configuración Axios (`apiClient.ts`)

```typescript
import axios, { AxiosInstance, AxiosError } from 'axios';

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // X-Request-ID para trazabilidad
    config.headers['X-Request-ID'] = crypto.randomUUID();
    
    // Log en desarrollo
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.params);
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.status} ${response.config.url}`, response.data);
    }
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expirado, redirigir a login
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    
    console.error('[API Error]', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
```

---

## 5. SERVICIOS API

### 5.1 Quote Service

```typescript
// src/services/quoteService.ts
import apiClient from './apiClient';
import { Quote, CreateQuoteDto, UpdateQuoteDto } from '../types/quote.types';

export const quoteService = {
  // GET /quotes
  getAll: async (page = 1, limit = 10) => {
    const response = await apiClient.get('/quotes', {
      params: { page, limit }
    });
    return response.data;
  },

  // GET /quotes/:id
  getById: async (id: string) => {
    const response = await apiClient.get(`/quotes/${id}`);
    return response.data;
  },

  // POST /quotes
  create: async (data: CreateQuoteDto) => {
    const response = await apiClient.post('/quotes', data);
    return response.data;
  },

  // PATCH /quotes/:id
  update: async (id: string, data: UpdateQuoteDto) => {
    const response = await apiClient.patch(`/quotes/${id}`, data);
    return response.data;
  },

  // DELETE /quotes/:id
  delete: async (id: string) => {
    await apiClient.delete(`/quotes/${id}`);
  },
};
```

### 5.2 Catalog Service (integración con ms-catalogos)

```typescript
// src/services/catalogService.ts
import apiClient from './apiClient';

export const catalogService = {
  // Giros
  searchGiros: async (query: string, limit = 20) => {
    const response = await apiClient.get('/catalogos/giros/buscar', {
      params: { q: query, limit }
    });
    return response.data;
  },

  getGiros: async (page = 1, limit = 10) => {
    const response = await apiClient.get('/catalogos/giros', {
      params: { page, limit }
    });
    return response.data;
  },

  // Agentes
  searchAgentes: async (query: string) => {
    const response = await apiClient.get('/catalogos/agentes/buscar', {
      params: { q: query }
    });
    return response.data;
  },

  // Oficinas
  getOficinas: async () => {
    const response = await apiClient.get('/catalogos/oficinas');
    return response.data;
  },

  // Suscriptores
  searchSuscriptores: async (query: string) => {
    const response = await apiClient.get('/catalogos/suscriptores/buscar', {
      params: { q: query }
    });
    return response.data;
  },
};
```

---

## 6. HOOKS PERSONALIZADOS

### 6.1 useQuotes (React Query)

```typescript
// src/hooks/useQuotes.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { quoteService } from '../services/quoteService';

const QUOTES_KEY = 'quotes';

export const useQuotes = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: [QUOTES_KEY, { page, limit }],
    queryFn: () => quoteService.getAll(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

export const useQuote = (id: string) => {
  return useQuery({
    queryKey: [QUOTES_KEY, id],
    queryFn: () => quoteService.getById(id),
    enabled: !!id,
  });
};

export const useCreateQuote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: quoteService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUOTES_KEY] });
    },
  });
};
```

### 6.2 useCatalogs

```typescript
// src/hooks/useCatalogs.ts
import { useQuery } from '@tanstack/react-query';
import { catalogService } from '../services/catalogService';

export const useGirosSearch = (query: string, enabled = false) => {
  return useQuery({
    queryKey: ['giros', 'search', query],
    queryFn: () => catalogService.searchGiros(query),
    enabled: enabled && query.length >= 3,
    staleTime: 24 * 60 * 60 * 1000, // 24 horas - catálogos no cambian mucho
  });
};

export const useAgentesSearch = (query: string, enabled = false) => {
  return useQuery({
    queryKey: ['agentes', 'search', query],
    queryFn: () => catalogService.searchAgentes(query),
    enabled: enabled && query.length >= 2,
  });
};

export const useOficinas = () => {
  return useQuery({
    queryKey: ['oficinas'],
    queryFn: catalogService.getOficinas,
    staleTime: 60 * 60 * 1000, // 1 hora
  });
};
```

---

## 7. COMPONENTES CLAVE

### 7.1 Layout Principal

```typescript
// src/components/layout/MainLayout.tsx
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
```

### 7.2 Componente de Búsqueda de Giros (con ms-catalogos)

```typescript
// src/components/catalog/GiroSelector.tsx
import { useState } from 'react';
import { useGirosSearch } from '../../hooks/useCatalogs';
import { Input } from '../common/Input';
import { Dropdown } from '../common/Dropdown';

interface GiroSelectorProps {
  value?: string;
  onChange: (giro: { id: string; clave: string; descripcion: string }) => void;
}

export const GiroSelector = ({ value, onChange }: GiroSelectorProps) => {
  const [query, setQuery] = useState('');
  const { data, isLoading } = useGirosSearch(query, true);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700">
        Giro / Actividad
      </label>
      <Input
        type="text"
        placeholder="Buscar por clave o descripción..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mt-1"
      />
      
      {isLoading && <span className="text-sm text-gray-500">Buscando...</span>}
      
      {data?.items && data.items.length > 0 && (
        <Dropdown>
          {data.items.map((giro) => (
            <Dropdown.Item
              key={giro.id}
              onClick={() => {
                onChange(giro);
                setQuery(`${giro.clave} - ${giro.descripcion}`);
              }}
            >
              <span className="font-medium">{giro.clave}</span>
              <span className="ml-2 text-gray-600">{giro.descripcion}</span>
              <span className="ml-auto text-xs text-gray-400">{giro.riesgo}</span>
            </Dropdown.Item>
          ))}
        </Dropdown>
      )}
    </div>
  );
};
```

### 7.3 Wizard de Cotización

```typescript
// src/components/quote/QuoteWizard.tsx
import { useState } from 'react';
import { Step1BasicInfo } from './steps/Step1BasicInfo';
import { Step2Properties } from './steps/Step2Properties';
import { Step3Coverage } from './steps/Step3Coverage';
import { Step4Summary } from './steps/Step4Summary';

const STEPS = [
  { id: 1, name: 'Información Básica', component: Step1BasicInfo },
  { id: 2, name: 'Propiedades', component: Step2Properties },
  { id: 3, name: 'Coberturas', component: Step3Coverage },
  { id: 4, name: 'Resumen', component: Step4Summary },
];

export const QuoteWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [quoteData, setQuoteData] = useState({});

  const CurrentStepComponent = STEPS[currentStep - 1].component;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((step) => (
            <div
              key={step.id}
              className={`flex items-center ${
                step.id <= currentStep ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              <span className="w-8 h-8 rounded-full border-2 flex items-center justify-center">
                {step.id}
              </span>
              <span className="ml-2 text-sm font-medium">{step.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow p-6">
        <CurrentStepComponent
          data={quoteData}
          onChange={setQuoteData}
        />
      </div>

      {/* Navigation */}
      <div className="mt-6 flex justify-between">
        <button
          disabled={currentStep === 1}
          onClick={() => setCurrentStep((s) => s - 1)}
          className="px-4 py-2 border rounded-md"
        >
          Anterior
        </button>
        <button
          onClick={() => setCurrentStep((s) => s + 1)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          {currentStep === STEPS.length ? 'Finalizar' : 'Siguiente'}
        </button>
      </div>
    </div>
  );
};
```

---

## 8. TIPOS TYPESCRIPT

### 8.1 Tipos de Cotización

```typescript
// src/types/quote.types.ts

export interface Quote {
  id: string;
  folioNumber: string;
  companyName: string;
  rfc: string;
  agentKey: string;
  subscriber: string;
  office: string;
  startDate: Date;
  endDate: Date;
  status: QuoteStatus;
  totalPremium: number;
  createdAt: Date;
  updatedAt: Date;
}

export enum QuoteStatus {
  DRAFT = 'DRAFT',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  EXPIRED = 'EXPIRED',
}

export interface CreateQuoteDto {
  companyName: string;
  rfc: string;
  agentKey: string;
  subscriber: string;
  office: string;
  startDate: Date;
  endDate: Date;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}
```

### 8.2 Tipos de Catálogos (ms-catalogos)

```typescript
// src/types/catalog.types.ts

export interface Giro {
  id: string;
  clave: string;
  descripcion: string;
  sector: string | null;
  riesgo: 'BAJO' | 'MEDIO' | 'ALTO' | 'MUY_ALTO';
  activo: boolean;
}

export interface Agente {
  id: string;
  codigo: string;
  nombre: string;
  email: string | null;
  telefono: string | null;
  oficinaId: string | null;
  activo: boolean;
}

export interface Oficina {
  id: string;
  codigo: string;
  nombre: string;
  ciudad: string | null;
  estado: string | null;
  activo: boolean;
}

export interface Suscriptor {
  id: string;
  codigo: string;
  nombre: string;
  tipo: string | null;
  activo: boolean;
}
```

---

## 9. CONFIGURACIÓN VITE

### 9.1 `vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@services': path.resolve(__dirname, './src/services'),
      '@types': path.resolve(__dirname, './src/types'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
```

---

## 10. LISTA DE TAREAS

### Fase 1: Setup y Configuración
- [ ] Configurar Vite + React + TypeScript
- [ ] Configurar Tailwind CSS
- [ ] Configurar Axios con interceptores
- [ ] Configurar React Query
- [ ] Configurar React Router
- [ ] Configurar variables de entorno

### Fase 2: Componentes Base
- [ ] Crear componentes UI (Button, Input, Select)
- [ ] Crear Layout (Navbar, Sidebar)
- [ ] Crear páginas base (Home, Login)
- [ ] Configurar rutas

### Fase 3: Servicios API
- [ ] Implementar quoteService
- [ ] Implementar propertyService
- [ ] Implementar coverageService
- [ ] Implementar catalogService (ms-catalogos)
- [ ] Agregar manejo de errores

### Fase 4: Hooks y Estado
- [ ] Implementar useQuotes
- [ ] Implementar useProperties
- [ ] Implementar useCatalogs
- [ ] Configurar caché de catálogos
- [ ] Implementar AuthContext

### Fase 5: Wizard de Cotización
- [ ] Crear Step1: Información Básica
- [ ] Crear Step2: Propiedades
- [ ] Crear Step3: Coberturas
- [ ] Crear Step4: Resumen
- [ ] Integrar con catálogos reales

### Fase 6: Catálogos (Integración ms-catalogos)
- [ ] Crear GiroSelector con búsqueda
- [ ] Crear AgenteSelector con búsqueda
- [ ] Crear OficinaSelector (dropdown)
- [ ] Crear SuscriptorSelector
- [ ] Agregar caché localStorage

### Fase 7: Testing
- [ ] Tests unitarios de componentes
- [ ] Tests de hooks
- [ ] Tests de servicios
- [ ] Tests E2E con Cypress/Playwright

### Fase 8: Optimización
- [ ] Implementar lazy loading
- [ ] Configurar code splitting
- [ ] Optimizar imágenes
- [ ] Agregar service worker
- [ ] Configurar PWA

---

## 11. COMANDOS ÚTILES

```bash
# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Preview de producción
npm run preview

# Tests
npm test

# Tests con cobertura
npm run test:cov

# Lint
npm run lint

# Type check
npx tsc --noEmit
```

---

## 12. CHECKLIST DE IMPLEMENTACIÓN

- [ ] Proyecto corre en http://localhost:5173/
- [ ] Se conecta al Gateway en http://localhost:8080
- [ ] Login funciona y guarda token
- [ ] Wizard de cotización navegable
- [ ] Selectores de catálogos consumen ms-catalogos
- [ ] Cache de catálogos en localStorage
- [ ] Manejo de errores implementado
- [ ] Tests unitarios pasan
- [ ] Build de producción exitoso
- [ ] Lighthouse score > 90

---

*SPEC-024: Frontend Cotizador SeguraX - ASDD Framework*
