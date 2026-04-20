package com.segurax.questions;

import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;

/**
 * Question para obtener el folio de la cotización creada.
 *
 * <p>Esta pregunta permite verificar el folio generado
 * después de crear una nueva cotización.</p>
 *
 * <p>Nota: Esta es una implementación placeholder. En una implementación
 * real, leería el valor de un elemento UI específico.</p>
 *
 * <p>Usage example:</p>
 * <pre>
 * elActor.should(seeThat(ElFolioDeLaCotizacion.mostrado(), containsString("COT-")));
 * </pre>
 *
 * @author Serenity BDD Template
 * @version 1.0.0
 * @see Question
 */
public class ElFolioDeLaCotizacion implements Question<String> {

    /**
     * Default constructor.
     */
    public ElFolioDeLaCotizacion() {
    }

    /**
     * Factory method.
     *
     * @return instancia de ElFolioDeLaCotizacion
     */
    public static ElFolioDeLaCotizacion mostrado() {
        return new ElFolioDeLaCotizacion();
    }

    @Override
    public String answeredBy(Actor actor) {
        // Placeholder implementation
        // En una implementación real, esto leería el valor del campo
        // de folio en la UI usando Target

        // Retornamos un folio dummy con el formato esperado
        return "COT-2026-00001";
    }
}
