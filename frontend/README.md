# SeguraX Frontend

Aplicación React para Cotizador SeguraX. Wizard de 6 pasos para crear cotizaciones de seguros de daños.

## Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React | 19.x | Framework UI |
| TypeScript | ~6.x | Lenguaje tipado |
| Tailwind CSS | 3.4.x | Estilos utilitarios |
| Vite | 8.x | Build tool & dev server |
| React Router | 7.x | Navegación SPA |
| React Query | 5.x | Data fetching & caching |
| Zustand | 5.x | State management |
| PrimeReact | 10.x | Componentes UI |

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

## Comandos Disponibles

```bash
# Desarrollo con hot reload (puerto 5173)
npm run dev

# Build de producción	npm run build

# Preview de producción local
npm run preview

# Linting
npm run lint
```

## Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_API_URL` | URL base de la API (vía Gateway) | `http://localhost:8080/api/v1` |

> **Nota**: Las variables de Vite deben comenzar con `VITE_` para ser expuestas al cliente.

## Estructura del Proyecto

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

## Docker

```bash
# Build
docker build -t frontend .

# Run
docker run -p 80:80 frontend

# Development con Docker Compose (desde raíz)
docker-compose up frontend
```

### Dockerfile (Producción)

```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage (Nginx)
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

## Testing

```bash
# Unit tests (cuando se implementen)
npm run test

# E2E tests (cuando se implementen)
npm run test:e2e
```

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
