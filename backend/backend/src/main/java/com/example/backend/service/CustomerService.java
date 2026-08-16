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


    // =========================================================
    // REGISTER CUSTOMER
    // =========================================================

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


        // =====================================================
        // ENCRYPT PASSWORD
        // =====================================================

        customer.setPassword(

                passwordEncoder.encode(
                        customer.getPassword()
                )

        );


        // =====================================================
        // SAVE CUSTOMER
        //
        // This saves:
        //
        // name
        // email
        // password
        // phone
        // alternatePhone
        // bloodGroup
        // address
        // profilePhoto
        // =====================================================

        return customerRepository.save(
                customer
        );
    }


    // =========================================================
    // GET CUSTOMER BY ID
    // =========================================================

    public Customer getCustomerById(
            Long id
    ) {

        return customerRepository
                .findById(id)
                .orElse(null);
    }


    // =========================================================
    // GET ALL CUSTOMERS
    // =========================================================

    public List<Customer> getAllCustomers() {

        return customerRepository.findAll();
    }


    // =========================================================
    // UPDATE CUSTOMER PROFILE
    // =========================================================

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


        // =====================================================
        // UPDATE NAME
        // =====================================================

        if (
                updatedCustomer.getName() != null
                        &&
                        !updatedCustomer.getName()
                                .trim()
                                .isEmpty()
        ) {

            customer.setName(
                    updatedCustomer
                            .getName()
                            .trim()
            );
        }


        // =====================================================
        // UPDATE PHONE
        // =====================================================

        if (
                updatedCustomer.getPhone() != null
                        &&
                        !updatedCustomer.getPhone()
                                .trim()
                                .isEmpty()
        ) {

            customer.setPhone(
                    updatedCustomer
                            .getPhone()
                            .trim()
            );
        }


        // =====================================================
        // UPDATE ALTERNATE PHONE
        // =====================================================

        if (
                updatedCustomer.getAlternatePhone() != null
        ) {

            customer.setAlternatePhone(
                    updatedCustomer
                            .getAlternatePhone()
                            .trim()
            );
        }


        // =====================================================
        // UPDATE BLOOD GROUP
        // =====================================================

        if (
                updatedCustomer.getBloodGroup() != null
                        &&
                        !updatedCustomer.getBloodGroup()
                                .trim()
                                .isEmpty()
        ) {

            customer.setBloodGroup(
                    updatedCustomer
                            .getBloodGroup()
                            .trim()
            );
        }


        // =====================================================
        // UPDATE PERMANENT ADDRESS
        // =====================================================

        if (
                updatedCustomer.getAddress() != null
        ) {

            customer.setAddress(
                    updatedCustomer
                            .getAddress()
                            .trim()
            );
        }


        // =====================================================
        // UPDATE PROFILE PHOTO
        // =====================================================

        if (
                updatedCustomer.getProfilePhoto() != null
        ) {

            customer.setProfilePhoto(
                    updatedCustomer
                            .getProfilePhoto()
            );
        }


        // =====================================================
        // EMAIL
        //
        // DO NOT CHANGE EMAIL HERE
        // =====================================================


        // =====================================================
        // PASSWORD
        //
        // DO NOT CHANGE PASSWORD HERE
        // =====================================================


        // =====================================================
        // SAVE UPDATED CUSTOMER
        // =====================================================

        return customerRepository.save(
                customer
        );
    }


    // =========================================================
    // LOGIN CUSTOMER
    // =========================================================

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


        // =====================================================
        // CHECK PASSWORD
        // =====================================================

        boolean passwordMatches =
                passwordEncoder.matches(

                        loginRequest.getPassword(),

                        customer.getPassword()

                );


        if (!passwordMatches) {

            return null;
        }


        // =====================================================
        // GENERATE JWT
        // =====================================================

        String token =
                jwtUtil.generateToken(
                        customer.getEmail()
                );


        // =====================================================
        // LOGIN RESPONSE
        // =====================================================

        return new AuthResponse(

                token,

                customer.getId(),

                customer.getEmail()

        );
    }
}