package com.segurax.targets;

import net.serenitybdd.screenplay.targets.Target;
import org.openqa.selenium.By;

/**
 * Targets para el formulario de datos de inmuebles.
 *
 * <p>Elementos UI del modal/formulario donde se ingresan los datos
 * completos de cada inmueble: dirección, características constructivas,
 * garantías y demás información.</p>
 *
 * @author QA Team - ASDD
 * @version 1.0.0
 */
public class PropertyFormTargets {

    private PropertyFormTargets() {
        // Clase de utilidad
    }

    /**
     * Campo para el nombre del inmueble.
     */
    public static final Target INPUT_NOMBRE_INMUEBLE = Target.the("input nombre inmueble")
        .located(By.cssSelector("[data-testid='input-nombre-inmueble']"));

    /**
     * Campo para la calle y número.
     */
    public static final Target INPUT_CALLE = Target.the("input calle")
        .located(By.cssSelector("[data-testid='input-calle']"));

    /**
     * Campo para el código postal.
     */
    public static final Target INPUT_CODIGO_POSTAL = Target.the("input código postal")
        .located(By.cssSelector("[data-testid='input-codigo-postal']"));

    /**
     * Selector dropdown para el estado.
     */
    public static final Target SELECT_ESTADO = Target.the("select estado")
        .located(By.cssSelector("[data-testid='select-estado']"));

    /**
     * Campo para la ciudad.
     */
    public static final Target INPUT_CIUDAD = Target.the("input ciudad")
        .located(By.cssSelector("[data-testid='input-ciudad']"));

    /**
     * Campo para la colonia.
     */
    public static final Target INPUT_COLONIA = Target.the("input colonia")
        .located(By.cssSelector("[data-testid='input-colonia']"));

    /**
     * Selector dropdown para el tipo constructivo.
     */
    public static final Target SELECT_TIPO_CONSTRUCTIVO = Target.the("select tipo constructivo")
        .located(By.cssSelector("[data-testid='select-tipo-constructivo']"));

    /**
     * Campo para el año de construcción.
     */
    public static final Target INPUT_ANIO_CONSTRUCCION = Target.the("input año construcción")
        .located(By.cssSelector("[data-testid='input-anio-construccion']"));

    /**
     * Campo para el número de niveles.
     */
    public static final Target INPUT_NIVELES = Target.the("input niveles")
        .located(By.cssSelector("[data-testid='input-niveles']"));

    /**
     * Selector dropdown para el uso del inmueble.
     */
    public static final Target SELECT_USO = Target.the("select uso")
        .located(By.cssSelector("[data-testid='select-uso']"));

    /**
     * Campo para el giro empresarial.
     */
    public static final Target INPUT_GIRO = Target.the("input giro")
        .located(By.cssSelector("[data-testid='input-giro']"));

    /**
     * Campo para el valor de garantía del edificio.
     */
    public static final Target INPUT_GARANTIA_EDIFICIO = Target.the("input garantía edificio")
        .located(By.cssSelector("[data-testid='input-garantia-edificio']"));

    /**
     * Campo para el valor de garantía de contenidos.
     */
    public static final Target INPUT_GARANTIA_CONTENIDOS = Target.the("input garantía contenidos")
        .located(By.cssSelector("[data-testid='input-garantia-contenidos']"));

    /**
     * Botón Guardar del formulario de inmueble.
     */
    public static final Target BOTON_GUARDAR_INMUEBLE = Target.the("botón Guardar inmueble")
        .located(By.cssSelector("[data-testid='btn-guardar-inmueble']"));

    /**
     * Botón Cancelar del formulario.
     */
    public static final Target BOTON_CANCELAR = Target.the("botón Cancelar")
        .located(By.cssSelector("[data-testid='btn-cancelar-inmueble']"));

    /**
     * Modal/Contenedor del formulario de inmueble.
     */
    public static final Target MODAL_FORMULARIO_INMUEBLE = Target.the("modal formulario inmueble")
        .located(By.cssSelector("[data-testid='modal-formulario-inmueble']"));

    /**
     * Indicador de suma asegurada del inmueble actual.
     */
    public static final Target SUMA_ASEGURADA_INMUEBLE = Target.the("suma asegurada inmueble")
        .located(By.cssSelector("[data-testid='suma-asegurada-inmueble']"));
}
