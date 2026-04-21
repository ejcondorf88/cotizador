package com.segurax.models;

import java.util.Map;

/**
 * Modelo de datos para un inmueble en el flujo de cotización.
 *
 * <p>Representa todos los datos necesarios para completar el formulario
 * de un inmueble, incluyendo dirección, características constructivas
 * y garantías asegurables.</p>
 *
 * <p>Implementa el patrón Builder para una construcción fluida de instancias.</p>
 *
 * <p>Ejemplo de uso:</p>
 * <pre>
 *   InmuebleData inmueble = InmuebleData.builder()
 *       .conNombre("Oficinas Corporativas")
 *       .conCalle("Av. Reforma 100")
 *       .conCp("06600")
 *       .conEstado("CDMX")
 *       .conCiudad("Ciudad de México")
 *       .conColonia("Juárez")
 *       .conTipoConstructivo("Concreto")
 *       .conAnioConstruccion(2015)
 *       .conNiveles(5)
 *       .conUso("Oficina")
 *       .conGiro("Servicios de Tecnología")
 *       .conGarantiaEdificio(5000000)
 *       .conGarantiaContenidos(2000000)
 *       .build();
 * </pre>
 *
 * @author QA Team - ASDD
 * @version 1.0.0
 */
public class InmuebleData {

    private String nombre;
    private String calle;
    private String cp;
    private String estado;
    private String ciudad;
    private String colonia;
    private String tipoConstructivo;
    private int anioConstruccion;
    private int niveles;
    private String uso;
    private String giro;
    private long garantiaEdificio;
    private long garantiaContenidos;
    private long sumaAsegurada;

    /**
     * Constructor privado - usar builder() para crear instancias.
     */
    private InmuebleData() {
    }

    /**
     * Crea un nuevo builder para construir instancias de InmuebleData.
     *
     * @return Builder para construcción fluida
     */
    public static Builder builder() {
        return new Builder();
    }

    /**
     * Crea un InmuebleData a partir de un Map de datos (útil para DataTables de Cucumber).
     *
     * @param datos Mapa con claves de campo y valores
     * @return Instancia configurada con los datos proporcionados
     */
    public static InmuebleData desdeMap(Map<String, String> datos) {
        return builder()
            .conNombre(datos.get("nombre"))
            .conCalle(datos.get("calle"))
            .conCp(datos.get("cp"))
            .conEstado(datos.get("estado"))
            .conCiudad(datos.get("ciudad"))
            .conColonia(datos.get("colonia"))
            .conTipoConstructivo(datos.get("tipo_constructivo"))
            .conAnioConstruccion(Integer.parseInt(datos.get("año_construccion")))
            .conNiveles(Integer.parseInt(datos.get("niveles")))
            .conUso(datos.get("uso"))
            .conGiro(datos.get("giro"))
            .conGarantiaEdificio(Long.parseLong(datos.get("garantia_edificio")))
            .conGarantiaContenidos(Long.parseLong(datos.get("garantia_contenidos")))
            .build();
    }

    // Getters
    public String getNombre() { return nombre; }
    public String getCalle() { return calle; }
    public String getCp() { return cp; }
    public String getEstado() { return estado; }
    public String getCiudad() { return ciudad; }
    public String getColonia() { return colonia; }
    public String getTipoConstructivo() { return tipoConstructivo; }
    public int getAnioConstruccion() { return anioConstruccion; }
    public int getNiveles() { return niveles; }
    public String getUso() { return uso; }
    public String getGiro() { return giro; }
    public long getGarantiaEdificio() { return garantiaEdificio; }
    public long getGarantiaContenidos() { return garantiaContenidos; }

    /**
     * Calcula la suma asegurada total del inmueble.
     *
     * @return garantiaEdificio + garantiaContenidos
     */
    public long getSumaAsegurada() {
        return garantiaEdificio + garantiaContenidos;
    }

    /**
     * Formatea la suma asegurada como moneda.
     *
     * @return String con formato "$ X,XXX,XXX.00"
     */
    public String getSumaAseguradaFormateada() {
        return String.format("$ %,d.00", getSumaAsegurada());
    }

    @Override
    public String toString() {
        return "InmuebleData{" +
            "nombre='" + nombre + '\'' +
            ", calle='" + calle + '\'' +
            ", cp='" + cp + '\'' +
            ", estado='" + estado + '\'' +
            ", sumaAsegurada=$" + getSumaAsegurada() +
            '}';
    }

    /**
     * Builder para construcción fluida de InmuebleData.
     */
    public static class Builder {
        private InmuebleData data = new InmuebleData();

        public Builder conNombre(String nombre) {
            data.nombre = nombre;
            return this;
        }

        public Builder conCalle(String calle) {
            data.calle = calle;
            return this;
        }

        public Builder conCp(String cp) {
            data.cp = cp;
            return this;
        }

        public Builder conEstado(String estado) {
            data.estado = estado;
            return this;
        }

        public Builder conCiudad(String ciudad) {
            data.ciudad = ciudad;
            return this;
        }

        public Builder conColonia(String colonia) {
            data.colonia = colonia;
            return this;
        }

        public Builder conTipoConstructivo(String tipoConstructivo) {
            data.tipoConstructivo = tipoConstructivo;
            return this;
        }

        public Builder conAnioConstruccion(int anioConstruccion) {
            data.anioConstruccion = anioConstruccion;
            return this;
        }

        public Builder conNiveles(int niveles) {
            data.niveles = niveles;
            return this;
        }

        public Builder conUso(String uso) {
            data.uso = uso;
            return this;
        }

        public Builder conGiro(String giro) {
            data.giro = giro;
            return this;
        }

        public Builder conGarantiaEdificio(long garantiaEdificio) {
            data.garantiaEdificio = garantiaEdificio;
            return this;
        }

        public Builder conGarantiaContenidos(long garantiaContenidos) {
            data.garantiaContenidos = garantiaContenidos;
            return this;
        }

        /**
         * Construye la instancia de InmuebleData.
         *
         * @return Instancia configurada con todos los valores
         * @throws IllegalStateException si faltan campos requeridos
         */
        public InmuebleData build() {
            if (data.nombre == null || data.nombre.isEmpty()) {
                throw new IllegalStateException("El nombre del inmueble es requerido");
            }
            if (data.calle == null || data.calle.isEmpty()) {
                throw new IllegalStateException("La calle es requerida");
            }
            if (data.cp == null || data.cp.isEmpty()) {
                throw new IllegalStateException("El código postal es requerido");
            }
            return data;
        }
    }

    // Datos de prueba predefinidos

    /**
     * Inmueble 1: Oficinas Corporativas (datos del happy path).
     */
    public static InmuebleData oficinasCorporativas() {
        return builder()
            .conNombre("Oficinas Corporativas")
            .conCalle("Av. Reforma 100")
            .conCp("06600")
            .conEstado("CDMX")
            .conCiudad("Ciudad de México")
            .conColonia("Juárez")
            .conTipoConstructivo("Concreto")
            .conAnioConstruccion(2015)
            .conNiveles(5)
            .conUso("Oficina")
            .conGiro("Servicios de Tecnología")
            .conGarantiaEdificio(5000000)
            .conGarantiaContenidos(2000000)
            .build();
    }

    /**
     * Inmueble 2: Sucursal Norte (datos del happy path).
     */
    public static InmuebleData sucursalNorte() {
        return builder()
            .conNombre("Sucursal Norte")
            .conCalle("Av. Insurgentes 500")
            .conCp("03100")
            .conEstado("CDMX")
            .conCiudad("Ciudad de México")
            .conColonia("Del Valle")
            .conTipoConstructivo("Acero")
            .conAnioConstruccion(2018)
            .conNiveles(3)
            .conUso("Comercial")
            .conGiro("Tienda de Electrónicos")
            .conGarantiaEdificio(3000000)
            .conGarantiaContenidos(1500000)
            .build();
    }
}
