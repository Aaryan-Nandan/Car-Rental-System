package com.example.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "payment")
@JsonIgnoreProperties({
        "hibernateLazyInitializer",
        "handler"
})
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // =========================================================
    // PAYMENT AMOUNT
    // =========================================================

    @Column(nullable = false)
    private Double amount;


    // =========================================================
    // PAYMENT METHOD
    // =========================================================

    private String paymentMethod;


    // =========================================================
    // PAYMENT STATUS
    //
    // CREATED
    // PAID
    // FAILED
    // REFUNDED
    // =========================================================

    private String paymentStatus;


    // =========================================================
    // RAZORPAY ORDER ID
    // =========================================================

    @Column(unique = true)
    private String razorpayOrderId;


    // =========================================================
    // RAZORPAY PAYMENT ID
    // =========================================================

    @Column(unique = true)
    private String razorpayPaymentId;


    // =========================================================
    // RAZORPAY SIGNATURE
    // =========================================================

    @Column(length = 500)
    private String razorpaySignature;


    // =========================================================
    // PAYMENT DATE
    // =========================================================

    private LocalDateTime paymentDate;


    // =========================================================
    // BOOKING
    // =========================================================

    @OneToOne
    @JoinColumn(name = "booking_id", nullable = false)
    @JsonIgnore
    private Booking booking;


    // =========================================================
    // GETTERS / SETTERS
    // =========================================================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }


    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }


    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }


    public String getRazorpayOrderId() {
        return razorpayOrderId;
    }

    public void setRazorpayOrderId(String razorpayOrderId) {
        this.razorpayOrderId = razorpayOrderId;
    }


    public String getRazorpayPaymentId() {
        return razorpayPaymentId;
    }

    public void setRazorpayPaymentId(String razorpayPaymentId) {
        this.razorpayPaymentId = razorpayPaymentId;
    }


    public String getRazorpaySignature() {
        return razorpaySignature;
    }

    public void setRazorpaySignature(String razorpaySignature) {
        this.razorpaySignature = razorpaySignature;
    }


    public LocalDateTime getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(LocalDateTime paymentDate) {
        this.paymentDate = paymentDate;
    }


    public Booking getBooking() {
        return booking;
    }

    public void setBooking(Booking booking) {
        this.booking = booking;
    }
}