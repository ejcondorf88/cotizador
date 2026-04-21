package com.segurax.questions;

import com.segurax.targets.CommonTargets;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;
import net.serenitybdd.screenplay.questions.Enabled;

/**
 * Question para verificar si un botón está habilitado.
 *
 * @author QA Team - ASDD
 * @version 1.0.0
 * @see Question
 */
public class ElBoton implements Question<Boolean> {

    private final String nombreBoton;

    private ElBoton(String nombreBoton) {
        this.nombreBoton = nombreBoton;
    }

    public static ElBoton habilitado(String nombreBoton) {
        return new ElBoton(nombreBoton);
    }

    @Override
    public Boolean answeredBy(Actor actor) {
        return Enabled.of(CommonTargets.botonConTexto(nombreBoton)).answeredBy(actor);
    }
}
