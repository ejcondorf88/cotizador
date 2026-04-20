package com.segurax.actors;

import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.abilities.BrowseTheWeb;
import org.openqa.selenium.WebDriver;

/**
 * Actor factory for "El Usuario" - the main actor in Screenplay tests.
 *
 * <p>This class provides factory methods to create actors with the ability
 * to interact with web applications using Serenity's Screenplay pattern.</p>
 *
 * <p>Usage example:</p>
 * <pre>
 * Actor elUsuario = ElUsuario.conLaHabilidadDe(BrowseTheWeb.with(driver));
 * elUsuario.attemptsTo(NavegarA.url("http://localhost:5173"));
 * </pre>
 *
 * @author Serenity BDD Template
 * @version 1.0.0
 */
public class ElUsuario {

    /**
     * Private constructor to prevent instantiation.
     */
    private ElUsuario() {
        // Utility class
    }

    /**
     * Creates an actor named "el Usuario" with the ability to browse the web.
     *
     * @param driver the WebDriver instance
     * @return Actor configured with BrowseTheWeb ability
     */
    public static Actor conLaHabilidadDe(WebDriver driver) {
        return Actor.named("el Usuario")
                .whoCan(BrowseTheWeb.with(driver));
    }

    /**
     * Creates a basic actor named "el Usuario" without abilities.
     * Abilities should be added later or provided by the stage.
     *
     * @return Actor named "el Usuario"
     */
    public static Actor enElEscenario() {
        return Actor.named("el Usuario");
    }
}
