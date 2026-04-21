package com.segurax.questions;

import com.segurax.targets.PropertyDetailsTargets;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;
import net.serenitybdd.screenplay.questions.Text;

/**
 * Question para obtener el estado de un inmueble específico.
 *
 * @author QA Team - ASDD
 * @version 1.0.0
 * @see Question
 */
public class ElEstadoDelInmueble implements Question<String> {

    private final int numero;

    private ElEstadoDelInmueble(int numero) {
        this.numero = numero;
    }

    public static ElEstadoDelInmuebleBuilder numero(int numero) {
        return new ElEstadoDelInmuebleBuilder(numero);
    }

    @Override
    public String answeredBy(Actor actor) {
        return Text.of(PropertyDetailsTargets.estadoInmueble(String.valueOf(numero)))
            .answeredBy(actor);
    }

    public static class ElEstadoDelInmuebleBuilder {
        private final int numero;

        public ElEstadoDelInmuebleBuilder(int numero) {
            this.numero = numero;
        }

        public ElEstadoDelInmueble mostrado() {
            return new ElEstadoDelInmueble(numero);
        }
    }
}
