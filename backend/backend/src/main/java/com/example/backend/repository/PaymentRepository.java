package com.example.backend.repository;

import com.example.backend.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentRepository
        extends JpaRepository<Payment, Long> {

    Payment findByBookingId(Long bookingId);

    Payment findByRazorpayOrderId(
            String razorpayOrderId
    );

    Payment findByRazorpayPaymentId(
            String razorpayPaymentId
    );

    // =========================================================
    // CUSTOMER PAYMENT HISTORY
    // =========================================================

    List<Payment> findByBookingCustomerIdAndPaymentStatusIgnoreCaseOrderByPaymentDateDesc(
            Long customerId,
            String paymentStatus
    );
}