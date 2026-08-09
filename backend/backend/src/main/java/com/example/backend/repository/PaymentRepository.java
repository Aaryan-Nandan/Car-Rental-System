package com.example.backend.repository;

import com.example.backend.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository
        extends JpaRepository<Payment, Long> {

    // Find payment using Booking ID
    Payment findByBookingId(Long bookingId);

    // Find payment using UPI Transaction ID / UTR
    Payment findByUpiTransactionId(String upiTransactionId);
}