package com.segurax.targets;

import net.serenitybdd.screenplay.targets.Target;
import org.openqa.selenium.By;

/**
 * Targets para la página de inicio (Homepage) de SeguraX.
 *
 * <p>Centraliza los selectores de elementos UI de la página principal,
 * incluyendo botones de navegación y elementos principales.</p>
 *
 * @author QA Team - ASDD
 * @version 1.0.0
 */
public class HomepageTargets {

    private HomepageTargets() {
        // Clase de utilidad
    }

    /**
     * Botón principal "Cotizar ahora" en la Homepage.
     */
    public static final Target BOTON_COTIZAR_AHORA = Target.the("botón Cotizar ahora")
        .located(By.cssSelector("[data-testid='btn-cotizar-ahora']"));

    /**
     * Logo de SeguraX en la Homepage.
     */
    public static final Target LOGO_SEGURAX = Target.the("logo SeguraX")
        .located(By.cssSelector("[data-testid='logo-segurax']"));

    /**
     * Hero section de la Homepage.
     */
    public static final Target HERO_SECTION = Target.the("sección hero")
        .located(By.cssSelector("[data-testid='hero-section']"));

    /**
     * Título principal de la Homepage.
     */
    public static final Target TITULO_PRINCIPAL = Target.the("título principal")
        .located(By.cssSelector("[data-testid='titulo-principal']"));
}
