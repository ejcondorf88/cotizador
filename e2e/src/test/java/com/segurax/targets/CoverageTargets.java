package com.segurax.targets;

import net.serenitybdd.screenplay.targets.Target;
import org.openqa.selenium.By;

/**
 * Targets para la página de configuración de coberturas.
 *
 * <p>Elementos UI relacionados con coberturas obligatorias y opcionales,
 * switches de activación/desactivación, y resumen de coberturas.</p>
 *
 * @author QA Team - ASDD
 * @version 1.0.0
 */
public class CoverageTargets {

    private CoverageTargets() {
        // Clase de utilidad
    }

    /**
     * Sección de Coberturas Obligatorias.
     */
    public static final Target SECCION_COBERTURAS_OBLIGATORIAS = Target.the("sección coberturas obligatorias")
        .located(By.cssSelector("[data-testid='seccion-coberturas-obligatorias']"));

    /**
     * Sección de Coberturas Opcionales.
     */
    public static final Target SECCION_COBERTURAS_OPCIONALES = Target.the("sección coberturas opcionales")
        .located(By.cssSelector("[data-testid='seccion-coberturas-opcionales']"));

    /**
     * Toggle/Switch para cobertura de Cristales.
     */
    public static final Target TOGGLE_CRISTALES = Target.the("toggle cobertura Cristales")
        .located(By.cssSelector("[data-testid='toggle-cobertura-cristales']"));

    /**
     * Toggle/Switch para cobertura de Daños por Agua.
     */
    public static final Target TOGGLE_DANOS_AGUA = Target.the("toggle cobertura Daños por Agua")
        .located(By.cssSelector("[data-testid='toggle-cobertura-danos-agua']"));

    /**
     * Toggle/Switch para cobertura de Robo.
     */
    public static final Target TOGGLE_ROBO = Target.the("toggle cobertura Robo")
        .located(By.cssSelector("[data-testid='toggle-cobertura-robo']"));

    /**
     * Toggle/Switch para cobertura de Remoción.
     */
    public static final Target TOGGLE_REMOCION = Target.the("toggle cobertura Remoción")
        .located(By.cssSelector("[data-testid='toggle-cobertura-remocion']"));

    /**
     * Toggle/Switch para cobertura de Equipo Electrónico.
     */
    public static final Target TOGGLE_EQUIPO_ELECTRONICO = Target.the("toggle cobertura Equipo Electrónico")
        .located(By.cssSelector("[data-testid='toggle-cobertura-equipo-electronico']"));

    /**
     * Toggle para cobertura obligatoria Incendio (no desactivable).
     */
    public static final Target TOGGLE_INCENDIO = Target.the("toggle cobertura Incendio")
        .located(By.cssSelector("[data-testid='toggle-cobertura-incendio']"));

    /**
     * Toggle para cobertura obligatoria CAT (no desactivable).
     */
    public static final Target TOGGLE_CAT = Target.the("toggle cobertura CAT")
        .located(By.cssSelector("[data-testid='toggle-cobertura-cat']"));

    /**
     * Contador de total de coberturas activas.
     */
    public static final Target CONTADOR_TOTAL_COBERTURAS = Target.the("contador total coberturas")
        .located(By.cssSelector("[data-testid='contador-total-coberturas']"));

    /**
     * Contador de coberturas obligatorias activas.
     */
    public static final Target CONTADOR_OBLIGATORIAS = Target.the("contador coberturas obligatorias")
        .located(By.cssSelector("[data-testid='contador-coberturas-obligatorias']"));

    /**
     * Contador de coberturas opcionales activas.
     */
    public static final Target CONTADOR_OPCIONALES = Target.the("contador coberturas opcionales")
        .located(By.cssSelector("[data-testid='contador-coberturas-opcionales']"));

    /**
     * Botón Continuar en página de coberturas.
     */
    public static final Target BOTON_CONTINUAR_COBERTURAS = Target.the("botón Continuar coberturas")
        .located(By.cssSelector("[data-testid='btn-continuar-coberturas']"));

    /**
     * Título de la página de coberturas.
     */
    public static final Target TITULO_CONFIGURACION_COBERTURAS = Target.the("título Configuración de Coberturas")
        .located(By.cssSelector("[data-testid='titulo-configuracion-coberturas']"));

    /**
     * Resumen de coberturas seleccionadas.
     */
    public static final Target RESUMEN_COBERTURAS = Target.the("resumen coberturas")
        .located(By.cssSelector("[data-testid='resumen-coberturas']"));
}
