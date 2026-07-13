package com.example.backend.service;

import com.example.backend.dto.AuthResponse;
import com.example.backend.dto.LoginRequest;
import com.example.backend.entity.Customer;
import com.example.backend.repository.CustomerRepository;
import com.example.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private JwtUtil jwtUtil;

    // REGISTER CUSTOMER
    public Object registerCustomer(Customer customer) {

        Customer existingCustomer =
                customerRepository.findByEmail(customer.getEmail());

        if (existingCustomer != null) {

            return "Email Already Exists";
        }

        return customerRepository.save(customer);
    }

    // GET ALL CUSTOMERS

    // GET CUSTOMER BY ID

    public Customer getCustomerById(
            Long id) {

        return customerRepository
                .findById(id)
                .orElse(null);
    }
    public List<Customer> getAllCustomers() {

        return customerRepository.findAll();
    }

    // LOGIN CUSTOMER
    public AuthResponse loginCustomer(LoginRequest loginRequest) {

        Customer customer =
                customerRepository.findByEmail(
                        loginRequest.getEmail()
                );

        if (customer != null &&
                customer.getPassword().equals(
                        loginRequest.getPassword()
                )) {

            String token =
                    jwtUtil.generateToken(
                            customer.getEmail()
                    );

            return new AuthResponse(
                    token,
                    customer
            );
        }
        return null;
    }
}