package com.segurax.questions;

import com.segurax.targets.PropertyDetailsTargets;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;
import net.serenitybdd.screenplay.questions.Text;

/**
 * Question para obtener la suma asegurada total mostrada.
 *
 * @author QA Team - ASDD
 * @version 1.0.0
 * @see Question
 */
public class LaSumaAseguradaTotal implements Question<String> {

    public static LaSumaAseguradaTotal mostrada() {
        return new LaSumaAseguradaTotal();
    }

    @Override
    public String answeredBy(Actor actor) {
        return Text.of(PropertyDetailsTargets.SUMA_ASEGURADA_TOTAL).answeredBy(actor);
    }
}
