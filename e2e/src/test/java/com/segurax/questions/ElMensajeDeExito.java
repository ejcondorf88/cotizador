package com.segurax.questions;

import com.segurax.targets.CommonTargets;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;
import net.serenitybdd.screenplay.questions.Text;

/**
 * Question para obtener el mensaje de éxito mostrado.
 *
 * @author QA Team - ASDD
 * @version 1.0.0
 * @see Question
 */
public class ElMensajeDeExito implements Question<String> {

    public static ElMensajeDeExito mostrado() {
        return new ElMensajeDeExito();
    }

    @Override
    public String answeredBy(Actor actor) {
        return Text.of(CommonTargets.TOAST_EXITO).answeredBy(actor);
    }
}
