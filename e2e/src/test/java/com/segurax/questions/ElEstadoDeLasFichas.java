package com.segurax.questions;

import com.segurax.targets.PropertyDetailsTargets;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;
import net.serenitybdd.screenplay.questions.Text;

import java.util.ArrayList;
import java.util.List;

/**
 * Question para obtener los estados de todas las fichas.
 *
 * @author QA Team - ASDD
 * @version 1.0.0
 * @see Question
 */
public class ElEstadoDeLasFichas implements Question<List<String>> {

    public static ElEstadoDeLasFichas todos() {
        return new ElEstadoDeLasFichas();
    }

    @Override
    public List<String> answeredBy(Actor actor) {
        List<String> estados = new ArrayList<>();

        // Intentar obtener estados de las primeras 5 fichas
        for (int i = 1; i <= 5; i++) {
            try {
                String estado = Text.of(PropertyDetailsTargets.estadoInmueble(String.valueOf(i)))
                    .answeredBy(actor);
                if (estado != null && !estado.isEmpty()) {
                    estados.add(estado);
                }
            } catch (Exception e) {
                // No hay más fichas
                break;
            }
        }

        return estados;
    }
}
