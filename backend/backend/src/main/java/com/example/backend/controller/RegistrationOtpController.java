package com.example.backend.controller;

import com.example.backend.dto.ApiResponse;
import com.example.backend.entity.Customer;
import com.example.backend.service.RegistrationOtpService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/customer")
public class RegistrationOtpController {

    @Autowired
    private RegistrationOtpService registrationOtpService;


    // =====================================================
    // SEND REGISTRATION OTP
    // =====================================================

    @PostMapping(
            value = "/send-registration-otp",
            consumes = "application/json",
            produces = "application/json"
    )
    public ApiResponse sendRegistrationOtp(
            @RequestBody Map<String, String> request) {

        String email =
                request.get("email");

        System.out.println(
                "SEND OTP REQUEST EMAIL: " + email
        );

        if (email == null ||
                email.trim().isEmpty()) {

            return new ApiResponse(
                    false,
                    "Email is required."
            );
        }

        email = email.trim();

        try {

            ApiResponse response =
                    registrationOtpService.sendOtp(
                            email
                    );

            System.out.println(
                    "SEND OTP RESPONSE SUCCESS: "
                            + response.isSuccess()
            );

            System.out.println(
                    "SEND OTP RESPONSE MESSAGE: "
                            + response.getMessage()
            );

            return response;

        } catch (Exception e) {

            e.printStackTrace();

            return new ApiResponse(
                    false,
                    "OTP ERROR: " + e.getMessage()
            );
        }
    }


    // =====================================================
    // VERIFY REGISTRATION OTP
    // =====================================================

    @PostMapping(
            value = "/verify-registration-otp",
            consumes = "application/json",
            produces = "application/json"
    )
    public ApiResponse verifyRegistrationOtp(
            @RequestBody Map<String, String> request) {

        String email =
                request.get("email");

        String otp =
                request.get("otp");

        System.out.println(
                "VERIFY OTP REQUEST EMAIL: "
                        + email
        );

        System.out.println(
                "VERIFY OTP REQUEST OTP: "
                        + otp
        );

        if (email == null ||
                email.trim().isEmpty()) {

            return new ApiResponse(
                    false,
                    "Email is required."
            );
        }

        if (otp == null ||
                otp.trim().isEmpty()) {

            return new ApiResponse(
                    false,
                    "OTP is required."
            );
        }

        email = email.trim();
        otp = otp.trim();

        try {

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

        } catch (Exception e) {

            System.out.println(
                    "VERIFY OTP ERROR: "
                            + e.getMessage()
            );

            e.printStackTrace();

            return new ApiResponse(
                    false,
                    "Unable to verify OTP. Please try again."
            );
        }
    }


    // =====================================================
    // REGISTER CUSTOMER WITH OTP
    // =====================================================

    @PostMapping(
            value = "/register-with-otp",
            consumes = "application/json",
            produces = "application/json"
    )
    public ApiResponse registerCustomer(
            @RequestBody Map<String, Object> request) {

        String name =
                (String) request.get("name");

        String email =
                (String) request.get("email");

        String phone =
                (String) request.get("phone");

        String password =
                (String) request.get("password");

        String otp =
                (String) request.get("otp");


        System.out.println(
                "REGISTER REQUEST NAME: "
                        + name
        );

        System.out.println(
                "REGISTER REQUEST EMAIL: "
                        + email
        );


        // ==========================================
        // VALIDATION
        // ==========================================

        if (name == null ||
                name.trim().isEmpty()) {

            return new ApiResponse(
                    false,
                    "Name is required."
            );
        }

        if (email == null ||
                email.trim().isEmpty()) {

            return new ApiResponse(
                    false,
                    "Email is required."
            );
        }

        if (phone == null ||
                phone.trim().isEmpty()) {

            return new ApiResponse(
                    false,
                    "Phone number is required."
            );
        }

        if (password == null ||
                password.isEmpty()) {

            return new ApiResponse(
                    false,
                    "Password is required."
            );
        }

        if (otp == null ||
                otp.trim().isEmpty()) {

            return new ApiResponse(
                    false,
                    "OTP is required."
            );
        }


        // ==========================================
        // CLEAN VALUES
        // ==========================================

        name =
                name.trim();

        email =
                email.trim();

        phone =
                phone.trim();

        otp =
                otp.trim();


        // ==========================================
        // CREATE CUSTOMER
        // ==========================================

        Customer customer =
                new Customer();

        customer.setName(
                name
        );

        customer.setEmail(
                email
        );

        customer.setPhone(
                phone
        );

        customer.setPassword(
                password
        );


        // ==========================================
        // REGISTER CUSTOMER
        // ==========================================

        try {

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

        } catch (Exception e) {

            System.out.println(
                    "REGISTER ERROR: "
                            + e.getMessage()
            );

            e.printStackTrace();

            return new ApiResponse(
                    false,
                    "Unable to register customer. Please try again."
            );
        }
    }
}