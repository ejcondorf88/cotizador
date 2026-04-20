# language: es
@example @happy-path @ui @smoke
Característica: Crear Cotización
  Como usuario del cotizador
  Quiero crear una nueva cotización
  Para asegurar mis propiedades

  @ui @smoke
  Escenario: Crear una cotización exitosamente
    Dado que el navega a la página de cotizaciones
    Cuando selecciona "Nueva Cotización"
    Y completa los datos de la empresa:
      | campo   | valor         |
      | empresa | Mi Empresa SA |
      | rfc     | ABC123456789  |
      | giro    | Tecnología    |
    Entonces debe ver el folio generado con formato "COT-YYYY-NNNNN"
    Y el estado debe ser "DRAFT"

  @ui @error
  Escenario: Crear cotización con RFC inválido
    Dado que el navega a la página de cotizaciones
    Cuando selecciona "Nueva Cotización"
    Y completa el RFC con "RFCINVALIDO"
    Entonces debe ver el mensaje de error "RFC debe tener 12 o 13 caracteres"
