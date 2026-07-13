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

    // ADD VARIANT
    public CarVariant addVariant(
            CarVariant carVariant) {

        Long companyId =
                carVariant.getCarCompany().getId();

        CarCompany company =
                carCompanyRepository
                        .findById(companyId)
                        .orElse(null);

        carVariant.setCarCompany(company);

        return carVariantRepository.save(carVariant);
    }

    // GET ALL VARIANTS
    public List<CarVariant> getAllVariants() {

        List<CarVariant> variants =
                carVariantRepository.findAll();

        for (CarVariant variant : variants) {

            long count =
                    carRepository
                            .countByCarVariantIdAndAvailableTrue(
                                    variant.getId()
                            );

            variant.setAvailableCars(count);
        }

        return variants;
    }


}
