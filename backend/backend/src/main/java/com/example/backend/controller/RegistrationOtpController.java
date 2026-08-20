package com.example.backend.controller;

import com.example.backend.dto.ApiResponse;
import com.example.backend.entity.Customer;
import com.example.backend.service.RegistrationOtpService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/customer")
//@CrossOrigin(origins = "http://localhost:3000")
public class RegistrationOtpController {

    @Autowired
    private RegistrationOtpService registrationOtpService;


    // ==========================================
    // SEND REGISTRATION OTP
    // ==========================================

    @PostMapping("/send-registration-otp")
    public ApiResponse sendRegistrationOtp(
            @RequestBody Map<String, String> request) {

        String email = request.get("email");

        System.out.println(
                "SEND OTP REQUEST EMAIL: " + email
        );

        ApiResponse response =
                registrationOtpService.sendOtp(email);

        System.out.println(
                "SEND OTP RESPONSE SUCCESS: "
                        + response.isSuccess()
        );

        System.out.println(
                "SEND OTP RESPONSE MESSAGE: "
                        + response.getMessage()
        );

        return response;
    }


    // ==========================================
    // VERIFY REGISTRATION OTP
    // ==========================================

    @PostMapping("/verify-registration-otp")
    public ApiResponse verifyRegistrationOtp(
            @RequestBody Map<String, String> request) {

        String email = request.get("email");

        String otp = request.get("otp");

        ApiResponse response =
                registrationOtpService.verifyOtp(
                        email,
                        otp
                );

        System.out.println(
                "VERIFY OTP SUCCESS: "
                        + response.isSuccess()
        );

        System.out.println(
                "VERIFY OTP MESSAGE: "
                        + response.getMessage()
        );

        return response;
    }


    // ==========================================
    // REGISTER CUSTOMER
    // ==========================================

    @PostMapping("/register-with-otp")
    public ApiResponse registerCustomer(
            @RequestBody Map<String, Object> request) {

        Customer customer = new Customer();

        customer.setName(
                (String) request.get("name")
        );

        customer.setEmail(
                (String) request.get("email")
        );

        customer.setPhone(
                (String) request.get("phone")
        );

        customer.setPassword(
                (String) request.get("password")
        );

        String otp =
                (String) request.get("otp");

        ApiResponse response =
                registrationOtpService.registerCustomer(
                        customer,
                        otp
                );

        System.out.println(
                "REGISTER SUCCESS: "
                        + response.isSuccess()
        );

        System.out.println(
                "REGISTER MESSAGE: "
                        + response.getMessage()
        );

        return response;
    }
}