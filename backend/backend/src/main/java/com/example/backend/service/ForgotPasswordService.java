package com.example.backend.service;

import com.example.backend.entity.Customer;
import com.example.backend.repository.CustomerRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class ForgotPasswordService {


    @Autowired
    private CustomerRepository customerRepository;


    @Autowired
    private MailService mailService;


    @Autowired
    private OtpStorage otpStorage;


    @Autowired
    private PasswordEncoder passwordEncoder;


    // ==========================================
    // SEND OTP
    // ==========================================

    public String sendOtp(String email) {

        Customer customer =
                customerRepository
                        .findByEmail(email);


        if (customer == null) {

            return "Email Not Registered";
        }


        String otp =
                String.valueOf(

                        100000
                                +
                                new Random()
                                        .nextInt(900000)

                );


        otpStorage.saveOtp(
                email,
                otp
        );


        mailService.sendMail(

                email,

                "Car Rental System - Password Reset OTP",

                "Hello "
                        +
                        customer.getName()
                        +

                        "\n\nYour OTP for password reset is : "
                        +

                        otp
                        +

                        "\n\nThis OTP is valid until you reset your password."
                        +

                        "\n\nDo not share this OTP with anyone."

        );


        return "OTP Sent Successfully";
    }


    // ==========================================
    // VERIFY OTP
    // ==========================================

    public String verifyOtp(

            String email,

            String otp

    ) {

        String savedOtp =
                otpStorage.getOtp(email);


        if (savedOtp == null) {

            return "OTP Expired";
        }


        if (!savedOtp.equals(otp)) {

            return "Invalid OTP";
        }


        return "OTP Verified";
    }


    // ==========================================
    // RESET PASSWORD
    // ==========================================

    public String resetPassword(

            String email,

            String otp,

            String newPassword

    ) {


        // ======================================
        // PASSWORD VALIDATION
        // ======================================

        if (newPassword == null ||
                newPassword.trim().isEmpty()) {

            return "Password Cannot Be Empty";
        }


        // Minimum 8 characters
        if (newPassword.length() < 8) {

            return "Password Must Be At Least 8 Characters";
        }


        // Uppercase
        if (!newPassword.matches(
                ".*[A-Z].*"
        )) {

            return "Password Must Contain An Uppercase Letter";
        }


        // Lowercase
        if (!newPassword.matches(
                ".*[a-z].*"
        )) {

            return "Password Must Contain A Lowercase Letter";
        }


        // Number
        if (!newPassword.matches(
                ".*[0-9].*"
        )) {

            return "Password Must Contain A Number";
        }


        // Special character
        if (!newPassword.matches(
                ".*[!@#$%^&*(),.?\":{}|<>].*"
        )) {

            return "Password Must Contain A Special Character";
        }


        // ======================================
        // VERIFY OTP
        // ======================================

        String savedOtp =
                otpStorage.getOtp(email);


        if (savedOtp == null) {

            return "OTP Expired";
        }


        if (!savedOtp.equals(otp)) {

            return "Invalid OTP";
        }


        // ======================================
        // FIND CUSTOMER
        // ======================================

        Customer customer =
                customerRepository
                        .findByEmail(email);


        if (customer == null) {

            return "Customer Not Found";
        }


        // ======================================
        // IMPORTANT:
        // ENCRYPT NEW PASSWORD USING BCrypt
        // ======================================

        String encryptedPassword =
                passwordEncoder.encode(
                        newPassword
                );


        customer.setPassword(
                encryptedPassword
        );


        // ======================================
        // SAVE CUSTOMER
        // ======================================

        customerRepository.save(
                customer
        );


        // ======================================
        // REMOVE USED OTP
        // ======================================

        otpStorage.removeOtp(
                email
        );


        return "Password Reset Successfully";
    }
}