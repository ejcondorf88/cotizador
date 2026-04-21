package com.segurax.tasks;

import com.segurax.targets.PropertyFormTargets;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.Tasks;
import net.serenitybdd.screenplay.actions.Click;

/**
 * Task para guardar un inmueble completado.
 *
 * <p>Hace clic en el botón "Guardar" del formulario de inmueble
 * y espera a que el modal se cierre, confirmando el guardado.</p>
 *
 * <p>Ejemplo de uso:</p>
 * <pre>
 *   actor.attemptsTo(GuardarElInmueble.datos());
 * </pre>
 *
 * @author QA Team - ASDD
 * @version 1.0.0
 * @see Task
 */
public class GuardarElInmueble implements Task {

    /**
     * Guarda el inmueble actual completando el formulario.
     *
     * @return Task instrumentado para guardar
     */
    public static GuardarElInmueble datos() {
        return Tasks.instrumented(GuardarElInmueble.class);
    }

    @Override
    public <T extends Actor> void performAs(T actor) {
        actor.attemptsTo(
            Click.on(PropertyFormTargets.BOTON_GUARDAR_INMUEBLE)
        );
    }
}
