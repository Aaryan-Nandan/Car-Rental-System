package com.example.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    @Autowired
    private JavaMailSender mailSender;


    // =========================================================
    // SEND EMAIL USING GMAIL SMTP
    // =========================================================

    public void sendMail(
            String to,
            String subject,
            String body
    ) {

        System.out.println("========================================");
        System.out.println("GMAIL EMAIL START");
        System.out.println("TO: " + to);
        System.out.println("SUBJECT: " + subject);
        System.out.println("========================================");


        if (to == null || to.trim().isEmpty()) {

            throw new RuntimeException(
                    "Customer email address is missing"
            );
        }


        String cleanEmail = to.trim();


        try {

            SimpleMailMessage message =
                    new SimpleMailMessage();

            message.setFrom(
                    "g4golden1401@gmail.com"
            );

            message.setTo(
                    cleanEmail
            );

            message.setSubject(
                    subject
            );

            message.setText(
                    body
            );


            mailSender.send(message);


            System.out.println(
                    "========================================"
            );

            System.out.println(
                    "EMAIL SENT SUCCESSFULLY"
            );

            System.out.println(
                    "EMAIL RECIPIENT: "
                            + cleanEmail
            );

            System.out.println(
                    "========================================"
            );


        } catch (Exception e) {

            System.out.println(
                    "========================================"
            );

            System.out.println(
                    "GMAIL EMAIL ERROR"
            );

            System.out.println(
                    "ERROR: "
                            + e.getMessage()
            );

            e.printStackTrace();

            System.out.println(
                    "========================================"
            );


            throw new RuntimeException(
                    "Unable to send email through Gmail",
                    e
            );
        }
    }
}