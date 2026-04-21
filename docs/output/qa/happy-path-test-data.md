# Datos de Prueba - Happy Path E2E (SPEC-021)

## Información General

| Campo | Valor |
|-------|-------|
| **Spec ID** | SPEC-021 |
| **Feature** | happy-path-e2e-serenity |
| **Fecha** | 2026-04-21 |
| **Autor** | QA Lead - ASDD |
| **Estado** | DRAFT |

---

## Resumen de Datos de Prueba

Este documento define los datos de prueba sintéticos para el Happy Path E2E del cotizador SeguraX. Todos los datos son ficticios y no corresponden a información real.

---

## Datos de Configuración del Ambiente

### URLs del Sistema

| Componente | URL | Puerto |
|-------------|-----|--------|
| Frontend | http://localhost:5173 | 5173 |
| Backend (API) | http://localhost:3000 | 3000 |
| Gateway (alternativo) | http://localhost:8080 | 8080 |

### Configuración Serenity

```properties
# serenity.properties
webdriver.driver=chrome
webdriver.base.url=http://localhost:5173
serenity.project.name=SeguraX - Happy Path E2E Tests
serenity.take.screenshots=FOR_EACH_ACTION
serenity.timeout=10
```

---

## Datos de Inmuebles de Prueba

### Inmueble 1: Oficinas Corporativas

#### Información General

| Campo | Valor |
|-------|-------|
| **Nombre** | Oficinas Corporativas |
| **Alias** | inmueble_oficinas_corporativas |
| **Descripción** | Oficinas principales de la empresa |

#### Dirección

| Campo | Valor |
|-------|-------|
| **Calle** | Av. Reforma 100 |
| **Colonia** | Juárez |
| **Ciudad** | Ciudad de México |
| **Estado** | CDMX |
| **Código Postal** | 06600 |
| **País** | México |

#### Características Constructivas

| Campo | Valor |
|-------|-------|
| **Tipo Constructivo** | Concreto |
| **Año de Construcción** | 2015 |
| **Niveles** | 5 |
| **Uso** | Oficina |
| **Giro** | Servicios de Tecnología |

#### Garantías y Suma Asegurada

| Concepto | Valor | Formato Moneda |
|----------|-------|------------------|
| **Garantía Edificio** | 5000000 | $5,000,000.00 |
| **Garantía Contenidos** | 2000000 | $2,000,000.00 |
| **Subtotal Inmueble 1** | 7000000 | $7,000,000.00 |

#### Datos para Formulario Web

```json
{
  "nombre": "Oficinas Corporativas",
  "calle": "Av. Reforma 100",
  "cp": "06600",
  "estado": "CDMX",
  "ciudad": "Ciudad de México",
  "colonia": "Juárez",
  "tipo_constructivo": "Concreto",
  "año_construccion": "2015",
  "niveles": "5",
  "uso": "Oficina",
  "giro": "Servicios de Tecnología",
  "garantia_edificio": "5000000",
  "garantia_contenidos": "2000000"
}
```

---

### Inmueble 2: Sucursal Norte

#### Información General

| Campo | Valor |
|-------|-------|
| **Nombre** | Sucursal Norte |
| **Alias** | inmueble_sucursal_norte |
| **Descripción** | Sucursal comercial en zona norte |

#### Dirección

| Campo | Valor |
|-------|-------|
| **Calle** | Av. Insurgentes 500 |
| **Colonia** | Del Valle |
| **Ciudad** | Ciudad de México |
| **Estado** | CDMX |
| **Código Postal** | 03100 |
| **País** | México |

#### Características Constructivas

| Campo | Valor |
|-------|-------|
| **Tipo Constructivo** | Acero |
| **Año de Construcción** | 2018 |
| **Niveles** | 3 |
| **Uso** | Comercial |
| **Giro** | Tienda de Electrónicos |

#### Garantías y Suma Asegurada

| Concepto | Valor | Formato Moneda |
|----------|-------|------------------|
| **Garantía Edificio** | 3000000 | $3,000,000.00 |
| **Garantía Contenidos** | 1500000 | $1,500,000.00 |
| **Subtotal Inmueble 2** | 4500000 | $4,500,000.00 |

#### Datos para Formulario Web

```json
{
  "nombre": "Sucursal Norte",
  "calle": "Av. Insurgentes 500",
  "cp": "03100",
  "estado": "CDMX",
  "ciudad": "Ciudad de México",
  "colonia": "Del Valle",
  "tipo_constructivo": "Acero",
  "año_construccion": "2018",
  "niveles": "3",
  "uso": "Comercial",
  "giro": "Tienda de Electrónicos",
  "garantia_edificio": "3000000",
  "garantia_contenidos": "1500000"
}
```

---

## Consolidación de Suma Asegurada

| Inmueble | Edificio | Contenidos | Subtotal |
|----------|----------|------------|----------|
| Oficinas Corporativas | $5,000,000.00 | $2,000,000.00 | $7,000,000.00 |
| Sucursal Norte | $3,000,000.00 | $1,500,000.00 | $4,500,000.00 |
| **TOTAL** | **$8,000,000.00** | **$3,500,000.00** | **$11,500,000.00** |

**Valor Esperado de Suma Asegurada Total:** `$ 11,500,000.00`

---

## Coberturas de Prueba

### Coberturas Obligatorias (Siempre Activas)

| Cobertura | Descripción | Estado Esperado |
|-----------|-------------|-----------------|
| Incendio | Daños por incendio, rayo y explosión | Activa |
| CAT | Catastrofes naturales (sismo, huracán) | Activa |

### Coberturas Opcionales (Activar en Tests)

| Cobertura | Descripción | Estado Inicial | Estado Final |
|-----------|-------------|----------------|--------------|
| Cristales | Rotura de cristales y vidrios | Desactivada | Activa |
| Daños por Agua | Daños por inundación o fuga | Desactivada | Activa |
| Robo | Robo y/o hurto | Desactivada | Activa |
| Remoción | Gastos de remoción de escombros | Desactivada | Desactivada |
| Equipo Electrónico | Daños a equipos electrónicos | Desactivada | Desactivada |

### Resumen de Coberturas Activas (Happy Path)

```
┌─────────────────────────────────────────────────┐
│          COBERTURAS ACTIVADAS                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  OBLIGATORIAS (2):                              │
│  ✓ Incendio                                    │
│  ✓ CAT                                         │
│                                                 │
│  OPCIONALES (3):                                │
│  ✓ Cristales                                   │
│  ✓ Daños por Agua                              │
│  ✓ Robo                                        │
│                                                 │
│  TOTAL: 5 coberturas activas                    │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## Datos de Cotización Esperados

### Formato de Folio

| Componente | Formato | Ejemplo |
|------------|---------|---------|
| Prefijo | COT- | COT- |
| Año | YYYY | 2025 |
| Número Secuencial | NNNNN | 00001 |
| **Folio Completo** | COT-YYYY-NNNNN | COT-2025-00001 |

### Estados de Cotización

| Estado | Color Badge | Descripción |
|--------|-------------|-------------|
| BORRADOR | Gris | Cotización creada, pendiente de completar |
| EN_PROGRESO | Azul | Datos de inmuebles en proceso |
| PENDIENTE_COBERTURAS | Amarillo | Inmuebles completos, esperando coberturas |
| COMPLETADA | Verde | Cotización finalizada |

### Datos del Flujo Completo

```json
{
  "cotizacion": {
    "folio_esperado_formato": "COT-YYYY-NNNNN",
    "estado_inicial": "BORRADOR",
    "estado_final_esperado": "PENDIENTE_RESUMEN",
    "cantidad_inmuebles": 2,
    "suma_asegurada_total": 11500000
  },
  "inmuebles": [
    {
      "indice": 1,
      "nombre": "Oficinas Corporativas",
      "estado_final": "COMPLETADO",
      "suma_asegurada": 7000000
    },
    {
      "indice": 2,
      "nombre": "Sucursal Norte",
      "estado_final": "COMPLETADO",
      "suma_asegurada": 4500000
    }
  ],
  "coberturas": {
    "obligatorias_activas": 2,
    "opcionales_activas": 3,
    "total_activas": 5
  }
}
```

---

## Datos para Selenium / Screenplay

### Selectores de Prueba (data-testid)

| Elemento | data-testid | Tipo |
|----------|-------------|------|
| Botón Cotizar Ahora | `btn-cotizar-ahora` | button |
| Botón Crear Cotización | `btn-crear-cotizacion` | button |
| Campo Folio | `txt-folio-cotizacion` | text |
| Badge Estado | `badge-estado-cotizacion` | span |
| Input Cantidad Inmuebles | `input-cantidad-inmuebles` | number |
| Botón Continuar | `btn-continuar` | button |
| Ficha Inmueble 1 | `ficha-inmueble-1` | div |
| Ficha Inmueble 2 | `ficha-inmueble-2` | div |
| Botón Completar Datos (1) | `btn-completar-inmueble-1` | button |
| Botón Completar Datos (2) | `btn-completar-inmueble-2` | button |
| Input Nombre Inmueble | `input-nombre-inmueble` | text |
| Input Calle | `input-calle` | text |
| Input CP | `input-codigo-postal` | text |
| Select Estado | `select-estado` | select |
| Select Tipo Constructivo | `select-tipo-constructivo` | select |
| Input Garantía Edificio | `input-garantia-edificio` | number |
| Input Garantía Contenidos | `input-garantia-contenidos` | number |
| Botón Guardar Inmueble | `btn-guardar-inmueble` | button |
| Botón Finalizar | `btn-finalizar-inmuebles` | button |
| Sección Coberturas Obligatorias | `seccion-coberturas-obligatorias` | div |
| Sección Coberturas Opcionales | `seccion-coberturas-opcionales` | div |
| Toggle Cobertura Cristales | `toggle-cobertura-cristales` | checkbox |
| Toggle Cobertura Agua | `toggle-cobertura-danos-agua` | checkbox |
| Toggle Cobertura Robo | `toggle-cobertura-robo` | checkbox |
| Contador Total Coberturas | `contador-total-coberturas` | span |
| Botón Continuar Coberturas | `btn-continuar-coberturas` | button |

---

## Validaciones de Datos

### Reglas de Validación por Campo

| Campo | Tipo | Requerido | Min | Max | Patrón |
|-------|------|-----------|-----|-----|--------|
| nombre | string | Sí | 3 | 100 | Alfanumérico |
| calle | string | Sí | 5 | 200 | Texto libre |
| cp | string | Sí | 5 | 5 | ^\d{5}$ |
| estado | string | Sí | - | - | Lista valores |
| ciudad | string | Sí | 3 | 100 | Texto |
| colonia | string | Sí | 3 | 100 | Texto |
| tipo_constructivo | string | Sí | - | - | Concreto/Acero/Mampostería |
| año_construccion | number | Sí | 1900 | 2026 | Entero |
| niveles | number | Sí | 1 | 100 | Entero |
| uso | string | Sí | - | - | Lista valores |
| giro | string | Sí | 3 | 100 | Texto |
| garantia_edificio | number | Sí | 1 | - | Moneda |
| garantia_contenidos | number | No | 0 | - | Moneda |

---

## Datos para API REST (Backend)

### Request: Crear Cotización

```http
POST /api/v1/cotizaciones
Content-Type: application/json

{
  "agenteId": "test-agent-001",
  "sucursalId": "sucursal-cdmz-001"
}
```

### Response Esperado

```json
{
  "id": "uuid-generado",
  "folio": "COT-2025-00001",
  "estado": "BORRADOR",
  "fechaCreacion": "2025-01-21T10:30:00Z",
  "agenteId": "test-agent-001",
  "sumaAseguradaTotal": 0
}
```

### Request: Crear Inmuebles (Bulk)

```http
POST /api/v1/quotes/{quoteId}/properties/bulk
Content-Type: application/json

{
  "cantidad": 2
}
```

### Request: Actualizar Inmueble

```http
PATCH /api/v1/properties/{propertyId}
Content-Type: application/json

{
  "nombre": "Oficinas Corporativas",
  "direccion": {
    "calle": "Av. Reforma 100",
    "cp": "06600",
    "estado": "CDMX",
    "ciudad": "Ciudad de México",
    "colonia": "Juárez"
  },
  "caracteristicas": {
    "tipoConstructivo": "Concreto",
    "añoConstruccion": 2015,
    "niveles": 5,
    "uso": "Oficina",
    "giro": "Servicios de Tecnología"
  },
  "garantias": {
    "edificio": 5000000,
    "contenidos": 2000000
  }
}
```

### Request: Guardar Coberturas

```http
PATCH /api/v1/quotes/{quoteId}/coverages
Content-Type: application/json

{
  "coberturas": [
    { "tipo": "OBLIGATORIA", "nombre": "Incendio", "activa": true },
    { "tipo": "OBLIGATORIA", "nombre": "CAT", "activa": true },
    { "tipo": "OPCIONAL", "nombre": "Cristales", "activa": true },
    { "tipo": "OPCIONAL", "nombre": "Daños por Agua", "activa": true },
    { "tipo": "OPCIONAL", "nombre": "Robo", "activa": true }
  ]
}
```

---

## Datos para Asserts en Tests

### Asserts de UI

```java
// Suma asegurada total
assertThat(laSumaAseguradaTotal()).isEqualTo("$ 11,500,000.00");

// Estados de inmuebles
assertThat(elEstadoDelInmueble(1)).isEqualTo("COMPLETADO");
assertThat(elEstadoDelInmueble(2)).isEqualTo("COMPLETADO");

// Coberturas
assertThat(laCantidadDeCoberturasObligatorias()).isEqualTo(2);
assertThat(laCantidadDeCoberturasOpcionales()).isEqualTo(3);
assertThat(elTotalDeCoberturas()).isEqualTo(5);

// Folio
assertThat(elFolio()).matches("COT-\\d{4}-\\d{5}");
assertThat(elEstadoDeLaCotizacion()).isEqualTo("BORRADOR");
```

---

## Archivos de Datos Externos

### CSV para Data-Driven Testing

```csv
nombre,calle,cp,estado,ciudad,colonia,tipo_constructivo,año_construccion,niveles,uso,giro,garantia_edificio,garantia_contenidos
Oficinas Corporativas,Av. Reforma 100,06600,CDMX,Ciudad de México,Juárez,Concreto,2015,5,Oficina,Servicios de Tecnología,5000000,2000000
Sucursal Norte,Av. Insurgentes 500,03100,CDMX,Ciudad de México,Del Valle,Acero,2018,3,Comercial,Tienda de Electrónicos,3000000,1500000
```

### JSON para Fixtures

```json
{
  "happyPathData": {
    "inmuebles": [
      {
        "id": "inmueble_001",
        "nombre": "Oficinas Corporativas",
        "direccion": {
          "calle": "Av. Reforma 100",
          "colonia": "Juárez",
          "ciudad": "Ciudad de México",
          "estado": "CDMX",
          "cp": "06600"
        },
        "caracteristicas": {
          "tipoConstructivo": "Concreto",
          "añoConstruccion": 2015,
          "niveles": 5,
          "uso": "Oficina",
          "giro": "Servicios de Tecnología"
        },
        "garantias": {
          "edificio": 5000000,
          "contenidos": 2000000
        }
      },
      {
        "id": "inmueble_002",
        "nombre": "Sucursal Norte",
        "direccion": {
          "calle": "Av. Insurgentes 500",
          "colonia": "Del Valle",
          "ciudad": "Ciudad de México",
          "estado": "CDMX",
          "cp": "03100"
        },
        "caracteristicas": {
          "tipoConstructivo": "Acero",
          "añoConstruccion": 2018,
          "niveles": 3,
          "uso": "Comercial",
          "giro": "Tienda de Electrónicos"
        },
        "garantias": {
          "edificio": 3000000,
          "contenidos": 1500000
        }
      }
    ],
    "coberturasActivar": ["Cristales", "Daños por Agua", "Robo"],
    "valoresEsperados": {
      "sumaAseguradaTotal": 11500000,
      "coberturasObligatorias": 2,
      "coberturasOpcionalesActivas": 3,
      "totalCoberturas": 5
    }
  }
}
```

---

*Documento generado siguiendo los lineamientos de QA del Centro de Excelencia Sofka - AI-First*
