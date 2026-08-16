package com.example.backend.repository;

import com.example.backend.entity.Car;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CarRepository
        extends JpaRepository<Car, Long> {


    // =========================================================
    // FIND FIRST AVAILABLE CAR OF A VARIANT
    // =========================================================

    Car findFirstByCarVariantIdAndAvailableTrue(
            Long variantId
    );


    // =========================================================
    // COUNT AVAILABLE CARS
    // =========================================================

    long countByCarVariantIdAndAvailableTrue(
            Long variantId
    );


    // =========================================================
    // CHECK DUPLICATE REGISTRATION NUMBER
    // =========================================================

    boolean existsByRegistrationNumber(
            String registrationNumber
    );


    // =========================================================
    // CHECK DUPLICATE REGISTRATION NUMBER
    // WHILE EDITING AN EXISTING CAR
    // =========================================================

    boolean existsByRegistrationNumberAndIdNot(
            String registrationNumber,
            Long id
    );


    // =========================================================
    // COUNT ALL CARS OF A VARIANT
    // =========================================================

    long countByCarVariantId(
            Long variantId
    );
}