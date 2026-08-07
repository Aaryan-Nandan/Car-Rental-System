package com.example.backend.service;

import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Component
public class RegistrationOtpStorage {

    private final Map<String, String> otpMap =
            new HashMap<>();

    private final Map<String, LocalDateTime> expiryMap =
            new HashMap<>();

    private final Map<String, Integer> attemptMap =
            new HashMap<>();

    public void saveOtp(String email, String otp) {

        otpMap.put(email, otp);

        expiryMap.put(
                email,
                LocalDateTime.now().plusMinutes(5)
        );

        attemptMap.put(email, 0);
    }

    public boolean verifyOtp(
            String email,
            String otp
    ) {

        if (!otpMap.containsKey(email)) {

            return false;
        }

        if (expiryMap.get(email)
                .isBefore(LocalDateTime.now())) {

            removeOtp(email);

            return false;
        }

        int attempts =
                attemptMap.get(email);

        if (attempts >= 3) {

            removeOtp(email);

            return false;
        }

        if (otpMap.get(email).equals(otp)) {

            return true;
        }

        attemptMap.put(
                email,
                attempts + 1
        );

        return false;
    }

    public void removeOtp(
            String email
    ) {

        otpMap.remove(email);

        expiryMap.remove(email);

        attemptMap.remove(email);
    }

}