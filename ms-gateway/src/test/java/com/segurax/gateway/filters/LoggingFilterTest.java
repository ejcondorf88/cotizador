package com.segurax.gateway.filters;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.system.CapturedOutput;
import org.springframework.boot.test.system.OutputCaptureExtension;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.core.Ordered;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.RequestPath;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for the LoggingFilter.
 * Verifies that requests and responses are properly logged.
 */
@ExtendWith({MockitoExtension.class, OutputCaptureExtension.class})
class LoggingFilterTest {

    private LoggingFilter loggingFilter;

    @Mock
    private ServerWebExchange exchange;

    @Mock
    private ServerHttpRequest request;

    @Mock
    private ServerHttpResponse response;

    @Mock
    private RequestPath requestPath;

    @Mock
    private GatewayFilterChain chain;

    @BeforeEach
    void setUp() {
        loggingFilter = new LoggingFilter();
    }

    @Test
    @DisplayName("Filter should have HIGHEST_PRECEDENCE order")
    void testFilterOrder() {
        // GIVEN - LoggingFilter is instantiated

        // WHEN - Getting the order
        int order = loggingFilter.getOrder();

        // THEN - Should be HIGHEST_PRECEDENCE
        assertThat(order).isEqualTo(Ordered.HIGHEST_PRECEDENCE);
    }

    @Test
    @DisplayName("Filter should log request details")
    void testRequestLogging(CapturedOutput output) {
        // GIVEN - Mocked ServerWebExchange with request details
        String requestId = "test-request-id-123";
        HttpMethod method = HttpMethod.GET;
        String path = "/api/v1/quotes";

        when(exchange.getRequest()).thenReturn(request);
        when(request.getId()).thenReturn(requestId);
        when(request.getMethod()).thenReturn(method);
        when(request.getPath()).thenReturn(requestPath);
        when(requestPath.value()).thenReturn(path);

        when(exchange.getResponse()).thenReturn(response);
        when(response.getStatusCode()).thenReturn(HttpStatus.OK);

        when(chain.filter(exchange)).thenReturn(Mono.empty());

        // WHEN - Executing the filter
        Mono<Void> result = loggingFilter.filter(exchange, chain);
        StepVerifier.create(result).verifyComplete();

        // THEN - Request should be logged
        verify(chain).filter(exchange);
        assertThat(output.getOut())
                .contains("[REQUEST]")
                .contains(requestId)
                .contains("GET")
                .contains(path);
    }

    @Test
    @DisplayName("Filter should log response details with status code and duration")
    void testResponseLogging(CapturedOutput output) {
        // GIVEN - Mocked ServerWebExchange with response details
        String requestId = "test-request-id-456";
        HttpMethod method = HttpMethod.POST;
        String path = "/api/v1/quotes";

        when(exchange.getRequest()).thenReturn(request);
        when(request.getId()).thenReturn(requestId);
        when(request.getMethod()).thenReturn(method);
        when(request.getPath()).thenReturn(requestPath);
        when(requestPath.value()).thenReturn(path);

        when(exchange.getResponse()).thenReturn(response);
        when(response.getStatusCode()).thenReturn(HttpStatus.CREATED);

        when(chain.filter(exchange)).thenReturn(Mono.empty());

        // WHEN - Executing the filter
        Mono<Void> result = loggingFilter.filter(exchange, chain);
        StepVerifier.create(result).verifyComplete();

        // THEN - Response should be logged with status code
        verify(chain).filter(exchange);
        assertThat(output.getOut())
                .contains("[RESPONSE]")
                .contains(requestId)
                .contains("POST")
                .contains(path)
                .contains("Status 201");
    }

    @Test
    @DisplayName("Filter should handle different HTTP methods")
    void testLoggingWithDifferentMethods(CapturedOutput output) {
        // GIVEN - POST request
        String requestId = "test-request-id-789";
        HttpMethod method = HttpMethod.POST;
        String path = "/api/v1/quotes";

        when(exchange.getRequest()).thenReturn(request);
        when(request.getId()).thenReturn(requestId);
        when(request.getMethod()).thenReturn(method);
        when(request.getPath()).thenReturn(requestPath);
        when(requestPath.value()).thenReturn(path);

        when(exchange.getResponse()).thenReturn(response);
        when(response.getStatusCode()).thenReturn(HttpStatus.CREATED);

        when(chain.filter(exchange)).thenReturn(Mono.empty());

        // WHEN - Executing the filter
        Mono<Void> result = loggingFilter.filter(exchange, chain);
        StepVerifier.create(result).verifyComplete();

        // THEN - Should log POST method correctly
        assertThat(output.getOut()).contains("POST").contains("/api/v1/quotes");
    }

    @Test
    @DisplayName("Filter should handle PUT method")
    void testLoggingWithPutMethod(CapturedOutput output) {
        // GIVEN - PUT request
        String requestId = "test-put-id";
        HttpMethod method = HttpMethod.PUT;
        String path = "/api/v1/quotes/123";

        when(exchange.getRequest()).thenReturn(request);
        when(request.getId()).thenReturn(requestId);
        when(request.getMethod()).thenReturn(method);
        when(request.getPath()).thenReturn(requestPath);
        when(requestPath.value()).thenReturn(path);

        when(exchange.getResponse()).thenReturn(response);
        when(response.getStatusCode()).thenReturn(HttpStatus.OK);

        when(chain.filter(exchange)).thenReturn(Mono.empty());

        // WHEN - Executing the filter
        Mono<Void> result = loggingFilter.filter(exchange, chain);
        StepVerifier.create(result).verifyComplete();

        // THEN - Should log PUT method correctly
        assertThat(output.getOut()).contains("PUT").contains("/api/v1/quotes/123");
    }

    @Test
    @DisplayName("Filter should handle DELETE method")
    void testLoggingWithDeleteMethod(CapturedOutput output) {
        // GIVEN - DELETE request
        String requestId = "test-delete-id";
        HttpMethod method = HttpMethod.DELETE;
        String path = "/api/v1/quotes/456";

        when(exchange.getRequest()).thenReturn(request);
        when(request.getId()).thenReturn(requestId);
        when(request.getMethod()).thenReturn(method);
        when(request.getPath()).thenReturn(requestPath);
        when(requestPath.value()).thenReturn(path);

        when(exchange.getResponse()).thenReturn(response);
        when(response.getStatusCode()).thenReturn(HttpStatus.NO_CONTENT);

        when(chain.filter(exchange)).thenReturn(Mono.empty());

        // WHEN - Executing the filter
        Mono<Void> result = loggingFilter.filter(exchange, chain);
        StepVerifier.create(result).verifyComplete();

        // THEN - Should log DELETE method correctly
        assertThat(output.getOut()).contains("DELETE").contains("/api/v1/quotes/456");
    }

    @Test
    @DisplayName("Filter should handle null status code")
    void testLoggingWithNullStatusCode(CapturedOutput output) {
        // GIVEN - Response with null status code
        String requestId = "test-null-status";
        HttpMethod method = HttpMethod.GET;
        String path = "/api/v1/quotes";

        when(exchange.getRequest()).thenReturn(request);
        when(request.getId()).thenReturn(requestId);
        when(request.getMethod()).thenReturn(method);
        when(request.getPath()).thenReturn(requestPath);
        when(requestPath.value()).thenReturn(path);

        when(exchange.getResponse()).thenReturn(response);
        when(response.getStatusCode()).thenReturn(null);

        when(chain.filter(exchange)).thenReturn(Mono.empty());

        // WHEN - Executing the filter
        Mono<Void> result = loggingFilter.filter(exchange, chain);
        StepVerifier.create(result).verifyComplete();

        // THEN - Should log with status 0
        assertThat(output.getOut()).contains("Status 0");
    }

    @Test
    @DisplayName("Filter should propagate chain errors")
    void testFilterPropagatesErrors() {
        // GIVEN - Chain that throws an error
        RuntimeException expectedException = new RuntimeException("Chain error");
        when(exchange.getRequest()).thenReturn(request);
        when(request.getId()).thenReturn("test-error-id");
        when(request.getMethod()).thenReturn(HttpMethod.GET);
        when(request.getPath()).thenReturn(requestPath);
        when(requestPath.value()).thenReturn("/test");
        when(exchange.getResponse()).thenReturn(response);
        when(response.getStatusCode()).thenReturn(HttpStatus.INTERNAL_SERVER_ERROR);
        when(chain.filter(exchange)).thenReturn(Mono.error(expectedException));

        // WHEN - Executing the filter
        Mono<Void> result = loggingFilter.filter(exchange, chain);

        // THEN - Error should be propagated
        StepVerifier.create(result)
                .expectError(RuntimeException.class)
                .verify();
    }

    @Test
    @DisplayName("Filter should call chain.filter exactly once")
    void testChainFilterCalledOnce() {
        // GIVEN - Properly mocked exchange and chain
        when(exchange.getRequest()).thenReturn(request);
        when(request.getId()).thenReturn("test-once-id");
        when(request.getMethod()).thenReturn(HttpMethod.GET);
        when(request.getPath()).thenReturn(requestPath);
        when(requestPath.value()).thenReturn("/test");
        when(exchange.getResponse()).thenReturn(response);
        when(response.getStatusCode()).thenReturn(HttpStatus.OK);
        when(chain.filter(exchange)).thenReturn(Mono.empty());

        // WHEN - Executing the filter
        Mono<Void> result = loggingFilter.filter(exchange, chain);
        StepVerifier.create(result).verifyComplete();

        // THEN - Chain should be called exactly once
        verify(chain, times(1)).filter(exchange);
    }

    @Test
    @DisplayName("Filter should log duration in milliseconds")
    void testResponseIncludesDuration(CapturedOutput output) {
        // GIVEN - Mocked exchange
        when(exchange.getRequest()).thenReturn(request);
        when(request.getId()).thenReturn("test-duration-id");
        when(request.getMethod()).thenReturn(HttpMethod.GET);
        when(request.getPath()).thenReturn(requestPath);
        when(requestPath.value()).thenReturn("/test");
        when(exchange.getResponse()).thenReturn(response);
        when(response.getStatusCode()).thenReturn(HttpStatus.OK);
        when(chain.filter(exchange)).thenReturn(Mono.empty());

        // WHEN - Executing the filter
        Mono<Void> result = loggingFilter.filter(exchange, chain);
        StepVerifier.create(result).verifyComplete();

        // THEN - Response log should contain duration in ms
        assertThat(output.getOut())
                .contains("ms");
    }

    @Test
    @DisplayName("Filter should handle PATCH method")
    void testLoggingWithPatchMethod(CapturedOutput output) {
        // GIVEN - PATCH request
        String requestId = "test-patch-id";
        HttpMethod method = HttpMethod.PATCH;
        String path = "/api/v1/quotes/789";

        when(exchange.getRequest()).thenReturn(request);
        when(request.getId()).thenReturn(requestId);
        when(request.getMethod()).thenReturn(method);
        when(request.getPath()).thenReturn(requestPath);
        when(requestPath.value()).thenReturn(path);

        when(exchange.getResponse()).thenReturn(response);
        when(response.getStatusCode()).thenReturn(HttpStatus.OK);

        when(chain.filter(exchange)).thenReturn(Mono.empty());

        // WHEN - Executing the filter
        Mono<Void> result = loggingFilter.filter(exchange, chain);
        StepVerifier.create(result).verifyComplete();

        // THEN - Should log PATCH method correctly
        assertThat(output.getOut()).contains("PATCH").contains("/api/v1/quotes/789");
    }

    @Test
    @DisplayName("Filter should log request ID for correlation")
    void testRequestIdLogging(CapturedOutput output) {
        // GIVEN - Exchange with specific request ID
        String requestId = "unique-correlation-id-abc123";
        when(exchange.getRequest()).thenReturn(request);
        when(request.getId()).thenReturn(requestId);
        when(request.getMethod()).thenReturn(HttpMethod.GET);
        when(request.getPath()).thenReturn(requestPath);
        when(requestPath.value()).thenReturn("/api/v1/test");
        when(exchange.getResponse()).thenReturn(response);
        when(response.getStatusCode()).thenReturn(HttpStatus.OK);
        when(chain.filter(exchange)).thenReturn(Mono.empty());

        // WHEN - Executing the filter
        Mono<Void> result = loggingFilter.filter(exchange, chain);
        StepVerifier.create(result).verifyComplete();

        // THEN - Request ID should appear in both request and response logs
        String logOutput = output.getOut();
        assertThat(logOutput)
                .contains("[REQUEST] [" + requestId + "]")
                .contains("[RESPONSE] [" + requestId + "]");
    }
}
