# language: es
@happy-path @e2e @critical @flujo-completo
Característica: Happy Path - Flujo Completo de Cotización hasta Coberturas
  Como agente de SeguraX
  Quiero completar el flujo completo de cotización
  Para crear una cotización con coberturas configuradas

  Antecedentes:
    Dado que el agente ha iniciado sesión en el sistema
    Y el sistema está funcionando correctamente
    Y el frontend está corriendo en "http://localhost:5173"
    Y el backend está corriendo en "http://localhost:3000"

  @microflujo-1 @homepage @navegacion @critical
  Escenario: Paso 1 - Acceder al cotizador desde la Homepage
    Dado que el agente está en la Homepage de SeguraX
    Cuando hace clic en el botón "Cotizar ahora"
    Entonces debe ser redirigido a la página de cotización "/quote"
    Y debe ver el título "Nueva Cotización"
    Y debe ver el formulario de nueva cotización visible
    Y el botón "Crear Cotización" debe estar habilitado

  @microflujo-2 @crear-cotizacion @folio @critical
  Escenario: Paso 2 - Crear una nueva cotización
    Dado que el agente está en la página de cotización "/quote"
    Y el botón "Crear Cotización" está habilitado
    Cuando hace clic en "Crear Cotización"
    Entonces debe ver un mensaje de éxito "Cotización creada exitosamente"
    Y debe visualizar el número de folio generado
    Y el folio debe cumplir con el formato "COT-YYYY-NNNNN"
    Y el estado de la cotización debe ser "BORRADOR"
    Y el badge de estado debe mostrar color "gris"

  @microflujo-3 @seleccion-inmuebles @cantidad @critical
  Escenario: Paso 3 - Seleccionar cantidad de inmuebles
    Dado que el agente tiene una cotización activa con folio válido
    Y está en el paso de selección de cantidad de inmuebles
    Cuando selecciona "2" inmuebles para asegurar en el campo de cantidad
    Y hace clic en el botón "Continuar"
    Entonces debe ser redirigido a la página de detalle de inmuebles "/quote/{id}/properties"
    Y debe ver 2 fichas de inmueble creadas
    Y cada ficha debe mostrar el estado "PENDIENTE"
    Y cada ficha debe tener el botón "Completar datos" habilitado
    Y el botón "Finalizar" debe estar deshabilitado hasta completar ambos inmuebles

  @microflujo-4 @completar-inmuebles @formularios @critical
  Escenario: Paso 4 - Completar datos de los inmuebles
    Dado que el agente está en la página de detalle de inmuebles
    Y tiene 2 fichas de inmueble creadas
    Cuando hace clic en "Completar datos" del primer inmueble
    Y completa el formulario del primer inmueble con:
      | campo              | valor                     |
      | nombre             | Oficinas Corporativas     |
      | calle              | Av. Reforma 100           |
      | cp                 | 06600                     |
      | estado             | CDMX                      |
      | ciudad             | Ciudad de México          |
      | colonia            | Juárez                    |
      | tipo_constructivo  | Concreto                  |
      | año_construccion   | 2015                      |
      | niveles            | 5                         |
      | uso                | Oficina                   |
      | giro               | Servicios de Tecnología   |
      | garantia_edificio  | 5000000                   |
      | garantia_contenidos| 2000000                   |
    Y hace clic en "Guardar" del primer inmueble
    Y hace clic en "Completar datos" del segundo inmueble
    Y completa el formulario del segundo inmueble con:
      | campo              | valor                     |
      | nombre             | Sucursal Norte            |
      | calle              | Av. Insurgentes 500       |
      | cp                 | 03100                     |
      | estado             | CDMX                      |
      | ciudad             | Ciudad de México          |
      | colonia            | Del Valle                 |
      | tipo_constructivo  | Acero                     |
      | año_construccion   | 2018                      |
      | niveles            | 3                         |
      | uso                | Comercial                 |
      | giro               | Tienda de Electrónicos    |
      | garantia_edificio  | 3000000                   |
      | garantia_contenidos| 1500000                   |
    Y hace clic en "Guardar" del segundo inmueble
    Entonces debe ver que el primer inmueble está marcado como "COMPLETADO"
    Y debe ver que el segundo inmueble está marcado como "COMPLETADO"
    Y ambas fichas deben mostrar icono de check verde
    Y debe ver la suma asegurada total calculada: "$ 11,500,000.00"
    Y el botón "Finalizar" debe estar habilitado

  @microflujo-5 @configurar-coberturas @coberturas @final @critical
  Escenario: Paso 5 - Configurar coberturas del seguro
    Dado que el agente ha completado todos los inmuebles
    Y está en el paso de detalle de inmuebles
    Cuando hace clic en el botón "Finalizar" para ir a coberturas
    Entonces debe ser redirigido a la página de configuración de coberturas "/quote/{id}/coverage"
    Y debe ver el título "Configuración de Coberturas"
    Y debe ver la sección "Coberturas Obligatorias" con:
      | cobertura | estado    |
      | Incendio  | Activa    |
      | CAT       | Activa    |
    Y las coberturas obligatorias no deben poder desactivarse
    Y debe ver la sección "Coberturas Opcionales" con todas desactivadas:
      | cobertura         | estado_inicial |
      | Cristales         | Desactivada    |
      | Daños por Agua    | Desactivada    |
      | Robo              | Desactivada    |
      | Remoción          | Desactivada    |
      | Equipo Electrónico| Desactivada    |
    Cuando activa la cobertura opcional "Cristales"
    Y activa la cobertura opcional "Daños por Agua"
    Y activa la cobertura opcional "Robo"
    Entonces el resumen debe mostrar:
      | tipo           | cantidad |
      | obligatorias   | 2        |
      | opcionales     | 3        |
      | total          | 5        |
    Cuando hace clic en "Continuar"
    Entonces las coberturas deben guardarse correctamente
    Y debe ver mensaje de éxito "Coberturas guardadas exitosamente"
    Y debe ser redirigido al paso de resumen final "/quote/{id}/summary"

  @microflujo-6 @calculo-prima @premium @mf6 @critical
  Escenario: Paso 6 - Calcular y ver resumen de prima
    Dado que el agente ha configurado las coberturas exitosamente
    Y está en la página de resumen "/quote/{id}/summary"
    Cuando el sistema calcula la prima automáticamente
    Entonces debe ver el título "Resumen de Cotización"
    Y debe ver el número de folio generado
    Y debe ver el estado "CALCULATED" en el badge
    Y debe ver el panel de prima total con:
      | tipo               | visible |
      | Prima Neta         | true    |
      | Factor Comercial   | true    |
      | Prima Comercial    | true    |
    Y la prima comercial debe ser mayor a cero
    Y debe ver el desglose por inmueble con:
      | inmueble           | estado      |
      | Oficinas Corporativas | CALCULATED |
      | Sucursal Norte     | CALCULATED |
    Y cada inmueble debe mostrar su desglose de coberturas
    Y debe ver los botones de acción:
      | boton              | estado      |
      | Recalcular         | habilitado  |
      | Descargar          | habilitado  |
      | Nueva Cotización   | habilitado  |
    Cuando hace clic en "Nueva Cotización"
    Entonces debe ser redirigido a la página de inicio "/quote"
