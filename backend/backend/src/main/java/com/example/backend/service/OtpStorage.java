package com.example.backend.service;

import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Component
public class OtpStorage {

    private final Map<String, String> otpMap =
            new HashMap<>();

    private final Map<String, LocalDateTime> expiryMap =
            new HashMap<>();

    public void saveOtp(

            String email,

            String otp

    ) {

        otpMap.put(

                email,

                otp

        );

        expiryMap.put(

                email,

                LocalDateTime.now().plusMinutes(5)

        );

    }

    public String getOtp(

            String email

    ) {

        if (!otpMap.containsKey(email)) {

            return null;
        }

        LocalDateTime expiryTime =
                expiryMap.get(email);

        if (expiryTime.isBefore(LocalDateTime.now())) {

            otpMap.remove(email);

            expiryMap.remove(email);

            return null;
        }

        return otpMap.get(email);

    }

    public void removeOtp(

            String email

    ) {

        otpMap.remove(email);

        expiryMap.remove(email);

    }

}