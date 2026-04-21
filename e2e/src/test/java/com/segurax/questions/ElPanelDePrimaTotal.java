package com.segurax.questions;

import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;
import net.serenitybdd.screenplay.targets.Target;

/**
 * Question para verificar que el panel de prima total muestra todos los elementos.
 *
 * @author QA Team - ASDD
 * @version 1.0.0
 * @since MF6
 */
public class ElPanelDePrimaTotal implements Question<Boolean> {

    private final String tipoPrima;

    private static final Target PANEL_PRIMA_NETA = Target.the("Panel Prima Neta")
            .locatedBy("//div[contains(@class, 'premium-panel')]//div[contains(text(), 'Prima Neta')]");

    private static final Target PANEL_FACTOR_COMERCIAL = Target.the("Panel Factor Comercial")
            .locatedBy("//div[contains(@class, 'premium-panel')]//div[contains(text(), 'Factor')]");

    private static final Target PANEL_PRIMA_COMERCIAL = Target.the("Panel Prima Comercial")
            .locatedBy("//div[contains(@class, 'premium-panel')]//div[contains(text(), 'Prima Comercial')]");

    public ElPanelDePrimaTotal(String tipoPrima) {
        this.tipoPrima = tipoPrima;
    }

    public static ElPanelDePrimaTotal muestra(String tipoPrima) {
        return new ElPanelDePrimaTotal(tipoPrima);
    }

    public static ElPanelDePrimaTotal estaVisible() {
        return new ElPanelDePrimaTotal("TODOS");
    }

    @Override
    public Boolean answeredBy(Actor actor) {
        return PANEL_PRIMA_NETA.resolveFor(actor).isVisible() &&
               PANEL_FACTOR_COMERCIAL.resolveFor(actor).isVisible() &&
               PANEL_PRIMA_COMERCIAL.resolveFor(actor).isVisible();
    }
}
