package com.example.backend.controller;

import com.example.backend.dto.AuthResponse;
import com.example.backend.dto.LoginRequest;
import com.example.backend.entity.Customer;
import com.example.backend.service.CustomerService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/customer")
//
//@CrossOrigin(
//        origins = "http://localhost:3000"
//)

public class CustomerController {


    @Autowired
    private CustomerService customerService;


    // =========================================================
    // GET ALL CUSTOMERS
    // ADMIN
    // =========================================================

    @GetMapping("/all")
    public List<Customer> getAllCustomers() {

        return customerService.getAllCustomers();
    }


    // =========================================================
    // GET CUSTOMER BY ID
    // =========================================================

    @GetMapping("/{id}")
    public Customer getCustomerById(
            @PathVariable Long id
    ) {

        return customerService.getCustomerById(
                id
        );
    }


    // =========================================================
    // UPDATE CUSTOMER PROFILE
    // =========================================================

    @PutMapping("/{id}")
    public Customer updateProfile(
            @PathVariable Long id,

            @RequestBody Customer customer
    ) {

        return customerService.updateProfile(
                id,
                customer
        );
    }


    // =========================================================
    // LOGIN CUSTOMER
    // =========================================================

    @PostMapping("/login")
    public AuthResponse loginCustomer(
            @RequestBody LoginRequest loginRequest
    ) {

        return customerService.loginCustomer(
                loginRequest
        );
    }

}