# 🌐 SeguraX Frontend

Aplicación React para Cotizador SeguraX. Wizard de 6 pasos para crear cotizaciones de seguros de daños para empresas.

> **SPEC:** [SPEC-024 - Frontend Cotizador](../.github/specs/frontend-cotizador-segurax.spec.md)  
> **Estado:** IMPLEMENTED ✅  
> **URL Local:** http://localhost:5173  
> **Gateway:** http://localhost:8080/api/v1

## 🛠️ Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React | 19.x | Framework UI |
| TypeScript | ~6.x | Lenguaje tipado |
| Tailwind CSS | 3.4.x | Estilos utilitarios |
| Vite | 8.x | Build tool & dev server |
| React Router | 7.x | Navegación SPA |
| React Query (TanStack) | 5.x | Data fetching & caching |
| Zustand | 5.x | State management local |
| PrimeReact | 10.x | Componentes UI avanzados |
| PrimeIcons | 7.x | Iconos integrados |
| Axios | 1.x | Cliente HTTP |
| Zod | 4.x | Validación de schemas |
| React Hook Form | 5.x | Manejo de formularios |

### Arquitectura Frontend

```
┌─────────────────────────────────────────────────────────────┐
│                    CAPA DE PRESENTACIÓN                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │  Pages   │  │Components│  │   UI     │  │  Hooks   │      │
│  │  (Views) │  │ (Logic)  │  │(Present) │  │ (State)  │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
├─────────────────────────────────────────────────────────────┤
│                    CAPA DE SERVICIOS                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                    │
│  │  Axios   │  │Services  │  │   DTOs   │                    │
│  │ Config   │  │  (API)   │  │ (Types)  │                    │
│  └──────────┘  └──────────┘  └──────────┘                    │
├─────────────────────────────────────────────────────────────┤
│                         API GATEWAY                          │
│              http://localhost:8080/api/v1/...                │
└─────────────────────────────────────────────────────────────┘
```

## Características

- 🧙‍♂️ **Wizard de 6 pasos** - Flujo guiado paso a paso
- 🏢 **Captura de datos de empresa** - RFC, giro, contacto
- 📍 **Selección de ubicaciones** - 1 a 100 inmuebles por cotización
- 🏠 **Formularios dinámicos** - Datos de construcción y valores asegurados
- ☂️ **Selección de coberturas** - Toggles para activar/desactivar
- 📊 **Resumen y cálculo** - Prima estimada en tiempo real
- 📄 **Generación de documentos** - PDF de cotización

## Instalación

```bash
# Clonar y entrar al directorio
cd frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con URL del gateway
```

## 🚀 Comandos Disponibles

```bash
# Desarrollo con hot reload (puerto 5173)
npm run dev

# Build de producción (compila TypeScript + Vite)
npm run build

# Preview de producción local (sirve la carpeta dist/)
npm run preview

# Linting con ESLint
npm run lint
```

### Comandos de Desarrollo Detallados

| Comando | Descripción | Puerto/Output |
|---------|-------------|---------------|
| `npm run dev` | Servidor de desarrollo Vite con HMR | http://localhost:5173 |
| `npm run build` | Compila TypeScript y genera build de producción | `./dist/` |
| `npm run preview` | Previsualiza el build de producción localmente | http://localhost:4173 |
| `npm run lint` | Ejecuta ESLint para detectar problemas de código | - |

## Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_API_URL` | URL base de la API (vía Gateway) | `http://localhost:8080/api/v1` |

> **Nota**: Las variables de Vite deben comenzar con `VITE_` para ser expuestas al cliente.

## 📁 Estructura del Proyecto

```
frontend/
├── public/                    # Assets estáticos
│   └── assets/
│       └── images/
├── src/
│   ├── main.tsx              # Entry point de React
│   ├── App.tsx               # Router + Providers
│   │
│   ├── routes/               # Configuración de rutas
│   │   └── AppRouter.tsx
│   │
│   ├── pages/                # Vistas/Páginas del wizard
│   │   ├── HomePage/
│   │   │   └── HomePage.tsx
│   │   ├── QuotePage/
│   │   │   └── QuotePage.tsx
│   │   ├── WizardPage/       # Wizard de 6 pasos
│   │   │   ├── Step1GeneralInfo/
│   │   │   ├── Step2Locations/
│   │   │   ├── Step3Properties/
│   │   │   ├── Step4Coverages/
│   │   │   ├── Step5Summary/
│   │   │   └── Step6Success/
│   │   └── CatalogPage/
│   │
│   ├── components/           # Componentes reutilizables
│   │   ├── common/           # UI genérica (Button, Input, Modal)
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   ├── Select/
│   │   │   ├── Modal/
│   │   │   └── Table/
│   │   ├── quote/            # Dominio: Cotizaciones
│   │   │   ├── QuoteForm/
│   │   │   ├── QuoteList/
│   │   │   └── QuoteCard/
│   │   ├── property/         # Dominio: Propiedades
│   │   │   ├── PropertyForm/
│   │   │   ├── PropertyList/
│   │   │   └── PropertyCard/
│   │   ├── coverage/         # Dominio: Coberturas
│   │   │   ├── CoverageSelector/
│   │   │   └── CoverageSummary/
│   │   └── catalog/          # Dominio: Catálogos (ms-catalogos)
│   │       ├── GiroSelector/
│   │       ├── AgenteSelector/
│   │       └── OficinaSelector/
│   │
│   ├── hooks/                # Custom React hooks
│   │   ├── useQuotes.ts
│   │   ├── useProperties.ts
│   │   ├── useCoverages.ts
│   │   ├── useCatalogs.ts      # Integración con ms-catalogos
│   │   └── useAuth.ts
│   │
│   ├── services/             # Servicios API
│   │   ├── apiClient.ts      # Config Axios + interceptores
│   │   ├── quoteService.ts
│   │   ├── propertyService.ts
│   │   ├── coverageService.ts
│   │   └── catalogService.ts   # Consumo de ms-catalogos
│   │
│   ├── types/                # Definiciones TypeScript
│   │   ├── quote.types.ts
│   │   ├── property.types.ts
│   │   ├── coverage.types.ts
│   │   ├── catalog.types.ts    # Tipos de ms-catalogos
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
│   └── __tests__/            # Tests (planificado)
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
src/
├── assets/              # Imágenes, logos, iconos
│   └── logo.png
├── components/          # Componentes reutilizables
│   ├── common/         # Button, Input, Card (wrappers)
│   └── wizard/         # Componentes específicos del wizard
├── pages/              # Páginas del wizard (6 pasos)
│   ├── Step1GeneralInfo/
│   ├── Step2Locations/
│   ├── Step3Properties/
│   ├── Step4Coverages/
│   ├── Step5Summary/
│   └── Step6Success/
├── hooks/              # Custom React hooks
│   ├── useQuotes.ts
│   └── useProperties.ts
├── services/           # API calls
│   └── api.ts
├── store/              # Estado global (Zustand)
│   ├── quoteStore.ts
│   └── wizardStore.ts
├── types/              # TypeScript interfaces
│   ├── quote.types.ts
│   └── property.types.ts
└── utils/              # Utilidades
    └── formatters.ts
```

## Wizard de 6 Pasos

### Paso 1: Datos Generales
- Nombre de la empresa
- RFC
- Giro de la empresa
- Clave de agente
- Datos de contacto
- Vigencia de la póliza

### Paso 2: Ubicaciones
- Selección de cantidad de inmuebles (1-100)
- Layout visual de tarjetas

### Paso 3: Datos de Propiedades (por cada una)
- **Ubicación**: Calle, colonia, ciudad, estado, CP
- **Construcción**: Tipo, año, niveles, uso
- **Valores asegurados**:
  - Edificio
  - Contenido
  - Equipos electrónicos
  - Maquinaria
  - Mercancías en stock
- Indicador de completitud (%)

### Paso 4: Coberturas
- **Obligatorias** (siempre activas):
  - Incendio 🔥
  - Daños por Catastrofes Naturales 🌪️
- **Opcionales** (toggle):
  - Cristales y anexos 🪟
  - Daños por agua 💧
  - Robo y/o asalto 🦹
  - Responsabilidad Civil
  - Gastos de transporte
- Cálculo de prima basado en tasas

### Paso 5: Resumen
- Datos del asegurado
- Lista de propiedades con estatus
- Coberturas seleccionadas
- Prima total estimada
- Botón: Generar cotización

### Paso 6: Éxito
- Confirmación de creación
- Folio generado
- Opciones: Descargar PDF, Enviar por email, Nueva cotización

## Diseño UI

### Paleta de Colores

| Color | Hex | Uso |
|-------|-----|-----|
| Dorado primario | `#D4AF37` | Botones primarios, énfasis |
| Negro | `#1F2937` | Texto principal, headers |
| Gris oscuro | `#374151` | Subtítulos |
| Gris medio | `#6B7280` | Texto secundario |
| Blanco | `#FFFFFF` | Fondos |

### Componentes

- **Inputs**: Tailwind + PrimeReact InputText
- **Botones**: Custom con Tailwind (primario: dorado, secundario: gris)
- **Tarjetas**: Tailwind shadow + border-radius
- **Toggles**: PrimeReact ToggleButton
- **Selects**: PrimeReact Dropdown

## Flujo de Datos

```
Usuario
   │
   ▼
┌────────────────┐
│  Wizard Store  │◄── Estado del wizard (paso actual, datos temporales)
│  (Zustand)     │
└───────┬────────┘
        │
        ▼
┌────────────────┐
│  Quote Store   │◄── Cotización actual, propiedades, coberturas
│  (Zustand)     │
└───────┬────────┘
        │
        ▼
┌────────────────┐
│  React Query   │◄── Cache y sincronización con servidor
│                │
└───────┬────────┘
        │
        ▼
┌────────────────┐
│  API Service   │◄── Axios/Fetch con interceptors
│                │
└───────┬────────┘
        │
        ▼
    API Gateway
```

## API Integration

### Endpoints Principales

```typescript
// Quotes
GET    /api/v1/quotes              // Listar
POST   /api/v1/quotes              // Crear
GET    /api/v1/quotes/:id          // Obtener
PATCH  /api/v1/quotes/:id          // Actualizar

// Properties
GET    /api/v1/quotes/:quoteId/properties
POST   /api/v1/quotes/:quoteId/properties/bulk
PATCH  /api/v1/properties/:id
DELETE /api/v1/quotes/:quoteId/properties
```

## 🐳 Docker

El frontend usa un **Dockerfile multi-stage optimizado** con las siguientes características de seguridad:

- ✅ **Multi-stage build**: Separación de build y producción
- ✅ **Usuario no-root**: Ejecución con usuario no privilegiado (UID 1001)
- ✅ **Labels OCI**: Metadata estándar para trazabilidad
- ✅ **Puerto no-privilegiado**: Puerto 8080 (no requiere root)

### Comandos Docker

```bash
# Build
docker build -t frontend .

# Run (puerto 8080 - no privilegiado)
docker run -p 8080:8080 frontend

# Development con Docker Compose (desde raíz)
docker-compose up frontend
```

### Dockerfile Multi-Stage (Producción)

```dockerfile
# ============================================================================
# Stage 1: Builder
# ============================================================================
FROM node:20-alpine AS builder

# Create non-root user
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies (includes devDependencies for build)
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Build application
RUN npm run build

# Change permissions
RUN chown -R appuser:appgroup /app

# ============================================================================
# Stage 2: Production (Nginx)
# ============================================================================
FROM nginx:1.25-alpine AS production

# Metadata labels (OCI standard)
LABEL org.opencontainers.image.title="frontend"
LABEL org.opencontainers.image.description="Frontend React - SeguraX Cotizador"
LABEL org.opencontainers.image.version="1.0.0"
LABEL org.opencontainers.image.authors="DevOps Team"

# Create non-root user for Nginx
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/conf.d/default.conf

# Copy static files from builder
COPY --from=builder --chown=appuser:appgroup /app/dist /usr/share/nginx/html

# Create directories for logs and cache
RUN mkdir -p /var/cache/nginx /var/log/nginx /tmp/nginx && \
    chown -R appuser:appgroup /var/cache/nginx /var/log/nginx /tmp/nginx /usr/share/nginx/html && \
    chmod -R 755 /var/cache/nginx /var/log/nginx /tmp/nginx /usr/share/nginx/html

# Change Nginx configuration to use non-privileged port
RUN sed -i 's/listen 80/listen 8080/g' /etc/nginx/conf.d/default.conf && \
    sed -i 's/user nginx/user appuser/g' /etc/nginx/nginx.conf

# Change user
USER appuser

# Expose non-privileged port
EXPOSE 8080

# Start command
CMD ["nginx", "-g", "daemon off;"]
```

### Verificación de Seguridad

Después de construir la imagen, verificar que ejecuta como usuario no-root:

```bash
# Verificar usuario no-root (debe mostrar: uid=1001(appuser))
docker run --rm frontend id

# Verificar que NO tiene HEALTHCHECK
docker inspect frontend --format='{{.Config.Healthcheck}}'
# Debe retornar: <no value>

# Verificar labels OCI
docker inspect frontend --format='{{.Config.Labels}}'
```

### Comparativa de Mejoras

| Aspecto | Antes | Después |
|---------|-------|---------|
| Multi-stage | 2 stages | 2 stages (optimizado) |
| Usuario | root | appuser (UID 1001) |
| Puerto | 80 (privilegiado) | 8080 (no privilegiado) |
| Labels OCI | No | Sí |
| HEALTHCHECK | Sí | No (según requerimiento) |

## 🧪 Testing

### Estado Actual

> **Nota:** Los tests automatizados están planificados para futuras fases del proyecto.

```bash
# Tests unitarios (planificado - no disponible aún)
# npm run test

# Tests E2E (planificado - no disponible aún)
# npm run test:e2e
```

### Integración con Tests E2E

El frontend es el objetivo de las pruebas E2E ubicadas en el directorio `../e2e/`:

```bash
# Ejecutar tests E2E (desde el directorio e2e/)
cd ../e2e
mvn clean verify

# Ejecutar solo el happy path
mvn clean verify -Dcucumber.filter.tags="@happy-path"

# Ejecutar en modo headless (CI/CD)
mvn clean verify -Dheadless.mode=true
```

### Testing Manual durante Desarrollo

```bash
# Modo desarrollo con hot reload
npm run dev

# Verificar build de producción
npm run build && npm run preview

# Verificar linting
npm run lint
```

> 📖 **Documentación E2E:** Ver [e2e/README.md](../e2e/README.md) para más detalles sobre la suite de tests Serenity BDD.

## Desarrollo Local

```bash
# Terminal 1: Backend
cd ../ms-core && npm run start:dev

# Terminal 2: Gateway
cd ../ms-gateway && mvn spring-boot:run

# Terminal 3: Frontend (este directorio)
npm run dev

# Acceso
Frontend: http://localhost:5173
Gateway: http://localhost:8080
```

## Licencia

MIT License
