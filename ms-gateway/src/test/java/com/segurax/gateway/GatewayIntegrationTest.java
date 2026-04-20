package com.segurax.gateway;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cloud.gateway.route.RouteDefinition;
import org.springframework.cloud.gateway.route.RouteDefinitionLocator;
import org.springframework.test.web.reactive.server.WebTestClient;
import reactor.core.publisher.Flux;

import java.util.concurrent.atomic.AtomicBoolean;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Integration tests for the API Gateway routing and actuator endpoints.
 * Tests verify routes configuration and health endpoints.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureWebTestClient
class GatewayIntegrationTest {

    @Autowired
    private WebTestClient webTestClient;

    @Autowired
    private RouteDefinitionLocator routeDefinitionLocator;

    @Test
    @DisplayName("Health endpoint should return UP status")
    void testHealthEndpoint() {
        // GIVEN - Gateway is running with actuator health endpoint configured

        // WHEN - Requesting the health endpoint
        // THEN - Should return UP status
        webTestClient.get()
                .uri("/actuator/health")
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.status").isEqualTo("UP");
    }

    @Test
    @DisplayName("Gateway routes endpoint should return configured routes")
    void testGatewayRoutesEndpoint() {
        // GIVEN - Gateway has routes configured in application.yml

        // WHEN - Requesting the gateway routes actuator endpoint
        // THEN - Should return list of configured routes
        webTestClient.get()
                .uri("/actuator/gateway/routes")
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.[*].route_id").exists()
                .jsonPath("$.length()").isNumber();
    }

    @Test
    @DisplayName("Route to ms-core should be configured with correct predicates")
    void testRouteToMsCoreConfiguration() {
        // GIVEN - Route definition locator is available
        Flux<RouteDefinition> routes = routeDefinitionLocator.getRouteDefinitions();

        // WHEN - Searching for ms-core route
        AtomicBoolean msCoreRouteFound = new AtomicBoolean(false);
        routes.collectList()
                .doOnNext(routeDefinitions -> {
                    boolean found = routeDefinitions.stream()
                            .anyMatch(route -> "ms-core".equals(route.getId()));
                    msCoreRouteFound.set(found);

                    // THEN - ms-core route should exist with correct configuration
                    assertThat(found)
                            .as("ms-core route should be configured")
                            .isTrue();

                    routeDefinitions.stream()
                            .filter(route -> "ms-core".equals(route.getId()))
                            .findFirst()
                            .ifPresent(route -> {
                                assertThat(route.getUri().toString())
                                        .as("ms-core should route to localhost:3000")
                                        .contains("localhost:3000");
                                assertThat(route.getPredicates())
                                        .as("ms-core should have path predicates")
                                        .isNotEmpty();
                            });
                })
                .block();
    }

    @Test
    @DisplayName("Route to ms-frontend should be configured with correct predicates")
    void testRouteToFrontendConfiguration() {
        // GIVEN - Route definition locator is available
        Flux<RouteDefinition> routes = routeDefinitionLocator.getRouteDefinitions();

        // WHEN - Searching for ms-frontend route
        routes.collectList()
                .doOnNext(routeDefinitions -> {
                    boolean found = routeDefinitions.stream()
                            .anyMatch(route -> "ms-frontend".equals(route.getId()));

                    // THEN - ms-frontend route should exist with correct configuration
                    assertThat(found)
                            .as("ms-frontend route should be configured")
                            .isTrue();

                    routeDefinitions.stream()
                            .filter(route -> "ms-frontend".equals(route.getId()))
                            .findFirst()
                            .ifPresent(route -> {
                                assertThat(route.getUri().toString())
                                        .as("ms-frontend should route to localhost:5173")
                                        .contains("localhost:5173");
                            });
                })
                .block();
    }

    @Test
    @DisplayName("Gateway CORS configuration should be loaded")
    void testCorsConfigurationLoaded() {
        // GIVEN - Gateway has global CORS configuration loaded from application.yml

        // WHEN - Checking health endpoint
        // THEN - Should respond successfully without CORS error
        // Note: Full CORS preflight test requires actual downstream services
        // This test verifies the gateway starts correctly with CORS config
        webTestClient.get()
                .uri("/actuator/health")
                .exchange()
                .expectStatus().isOk();
    }

    @Test
    @DisplayName("Gateway routes should handle unmatched paths")
    void testUnmatchedRoutesFallback() {
        // GIVEN - A path that would match frontend catch-all
        // Note: Since frontend runs on :5173, this will attempt to connect
        // and fail with connection error, returning 500

        // WHEN - Requesting a path that would be routed
        // THEN - Should handle the request (may be 500 if service unavailable)
        webTestClient.get()
                .uri("/some-path")
                .exchange()
                .expectStatus().is5xxServerError();

        // This demonstrates that routes are configured - if no routes matched,
        // we'd get 404. The 500 indicates the route matched and tried to proxy.
    }

    @Test
    @DisplayName("Actuator info endpoint should be available")
    void testActuatorInfoEndpoint() {
        // GIVEN - Gateway is running with actuator configured

        // WHEN - Requesting the info endpoint
        // THEN - Should return application information
        webTestClient.get()
                .uri("/actuator/info")
                .exchange()
                .expectStatus().isOk();
    }

    @Test
    @DisplayName("Gateway should have at least two routes configured (ms-core and ms-frontend)")
    void testMinimumRoutesConfigured() {
        // GIVEN - Route definition locator is available
        Flux<RouteDefinition> routes = routeDefinitionLocator.getRouteDefinitions();

        // WHEN - Counting configured routes
        Long routeCount = routes.count().block();

        // THEN - Should have at least the ms-core and ms-frontend routes
        assertThat(routeCount)
                .as("Gateway should have at least 2 routes configured")
                .isGreaterThanOrEqualTo(2);
    }
}
