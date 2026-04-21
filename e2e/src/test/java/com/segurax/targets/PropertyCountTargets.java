package com.segurax.targets;

import net.serenitybdd.screenplay.targets.Target;
import org.openqa.selenium.By;

/**
 * Targets para la selección de cantidad de inmuebles.
 *
 * <p>Elementos UI del paso donde el agente selecciona cuántos
 * inmuebles desea asegurar en la cotización.</p>
 *
 * @author QA Team - ASDD
 * @version 1.0.0
 */
public class PropertyCountTargets {

    private PropertyCountTargets() {
        // Clase de utilidad
    }

    /**
     * Input para ingresar la cantidad de inmuebles.
     */
    public static final Target INPUT_CANTIDAD_INMUEBLES = Target.the("input cantidad de inmuebles")
        .located(By.cssSelector("[data-testid='input-cantidad-inmuebles']"));

    /**
     * Botón Continuar después de seleccionar cantidad.
     */
    public static final Target BOTON_CONTINUAR = Target.the("botón Continuar")
        .located(By.cssSelector("[data-testid='btn-continuar']"));

    /**
     * Selector de cantidad usando dropdown (alternativa al input).
     */
    public static final Target SELECT_CANTIDAD = Target.the("selector cantidad")
        .located(By.cssSelector("[data-testid='select-cantidad-inmuebles']"));
}
