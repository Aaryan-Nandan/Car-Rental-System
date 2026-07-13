package com.example.backend.repository;

import com.example.backend.entity.CarCompany;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CarCompanyRepository
        extends JpaRepository<CarCompany, Long> {

}