package com.segurax.targets;

import net.serenitybdd.screenplay.targets.Target;
import org.openqa.selenium.By;

/**
 * Targets comunes reutilizables en múltiples páginas.
 *
 * <p>Elementos UI genéricos como spinners de carga, mensajes de error,
 * notificaciones toast, y elementos de navegación compartidos.</p>
 *
 * @author QA Team - ASDD
 * @version 1.0.0
 */
public class CommonTargets {

    private CommonTargets() {
        // Clase de utilidad
    }

    /**
     * Spinner de carga global.
     */
    public static final Target SPINNER_CARGA = Target.the("spinner de carga")
        .located(By.cssSelector("[data-testid='spinner-carga']"));

    /**
     * Mensaje de error genérico.
     */
    public static final Target MENSAJE_ERROR = Target.the("mensaje de error")
        .located(By.cssSelector("[data-testid='mensaje-error']"));

    /**
     * Notificación toast de éxito.
     */
    public static final Target TOAST_EXITO = Target.the("toast de éxito")
        .located(By.cssSelector("[data-testid='toast-exito']"));

    /**
     * Notificación toast de error.
     */
    public static final Target TOAST_ERROR = Target.the("toast de error")
        .located(By.cssSelector("[data-testid='toast-error']"));

    /**
     * Toast con mensaje específico.
     */
    public static Target toastConMensaje(String mensaje) {
        return Target.the("toast con mensaje: " + mensaje)
            .located(By.xpath("//*[@data-testid='toast-exito' and contains(text(), '" + mensaje + "')]"));
    }

    /**
     * Botón genérico por texto.
     */
    public static Target botonConTexto(String texto) {
        return Target.the("botón con texto: " + texto)
            .located(By.xpath("//button[contains(text(), '" + texto + "')]"));
    }

    /**
     * Enlace de navegación por texto.
     */
    public static Target enlaceConTexto(String texto) {
        return Target.the("enlace con texto: " + texto)
            .located(By.xpath("//a[contains(text(), '" + texto + "')]"));
    }

    /**
     * Header de navegación principal.
     */
    public static final Target HEADER_NAVEGACION = Target.the("header de navegación")
        .located(By.cssSelector("[data-testid='header-navegacion']"));

    /**
     * Botón de regresar/volver.
     */
    public static final Target BOTON_REGRESAR = Target.the("botón regresar")
        .located(By.cssSelector("[data-testid='btn-regresar']"));
}
