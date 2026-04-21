package com.segurax.tasks;

import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.actions.Open;
import net.serenitybdd.screenplay.waits.WaitUntil;
import net.thucydides.model.environment.SystemEnvironmentVariables;
import net.thucydides.model.util.EnvironmentVariables;

import static net.serenitybdd.screenplay.matchers.WebElementStateMatchers.isVisible;
import net.serenitybdd.screenplay.targets.Target;

/**
 * Task para navegar a la página de resumen (Summary).
 *
 * @author QA Team - ASDD
 * @version 1.0.0
 * @since MF6
 */
public class NavegarASummary implements Task {

    private final String quoteId;

    private static final Target PANEL_PRIMA = Target.the("Panel de Prima Total")
            .locatedBy("//div[contains(@class, 'premium-panel')]");

    public NavegarASummary(String quoteId) {
        this.quoteId = quoteId;
    }

    public static NavegarASummary paraLaCotizacion(String quoteId) {
        return new NavegarASummary(quoteId);
    }

    @Override
    public <T extends Actor> void performAs(T actor) {
        EnvironmentVariables env = SystemEnvironmentVariables.createEnvironmentVariables();
        String baseUrl = env.getProperty("webdriver.base.url", "http://localhost:5173");
        String fullUrl = baseUrl + "/quote/" + quoteId + "/summary";

        actor.attemptsTo(
            Open.url(fullUrl),
            WaitUntil.the(PANEL_PRIMA, isVisible()).forNoMoreThan(15).seconds()
        );
    }
}
