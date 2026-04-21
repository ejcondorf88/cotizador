package com.segurax.questions;

import com.segurax.targets.CoverageTargets;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;
import net.serenitybdd.screenplay.questions.Visibility;

/**
 * Question para verificar visibilidad de coberturas obligatorias.
 *
 * @author QA Team - ASDD
 * @version 1.0.0
 * @see Question
 */
public class LaCoberturaObligatoria implements Question<Boolean> {

    private final String nombre;

    private LaCoberturaObligatoria(String nombre) {
        this.nombre = nombre;
    }

    public static LaCoberturaObligatoria estaVisible(String nombre) {
        return new LaCoberturaObligatoria(nombre);
    }

    @Override
    public Boolean answeredBy(Actor actor) {
        if ("Coberturas Opcionales".equals(nombre)) {
            return Visibility.of(CoverageTargets.SECCION_COBERTURAS_OPCIONALES).answeredBy(actor);
        }
        return Visibility.of(CoverageTargets.SECCION_COBERTURAS_OBLIGATORIAS).answeredBy(actor);
    }
}
