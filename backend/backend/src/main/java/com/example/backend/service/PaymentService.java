package com.example.backend.service;

import com.example.backend.entity.Booking;
import com.example.backend.entity.Payment;
import com.example.backend.repository.BookingRepository;
import com.example.backend.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private BookingRepository bookingRepository;

    // ADD PAYMENT
    public Payment addPayment(Payment payment) {

        Long bookingId =
                payment.getBooking().getId();

        Payment existingPayment =
                paymentRepository.findByBookingId(
                        bookingId
                );

        if (existingPayment != null) {

            throw new RuntimeException(
                    "Payment Already Done"
            );
        }

        Booking booking =
                bookingRepository
                        .findById(bookingId)
                        .orElse(null);

        if (booking == null) {

            throw new RuntimeException(
                    "Booking Not Found"
            );
        }

        payment.setBooking(
                booking
        );

        payment.setAmount(
                booking.getTotalAmount()
        );

        payment.setPaymentStatus(
                "PAID"
        );

        payment.setPaymentDate(
                LocalDate.now()
        );

        return paymentRepository.save(
                payment
        );
    }

    // GET ALL PAYMENTS
    public List<Payment> getAllPayments() {

        return paymentRepository.findAll();
    }

    // GET PAYMENT BY ID
    public Payment getPaymentById(
            Long id) {

        return paymentRepository
                .findById(id)
                .orElse(null);
    }

    // DELETE PAYMENT
    public String deletePayment(
            Long id) {

        paymentRepository.deleteById(id);

        return "Payment Deleted Successfully";
    }
}