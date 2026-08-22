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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;

    private final BookingRepository bookingRepository;

    private final CarRepository carRepository;

    private final MailService mailService;


    // =========================================================
    // RAZORPAY CONFIGURATION
    // =========================================================

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;


    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    @Autowired
    public PaymentService(
            PaymentRepository paymentRepository,
            BookingRepository bookingRepository,
            CarRepository carRepository,
            MailService mailService
    ) {

        this.paymentRepository =
                paymentRepository;

        this.bookingRepository =
                bookingRepository;

        this.carRepository =
                carRepository;

        this.mailService =
                mailService;
    }


    // =========================================================
    // CREATE RAZORPAY ORDER
    // =========================================================

    public RazorpayOrderResponse createRazorpayOrder(
            Long bookingId
    ) throws Exception {

        Booking booking =
                bookingRepository
                        .findById(bookingId)
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Booking Not Found"
                                        )
                        );


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


        Payment existingPayment =
                paymentRepository
                        .findByBookingId(
                                bookingId
                        );


        if (
                existingPayment != null
                        &&
                        "PAID".equalsIgnoreCase(
                                existingPayment.getPaymentStatus()
                        )
        ) {

            throw new RuntimeException(
                    "Payment already completed"
            );
        }


        Double bookingAmount =
                booking.getTotalAmount();


        if (
                bookingAmount == null
                        ||
                        bookingAmount <= 0
        ) {

            throw new RuntimeException(
                    "Invalid booking amount"
            );
        }


        double amount =
                bookingAmount;


        RazorpayClient razorpayClient =
                new RazorpayClient(
                        razorpayKeyId,
                        razorpayKeySecret
                );


        int amountInPaise =
                (int)
                        Math.round(
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


        String receipt =
                "BOOKING_"
                        +
                        bookingId
                        +
                        "_"
                        +
                        System.currentTimeMillis();


        orderRequest.put(
                "receipt",
                receipt
        );


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


        Order razorpayOrder =
                razorpayClient
                        .orders
                        .create(
                                orderRequest
                        );


        String orderId =
                razorpayOrder.get(
                        "id"
                );


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

    public Payment verifyRazorpayPayment(
            RazorpayVerifyRequest request
    ) throws Exception {

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
                request.getRazorpayOrderId() == null
                        ||
                        request.getRazorpayPaymentId() == null
                        ||
                        request.getRazorpaySignature() == null
        ) {

            throw new RuntimeException(
                    "Razorpay payment details are incomplete"
            );
        }


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


        if (
                "PAID".equalsIgnoreCase(
                        payment.getPaymentStatus()
                )
        ) {

            return payment;
        }


        if (
                payment.getRazorpayOrderId() == null
                        ||
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


        String generatedSignature =
                request
                        .getRazorpayOrderId()
                        +
                        "|"
                        +
                        request
                                .getRazorpayPaymentId();


        boolean validSignature =
                Utils.verifySignature(

                        generatedSignature,

                        request
                                .getRazorpaySignature(),

                        razorpayKeySecret
                );


        if (!validSignature) {

            payment.setPaymentStatus(
                    "FAILED"
            );


            paymentRepository.save(
                    payment
            );


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


        // =====================================================
        // PAYMENT SUCCESS
        // =====================================================

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


        booking.setBookingStatus(
                "CONFIRMED"
        );


        bookingRepository.save(
                booking
        );


        Payment savedPayment =
                paymentRepository.save(
                        payment
                );


        sendPaymentSuccessEmail(
                savedPayment,
                booking
        );


        return savedPayment;
    }


    // =========================================================
    // CHECK RAZORPAY PAYMENT STATUS
    // =========================================================
    //
    // This method is used by:
    //
    // GET /payment/status/{bookingId}
    //
    // It checks Razorpay directly.
    //
    // This is important for QR/UPI payments where the
    // browser handler may not immediately return.
    //
    // =========================================================

    public Payment checkPaymentStatus(
            Long bookingId
    ) throws Exception {

        // -----------------------------------------------------
        // FIND LOCAL PAYMENT
        // -----------------------------------------------------

        Payment payment =
                paymentRepository
                        .findByBookingId(
                                bookingId
                        );


        if (payment == null) {

            throw new RuntimeException(
                    "Payment not found for booking: "
                            + bookingId
            );
        }


        // -----------------------------------------------------
        // ALREADY PAID
        // -----------------------------------------------------

        if (
                "PAID".equalsIgnoreCase(
                        payment.getPaymentStatus()
                )
        ) {

            return payment;
        }


        // -----------------------------------------------------
        // CHECK RAZORPAY ORDER ID
        // -----------------------------------------------------

        if (
                payment.getRazorpayOrderId() == null
                        ||
                        payment.getRazorpayOrderId()
                                .trim()
                                .isEmpty()
        ) {

            throw new RuntimeException(
                    "Razorpay order ID not found"
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


        // =====================================================
        // FETCH RAZORPAY ORDER
        // =====================================================

        Order razorpayOrder =
                razorpayClient
                        .orders
                        .fetch(
                                payment
                                        .getRazorpayOrderId()
                        );


        String orderStatus =
                razorpayOrder.get(
                        "status"
                );


        Integer amountPaid =
                razorpayOrder.get(
                        "amount_paid"
                );


        Integer orderAmount =
                razorpayOrder.get(
                        "amount"
                );


        System.out.println(
                "================================================="
        );


        System.out.println(
                "RAZORPAY PAYMENT STATUS CHECK"
        );


        System.out.println(
                "BOOKING ID: "
                        + bookingId
        );


        System.out.println(
                "RAZORPAY ORDER ID: "
                        + payment.getRazorpayOrderId()
        );


        System.out.println(
                "RAZORPAY ORDER STATUS: "
                        + orderStatus
        );


        System.out.println(
                "RAZORPAY AMOUNT PAID: "
                        + amountPaid
        );


        System.out.println(
                "RAZORPAY ORDER AMOUNT: "
                        + orderAmount
        );


        // =====================================================
        // DETERMINE WHETHER ORDER IS PAID
        // =====================================================

        boolean orderPaid =
                "paid".equalsIgnoreCase(
                        orderStatus
                )
                        ||
                        (
                                amountPaid != null
                                        &&
                                        orderAmount != null
                                        &&
                                        amountPaid.equals(
                                                orderAmount
                                        )
                        );


        // =====================================================
        // FETCH ACTUAL RAZORPAY PAYMENTS
        // =====================================================

        if (orderPaid) {

            try {

                /*
                 * IMPORTANT:
                 *
                 * Your Razorpay Java SDK returns:
                 *
                 * List<com.razorpay.Payment>
                 *
                 * NOT JSONArray.
                 */

                List<com.razorpay.Payment> payments =
                        razorpayClient
                                .orders
                                .fetchPayments(
                                        payment
                                                .getRazorpayOrderId()
                                );


                System.out.println(
                        "RAZORPAY PAYMENTS COUNT: "
                                + payments.size()
                );


                // -------------------------------------------------
                // FIND CAPTURED PAYMENT
                // -------------------------------------------------

                for (
                        com.razorpay.Payment razorpayPayment
                        : payments
                ) {

                    String paymentStatus =
                            razorpayPayment.get(
                                    "status"
                            );


                    String razorpayPaymentId =
                            razorpayPayment.get(
                                    "id"
                            );


                    System.out.println(
                            "RAZORPAY PAYMENT ID: "
                                    + razorpayPaymentId
                    );


                    System.out.println(
                            "RAZORPAY PAYMENT STATUS: "
                                    + paymentStatus
                    );


                    /*
                     * A successful captured payment normally
                     * has status = captured.
                     */

                    if (
                            "captured".equalsIgnoreCase(
                                    paymentStatus
                            )
                    ) {

                        if (
                                razorpayPaymentId != null
                                        &&
                                        !razorpayPaymentId
                                                .trim()
                                                .isEmpty()
                        ) {

                            payment.setRazorpayPaymentId(
                                    razorpayPaymentId
                            );
                        }


                        break;
                    }
                }


            } catch (Exception paymentFetchException) {

                /*
                 * The order itself already says paid.
                 *
                 * Therefore don't turn the payment into
                 * FAILED merely because fetching the payment
                 * list had a temporary problem.
                 */

                System.out.println(
                        "RAZORPAY PAYMENT FETCH WARNING: "
                                +
                                paymentFetchException
                                        .getMessage()
                );
            }
        }


        // =====================================================
        // PAYMENT CONFIRMED
        // =====================================================

        if (orderPaid) {

            boolean wasAlreadyPaid =
                    "PAID".equalsIgnoreCase(
                            payment.getPaymentStatus()
                    );


            payment.setPaymentStatus(
                    "PAID"
            );


            payment.setPaymentDate(
                    LocalDateTime.now()
            );


            // -------------------------------------------------
            // GET BOOKING
            // -------------------------------------------------

            Booking booking =
                    payment.getBooking();


            if (booking != null) {

                booking.setBookingStatus(
                        "CONFIRMED"
                );


                bookingRepository.save(
                        booking
                );
            }


            // -------------------------------------------------
            // SAVE PAYMENT
            // -------------------------------------------------

            Payment savedPayment =
                    paymentRepository.save(
                            payment
                    );


            // -------------------------------------------------
            // SEND EMAIL ONLY ON FIRST CONFIRMATION
            // -------------------------------------------------

            if (!wasAlreadyPaid) {

                sendPaymentSuccessEmail(
                        savedPayment,
                        booking
                );
            }


            System.out.println(
                    "================================================="
            );


            System.out.println(
                    "PAYMENT CONFIRMED BY RAZORPAY"
            );


            System.out.println(
                    "BOOKING ID: "
                            + bookingId
            );


            System.out.println(
                    "RAZORPAY ORDER ID: "
                            + savedPayment
                            .getRazorpayOrderId()
            );


            System.out.println(
                    "RAZORPAY PAYMENT ID: "
                            + savedPayment
                            .getRazorpayPaymentId()
            );


            System.out.println(
                    "PAYMENT STATUS: "
                            + savedPayment
                            .getPaymentStatus()
            );


            System.out.println(
                    "BOOKING STATUS: "
                            +
                            (
                                    booking != null
                                            ?
                                            booking
                                                    .getBookingStatus()
                                            :
                                            "N/A"
                            )
            );


            System.out.println(
                    "================================================="
            );


            return savedPayment;
        }


        // =====================================================
        // PAYMENT STILL PENDING
        // =====================================================

        System.out.println(
                "PAYMENT NOT CONFIRMED YET."
        );


        System.out.println(
                "RAZORPAY ORDER STATUS: "
                        + orderStatus
        );


        System.out.println(
                "LOCAL PAYMENT STATUS: "
                        + payment.getPaymentStatus()
        );


        return payment;
    }


    // =========================================================
    // SEND PAYMENT SUCCESS EMAIL
    // =========================================================

    private void sendPaymentSuccessEmail(
            Payment payment,
            Booking booking
    ) {

        try {

            if (
                    booking == null
                            ||
                            booking.getCustomer() == null
            ) {

                System.out.println(
                        "Payment email skipped: customer not found"
                );

                return;
            }


            String customerEmail =
                    booking
                            .getCustomer()
                            .getEmail();


            if (
                    customerEmail == null
                            ||
                            customerEmail
                                    .trim()
                                    .isEmpty()
            ) {

                System.out.println(
                        "Payment email skipped: customer email missing"
                );

                return;
            }


            String customerName =
                    booking
                            .getCustomer()
                            .getName();


            String carName =
                    booking.getCarVariant() != null
                            ?
                            booking
                                    .getCarVariant()
                                    .getVariantName()
                            :
                            "N/A";


            String fuelType =
                    booking.getCarVariant() != null
                            ?
                            booking
                                    .getCarVariant()
                                    .getFuelType()
                            :
                            "N/A";


            String registrationNumber =
                    booking.getCar() != null
                            ?
                            booking
                                    .getCar()
                                    .getRegistrationNumber()
                            :
                            "Not Assigned";


            String subject =
                    "CarRental Payment Successful - Payment #"
                            + payment.getId();


            String body =
                    "Dear "
                            + (
                            customerName != null
                                    ?
                                    customerName
                                    :
                                    "Customer"
                    )
                            + ",\n\n"

                            +

                            "Your CarRental payment has been successfully verified.\n\n"

                            +

                            "==============================\n"
                            +
                            "PAYMENT DETAILS\n"
                            +
                            "==============================\n"

                            +

                            "Payment ID: "
                            + payment.getId()
                            + "\n"

                            +

                            "Amount: ₹"
                            + payment.getAmount()
                            + "\n"

                            +

                            "Payment Status: "
                            + payment.getPaymentStatus()
                            + "\n"

                            +

                            "Payment Method: "
                            + payment.getPaymentMethod()
                            + "\n"

                            +

                            "Payment Date: "
                            + payment.getPaymentDate()
                            + "\n\n"

                            +

                            "==============================\n"
                            +
                            "RAZORPAY TRANSACTION\n"
                            +
                            "==============================\n"

                            +

                            "Razorpay Order ID: "
                            + payment.getRazorpayOrderId()
                            + "\n"

                            +

                            "Razorpay Payment ID: "
                            + payment.getRazorpayPaymentId()
                            + "\n"

                            +

                            "Razorpay Signature: "
                            + payment.getRazorpaySignature()
                            + "\n\n"

                            +

                            "==============================\n"
                            +
                            "BOOKING DETAILS\n"
                            +
                            "==============================\n"

                            +

                            "Booking ID: "
                            + booking.getId()
                            + "\n"

                            +

                            "Booking Status: "
                            + booking.getBookingStatus()
                            + "\n"

                            +

                            "Car: "
                            + carName
                            + "\n"

                            +

                            "Fuel Type: "
                            + fuelType
                            + "\n"

                            +

                            "Registration Number: "
                            + registrationNumber
                            + "\n"

                            +

                            "From Date: "
                            + booking.getFromDate()
                            + "\n"

                            +

                            "To Date: "
                            + booking.getToDate()
                            + "\n"

                            +

                            "Total Booking Amount: ₹"
                            + booking.getTotalAmount()
                            + "\n\n"

                            +

                            "Thank you for choosing CarRental.\n\n"

                            +

                            "This is an automatically generated email.";


            mailService.sendMail(
                    customerEmail,
                    subject,
                    body
            );


            System.out.println(
                    "PAYMENT SUCCESS EMAIL SENT TO: "
                            + customerEmail
            );

        } catch (Exception e) {

            /*
             * Payment is already successful.
             *
             * Email failure must not make the payment failed.
             */

            System.out.println(
                    "PAYMENT EMAIL FAILED: "
                            + e.getMessage()
            );
        }
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


        Payment payment =
                paymentRepository
                        .findByBookingId(
                                bookingId
                        );


        /*
         * NEVER change a paid payment to failed.
         */

        if (
                payment != null
                        &&
                        "PAID".equalsIgnoreCase(
                                payment.getPaymentStatus()
                        )
        ) {

            return;
        }


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


        /*
         * Release the car if one was assigned.
         */

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


        /*
         * Do not automatically change booking status here.
         */
    }


    // =========================================================
    // ADMIN - GET ALL PAYMENTS
    // =========================================================

    public List<Payment> getAllPayments() {

        List<Payment> payments =
                paymentRepository.findAll();


        payments.sort(
                Comparator
                        .comparing(
                                Payment::getPaymentDate,
                                Comparator.nullsLast(
                                        Comparator.naturalOrder()
                                )
                        )
                        .reversed()
        );


        return payments;
    }


    // =========================================================
    // ADMIN - REFUND
    // =========================================================

    public Payment rejectPayment(
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
                payment.getRazorpayPaymentId() == null
                        ||
                        payment.getRazorpayPaymentId()
                                .trim()
                                .isEmpty()
        ) {

            throw new RuntimeException(
                    "Razorpay Payment ID is missing"
            );
        }


        RazorpayClient razorpayClient =
                new RazorpayClient(
                        razorpayKeyId,
                        razorpayKeySecret
                );


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


        razorpayClient
                .payments
                .refund(
                        payment
                                .getRazorpayPaymentId(),

                        refundRequest
                );


        payment.setPaymentStatus(
                "REFUNDED"
        );


        payment.setPaymentDate(
                LocalDateTime.now()
        );


        Booking booking =
                payment.getBooking();


        if (booking != null) {

            booking.setBookingStatus(
                    "REJECTED"
            );


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