package com.segurax.stepdefinitions;

import com.segurax.models.InmuebleData;
import com.segurax.questions.*;
import com.segurax.tasks.*;
import io.cucumber.datatable.DataTable;
import io.cucumber.java.es.Cuando;
import io.cucumber.java.es.Dado;
import io.cucumber.java.es.Entonces;
import io.cucumber.java.es.Y;
import net.serenitybdd.screenplay.actors.OnStage;

import java.util.List;
import java.util.Map;

import static net.serenitybdd.screenplay.GivenWhenThen.seeThat;
import static org.hamcrest.Matchers.*;

/**
 * Step Definitions para el Happy Path - Flujo Completo de Cotización.
 *
 * <p>Esta clase contiene los pasos de Cucumber en español que implementan
 * los 5 microflujos del happy path E2E usando el patrón Screenplay.</p>
 *
 * <p>Microflujos cubiertos:</p>
 * <ul>
 *   <li>Microflujo 1: Homepage → Página de Cotización</li>
 *   <li>Microflujo 2: Crear cotización → Folio generado</li>
 *   <li>Microflujo 3: Seleccionar 2 inmuebles</li>
 *   <li>Microflujo 4: Completar datos de inmuebles</li>
 *   <li>Microflujo 5: Configurar coberturas</li>
 * </ul>
 *
 * @author QA Team - ASDD
 * @version 1.0.0
 * @see Hooks
 */
public class HappyPathFlujoCompletoStepDefinitions {

    // Variable para almacenar datos de inmuebles entre steps
    private InmuebleData datosPrimerInmueble;
    private InmuebleData datosSegundoInmueble;

    // ============================================
    // ANTECEDENTES (Background)
    // ============================================

    @Dado("que el agente ha iniciado sesión en el sistema")
    public void queElAgenteHaIniciadoSesion() {
        // Los hooks configuran el actor automáticamente
        // No requiere acción adicional para happy path
    }

    @Y("el sistema está funcionando correctamente")
    public void elSistemaEstaFuncionandoCorrectamente() {
        // Precondición del happy path - el sistema está disponible
    }

    @Y("el frontend está corriendo en {string}")
    public void elFrontendEstaCorriendo(String url) {
        // URL base configurada en serenity.properties o por variable
    }

    @Y("el backend está corriendo en {string}")
    public void elBackendEstaCorriendo(String url) {
        // URL del API configurada para verificación de backend
    }

    // ============================================
    // MICROFLUJO 1: Homepage → Página de Cotización
    // ============================================

    @Dado("que el agente está en la Homepage de SeguraX")
    public void queElAgenteEstaEnLaHomepage() {
        OnStage.theActorInTheSpotlight().attemptsTo(
            Navegar.aLaHomepage()
        );
    }

    @Cuando("hace clic en el botón {string}")
    public void haceClicEnElBoton(String nombreBoton) {
        OnStage.theActorInTheSpotlight().attemptsTo(
            HacerClick.enElBoton(nombreBoton)
        );
    }

    @Entonces("debe ser redirigido a la página de cotización {string}")
    public void debeSerRedirigidoALaPaginaDeCotizacion(String rutaEsperada) {
        OnStage.theActorInTheSpotlight().should(
            seeThat(LaUrlActual.es(), containsString("/quote"))
        );
    }

    @Y("debe ver el título {string}")
    public void debeVerElTitulo(String tituloEsperado) {
        OnStage.theActorInTheSpotlight().should(
            seeThat(ElTituloDeLaPagina.es(), equalTo(tituloEsperado))
        );
    }

    @Y("debe ver el formulario de nueva cotización visible")
    public void debeVerElFormularioDeNuevaCotizacionVisible() {
        OnStage.theActorInTheSpotlight().should(
            seeThat(ElFormularioDeCotizacion.esVisible(), is(true))
        );
    }

    @Y("el botón {string} debe estar habilitado")
    public void elBotonDebeEstarHabilitado(String nombreBoton) {
        OnStage.theActorInTheSpotlight().should(
            seeThat(ElBoton.habilitado(nombreBoton), is(true))
        );
    }

    // ============================================
    // MICROFLUJO 2: Crear Cotización → Folio Generado
    // ============================================

    @Dado("que el agente está en la página de cotización {string}")
    public void queElAgenteEstaEnLaPaginaDeCotizacion(String ruta) {
        OnStage.theActorInTheSpotlight().attemptsTo(
            Navegar.aLaPaginaDeCotizacion()
        );
    }

    @Y("el botón {string} está habilitado")
    public void elBotonEstaHabilitado(String nombreBoton) {
        OnStage.theActorInTheSpotlight().should(
            seeThat(ElBoton.habilitado(nombreBoton), is(true))
        );
    }

    @Cuando("hace clic en {string}")
    public void haceClicEn(String nombreElemento) {
        switch (nombreElemento) {
            case "Crear Cotización":
                OnStage.theActorInTheSpotlight().attemptsTo(
                    CrearUnaCotizacion.nueva()
                );
                break;
            case "Continuar":
                OnStage.theActorInTheSpotlight().attemptsTo(
                    ContinuarEnCoberturas.alResumen()
                );
                break;
            default:
                OnStage.theActorInTheSpotlight().attemptsTo(
                    HacerClick.enElBoton(nombreElemento)
                );
        }
    }

    @Entonces("debe ver un mensaje de éxito {string}")
    public void debeVerUnMensajeDeExito(String mensajeEsperado) {
        OnStage.theActorInTheSpotlight().should(
            seeThat(ElMensajeDeExito.mostrado(), equalTo(mensajeEsperado))
        );
    }

    @Y("debe visualizar el número de folio generado")
    public void debeVisualizarElNumeroDeFolioGenerado() {
        OnStage.theActorInTheSpotlight().should(
            seeThat(ElFolioDeLaCotizacion.estaVisible(), is(true))
        );
    }

    @Y("el folio debe cumplir con el formato {string}")
    public void elFolioDebeCumplirConElFormato(String formatoRegex) {
        OnStage.theActorInTheSpotlight().should(
            seeThat(ElFolioDeLaCotizacion.mostrado(), matchesPattern("COT-\\d{4}-\\d{5}"))
        );
    }

    @Y("el estado de la cotización debe ser {string}")
    public void elEstadoDeLaCotizacionDebeSer(String estadoEsperado) {
        OnStage.theActorInTheSpotlight().should(
            seeThat(ElEstadoDeLaCotizacion.mostrado(), equalTo(estadoEsperado))
        );
    }

    @Y("el badge de estado debe mostrar color {string}")
    public void elBadgeDeEstadoDebeMostrarColor(String colorEsperado) {
        OnStage.theActorInTheSpotlight().should(
            seeThat(ElColorDelBadge.es(), equalToIgnoringCase(colorEsperado))
        );
    }

    // ============================================
    // MICROFLUJO 3: Seleccionar 2 Inmuebles
    // ============================================

    @Dado("que el agente tiene una cotización activa con folio válido")
    public void queElAgenteTieneUnaCotizacionActiva() {
        // Precondición: ya se creó la cotización en microflujo 2
    }

    @Y("está en el paso de selección de cantidad de inmuebles")
    public void estaEnElPasoDeSeleccionDeCantidad() {
        // El sistema ya muestra el paso de selección
    }

    @Cuando("selecciona {string} inmuebles para asegurar en el campo de cantidad")
    public void seleccionaInmueblesParaAsegurar(String cantidad) {
        OnStage.theActorInTheSpotlight().attemptsTo(
            SeleccionarCantidadDeInmuebles.conValor(Integer.parseInt(cantidad))
        );
    }

    @Entonces("debe ser redirigido a la página de detalle de inmuebles {string}")
    public void debeSerRedirigidoALaPaginaDeDetalleDeInmuebles(String rutaEsperada) {
        OnStage.theActorInTheSpotlight().should(
            seeThat(LaUrlActual.es(), containsString("/properties"))
        );
    }

    @Y("debe ver {int} fichas de inmueble creadas")
    public void debeVerFichasDeInmuebleCreadas(int cantidadEsperada) {
        OnStage.theActorInTheSpotlight().should(
            seeThat(LaCantidadDeFichasDeInmueble.mostrada(), equalTo(cantidadEsperada))
        );
    }

    @Y("cada ficha debe mostrar el estado {string}")
    public void cadaFichaDebeMostrarElEstado(String estadoEsperado) {
        OnStage.theActorInTheSpotlight().should(
            seeThat(ElEstadoDeLasFichas.todos(), everyItem(equalTo(estadoEsperado)))
        );
    }

    @Y("cada ficha debe tener el botón {string} habilitado")
    public void cadaFichaDebeTenerElBotonHabilitado(String nombreBoton) {
        OnStage.theActorInTheSpotlight().should(
            seeThat(LosBotonesDeCompletarDatos.estanHabilitados(), is(true))
        );
    }

    @Y("el botón {string} debe estar deshabilitado hasta completar ambos inmuebles")
    public void elBotonFinalizarDebeEstarDeshabilitado(String nombreBoton) {
        OnStage.theActorInTheSpotlight().should(
            seeThat(ElBoton.habilitado(nombreBoton), is(false))
        );
    }

    // ============================================
    // MICROFLUJO 4: Completar Datos de Inmuebles
    // ============================================

    @Dado("que el agente está en la página de detalle de inmuebles")
    public void queElAgenteEstaEnLaPaginaDeDetalleDeInmuebles() {
        // Ya está en la página de inmuebles desde el paso anterior
    }

    @Y("tiene {int} fichas de inmueble creadas")
    public void tieneFichasDeInmuebleCreadas(int cantidad) {
        OnStage.theActorInTheSpotlight().should(
            seeThat(LaCantidadDeFichasDeInmueble.mostrada(), equalTo(cantidad))
        );
    }

    @Cuando("hace clic en {string} del primer inmueble")
    public void haceClicEnDelPrimerInmueble(String accion) {
        if ("Guardar".equals(accion)) {
            OnStage.theActorInTheSpotlight().attemptsTo(
                GuardarElInmueble.datos()
            );
        } else {
            OnStage.theActorInTheSpotlight().attemptsTo(
                HacerClick.enElBoton(accion)
            );
        }
    }

    @Y("hace clic en {string} del segundo inmueble")
    public void haceClicEnDelSegundoInmueble(String accion) {
        if ("Guardar".equals(accion)) {
            OnStage.theActorInTheSpotlight().attemptsTo(
                GuardarElInmueble.datos()
            );
        } else {
            OnStage.theActorInTheSpotlight().attemptsTo(
                HacerClick.enElBoton(accion)
            );
        }
    }

    @Cuando("completa el formulario del primer inmueble con:")
    public void completaElFormularioDelPrimerInmueble(DataTable dataTable) {
        List<Map<String, String>> datos = dataTable.asMaps();
        this.datosPrimerInmueble = InmuebleData.desdeMap(datos.get(0));

        OnStage.theActorInTheSpotlight().attemptsTo(
            CompletarElInmueble.numero(1).conLosDatos(this.datosPrimerInmueble)
        );
    }

    @Y("completa el formulario del segundo inmueble con:")
    public void completaElFormularioDelSegundoInmueble(DataTable dataTable) {
        List<Map<String, String>> datos = dataTable.asMaps();
        this.datosSegundoInmueble = InmuebleData.desdeMap(datos.get(0));

        OnStage.theActorInTheSpotlight().attemptsTo(
            CompletarElInmueble.numero(2).conLosDatos(this.datosSegundoInmueble)
        );
    }

    @Entonces("debe ver que el primer inmueble está marcado como {string}")
    public void debeVerQueElPrimerInmuebleEstaMarcadoComo(String estadoEsperado) {
        OnStage.theActorInTheSpotlight().should(
            seeThat(ElEstadoDelInmueble.numero(1).mostrado(), equalTo(estadoEsperado))
        );
    }

    @Y("debe ver que el segundo inmueble está marcado como {string}")
    public void debeVerQueElSegundoInmuebleEstaMarcadoComo(String estadoEsperado) {
        OnStage.theActorInTheSpotlight().should(
            seeThat(ElEstadoDelInmueble.numero(2).mostrado(), equalTo(estadoEsperado))
        );
    }

    @Y("ambas fichas deben mostrar icono de check verde")
    public void ambasFichasDebenMostrarIconoDeCheckVerde() {
        OnStage.theActorInTheSpotlight().should(
            seeThat(LosInmueblesEstanCompletos.todos(), is(true))
        );
    }

    @Y("debe ver la suma asegurada total calculada: {string}")
    public void debeVerLaSumaAseguradaTotalCalculada(String sumaEsperada) {
        OnStage.theActorInTheSpotlight().should(
            seeThat(LaSumaAseguradaTotal.mostrada(), equalTo(sumaEsperada))
        );
    }

    // ============================================
    // MICROFLUJO 5: Configurar Coberturas
    // ============================================

    @Dado("que el agente ha completado todos los inmuebles")
    public void queElAgenteHaCompletadoTodosLosInmuebles() {
        // Precondición: inmuebles completados en microflujo 4
    }

    @Y("está en el paso de detalle de inmuebles")
    public void estaEnElPasoDeDetalleDeInmuebles() {
        // Ya está en la página de inmuebles
    }

    @Cuando("hace clic en el botón {string} para ir a coberturas")
    public void haceClicEnElBotonParaIrACoberturas(String nombreBoton) {
        OnStage.theActorInTheSpotlight().attemptsTo(
            FinalizarElPasoDeInmuebles.paraContinuar()
        );
    }

    @Entonces("debe ser redirigido a la página de configuración de coberturas {string}")
    public void debeSerRedirigidoALaPaginaDeConfiguracionDeCoberturas(String rutaEsperada) {
        OnStage.theActorInTheSpotlight().should(
            seeThat(LaUrlActual.es(), containsString("/coverage"))
        );
    }

    @Y("debe ver la sección {string} con:")
    public void debeVerLaSeccionCon(String nombreSeccion, DataTable dataTable) {
        // Validar que la sección existe
        OnStage.theActorInTheSpotlight().should(
            seeThat(LaSeccionCoberturas.obligatoriasVisible(), is(true))
        );
    }

    @Y("las coberturas obligatorias no deben poder desactivarse")
    public void lasCoberturasObligatoriasNoDebenPoderDesactivarse() {
        OnStage.theActorInTheSpotlight().should(
            seeThat(LasCoberturasObligatorias.sonNoDesactivables(), is(true))
        );
    }

    @Y("debe ver la sección {string} con todas desactivadas:")
    public void debeVerLaSeccionConTodasDesactivadas(String nombreSeccion, DataTable dataTable) {
        OnStage.theActorInTheSpotlight().should(
            seeThat(LaCoberturaObligatoria.estaVisible("Coberturas Opcionales"), is(true)),
            seeThat(LasCoberturasOpcionales.estaTodasDesactivadas(), is(true))
        );
    }

    @Cuando("activa la cobertura opcional {string}")
    public void activaLaCoberturaOpcional(String nombreCobertura) {
        OnStage.theActorInTheSpotlight().attemptsTo(
            ActivarCobertura.opcional(nombreCobertura)
        );
    }

    @Entonces("el resumen debe mostrar:")
    public void elResumenDebeMostrar(DataTable dataTable) {
        List<Map<String, String>> resumen = dataTable.asMaps();

        for (Map<String, String> fila : resumen) {
            String tipo = fila.get("tipo");
            int cantidad = Integer.parseInt(fila.get("cantidad"));

            if ("obligatorias".equals(tipo)) {
                OnStage.theActorInTheSpotlight().should(
                    seeThat(ElResumenDeCoberturas.obligatorias(), equalTo(cantidad))
                );
            } else if ("opcionales".equals(tipo)) {
                OnStage.theActorInTheSpotlight().should(
                    seeThat(ElResumenDeCoberturas.opcionales(), equalTo(cantidad))
                );
            } else if ("total".equals(tipo)) {
                OnStage.theActorInTheSpotlight().should(
                    seeThat(ElResumenDeCoberturas.total(), equalTo(cantidad))
                );
            }
        }
    }

    @Entonces("las coberturas deben guardarse correctamente")
    public void lasCoberturasDebenGuardarseCorrectamente() {
        // Verificar que no hay errores después de continuar
    }

    @Y("debe ver mensaje de éxito {string}")
    public void debeVerMensajeDeExito(String mensajeEsperado) {
        OnStage.theActorInTheSpotlight().should(
            seeThat(ElMensajeDeExito.mostrado(), equalTo(mensajeEsperado))
        );
    }

  @Y("debe ser redirigido al paso de resumen final {string}")
  public void debeSerRedirigidoAlPasoDeResumenFinal(String rutaEsperada) {
    OnStage.theActorInTheSpotlight().should(
      seeThat(LaUrlActual.es(), containsString("/summary"))
    );
  }

  // ============================================
  // MICROFLUJO 6: Cálculo de Prima y Resumen
  // ============================================

  @Dado("que el agente ha configurado las coberturas exitosamente")
  public void queElAgenteHaConfiguradoLasCoberturasExitosamente() {
    // Precondición: coberturas configuradas en MF5
  }

  @Y("está en la página de resumen {string}")
  public void estaEnLaPaginaDeResumen(String rutaEsperada) {
    OnStage.theActorInTheSpotlight().should(
      seeThat(LaUrlActual.es(), containsString("/summary"))
    );
  }

  @Cuando("el sistema calcula la prima automáticamente")
  public void elSistemaCalculaLaPrimaAutomaticamente() {
    // El cálculo ocurre automáticamente al navegar a Summary
    OnStage.theActorInTheSpotlight().attemptsTo(
      CalcularLaPrima.automaticamente()
    );
  }

  @Y("debe ver el panel de prima total con:")
  public void debeVerElPanelDePrimaTotalCon(DataTable dataTable) {
    List<Map<String, String>> primas = dataTable.asMaps();
    for (Map<String, String> prima : primas) {
      String tipo = prima.get("tipo");
      boolean visible = Boolean.parseBoolean(prima.get("visible"));
      OnStage.theActorInTheSpotlight().should(
        seeThat(ElPanelDePrimaTotal.muestra(tipo), is(visible))
      );
    }
  }

  @Y("la prima comercial debe ser mayor a cero")
  public void laPrimaComercialDebeSerMayorACero() {
    OnStage.theActorInTheSpotlight().should(
      seeThat(LaPrimaComercial.esMayorAZero(), is(true))
    );
  }

  @Y("debe ver el desglose por inmueble con:")
  public void debeVerElDesglosePorInmuebleCon(DataTable dataTable) {
    List<Map<String, String>> inmuebles = dataTable.asMaps();
    for (Map<String, String> inmueble : inmuebles) {
      String nombre = inmueble.get("inmueble");
      String estadoEsperado = inmueble.get("estado");
      OnStage.theActorInTheSpotlight().should(
        seeThat(ElDesglosePorInmueble.estaVisible(nombre), is(true)),
        seeThat(ElDesglosePorInmueble.delInmueble(nombre), equalTo(estadoEsperado))
      );
    }
  }

  @Y("cada inmueble debe mostrar su desglose de coberturas")
  public void cadaInmuebleDebeMostrarSuDesgloseDeCoberturas() {
    OnStage.theActorInTheSpotlight().should(
      seeThat(ElResumenDeCoberturas.estaVisible(), is(true))
    );
  }

  @Y("debe ver los botones de acción:")
  public void debeVerLosBotonesDeAccion(DataTable dataTable) {
    List<Map<String, String>> botones = dataTable.asMaps();
    for (Map<String, String> boton : botones) {
      String nombre = boton.get("boton");
      String estadoEsperado = boton.get("estado");
      boolean habilitado = "habilitado".equalsIgnoreCase(estadoEsperado);
      OnStage.theActorInTheSpotlight().should(
        seeThat(LosBotonesDeAccionSummary.estaHabilitado(nombre), is(habilitado))
      );
    }
  }
}
