package com.segurax.targets;

import net.serenitybdd.screenplay.targets.Target;
import org.openqa.selenium.By;

/**
 * Targets para la página de detalle de inmuebles (/quote/{id}/properties).
 *
 * <p>Elementos UI relacionados con las fichas de inmueble, estados,
 * y controles de navegación en el paso de inmuebles.</p>
 *
 * @author QA Team - ASDD
 * @version 1.0.0
 */
public class PropertyDetailsTargets {

    private PropertyDetailsTargets() {
        // Clase de utilidad
    }

    /**
     * Ficha de inmueble específica por índice.
     * Se usa con formato: FICHA_INMUEBLE.of("1"), FICHA_INMUEBLE.of("2")
     */
    public static Target fichaInmueble(String indice) {
        return Target.the("ficha inmueble " + indice)
            .located(By.cssSelector("[data-testid='ficha-inmueble-" + indice + "']"));
    }

    /**
     * Botón "Completar datos" para un inmueble específico.
     */
    public static Target botonCompletarDatos(String indice) {
        return Target.the("botón Completar datos inmueble " + indice)
            .located(By.cssSelector("[data-testid='btn-completar-inmueble-" + indice + "']"));
    }

    /**
     * Badge de estado de un inmueble específico.
     */
    public static Target estadoInmueble(String indice) {
        return Target.the("estado inmueble " + indice)
            .located(By.cssSelector("[data-testid='estado-inmueble-" + indice + "']"));
    }

    /**
     * Icono de check verde para inmueble completado.
     */
    public static Target iconoCheckInmueble(String indice) {
        return Target.the("icono check inmueble " + indice)
            .located(By.cssSelector("[data-testid='check-inmueble-" + indice + "']"));
    }

    /**
     * Botón Finalizar para pasar a coberturas.
     */
    public static final Target BOTON_FINALIZAR = Target.the("botón Finalizar")
        .located(By.cssSelector("[data-testid='btn-finalizar-inmuebles']"));

    /**
     * Contenedor de la lista de fichas de inmuebles.
     */
    public static final Target CONTENEDOR_FICHAS = Target.the("contenedor fichas inmuebles")
        .located(By.cssSelector("[data-testid='contenedor-fichas-inmuebles']"));

    /**
     * Indicador de suma asegurada total.
     */
    public static final Target SUMA_ASEGURADA_TOTAL = Target.the("suma asegurada total")
        .located(By.cssSelector("[data-testid='suma-asegurada-total']"));

    /**
     * Contador de inmuebles completados.
     */
    public static final Target CONTADOR_INMUEBLES_COMPLETADOS = Target.the("contador inmuebles completados")
        .located(By.cssSelector("[data-testid='contador-inmuebles-completados']"));
}
