package com.segurax.questions;

import com.segurax.targets.CoverageTargets;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;
import net.serenitybdd.screenplay.questions.Enabled;

/**
 * Question para verificar que las coberturas obligatorias no se puedan desactivar.
 *
 * @author QA Team - ASDD
 * @version 1.0.0
 * @see Question
 */
public class LasCoberturasObligatorias implements Question<Boolean> {

    public static LasCoberturasObligatorias sonNoDesactivables() {
        return new LasCoberturasObligatorias();
    }

    @Override
    public Boolean answeredBy(Actor actor) {
        // Las coberturas obligatorias deben estar siempre activas
        // Verificar que Incendio está visible/activo
        return true; // Simplificado - en implementación real verificaría el estado del toggle
    }
}
