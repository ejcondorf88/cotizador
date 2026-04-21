package com.segurax.questions;

import com.segurax.targets.QuotePageTargets;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;
import net.serenitybdd.screenplay.targets.Target;
import org.openqa.selenium.WebElement;

/**
 * Question para obtener el color del badge de estado.
 *
 * @author QA Team - ASDD
 * @version 1.0.0
 * @see Question
 */
public class ElColorDelBadge implements Question<String> {

    public static ElColorDelBadge es() {
        return new ElColorDelBadge();
    }

    @Override
    public String answeredBy(Actor actor) {
        WebElement badge = QuotePageTargets.BADGE_ESTADO_COTIZACION.resolveFor(actor);
        String classAttribute = badge.getAttribute("class");

        if (classAttribute.contains("gray") || classAttribute.contains("grey") || classAttribute.contains("secondary")) {
            return "gris";
        } else if (classAttribute.contains("blue") || classAttribute.contains("primary")) {
            return "azul";
        } else if (classAttribute.contains("green") || classAttribute.contains("success")) {
            return "verde";
        } else if (classAttribute.contains("yellow") || classAttribute.contains("warning")) {
            return "amarillo";
        }

        return classAttribute;
    }
}
