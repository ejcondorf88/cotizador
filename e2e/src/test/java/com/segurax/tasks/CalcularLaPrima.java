package com.segurax.tasks;

import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.actions.Click;
import net.serenitybdd.screenplay.targets.Target;
import net.serenitybdd.screenplay.waits.WaitUntil;

import static net.serenitybdd.screenplay.matchers.WebElementStateMatchers.isVisible;

/**
 * Task para calcular la prima (se ejecuta automáticamente al navegar a Summary).
 *
 * @author QA Team - ASDD
 * @version 1.0.0
 * @since MF6
 */
public class CalcularLaPrima implements Task {

    private static final Target PANEL_PRIMA = Target.the("Panel de Prima Total")
            .locatedBy("//div[contains(@class, 'premium-panel')]");

    private static final Target SPINNER_CALCULANDO = Target.the("Spinner Calculando")
            .locatedBy("//div[contains(text(), 'Calculando')]");

    public static CalcularLaPrima automaticamente() {
        return new CalcularLaPrima();
    }

    @Override
    public <T extends Actor> void performAs(T actor) {
        // Esperar que el spinner de carga desaparezca (el cálculo se hace al cargar la página)
        actor.attemptsTo(
            WaitUntil.the(PANEL_PRIMA, isVisible()).forNoMoreThan(10).seconds()
        );
    }
}
