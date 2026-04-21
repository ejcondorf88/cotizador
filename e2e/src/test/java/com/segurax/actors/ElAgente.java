package com.segurax.actors;

import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.abilities.BrowseTheWeb;
import org.openqa.selenium.WebDriver;

/**
 * Factory para el actor "El Agente" en los tests E2E del happy path.
 *
 * <p>Este actor representa a un agente de seguros de SeguraX que interactúa
 * con el sistema para completar el flujo completo de cotización.</p>
 *
 * <p>Proporciona métodos de fábrica para crear actores con diferentes
 * configuraciones según el contexto del escenario.</p>
 *
 * <p>Ejemplo de uso:</p>
 * <pre>
 *   Actor elAgente = ElAgente.conLaHabilidadDe(driver);
 *   elAgente.attemptsTo(Navegar.aLaHomepage());
 * </pre>
 *
 * @author QA Team - ASDD
 * @version 1.0.0
 * @see Actor
 * @see BrowseTheWeb
 */
public class ElAgente {

    /**
     * Constructor privado para prevenir instanciación.
     */
    private ElAgente() {
        // Clase de utilidad
    }

    /**
     * Crea un actor llamado "el Agente" con la habilidad de navegar por la web.
     *
     * <p>Este método es el punto de entrada principal para crear el actor
     * en los tests. Configura automáticamente el WebDriver proporcionado.</p>
     *
     * @param driver la instancia de WebDriver para controlar el navegador
     * @return Actor configurado con BrowseTheWeb
     */
    public static Actor conLaHabilidadDe(WebDriver driver) {
        return Actor.named("el Agente")
            .whoCan(BrowseTheWeb.with(driver));
    }

    /**
     * Crea un actor básico llamado "el Agente" sin habilidades.
     *
     * <p>Las habilidades deben añadirse posteriormente o proporcionarse
     * por el stage. Útil para configuraciones personalizadas.</p>
     *
     * @return Actor nombrado "el Agente"
     */
    public static Actor enElEscenario() {
        return Actor.named("el Agente");
    }

    /**
     * Crea un actor llamado "el Agente" con un nombre personalizado.
     *
     * <p>Permite diferenciar múltiples agentes en escenarios complejos.</p>
     *
     * @param nombreIdentificador sufijo para el nombre del actor
     * @param driver la instancia de WebDriver
     * @return Actor con nombre personalizado
     */
    public static Actor identificadoComo(String nombreIdentificador, WebDriver driver) {
        return Actor.named("el Agente " + nombreIdentificador)
            .whoCan(BrowseTheWeb.with(driver));
    }
}
