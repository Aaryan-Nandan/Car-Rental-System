package com.example.backend.controller;

import com.example.backend.entity.Car;
import com.example.backend.service.CarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/car")

public class CarController {

    @Autowired
    private CarService carService;

    // ADD CAR

    @PostMapping("/add")

    public Car addCar(
            @RequestBody Car car) {

        return carService.addCar(car);
    }

    // GET ALL CARS

    @GetMapping("/all")

    public List<Car> getAllCars() {

        return carService.getAllCars();
    }

    // DELETE CAR

    @DeleteMapping("/delete/{id}")

    public String deleteCar(
            @PathVariable Long id) {

        return carService.deleteCar(id);
    }

    // UPDATE CAR

    @PutMapping("/update/{id}")

    public Car updateCar(
            @PathVariable Long id,
            @RequestBody Car car) {

        return carService.updateCar(
                id,
                car
        );
    }

    // TOGGLE AVAILABILITY

    @PutMapping("/availability/{id}")

    public Car toggleAvailability(
            @PathVariable Long id) {

        return carService
                .toggleAvailability(id);
    }
}