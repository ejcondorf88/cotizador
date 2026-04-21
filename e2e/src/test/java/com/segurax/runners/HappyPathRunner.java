package com.segurax.runners;

import io.cucumber.junit.CucumberOptions;
import net.serenitybdd.cucumber.CucumberWithSerenity;
import org.junit.runner.RunWith;

/**
 * Runner específico para los tests del Happy Path E2E.
 *
 * <p>Este runner ejecuta exclusivamente los escenarios del happy path
 * cubriendo los 5 microflujos del flujo completo de cotización:</p>
 * <ul>
 *   <li>Microflujo 1: Homepage → Página de Cotización</li>
 *   <li>Microflujo 2: Crear cotización → Folio generado</li>
 *   <li>Microflujo 3: Seleccionar 2 inmuebles</li>
 *   <li>Microflujo 4: Completar datos de inmuebles</li>
 *   <li>Microflujo 5: Configurar coberturas</li>
 * </ul>
 *
 * <p>Ejecución por línea de comandos:</p>
 * <pre>
 * # Ejecutar todos los happy path
 * mvn clean verify -Dtest=HappyPathRunner
 *
 * # Ejecutar con tag específico
 * mvn clean verify -Dcucumber.filter.tags="@happy-path"
 *
 * # Ejecutar un microflujo específico
 * mvn clean verify -Dcucumber.filter.tags="@microflujo-1"
 * </pre>
 *
 * @author QA Team - ASDD
 * @version 1.0.0
 * @see CucumberWithSerenity
 */
@RunWith(CucumberWithSerenity.class)
@CucumberOptions(
    plugin = {
        "pretty",
        "html:target/cucumber-reports/cucumber-html-report.html",
        "json:target/cucumber-reports/cucumber-report.json",
        "junit:target/cucumber-reports/cucumber-junit.xml"
    },
    features = "src/test/resources/features/happy_path_flujo_completo.feature",
    glue = {
        "com.segurax.stepdefinitions",
        "com.segurax.hooks"
    },
    tags = "not @wip and not @manual and not @pending",
    monochrome = true,
    dryRun = false,
    snippets = CucumberOptions.SnippetType.CAMELCASE
)
public class HappyPathRunner {
    // Runner configuration via annotations above
}
