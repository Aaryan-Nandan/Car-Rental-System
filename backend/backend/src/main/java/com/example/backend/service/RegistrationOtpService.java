package com.example.backend.service;

import com.example.backend.dto.ApiResponse;
import com.example.backend.entity.Customer;
import com.example.backend.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class RegistrationOtpService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private RegistrationOtpStorage otpStorage;

    @Autowired
    private MailService mailService;

    // SEND OTP
    public ApiResponse sendOtp(String email) {

        Customer customer =
                customerRepository.findByEmail(email);

        if (customer != null) {

            return new ApiResponse(

                    false,

                    "Email Already Registered"

            );

        }

        String otp =
                String.valueOf(

                        100000 +

                                new Random().nextInt(900000)

                );

        otpStorage.saveOtp(

                email,

                otp

        );

        mailService.sendMail(

                email,

                "Verify Your Email - Car Rental System",

                "Hello,\n\n"

                        + "Welcome to Car Rental System."

                        + "\n\n"

                        + "Your Email Verification OTP is:\n\n"

                        + otp

                        + "\n\n"

                        + "This OTP will expire in 5 minutes."

                        + "\n\n"

                        + "Do not share this OTP with anyone."

                        + "\n\n"

                        + "Regards,"

                        + "\nCar Rental Team"

        );

        return new ApiResponse(

                true,

                "OTP Sent Successfully"

        );

    }

    // VERIFY OTP
    public ApiResponse verifyOtp(

            String email,

            String otp

    ) {

        boolean verified =

                otpStorage.verifyOtp(

                        email,

                        otp

                );

        if (!verified) {

            return new ApiResponse(

                    false,

                    "Invalid Or Expired OTP"

            );

        }

        return new ApiResponse(

                true,

                "OTP Verified"

        );

    }

    // REGISTER CUSTOMER
    public ApiResponse registerCustomer(

            Customer customer,

            String otp

    ) {

        Customer existingCustomer =

                customerRepository.findByEmail(

                        customer.getEmail()

                );

        if (existingCustomer != null) {

            return new ApiResponse(

                    false,

                    "Email Already Registered"

            );

        }

        boolean verified =

                otpStorage.verifyOtp(

                        customer.getEmail(),

                        otp

                );

        if (!verified) {

            return new ApiResponse(

                    false,

                    "Invalid Or Expired OTP"

            );

        }

        customerRepository.save(

                customer

        );

        otpStorage.removeOtp(

                customer.getEmail()

        );

        return new ApiResponse(

                true,

                "Registration Successful"

        );

    }

}