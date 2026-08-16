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
    // SEND SIMPLE MAIL
    // =========================================================

    public void sendMail(
            String to,
            String subject,
            String body
    ) {

        if (
                to == null ||
                        to.trim().isEmpty()
        ) {

            throw new RuntimeException(
                    "Customer email address is missing"
            );
        }


        SimpleMailMessage message =
                new SimpleMailMessage();


        message.setTo(to);

        message.setSubject(subject);

        message.setText(body);


        mailSender.send(message);
    }
}