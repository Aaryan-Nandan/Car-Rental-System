package com.example.backend.controller;

import com.example.backend.entity.Car;
import com.example.backend.service.CarService;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/car")
@CrossOrigin(
        origins = "http://localhost:3000"
)
public class CarController {

    @Autowired
    private CarService carService;


    // =========================================================
    // ADD CAR
    // =========================================================

    @PostMapping("/add")
    public ResponseEntity<?> addCar(
            @RequestBody Car car
    ) {

        try {

            Car savedCar =
                    carService.addCar(car);


            return ResponseEntity.ok(
                    savedCar
            );

        } catch (Exception e) {

            Map<String, Object> response =
                    new HashMap<>();


            response.put(
                    "success",
                    false
            );


            response.put(
                    "message",
                    e.getMessage()
            );


            return ResponseEntity
                    .badRequest()
                    .body(response);
        }
    }


    // =========================================================
    // GET ALL CARS
    // =========================================================

    @GetMapping("/all")
    public List<Car> getAllCars() {

        return carService.getAllCars();
    }


    // =========================================================
    // DELETE CAR
    // =========================================================

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteCar(
            @PathVariable Long id
    ) {

        try {

            String result =
                    carService.deleteCar(id);


            return ResponseEntity.ok(
                    result
            );

        } catch (Exception e) {

            Map<String, Object> response =
                    new HashMap<>();


            response.put(
                    "success",
                    false
            );


            response.put(
                    "message",
                    e.getMessage()
            );


            return ResponseEntity
                    .badRequest()
                    .body(response);
        }
    }


    // =========================================================
    // UPDATE CAR
    // =========================================================

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateCar(
            @PathVariable Long id,
            @RequestBody Car car
    ) {

        try {

            Car updatedCar =
                    carService.updateCar(
                            id,
                            car
                    );


            return ResponseEntity.ok(
                    updatedCar
            );

        } catch (Exception e) {

            Map<String, Object> response =
                    new HashMap<>();


            response.put(
                    "success",
                    false
            );


            response.put(
                    "message",
                    e.getMessage()
            );


            return ResponseEntity
                    .badRequest()
                    .body(response);
        }
    }


    // =========================================================
    // TOGGLE AVAILABILITY
    // =========================================================

    @PutMapping("/availability/{id}")
    public ResponseEntity<?> toggleAvailability(
            @PathVariable Long id
    ) {

        try {

            Car car =
                    carService
                            .toggleAvailability(
                                    id
                            );


            return ResponseEntity.ok(
                    car
            );

        } catch (Exception e) {

            Map<String, Object> response =
                    new HashMap<>();


            response.put(
                    "success",
                    false
            );


            response.put(
                    "message",
                    e.getMessage()
            );


            return ResponseEntity
                    .badRequest()
                    .body(response);
        }
    }
}