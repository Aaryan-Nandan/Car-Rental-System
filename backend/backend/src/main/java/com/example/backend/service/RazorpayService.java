package com.example.backend.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;

import org.json.JSONObject;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class RazorpayService {

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    // =========================================================
    // CREATE RAZORPAY ORDER
    // =========================================================

    public Order createOrder(
            Double amount,
            Long bookingId
    ) throws Exception {

        if (amount == null || amount <= 0) {

            throw new RuntimeException(
                    "Invalid payment amount"
            );
        }

        RazorpayClient razorpayClient =
                new RazorpayClient(
                        keyId,
                        keySecret
                );

        /*
         * Razorpay expects amount in PAISE.
         *
         * Example:
         *
         * ₹2500 = 250000 paise
         */

        int amountInPaise =
                (int) Math.round(
                        amount * 100
                );

        JSONObject orderRequest =
                new JSONObject();

        orderRequest.put(
                "amount",
                amountInPaise
        );

        orderRequest.put(
                "currency",
                "INR"
        );

        orderRequest.put(
                "receipt",
                "BOOKING_" + bookingId
        );

        orderRequest.put(
                "payment_capture",
                1
        );

        return razorpayClient.orders.create(
                orderRequest
        );
    }

    // =========================================================
    // VERIFY PAYMENT SIGNATURE
    // =========================================================

    public boolean verifyPayment(
            String razorpayOrderId,
            String razorpayPaymentId,
            String razorpaySignature
    ) throws Exception {

        JSONObject options =
                new JSONObject();

        options.put(
                "razorpay_order_id",
                razorpayOrderId
        );

        options.put(
                "razorpay_payment_id",
                razorpayPaymentId
        );

        options.put(
                "razorpay_signature",
                razorpaySignature
        );

        return com.razorpay.Utils
                .verifyPaymentSignature(
                        options,
                        keySecret
                );
    }

    // =========================================================
    // GET KEY ID
    // =========================================================

    public String getKeyId() {
        return keyId;
    }
}