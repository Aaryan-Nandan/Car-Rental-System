package com.example.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();

        // ==========================================
        // ALLOWED FRONTEND ORIGINS
        // ==========================================

        config.setAllowedOriginPatterns(
                Arrays.asList(

                        // LOCAL DEVELOPMENT
                        "http://localhost:*",
                        "http://127.0.0.1:*",

                        // VERCEL
                        "https://*.vercel.app"
                )
        );

        // ==========================================
        // ALLOWED METHODS
        // ==========================================

        config.setAllowedMethods(
                Arrays.asList(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS",
                        "PATCH"
                )
        );

        // ==========================================
        // ALLOWED HEADERS
        // ==========================================

        config.setAllowedHeaders(
                Arrays.asList("*")
        );

        // ==========================================
        // EXPOSED HEADERS
        // ==========================================

        config.setExposedHeaders(
                Arrays.asList(
                        "Authorization",
                        "Content-Type"
                )
        );

        // ==========================================
        // CREDENTIALS
        // ==========================================

        config.setAllowCredentials(true);

        // ==========================================
        // REGISTER CORS
        // ==========================================

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                config
        );

        return source;
    }
}