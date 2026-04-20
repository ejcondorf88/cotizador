package com.segurax.models;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * POJO que representa una cotización de seguro de propiedad.
 *
 * <p>Esta clase modela los datos principales de una cotización incluyendo
 * información de la empresa, fechas de vigencia, estado y las propiedades
 * asociadas a asegurar.</p>
 *
 * <p>Usage example:</p>
 * <pre>
 * Cotizacion cotizacion = new Cotizacion("COT-2026-00001", "Mi Empresa SA");
 * cotizacion.setRfc("RFC123456789");
 * cotizacion.setPropiedades(Arrays.asList(propiedad1, propiedad2));
 * </pre>
 *
 * @author Serenity BDD Template
 * @version 1.0.0
 * @see Propiedad
 * @see Direccion
 */
public class Cotizacion {

    private String folio;
    private String empresa;
    private String rfc;
    private String giro;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private String estado;
    private List<Propiedad> propiedades;

    /**
     * Default constructor. Initializes the properties list.
     */
    public Cotizacion() {
        this.propiedades = new ArrayList<>();
    }

    /**
     * Constructor with folio and empresa. Sets estado to "DRAFT".
     *
     * @param folio   the quote folio number
     * @param empresa the company name
     */
    public Cotizacion(String folio, String empresa) {
        this();
        this.folio = folio;
        this.empresa = empresa;
        this.estado = "DRAFT";
    }

    // Getters y Setters

    /**
     * Gets the folio number.
     * @return the folio
     */
    public String getFolio() {
        return folio;
    }

    /**
     * Sets the folio number.
     * @param folio the folio to set
     */
    public void setFolio(String folio) {
        this.folio = folio;
    }

    /**
     * Gets the company name.
     * @return the empresa
     */
    public String getEmpresa() {
        return empresa;
    }

    /**
     * Sets the company name.
     * @param empresa the empresa to set
     */
    public void setEmpresa(String empresa) {
        this.empresa = empresa;
    }

    /**
     * Gets the RFC (tax ID).
     * @return the rfc
     */
    public String getRfc() {
        return rfc;
    }

    /**
     * Sets the RFC (tax ID).
     * @param rfc the rfc to set
     */
    public void setRfc(String rfc) {
        this.rfc = rfc;
    }

    /**
     * Gets the business line.
     * @return the giro
     */
    public String getGiro() {
        return giro;
    }

    /**
     * Sets the business line.
     * @param giro the giro to set
     */
    public void setGiro(String giro) {
        this.giro = giro;
    }

    /**
     * Gets the start date of the insurance.
     * @return the fechaInicio
     */
    public LocalDate getFechaInicio() {
        return fechaInicio;
    }

    /**
     * Sets the start date of the insurance.
     * @param fechaInicio the fechaInicio to set
     */
    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    /**
     * Gets the end date of the insurance.
     * @return the fechaFin
     */
    public LocalDate getFechaFin() {
        return fechaFin;
    }

    /**
     * Sets the end date of the insurance.
     * @param fechaFin the fechaFin to set
     */
    public void setFechaFin(LocalDate fechaFin) {
        this.fechaFin = fechaFin;
    }

    /**
     * Gets the quote status.
     * @return the estado
     */
    public String getEstado() {
        return estado;
    }

    /**
     * Sets the quote status.
     * @param estado the estado to set
     */
    public void setEstado(String estado) {
        this.estado = estado;
    }

    /**
     * Gets the list of properties.
     * @return the propiedades
     */
    public List<Propiedad> getPropiedades() {
        return propiedades;
    }

    /**
     * Sets the list of properties.
     * @param propiedades the propiedades to set
     */
    public void setPropiedades(List<Propiedad> propiedades) {
        this.propiedades = propiedades;
    }

    /**
     * Adds a single property to the list.
     * @param propiedad the property to add
     */
    public void addPropiedad(Propiedad propiedad) {
        this.propiedades.add(propiedad);
    }

    /**
     * Calculates the total insured value across all properties.
     * @return the total coverage value
     */
    public double getValorTotalAsegurado() {
        return propiedades.stream()
                .mapToDouble(Propiedad::getValorTotalCobertura)
                .sum();
    }

    @Override
    public String toString() {
        return String.format("Cotizacion{folio='%s', empresa='%s', estado='%s', propiedades=%d}",
                folio, empresa, estado, propiedades != null ? propiedades.size() : 0);
    }
}
