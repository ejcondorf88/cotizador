# Backend SeguraX - Cotizador API

Backend API para el cotizador de SeguraX. Implementado con **NestJS**, **Arquitectura Hexagonal**, **TypeORM** y **PostgreSQL**.

## 🏗 Arquitectura Hexagonal

```
src/
├── domain/              # Entidades puras, contratos (puertos)
├── application/         # Casos de uso, DTOs
├── infrastructure/      # Adaptadores, entidades TypeORM, mappers
└── presentation/        # Controllers HTTP, módulos NestJS
```

## 🚀 Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de PostgreSQL

# Ejecutar migraciones
npm run migration:run

# Iniciar en modo desarrollo
npm run start:dev
```

## 📚 API Endpoints

### Crear Cotización
```bash
POST /api/v1/cotizaciones
```

**Request:** Vacío (no requiere body)

**Response 201:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "numeroFolio": "COT-2024-00001",
  "estado": "BORRADOR",
  "fechaCreacion": "2024-01-18T10:30:00.000Z",
  "fechaActualizacion": "2024-01-18T10:30:00.000Z"
}
```

## 🗄 Base de Datos

### Tabla: cotizaciones

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | PK, auto-generado |
| numero_folio | VARCHAR(20) | Único, formato COT-YYYY-NNNNN |
| estado | VARCHAR(20) | DEFAULT 'BORRADOR' |
| fecha_creacion | TIMESTAMP | Auto |
| fecha_actualizacion | TIMESTAMP | Auto |

## 🧪 Testing

```bash
# Tests unitarios
npm test

# Tests con coverage
npm run test:cov

# Tests e2e
npm run test:e2e
```

## 📝 Migraciones

```bash
# Generar migración desde entidades
npm run migration:generate -- -n NombreMigracion

# Ejecutar migraciones
npm run migration:run

# Revertir última migración
npm run migration:revert
```

## 📦 Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run start:dev` | Modo desarrollo con watch |
| `npm run build` | Build para producción |
| `npm run start:prod` | Iniciar en producción |
| `npm test` | Tests unitarios |
| `npm run lint` | Lint con ESLint |
