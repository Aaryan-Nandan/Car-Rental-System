package com.example.backend.controller;

import com.example.backend.dto.RazorpayOrderResponse;
import com.example.backend.dto.RazorpayVerifyRequest;
import com.example.backend.entity.Payment;
import com.example.backend.service.PaymentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/payment")
@CrossOrigin(
        origins = "http://localhost:3000"
)
public class PaymentController {

    @Autowired
    private PaymentService paymentService;


    // =========================================================
    // CREATE RAZORPAY ORDER
    // =========================================================

    @PostMapping(
            "/create-order/{bookingId}"
    )
    public ResponseEntity<?> createOrder(
            @PathVariable Long bookingId
    ) {

        try {

            RazorpayOrderResponse response =
                    paymentService
                            .createRazorpayOrder(
                                    bookingId
                            );

            return ResponseEntity.ok(
                    response
            );

        } catch (Exception e) {

            Map<String, Object> response =
                    new HashMap<>();

            response.put(
                    "success",
                    false
            );

            response.put(
                    "message",
                    e.getMessage()
            );

            return ResponseEntity
                    .badRequest()
                    .body(response);
        }
    }


    // =========================================================
    // VERIFY RAZORPAY PAYMENT
    // =========================================================

    @PostMapping(
            "/verify"
    )
    public ResponseEntity<?> verifyPayment(
            @RequestBody RazorpayVerifyRequest request
    ) {

        try {

            Payment payment =
                    paymentService
                            .verifyRazorpayPayment(
                                    request
                            );


            Map<String, Object> response =
                    new HashMap<>();


            response.put(
                    "success",
                    true
            );


            response.put(
                    "message",
                    "Payment verified successfully"
            );


            response.put(
                    "paymentId",
                    payment.getId()
            );


            if (payment.getBooking() != null) {

                response.put(
                        "bookingId",
                        payment
                                .getBooking()
                                .getId()
                );


                response.put(
                        "bookingStatus",
                        payment
                                .getBooking()
                                .getBookingStatus()
                );
            }


            response.put(
                    "paymentStatus",
                    payment.getPaymentStatus()
            );


            response.put(
                    "razorpayPaymentId",
                    payment.getRazorpayPaymentId()
            );


            return ResponseEntity.ok(
                    response
            );

        } catch (Exception e) {

            Map<String, Object> response =
                    new HashMap<>();

            response.put(
                    "success",
                    false
            );

            response.put(
                    "message",
                    e.getMessage()
            );

            return ResponseEntity
                    .badRequest()
                    .body(response);
        }
    }


    // =========================================================
    // PAYMENT CANCEL / FAILED
    // =========================================================

    @DeleteMapping(
            "/cancel/{bookingId}"
    )
    public ResponseEntity<?> cancelPayment(
            @PathVariable Long bookingId
    ) {

        try {

            paymentService
                    .cancelPayment(
                            bookingId
                    );


            Map<String, Object> response =
                    new HashMap<>();


            response.put(
                    "success",
                    true
            );


            response.put(
                    "message",
                    "Payment cancelled"
            );


            return ResponseEntity.ok(
                    response
            );

        } catch (Exception e) {

            Map<String, Object> response =
                    new HashMap<>();

            response.put(
                    "success",
                    false
            );

            response.put(
                    "message",
                    e.getMessage()
            );

            return ResponseEntity
                    .badRequest()
                    .body(response);
        }
    }


    // =========================================================
    // ADMIN - GET ALL PAYMENTS
    // =========================================================

    @GetMapping(
            "/all"
    )
    public List<Payment> getAllPayments() {

        return paymentService
                .getAllPayments();
    }


    // =========================================================
    // ADMIN - REFUND
    // =========================================================

    @PutMapping(
            "/reject/{id}"
    )
    public ResponseEntity<?> rejectPayment(
            @PathVariable Long id
    ) {

        try {

            Payment payment =
                    paymentService
                            .rejectPayment(
                                    id
                            );

            return ResponseEntity.ok(
                    payment
            );

        } catch (Exception e) {

            Map<String, Object> response =
                    new HashMap<>();

            response.put(
                    "success",
                    false
            );

            response.put(
                    "message",
                    e.getMessage()
            );

            return ResponseEntity
                    .badRequest()
                    .body(response);
        }
    }
}