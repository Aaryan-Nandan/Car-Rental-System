package com.example.backend.dto;

import com.example.backend.entity.Customer;

public class AuthResponse {

    // ==========================================
    // FIELDS
    // ==========================================

    private String token;

    private Long customerId;

    private String customerEmail;

    private Customer customer;


    // ==========================================
    // CUSTOMER LOGIN
    //
    // Used by CustomerService:
    //
    // new AuthResponse(
    //     token,
    //     customer.getId(),
    //     customer.getEmail()
    // )
    // ==========================================

    public AuthResponse(
            String token,
            Long customerId,
            String customerEmail
    ) {

        this.token = token;

        this.customerId = customerId;

        this.customerEmail = customerEmail;

        this.customer = null;
    }


    // ==========================================
    // OLD CUSTOMER CONSTRUCTOR
    //
    // If any existing code uses:
    //
    // new AuthResponse(token, customer)
    //
    // it will continue working.
    // ==========================================

    public AuthResponse(
            String token,
            Customer customer
    ) {

        this.token = token;

        this.customer = customer;

        if (customer != null) {

            this.customerId =
                    customer.getId();

            this.customerEmail =
                    customer.getEmail();

        } else {

            this.customerId = null;

            this.customerEmail = null;
        }
    }


    // ==========================================
    // ADMIN CONSTRUCTOR
    //
    // Your existing AdminService uses:
    //
    // new AuthResponse(token, null)
    //
    // ==========================================

    public AuthResponse(
            String token,
            Object ignored
    ) {

        this.token = token;

        this.customerId = null;

        this.customerEmail = null;

        this.customer = null;
    }


    // ==========================================
    // TOKEN
    // ==========================================

    public String getToken() {

        return token;
    }

    public void setToken(
            String token
    ) {

        this.token = token;
    }


    // ==========================================
    // CUSTOMER ID
    // ==========================================

    public Long getCustomerId() {

        return customerId;
    }

    public void setCustomerId(
            Long customerId
    ) {

        this.customerId = customerId;
    }


    // ==========================================
    // CUSTOMER EMAIL
    // ==========================================

    public String getCustomerEmail() {

        return customerEmail;
    }

    public void setCustomerEmail(
            String customerEmail
    ) {

        this.customerEmail = customerEmail;
    }


    // ==========================================
    // CUSTOMER
    // ==========================================

    public Customer getCustomer() {

        return customer;
    }

    public void setCustomer(
            Customer customer
    ) {

        this.customer = customer;
    }
}