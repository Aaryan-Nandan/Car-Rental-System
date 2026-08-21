package com.example.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class CorsConfig {

    // ==========================================
    // CORS CONFIGURATION
    // ==========================================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config =
                new CorsConfiguration();

        // ==========================================
        // ALLOWED FRONTEND ORIGINS
        // ==========================================

        config.setAllowedOrigins(
                Arrays.asList(
                        "http://localhost:3000",

                        "https://car-rental-com-git-main-aaryan-nandan1.vercel.app",

                        "https://car-rental-q1wadgws7-aaryan-nandan1.vercel.app",

                        "https://car-rental-com-six.vercel.app"
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
                Arrays.asList(
                        "*"
                )
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
        // REGISTER CORS CONFIGURATION
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