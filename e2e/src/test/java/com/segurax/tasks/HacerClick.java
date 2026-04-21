package com.segurax.tasks;

import com.segurax.targets.CommonTargets;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.Tasks;
import net.serenitybdd.screenplay.actions.Click;
import net.serenitybdd.screenplay.targets.Target;
import net.serenitybdd.screenplay.waits.WaitUntil;

import static net.serenitybdd.screenplay.matchers.WebElementStateMatchers.isVisible;

/**
 * Task genérico para hacer clic en botones por texto.
 *
 * <p>Permite hacer clic en botões identificados por su texto visible,
 * facilitando interacciones dinámicas en la UI.</p>
 *
 * <p>Ejemplo de uso:</p>
 * <pre>
 *   actor.attemptsTo(HacerClick.enElBoton("Guardar"));
 *   actor.attemptsTo(HacerClick.enElBoton("Continuar"));
 * </pre>
 *
 * @author QA Team - ASDD
 * @version 1.0.0
 * @see Task
 */
public class HacerClick implements Task {

    private final String textoBoton;

    /**
     * Constructor privado - usar método de fábrica.
     *
     * @param textoBoton texto visible del botón
     */
    private HacerClick(String textoBoton) {
        this.textoBoton = textoBoton;
    }

    /**
     * Hace clic en un botón con el texto especificado.
     *
     * @param texto texto visible del botón
     * @return Task configurado para hacer clic
     */
    public static HacerClick enElBoton(String texto) {
        return Tasks.instrumented(HacerClick.class, texto);
    }

    @Override
    public <T extends Actor> void performAs(T actor) {
        Target targetDinamico = CommonTargets.botonConTexto(textoBoton);

        actor.attemptsTo(
            WaitUntil.the(targetDinamico, isVisible())
                .forNoMoreThan(10).seconds(),
            Click.on(targetDinamico)
        );
    }
}
