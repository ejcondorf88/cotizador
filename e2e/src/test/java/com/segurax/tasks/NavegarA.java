package com.segurax.tasks;

import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.Tasks;
import net.serenitybdd.screenplay.actions.Open;

/**
 * Task para navegar a una URL específica.
 *
 * <p>Esta tarea utiliza Serenity Screenplay para abrir
 * una página web en el navegador del actor.</p>
 *
 * <p>Usage example:</p>
 * <pre>
 * elActor.attemptsTo(NavegarA.url("http://localhost:5173"));
 * elActor.attemptsTo(NavegarA.url("/cotizaciones"));
 * </pre>
 *
 * @author Serenity BDD Template
 * @version 1.0.0
 * @see Task
 */
public class NavegarA implements Task {

    private final String targetUrl;

    /**
     * Constructor with target URL.
     *
     * @param targetUrl the URL to navigate to
     */
    public NavegarA(String targetUrl) {
        this.targetUrl = targetUrl;
    }

    /**
     * Factory method para crear la tarea.
     *
     * @param targetUrl URL destino (puede ser absoluta o relativa)
     * @return instancia de NavegarA
     */
    public static NavegarA url(String targetUrl) {
        return Tasks.instrumented(NavegarA.class, targetUrl);
    }

    @Override
    public <T extends Actor> void performAs(T actor) {
        actor.attemptsTo(
                Open.url(targetUrl)
        );
    }
}
