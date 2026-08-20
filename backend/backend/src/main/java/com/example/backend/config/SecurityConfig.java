package com.example.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import java.util.Arrays;

@Configuration
public class SecurityConfig {

    // ==========================================
    // PASSWORD ENCODER
    // ==========================================

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();

    }

    // ==========================================
    // CORS CONFIGURATION
    // ==========================================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.setAllowedOrigins(
                Arrays.asList(
                        "http://localhost:3000",
                        "https://car-rental-com-six.vercel.app"

                )
        );

        configuration.setAllowedMethods(
                Arrays.asList(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                Arrays.asList(
                        "*"
                )
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }

    // ==========================================
    // SECURITY FILTER CHAIN
    // ==========================================

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http

                // ==================================
                // CSRF
                // ==================================

                .csrf(
                        csrf -> csrf.disable()
                )

                // ==================================
                // CORS
                // ==================================

                .cors(
                        cors -> cors
                                .configurationSource(
                                        corsConfigurationSource()
                                )
                )

                // ==================================
                // AUTHORIZATION
                // ==================================

                .authorizeHttpRequests(
                        auth -> auth

                                // --------------------------
                                // CORS OPTIONS
                                // --------------------------

                                .requestMatchers(
                                        HttpMethod.OPTIONS,
                                        "/**"
                                )
                                .permitAll()

                                // --------------------------
                                // CUSTOMER AUTHENTICATION
                                // --------------------------

                                .requestMatchers(
                                        "/customer/login",
                                        "/customer/register",
                                        "/customer/send-registration-otp",
                                        "/customer/verify-registration-otp",
                                        "/customer/register-with-otp"
                                )
                                .permitAll()

                                // --------------------------
                                // FORGOT PASSWORD
                                // --------------------------

                                .requestMatchers(
                                        "/forgot-password/**"
                                )
                                .permitAll()

                                // --------------------------
                                // ADMIN AUTHENTICATION
                                // --------------------------

                                .requestMatchers(
                                        "/admin/login",
                                        "/admin/register"
                                )
                                .permitAll()

                                // --------------------------
                                // CAR VARIANTS
                                // --------------------------

                                .requestMatchers(
                                        "/variant/**"
                                )
                                .permitAll()

                                // --------------------------
                                // BOOKINGS
                                // TEMPORARILY PUBLIC
                                // --------------------------

                                .requestMatchers(
                                        "/booking/all"
                                )
                                .permitAll()

                                // --------------------------
                                // PAYMENTS
                                // TEMPORARILY PUBLIC
                                // --------------------------

                                .requestMatchers(
                                        "/payment/all"
                                )
                                .permitAll()

                                // --------------------------
                                // EVERYTHING ELSE
                                // --------------------------

                                .anyRequest()
                                .permitAll()
                )

                // ==================================
                // HTTP BASIC DISABLED
                // ==================================

                .httpBasic(
                        httpBasic ->
                                httpBasic.disable()
                )

                // ==================================
                // FORM LOGIN DISABLED
                // ==================================

                .formLogin(
                        formLogin ->
                                formLogin.disable()
                );

        return http.build();
    }
}