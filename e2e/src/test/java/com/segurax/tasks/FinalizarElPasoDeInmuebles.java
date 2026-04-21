package com.segurax.tasks;

import com.segurax.targets.PropertyDetailsTargets;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.Tasks;
import net.serenitybdd.screenplay.actions.Click;
import net.serenitybdd.screenplay.waits.WaitUntil;

import static net.serenitybdd.screenplay.matchers.WebElementStateMatchers.isEnabled;

/**
 * Task para finalizar el paso de inmuebles y avanzar a coberturas.
 *
 * <p>Hace clic en el botón "Finalizar" después de que todos los
 * inmuebles han sido completados, navegando a la página de coberturas.</p>
 *
 * <p>Ejemplo de uso:</p>
 * <pre>
 *   actor.attemptsTo(FinalizarElPasoDeInmuebles.paraContinuar());
 * </pre>
 *
 * @author QA Team - ASDD
 * @version 1.0.0
 * @see Task
 */
public class FinalizarElPasoDeInmuebles implements Task {

    /**
     * Finaliza el paso de inmuebles para continuar a coberturas.
     *
     * @return Task instrumentado para finalizar
     */
    public static FinalizarElPasoDeInmuebles paraContinuar() {
        return Tasks.instrumented(FinalizarElPasoDeInmuebles.class);
    }

    @Override
    public <T extends Actor> void performAs(T actor) {
        actor.attemptsTo(
            WaitUntil.the(PropertyDetailsTargets.BOTON_FINALIZAR, isEnabled())
                .forNoMoreThan(10).seconds(),
            Click.on(PropertyDetailsTargets.BOTON_FINALIZAR)
        );
    }
}
