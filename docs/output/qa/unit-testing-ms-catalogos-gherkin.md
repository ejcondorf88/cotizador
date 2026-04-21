# Casos de Prueba Gherkin - MS-Catalogos Tests Unitarios

> **SPEC**: SPEC-022 - Tests Unitarios - Microservicio de Catálogos (ms-catalogos)  
> **Stack**: NestJS + TypeORM + PostgreSQL + Jest + TestContainers  
> **Arquitectura**: N-Capas (Domain → Application → Infrastructure → Presentation)  
> **Generado**: 2026-04-21  
> **Feature**: unit-testing-ms-catalogos

---

## Resumen de Escenarios

| Capa | HU | Escenarios | Tags Principales |
|------|-----|------------|------------------|
| Domain | HU-01 | 24 | @domain @entity @critico |
| Application | HU-02 | 36 | @application @use-case @critico |
| Infrastructure | HU-03 | 28 | @infrastructure @repository @integration |
| Infrastructure | HU-04 | 16 | @infrastructure @mapper @critico |
| Application | HU-05 | 20 | @application @dto @validation |
| Presentation | HU-06 | 32 | @presentation @e2e @controller |
| **TOTAL** | **6 HUs** | **156** | |

---

## HU-01: Tests de Domain Entities

### Feature: Giro Entity - Lógica de Negocio de Giros Comerciales

@domain @giro @entity @critico @happy-path
Escenario: Crear giro con valores por defecto generados automáticamente
  Dado que el usuario proporciona clave "COM-001" y descripción "Comercio al por mayor"
  Cuando se invoca el método de fábrica Giro.create()
  Entonces se genera un identificador único UUID v4 válido
  Y se asigna el nivel de riesgo "MEDIO" por defecto
  Y el estado activo se establece en verdadero
  Y se registran las marcas de tiempo de creación y actualización

@domain @giro @entity @critico @happy-path
Escenario: Crear giro con nivel de riesgo personalizado
  Dado que el usuario proporciona clave, descripción y nivel de riesgo "ALTO"
  Cuando se invoca Giro.create() con el riesgo especificado
  Entonces el giro se crea con el nivel de riesgo "ALTO" proporcionado
  Y los demás valores por defecto se mantienen correctamente

@domain @giro @entity @critico @happy-path
Escenario: Actualización parcial de campos de giro
  Dado que existe un giro previamente creado con clave "COM-001"
  Y descripción "Comercio Original", sector "Retail", riesgo "MEDIO"
  Cuando se invoca update() proporcionando únicamente descripción "Comercio Actualizado"
  Entonces solo el campo descripción cambia su valor
  Y clave, sector y riesgo mantienen sus valores originales
  Y la marca de tiempo updatedAt se actualiza automáticamente

@domain @giro @entity @critico @happy-path
Escenario: Actualización múltiple de campos simultáneamente
  Dado que existe un giro con datos iniciales
  Cuando se invoca update() con descripción, riesgo y sector nuevos
  Entonces todos los campos proporcionados se actualizan correctamente
  Y updatedAt refleja el momento de la actualización

@domain @giro @entity @critico @happy-path
Escenario: Desactivación lógica de giro
  Dado que existe un giro activo
  Cuando se invoca el método deactivate()
  Entonces el estado activo cambia a falso
  Y la marca de tiempo updatedAt se actualiza

@domain @giro @entity @critico @happy-path
Escenario: Reactivación de giro desactivado
  Dado que existe un giro en estado desactivo
  Cuando se invoca el método activate()
  Entonces el estado activo cambia a verdadero
  Y updatedAt refleja el momento de reactivación

@domain @giro @entity @edge-case
Escenario: Manejo de campo sector nulo
  Dado que se crea un giro sin proporcionar valor para sector
  Cuando se consulta el valor del campo sector
  Entonces el valor es nulo
  Y las demás propiedades se mantienen válidas

---

### Feature: Agente Entity - Gestión de Agentes Comerciales

@domain @agente @entity @critico @happy-path
Escenario: Crear agente con campos opcionales nulos
  Dado que se proporciona código "AGT-001" y nombre "Agente Test"
  Cuando se invoca Agente.create()
  Entonces el agente se crea correctamente
  Y oficinaId es nulo por defecto
  Y email es nulo por defecto
  Y teléfono es nulo por defecto

@domain @agente @entity @critico @happy-path
Escenario: Crear agente con todos los campos opcionales
  Dado que se proporciona código, nombre, email válido, teléfono y oficinaId
  Cuando se invoca Agente.create() con todos los datos
  Entonces el agente se crea con todos los valores proporcionados
  Y oficinaId establece la relación con la oficina especificada

@domain @agente @entity @critico @happy-path
Escenario: Cambio de oficina asignada
  Dado que existe un agente asignado a oficina "OF-001"
  Cuando se invoca update() con oficinaId "OF-002"
  Entonces la oficina asignada cambia a "OF-002"
  Y el agente mantiene su código y nombre originales

@domain @agente @entity @edge-case
Escenario: Desasignación de oficina
  Dado que existe un agente con oficina asignada
  Cuando se invoca update() con oficinaId nulo
  Entonces el agente queda sin oficina asignada
  Y oficinaId es nulo

---

### Feature: Suscriptor Entity - Gestión de Suscriptores

@domain @suscriptor @entity @critico @happy-path
Escenario: Crear suscriptor con tipo nulo por defecto
  Dado que se proporciona código "SUB-001" y nombre "Suscriptor Test"
  Cuando se invoca Suscriptor.create()
  Entonces el suscriptor se crea correctamente
  Y el campo tipo es nulo por defecto

@domain @suscriptor @entity @critico @happy-path
Escenario: Asignar tipo a suscriptor existente
  Dado que existe un suscriptor sin tipo asignado
  Cuando se invoca update() con tipo "PREMIUM"
  Entonces el campo tipo se actualiza a "PREMIUM"

@domain @suscriptor @entity @error-path
Escenario: Campos obligatorios en creación
  Dado que se intenta crear un suscriptor sin código
  Cuando se invoca Suscriptor.create() sin el campo requerido
  Entonces se debe lanzar una excepción de validación

---

### Feature: Oficina Entity - Gestión de Oficinas

@domain @oficina @entity @critico @happy-path
Escenario: Crear oficina con ubicación opcional
  Dado que se proporciona código "OF-001" y nombre "Oficina Principal"
  Cuando se invoca Oficina.create() sin ciudad ni estado
  Entonces la oficina se crea correctamente
  Y ciudad es nulo
  Y estado es nulo

@domain @oficina @entity @critico @happy-path
Escenario: Actualizar ubicación de oficina
  Dado que existe una oficina sin ubicación definida
  Cuando se invoca update() con ciudad "Ciudad de México" y estado "CDMX"
  Entonces los campos de ubicación se actualizan correctamente

@domain @oficina @entity @critico @happy-path
Escenario: Código único en el dominio
  Dado que existe una oficina con código "OF-001"
  Cuando se intenta crear otra oficina con el mismo código
  Entonces el sistema debe prevenir la duplicidad

---

## HU-02: Tests de Application Use Cases

### Feature: Create Use Cases - Creación de Entidades

@application @create @giro @critico @happy-path
Escenario: Crear giro exitosamente
  Dado que se proporcionan datos válidos de giro
  Y el repositorio de giros está disponible
  Cuando se ejecuta CreateGiroUseCase
  Entonces se persiste el giro en el repositorio
  Y se retorna el giro creado con su UUID asignado

@application @create @agente @critico @happy-path
Escenario: Crear agente exitosamente
  Dado que se proporcionan datos válidos de agente
  Y no existe otro agente con el mismo código
  Cuando se ejecuta CreateAgenteUseCase
  Entonces se crea el agente correctamente

@application @create @agente @critico @error-path
Escenario: Conflicto al crear agente con código duplicado
  Dado que existe un agente con código "AGT-001"
  Cuando se intenta crear otro agente con código "AGT-001"
  Entonces se lanza ConflictException
  Y no se persiste el nuevo agente

@application @create @suscriptor @critico @happy-path
Escenario: Crear suscriptor exitosamente
  Dado que se proporcionan datos válidos de suscriptor
  Cuando se ejecuta CreateSuscriptorUseCase
  Entonces se persiste el suscriptor correctamente

@application @create @oficina @critico @happy-path
Escenario: Crear oficina exitosamente
  Dado que se proporcionan datos válidos de oficina
  Y no existe otra oficina con el mismo código
  Cuando se ejecuta CreateOficinaUseCase
  Entonces se crea la oficina correctamente

@application @create @oficina @critico @error-path
Escenario: Conflicto al crear oficina con código duplicado
  Dado que existe una oficina con código "OF-001"
  Cuando se intenta crear otra oficina con el mismo código
  Entonces se lanza ConflictException

---

### Feature: Update Use Cases - Actualización de Entidades

@application @update @giro @critico @happy-path
Escenario: Actualizar giro existente
  Dado que existe un giro con id válido en el repositorio
  Cuando se ejecuta UpdateGiroUseCase con datos parciales
  Entonces se actualizan solo los campos proporcionados
  Y se retorna el giro actualizado

@application @update @giro @critico @error-path
Escenario: Actualizar giro inexistente
  Dado que se proporciona un id de giro que no existe
  Cuando se ejecuta UpdateGiroUseCase
  Entonces se lanza NotFoundException

@application @update @agente @critico @happy-path
Escenario: Cambiar oficina de agente
  Dado que existe un agente asignado a oficina "OF-001"
  Cuando se ejecuta UpdateAgenteUseCase con oficinaId "OF-002"
  Entonces el agente queda asignado a la nueva oficina

@application @update @suscriptor @critico @happy-path
Escenario: Actualizar suscriptor completamente
  Dado que existe un suscriptor con todos sus campos
  Cuando se ejecuta UpdateSuscriptorUseCase con datos nuevos
  Entonces todos los campos se actualizan correctamente

@application @update @oficina @critico @happy-path
Escenario: Actualizar ubicación de oficina
  Dado que existe una oficina sin ubicación
  Cuando se ejecuta UpdateOficinaUseCase con ciudad y estado
  Entonces la ubicación se actualiza correctamente

---

### Feature: Get Use Cases - Consulta de Entidades

@application @get @giro @critico @happy-path
Escenario: Obtener giro por id existente
  Dado que existe un giro con id "uuid-123"
  Cuando se ejecuta GetGiroByIdUseCase con ese id
  Entonces se retorna el giro completo

@application @get @giro @critico @error-path
Escenario: Obtener giro por id inexistente
  Dado que se proporciona un id de giro que no existe
  Cuando se ejecuta GetGiroByIdUseCase
  Entonces se lanza NotFoundException

@application @get @agente @critico @happy-path
Escenario: Obtener agente por id
  Dado que existe un agente con id válido
  Cuando se ejecuta GetAgenteByIdUseCase
  Entonces se retorna el agente con sus datos

@application @get @suscriptores @critico @happy-path
Escenario: Listar suscriptores con paginación
  Dado que existen múltiples suscriptores en el sistema
  Cuando se ejecuta GetSuscriptoresUseCase con page=1 y limit=10
  Entonces se retorna una lista paginada de suscriptores
  Y el total de elementos es consistente

@application @get @oficinas @critico @happy-path
Escenario: Listar oficinas con paginación
  Dado que existen oficinas en el sistema
  Cuando se ejecuta GetOficinasUseCase con parámetros de paginación
  Entonces se retorna la lista paginada correctamente

---

### Feature: Search Use Cases - Búsqueda de Entidades

@application @search @giro @critico @happy-path
Escenario: Buscar giros por texto en descripción
  Dado que existen giros con descripciones variadas
  Cuando se ejecuta SearchGirosUseCase con query "Comercio"
  Entonces se retornan solo los giros que contienen "Comercio" en descripción
  Y la búsqueda es case-insensitive

@application @search @giro @critico @happy-path
Escenario: Buscar giros por clave
  Dado que existe un giro con clave "COM-001"
  Cuando se ejecuta SearchGirosUseCase con query "COM-001"
  Entonces se encuentra el giro específico

@application @search @agente @critico @happy-path
Escenario: Buscar agentes por código o nombre
  Dado que existen agentes con códigos y nombres variados
  Cuando se ejecuta SearchAgentesUseCase con query "AGT"
  Entonces se retornan agentes que coinciden en código o nombre

@application @search @suscriptor @critico @happy-path
Escenario: Buscar suscriptores por código y nombre
  Dado que existen suscriptores en el sistema
  Cuando se ejecuta SearchSuscriptoresUseCase con query de búsqueda
  Entonces se retornan resultados filtrados correctamente
  Y los resultados están paginados

---

### Feature: Delete Use Cases - Eliminación Lógica

@application @delete @giro @critico @happy-path
Escenario: Eliminar giro mediante soft delete
  Dado que existe un giro activo con id válido
  Cuando se ejecuta DeleteGiroUseCase
  Entonces el campo activo cambia a falso
  Y se retorna confirmación de eliminación

@application @delete @giro @critico @error-path
Escenario: Eliminar giro inexistente
  Dado que se proporciona un id de giro que no existe
  Cuando se ejecuta DeleteGiroUseCase
  Entonces se lanza NotFoundException

@application @delete @agente @critico @happy-path
Escenario: Eliminar agente mediante soft delete
  Dado que existe un agente activo
  Cuando se ejecuta DeleteAgenteUseCase
  Entonces el agente queda inactivo
  Y no se elimina físicamente

@application @delete @suscriptor @critico @happy-path
Escenario: Eliminar suscriptor mediante soft delete
  Dado que existe un suscriptor activo
  Cuando se ejecuta DeleteSuscriptorUseCase
  Entonces el suscriptor queda inactivo

@application @delete @oficina @critico @happy-path
Escenario: Eliminar oficina mediante soft delete
  Dado que existe una oficina activa
  Cuando se ejecuta DeleteOficinaUseCase
  Entonces la oficina queda inactiva

---

## HU-03: Tests de Infrastructure - Repositories

### Feature: GiroRepositoryAdapter - Persistencia de Giros

@infrastructure @repository @giro @integration @critico @happy-path
Escenario: Persistir giro con UUID generado
  Dado que se conecta a PostgreSQL mediante TestContainers
  Y se tiene una entidad Giro de dominio válida
  Cuando se invoca repository.create()
  Entonces el giro se persiste con UUID asignado
  Y los datos se almacenan correctamente en PostgreSQL

@infrastructure @repository @giro @integration @critico @happy-path
Escenario: Buscar giro por id existente
  Dado que existe un giro persistido en PostgreSQL
  Cuando se invoca repository.findById() con el id
  Entonces se retorna el giro con todos sus campos
  Y el mapeo de TypeORM a Domain es correcto

@infrastructure @repository @giro @integration @critico @happy-path
Escenario: Buscar giro por id inexistente
  Dado que se proporciona un id que no existe
  Cuando se invoca repository.findById()
  Entonces se retorna null

@infrastructure @repository @giro @integration @critico @happy-path
Escenario: Buscar giros por clave exacta
  Dado que existe un giro con clave "COM-001"
  Cuando se invoca repository.findByClave("COM-001")
  Entonces se encuentra el giro específico

@infrastructure @repository @giro @integration @critico @happy-path
Escenario: Buscar giros activos únicamente
  Dado que existen giros activos e inactivos
  Cuando se invoca repository.findAll()
  Entonces solo se retornan los giros con activo=true

@infrastructure @repository @giro @integration @critico @happy-path
Escenario: Búsqueda parcial en descripción (ILike)
  Dado que existen giros con descripciones variadas
  Cuando se invoca repository.search() con query "Comercio"
  Entonces se retornan giros cuya descripción contiene "Comercio"
  Y la búsqueda no distingue mayúsculas/minúsculas

@infrastructure @repository @giro @integration @critico @happy-path
Escenario: Actualizar campos específicos
  Dado que existe un giro persistido
  Cuando se invoca repository.update() con campos parciales
  Entonces solo los campos proporcionados se actualizan
  Y los demás campos mantienen su valor

@infrastructure @repository @giro @integration @critico @happy-path
Escenario: Soft delete de giro
  Dado que existe un giro activo
  Cuando se invoca repository.delete()
  Entonces el campo activo cambia a falso
  Y el registro físico no se elimina

---

### Feature: AgenteRepositoryAdapter - Persistencia de Agentes

@infrastructure @repository @agente @integration @critico @happy-path
Escenario: Persistir agente con oficina asignada
  Dado que se proporcionan datos de agente con oficinaId
  Cuando se invoca repository.create()
  Entonces el agente se persiste con la relación correcta

@infrastructure @repository @agente @integration @critico @happy-path
Escenario: Buscar agente por código exacto
  Dado que existe un agente con código "AGT-001"
  Cuando se invoca repository.findByCodigo("AGT-001")
  Entonces se retorna el agente específico

@infrastructure @repository @agente @integration @critico @happy-path
Escenario: Buscar agentes por nombre o código
  Dado que existen agentes con nombres y códigos variados
  Cuando se invoca repository.search() con query
  Entonces se retornan agentes que coinciden en nombre o código

@infrastructure @repository @agente @integration @critico @happy-path
Escenario: Filtrar agentes por oficina
  Dado que existen agentes asignados a diferentes oficinas
  Cuando se invoca repository.findByOficina() con oficinaId
  Entonces solo se retornan agentes de esa oficina

@infrastructure @repository @agente @integration @critico @happy-path
Escenario: Paginación de agentes
  Dado que existen más de 10 agentes
  Cuando se invoca repository.findAll() con page=1 y limit=10
  Entonces se retornan exactamente 10 agentes
  Y se incluye el total de elementos

@infrastructure @repository @agente @integration @critico @happy-path
Escenario: Cambio de oficina en actualización
  Dado que existe un agente con oficina asignada
  Cuando se invoca repository.update() con nuevo oficinaId
  Entonces la relación se actualiza correctamente

---

### Feature: SuscriptorRepositoryAdapter - Persistencia de Suscriptores

@infrastructure @repository @suscriptor @integration @critico @happy-path
Escenario: CRUD completo de suscriptor
  Dado que se tiene un suscriptor de dominio
  Cuando se ejecutan operaciones create, findById, update, delete
  Entonces todas las operaciones funcionan correctamente
  Y los datos se mantienen consistentes

@infrastructure @repository @suscriptor @integration @critico @happy-path
Escenario: Buscar suscriptor por código
  Dado que existe un suscriptor con código "SUB-001"
  Cuando se invoca repository.findByCodigo()
  Entonces se encuentra el suscriptor correcto

@infrastructure @repository @suscriptor @integration @critico @happy-path
Escenario: Búsqueda por nombre
  Dado que existen suscriptores con nombres variados
  Cuando se invoca repository.search() con query de nombre
  Entonces se retornan suscriptores coincidentes

@infrastructure @repository @suscriptor @integration @critico @happy-path
Escenario: Paginación de suscriptores
  Dado que existen múltiples suscriptores
  Cuando se invoca repository.findAll() con paginación
  Entonces se retorna el resultado paginado correctamente

---

### Feature: OficinaRepositoryAdapter - Persistencia de Oficinas

@infrastructure @repository @oficina @integration @critico @happy-path
Escenario: CRUD completo de oficina
  Dado que se tiene una oficina de dominio
  Cuando se ejecutan operaciones CRUD
  Entonces todas las operaciones funcionan correctamente

@infrastructure @repository @oficina @integration @critico @happy-path
Escenario: Buscar oficina por código
  Dado que existe una oficina con código "OF-001"
  Cuando se invoca repository.findByCodigo()
  Entonces se retorna la oficina correcta

@infrastructure @repository @oficina @integration @critico @happy-path
Escenario: Filtrar oficinas por estado
  Dado que existen oficinas en diferentes estados
  Cuando se invoca repository.findByEstado() con estado específico
  Entonces solo se retornan oficinas de ese estado

@infrastructure @repository @oficina @integration @critico @happy-path
Escenario: Búsqueda por nombre de oficina
  Dado que existen oficinas con nombres variados
  Cuando se invoca repository.search() con query
  Entonces se retornan oficinas coincidentes

@infrastructure @repository @oficina @integration @critico @happy-path
Escenario: Paginación de oficinas
  Dado que existen múltiples oficinas
  Cuando se invoca repository.findAll() con paginación
  Entonces se retorna el resultado paginado correctamente

---

## HU-04: Tests de Mappers

### Feature: GiroMapper - Conversión Bidireccional

@infrastructure @mapper @giro @critico @happy-path
Escenario: Convertir TypeORM a Domain entity
  Dado que se tiene una entidad GiroTypeOrmEntity con todos sus campos
  Cuando se invoca GiroMapper.toDomain()
  Entonces se obtiene una entidad de dominio Giro
  Y todos los campos se transfieren correctamente

@infrastructure @mapper @giro @critico @happy-path
Escenario: Convertir Domain a TypeORM entity
  Dado que se tiene una entidad de dominio Giro
  Cuando se invoca GiroMapper.toTypeOrm()
  Entonces se obtiene una entidad GiroTypeOrmEntity
  Y todos los campos se transfieren correctamente

@infrastructure @mapper @giro @critico @happy-path
Escenario: Conversión bidireccional completa
  Dado que se tiene una entidad de dominio Giro original
  Cuando se convierte a TypeORM y de vuelta a Domain
  Entonces todos los campos se preservan idénticamente
  Y no hay pérdida de información

@infrastructure @mapper @giro @edge-case
Escenario: Manejo de sector nulo en conversión
  Dado que se tiene un giro con sector=null
  Cuando se realiza la conversión bidireccional
  Entonces el valor null se preserva correctamente

---

### Feature: AgenteMapper - Conversión Bidireccional

@infrastructure @mapper @agente @critico @happy-path
Escenario: Conversión TypeORM a Domain
  Dado que se tiene AgenteTypeOrmEntity
  Cuando se invoca AgenteMapper.toDomain()
  Entonces se obtiene la entidad de dominio correcta

@infrastructure @mapper @agente @critico @happy-path
Escenario: Conversión Domain a TypeORM
  Dado que se tiene Agente de dominio
  Cuando se invoca AgenteMapper.toTypeOrm()
  Entonces se obtiene la entidad TypeORM correcta

@infrastructure @mapper @agente @edge-case
Escenario: Manejo de campos opcionales nulos
  Dado que se tiene un agente con oficinaId=null, email=null, telefono=null
  Cuando se realiza la conversión bidireccional
  Entonces los valores null se preservan correctamente

@infrastructure @mapper @agente @critico @happy-path
Escenario: Conversión bidireccional completa
  Dado que se tiene un agente de dominio
  Cuando se convierte en ambas direcciones
  Entonces todos los campos se mantienen consistentes

---

### Feature: SuscriptorMapper - Conversión Bidireccional

@infrastructure @mapper @suscriptor @critico @happy-path
Escenario: Conversión completa de suscriptor
  Dado que se tiene SuscriptorTypeOrmEntity
  Cuando se realizan las conversiones toDomain() y toTypeOrm()
  Entonces los datos se mantienen consistentes

@infrastructure @mapper @suscriptor @edge-case
Escenario: Manejo de tipo nulo
  Dado que se tiene un suscriptor con tipo=null
  Cuando se realiza la conversión
  Entonces el null se preserva correctamente

@infrastructure @mapper @suscriptor @critico @happy-path
Escenario: Conversión bidireccional
  Dado que se tiene Suscriptor de dominio
  Cuando se convierte a TypeORM y de vuelta
  Entonces todos los campos coinciden

---

### Feature: OficinaMapper - Conversión Bidireccional

@infrastructure @mapper @oficina @critico @happy-path
Escenario: Conversión completa de oficina
  Dado que se tiene OficinaTypeOrmEntity
  Cuando se realizan las conversiones
  Entonces los datos se mantienen consistentes

@infrastructure @mapper @oficina @edge-case
Escenario: Manejo de ciudad y estado nulos
  Dado que se tiene una oficina sin ubicación
  Cuando se realiza la conversión bidireccional
  Entonces los valores null se preservan

@infrastructure @mapper @oficina @critico @happy-path
Escenario: Conversión bidireccional
  Dado que se tiene Oficina de dominio
  Cuando se convierte en ambas direcciones
  Entonces todos los campos se mantienen iguales

---

## HU-05: Tests de DTOs y Validaciones

### Feature: Create DTOs Validation - Validaciones de Creación

@application @dto @validation @create @giro @critico @error-path
Escenario: Validar clave vacía en CreateGiroDto
  Dado que se proporciona CreateGiroDto con clave=""
  Cuando se ejecuta class-validator validate()
  Entonces se retornan errores de validación
  Y el error indica que clave es requerida

@application @dto @validation @create @giro @critico @error-path
Escenario: Validar descripción vacía en CreateGiroDto
  Dado que se proporciona CreateGiroDto con descripción=""
  Cuando se ejecuta class-validator validate()
  Entonces se retornan errores de validación

@application @dto @validation @create @agente @critico @error-path
Escenario: Validar código vacío en CreateAgenteDto
  Dado que se proporciona CreateAgenteDto con código=""
  Cuando se ejecuta validate()
  Entonces se retornan errores de validación

@application @dto @validation @create @agente @critico @error-path
Escenario: Validar nombre vacío en CreateAgenteDto
  Dado que se proporciona CreateAgenteDto con nombre=""
  Cuando se ejecuta validate()
  Entonces se retornan errores de validación

@application @dto @validation @create @agente @critico @error-path
Escenario: Validar email inválido en CreateAgenteDto
  Dado que se proporciona CreateAgenteDto con email="invalid-email"
  Cuando se ejecuta validate()
  Entonces se retorna error de formato de email

@application @dto @validation @create @agente @happy-path
Escenario: Datos válidos en CreateAgenteDto
  Dado que se proporcionan todos los datos requeridos válidos
  Y email tiene formato válido
  Cuando se ejecuta validate()
  Entonces no se retornan errores

@application @dto @validation @create @suscriptor @critico @error-path
Escenario: Validar código vacío en CreateSuscriptorDto
  Dado que se proporciona CreateSuscriptorDto con código=""
  Cuando se ejecuta validate()
  Entonces se retornan errores de validación

@application @dto @validation @create @oficina @critico @error-path
Escenario: Validar código vacío en CreateOficinaDto
  Dado que se proporciona CreateOficinaDto con código=""
  Cuando se ejecuta validate()
  Entonces se retornan errores de validación

@application @dto @validation @create @oficina @critico @error-path
Escenario: Validar nombre vacío en CreateOficinaDto
  Dado que se proporciona CreateOficinaDto con nombre=""
  Cuando se ejecuta validate()
  Entonces se retornan errores de validación

---

### Feature: Update DTOs Validation - Validaciones de Actualización

@application @dto @validation @update @giro @happy-path
Escenario: Todos los campos opcionales en UpdateGiroDto
  Dado que se proporciona UpdateGiroDto sin ningún campo
  Cuando se ejecuta validate()
  Entonces no se retornan errores
  Y todos los campos son aceptados como opcionales

@application @dto @validation @update @giro @happy-path
Escenario: Actualizar descripción en UpdateGiroDto
  Dado que se proporciona UpdateGiroDto con solo descripción
  Cuando se ejecuta validate()
  Entonces se acepta el dato correctamente

@application @dto @validation @update @agente @happy-path
Escenario: Email opcional pero válido si se proporciona
  Dado que se proporciona UpdateAgenteDto con email="valid@test.com"
  Cuando se ejecuta validate()
  Entonces el email se acepta como válido

@application @dto @validation @update @agente @error-path
Escenario: Email inválido en UpdateAgenteDto
  Dado que se proporciona UpdateAgenteDto con email="invalid"
  Cuando se ejecuta validate()
  Entonces se retorna error de formato de email

@application @dto @validation @update @suscriptor @happy-path
Escenario: Tipo opcional en UpdateSuscriptorDto
  Dado que se proporciona UpdateSuscriptorDto con tipo="PREMIUM"
  Cuando se ejecuta validate()
  Entonces el tipo se acepta correctamente

@application @dto @validation @update @oficina @happy-path
Escenario: Ciudad opcional en UpdateOficinaDto
  Dado que se proporciona UpdateOficinaDto con ciudad="Nueva Ciudad"
  Cuando se ejecuta validate()
  Entonces la ciudad se acepta correctamente

---

### Feature: Pagination DTO - Validaciones de Paginación

@application @dto @validation @pagination @critico @happy-path
Escenario: Valores por defecto de paginación
  Dado que se proporciona PaginationDto sin parámetros
  Cuando se ejecuta validate()
  Entonces page tiene valor por defecto 1
  Y limit tiene valor por defecto 10

@application @dto @validation @pagination @critico @happy-path
Escenario: Valores de paginación personalizados
  Dado que se proporciona PaginationDto con page=2 y limit=20
  Cuando se ejecuta validate()
  Entonces se aceptan los valores proporcionados

@application @dto @validation @pagination @error-path
Escenario: Valores negativos en paginación
  Dado que se proporciona PaginationDto con page=-1
  Cuando se ejecuta validate()
  Entonces se retorna error de valor negativo

@application @dto @validation @pagination @error-path
Escenario: Límite máximo excedido
  Dado que se proporciona PaginationDto con limit=1000
  Cuando se ejecuta validate() con máximo permitido 100
  Entonces se retorna error de límite excedido

---

## HU-06: Tests E2E de Controllers

### Feature: GirosController E2E - Endpoints HTTP

@presentation @e2e @giro @controller @critico @happy-path
Escenario: Crear giro mediante POST /giros
  Dado que la aplicación NestJS está ejecutándose
  Cuando se envía POST /giros con datos válidos
  Entonces se retorna status 201 Created
  Y el body contiene el giro creado con id generado
  Y el giro tiene activo=true

@presentation @e2e @giro @controller @critico @error-path
Escenario: Validación fallida en POST /giros
  Dado que se envían datos inválidos (clave vacía)
  Cuando se envía POST /giros
  Entonces se retorna status 400 Bad Request
  Y el body contiene errores de validación

@presentation @e2e @giro @controller @critico @happy-path
Escenario: Listar giros con paginación
  Dado que existen giros en el sistema
  Cuando se envía GET /giros?page=1&limit=10
  Entonces se retorna status 200 OK
  Y el body contiene items (array) y total (número)

@presentation @e2e @giro @controller @critico @happy-path
Escenario: Obtener giro por id existente
  Dado que existe un giro con id conocido
  Cuando se envía GET /giros/{id}
  Entonces se retorna status 200 OK
  Y el body contiene los datos del giro

@presentation @e2e @giro @controller @critico @error-path
Escenario: Obtener giro por id inexistente
  Dado que se proporciona un id que no existe
  Cuando se envía GET /giros/{id}
  Entonces se retorna status 404 Not Found

@presentation @e2e @giro @controller @critico @happy-path
Escenario: Buscar giros por query
  Dado que existen giros con descripciones variadas
  Cuando se envía GET /giros/search?q=Comercio
  Entonces se retorna status 200 OK
  Y el body contiene resultados filtrados

@presentation @e2e @giro @controller @critico @happy-path
Escenario: Actualizar giro mediante PATCH
  Dado que existe un giro con id conocido
  Cuando se envía PATCH /giros/{id} con datos parciales
  Entonces se retorna status 200 OK
  Y el body contiene el giro actualizado

@presentation @e2e @giro @controller @critico @error-path
Escenario: Actualizar giro inexistente
  Dado que se proporciona un id que no existe
  Cuando se envía PATCH /giros/{id}
  Entonces se retorna status 404 Not Found

@presentation @e2e @giro @controller @critico @happy-path
Escenario: Eliminar giro mediante DELETE
  Dado que existe un giro con id conocido
  Cuando se envía DELETE /giros/{id}
  Entonces se retorna status 200 OK
  Y el giro queda inactivo

@presentation @e2e @giro @controller @critico @error-path
Escenario: Eliminar giro inexistente
  Dado que se proporciona un id que no existe
  Cuando se envía DELETE /giros/{id}
  Entonces se retorna status 404 Not Found

---

### Feature: AgentesController E2E - Endpoints HTTP

@presentation @e2e @agente @controller @critico @happy-path
Escenario: Crear agente mediante POST /agentes
  Dado que se proporcionan datos válidos de agente
  Cuando se envía POST /agentes
  Entonces se retorna status 201 Created
  Y el body contiene el agente creado

@presentation @e2e @agente @controller @critico @error-path
Escenario: Conflicto al crear agente duplicado
  Dado que existe un agente con código "AGT-001"
  Cuando se envía POST /agentes con el mismo código
  Entonces se retorna status 409 Conflict

@presentation @e2e @agente @controller @critico @happy-path
Escenario: Listar agentes con paginación
  Dado que existen agentes en el sistema
  Cuando se envía GET /agentes?page=1&limit=10
  Entonces se retorna status 200 OK con resultados paginados

@presentation @e2e @agente @controller @critico @happy-path
Escenario: Buscar agentes por query
  Dado que existen agentes con nombres variados
  Cuando se envía GET /agentes/search?q=Test
  Entonces se retornan resultados filtrados

@presentation @e2e @agente @controller @critico @happy-path
Escenario: Filtrar agentes por oficina
  Dado que existen agentes asignados a oficinas
  Cuando se envía GET /agentes/by-oficina/{oficinaId}
  Entonces se retornan solo los agentes de esa oficina

@presentation @e2e @agente @controller @critico @happy-path
Escenario: Actualizar agente mediante PATCH
  Dado que existe un agente con id conocido
  Cuando se envía PATCH /agentes/{id}
  Entonces se retorna el agente actualizado

@presentation @e2e @agente @controller @critico @happy-path
Escenario: Eliminar agente mediante DELETE
  Dado que existe un agente con id conocido
  Cuando se envía DELETE /agentes/{id}
  Entonces se retorna status 200 OK

---

### Feature: SuscriptoresController E2E - Endpoints HTTP

@presentation @e2e @suscriptor @controller @critico @happy-path
Escenario: CRUD completo de suscriptores
  Dado que se tienen datos de suscriptor
  Cuando se ejecutan POST, GET, PATCH, DELETE /suscriptores
  Entonces todas las operaciones retornan status correctos
  Y los datos se mantienen consistentes

@presentation @e2e @suscriptor @controller @critico @happy-path
Escenario: Crear suscriptor mediante POST
  Dado que se proporcionan datos válidos
  Cuando se envía POST /suscriptores
  Entonces se retorna status 201 Created

@presentation @e2e @suscriptor @controller @critico @happy-path
Escenario: Buscar suscriptores
  Dado que existen suscriptores en el sistema
  Cuando se envía GET /suscriptores/search?q=Nombre
  Entonces se retornan resultados coincidentes

@presentation @e2e @suscriptor @controller @critico @happy-path
Escenario: Actualizar suscriptor
  Dado que existe un suscriptor
  Cuando se envía PATCH /suscriptores/{id}
  Entonces se retorna el suscriptor actualizado

@presentation @e2e @suscriptor @controller @critico @happy-path
Escenario: Eliminar suscriptor
  Dado que existe un suscriptor
  Cuando se envía DELETE /suscriptores/{id}
  Entonces se retorna status 200 OK

---

### Feature: OficinasController E2E - Endpoints HTTP

@presentation @e2e @oficina @controller @critico @happy-path
Escenario: CRUD completo de oficinas
  Dado que se tienen datos de oficina
  Cuando se ejecutan operaciones CRUD HTTP
  Entonces todas funcionan correctamente

@presentation @e2e @oficina @controller @critico @happy-path
Escenario: Crear oficina mediante POST
  Dado que se proporcionan datos válidos
  Cuando se envía POST /oficinas
  Entonces se retorna status 201 Created

@presentation @e2e @oficina @controller @critico @happy-path
Escenario: Filtrar oficinas por estado
  Dado que existen oficinas en diferentes estados
  Cuando se envía GET /oficinas/by-estado/{estado}
  Entonces se retornan oficinas del estado especificado

@presentation @e2e @oficina @controller @critico @happy-path
Escenario: Buscar oficinas
  Dado que existen oficinas en el sistema
  Cuando se envía GET /oficinas/search?q=Oficina
  Entonces se retornan resultados coincidentes

@presentation @e2e @oficina @controller @critico @happy-path
Escenario: Actualizar oficina
  Dado que existe una oficina
  Cuando se envía PATCH /oficinas/{id}
  Entonces se retorna la oficina actualizada

@presentation @e2e @oficina @controller @critico @happy-path
Escenario: Eliminar oficina
  Dado que existe una oficina
  Cuando se envía DELETE /oficinas/{id}
  Entonces se retorna status 200 OK

---

## Datos de Prueba Sintéticos

### Giros - Datos de Prueba

| Campo | Válido | Inválido | Borde | Notas |
|-------|--------|----------|-------|-------|
| clave | "COM-001" | "" | "X" (1 char) | Requerido |
| descripcion | "Comercio al por mayor" | "" | null | Requerido |
| sector | "Retail" | null | 255 chars | Opcional |
| riesgo | "MEDIO" | "INVALIDO" | "" | Default: MEDIO |
| activo | true | null | false | Default: true |

### Agentes - Datos de Prueba

| Campo | Válido | Inválido | Borde | Notas |
|-------|--------|----------|-------|-------|
| codigo | "AGT-001" | "" | 256 chars | Requerido, único |
| nombre | "Juan Pérez" | "" | 255 chars | Requerido |
| email | "juan@test.com" | "invalid" | null | Opcional, formato email |
| telefono | "555-1234" | "abc" | null | Opcional |
| oficinaId | "uuid-oficina" | "invalid-uuid" | null | Opcional, referencia |
| activo | true | null | false | Default: true |

### Suscriptores - Datos de Prueba

| Campo | Válido | Inválido | Borde | Notas |
|-------|--------|----------|-------|-------|
| codigo | "SUB-001" | "" | 256 chars | Requerido, único |
| nombre | "Suscriptor Test" | "" | 255 chars | Requerido |
| tipo | "PREMIUM" | "INVALIDO" | null | Opcional |
| activo | true | null | false | Default: true |

### Oficinas - Datos de Prueba

| Campo | Válido | Inválido | Borde | Notas |
|-------|--------|----------|-------|-------|
| codigo | "OF-001" | "" | 256 chars | Requerido, único |
| nombre | "Oficina Principal" | "" | 255 chars | Requerido |
| ciudad | "Ciudad de México" | "" | null | Opcional |
| estado | "CDMX" | "" | null | Opcional |
| activo | true | null | false | Default: true |

### Paginación - Datos de Prueba

| Campo | Válido | Inválido | Borde | Notas |
|-------|--------|----------|-------|-------|
| page | 1, 2, 100 | -1, 0 | 999999 | Default: 1 |
| limit | 10, 20, 50 | -5, 0 | 1000 | Default: 10, Max: 100 |

---

## Fixtures Recomendados

### Fixture: Giros

```typescript
export const girosFixtures = {
  validGiro: {
    clave: 'COM-001',
    descripcion: 'Comercio al por mayor',
    sector: 'Mayorista',
    riesgo: 'MEDIO',
    activo: true,
  },
  validGiroMin: {
    clave: 'MIN-001',
    descripcion: 'Giro mínimo',
  },
  giroAltoRiesgo: {
    clave: 'HIGH-001',
    descripcion: 'Comercio de químicos',
    sector: 'Química',
    riesgo: 'ALTO',
  },
  giroBajoRiesgo: {
    clave: 'LOW-001',
    descripcion: 'Oficina administrativa',
    sector: 'Servicios',
    riesgo: 'BAJO',
  },
  giroForUpdate: {
    clave: 'UPDATE-001',
    descripcion: 'Giro para actualizar',
    sector: 'Original',
  },
};
```

### Fixture: Agentes

```typescript
export const agentesFixtures = {
  validAgente: {
    codigo: 'AGT-001',
    nombre: 'Agente Test',
    email: 'agente@test.com',
    telefono: '555-1234',
    oficinaId: 'oficina-uuid-001',
  },
  validAgenteMin: {
    codigo: 'AGT-MIN',
    nombre: 'Agente Mínimo',
  },
  agenteSinOficina: {
    codigo: 'AGT-NO-OFI',
    nombre: 'Agente Sin Oficina',
    email: null,
    telefono: null,
    oficinaId: null,
  },
};
```

### Fixture: Suscriptores

```typescript
export const suscriptoresFixtures = {
  validSuscriptor: {
    codigo: 'SUB-001',
    nombre: 'Suscriptor Test',
    tipo: 'STANDARD',
  },
  suscriptorSinTipo: {
    codigo: 'SUB-NO-TYPE',
    nombre: 'Suscriptor Sin Tipo',
    tipo: null,
  },
};
```

### Fixture: Oficinas

```typescript
export const oficinasFixtures = {
  validOficina: {
    codigo: 'OF-001',
    nombre: 'Oficina Principal',
    ciudad: 'Ciudad de México',
    estado: 'CDMX',
  },
  validOficinaMin: {
    codigo: 'OF-MIN',
    nombre: 'Oficina Mínima',
  },
  oficinaSinUbicacion: {
    codigo: 'OF-NO-LOC',
    nombre: 'Oficina Sin Ubicación',
    ciudad: null,
    estado: null,
  },
};
```

---

## Priorización de Escenarios para Automatización

### Prioridad Alta (Ejecutar primero)
- [ ] HU-01: Domain Entities - create() con valores por defecto
- [ ] HU-02: Application Use Cases - Create + Conflict
- [ ] HU-03: Infrastructure - CRUD básico con TestContainers
- [ ] HU-04: Mappers - Conversión bidireccional
- [ ] HU-05: DTOs - Validaciones requeridas
- [ ] HU-06: Controllers - POST 201 y GET 200

### Prioridad Media
- [ ] HU-01: Domain Entities - update(), deactivate(), activate()
- [ ] HU-02: Application - Update, Get, Search, Delete
- [ ] HU-03: Infrastructure - Búsquedas paginadas
- [ ] HU-06: Controllers - Paginación y búsqueda

### Prioridad Baja (Regresión)
- [ ] HU-01: Domain Entities - Casos borde
- [ ] HU-05: DTOs - Validaciones de paginación
- [ ] HU-06: Controllers - Error paths completos

---

*Documento generado por gherkin-case-generator skill - ASDD Framework*
