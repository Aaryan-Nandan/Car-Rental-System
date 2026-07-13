package com.example.backend.service;

import com.example.backend.entity.Car;
import com.example.backend.entity.CarVariant;
import com.example.backend.repository.CarRepository;
import com.example.backend.repository.CarVariantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CarService {

    @Autowired
    private CarRepository carRepository;

    @Autowired
    private CarVariantRepository carVariantRepository;

    // ADD CAR
    public Car addCar(Car car) {

        Long variantId =
                car.getCarVariant().getId();

        CarVariant variant =
                carVariantRepository
                        .findById(variantId)
                        .orElse(null);

        car.setCarVariant(variant);

        return carRepository.save(car);
    }

    // GET ALL CARS
    public List<Car> getAllCars() {

        return carRepository.findAll();
    }

    // DELETE CAR
    public String deleteCar(Long id) {

        Car car =
                carRepository
                        .findById(id)
                        .orElse(null);

        if (car == null) {

            return "Car Not Found";
        }

        carRepository.delete(car);

        return "Car Deleted Successfully";
    }

    // UPDATE CAR
    public Car updateCar(
            Long id,
            Car updatedCar) {

        Car existingCar =
                carRepository
                        .findById(id)
                        .orElse(null);

        if (existingCar == null) {

            return null;
        }

        existingCar.setRegistrationNumber(
                updatedCar.getRegistrationNumber()
        );

        existingCar.setColor(
                updatedCar.getColor()
        );

        if (updatedCar.getCarVariant() != null) {

            Long variantId =
                    updatedCar
                            .getCarVariant()
                            .getId();

            CarVariant variant =
                    carVariantRepository
                            .findById(variantId)
                            .orElse(null);

            existingCar.setCarVariant(
                    variant
            );
        }

        return carRepository.save(
                existingCar
        );
    }

    // TOGGLE AVAILABILITY
    public Car toggleAvailability(
            Long id) {

        Car car =
                carRepository
                        .findById(id)
                        .orElse(null);

        if (car == null) {

            return null;
        }

        car.setAvailable(
                !car.isAvailable()
        );

        return carRepository.save(
                car
        );
    }
}