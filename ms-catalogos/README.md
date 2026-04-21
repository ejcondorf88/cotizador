# MS-Catalogos

Microservicio de Catálogos para el sistema SeguraX Cotizador.

## Descripción

Este microservicio gestiona los catálogos maestros del sistema:
- **Giros**: Actividades económicas/negocios (reemplaza el mock de activities)
- **Agentes**: Agentes de seguros (reemplaza campo libre agentKey)
- **Suscriptores**: Suscriptores de pólizas (reemplaza campo libre subscriber)
- **Oficinas**: Oficinas/regiones (reemplaza campo libre office)

## Arquitectura

N-Capas (Ports & Adapters / Hexagonal):

```
src/
├── domain/          # Entidades puras + Puertos (interfaces)
├── application/     # Casos de uso + DTOs
├── infrastructure/  # TypeORM entities + Adapters + Mappers
└── presentation/    # Controllers + Modules
```

## Instalación

```bash
npm install
```

## Configuración

Crear archivo `.env`:

```env
PORT=3001
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=segurax
```

## Scripts Disponibles

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod

# Migraciones
npm run migration:run       # Ejecutar migraciones
npm run migration:generate  # Generar migración desde entidades
npm run migration:revert    # Revertir última migración

# Testing
npm run test
npm run test:cov
```

## Endpoints API

Base URL: `http://localhost:3001/catalogos`

### Giros
```
GET    /catalogos/giros              # Listar giros
GET    /catalogos/giros/buscar?q=    # Buscar por descripción/clave
GET    /catalogos/giros/:id          # Obtener por ID
POST   /catalogos/giros              # Crear giro
PUT    /catalogos/giros/:id          # Actualizar giro
DELETE /catalogos/giros/:id          # Eliminar giro (soft)
```

### Agentes
```
GET    /catalogos/agentes            # Listar agentes
GET    /catalogos/agentes/buscar?q=  # Buscar por nombre/código
GET    /catalogos/agentes/:id        # Obtener por ID
POST   /catalogos/agentes            # Crear agente
PUT    /catalogos/agentes/:id        # Actualizar agente
DELETE /catalogos/agentes/:id        # Eliminar agente (soft)
```

### Suscriptores
```
GET    /catalogos/suscriptores            # Listar suscriptores
GET    /catalogos/suscriptores/buscar?q=  # Buscar por nombre/código
GET    /catalogos/suscriptores/:id        # Obtener por ID
POST   /catalogos/suscriptores            # Crear suscriptor
PUT    /catalogos/suscriptores/:id        # Actualizar suscriptor
DELETE /catalogos/suscriptores/:id        # Eliminar suscriptor (soft)
```

### Oficinas
```
GET    /catalogos/oficinas           # Listar oficinas
GET    /catalogos/oficinas/:id       # Obtener por ID
POST   /catalogos/oficinas           # Crear oficina
PUT    /catalogos/oficinas/:id       # Actualizar oficina
DELETE /catalogos/oficinas/:id       # Eliminar oficina (soft)
```

## Documentación Swagger

Disponible en: `http://localhost:3001/api-docs`

## Base de Datos

### Schema: `catalog`

Las tablas se crean en el schema `catalog` separado del resto de la base de datos.

### Tablas:
- `catalog.giros`: Giros de negocio
- `catalog.agentes`: Agentes de seguros
- `catalog.suscriptores`: Suscriptores
- `catalog.oficinas`: Oficinas

## Gateway Integration

El Gateway debe configurarse para enrutar:
- `/api/v1/catalogos/**` → `ms-catalogos:3001`

## Docker

```bash
# Build
docker build -t ms-catalogos .

# Run
docker run -p 3001:3001 ms-catalogos
```
