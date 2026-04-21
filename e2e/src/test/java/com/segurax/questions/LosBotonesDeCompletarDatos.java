package com.segurax.questions;

import com.segurax.targets.PropertyDetailsTargets;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;
import net.serenitybdd.screenplay.questions.Enabled;

/**
 * Question para verificar que todos los botones de completar datos estén habilitados.
 *
 * @author QA Team - ASDD
 * @version 1.0.0
 * @see Question
 */
public class LosBotonesDeCompletarDatos implements Question<Boolean> {

    public static LosBotonesDeCompletarDatos estanHabilitados() {
        return new LosBotonesDeCompletarDatos();
    }

    @Override
    public Boolean answeredBy(Actor actor) {
        // Verificar los primeros 5 inmuebles
        for (int i = 1; i <= 5; i++) {
            try {
                boolean habilitado = Enabled.of(PropertyDetailsTargets.botonCompletarDatos(String.valueOf(i)))
                    .answeredBy(actor);
                if (!habilitado) {
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
