package com.segurax;

import io.cucumber.junit.CucumberOptions;
import net.serenitybdd.cucumber.CucumberWithSerenity;
import org.junit.runner.RunWith;

/**
 * Cucumber Test Suite - Entry point for all Serenity BDD tests.
 *
 * <p>This runner executes all feature files in src/test/resources/features/
 * using the Spanish language (es) for Gherkin scenarios.</p>
 *
 * <p>Configuration:</p>
 * <ul>
 *   <li>Features path: src/test/resources/features/</li>
 *   <li>Step definitions: com.segurax.stepdefinitions</li>
 *   <li>Excluded tags: @wip, @manual</li>
 * </ul>
 *
 * @author Serenity BDD Template
 * @version 1.0.0
 */
@RunWith(CucumberWithSerenity.class)
@CucumberOptions(
        plugin = {
                "pretty",
                "html:target/cucumber-reports/cucumber-html-report.html",
                "json:target/cucumber-reports/cucumber-report.json"
        },
        features = "src/test/resources/features/",
        glue = {
                "com.segurax.stepdefinitions"
        },
        tags = "not @wip and not @manual",
        monochrome = true,
        dryRun = false
)
public class CucumberTestSuite {
    // Test runner - configuration via annotations above
}
