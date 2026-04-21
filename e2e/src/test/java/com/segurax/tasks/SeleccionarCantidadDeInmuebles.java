package com.segurax.tasks;

import com.segurax.targets.PropertyCountTargets;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.Tasks;
import net.serenitybdd.screenplay.actions.Click;
import net.serenitybdd.screenplay.actions.Enter;
import net.serenitybdd.screenplay.actions.SelectFromOptions;
import net.serenitybdd.screenplay.waits.WaitUntil;

import static net.serenitybdd.screenplay.matchers.WebElementStateMatchers.isVisible;

/**
 * Task para seleccionar la cantidad de inmuebles a asegurar.
 *
 * <p>Ingresa la cantidad especificada en el campo correspondiente
 * y procede al siguiente paso haciendo clic en "Continuar".</p>
 *
 * <p>Ejemplo de uso:</p>
 * <pre>
 *   actor.attemptsTo(SeleccionarCantidadDeInmuebles.conValor(2));
 * </pre>
 *
 * @author QA Team - ASDD
 * @version 1.0.0
 * @see Task
 */
public class SeleccionarCantidadDeInmuebles implements Task {

    private final int cantidad;

    /**
     * Constructor privado - usar método de fábrica.
     *
     * @param cantidad número de inmuebles a seleccionar
     */
    private SeleccionarCantidadDeInmuebles(int cantidad) {
        this.cantidad = cantidad;
    }

    /**
     * Selecciona la cantidad especificada de inmuebles.
     *
     * @param cantidad número de inmuebles (ej: 2)
     * @return Task configurado
     */
    public static SeleccionarCantidadDeInmuebles conValor(int cantidad) {
        return Tasks.instrumented(SeleccionarCantidadDeInmuebles.class, cantidad);
    }

    @Override
    public <T extends Actor> void performAs(T actor) {
        actor.attemptsTo(
            WaitUntil.the(PropertyCountTargets.INPUT_CANTIDAD_INMUEBLES, isVisible())
                .forNoMoreThan(10).seconds(),
            Enter.theValue(String.valueOf(cantidad))
                .into(PropertyCountTargets.INPUT_CANTIDAD_INMUEBLES),
            Click.on(PropertyCountTargets.BOTON_CONTINUAR)
        );
    }
}
