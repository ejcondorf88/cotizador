package com.segurax.models.builders;

import com.segurax.models.Cotizacion;
import com.segurax.models.Propiedad;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Builder para crear instancias de {@link Cotizacion}.
 *
 * <p>Este builder permite la construcción fluida de cotizaciones
 * utilizando el patrón Builder. Facilita la creación de objetos
 * complejos paso a paso.</p>
 *
 * <p>Usage example:</p>
 * <pre>
 * Cotizacion cotizacion = CotizacionBuilder.unaCotizacion()
 *     .conFolio("COT-2026-00001")
 *     .conEmpresa("Mi Empresa SA")
 *     .conRfc("RFC123456789")
 *     .conGiro("Tecnología")
 *     .conFechas(LocalDate.now(), LocalDate.now().plusYears(1))
 *     .conPropiedad(unaPropiedad)
 *     .conEstado("DRAFT")
 *     .build();
 * </pre>
 *
 * @author Serenity BDD Template
 * @version 1.0.0
 * @see Cotizacion
 * @see Propiedad
 */
public class CotizacionBuilder {

    private String folio;
    private String empresa;
    private String rfc;
    private String giro;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private String estado;
    private List<Propiedad> propiedades;

    /**
     * Private constructor to enforce factory method usage.
     * Initializes defaults.
     */
    private CotizacionBuilder() {
        this.propiedades = new ArrayList<>();
        this.estado = "DRAFT";
    }

    /**
     * Factory method to create a new builder instance.
     *
     * @return a new CotizacionBuilder
     */
    public static CotizacionBuilder unaCotizacion() {
        return new CotizacionBuilder();
    }

    /**
     * Sets the folio number.
     *
     * @param folio the folio to set
     * @return this builder for method chaining
     */
    public CotizacionBuilder conFolio(String folio) {
        this.folio = folio;
        return this;
    }

    /**
     * Sets the company name.
     *
     * @param empresa the company name to set
     * @return this builder for method chaining
     */
    public CotizacionBuilder conEmpresa(String empresa) {
        this.empresa = empresa;
        return this;
    }

    /**
     * Sets the RFC (tax ID).
     *
     * @param rfc the RFC to set
     * @return this builder for method chaining
     */
    public CotizacionBuilder conRfc(String rfc) {
        this.rfc = rfc;
        return this;
    }

    /**
     * Sets the business line.
     *
     * @param giro the business line to set
     * @return this builder for method chaining
     */
    public CotizacionBuilder conGiro(String giro) {
        this.giro = giro;
        return this;
    }

    /**
     * Sets the insurance dates.
     *
     * @param inicio the start date
     * @param fin    the end date
     * @return this builder for method chaining
     */
    public CotizacionBuilder conFechas(LocalDate inicio, LocalDate fin) {
        this.fechaInicio = inicio;
        this.fechaFin = fin;
        return this;
    }

    /**
     * Adds a single property.
     *
     * @param propiedad the property to add
     * @return this builder for method chaining
     */
    public CotizacionBuilder conPropiedad(Propiedad propiedad) {
        this.propiedades.add(propiedad);
        return this;
    }

    /**
     * Adds multiple properties.
     *
     * @param propiedades the properties to add
     * @return this builder for method chaining
     */
    public CotizacionBuilder conPropiedades(List<Propiedad> propiedades) {
        this.propiedades.addAll(propiedades);
        return this;
    }

    /**
     * Sets the quote status.
     *
     * @param estado the status to set
     * @return this builder for method chaining
     */
    public CotizacionBuilder conEstado(String estado) {
        this.estado = estado;
        return this;
    }

    /**
     * Builds the Cotizacion instance with all configured values.
     *
     * @return a new Cotizacion instance
     */
    public Cotizacion build() {
        Cotizacion cotizacion = new Cotizacion();
        cotizacion.setFolio(folio);
        cotizacion.setEmpresa(empresa);
        cotizacion.setRfc(rfc);
        cotizacion.setGiro(giro);
        cotizacion.setFechaInicio(fechaInicio);
        cotizacion.setFechaFin(fechaFin);
        cotizacion.setEstado(estado);
        cotizacion.setPropiedades(propiedades);
        return cotizacion;
    }
}
