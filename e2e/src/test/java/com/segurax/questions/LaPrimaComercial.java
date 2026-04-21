package com.segurax.questions;

import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;
import net.serenitybdd.screenplay.targets.Target;

import java.math.BigDecimal;

/**
 * Question para obtener el valor de la prima comercial calculada.
 *
 * @author QA Team - ASDD
 * @version 1.0.0
 * @since MF6
 */
public class LaPrimaComercial implements Question<BigDecimal> {

    private static final Target VALOR_PRIMA_COMERCIAL = Target.the("Valor Prima Comercial")
            .locatedBy("//div[contains(@class, 'premium-panel')]//span[contains(@class, 'commercial-premium')]");

    public static LaPrimaComercial calculada() {
        return new LaPrimaComercial();
    }

    @Override
    public BigDecimal answeredBy(Actor actor) {
        String texto = VALOR_PRIMA_COMERCIAL.resolveFor(actor).getText();
        // Extraer número del formato "$X,XXX.XX MXN"
        String numeroLimpio = texto.replaceAll("[^\\d.]", "");
        return new BigDecimal(numeroLimpio);
    }

    public static Question<Boolean> esMayorAZero() {
        return actor -> {
            BigDecimal valor = LaPrimaComercial.calculada().answeredBy(actor);
            return valor.compareTo(BigDecimal.ZERO) > 0;
        };
    }
}
