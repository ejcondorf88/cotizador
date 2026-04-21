package com.segurax.questions;

import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;
import net.serenitybdd.screenplay.targets.Target;

/**
 * Question para verificar el desglose de prima por inmueble.
 *
 * @author QA Team - ASDD
 * @version 1.0.0
 * @since MF6
 */
public class ElDesglosePorInmueble implements Question<String> {

    private final String nombreInmueble;

    private static final Target CARD_INMUEBLE = Target.the("Card del Inmueble")
            .locatedBy("//div[contains(@class, 'property-card')]//h3[contains(text(), '{0}')]");

    private static final Target ESTADO_INMUEBLE = Target.the("Estado del Inmueble")
            .locatedBy("//div[contains(@class, 'property-card')]//h3[contains(text(), '{0}')]/following-sibling::span[contains(@class, 'badge')]");

    private static final Target TABLA_DESGLOSE = Target.the("Tabla de Desglose")
            .locatedBy("//div[contains(@class, 'property-card')]//h3[contains(text(), '{0}')]/ancestor::div[contains(@class, 'property-card')]//table");

    public ElDesglosePorInmueble(String nombreInmueble) {
        this.nombreInmueble = nombreInmueble;
    }

    public static ElDesglosePorInmueble delInmueble(String nombreInmueble) {
        return new ElDesglosePorInmueble(nombreInmueble);
    }

    public static ElDesglosePorInmueble estaVisible(String nombreInmueble) {
        return new ElDesglosePorInmueble(nombreInmueble);
    }

    @Override
    public String answeredBy(Actor actor) {
        return ESTADO_INMUEBLE.resolveFor(actor).getText();
    }

    public Boolean estaVisible(Actor actor) {
        return CARD_INMUEBLE.of(nombreInmueble).resolveFor(actor).isVisible() &&
               TABLA_DESGLOSE.of(nombreInmueble).resolveFor(actor).isVisible();
    }
}
