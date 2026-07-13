package com.example.backend.repository;

import com.example.backend.entity.Car;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CarRepository
        extends JpaRepository<Car, Long> {

    Car findFirstByCarVariantIdAndAvailableTrue(
            Long variantId
    );

    long countByCarVariantIdAndAvailableTrue(
            Long variantId
    );
}