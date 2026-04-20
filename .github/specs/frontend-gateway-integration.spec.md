---
id: SPEC-017
status: DRAFT
feature: frontend-gateway-integration
created: 2026-04-20
updated: 2026-04-20
author: spec-generator
version: "1.0"
related-specs:
  - SPEC-016
---

# Spec: Frontend Integration with Gateway

> **Estado:** `DRAFT` → aprobar con `status: APPROVED` antes de iniciar implementación.

---

## 1. REQUERIMIENTOS

### Descripción
Actualizar la configuración del **frontend React** para que consuma las APIs a través del **API Gateway** (puerto 8080) en lugar de conectarse directamente al backend (puerto 3000).

**Cambio Principal:**
- **Antes:** Frontend → `http://localhost:3000/api/v1/...`
- **Después:** Frontend → `http://localhost:8080/api/v1/...`

### Requerimiento de Negocio
> "Necesito que el frontend use el API Gateway como punto de entrada único. Esto permite centralizar el logging, manejar CORS en un solo lugar, y preparar el terreno para agregar circuit breakers y autenticación en el futuro."

---

### Historias de Usuario

#### HU-01: Cambio de URL Base
```gherkin
# language: es
Característica: Configuración de URL Base
  Como desarrollador frontend
  Quiero cambiar la URL de API al gateway
  Para centralizar el acceso a través del gateway

  @frontend @config @gateway-integration
  Escenario: Cambiar VITE_API_URL al gateway
    Dado que el archivo .env tiene VITE_API_URL=http://localhost:3000/api/v1
    Cuando cambio a VITE_API_URL=http://localhost:8080/api/v1
    Entonces todas las peticiones del frontend deben ir al puerto 8080
    Y el gateway debe enrutar al backend (puerto 3000)

  @frontend @config @gateway-integration
  Escenario: Configuración por entorno
    Dado que existen archivos .env.development y .env.production
    Cuando configuro ambos para usar el gateway
    Entonces desarrollo usa localhost:8080
    Y producción usa la URL del gateway en producción
```

#### HU-02: Verificación de CORS
```gherkin
# language: es
Característica: CORS a través del Gateway
  Como desarrollador frontend
  Quiero que CORS funcione correctamente
  Para que el frontend pueda comunicarse con el gateway

  @frontend @cors @gateway-integration
  Escenario: Verificar CORS desde el frontend
    Dado que el frontend corre en localhost:5173
    Cuando hace una petición al gateway en localhost:8080
    Entonces el gateway debe responder con headers CORS correctos
    Y no debe haber errores de CORS en consola

  @frontend @cors @gateway-integration
  Escenario: Preflight OPTIONS funciona
    Dado que el frontend hace una petición POST con JSON
    Cuando el navegador envía preflight OPTIONS
    Entonces el gateway debe responder 200 OK
    Y permitir el método POST y headers Content-Type
```

#### HU-03: Funcionalidad Preservada
```gherkin
# language: es
Característica: Funcionalidad existente preservada
  Como usuario
  Quiero que todas las funcionalidades sigan funcionando
  Después de migrar al gateway

  @frontend @regression @gateway-integration
  Escenario: Crear cotización funciona
    Dado que el frontend apunta al gateway
    Cuando creo una nueva cotización
    Entonces debe guardarse correctamente en el backend
    Y debe mostrarse el folio generado

  @frontend @regression @gateway-integration
  Escenario: Listar cotizaciones funciona
    Dado que el frontend apunta al gateway
    Cuando veo la lista de cotizaciones
    Entonces debe mostrar todas las cotizaciones existentes
    Y los datos deben ser correctos

  @frontend @regression @gateway-integration
  Escenario: Actualizar propiedades funciona
    Dado que el frontend apunta al gateway
    Cuando actualizo datos de una propiedad
    Entonces los cambios deben guardarse
    Y el backend debe recibir los datos correctos
```

#### HU-04: Logging Visible
```gherkin
# language: es
Característica: Logging del Gateway visible
  Como desarrollador
  Quiero ver los logs del gateway
  Para confirmar que las peticiones pasan por el gateway

  @frontend @observability @gateway-integration
  Escenario: Logs muestran peticiones del frontend
    Dado que el gateway está corriendo con logging DEBUG
    Cuando el frontend hace una petición
    Entonces debo ver [REQUEST] en los logs del gateway
    Y debo ver [RESPONSE] con status y duration
```

---

### Reglas de Negocio

1. **URL Base:** Todas las peticiones API deben apuntar al Gateway (puerto 8080)
2. **CORS:** El Gateway ya está configurado para permitir localhost:5173
3. **Sin cambios de lógica:** Solo cambiar la URL base, no el comportamiento
4. **Backward compatible:** Si el Gateway cae, se puede revertir fácilmente
5. **Health check:** Verificar `/actuator/health` del Gateway antes de iniciar frontend

---

## 2. DISEÑO

### Arquitectura de Comunicación

```
┌─────────────────────────────────────────────────────────────────┐
│                      FLUJO ANTES                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Frontend (5173) ────────────────────> Backend (3000)           │
│              http://localhost:3000/api/v1/...                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     FLUJO DESPUÉS                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Frontend (5173) ───────┐                                         │
│                        │                                         │
│                        ▼                                         │
│  ┌─────────────────────────┐      ┌─────────────────────────┐   │
│  │      Gateway (8080)     │      │      Backend (3000)     │   │
│  │  ┌───────────────────┐   │      │                         │   │
│  │  │  Logging Filter   │   │      │  /api/v1/quotes         │   │
│  │  │  CORS Handler     │   │─────>│  /api/v1/properties     │   │
│  │  │  Route: Strip     │   │      │                         │   │
│  │  └───────────────────┘   │      │                         │   │
│  └─────────────────────────┘      └─────────────────────────┘   │
│                                                                  │
│  http://localhost:8080/api/v1/...                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Cambios en Archivos

#### Antes (.env o .env.development)
```bash
VITE_API_URL=http://localhost:3000/api/v1
```

#### Después (.env o .env.development)
```bash
VITE_API_URL=http://localhost:8080/api/v1
```

### Estructura de Archivos Frontend Afectados

```
frontend/
├── .env                      # ← Cambiar URL
├── .env.development          # ← Cambiar URL
├── .env.production           # ← Cambiar URL (para prod)
├── src/
│   ├── services/
│   │   └── api.ts            # ← Usa import.meta.env.VITE_API_URL
│   └── ...
└── vite.config.ts            # ← Verificar proxy si existe
```

### Configuración Vite (vite.config.ts)

Si existe configuración de proxy, se puede simplificar o eliminar:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // ANTES: Proxy para evitar CORS
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://localhost:3000',
  //       changeOrigin: true,
  //     }
  //   }
  // }
  
  // DESPUÉS: No necesita proxy, CORS manejado por Gateway
  server: {
    port: 5173,
  }
})
```

### Ejemplo de Servicio API (api.ts)

```typescript
// src/services/api.ts

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'

export const api = {
  // Quotes
  getQuotes: () => fetch(`${API_URL}/quotes`),
  createQuote: (data: any) => fetch(`${API_URL}/quotes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),
  
  // Properties
  getProperties: (quoteId: string) => 
    fetch(`${API_URL}/quotes/${quoteId}/properties`),
  
  updateProperty: (id: string, data: any) => 
    fetch(`${API_URL}/properties/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
}
```

---

## 3. LISTA DE TAREAS

### Fase 1: Actualizar Configuración Frontend

- [ ] Actualizar `.env` con `VITE_API_URL=http://localhost:8080/api/v1`
- [ ] Actualizar `.env.development` con nueva URL
- [ ] Actualizar `.env.production` con URL de producción
- [ ] Verificar `vite.config.ts` (eliminar proxy si existe)
- [ ] Verificar que `import.meta.env.VITE_API_URL` se use en servicios API

### Fase 2: Verificación CORS

- [ ] Iniciar Gateway (`cd ms-gateway && mvn spring-boot:run`)
- [ ] Iniciar Backend (`cd ms-core && npm run start:dev`)
- [ ] Iniciar Frontend (`cd frontend && npm run dev`)
- [ ] Abrir navegador en `http://localhost:5173`
- [ ] Verificar consola: no debe haber errores CORS
- [ ] Verificar Network tab: peticiones van a `:8080`

### Fase 3: Testing Funcional

- [ ] Test: Crear cotización
- [ ] Test: Ver lista de cotizaciones
- [ ] Test: Actualizar datos de cotización
- [ ] Test: Crear propiedades
- [ ] Test: Actualizar propiedades
- [ ] Test: Todos los flujos del wizard

### Fase 4: Verificación Logs Gateway

- [ ] Verificar logs del Gateway muestran `[REQUEST]` del frontend
- [ ] Verificar logs muestran `[RESPONSE]` con status 200/201
- [ ] Verificar duración de peticiones es razonable (< 500ms)

### Fase 5: Documentación

- [ ] Actualizar README del frontend con nueva configuración
- [ ] Documentar que Gateway debe estar corriendo
- [ ] Agregar troubleshooting (qué pasa si Gateway no responde)

---

## 4. COMANDOS ÚTILES

```bash
# Terminal 1: Iniciar Gateway
cd ms-gateway
mvn spring-boot:run

# Terminal 2: Iniciar Backend (si no está en Docker)
cd ms-core
npm run start:dev

# Terminal 3: Iniciar Frontend
cd frontend
npm run dev

# Verificar Gateway está corriendo
curl http://localhost:8080/actuator/health

# Ver rutas configuradas
curl http://localhost:8080/actuator/gateway/routes

# Test API vía Gateway
curl http://localhost:8080/api/v1/quotes
```

---

## 5. TROUBLESHOOTING

| Problema | Causa | Solución |
|----------|-------|----------|
| CORS errors en consola | Gateway no corriendo | Verificar `mvn spring-boot:run` |
| Connection refused | Puerto incorrecto | Verificar `VITE_API_URL` usa 8080 |
| 404 Not Found | Ruta mal configurada | Verificar `/api/v1` incluido en URL |
| Timeout | Gateway o Backend caído | Verificar ambos servicios corren |
| Logs no aparecen | Nivel de logging | Verificar `logging.level.com.segurax.gateway=DEBUG` |

---

## 6. ROLLBACK PLAN

Si algo falla, revertir cambios:

```bash
# Revertir .env
echo "VITE_API_URL=http://localhost:3000/api/v1" > frontend/.env

# Reiniciar frontend
# Detener y volver a iniciar: npm run dev
```

---

## 7. BENEFICIOS DE ESTE CAMBIO

| Beneficio | Descripción |
|-----------|-------------|
| **Logging centralizado** | Todas las peticiones se loguean en el Gateway |
| **CORS en un solo lugar** | No necesita configuración CORS en backend |
| **Preparado para Circuit Breaker** | Podemos agregarlo en SPEC-018 sin cambiar frontend |
| **Autenticación futura** | JWT validation se hará en Gateway |
| **Load Balancing** | Futuro: múltiples instancias del backend |
| **SSL Termination** | Futuro: HTTPS en Gateway, HTTP interno |

---

*Fin de la especificación*
