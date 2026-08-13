package com.example.backend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class GoogleMapsController {

    @Value("${google.maps.api-key}")
    private String googleMapsApiKey;

    @GetMapping("/google-maps/config")
    public Map<String, String> getGoogleMapsConfig() {

        Map<String, String> response = new HashMap<>();

        response.put("apiKey", googleMapsApiKey);

        return response;
    }
}