package com.segurax.questions;

import com.segurax.targets.PropertyDetailsTargets;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;
import org.openqa.selenium.WebElement;

import java.util.List;

/**
 * Question para contar las fichas de inmueble visibles.
 *
 * @author QA Team - ASDD
 * @version 1.0.0
 * @see Question
 */
public class LaCantidadDeFichasDeInmueble implements Question<Integer> {

    public static LaCantidadDeFichasDeInmueble mostrada() {
        return new LaCantidadDeFichasDeInmueble();
    }

    @Override
    public Integer answeredBy(Actor actor) {
        // Contar elementos con data-testid que empieza con 'ficha-inmueble-'
        List<WebElement> fichas = PropertyDetailsTargets.CONTENEDOR_FICHAS.resolveFor(actor)
            .findElements(org.openqa.selenium.By.cssSelector("[data-testid^='ficha-inmueble-']"));
        return fichas.size();
    }
}
