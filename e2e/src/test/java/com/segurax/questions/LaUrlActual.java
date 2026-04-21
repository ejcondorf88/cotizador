package com.segurax.questions;

import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;
import net.serenitybdd.screenplay.abilities.BrowseTheWeb;

/**
 * Question para obtener la URL actual del navegador.
 *
 * <p>Permite verificar redirecciones y rutas en los tests E2E.</p>
 *
 * @author QA Team - ASDD
 * @version 1.0.0
 * @see Question
 */
public class LaUrlActual implements Question<String> {

    /**
     * Factory method para crear la question.
     *
     * @return Question configurada
     */
    public static LaUrlActual es() {
        return new LaUrlActual();
    }

    @Override
    public String answeredBy(Actor actor) {
        return BrowseTheWeb.as(actor).getDriver().getCurrentUrl();
    }
}
