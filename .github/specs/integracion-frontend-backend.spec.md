---
id: SPEC-004
status: APPROVED
feature: integracion-frontend-backend
created: 2025-01-18
updated: 2025-01-18
author: spec-generator
version: "1.0"
related-specs: ["segurax-homepage", "cotizador-backend"]
---

# Spec: Integración Frontend-Backend - Cotizador SeguraX

> **Estado:** `DRAFT` → aprobar con `status: APPROVED` antes de iniciar implementación.
> **Ciclo de vida:** DRAFT → APPROVED → IN_PROGRESS → IMPLEMENTED → DEPRECATED

---

## 1. REQUERIMIENTOS

### Descripción
Integración entre el frontend de SeguraX (React + PrimeReact) y el backend API (NestJS + TypeORM). El frontend debe llamar al endpoint POST `/api/v1/cotizaciones` del backend cuando el usuario hace clic en "Cotizar ahora" o "Nueva Cotización", recibir el folio generado y mostrarlo en la interfaz.

### Requerimiento de Negocio
> "Cuando el usuario dé clic en 'Cotizar ahora' o 'Nueva Cotización' en el frontend, se debe llamar al backend para crear una nueva cotización. El backend retornará un folio autogenerado (ej: COT-2024-00042) que debe mostrarse en la pantalla del cotizador."
>
> Stack Frontend: React + TypeScript + PrimeReact + Tailwind CSS
> Stack Backend: NestJS + PostgreSQL + TypeORM
> Comunicación: HTTP REST API + JSON

### Historias de Usuario

#### HU-01: Crear Cotización desde Frontend

```
Como: Usuario del sitio SeguraX
Quiero: Hacer clic en "Cotizar ahora" y que se cree una cotización
Para: Obtener un folio único para mi proceso de cotización

Prioridad: Alta
Estimación: M
Dependencias: SPEC-002 (frontend), SPEC-003 (backend)
Capa: Frontend + Integración
```

#### Criterios de Aceptación — HU-01

**Happy Path**
```gherkin
CRITERIO-1.1: Creación exitosa de cotización desde frontend
Dado que: El usuario está en la homepage o página del cotizador
Cuando: Hace clic en el botón "Cotizar ahora" o "Nueva Cotización"
Entonces: El frontend envía POST http://localhost:3000/api/v1/cotizaciones
Y: El backend responde con 201 y los datos de la cotización
Y: El frontend recibe { id, numeroFolio, estado, fechaCreacion, fechaActualizacion }
Y: Se redirige a la página del cotizador mostrando el folio generado
Y: El usuario ve un mensaje de éxito "Cotización creada: COT-2024-00042"
```

**Loading State**
```gherkin
CRITERIO-1.2: Estado de carga durante la creación
Dado que: El usuario hizo clic en "Cotizar ahora"
Cuando: La petición HTTP está en curso
Entonces: El botón muestra un spinner de carga
Y: El botón está deshabilitado para evitar clicks duplicados
Y: Se muestra un mensaje "Creando cotización..."
```

**Error Path**
```gherkin
CRITERIO-1.3: Error de conexión con backend
Dado que: El backend no está disponible o hay error de red
Cuando: El usuario intenta crear una cotización
Entonces: El frontend captura el error
Y: Muestra un mensaje amigable "No se pudo conectar con el servidor. Intente más tarde."
Y: El botón vuelve a estar habilitado
```

```gherkin
CRITERIO-1.4: Error del backend
Dado que: El backend responde con error 500
Cuando: El usuario intenta crear una cotización
Entonces: El frontend muestra un mensaje "Error al crear la cotización. Contacte al administrador."
Y: Se registra el error en consola para debugging
```

### Reglas de Negocio

1. **Endpoint**: `POST http://localhost:3000/api/v1/cotizaciones`
2. **Sin autenticación**: El backend no requiere token JWT
3. **Request body**: Vacío (no requiere datos)
4. **Response esperada**: HTTP 201 con JSON
5. **Timeout**: 10 segundos máximo para la petición
6. **Reintentos**: No implementar reintentos automáticos en v1
7. **CORS**: El backend debe permitir peticiones desde el frontend (localhost:5173)
8. **Folio mostrado**: Debe mostrarse en formato "COT-YYYY-NNNNN" en la UI

---

## 2. DISEÑO

### Flujo de Integración

```
┌─────────────────┐     POST /api/v1/cotizaciones     ┌─────────────────┐
│                 │ ─────────────────────────────────> │                 │
│    FRONTEND     │                                    │     BACKEND     │
│   (React + TS)  │                                    │   (NestJS +     │
│                 │ <───────────────────────────────── │    TypeORM)     │
│  - Botón "Cotizar"                                    │                 │
│  - Axios/fetch                                        │  - Crea folio   │
│  - Loading state                                      │  - Guarda en DB │
│  - Error handling                                     │  - Retorna 201  │
│  - Redirect                                           │                 │
└─────────────────┘                                    └─────────────────┘
```

### Arquitectura de Integración

```
frontend/src/
├── services/
│   └── cotizacion.service.ts       # HTTP client para backend
├── hooks/
│   └── useCrearCotizacion.ts       # Hook con estado y lógica
└── pages/
    └── CotizadorPage.tsx           # Página actualizada con integración
```

### API de Integración

#### POST http://localhost:3000/api/v1/cotizaciones

**Request:**
```http
POST /api/v1/cotizaciones HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Accept: application/json

{}  // Body vacío
```

**Response 201 Success:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "numeroFolio": "COT-2024-00042",
  "estado": "BORRADOR",
  "fechaCreacion": "2024-01-18T10:30:00.000Z",
  "fechaActualizacion": "2024-01-18T10:30:00.000Z"
}
```

**Response Error:**
```json
{
  "statusCode": 500,
  "message": "Error al crear cotización",
  "error": "Internal Server Error"
}
```

### Modelos de Datos

#### Frontend Interface: Cotizacion
```typescript
// types/cotizacion.types.ts
export interface Cotizacion {
  id: string;
  numeroFolio: string;
  estado: 'BORRADOR' | 'EN_PROCESO' | 'COMPLETADA' | 'CANCELADA';
  fechaCreacion: string;  // ISO 8601
  fechaActualizacion: string;  // ISO 8601
}

export interface CrearCotizacionResponse {
  success: boolean;
  data?: Cotizacion;
  error?: string;
}
```

### Diseño Frontend (Integración)

#### Service: CotizacionService
```typescript
// services/cotizacion.service.ts
import axios, { AxiosInstance } from 'axios';
import { Cotizacion } from '../types/cotizacion.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export class CotizacionService {
  private readonly httpClient: AxiosInstance;

  constructor() {
    this.httpClient = axios.create({
      baseURL: `${API_BASE_URL}/api/v1`,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async crearCotizacion(): Promise<Cotizacion> {
    try {
      const response = await this.httpClient.post('/cotizaciones', {});
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED') {
          throw new Error('No se pudo conectar con el servidor');
        }
        if (error.response?.status === 500) {
          throw new Error('Error interno del servidor');
        }
        throw new Error(error.response?.data?.message || 'Error desconocido');
      }
      throw error;
    }
  }
}

export const cotizacionService = new CotizacionService();
```

#### Hook: useCrearCotizacion
```typescript
// hooks/useCrearCotizacion.ts
import { useState, useCallback } from 'react';
import { cotizacionService } from '../services/cotizacion.service';
import { Cotizacion } from '../types/cotizacion.types';

interface UseCrearCotizacionReturn {
  cotizacion: Cotizacion | null;
  loading: boolean;
  error: string | null;
  crearCotizacion: () => Promise<void>;
  reset: () => void;
}

export function useCrearCotizacion(): UseCrearCotizacionReturn {
  const [cotizacion, setCotizacion] = useState<Cotizacion | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const crearCotizacion = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const nuevaCotizacion = await cotizacionService.crearCotizacion();
      setCotizacion(nuevaCotizacion);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setCotizacion(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setCotizacion(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    cotizacion,
    loading,
    error,
    crearCotizacion,
    reset,
  };
}
```

#### Página Cotizador Actualizada
```typescript
// pages/CotizadorPage.tsx (actualizado)
import { useEffect } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';
import { useCrearCotizacion } from '../hooks/useCrearCotizacion';

export function CotizadorPage() {
  const { cotizacion, loading, error, crearCotizacion } = useCrearCotizacion();

  const handleCrearCotizacion = () => {
    crearCotizacion();
  };

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="shadow-lg">
          <div className="text-center py-8">
            {!cotizacion && !loading && !error && (
              <>
                <h1 className="font-heading text-3xl font-bold text-primary mb-4">
                  Nueva Cotización
                </h1>
                <p className="text-gray-600 mb-6">
                  Haga clic en el botón para generar un nuevo folio de cotización
                </p>
                <Button
                  label="Crear Cotización"
                  icon="pi pi-plus"
                  onClick={handleCrearCotizacion}
                  className="bg-accent border-accent"
                  style={{ backgroundColor: '#C9A84C', borderColor: '#C9A84C' }}
                />
              </>
            )}

            {loading && (
              <div className="flex flex-col items-center gap-4">
                <ProgressSpinner />
                <p className="text-gray-600">Creando cotización...</p>
              </div>
            )}

            {error && (
              <>
                <Message severity="error" text={error} className="mb-4" />
                <Button
                  label="Intentar de nuevo"
                  icon="pi pi-refresh"
                  onClick={handleCrearCotizacion}
                  outlined
                  className="mt-4"
                />
              </>
            )}

            {cotizacion && (
              <>
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                  <i className="pi pi-check text-4xl text-green-500" />
                </div>
                <h2 className="font-heading text-2xl font-bold text-primary mb-2">
                  ¡Cotización Creada!
                </h2>
                <div className="bg-accent/10 rounded-lg p-6 my-6">
                  <p className="text-sm text-gray-600 mb-1">Número de Folio</p>
                  <p className="font-heading text-3xl font-bold text-accent">
                    {cotizacion.numeroFolio}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <p className="font-medium">ID:</p>
                    <p className="font-mono text-xs">{cotizacion.id}</p>
                  </div>
                  <div>
                    <p className="font-medium">Estado:</p>
                    <p className="inline-block px-3 py-1 bg-gray-100 rounded-full">
                      {cotizacion.estado}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
```

### Configuración de Entorno

#### Frontend .env
```bash
# frontend/.env
VITE_API_URL=http://localhost:3000
```

#### Backend CORS (ya configurado)
El backend ya tiene CORS configurado en `main.ts`:
```typescript
app.enableCors({
  origin: ['http://localhost:5173', 'http://localhost:3001'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
});
```

### Arquitectura y Dependencias

**Nuevas dependencias frontend:**
```bash
cd frontend
npm install axios
```

**Estructura de carpetas:**
```
frontend/src/
├── types/
│   └── cotizacion.types.ts       # Interfaces TypeScript
├── services/
│   └── cotizacion.service.ts     # HTTP client
├── hooks/
│   └── useCrearCotizacion.ts     # Hook de negocio
└── pages/
    └── CotizadorPage.tsx         # Actualizado con integración
```

### Notas de Implementación

> **Axios vs Fetch**: Usar Axios para manejo automático de JSON, timeouts y errores de red más amigables.

> **Variables de entorno**: Usar `import.meta.env.VITE_API_URL` para la URL del backend (prefijo VITE_ obligatorio en Vite).

> **Estados de UI**: Implementar loading, error y success states claros para mejor UX.

> **Manejo de errores**: Capturar errores de red (backend caído) vs errores del servidor (500).

> **Type Safety**: Todas las respuestas deben estar tipadas con interfaces TypeScript.

---

## 3. LISTA DE TAREAS

> Checklist accionable para todos los agentes. Marcar cada ítem (`[x]`) al completarlo.

### Frontend

#### Nuevos Archivos
- [ ] Crear `frontend/src/types/cotizacion.types.ts`
- [ ] Crear `frontend/src/services/cotizacion.service.ts`
- [ ] Crear `frontend/src/hooks/useCrearCotizacion.ts`

#### Archivos Modificados
- [ ] Actualizar `frontend/src/pages/CotizadorPage.tsx`
- [ ] Actualizar `frontend/src/App.tsx` (si es necesario)

#### Configuración
- [ ] Crear `frontend/.env` con VITE_API_URL
- [ ] Instalar axios: `npm install axios`

#### Integración con Componentes Existentes
- [ ] Actualizar botón "Cotizar ahora" en HeroSection para usar el hook
- [ ] Actualizar botón "Iniciar cotización" en CTASection para usar el hook

#### Tests Frontend
- [ ] Test: `cotizacion.service` crea cotización correctamente
- [ ] Test: `useCrearCotizacion` maneja loading state
- [ ] Test: `useCrearCotizacion` maneja error de red
- [ ] Test: `CotizadorPage` muestra folio después de crear

### Backend

#### Verificación
- [ ] Verificar que backend está corriendo en puerto 3000
- [ ] Verificar que CORS permite localhost:5173
- [ ] Ejecutar migraciones si no se han ejecutado

### QA
- [ ] Ejecutar skill `/gherkin-case-generator` → criterios CRITERIO-1.1, 1.2, 1.3, 1.4
- [ ] Ejecutar skill `/risk-identifier` → clasificación ASD de riesgos
- [ ] Probar flujo completo: clic → POST → 201 → mostrar folio
- [ ] Probar error: backend caído → mensaje amigable
- [ ] Validar que el folio mostrado coincide con el de la respuesta
- [ ] Actualizar estado spec: `status: IMPLEMENTED`
