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
    // UPDATE CUSTOMER PROFILE
    // ==========================================

    public Customer updateProfile(
            Long id,
            Customer updatedCustomer
    ) {

        Customer customer =
                customerRepository
                        .findById(id)
                        .orElse(null);

        if (customer == null) {
            return null;
        }

        // ==========================================
        // UPDATE NAME
        // ==========================================

        if (updatedCustomer.getName() != null) {

            customer.setName(
                    updatedCustomer.getName()
            );
        }


        // ==========================================
        // UPDATE PHONE
        // ==========================================

        if (updatedCustomer.getPhone() != null) {

            customer.setPhone(
                    updatedCustomer.getPhone()
            );
        }


        // ==========================================
        // UPDATE PROFILE PHOTO
        // ==========================================

        if (updatedCustomer.getProfilePhoto() != null) {

            customer.setProfilePhoto(
                    updatedCustomer.getProfilePhoto()
            );
        }


        // ==========================================
        // DO NOT UPDATE EMAIL HERE
        // ==========================================

        // Email remains unchanged.


        // ==========================================
        // DO NOT UPDATE PASSWORD HERE
        // ==========================================

        // Password remains unchanged.


        return customerRepository.save(
                customer
        );
    }


    // ==========================================
    // LOGIN CUSTOMER
    // ==========================================

    public AuthResponse loginCustomer(
            LoginRequest loginRequest
    ) {

        Customer customer =
                customerRepository.findByEmail(
                        loginRequest.getEmail()
                );

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


        if (!passwordMatches) {

            return null;
        }


        // ==========================================
        // GENERATE JWT
        // ==========================================

        String token =
                jwtUtil.generateToken(
                        customer.getEmail()
                );


        // ==========================================
        // LOGIN RESPONSE
        // ==========================================

        return new AuthResponse(

                token,

                customer.getId(),

                customer.getEmail()

        );
    }
}