package com.segurax.models;

/**
 * POJO que representa una dirección postal.
 *
 * <p>Esta clase modela los componentes de una dirección incluyendo
 * calle, número, colonia, ciudad, estado y código postal.</p>
 *
 * <p>Usage example:</p>
 * <pre>
 * Direccion direccion = new Direccion(
 *     "Av. Principal",
 *     "Centro",
 *     "Ciudad de México",
 *     "CDMX",
 *     "01000"
 * );
 * </pre>
 *
 * @author Serenity BDD Template
 * @version 1.0.0
 * @see Propiedad
 */
public class Direccion {

    private String calle;
    private String numero;
    private String colonia;
    private String ciudad;
    private String estado;
    private String codigoPostal;

    /**
     * Default constructor.
     */
    public Direccion() {
    }

    /**
     * Constructor with main address fields.
     *
     * @param calle         the street name
     * @param colonia       the neighborhood
     * @param ciudad        the city
     * @param estado        the state
     * @param codigoPostal  the postal code
     */
    public Direccion(String calle, String colonia, String ciudad, String estado, String codigoPostal) {
        this.calle = calle;
        this.colonia = colonia;
        this.ciudad = ciudad;
        this.estado = estado;
        this.codigoPostal = codigoPostal;
    }

    /**
     * Full constructor with all fields including street number.
     *
     * @param calle         the street name
     * @param numero        the street number
     * @param colonia       the neighborhood
     * @param ciudad        the city
     * @param estado        the state
     * @param codigoPostal  the postal code
     */
    public Direccion(String calle, String numero, String colonia, String ciudad, String estado, String codigoPostal) {
        this.calle = calle;
        this.numero = numero;
        this.colonia = colonia;
        this.ciudad = ciudad;
        this.estado = estado;
        this.codigoPostal = codigoPostal;
    }

    // Getters y Setters

    /**
     * Gets the street name.
     * @return the calle
     */
    public String getCalle() {
        return calle;
    }

    /**
     * Sets the street name.
     * @param calle the calle to set
     */
    public void setCalle(String calle) {
        this.calle = calle;
    }

    /**
     * Gets the street number.
     * @return the numero
     */
    public String getNumero() {
        return numero;
    }

    /**
     * Sets the street number.
     * @param numero the numero to set
     */
    public void setNumero(String numero) {
        this.numero = numero;
    }

    /**
     * Gets the neighborhood.
     * @return the colonia
     */
    public String getColonia() {
        return colonia;
    }

    /**
     * Sets the neighborhood.
     * @param colonia the colonia to set
     */
    public void setColonia(String colonia) {
        this.colonia = colonia;
    }

    /**
     * Gets the city.
     * @return the ciudad
     */
    public String getCiudad() {
        return ciudad;
    }

    /**
     * Sets the city.
     * @param ciudad the ciudad to set
     */
    public void setCiudad(String ciudad) {
        this.ciudad = ciudad;
    }

    /**
     * Gets the state.
     * @return the estado
     */
    public String getEstado() {
        return estado;
    }

    /**
     * Sets the state.
     * @param estado the estado to set
     */
    public void setEstado(String estado) {
        this.estado = estado;
    }

    /**
     * Gets the postal code.
     * @return the codigoPostal
     */
    public String getCodigoPostal() {
        return codigoPostal;
    }

    /**
     * Sets the postal code.
     * @param codigoPostal the codigoPostal to set
     */
    public void setCodigoPostal(String codigoPostal) {
        this.codigoPostal = codigoPostal;
    }

    /**
     * Returns the full address as a formatted string.
     * @return formatted address
     */
    public String getDireccionCompleta() {
        StringBuilder sb = new StringBuilder();
        sb.append(calle);
        if (numero != null && !numero.isEmpty()) {
            sb.append(" ").append(numero);
        }
        sb.append(", ").append(colonia);
        sb.append(", ").append(ciudad);
        sb.append(", ").append(estado);
        sb.append(" ").append(codigoPostal);
        return sb.toString();
    }

    @Override
    public String toString() {
        return getDireccionCompleta();
    }
}
