package com.segurax.tasks;

import com.segurax.models.Cotizacion;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.Tasks;

/**
 * Task para crear una nueva cotización.
 *
 * <p>Esta tarea simula el proceso de creación de una cotización
 * completando el formulario con los datos proporcionados.</p>
 *
 * <p>Nota: Esta es una implementación placeholder. En una implementación
 * real, incluiría acciones como hacer clic en botones, llenar campos,
 * y guardar la cotización.</p>
 *
 * <p>Usage example:</p>
 * <pre>
 * Cotizacion datos = CotizacionFactory.unaCotizacionValida();
 * elActor.attemptsTo(CrearCotizacion.con(datos));
 * </pre>
 *
 * @author Serenity BDD Template
 * @version 1.0.0
 * @see Task
 * @see Cotizacion
 */
public class CrearCotizacion implements Task {

    private final Cotizacion cotizacion;

    /**
     * Constructor with Cotizacion data.
     *
     * @param cotizacion the quote data to use
     */
    public CrearCotizacion(Cotizacion cotizacion) {
        this.cotizacion = cotizacion;
    }

    /**
     * Factory method para crear la tarea con los datos de cotización.
     *
     * @param cotizacion datos de la cotización a crear
     * @return instancia de CrearCotizacion
     */
    public static CrearCotizacion con(Cotizacion cotizacion) {
        return Tasks.instrumented(CrearCotizacion.class, cotizacion);
    }

    @Override
    public <T extends Actor> void performAs(T actor) {
        // Placeholder implementation
        // En una implementación real, esto incluiría:
        // - Hacer clic en "Nueva Cotización"
        // - Llenar campos: empresa, RFC, giro
        // - Configurar fechas
        // - Agregar propiedades
        // - Guardar la cotización

        System.out.println("Creando cotización para: " + cotizacion.getEmpresa());
        System.out.println("Folio: " + cotizacion.getFolio());
        System.out.println("RFC: " + cotizacion.getRfc());

        // Simulamos que la cotización fue creada exitosamente
        // En implementación real, esto interactuaría con la UI
    }
}
