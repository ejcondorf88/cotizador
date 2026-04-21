package com.segurax.questions;

import com.segurax.targets.QuotePageTargets;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;
import net.serenitybdd.screenplay.questions.Presence;
import net.serenitybdd.screenplay.questions.Text;

/**
 * Question para obtener el folio de la cotización creada.
 *
 * <p>Esta pregunta permite verificar el folio generado
 * después de crear una nueva cotización.</p>
 *
 * <p>Ejemplo de uso:</p>
 * <pre>
 * elActor.should(seeThat(ElFolioDeLaCotizacion.mostrado(), containsString("COT-")));
 * elActor.should(seeThat(ElFolioDeLaCotizacion.estaVisible(), is(true)));
 * </pre>
 *
 * @author QA Team - ASDD
 * @version 1.0.0
 * @see Question
 */
public class ElFolioDeLaCotizacion implements Question<String> {

    private final boolean verificarPresencia;

    private ElFolioDeLaCotizacion() {
        this.verificarPresencia = false;
    }

    private ElFolioDeLaCotizacion(boolean verificarPresencia) {
        this.verificarPresencia = verificarPresencia;
    }

    /**
     * Factory method para obtener el texto del folio.
     *
     * @return instancia de ElFolioDeLaCotizacion
     */
    public static ElFolioDeLaCotizacion mostrado() {
        return new ElFolioDeLaCotizacion();
    }

    /**
     * Factory method para verificar que el folio está visible.
     *
     * @return Question<Boolean> para verificar presencia
     */
    public static Question<Boolean> estaVisible() {
        return new Question<Boolean>() {
            @Override
            public Boolean answeredBy(Actor actor) {
                return Presence.of(QuotePageTargets.TEXTO_FOLIO_COTIZACION).answeredBy(actor);
            }
        };
    }

    @Override
    public String answeredBy(Actor actor) {
        return Text.of(QuotePageTargets.TEXTO_FOLIO_COTIZACION).answeredBy(actor);
    }
}
