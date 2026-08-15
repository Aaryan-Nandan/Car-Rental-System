package com.example.backend.service;

import com.example.backend.dto.RazorpayOrderResponse;
import com.example.backend.dto.RazorpayVerifyRequest;
import com.example.backend.entity.Booking;
import com.example.backend.entity.Car;
import com.example.backend.entity.Payment;
import com.example.backend.repository.BookingRepository;
import com.example.backend.repository.CarRepository;
import com.example.backend.repository.PaymentRepository;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;

import org.json.JSONObject;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;

    private final BookingRepository bookingRepository;

    private final CarRepository carRepository;


    @Value("${razorpay.key.id}")
    private String razorpayKeyId;


    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;


    public PaymentService(
            PaymentRepository paymentRepository,
            BookingRepository bookingRepository,
            CarRepository carRepository
    ) {

        this.paymentRepository =
                paymentRepository;

        this.bookingRepository =
                bookingRepository;

        this.carRepository =
                carRepository;
    }


    // =========================================================
    // CREATE RAZORPAY ORDER
    // =========================================================

    public RazorpayOrderResponse
    createRazorpayOrder(
            Long bookingId
    ) throws Exception {

        // -----------------------------------------------------
        // GET BOOKING
        // -----------------------------------------------------

        Booking booking =
                bookingRepository
                        .findById(
                                bookingId
                        )
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Booking Not Found"
                                        )
                        );


        // -----------------------------------------------------
        // PAYMENT STATUS CHECK
        //
        // Normal:
        // PAYMENT_PENDING
        //
        // Old Admin approval:
        // APPROVED
        // -----------------------------------------------------

        String bookingStatus =
                booking.getBookingStatus();


        boolean paymentAllowed =
                "PAYMENT_PENDING"
                        .equalsIgnoreCase(
                                bookingStatus
                        )

                        ||

                        "APPROVED"
                                .equalsIgnoreCase(
                                        bookingStatus
                                );


        if (!paymentAllowed) {

            throw new RuntimeException(
                    "Booking is not waiting for payment. Current status: "
                            + bookingStatus
            );
        }


        // -----------------------------------------------------
        // CHECK EXISTING PAYMENT
        // -----------------------------------------------------

        Payment existingPayment =
                paymentRepository
                        .findByBookingId(
                                bookingId
                        );


        if (
                existingPayment != null &&
                        "PAID".equalsIgnoreCase(
                                existingPayment
                                        .getPaymentStatus()
                        )
        ) {

            throw new RuntimeException(
                    "Payment already completed"
            );
        }


        // -----------------------------------------------------
        // AMOUNT
        //
        // IMPORTANT:
        // Amount comes from DATABASE BOOKING.
        //
        // Frontend amount is NOT trusted.
        // -----------------------------------------------------

        Double bookingAmount =
                booking.getTotalAmount();


        if (
                bookingAmount == null ||
                        bookingAmount <= 0
        ) {

            throw new RuntimeException(
                    "Invalid booking amount"
            );
        }


        double amount =
                bookingAmount;


        // -----------------------------------------------------
        // RAZORPAY CLIENT
        // -----------------------------------------------------

        RazorpayClient razorpayClient =
                new RazorpayClient(
                        razorpayKeyId,
                        razorpayKeySecret
                );


        // -----------------------------------------------------
        // RAZORPAY AMOUNT IS IN PAISE
        // -----------------------------------------------------

        int amountInPaise =
                (int)
                        Math.round(
                                amount * 100
                        );


        // -----------------------------------------------------
        // CREATE ORDER REQUEST
        // -----------------------------------------------------

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


        // -----------------------------------------------------
        // NOTES
        // -----------------------------------------------------

        JSONObject notes =
                new JSONObject();


        notes.put(
                "bookingId",
                bookingId
        );


        orderRequest.put(
                "notes",
                notes
        );


        // -----------------------------------------------------
        // CREATE RAZORPAY ORDER
        // -----------------------------------------------------

        Order razorpayOrder =
                razorpayClient.orders.create(
                        orderRequest
                );


        String orderId =
                razorpayOrder.get(
                        "id"
                );


        // -----------------------------------------------------
        // CREATE / UPDATE PAYMENT
        // -----------------------------------------------------

        Payment payment =
                existingPayment;


        if (payment == null) {

            payment =
                    new Payment();

            payment.setBooking(
                    booking
            );
        }


        payment.setAmount(
                amount
        );


        payment.setPaymentMethod(
                "RAZORPAY"
        );


        payment.setPaymentStatus(
                "CREATED"
        );


        payment.setRazorpayOrderId(
                orderId
        );


        payment.setRazorpayPaymentId(
                null
        );


        payment.setRazorpaySignature(
                null
        );


        payment.setPaymentDate(
                LocalDateTime.now()
        );


        Payment savedPayment =
                paymentRepository.save(
                        payment
                );


        // -----------------------------------------------------
        // RESPONSE
        // -----------------------------------------------------

        return new RazorpayOrderResponse(

                booking.getId(),

                savedPayment.getId(),

                orderId,

                razorpayKeyId,

                amount,

                "INR"
        );
    }


    // =========================================================
    // VERIFY RAZORPAY PAYMENT
    // =========================================================

    public Payment
    verifyRazorpayPayment(
            RazorpayVerifyRequest request
    ) throws Exception {

        // -----------------------------------------------------
        // REQUEST VALIDATION
        // -----------------------------------------------------

        if (request == null) {

            throw new RuntimeException(
                    "Payment verification data is required"
            );
        }


        if (request.getBookingId() == null) {

            throw new RuntimeException(
                    "Booking ID is required"
            );
        }


        if (
                request.getRazorpayOrderId() == null ||
                        request.getRazorpayPaymentId() == null ||
                        request.getRazorpaySignature() == null
        ) {

            throw new RuntimeException(
                    "Razorpay payment details are incomplete"
            );
        }


        // -----------------------------------------------------
        // GET BOOKING
        // -----------------------------------------------------

        Booking booking =
                bookingRepository
                        .findById(
                                request.getBookingId()
                        )
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Booking Not Found"
                                        )
                        );


        // -----------------------------------------------------
        // GET PAYMENT
        // -----------------------------------------------------

        Payment payment =
                paymentRepository
                        .findByBookingId(
                                booking.getId()
                        );


        if (payment == null) {

            throw new RuntimeException(
                    "Payment record not found"
            );
        }


        // -----------------------------------------------------
        // PREVENT DOUBLE VERIFICATION
        // -----------------------------------------------------

        if (
                "PAID".equalsIgnoreCase(
                        payment.getPaymentStatus()
                )
        ) {

            return payment;
        }


        // -----------------------------------------------------
        // VERIFY ORDER ID
        // -----------------------------------------------------

        if (
                payment.getRazorpayOrderId() == null ||
                        !request
                                .getRazorpayOrderId()
                                .equals(
                                        payment
                                                .getRazorpayOrderId()
                                )
        ) {

            payment.setPaymentStatus(
                    "FAILED"
            );

            paymentRepository.save(
                    payment
            );

            throw new RuntimeException(
                    "Invalid Razorpay Order ID"
            );
        }


        // -----------------------------------------------------
        // SIGNATURE VERIFICATION
        //
        // IMPORTANT SECURITY STEP
        // -----------------------------------------------------

        String generatedSignature =
                request
                        .getRazorpayOrderId()
                        + "|"
                        + request
                        .getRazorpayPaymentId();


        boolean validSignature =
                Utils.verifySignature(

                        generatedSignature,

                        request
                                .getRazorpaySignature(),

                        razorpayKeySecret
                );


        // -----------------------------------------------------
        // INVALID SIGNATURE
        // -----------------------------------------------------

        if (!validSignature) {

            payment.setPaymentStatus(
                    "FAILED"
            );

            paymentRepository.save(
                    payment
            );


            // Release reserved car

            if (booking.getCar() != null) {

                Car car =
                        booking.getCar();

                car.setAvailable(
                        true
                );

                carRepository.save(
                        car
                );
            }


            booking.setBookingStatus(
                    "PAYMENT_FAILED"
            );

            bookingRepository.save(
                    booking
            );


            throw new RuntimeException(
                    "Invalid Razorpay signature"
            );
        }


        // -----------------------------------------------------
        // PAYMENT SUCCESS
        // -----------------------------------------------------

        payment.setRazorpayPaymentId(
                request
                        .getRazorpayPaymentId()
        );


        payment.setRazorpaySignature(
                request
                        .getRazorpaySignature()
        );


        payment.setPaymentStatus(
                "PAID"
        );


        payment.setPaymentDate(
                LocalDateTime.now()
        );


        // -----------------------------------------------------
        // AUTOMATICALLY CONFIRM BOOKING
        // -----------------------------------------------------

        booking.setBookingStatus(
                "CONFIRMED"
        );


        bookingRepository.save(
                booking
        );


        // -----------------------------------------------------
        // SAVE PAYMENT
        // -----------------------------------------------------

        return paymentRepository.save(
                payment
        );
    }


    // =========================================================
    // CANCEL PAYMENT
    // =========================================================

    public void cancelPayment(
            Long bookingId
    ) {

        Booking booking =
                bookingRepository
                        .findById(
                                bookingId
                        )
                        .orElse(null);


        if (booking == null) {
            return;
        }


        // -----------------------------------------------------
        // DO NOT CANCEL ALREADY CONFIRMED PAYMENT
        // -----------------------------------------------------

        Payment payment =
                paymentRepository
                        .findByBookingId(
                                bookingId
                        );


        if (
                payment != null &&
                        "PAID".equalsIgnoreCase(
                                payment.getPaymentStatus()
                        )
        ) {

            return;
        }


        // -----------------------------------------------------
        // PAYMENT FAILED
        // -----------------------------------------------------

        if (payment != null) {

            payment.setPaymentStatus(
                    "FAILED"
            );

            payment.setPaymentDate(
                    LocalDateTime.now()
            );

            paymentRepository.save(
                    payment
            );
        }


        // -----------------------------------------------------
        // RELEASE CAR
        // -----------------------------------------------------

        if (booking.getCar() != null) {

            Car car =
                    booking.getCar();

            car.setAvailable(
                    true
            );

            carRepository.save(
                    car
            );
        }


        // -----------------------------------------------------
        // UPDATE BOOKING
        // -----------------------------------------------------

        booking.setBookingStatus(
                "PAYMENT_FAILED"
        );


        bookingRepository.save(
                booking
        );
    }


    // =========================================================
    // ADMIN - GET ALL PAYMENTS
    // =========================================================

    public List<Payment>
    getAllPayments() {

        return paymentRepository
                .findAll();
    }


    // =========================================================
    // ADMIN REJECT / REFUND
    // =========================================================

    public Payment
    rejectPayment(
            Long paymentId
    ) throws Exception {

        Payment payment =
                paymentRepository
                        .findById(
                                paymentId
                        )
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Payment Not Found"
                                        )
                        );


        // -----------------------------------------------------
        // ONLY PAID PAYMENT CAN BE REFUNDED
        // -----------------------------------------------------

        if (
                !"PAID".equalsIgnoreCase(
                        payment.getPaymentStatus()
                )
        ) {

            throw new RuntimeException(
                    "Only paid payments can be rejected/refunded"
            );
        }


        if (
                payment.getRazorpayPaymentId() == null ||
                        payment.getRazorpayPaymentId()
                                .trim()
                                .isEmpty()
        ) {

            throw new RuntimeException(
                    "Razorpay Payment ID is missing"
            );
        }


        // -----------------------------------------------------
        // RAZORPAY CLIENT
        // -----------------------------------------------------

        RazorpayClient razorpayClient =
                new RazorpayClient(
                        razorpayKeyId,
                        razorpayKeySecret
                );


        // -----------------------------------------------------
        // REFUND REQUEST
        // -----------------------------------------------------

        JSONObject refundRequest =
                new JSONObject();


        refundRequest.put(
                "amount",
                (int)
                        Math.round(
                                payment.getAmount()
                                        * 100
                        )
        );


        // -----------------------------------------------------
        // RAZORPAY REFUND
        // -----------------------------------------------------

        razorpayClient
                .payments
                .refund(

                        payment
                                .getRazorpayPaymentId(),

                        refundRequest
                );


        // -----------------------------------------------------
        // UPDATE PAYMENT
        // -----------------------------------------------------

        payment.setPaymentStatus(
                "REFUNDED"
        );


        payment.setPaymentDate(
                LocalDateTime.now()
        );


        // -----------------------------------------------------
        // UPDATE BOOKING
        // -----------------------------------------------------

        Booking booking =
                payment.getBooking();


        if (booking != null) {

            booking.setBookingStatus(
                    "REJECTED"
            );


            // -------------------------------------------------
            // RELEASE CAR
            // -------------------------------------------------

            if (booking.getCar() != null) {

                Car car =
                        booking.getCar();

                car.setAvailable(
                        true
                );

                carRepository.save(
                        car
                );
            }


            bookingRepository.save(
                    booking
            );
        }


        return paymentRepository.save(
                payment
        );
    }
}