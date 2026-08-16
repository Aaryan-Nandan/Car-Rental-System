package com.example.backend.service;

import com.example.backend.entity.CarCompany;
import com.example.backend.entity.CarVariant;
import com.example.backend.repository.CarCompanyRepository;
import com.example.backend.repository.CarRepository;
import com.example.backend.repository.CarVariantRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CarVariantService {


    @Autowired
    private CarVariantRepository carVariantRepository;


    @Autowired
    private CarCompanyRepository carCompanyRepository;


    @Autowired
    private CarRepository carRepository;


    // =========================================================
    // ADD VARIANT
    // =========================================================

    public CarVariant addVariant(
            CarVariant carVariant
    ) {

        // -----------------------------------------------------
        // CHECK VARIANT
        // -----------------------------------------------------

        if (carVariant == null) {

            throw new IllegalArgumentException(
                    "Car Variant information is required"
            );
        }


        // -----------------------------------------------------
        // CHECK COMPANY
        // -----------------------------------------------------

        if (
                carVariant.getCarCompany() == null
                        ||
                        carVariant
                                .getCarCompany()
                                .getId() == null
        ) {

            throw new IllegalArgumentException(
                    "Car Company is required"
            );
        }


        Long companyId =
                carVariant
                        .getCarCompany()
                        .getId();


        // -----------------------------------------------------
        // FIND COMPANY
        // -----------------------------------------------------

        CarCompany company =
                carCompanyRepository
                        .findById(companyId)
                        .orElse(null);


        if (company == null) {

            throw new IllegalArgumentException(
                    "Car Company not found"
            );
        }


        // -----------------------------------------------------
        // CONNECT REAL COMPANY
        // -----------------------------------------------------

        carVariant.setCarCompany(
                company
        );


        // -----------------------------------------------------
        // SAVE VARIANT
        // -----------------------------------------------------

        return carVariantRepository.save(
                carVariant
        );
    }


    // =========================================================
    // GET ALL VARIANTS
    // =========================================================

    public List<CarVariant> getAllVariants() {

        List<CarVariant> variants =
                carVariantRepository.findAll();


        // -----------------------------------------------------
        // CALCULATE AVAILABLE PHYSICAL CARS
        // -----------------------------------------------------

        for (
                CarVariant variant :
                variants
        ) {

            long count =
                    carRepository
                            .countByCarVariantIdAndAvailableTrue(
                                    variant.getId()
                            );


            variant.setAvailableCars(
                    count
            );
        }


        return variants;
    }
}