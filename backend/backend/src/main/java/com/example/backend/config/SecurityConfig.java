package com.example.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

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

                /*
                 * CorsConfig.java contains the single
                 * CorsConfigurationSource bean.
                 *
                 * Spring Security will use that bean
                 * automatically.
                 */

                .cors(
                        cors -> {}
                )


                // ==================================
                // AUTHORIZATION
                // ==================================

                .authorizeHttpRequests(
                        auth -> auth


                                // ==================================
                                // CORS OPTIONS
                                // ==================================

                                .requestMatchers(
                                        HttpMethod.OPTIONS,
                                        "/**"
                                )
                                .permitAll()


                                // ==================================
                                // CUSTOMER AUTHENTICATION
                                // ==================================

                                .requestMatchers(
                                        "/customer/login",
                                        "/customer/register",
                                        "/customer/send-registration-otp",
                                        "/customer/verify-registration-otp",
                                        "/customer/register-with-otp"
                                )
                                .permitAll()


                                // ==================================
                                // FORGOT PASSWORD
                                // ==================================

                                .requestMatchers(
                                        "/forgot-password/**"
                                )
                                .permitAll()


                                // ==================================
                                // ADMIN AUTHENTICATION
                                // ==================================

                                .requestMatchers(
                                        "/admin/login",
                                        "/admin/register"
                                )
                                .permitAll()


                                // ==================================
                                // CAR VARIANTS
                                // ==================================

                                .requestMatchers(
                                        "/variant/**"
                                )
                                .permitAll()


                                // ==================================
                                // BOOKINGS
                                // ==================================

                                .requestMatchers(
                                        "/booking/all"
                                )
                                .permitAll()


                                // ==================================
                                // PAYMENTS
                                // ==================================

                                .requestMatchers(
                                        "/payment/all"
                                )
                                .permitAll()


                                // ==================================
                                // EVERYTHING ELSE
                                // ==================================

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