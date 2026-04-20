package com.segurax.stepdefinitions;

import io.cucumber.java.Before;
import net.serenitybdd.screenplay.actors.OnStage;
import net.serenitybdd.screenplay.actors.OnlineCast;

/**
 * Hooks de Cucumber para configuración global.
 *
 * <p>Esta clase contiene métodos que se ejecutan antes o después
 * de los escenarios de prueba para configurar el entorno.</p>
 *
 * <p>Configura el stage de Screenplay con un OnlineCast que permite
 * a los actores interactuar con aplicaciones web.</p>
 *
 * @author Serenity BDD Template
 * @version 1.0.0
 */
public class Hooks {

    /**
     * Configura el stage antes de cada escenario.
     *
     * <p>Inicializa el cast de actores con OnlineCast, que proporciona
     * la habilidad BrowseTheWeb a los actores automáticamente.</p>
     *
     * <p>Este método se ejecuta antes de cada escenario de Cucumber.</p>
     */
    @Before
    public void setTheStage() {
        OnStage.setTheStage(new OnlineCast());
    }
}
