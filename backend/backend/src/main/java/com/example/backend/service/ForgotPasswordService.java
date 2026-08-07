package com.example.backend.service;

import com.example.backend.entity.Customer;
import com.example.backend.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
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

    // SEND OTP

    public String sendOtp(String email) {

        Customer customer =
                customerRepository
                        .findByEmail(email);

        if (customer == null) {

            return "Email Not Registered";
        }

        String otp = String.valueOf(

                100000 +
                        new Random().nextInt(900000)

        );

        otpStorage.saveOtp(

                email,

                otp

        );

        mailService.sendMail(

                email,

                "Car Rental System - Password Reset OTP",

                "Hello " +

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

    // VERIFY OTP

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

    // RESET PASSWORD

    public String resetPassword(

            String email,

            String otp,

            String newPassword

    ) {

        String savedOtp =

                otpStorage.getOtp(email);

        if (savedOtp == null) {

            return "OTP Expired";
        }

        if (!savedOtp.equals(otp)) {

            return "Invalid OTP";
        }

        Customer customer =

                customerRepository
                        .findByEmail(email);

        if (customer == null) {

            return "Customer Not Found";
        }

        customer.setPassword(

                newPassword

        );

        customerRepository.save(

                customer

        );

        otpStorage.removeOtp(

                email

        );

        return "Password Reset Successfully";
    }

}