package com.segurax.gateway.filters;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.time.Instant;

/**
 * Global filter for logging all requests and responses passing through the gateway.
 * Logs request ID, HTTP method, path, duration, and response status.
 */
@Slf4j
@Component
public class LoggingFilter implements GlobalFilter, Ordered {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String requestId = exchange.getRequest().getId();
        String method = exchange.getRequest().getMethod().name();
        String path = exchange.getRequest().getPath().value();
        Instant startTime = Instant.now();

        log.info("[REQUEST] [{}] {} {}", requestId, method, path);

        return chain.filter(exchange)
                .doFinally(signalType -> {
                    Duration duration = Duration.between(startTime, Instant.now());
                    int statusCode = exchange.getResponse().getStatusCode() != null
                            ? exchange.getResponse().getStatusCode().value()
                            : 0;

                    log.info("[RESPONSE] [{}] {} {} - {}ms - Status {}",
                            requestId, method, path, duration.toMillis(), statusCode);
                });
    }

    @Override
    public int getOrder() {
        // Highest precedence to ensure logging happens first
        return Ordered.HIGHEST_PRECEDENCE;
    }

}
