package com.segurax.questions;

import com.segurax.targets.PropertyDetailsTargets;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;
import net.serenitybdd.screenplay.questions.Presence;

/**
 * Question para verificar que todos los inmuebles tengan icono de check.
 *
 * @author QA Team - ASDD
 * @version 1.0.0
 * @see Question
 */
public class LosInmueblesEstanCompletos implements Question<Boolean> {

    public static LosInmueblesEstanCompletos todos() {
        return new LosInmueblesEstanCompletos();
    }

    @Override
    public Boolean answeredBy(Actor actor) {
        // Verificar los primeros 5 inmuebles
        for (int i = 1; i <= 5; i++) {
            try {
                boolean tieneCheck = Presence.of(PropertyDetailsTargets.iconoCheckInmueble(String.valueOf(i)))
                    .answeredBy(actor);
                if (!tieneCheck) {
                    return false;
                }
            } catch (Exception e) {
                // No hay más inmuebles
                break;
            }
        }
        return true;
    }
}
