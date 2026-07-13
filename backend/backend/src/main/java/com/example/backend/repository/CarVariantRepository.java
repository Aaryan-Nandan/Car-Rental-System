package com.example.backend.repository;

import com.example.backend.entity.CarVariant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CarVariantRepository
        extends JpaRepository<CarVariant, Long> {

}