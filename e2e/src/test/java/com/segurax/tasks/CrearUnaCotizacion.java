package com.segurax.tasks;

import com.segurax.targets.QuotePageTargets;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.Tasks;
import net.serenitybdd.screenplay.actions.Click;
import net.serenitybdd.screenplay.waits.WaitUntil;

import static net.serenitybdd.screenplay.matchers.WebElementStateMatchers.isEnabled;
import static net.serenitybdd.screenplay.matchers.WebElementStateMatchers.isVisible;

/**
 * Task para crear una nueva cotización.
 *
 * <p>Automatiza el clic en el botón "Crear Cotización" y espera
 * a que el sistema responda generando el folio.</p>
 *
 * <p>Ejemplo de uso:</p>
 * <pre>
 *   actor.attemptsTo(CrearUnaCotizacion.nueva());
 * </pre>
 *
 * @author QA Team - ASDD
 * @version 1.0.0
 * @see Task
 */
public class CrearUnaCotizacion implements Task {

    /**
     * Crea una nueva cotización haciendo clic en el botón correspondiente.
     *
     * @return Task instrumentado para crear cotización
     */
    public static CrearUnaCotizacion nueva() {
        return Tasks.instrumented(CrearUnaCotizacion.class);
    }

    @Override
    public <T extends Actor> void performAs(T actor) {
        actor.attemptsTo(
            WaitUntil.the(QuotePageTargets.BOTON_CREAR_COTIZACION, isEnabled())
                .forNoMoreThan(10).seconds(),
            Click.on(QuotePageTargets.BOTON_CREAR_COTIZACION),
            WaitUntil.the(QuotePageTargets.TEXTO_FOLIO_COTIZACION, isVisible())
                .forNoMoreThan(10).seconds()
        );
    }
}
