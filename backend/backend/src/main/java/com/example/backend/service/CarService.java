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


    // =========================================================
    // ADD CAR
    // =========================================================

    public Car addCar(Car car) {

        // -----------------------------------------------------
        // CHECK CAR OBJECT
        // -----------------------------------------------------

        if (car == null) {

            throw new IllegalArgumentException(
                    "Car information is required"
            );
        }


        // -----------------------------------------------------
        // CHECK REGISTRATION NUMBER
        // -----------------------------------------------------

        if (
                car.getRegistrationNumber() == null
                        ||
                        car.getRegistrationNumber()
                                .trim()
                                .isEmpty()
        ) {

            throw new IllegalArgumentException(
                    "Registration Number is required"
            );
        }


        // -----------------------------------------------------
        // CLEAN REGISTRATION NUMBER
        // -----------------------------------------------------

        String registrationNumber =
                car.getRegistrationNumber()
                        .trim()
                        .toUpperCase();


        car.setRegistrationNumber(
                registrationNumber
        );


        // -----------------------------------------------------
        // DUPLICATE REGISTRATION CHECK
        // -----------------------------------------------------

        boolean alreadyExists =
                carRepository
                        .existsByRegistrationNumber(
                                registrationNumber
                        );


        if (alreadyExists) {

            throw new IllegalArgumentException(
                    "Registration Number already exists: "
                            + registrationNumber
            );
        }


        // -----------------------------------------------------
        // CHECK VARIANT
        // -----------------------------------------------------

        if (
                car.getCarVariant() == null
                        ||
                        car.getCarVariant().getId() == null
        ) {

            throw new IllegalArgumentException(
                    "Car Variant is required"
            );
        }


        Long variantId =
                car.getCarVariant().getId();


        // -----------------------------------------------------
        // FIND VARIANT
        // -----------------------------------------------------

        CarVariant variant =
                carVariantRepository
                        .findById(variantId)
                        .orElse(null);


        if (variant == null) {

            throw new IllegalArgumentException(
                    "Car Variant not found"
            );
        }


        // -----------------------------------------------------
        // CONNECT REAL VARIANT
        // -----------------------------------------------------

        car.setCarVariant(
                variant
        );


        // -----------------------------------------------------
        // NEW CAR IS AVAILABLE BY DEFAULT
        // -----------------------------------------------------

        car.setAvailable(true);


        // -----------------------------------------------------
        // SAVE
        // -----------------------------------------------------

        return carRepository.save(car);
    }


    // =========================================================
    // GET ALL CARS
    // =========================================================

    public List<Car> getAllCars() {

        return carRepository.findAll();
    }


    // =========================================================
    // DELETE CAR
    // =========================================================

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


    // =========================================================
    // UPDATE CAR
    // =========================================================

    public Car updateCar(
            Long id,
            Car updatedCar
    ) {

        // -----------------------------------------------------
        // FIND EXISTING CAR
        // -----------------------------------------------------

        Car existingCar =
                carRepository
                        .findById(id)
                        .orElse(null);


        if (existingCar == null) {

            throw new IllegalArgumentException(
                    "Car Not Found"
            );
        }


        // -----------------------------------------------------
        // REGISTRATION NUMBER CHECK
        // -----------------------------------------------------

        if (
                updatedCar.getRegistrationNumber() == null
                        ||
                        updatedCar.getRegistrationNumber()
                                .trim()
                                .isEmpty()
        ) {

            throw new IllegalArgumentException(
                    "Registration Number is required"
            );
        }


        String registrationNumber =
                updatedCar
                        .getRegistrationNumber()
                        .trim()
                        .toUpperCase();


        // -----------------------------------------------------
        // DUPLICATE CHECK
        //
        // Same car can keep its own registration number.
        // Another car cannot use it.
        // -----------------------------------------------------

        boolean duplicate =
                carRepository
                        .existsByRegistrationNumberAndIdNot(
                                registrationNumber,
                                id
                        );


        if (duplicate) {

            throw new IllegalArgumentException(
                    "Registration Number already exists: "
                            + registrationNumber
            );
        }


        // -----------------------------------------------------
        // UPDATE REGISTRATION NUMBER
        // -----------------------------------------------------

        existingCar.setRegistrationNumber(
                registrationNumber
        );


        // -----------------------------------------------------
        // UPDATE COLOR
        // -----------------------------------------------------

        if (
                updatedCar.getColor() != null
        ) {

            existingCar.setColor(
                    updatedCar.getColor()
            );
        }


        // -----------------------------------------------------
        // UPDATE VARIANT
        // -----------------------------------------------------

        if (
                updatedCar.getCarVariant() != null
                        &&
                        updatedCar
                                .getCarVariant()
                                .getId() != null
        ) {

            Long variantId =
                    updatedCar
                            .getCarVariant()
                            .getId();


            CarVariant variant =
                    carVariantRepository
                            .findById(variantId)
                            .orElse(null);


            if (variant == null) {

                throw new IllegalArgumentException(
                        "Car Variant not found"
                );
            }


            existingCar.setCarVariant(
                    variant
            );
        }


        // -----------------------------------------------------
        // SAVE
        // -----------------------------------------------------

        return carRepository.save(
                existingCar
        );
    }


    // =========================================================
    // TOGGLE AVAILABILITY
    // =========================================================

    public Car toggleAvailability(
            Long id
    ) {

        Car car =
                carRepository
                        .findById(id)
                        .orElse(null);


        if (car == null) {

            throw new IllegalArgumentException(
                    "Car Not Found"
            );
        }


        car.setAvailable(
                !car.isAvailable()
        );


        return carRepository.save(car);
    }
}