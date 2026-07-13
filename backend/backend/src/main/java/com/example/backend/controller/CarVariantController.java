package com.example.backend.controller;

import com.example.backend.entity.CarVariant;
import com.example.backend.service.CarVariantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/variant")
public class CarVariantController {

    @Autowired
    private CarVariantService carVariantService;

    // ADD VARIANT
    @PostMapping("/add")
    public CarVariant addVariant(
            @RequestBody CarVariant carVariant) {

        return carVariantService.addVariant(carVariant);
    }

    // GET ALL VARIANTS
    @GetMapping("/all")
    public List<CarVariant> getAllVariants() {

        return carVariantService.getAllVariants();
    }
}