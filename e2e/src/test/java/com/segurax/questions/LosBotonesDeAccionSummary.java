package com.segurax.questions;

import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;
import net.serenitybdd.screenplay.targets.Target;

/**
 * Question para verificar los botones de acción en la página de resumen.
 *
 * @author QA Team - ASDD
 * @version 1.0.0
 * @since MF6
 */
public class LosBotonesDeAccionSummary implements Question<Boolean> {

    private final String nombreBoton;

    private static final Target BOTON_RECALCULAR = Target.the("Botón Recalcular")
            .locatedBy("//button[contains(text(), 'Recalcular')]");

    private static final Target BOTON_DESCARGAR = Target.the("Botón Descargar")
            .locatedBy("//button[contains(text(), 'Descargar')]");

    private static final Target BOTON_NUEVA_COTIZACION = Target.the("Botón Nueva Cotización")
            .locatedBy("//button[contains(text(), 'Nueva Cotización')]");

    public LosBotonesDeAccionSummary(String nombreBoton) {
        this.nombreBoton = nombreBoton;
    }

    public static LosBotonesDeAccionSummary elBoton(String nombreBoton) {
        return new LosBotonesDeAccionSummary(nombreBoton);
    }

    public static LosBotonesDeAccionSummary estanHabilitados() {
        return new LosBotonesDeAccionSummary("TODOS");
    }

    @Override
    public Boolean answeredBy(Actor actor) {
        return BOTON_RECALCULAR.resolveFor(actor).isEnabled() &&
               BOTON_DESCARGAR.resolveFor(actor).isEnabled() &&
               BOTON_NUEVA_COTIZACION.resolveFor(actor).isEnabled();
    }

    public static Question<Boolean> estaHabilitado(String nombreBoton) {
        return actor -> {
            Target boton = Target.the("Botón " + nombreBoton)
                    .locatedBy("//button[contains(text(), '" + nombreBoton + "')]");
            return boton.resolveFor(actor).isEnabled();
        };
    }
}
