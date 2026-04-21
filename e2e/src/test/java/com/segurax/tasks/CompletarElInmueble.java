package com.segurax.tasks;

import com.segurax.models.InmuebleData;
import com.segurax.targets.PropertyDetailsTargets;
import com.segurax.targets.PropertyFormTargets;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.Tasks;
import net.serenitybdd.screenplay.actions.Click;
import net.serenitybdd.screenplay.actions.Enter;
import net.serenitybdd.screenplay.actions.SelectFromOptions;
import net.serenitybdd.screenplay.waits.WaitUntil;

import static net.serenitybdd.screenplay.matchers.WebElementStateMatchers.isVisible;

/**
 * Task para completar el formulario de un inmueble específico.
 *
 * <p>Abre el formulario del inmueble indicado, llena todos los campos
 * con los datos proporcionados y guarda la información.</p>
 *
 * <p>Ejemplo de uso:</p>
 * <pre>
 *   actor.attemptsTo(
 *     CompletarElInmueble.numero(1).conLosDatos(datosDelInmueble)
 *   );
 * </pre>
 *
 * @author QA Team - ASDD
 * @version 1.0.0
 * @see Task
 * @see InmuebleData
 */
public class CompletarElInmueble implements Task {

    private final int numeroInmueble;
    private final InmuebleData datos;

    /**
     * Constructor privado - usar métodos de fábrica.
     */
    private CompletarElInmueble(int numeroInmueble, InmuebleData datos) {
        this.numeroInmueble = numeroInmueble;
        this.datos = datos;
    }

    /**
     * Inicia la configuración para completar un inmueble específico.
     *
     * @param numero número del inmueble (1, 2, etc.)
     * @return Builder parcial para completar datos
     */
    public static BuilderConNumero numero(int numero) {
        return new BuilderConNumero(numero);
    }

    /**
     * Builder intermedio para especificar los datos.
     */
    public static class BuilderConNumero {
        private final int numero;

        public BuilderConNumero(int numero) {
            this.numero = numero;
        }

        /**
         * Especifica los datos del inmueble.
         *
         * @param datos instancia de InmuebleData
         * @return Task instrumentado
         */
        public CompletarElInmueble conLosDatos(InmuebleData datos) {
            return Tasks.instrumented(CompletarElInmueble.class, numero, datos);
        }
    }

    @Override
    public <T extends Actor> void performAs(T actor) {
        // Abrir formulario del inmueble
        actor.attemptsTo(
            WaitUntil.the(PropertyDetailsTargets.botonCompletarDatos(String.valueOf(numeroInmueble)), isVisible())
                .forNoMoreThan(10).seconds(),
            Click.on(PropertyDetailsTargets.botonCompletarDatos(String.valueOf(numeroInmueble)))
        );

        // Llenar campos del formulario
        actor.attemptsTo(
            WaitUntil.the(PropertyFormTargets.INPUT_NOMBRE_INMUEBLE, isVisible())
                .forNoMoreThan(10).seconds(),
            Enter.theValue(datos.getNombre()).into(PropertyFormTargets.INPUT_NOMBRE_INMUEBLE),
            Enter.theValue(datos.getCalle()).into(PropertyFormTargets.INPUT_CALLE),
            Enter.theValue(datos.getCp()).into(PropertyFormTargets.INPUT_CODIGO_POSTAL),
            Enter.theValue(datos.getEstado()).into(PropertyFormTargets.SELECT_ESTADO),
            Enter.theValue(datos.getCiudad()).into(PropertyFormTargets.INPUT_CIUDAD),
            Enter.theValue(datos.getColonia()).into(PropertyFormTargets.INPUT_COLONIA),
            Enter.theValue(datos.getTipoConstructivo()).into(PropertyFormTargets.SELECT_TIPO_CONSTRUCTIVO),
            Enter.theValue(String.valueOf(datos.getAnioConstruccion())).into(PropertyFormTargets.INPUT_ANIO_CONSTRUCCION),
            Enter.theValue(String.valueOf(datos.getNiveles())).into(PropertyFormTargets.INPUT_NIVELES),
            Enter.theValue(datos.getUso()).into(PropertyFormTargets.SELECT_USO),
            Enter.theValue(datos.getGiro()).into(PropertyFormTargets.INPUT_GIRO),
            Enter.theValue(String.valueOf(datos.getGarantiaEdificio())).into(PropertyFormTargets.INPUT_GARANTIA_EDIFICIO),
            Enter.theValue(String.valueOf(datos.getGarantiaContenidos())).into(PropertyFormTargets.INPUT_GARANTIA_CONTENIDOS)
        );
    }

    /**
     * Guarda el inmueble completado haciendo clic en el botón Guardar.
     * Este método debe llamarse después de completar los datos.
     *
     * <p>Se implementa como task separada para flexibilidad en los steps.</p>
     */
    public static GuardarInmueble guardar() {
        return new GuardarInmueble();
    }

    /**
     * Task interna para guardar el inmueble.
     */
    public static class GuardarInmueble implements Task {
        @Override
        public <T extends Actor> void performAs(T actor) {
            actor.attemptsTo(
                Click.on(PropertyFormTargets.BOTON_GUARDAR_INMUEBLE)
            );
        }
    }
}
