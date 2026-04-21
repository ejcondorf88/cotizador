package com.segurax.tasks;

import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.Tasks;
import net.serenitybdd.screenplay.abilities.BrowseTheWeb;
import net.serenitybdd.screenplay.actions.Open;

/**
 * Task para navegar a diferentes páginas del sistema.
 *
 * <p>Implementa las acciones de navegación del patrón Screenplay,
 * permitiendo al actor moverse entre la homepage y la página de cotización.</p>
 *
 * <p>Ejemplo de uso:</p>
 * <pre>
 *   actor.attemptsTo(Navegar.aLaHomepage());
 *   actor.attemptsTo(Navegar.aLaPaginaDeCotizacion());
 * </pre>
 *
 * @author QA Team - ASDD
 * @version 1.0.0
 * @see Task
 */
public class Navegar implements Task {

    private final String url;

    /**
     * Constructor privado - usar métodos de fábrica.
     *
     * @param url URL destino para navegación
     */
    private Navegar(String url) {
        this.url = url;
    }

    /**
     * Navega a la Homepage de SeguraX.
     *
     * @return Task configurado para navegar a http://localhost:5173
     */
    public static Navegar aLaHomepage() {
        return Tasks.instrumented(Navegar.class, "http://localhost:5173");
    }

    /**
     * Navega a la página de cotización (/quote).
     *
     * @return Task configurado para navegar a /quote
     */
    public static Navegar aLaPaginaDeCotizacion() {
        return Tasks.instrumented(Navegar.class, "http://localhost:5173/quote");
    }

    /**
     * Navega a una URL específica.
     *
     * @param url URL completa destino
     * @return Task configurado
     */
    public static Navegar aUrl(String url) {
        return Tasks.instrumented(Navegar.class, url);
    }

    /**
     * Navega a una página de inmuebles específica.
     *
     * @param quoteId ID de la cotización
     * @return Task configurado para /quote/{id}/properties
     */
    public static Navegar aLaPaginaDeInmuebles(String quoteId) {
        return Tasks.instrumented(Navegar.class, "http://localhost:5173/quote/" + quoteId + "/properties");
    }

    /**
     * Navega a la página de coberturas.
     *
     * @param quoteId ID de la cotización
     * @return Task configurado para /quote/{id}/coverage
     */
    public static Navegar aLaPaginaDeCoberturas(String quoteId) {
        return Tasks.instrumented(Navegar.class, "http://localhost:5173/quote/" + quoteId + "/coverage");
    }

    @Override
    public <T extends Actor> void performAs(T actor) {
        actor.attemptsTo(
            Open.url(url)
        );
    }
}
