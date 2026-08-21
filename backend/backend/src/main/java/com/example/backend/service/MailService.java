package com.example.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class MailService {

    @Value("${brevo.api.key}")
    private String brevoApiKey;

    @Value("${brevo.sender.email}")
    private String senderEmail;

    private final HttpClient httpClient =
            HttpClient.newHttpClient();


    // =========================================================
    // SEND EMAIL USING BREVO HTTPS API
    // =========================================================

    public void sendMail(
            String to,
            String subject,
            String body
    ) {

        System.out.println("========================================");
        System.out.println("BREVO EMAIL START");
        System.out.println("TO: " + to);
        System.out.println("SUBJECT: " + subject);
        System.out.println("========================================");


        // =====================================================
        // VALIDATION
        // =====================================================

        if (to == null || to.trim().isEmpty()) {

            throw new RuntimeException(
                    "Customer email address is missing"
            );
        }


        if (brevoApiKey == null ||
                brevoApiKey.trim().isEmpty()) {

            throw new RuntimeException(
                    "BREVO_API_KEY is not configured"
            );
        }


        if (senderEmail == null ||
                senderEmail.trim().isEmpty()) {

            throw new RuntimeException(
                    "BREVO_SENDER_EMAIL is not configured"
            );
        }


        String cleanEmail = to.trim();


        // =====================================================
        // JSON ESCAPING
        // =====================================================

        String safeTo =
                escapeJson(cleanEmail);

        String safeSender =
                escapeJson(senderEmail.trim());

        String safeSubject =
                escapeJson(subject);

        String safeBody =
                escapeJson(body);


        // =====================================================
        // BREVO REQUEST BODY
        // =====================================================

        String jsonBody =
                "{"
                        + "\"sender\":{"
                        + "\"name\":\"CarRental\","
                        + "\"email\":\"" + safeSender + "\""
                        + "},"
                        + "\"to\":[{"
                        + "\"email\":\"" + safeTo + "\""
                        + "}],"
                        + "\"subject\":\"" + safeSubject + "\","
                        + "\"textContent\":\"" + safeBody + "\""
                        + "}";


        System.out.println(
                "BREVO REQUEST PREPARED"
        );


        try {

            // =================================================
            // HTTP REQUEST
            // =================================================

            HttpRequest request =
                    HttpRequest.newBuilder()
                            .uri(
                                    URI.create(
                                            "https://api.brevo.com/v3/smtp/email"
                                    )
                            )
                            .header(
                                    "accept",
                                    "application/json"
                            )
                            .header(
                                    "api-key",
                                    brevoApiKey.trim()
                            )
                            .header(
                                    "content-type",
                                    "application/json"
                            )
                            .POST(
                                    HttpRequest.BodyPublishers.ofString(
                                            jsonBody
                                    )
                            )
                            .build();


            // =================================================
            // SEND REQUEST
            // =================================================

            HttpResponse<String> response =
                    httpClient.send(
                            request,
                            HttpResponse.BodyHandlers.ofString()
                    );


            // =================================================
            // PRINT RESPONSE
            // =================================================

            System.out.println(
                    "========================================"
            );

            System.out.println(
                    "BREVO STATUS: "
                            + response.statusCode()
            );

            System.out.println(
                    "BREVO RESPONSE: "
                            + response.body()
            );

            System.out.println(
                    "========================================"
            );


            // =================================================
            // SUCCESS
            // =================================================

            if (response.statusCode() >= 200 &&
                    response.statusCode() < 300) {

                System.out.println(
                        "EMAIL SENT SUCCESSFULLY THROUGH BREVO"
                );

                System.out.println(
                        "EMAIL RECIPIENT: "
                                + cleanEmail
                );

                return;
            }


            // =================================================
            // FAILURE
            // =================================================

            throw new RuntimeException(
                    "Brevo email failed. HTTP "
                            + response.statusCode()
                            + ": "
                            + response.body()
            );


        } catch (InterruptedException e) {

            Thread.currentThread().interrupt();

            throw new RuntimeException(
                    "Brevo email sending was interrupted",
                    e
            );


        } catch (Exception e) {

            System.out.println(
                    "========================================"
            );

            System.out.println(
                    "BREVO EMAIL ERROR"
            );

            System.out.println(
                    e.getMessage()
            );

            System.out.println(
                    "========================================"
            );

            throw new RuntimeException(
                    "Unable to send email through Brevo",
                    e
            );
        }
    }


    // =========================================================
    // JSON ESCAPE
    // =========================================================

    private String escapeJson(String value) {

        if (value == null) {
            return "";
        }

        return value
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\r", "\\r")
                .replace("\n", "\\n")
                .replace("\t", "\\t");
    }
}