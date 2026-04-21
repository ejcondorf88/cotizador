package com.segurax.tasks;

import com.segurax.targets.CoverageTargets;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.Tasks;
import net.serenitybdd.screenplay.actions.Click;
import net.serenitybdd.screenplay.targets.Target;
import net.serenitybdd.screenplay.waits.WaitUntil;

import static net.serenitybdd.screenplay.matchers.WebElementStateMatchers.isVisible;

/**
 * Task para activar una cobertura opcional específica.
 *
 * <p>Hace clic en el toggle/switch de la cobertura indicada
 * para activarla en la configuración del seguro.</p>
 *
 * <p>Ejemplo de uso:</p>
 * <pre>
 *   actor.attemptsTo(ActivarCobertura.opcional("Cristales"));
 *   actor.attemptsTo(ActivarCobertura.opcional("Daños por Agua"));
 *   actor.attemptsTo(ActivarCobertura.opcional("Robo"));
 * </pre>
 *
 * @author QA Team - ASDD
 * @version 1.0.0
 * @see Task
 */
public class ActivarCobertura implements Task {

    private final String nombreCobertura;

    /**
     * Constructor privado - usar método de fábrica.
     *
     * @param nombreCobertura nombre de la cobertura a activar
     */
    private ActivarCobertura(String nombreCobertura) {
        this.nombreCobertura = nombreCobertura;
    }

    /**
     * Activa la cobertura opcional especificada.
     *
     * @param nombre nombre de la cobertura (ej: "Cristales", "Robo")
     * @return Task configurado para activar la cobertura
     */
    public static ActivarCobertura opcional(String nombre) {
        return Tasks.instrumented(ActivarCobertura.class, nombre);
    }

    @Override
    public <T extends Actor> void performAs(T actor) {
        Target toggleTarget = resolverToggle(nombreCobertura);

        actor.attemptsTo(
            WaitUntil.the(toggleTarget, isVisible())
                .forNoMoreThan(10).seconds(),
            Click.on(toggleTarget)
        );
    }

    /**
     * Resuelve el Target correspondiente al nombre de cobertura.
     *
     * @param nombre nombre de la cobertura
     * @return Target del toggle correspondiente
     */
    private Target resolverToggle(String nombre) {
        String nombreLower = nombre.toLowerCase();
        if (nombreLower.equals("cristales")) {
            return CoverageTargets.TOGGLE_CRISTALES;
        } else if (nombreLower.equals("daños por agua") || nombreLower.equals("danos por agua")) {
            return CoverageTargets.TOGGLE_DANOS_AGUA;
        } else if (nombreLower.equals("robo")) {
            return CoverageTargets.TOGGLE_ROBO;
        } else if (nombreLower.equals("remoción") || nombreLower.equals("remocion")) {
            return CoverageTargets.TOGGLE_REMOCION;
        } else if (nombreLower.equals("equipo electrónico") || nombreLower.equals("equipo electronico")) {
            return CoverageTargets.TOGGLE_EQUIPO_ELECTRONICO;
        } else {
            throw new IllegalArgumentException("Cobertura no reconocida: " + nombre);
        }
    }
}
