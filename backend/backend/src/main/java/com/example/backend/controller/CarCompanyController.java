package com.example.backend.controller;

import com.example.backend.entity.CarCompany;
import com.example.backend.service.CarCompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/company")
public class CarCompanyController {

    @Autowired
    private CarCompanyService carCompanyService;

    // ADD COMPANY
    @PostMapping("/add")
    public CarCompany addCompany(
            @RequestBody CarCompany carCompany) {

        return carCompanyService.addCompany(carCompany);
    }

    // GET ALL COMPANIES
    @GetMapping("/all")
    public List<CarCompany> getAllCompanies() {

        return carCompanyService.getAllCompanies();
    }
}