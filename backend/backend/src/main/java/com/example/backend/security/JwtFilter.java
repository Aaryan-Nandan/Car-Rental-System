package com.example.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;

import org.springframework.stereotype.Component;

import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

@Component
public class JwtFilter extends OncePerRequestFilter {

    // ==========================================
    // JWT UTIL
    // ==========================================

    @Autowired
    private JwtUtil jwtUtil;


    // ==========================================
    // FILTER
    // ==========================================

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {


        String requestPath =
                request.getRequestURI();


        System.out.println(
                "=========================================="
        );

        System.out.println(
                "JWT FILTER REQUEST: " + requestPath
        );


        // ==========================================
        // PUBLIC ENDPOINTS
        // ==========================================

        if (

                requestPath.equals(
                        "/customer/login"
                )

                        ||

                        requestPath.equals(
                                "/customer/register"
                        )

                        ||

                        requestPath.equals(
                                "/customer/send-registration-otp"
                        )

                        ||

                        requestPath.equals(
                                "/customer/verify-registration-otp"
                        )

                        ||

                        requestPath.equals(
                                "/customer/register-with-otp"
                        )

                        ||

                        requestPath.equals(
                                "/admin/login"
                        )

                        ||

                        requestPath.equals(
                                "/admin/register"
                        )

                        ||

                        requestPath.startsWith(
                                "/forgot-password/"
                        )

                        ||

                        requestPath.equals(
                                "/variant/all"
                        )

                        ||

                        requestPath.equals(
                                "/booking/all"
                        )

                        ||

                        requestPath.equals(
                                "/payment/all"
                        )

        ) {

            System.out.println(
                    "PUBLIC ENDPOINT - JWT CHECK SKIPPED"
            );

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }


        // ==========================================
        // AUTHORIZATION HEADER
        // ==========================================

        String authHeader =
                request.getHeader(
                        "Authorization"
                );


        System.out.println(
                "Authorization Header Present: "
                        + (authHeader != null)
        );


        // ==========================================
        // NO TOKEN
        // ==========================================

        if (

                authHeader == null

                        ||

                        !authHeader.startsWith(
                                "Bearer "
                        )

        ) {

            System.out.println(
                    "NO VALID BEARER TOKEN FOUND"
            );

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }


        // ==========================================
        // EXTRACT TOKEN
        // ==========================================

        String token =
                authHeader.substring(7);


        System.out.println(
                "JWT TOKEN RECEIVED"
        );


        // ==========================================
        // CHECK EMPTY TOKEN
        // ==========================================

        if (
                token == null
                        ||
                        token.trim().isEmpty()
        ) {

            System.out.println(
                    "JWT TOKEN IS EMPTY"
            );

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }


        // ==========================================
        // VALIDATE TOKEN
        // ==========================================

        try {

            String email =
                    jwtUtil.extractEmail(
                            token
                    );


            System.out.println(
                    "JWT VALIDATION SUCCESS"
            );

            System.out.println(
                    "JWT EMAIL: " + email
            );


            // ======================================
            // CREATE AUTHENTICATION
            // ======================================

            UsernamePasswordAuthenticationToken
                    authentication =

                    new UsernamePasswordAuthenticationToken(

                            email,

                            null,

                            new ArrayList<>()

                    );


            authentication.setDetails(

                    new WebAuthenticationDetailsSource()

                            .buildDetails(
                                    request
                            )

            );


            // ======================================
            // SET SECURITY CONTEXT
            // ======================================

            SecurityContextHolder

                    .getContext()

                    .setAuthentication(
                            authentication
                    );


            System.out.println(
                    "SECURITY CONTEXT AUTHENTICATION SET"
            );


        } catch (Exception e) {


            // ======================================
            // JWT VALIDATION FAILED
            // ======================================

            System.out.println(
                    "=========================================="
            );

            System.out.println(
                    "JWT VALIDATION FAILED"
            );

            System.out.println(
                    "Request Path: " + requestPath
            );

            System.out.println(
                    "Exception Type: "
                            + e.getClass().getName()
            );

            System.out.println(
                    "Exception Message: "
                            + e.getMessage()
            );

            System.out.println(
                    "=========================================="
            );


            // ======================================
            // PRINT COMPLETE ERROR
            // ======================================

            e.printStackTrace();


            // ======================================
            // RETURN 401
            // ======================================

            response.setStatus(
                    HttpServletResponse.SC_UNAUTHORIZED
            );

            response.setContentType(
                    "application/json"
            );

            response.getWriter().write(
                    "{\"success\":false,\"message\":\"Invalid or expired token\"}"
            );

            return;
        }


        // ==========================================
        // CONTINUE REQUEST
        // ==========================================

        filterChain.doFilter(
                request,
                response
        );
    }
}