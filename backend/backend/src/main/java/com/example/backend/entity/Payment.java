package com.example.backend.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double amount;

    private LocalDate paymentDate;

    private String paymentStatus;

    private String paymentMethod;

    private String upiTransactionId;


    // =========================================================
    // CUSTOMER
    // =========================================================

    @ManyToOne
    private Customer customer;


    // =========================================================
    // BOOKING
    // =========================================================

    @OneToOne
    private Booking booking;


    // =========================================================
    // GETTERS AND SETTERS
    // =========================================================

    public Long getId() {

        return id;
    }


    public Double getAmount() {

        return amount;
    }


    public void setAmount(
            Double amount) {

        this.amount = amount;
    }


    public LocalDate getPaymentDate() {

        return paymentDate;
    }


    public void setPaymentDate(
            LocalDate paymentDate) {

        this.paymentDate =
                paymentDate;
    }


    public String getPaymentStatus() {

        return paymentStatus;
    }


    public void setPaymentStatus(
            String paymentStatus) {

        this.paymentStatus =
                paymentStatus;
    }


    public String getPaymentMethod() {

        return paymentMethod;
    }


    public void setPaymentMethod(
            String paymentMethod) {

        this.paymentMethod =
                paymentMethod;
    }


    public String getUpiTransactionId() {

        return upiTransactionId;
    }


    public void setUpiTransactionId(
            String upiTransactionId) {

        this.upiTransactionId =
                upiTransactionId;
    }


    public Customer getCustomer() {

        return customer;
    }


    public void setCustomer(
            Customer customer) {

        this.customer =
                customer;
    }


    public Booking getBooking() {

        return booking;
    }


    public void setBooking(
            Booking booking) {

        this.booking =
                booking;
    }
}