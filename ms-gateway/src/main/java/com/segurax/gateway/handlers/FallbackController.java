package com.segurax.gateway.handlers;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

/**
 * Fallback controller para manejar errores de circuit breaker.
 * Retorna respuestas graceful cuando un servicio no está disponible.
 */
@Slf4j
@RestController
@RequestMapping("/fallback")
public class FallbackController {

    /**
     * Fallback para ms-catalogos.
     * Retorna respuesta vacía con indicación de servicio no disponible.
     */
    @GetMapping("/catalogos")
    public ResponseEntity<Map<String, Object>> catalogosFallback() {
        log.warn("[FALLBACK] ms-catalogos no disponible, retornando respuesta por defecto");
        
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", Instant.now().toString());
        response.put("status", "FALLBACK");
        response.put("message", "Servicio de catálogos temporalmente no disponible");
        response.put("data", new HashMap<String, Object>());
        
        // Devolver lista vacía para no romper el frontend
        Map<String, Object> emptyData = new HashMap<>();
        emptyData.put("items", new Object[]{});
        emptyData.put("total", 0);
        emptyData.put("fallback", true);
        response.put("data", emptyData);
        
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response);
    }

    /**
     * Fallback para ms-core.
     */
    @GetMapping("/core")
    public ResponseEntity<Map<String, Object>> coreFallback() {
        log.warn("[FALLBACK] ms-core no disponible");
        
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", Instant.now().toString());
        response.put("status", "FALLBACK");
        response.put("message", "Servicio principal temporalmente no disponible");
        
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response);
    }
}
