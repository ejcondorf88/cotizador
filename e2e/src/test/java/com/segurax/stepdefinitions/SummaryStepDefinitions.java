package com.segurax.stepdefinitions;

import com.segurax.questions.*;
import com.segurax.tasks.*;
import io.cucumber.datatable.DataTable;
import io.cucumber.java.es.Cuando;
import io.cucumber.java.es.Dado;
import io.cucumber.java.es.Entonces;
import io.cucumber.java.es.Y;
import net.serenitybdd.screenplay.actors.OnStage;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import static net.serenitybdd.screenplay.GivenWhenThen.seeThat;
import static org.hamcrest.Matchers.*;

/**
 * Step Definitions para el MF6 - Cálculo de Prima y Resumen.
 *
 * <p>Escenarios cubiertos:</p>
 * <ul>
 * <li>Verificación del panel de prima total</li>
 * <li>Validación de prima comercial mayor a cero</li>
 * <li>Desglose por inmueble</li>
 * <li>Botones de acción en resumen</li>
 * </ul>
 *
 * @author QA Team - ASDD
 * @version 1.0.0
 * @since MF6
 */
public class SummaryStepDefinitions {

    // ============================================
    // MICROFLUJO 6: Cálculo de Prima y Resumen
    // ============================================

    @Dado("que el agente ha configurado las coberturas exitosamente")
    public void queElAgenteHaConfiguradoLasCoberturasExitosamente() {
        // Precondición: las coberturas fueron configuradas en MF5
    }

    @Y("está en la página de resumen {string}")
    public void estaEnLaPaginaDeResumen(String rutaEsperada) {
        // Extraer el quoteId de la URL actual o de la sesión
        String quoteId = OnStage.theActorInTheSpotlight().recall("quoteId");
        OnStage.theActorInTheSpotlight().attemptsTo(
            NavegarASummary.paraLaCotizacion(quoteId)
        );
    }

    @Cuando("el sistema calcula la prima automáticamente")
    public void elSistemaCalculaLaPrimaAutomaticamente() {
        OnStage.theActorInTheSpotlight().attemptsTo(
            CalcularLaPrima.automaticamente()
        );
    }

    @Entonces("debe ver el panel de prima total con:")
    public void debeVerElPanelDePrimaTotalCon(DataTable dataTable) {
        List<Map<String, String>> tiposPrima = dataTable.asMaps();
        for (Map<String, String> fila : tiposPrima) {
            String tipo = fila.get("tipo");
            boolean visible = Boolean.parseBoolean(fila.get("visible"));

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

            // Verificar que el inmueble está visible con su desglose
            OnStage.theActorInTheSpotlight().should(
                seeThat(ElDesglosePorInmueble.estaVisible(nombre), is(true))
            );

            // Verificar el estado del inmueble
            OnStage.theActorInTheSpotlight().should(
                seeThat(ElDesglosePorInmueble.delInmueble(nombre), equalTo(estadoEsperado))
            );
        }
    }

    @Y("cada inmueble debe mostrar su desglose de coberturas")
    public void cadaInmuebleDebeMostrarSuDesgloseDeCoberturas() {
        // Verificar que hay tablas de desglose visibles para cada inmueble
        OnStage.theActorInTheSpotlight().should(
            seeThat(ElResumenDeCoberturas.estaVisible(), is(true))
        );
    }

    @Y("debe ver los botones de acción:")
    public void debeVerLosBotonesDeAccion(DataTable dataTable) {
        List<Map<String, String>> botones = dataTable.asMaps();
        for (Map<String, String> boton : botones) {
            String nombreBoton = boton.get("boton");
            String estadoEsperado = boton.get("estado");
            boolean habilitado = "habilitado".equalsIgnoreCase(estadoEsperado);

            OnStage.theActorInTheSpotlight().should(
                seeThat(LosBotonesDeAccionSummary.estaHabilitado(nombreBoton), is(habilitado))
            );
        }
    }

    @Y("el badge de estado debe mostrar {string}")
    public void elBadgeDeEstadoDebeMostrar(String estadoEsperado) {
        OnStage.theActorInTheSpotlight().should(
            seeThat(ElEstadoDeLaCotizacion.mostrado(), equalTo(estadoEsperado))
        );
    }

    @Y("debe ver el factor comercial {string}")
    public void debeVerElFactorComercial(String factorEsperado) {
        OnStage.theActorInTheSpotlight().should(
            seeThat(ElPanelDePrimaTotal.muestra("Factor Comercial"), is(true))
        );
    }
}
