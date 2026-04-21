package com.segurax.targets;

import net.serenitybdd.screenplay.targets.Target;
import org.openqa.selenium.By;

/**
 * Targets para la página de cotización (/quote).
 *
 * <p>Elementos UI relacionados con la creación de nuevas cotizaciones
 * y visualización del folio generado.</p>
 *
 * @author QA Team - ASDD
 * @version 1.0.0
 */
public class QuotePageTargets {

    private QuotePageTargets() {
        // Clase de utilidad
    }

    /**
     * Botón para crear una nueva cotización.
     */
    public static final Target BOTON_CREAR_COTIZACION = Target.the("botón Crear Cotización")
        .located(By.cssSelector("[data-testid='btn-crear-cotizacion']"));

    /**
     * Campo de texto que muestra el folio de la cotización.
     */
    public static final Target TEXTO_FOLIO_COTIZACION = Target.the("campo folio cotización")
        .located(By.cssSelector("[data-testid='txt-folio-cotizacion']"));

    /**
     * Badge que muestra el estado actual de la cotización.
     */
    public static final Target BADGE_ESTADO_COTIZACION = Target.the("badge estado cotización")
        .located(By.cssSelector("[data-testid='badge-estado-cotizacion']"));

    /**
     * Título de la página "Nueva Cotización".
     */
    public static final Target TITULO_NUEVA_COTIZACION = Target.the("título Nueva Cotización")
        .located(By.cssSelector("[data-testid='titulo-nueva-cotizacion']"));

    /**
     * Formulario de nueva cotización.
     */
    public static final Target FORMULARIO_NUEVA_COTIZACION = Target.the("formulario nueva cotización")
        .located(By.cssSelector("[data-testid='formulario-nueva-cotizacion']"));

    /**
     * Mensaje de éxito al crear cotización.
     */
    public static final Target MENSAJE_EXITO = Target.the("mensaje de éxito")
        .located(By.cssSelector("[data-testid='mensaje-exito']"));

    /**
     * Contenedor principal de la página de cotización.
     */
    public static final Target CONTENEDOR_QUOTE = Target.the("contenedor página quote")
        .located(By.cssSelector("[data-testid='quote-page-container']"));
}
