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
            FilterChain filterChain)
            throws ServletException, IOException {


        String requestPath =
                request.getRequestURI();


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


        // ==========================================
        // VALIDATE TOKEN
        // ==========================================

        try {

            String email =
                    jwtUtil.extractEmail(
                            token
                    );


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


            SecurityContextHolder

                    .getContext()

                    .setAuthentication(
                            authentication
                    );


        } catch (Exception e) {


            // ======================================
            // INVALID TOKEN
            // ======================================

            response.setStatus(
                    HttpServletResponse
                            .SC_UNAUTHORIZED
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