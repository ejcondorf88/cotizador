package com.segurax.questions;

import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;
import net.serenitybdd.screenplay.questions.page.TheWebPage;

/**
 * Question para obtener el título de la página actual.
 *
 * <p>Esta pregunta permite verificar el título de la página
 * mostrada en el navegador del actor.</p>
 *
 * <p>Usage example:</p>
 * <pre>
 * elActor.should(seeThat(ElTituloDeLaPagina.mostrado(), equalTo("Inicio")));
 * </pre>
 *
 * @author Serenity BDD Template
 * @version 1.0.0
 * @see Question
 */
public class ElTituloDeLaPagina implements Question<String> {

    /**
     * Default constructor.
     */
    public ElTituloDeLaPagina() {
    }

    /**
     * Factory method.
     *
     * @return instancia de ElTituloDeLaPagina
     */
    public static ElTituloDeLaPagina mostrado() {
        return new ElTituloDeLaPagina();
    }

    @Override
    public String answeredBy(Actor actor) {
        return TheWebPage.title().answeredBy(actor);
    }
}
