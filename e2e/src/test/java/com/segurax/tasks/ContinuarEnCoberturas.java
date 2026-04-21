package com.segurax.tasks;

import com.segurax.targets.CoverageTargets;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.Tasks;
import net.serenitybdd.screenplay.actions.Click;
import net.serenitybdd.screenplay.waits.WaitUntil;

import static net.serenitybdd.screenplay.matchers.WebElementStateMatchers.isEnabled;

/**
 * Task para continuar desde la página de coberturas al resumen.
 *
 * <p>Hace clic en el botón "Continuar" después de configurar
 * las coberturas obligatorias y opcionales.</p>
 *
 * <p>Ejemplo de uso:</p>
 * <pre>
 *   actor.attemptsTo(ContinuarEnCoberturas.alResumen());
 * </pre>
 *
 * @author QA Team - ASDD
 * @version 1.0.0
 * @see Task
 */
public class ContinuarEnCoberturas implements Task {

    /**
     * Continúa al resumen desde la página de coberturas.
     *
     * @return Task instrumentado para continuar
     */
    public static ContinuarEnCoberturas alResumen() {
        return Tasks.instrumented(ContinuarEnCoberturas.class);
    }

    @Override
    public <T extends Actor> void performAs(T actor) {
        actor.attemptsTo(
            WaitUntil.the(CoverageTargets.BOTON_CONTINUAR_COBERTURAS, isEnabled())
                .forNoMoreThan(10).seconds(),
            Click.on(CoverageTargets.BOTON_CONTINUAR_COBERTURAS)
        );
    }
}
