package com.segurax.questions;

import com.segurax.targets.QuotePageTargets;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;
import net.serenitybdd.screenplay.questions.Visibility;

/**
 * Question para verificar visibilidad del formulario de cotización.
 *
 * @author QA Team - ASDD
 * @version 1.0.0
 * @see Question
 */
public class ElFormularioDeCotizacion implements Question<Boolean> {

    public static ElFormularioDeCotizacion esVisible() {
        return new ElFormularioDeCotizacion();
    }

    @Override
    public Boolean answeredBy(Actor actor) {
        return Visibility.of(QuotePageTargets.FORMULARIO_NUEVA_COTIZACION).answeredBy(actor);
    }
}
