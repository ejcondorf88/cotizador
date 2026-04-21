package com.segurax.questions;

import com.segurax.targets.QuotePageTargets;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;
import net.serenitybdd.screenplay.questions.Text;

/**
 * Question para verificar el estado de la cotización.
 *
 * <p>Obtiene el texto del badge de estado de la cotización actual.</p>
 *
 * @author QA Team - ASDD
 * @version 1.0.0
 * @see Question
 */
public class ElEstadoDeLaCotizacion implements Question<String> {

    /**
     * Factory method para crear la question.
     *
     * @return Question configurada
     */
    public static ElEstadoDeLaCotizacion mostrado() {
        return new ElEstadoDeLaCotizacion();
    }

    @Override
    public String answeredBy(Actor actor) {
        return Text.of(QuotePageTargets.BADGE_ESTADO_COTIZACION).answeredBy(actor);
    }
}
