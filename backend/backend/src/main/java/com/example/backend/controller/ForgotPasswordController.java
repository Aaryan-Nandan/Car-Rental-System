package com.example.backend.controller;

import com.example.backend.service.ForgotPasswordService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/forgot-password")
@CrossOrigin(
        origins = "http://localhost:3000"
)
public class ForgotPasswordController {


    @Autowired
    private ForgotPasswordService
            forgotPasswordService;


    // ==========================================
    // SEND OTP
    // ==========================================

    @PostMapping("/send-otp")
    public String sendOtp(

            @RequestBody
            Map<String, String> request

    ) {

        return forgotPasswordService.sendOtp(

                request.get("email")

        );
    }


    // ==========================================
    // VERIFY OTP
    // ==========================================

    @PostMapping("/verify-otp")
    public String verifyOtp(

            @RequestBody
            Map<String, String> request

    ) {

        return forgotPasswordService.verifyOtp(

                request.get("email"),

                request.get("otp")

        );
    }


    // ==========================================
    // RESET PASSWORD
    // ==========================================

    @PostMapping("/reset-password")
    public String resetPassword(

            @RequestBody
            Map<String, String> request

    ) {

        return forgotPasswordService.resetPassword(

                request.get("email"),

                request.get("otp"),

                request.get("newPassword")

        );
    }
}