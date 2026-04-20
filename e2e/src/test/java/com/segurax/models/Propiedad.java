package com.segurax.models;

/**
 * POJO que representa una propiedad/inmueble a asegurar.
 *
 * <p>Esta clase modela todos los datos de una propiedad incluyendo su
 * dirección, características constructivas, uso y valores asegurables.</p>
 *
 * <p>Usage example:</p>
 * <pre>
 * Propiedad propiedad = new Propiedad();
 * propiedad.setNombre("Oficina Principal");
 * propiedad.setTipoConstruccion("CONCRETO");
 * propiedad.setValorEdificio(1000000);
 * </pre>
 *
 * @author Serenity BDD Template
 * @version 1.0.0
 * @see Direccion
 * @see Cotizacion
 */
public class Propiedad {

    private String nombre;
    private Direccion direccion;
    private String tipoConstruccion;
    private int anioConstruccion;
    private int niveles;
    private String uso;
    private String actividadEspecifica;
    private double valorEdificio;
    private double valorContenido;
    private double valorEquipoElectronico;
    private double valorMaquinaria;
    private double valorExistencias;
    private String estado;
    private int porcentajeCompletitud;

    /**
     * Default constructor.
     */
    public Propiedad() {
    }

    // Getters y Setters

    /**
     * Gets the property name.
     * @return the nombre
     */
    public String getNombre() {
        return nombre;
    }

    /**
     * Sets the property name.
     * @param nombre the nombre to set
     */
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    /**
     * Gets the property address.
     * @return the direccion
     */
    public Direccion getDireccion() {
        return direccion;
    }

    /**
     * Sets the property address.
     * @param direccion the direccion to set
     */
    public void setDireccion(Direccion direccion) {
        this.direccion = direccion;
    }

    /**
     * Gets the construction type.
     * @return the tipoConstruccion
     */
    public String getTipoConstruccion() {
        return tipoConstruccion;
    }

    /**
     * Sets the construction type.
     * @param tipoConstruccion the tipoConstruccion to set
     */
    public void setTipoConstruccion(String tipoConstruccion) {
        this.tipoConstruccion = tipoConstruccion;
    }

    /**
     * Gets the construction year.
     * @return the anioConstruccion
     */
    public int getAnioConstruccion() {
        return anioConstruccion;
    }

    /**
     * Sets the construction year.
     * @param anioConstruccion the anioConstruccion to set
     */
    public void setAnioConstruccion(int anioConstruccion) {
        this.anioConstruccion = anioConstruccion;
    }

    /**
     * Gets the number of levels/floors.
     * @return the niveles
     */
    public int getNiveles() {
        return niveles;
    }

    /**
     * Sets the number of levels/floors.
     * @param niveles the niveles to set
     */
    public void setNiveles(int niveles) {
        this.niveles = niveles;
    }

    /**
     * Gets the property usage type.
     * @return the uso
     */
    public String getUso() {
        return uso;
    }

    /**
     * Sets the property usage type.
     * @param uso the uso to set
     */
    public void setUso(String uso) {
        this.uso = uso;
    }

    /**
     * Gets the specific activity description.
     * @return the actividadEspecifica
     */
    public String getActividadEspecifica() {
        return actividadEspecifica;
    }

    /**
     * Sets the specific activity description.
     * @param actividadEspecifica the actividadEspecifica to set
     */
    public void setActividadEspecifica(String actividadEspecifica) {
        this.actividadEspecifica = actividadEspecifica;
    }

    /**
     * Gets the building value.
     * @return the valorEdificio
     */
    public double getValorEdificio() {
        return valorEdificio;
    }

    /**
     * Sets the building value.
     * @param valorEdificio the valorEdificio to set
     */
    public void setValorEdificio(double valorEdificio) {
        this.valorEdificio = valorEdificio;
    }

    /**
     * Gets the contents value.
     * @return the valorContenido
     */
    public double getValorContenido() {
        return valorContenido;
    }

    /**
     * Sets the contents value.
     * @param valorContenido the valorContenido to set
     */
    public void setValorContenido(double valorContenido) {
        this.valorContenido = valorContenido;
    }

    /**
     * Gets the electronic equipment value.
     * @return the valorEquipoElectronico
     */
    public double getValorEquipoElectronico() {
        return valorEquipoElectronico;
    }

    /**
     * Sets the electronic equipment value.
     * @param valorEquipoElectronico the valorEquipoElectronico to set
     */
    public void setValorEquipoElectronico(double valorEquipoElectronico) {
        this.valorEquipoElectronico = valorEquipoElectronico;
    }

    /**
     * Gets the machinery value.
     * @return the valorMaquinaria
     */
    public double getValorMaquinaria() {
        return valorMaquinaria;
    }

    /**
     * Sets the machinery value.
     * @param valorMaquinaria the valorMaquinaria to set
     */
    public void setValorMaquinaria(double valorMaquinaria) {
        this.valorMaquinaria = valorMaquinaria;
    }

    /**
     * Gets the inventory/stock value.
     * @return the valorExistencias
     */
    public double getValorExistencias() {
        return valorExistencias;
    }

    /**
     * Sets the inventory/stock value.
     * @param valorExistencias the valorExistencias to set
     */
    public void setValorExistencias(double valorExistencias) {
        this.valorExistencias = valorExistencias;
    }

    /**
     * Gets the property status.
     * @return the estado
     */
    public String getEstado() {
        return estado;
    }

    /**
     * Sets the property status.
     * @param estado the estado to set
     */
    public void setEstado(String estado) {
        this.estado = estado;
    }

    /**
     * Gets the completion percentage.
     * @return the porcentajeCompletitud
     */
    public int getPorcentajeCompletitud() {
        return porcentajeCompletitud;
    }

    /**
     * Sets the completion percentage.
     * @param porcentajeCompletitud the porcentajeCompletitud to set
     */
    public void setPorcentajeCompletitud(int porcentajeCompletitud) {
        this.porcentajeCompletitud = porcentajeCompletitud;
    }

    /**
     * Calculates the total coverage value for this property.
     * Sums up all insured values: building, contents, electronic equipment,
     * machinery, and inventory.
     *
     * @return the total coverage value
     */
    public double getValorTotalCobertura() {
        return valorEdificio + valorContenido + valorEquipoElectronico +
                valorMaquinaria + valorExistencias;
    }

    @Override
    public String toString() {
        return String.format("Propiedad{nombre='%s', tipo='%s', valorTotal=%.2f}",
                nombre, tipoConstruccion, getValorTotalCobertura());
    }
}
