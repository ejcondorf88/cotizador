package com.segurax.questions;

import com.segurax.targets.CoverageTargets;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;
import net.serenitybdd.screenplay.questions.Visibility;

/**
 * Question para verificar visibilidad de secciones de coberturas.
 *
 * @author QA Team - ASDD
 * @version 1.0.0
 * @see Question
 */
public class LaSeccionCoberturas implements Question<Boolean> {

    public static LaSeccionCoberturas obligatoriasVisible() {
        return new LaSeccionCoberturas();
    }

    @Override
    public Boolean answeredBy(Actor actor) {
        return Visibility.of(CoverageTargets.SECCION_COBERTURAS_OBLIGATORIAS).answeredBy(actor);
    }
}
