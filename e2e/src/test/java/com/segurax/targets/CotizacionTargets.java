package com.segurax.targets;

import net.serenitybdd.screenplay.targets.Target;
import org.openqa.selenium.By;

/**
 * Targets para la página de cotizaciones.
 *
 * <p>Esta clase centraliza los selectores de elementos UI
 * relacionados con el flujo de creación y gestión de cotizaciones.</p>
 *
 * <p>Los targets se definen usando diferentes estrategias de localización:
 * CSS, XPath, ID, etc.</p>
 *
 * <p>Usage example:</p>
 * <pre>
 * actor.attemptsTo(
 *     Click.on(CotizacionTargets.BOTON_NUEVA_COTIZACION),
 *     Enter.theValue("Mi Empresa").into(CotizacionTargets.CAMPO_EMPRESA)
 * );
 * </pre>
 *
 * @author Serenity BDD Template
 * @version 1.0.0
 * @see Target
 */
public class CotizacionTargets {

    /**
     * Private constructor to prevent instantiation.
     */
    private CotizacionTargets() {
        // Utility class for targets
    }

    /**
     * Botón para crear una nueva cotización.
     * Localizado por atributo data-testid.
     */
    public static final Target BOTON_NUEVA_COTIZACION = Target.the("botón Nueva Cotización")
            .located(By.cssSelector("[data-testid='btn-nueva-cotizacion']"));

    /**
     * Campo de entrada para el nombre de la empresa.
     */
    public static final Target CAMPO_EMPRESA = Target.the("campo Empresa")
            .located(By.cssSelector("[data-testid='input-empresa']"));

    /**
     * Campo de entrada para el RFC.
     */
    public static final Target CAMPO_RFC = Target.the("campo RFC")
            .located(By.cssSelector("[data-testid='input-rfc']"));

    /**
     * Botón para guardar la cotización.
     */
    public static final Target BOTON_GUARDAR = Target.the("botón Guardar")
            .located(By.cssSelector("[data-testid='btn-guardar']"));

    /**
     * Campo que muestra el folio generado.
     */
    public static final Target CAMPO_FOLIO = Target.the("campo Folio")
            .located(By.cssSelector("[data-testid='campo-folio']"));

    /**
     * Selector de fecha de inicio.
     */
    public static final Target CAMPO_FECHA_INICIO = Target.the("campo Fecha Inicio")
            .located(By.cssSelector("[data-testid='input-fecha-inicio']"));

    /**
     * Selector de fecha de fin.
     */
    public static final Target CAMPO_FECHA_FIN = Target.the("campo Fecha Fin")
            .located(By.cssSelector("[data-testid='input-fecha-fin']"));

    /**
     * Selector de giro empresarial.
     */
    public static final Target SELECT_GIRO = Target.the("selector Giro")
            .located(By.cssSelector("[data-testid='select-giro']"));

    /**
     * Mensaje de error de validación.
     */
    public static final Target MENSAJE_ERROR = Target.the("mensaje de error")
            .located(By.cssSelector("[data-testid='mensaje-error']"));

    /**
     * Indicador de estado de la cotización.
     */
    public static final Target INDICADOR_ESTADO = Target.the("indicador Estado")
            .located(By.cssSelector("[data-testid='estado-cotizacion']"));
}
