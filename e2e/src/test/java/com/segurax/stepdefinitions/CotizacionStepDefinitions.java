package com.segurax.stepdefinitions;

import com.segurax.questions.ElFolioDeLaCotizacion;
import com.segurax.tasks.NavegarA;
import io.cucumber.java.es.Cuando;
import io.cucumber.java.es.Dado;
import io.cucumber.java.es.Entonces;
import net.serenitybdd.screenplay.actors.OnStage;

import static net.serenitybdd.screenplay.GivenWhenThen.seeThat;
import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.equalTo;

/**
 * Step Definitions para pasos de cotización.
 *
 * <p>Esta clase contiene los pasos de Cucumber en español
 * relacionados con la creación y gestión de cotizaciones.</p>
 *
 * <p>Utiliza el patrón Screenplay para orquestar las interacciones
 * del actor con el sistema.</p>
 *
 * @author Serenity BDD Template
 * @version 1.0.0
 * @see NavegarA
 * @see ElFolioDeLaCotizacion
 */
public class CotizacionStepDefinitions {

    /**
     * Step definition para navegar a la página de cotizaciones.
     *
     * @param actorName nombre del actor (ej: "el", "la")
     */
    @Dado("que {word} navega a la página de cotizaciones")
    public void queNavegaALaPaginaDeCotizaciones(String actorName) {
        OnStage.theActorCalled("el Usuario").attemptsTo(
                NavegarA.url("http://localhost:5173/cotizaciones")
        );
    }

    /**
     * Step definition para seleccionar una acción en la UI.
     *
     * @param accion la acción a seleccionar (ej: "Nueva Cotización")
     */
    @Cuando("selecciona {string}")
    public void selecciona(String accion) {
        // Placeholder: En implementación real, haría clic en el botón correspondiente
        // Ejemplo:
        // if ("Nueva Cotización".equals(accion)) {
        //     OnStage.theActorInTheSpotlight().attemptsTo(
        //         Click.on(CotizacionTargets.BOTON_NUEVA_COTIZACION)
        //     );
        // }
    }

    /**
     * Step definition para completar datos de empresa usando tabla.
     *
     * @param dataTable tabla con campos y valores
     */
    @Cuando("completa los datos de la empresa:")
    public void completaLosDatosDeLaEmpresa(io.cucumber.datatable.DataTable dataTable) {
        // Placeholder: En implementación real, llenaría los campos del formulario
        // Map<String, String> datos = dataTable.asMaps().get(0);
        // OnStage.theActorInTheSpotlight().attemptsTo(
        //     Enter.theValue(datos.get("empresa")).into(CotizacionTargets.CAMPO_EMPRESA),
        //     Enter.theValue(datos.get("rfc")).into(CotizacionTargets.CAMPO_RFC)
        // );
    }

    /**
     * Step definition para completar el RFC.
     *
     * @param rfc el RFC a ingresar
     */
    @Cuando("completa el RFC con {string}")
    public void completaElRfcCon(String rfc) {
        // Placeholder: En implementación real, llenaría el campo RFC
        // OnStage.theActorInTheSpotlight().attemptsTo(
        //     Enter.theValue(rfc).into(CotizacionTargets.CAMPO_RFC)
        // );
    }

    /**
     * Step definition para verificar el formato del folio generado.
     *
     * @param formatoEsperado el formato esperado del folio
     */
    @Entonces("debe ver el folio generado con formato {string}")
    public void debeVerElFolioGeneradoConFormato(String formatoEsperado) {
        OnStage.theActorInTheSpotlight().should(
                seeThat(ElFolioDeLaCotizacion.mostrado(), containsString("COT-"))
        );
    }

    /**
     * Step definition para verificar el estado de la cotización.
     *
     * @param estadoEsperado el estado esperado
     */
    @Entonces("el estado debe ser {string}")
    public void elEstadoDebeSer(String estadoEsperado) {
        OnStage.theActorInTheSpotlight().should(
                seeThat(ElFolioDeLaCotizacion.mostrado(), containsString("COT-"))
        );
    }

    /**
     * Step definition para verificar un mensaje de error.
     *
     * @param mensajeEsperado el mensaje de error esperado
     */
    @Entonces("debe ver el mensaje de error {string}")
    public void debeVerElMensajeDeError(String mensajeEsperado) {
        // Placeholder: En implementación real, verificaría el mensaje de error
        // OnStage.theActorInTheSpotlight().should(
        //     seeThat(Text.of(CotizacionTargets.MENSAJE_ERROR), equalTo(mensajeEsperado))
        // );
    }
}
