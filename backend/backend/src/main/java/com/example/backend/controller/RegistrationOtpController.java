package com.example.backend.controller;

import com.example.backend.dto.ApiResponse;
import com.example.backend.entity.Customer;
import com.example.backend.service.RegistrationOtpService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/customer")
@CrossOrigin(origins = "http://localhost:3000")
public class RegistrationOtpController {

    @Autowired
    private RegistrationOtpService registrationOtpService;

    // SEND OTP

    @PostMapping("/send-registration-otp")
    public ApiResponse sendRegistrationOtp(

            @RequestBody Map<String, String> request

    ) {

        return registrationOtpService.sendOtp(

                request.get("email")

        );

    }

    // VERIFY OTP

    @PostMapping("/verify-registration-otp")
    public ApiResponse verifyRegistrationOtp(

            @RequestBody Map<String, String> request

    ) {

        return registrationOtpService.verifyOtp(

                request.get("email"),

                request.get("otp")

        );

    }

    // REGISTER CUSTOMER

    @PostMapping("/register-with-otp")
    public ApiResponse registerCustomer(

            @RequestBody Map<String, Object> request

    ) {

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

        return registrationOtpService.registerCustomer(

                customer,

                otp

        );

    }

}