package com.segurax.tasks;

import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.actions.Click;
import net.serenitybdd.screenplay.targets.Target;
import net.serenitybdd.screenplay.waits.WaitUntil;

import static net.serenitybdd.screenplay.matchers.WebElementStateMatchers.isVisible;

/**
 * Task para recalcular la prima desde el resumen.
 *
 * @author QA Team - ASDD
 * @version 1.0.0
 * @since MF6
 */
public class RecalcularLaPrima implements Task {

    private static final Target BOTON_RECALCULAR = Target.the("Botón Recalcular")
            .locatedBy("//button[contains(text(), 'Recalcular')]");

    private static final Target SPINNER_CALCULANDO = Target.the("Spinner Calculando")
            .locatedBy("//div[contains(text(), 'Calculando')]");

    private static final Target PANEL_PRIMA = Target.the("Panel de Prima Total")
            .locatedBy("//div[contains(@class, 'premium-panel')]");

    public static RecalcularLaPrima desdeElResumen() {
        return new RecalcularLaPrima();
    }

    @Override
    public <T extends Actor> void performAs(T actor) {
        actor.attemptsTo(
            Click.on(BOTON_RECALCULAR),
            WaitUntil.the(SPINNER_CALCULANDO, isVisible()).forNoMoreThan(5).seconds(),
            WaitUntil.the(PANEL_PRIMA, isVisible()).forNoMoreThan(10).seconds()
        );
    }
}
