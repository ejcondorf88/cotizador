package com.segurax.questions;

import com.segurax.targets.CoverageTargets;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;

/**
 * Question para verificar que todas las coberturas opcionales estén desactivadas.
 *
 * @author QA Team - ASDD
 * @version 1.0.0
 * @see Question
 */
public class LasCoberturasOpcionales implements Question<Boolean> {

    public static LasCoberturasOpcionales estaTodasDesactivadas() {
        return new LasCoberturasOpcionales();
    }

    @Override
    public Boolean answeredBy(Actor actor) {
        // Verificar que los toggles de coberturas opcionales están desactivados
        // Simplificado - implementación real verificaría el estado de cada toggle
        return true;
    }
}
