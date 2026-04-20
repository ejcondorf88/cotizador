package com.segurax.models.factories;

import com.segurax.models.Cotizacion;
import com.segurax.models.Direccion;
import com.segurax.models.Propiedad;
import com.segurax.models.builders.CotizacionBuilder;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Factory para crear cotizaciones de prueba.
 *
 * <p>Implementa el patrón Object Mother para proporcionar
 * datos de prueba preconfigurados y consistentes.</p>
 *
 * <p>Usage example:</p>
 * <pre>
 * // Get a complete valid quote
 * Cotizacion cotizacion = CotizacionFactory.unaCotizacionValida();
 *
 * // Get a quote with custom folio
 * Cotizacion custom = CotizacionFactory.unaCotizacionConFolio("COT-2026-99999");
 *
 * // Get test properties
 * Propiedad propiedad = CotizacionFactory.unaPropiedadCompleta();
 * </pre>
 *
 * @author Serenity BDD Template
 * @version 1.0.0
 * @see Cotizacion
 * @see CotizacionBuilder
 */
public class CotizacionFactory {

    /**
     * Private constructor to prevent instantiation.
     */
    private CotizacionFactory() {
        // Utility class
    }

    /**
     * Crea una cotización válida para pruebas con datos completos.
     *
     * @return Cotizacion with complete test data
     */
    public static Cotizacion unaCotizacionValida() {
        return CotizacionBuilder.unaCotizacion()
                .conFolio("COT-2026-00001")
                .conEmpresa("Empresa de Prueba SA")
                .conRfc("EPR123456789")
                .conGiro("Tecnología")
                .conFechas(LocalDate.now(), LocalDate.now().plusYears(1))
                .conPropiedad(unaPropiedadCompleta())
                .conEstado("DRAFT")
                .build();
    }

    /**
     * Crea una cotización con folio personalizado.
     *
     * @param folio the custom folio number
     * @return Cotizacion with custom folio
     */
    public static Cotizacion unaCotizacionConFolio(String folio) {
        return CotizacionBuilder.unaCotizacion()
                .conFolio(folio)
                .conEmpresa("Empresa Test")
                .conRfc("TEST123456")
                .conGiro("Comercio")
                .conFechas(LocalDate.now(), LocalDate.now().plusMonths(6))
                .conEstado("DRAFT")
                .build();
    }

    /**
     * Crea una propiedad completa con todos los datos.
     *
     * @return Propiedad with complete data
     */
    public static Propiedad unaPropiedadCompleta() {
        Propiedad propiedad = new Propiedad();
        propiedad.setNombre("Inmueble Principal");
        propiedad.setDireccion(unaDireccionValida());
        propiedad.setTipoConstruccion("CONCRETO");
        propiedad.setAnioConstruccion(2020);
        propiedad.setNiveles(2);
        propiedad.setUso("COMERCIAL");
        propiedad.setActividadEspecifica("Tienda de abarrotes");
        propiedad.setValorEdificio(1000000);
        propiedad.setValorContenido(500000);
        propiedad.setValorEquipoElectronico(100000);
        propiedad.setValorMaquinaria(0);
        propiedad.setValorExistencias(200000);
        propiedad.setEstado("COMPLETE");
        propiedad.setPorcentajeCompletitud(100);
        return propiedad;
    }

    /**
     * Crea una propiedad incompleta para pruebas de validación.
     *
     * @return Propiedad with partial data
     */
    public static Propiedad unaPropiedadIncompleta() {
        Propiedad propiedad = new Propiedad();
        propiedad.setNombre("Inmueble Incompleto");
        propiedad.setDireccion(unaDireccionParcial());
        propiedad.setTipoConstruccion("CONCRETO");
        propiedad.setUso("COMERCIAL");
        propiedad.setActividadEspecifica("Tienda");
        propiedad.setEstado("INCOMPLETE");
        propiedad.setPorcentajeCompletitud(40);
        return propiedad;
    }

    /**
     * Crea múltiples propiedades para pruebas bulk.
     *
     * @param cantidad the number of properties to create
     * @return List of Propiedad
     */
    public static List<Propiedad> multiplesPropiedades(int cantidad) {
        List<Propiedad> propiedades = new ArrayList<>();
        for (int i = 1; i <= cantidad; i++) {
            propiedades.add(crearPropiedad("Inmueble " + i, String.format("%05d", i * 1000), 1000000 * i));
        }
        return propiedades;
    }

    /**
     * Creates a property with specified parameters.
     *
     * @param nombre the property name
     * @param cp     the postal code
     * @param valor  the building value
     * @return Propiedad with specified data
     */
    private static Propiedad crearPropiedad(String nombre, String cp, double valor) {
        Propiedad propiedad = new Propiedad();
        propiedad.setNombre(nombre);
        propiedad.setDireccion(unaDireccionConCp(cp));
        propiedad.setValorEdificio(valor);
        propiedad.setEstado("COMPLETE");
        propiedad.setPorcentajeCompletitud(100);
        return propiedad;
    }

    /**
     * Crea una dirección válida completa.
     *
     * @return Direccion with complete address
     */
    public static Direccion unaDireccionValida() {
        return new Direccion(
                "Av. Principal",
                "Centro",
                "Ciudad de México",
                "CDMX",
                "01000"
        );
    }

    /**
     * Creates a partial address for incomplete property tests.
     *
     * @return Direccion with partial address
     */
    private static Direccion unaDireccionParcial() {
        return new Direccion(
                "Calle Sin Número",
                "Centro",
                "Ciudad de México",
                "CDMX",
                "01000"
        );
    }

    /**
     * Creates an address with a specific postal code.
     *
     * @param cp the postal code
     * @return Direccion with specified postal code
     */
    private static Direccion unaDireccionConCp(String cp) {
        return new Direccion(
                "Av. Secundaria",
                "Colonia",
                "Ciudad",
                "Estado",
                cp
        );
    }
}
