package com.example.backend.service;

import com.example.backend.dto.AuthResponse;
import com.example.backend.dto.LoginRequest;
import com.example.backend.entity.Customer;
import com.example.backend.repository.CustomerRepository;
import com.example.backend.security.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;


    // ==========================================
    // REGISTER CUSTOMER
    // ==========================================

    public Object registerCustomer(
            Customer customer
    ) {

        Customer existingCustomer =
                customerRepository.findByEmail(
                        customer.getEmail()
                );

        if (existingCustomer != null) {

            return "Email Already Exists";
        }


        // ==========================================
        // ENCRYPT PASSWORD
        // ==========================================

        customer.setPassword(

                passwordEncoder.encode(
                        customer.getPassword()
                )

        );


        // ==========================================
        // SAVE CUSTOMER
        // ==========================================

        return customerRepository.save(
                customer
        );
    }


    // ==========================================
    // GET CUSTOMER BY ID
    // ==========================================

    public Customer getCustomerById(
            Long id
    ) {

        return customerRepository
                .findById(id)
                .orElse(null);
    }


    // ==========================================
    // GET ALL CUSTOMERS
    // ==========================================

    public List<Customer> getAllCustomers() {

        return customerRepository.findAll();
    }


    // ==========================================
    // LOGIN CUSTOMER
    // ==========================================

    public AuthResponse loginCustomer(
            LoginRequest loginRequest
    ) {

        // ==========================================
        // FIND CUSTOMER BY EMAIL
        // ==========================================

        Customer customer =
                customerRepository.findByEmail(
                        loginRequest.getEmail()
                );


        // ==========================================
        // CUSTOMER NOT FOUND
        // ==========================================

        if (customer == null) {

            return null;
        }


        // ==========================================
        // CHECK PASSWORD
        // ==========================================

        boolean passwordMatches =
                passwordEncoder.matches(

                        loginRequest.getPassword(),

                        customer.getPassword()

                );


        // ==========================================
        // INVALID PASSWORD
        // ==========================================

        if (!passwordMatches) {

            return null;
        }


        // ==========================================
        // GENERATE JWT TOKEN
        // ==========================================

        String token =
                jwtUtil.generateToken(
                        customer.getEmail()
                );


        // ==========================================
        // RETURN CUSTOMER LOGIN RESPONSE
        // ==========================================

        return new AuthResponse(

                token,

                customer.getId(),

                customer.getEmail()

        );
    }
}