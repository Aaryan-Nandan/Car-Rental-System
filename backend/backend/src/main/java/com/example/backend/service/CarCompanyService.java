package com.example.backend.service;

import com.example.backend.entity.CarCompany;
import com.example.backend.repository.CarCompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CarCompanyService {

    @Autowired
    private CarCompanyRepository carCompanyRepository;

    // ADD COMPANY
    public CarCompany addCompany(
            CarCompany carCompany) {

        return carCompanyRepository.save(carCompany);
    }

    // GET ALL COMPANIES
    public List<CarCompany> getAllCompanies() {

        return carCompanyRepository.findAll();
    }
}