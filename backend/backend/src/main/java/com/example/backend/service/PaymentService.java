package com.example.backend.service;

import com.example.backend.entity.Booking;
import com.example.backend.entity.Car;
import com.example.backend.entity.Payment;
import com.example.backend.repository.BookingRepository;
import com.example.backend.repository.PaymentRepository;
import com.example.backend.repository.CarRepository;

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

    @Autowired
    private CarRepository carRepository;

    @Autowired
    private MailService mailService;


    // =========================================================
    // ADD PAYMENT
    // CUSTOMER SUBMITS UPI PAYMENT
    // =========================================================

    public Payment addPayment(Payment payment) {

        // -----------------------------------------------------
        // BOOKING CHECK
        // -----------------------------------------------------

        if (payment == null ||
                payment.getBooking() == null ||
                payment.getBooking().getId() == null) {

            throw new RuntimeException(
                    "Booking is required"
            );
        }

        Long bookingId =
                payment.getBooking().getId();


        // -----------------------------------------------------
        // CHECK EXISTING PAYMENT FOR BOOKING
        // -----------------------------------------------------

        Payment existingPayment =
                paymentRepository.findByBookingId(
                        bookingId
                );

        if (existingPayment != null) {

            throw new RuntimeException(
                    "Payment Already Exists"
            );
        }


        // -----------------------------------------------------
        // GET BOOKING
        // -----------------------------------------------------

        Booking booking =
                bookingRepository
                        .findById(bookingId)
                        .orElse(null);

        if (booking == null) {

            throw new RuntimeException(
                    "Booking Not Found"
            );
        }


        // -----------------------------------------------------
        // ONLY APPROVED BOOKING CAN BE PAID
        // -----------------------------------------------------

        if (!"APPROVED".equalsIgnoreCase(
                booking.getBookingStatus()
        )) {

            throw new RuntimeException(
                    "Only Approved Booking Can Be Paid"
            );
        }


        // -----------------------------------------------------
        // UPI TRANSACTION ID / UTR
        // -----------------------------------------------------

        String upiTransactionId =
                payment.getUpiTransactionId();


        if (upiTransactionId == null ||
                upiTransactionId.trim().isEmpty()) {

            throw new RuntimeException(
                    "UPI Transaction ID / UTR is required"
            );
        }


        upiTransactionId =
                upiTransactionId.trim();


        // -----------------------------------------------------
        // BASIC UTR VALIDATION
        // -----------------------------------------------------

        if (upiTransactionId.length() < 6) {

            throw new RuntimeException(
                    "Invalid UPI Transaction ID / UTR"
            );
        }


        if (upiTransactionId.length() > 50) {

            throw new RuntimeException(
                    "UPI Transaction ID / UTR is too long"
            );
        }


        // -----------------------------------------------------
        // CHECK DUPLICATE UTR
        // -----------------------------------------------------

        Payment existingTransaction =
                paymentRepository
                        .findByUpiTransactionId(
                                upiTransactionId
                        );

        if (existingTransaction != null) {

            throw new RuntimeException(
                    "This UPI Transaction ID has already been used"
            );
        }


        // -----------------------------------------------------
        // SET BOOKING
        // -----------------------------------------------------

        payment.setBooking(
                booking
        );


        // -----------------------------------------------------
        // ALWAYS TAKE AMOUNT FROM BOOKING
        // NEVER TRUST CUSTOMER AMOUNT
        // -----------------------------------------------------

        payment.setAmount(
                booking.getTotalAmount()
        );


        // -----------------------------------------------------
        // PAYMENT METHOD
        // -----------------------------------------------------

        payment.setPaymentMethod(
                "UPI"
        );


        // -----------------------------------------------------
        // SAVE UTR
        // -----------------------------------------------------

        payment.setUpiTransactionId(
                upiTransactionId
        );


        // -----------------------------------------------------
        // PAYMENT STATUS
        // -----------------------------------------------------

        /*
         * IMPORTANT
         *
         * Customer submitting a UTR does NOT mean
         * that the payment is verified.
         *
         * Therefore:
         *
         * VERIFYING
         *
         * Admin will manually check the UTR against
         * the real UPI/bank transaction.
         *
         * Admin can then:
         *
         * VERIFYING -> PAID
         *
         * OR
         *
         * VERIFYING -> REJECTED
         */

        payment.setPaymentStatus(
                "VERIFYING"
        );


        // -----------------------------------------------------
        // PAYMENT DATE
        // -----------------------------------------------------

        payment.setPaymentDate(
                LocalDate.now()
        );


        // -----------------------------------------------------
        // CUSTOMER
        // -----------------------------------------------------

        if (booking.getCustomer() != null) {

            payment.setCustomer(
                    booking.getCustomer()
            );
        }


        // -----------------------------------------------------
        // SAVE PAYMENT
        // -----------------------------------------------------

        Payment savedPayment =
                paymentRepository.save(
                        payment
                );


        // =====================================================
        // SEND EMAIL TO CUSTOMER
        // =====================================================

        if (booking.getCustomer() != null) {

            mailService.sendMail(

                    booking.getCustomer().getEmail(),

                    "Payment Submitted - Car Rental System",

                    "Hello "
                            + booking.getCustomer().getName()

                            + "\n\nYour UPI payment details have been submitted."

                            + "\n\nPayment ID : "
                            + savedPayment.getId()

                            + "\nBooking ID : "
                            + booking.getId()

                            + "\nCar : "
                            + booking.getCarVariant()
                            .getVariantName()

                            + "\nFuel Type : "
                            + booking.getCarVariant()
                            .getFuelType()

                            + "\nAmount : Rs. "
                            + booking.getTotalAmount()

                            + "\nPayment Method : UPI"

                            + "\nUPI Transaction ID / UTR : "
                            + savedPayment
                            .getUpiTransactionId()

                            + "\nPayment Status : VERIFYING"

                            + "\n\nYour payment will be confirmed after "
                            + "the administrator verifies the transaction."

                            + "\n\nThank you for choosing Car Rental System."
            );
        }


        return savedPayment;
    }


    // =========================================================
    // VERIFY PAYMENT
    // ADMIN
    // =========================================================

    public Payment verifyPayment(
            Long paymentId) {


        Payment payment =
                paymentRepository
                        .findById(paymentId)
                        .orElse(null);


        if (payment == null) {

            throw new RuntimeException(
                    "Payment Not Found"
            );
        }


        // -----------------------------------------------------
        // CHECK PAYMENT STATUS
        // -----------------------------------------------------

        if ("PAID".equalsIgnoreCase(
                payment.getPaymentStatus()
        )) {

            throw new RuntimeException(
                    "Payment is already verified"
            );
        }


        if (!"VERIFYING".equalsIgnoreCase(
                payment.getPaymentStatus()
        )) {

            throw new RuntimeException(
                    "Only VERIFYING payments can be verified"
            );
        }


        // -----------------------------------------------------
        // UTR MUST EXIST
        // -----------------------------------------------------

        if (payment.getUpiTransactionId() == null ||
                payment.getUpiTransactionId()
                        .trim()
                        .isEmpty()) {

            throw new RuntimeException(
                    "UPI Transaction ID / UTR is missing"
            );
        }


        /*
         * IMPORTANT:
         *
         * The backend cannot independently know whether
         * the UTR represents a real bank transaction
         * unless a bank/payment-provider API is connected.
         *
         * Therefore the ADMIN must first check the UTR
         * in the actual UPI/bank transaction history.
         *
         * After confirming it manually, Admin clicks
         * Verify Payment.
         */


        // -----------------------------------------------------
        // SET PAYMENT AS PAID
        // -----------------------------------------------------

        payment.setPaymentStatus(
                "PAID"
        );


        // -----------------------------------------------------
        // GET BOOKING
        // -----------------------------------------------------

        Booking booking =
                payment.getBooking();


        if (booking != null) {

            booking.setBookingStatus(
                    "PAID"
            );

            bookingRepository.save(
                    booking
            );
        }


        // -----------------------------------------------------
        // SAVE PAYMENT
        // -----------------------------------------------------

        Payment updatedPayment =
                paymentRepository.save(
                        payment
                );


        // =====================================================
        // SEND SUCCESS EMAIL
        // =====================================================

        if (booking != null &&
                booking.getCustomer() != null) {

            mailService.sendMail(

                    booking.getCustomer().getEmail(),

                    "Payment Verified - Car Rental System",

                    "Hello "
                            + booking.getCustomer().getName()

                            + "\n\nYour UPI payment has been verified successfully."

                            + "\n\nPayment ID : "
                            + updatedPayment.getId()

                            + "\nBooking ID : "
                            + booking.getId()

                            + "\nCar : "
                            + booking.getCarVariant()
                            .getVariantName()

                            + "\nAmount : Rs. "
                            + updatedPayment.getAmount()

                            + "\nPayment Method : UPI"

                            + "\nUPI Transaction ID / UTR : "
                            + updatedPayment
                            .getUpiTransactionId()

                            + "\nPayment Status : PAID"

                            + "\nPayment Date : "
                            + updatedPayment
                            .getPaymentDate()

                            + "\n\nYour booking is now confirmed."

                            + "\n\nThank you for choosing Car Rental System."
            );
        }


        return updatedPayment;
    }


    // =========================================================
    // REJECT PAYMENT
    // ADMIN
    // =========================================================

    public Payment rejectPayment(
            Long paymentId) {


        Payment payment =
                paymentRepository
                        .findById(paymentId)
                        .orElse(null);


        if (payment == null) {

            throw new RuntimeException(
                    "Payment Not Found"
            );
        }


        // -----------------------------------------------------
        // ONLY VERIFYING PAYMENT CAN BE REJECTED
        // -----------------------------------------------------

        if (!"VERIFYING".equalsIgnoreCase(
                payment.getPaymentStatus()
        )) {

            throw new RuntimeException(
                    "Only VERIFYING payments can be rejected"
            );
        }


        // -----------------------------------------------------
        // SET PAYMENT REJECTED
        // -----------------------------------------------------

        payment.setPaymentStatus(
                "REJECTED"
        );


        // -----------------------------------------------------
        // GET BOOKING
        // -----------------------------------------------------

        Booking booking =
                payment.getBooking();


        if (booking != null) {

            /*
             * Payment was rejected.
             *
             * The booking should no longer remain
             * in PAID/APPROVED state.
             */

            booking.setBookingStatus(
                    "REJECTED"
            );

            bookingRepository.save(
                    booking
            );


            // -------------------------------------------------
            // MAKE CAR AVAILABLE AGAIN
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
        }


        // -----------------------------------------------------
        // SAVE PAYMENT
        // -----------------------------------------------------

        Payment updatedPayment =
                paymentRepository.save(
                        payment
                );


        // =====================================================
        // SEND REJECTION EMAIL
        // =====================================================

        if (booking != null &&
                booking.getCustomer() != null) {

            mailService.sendMail(

                    booking.getCustomer().getEmail(),

                    "Payment Rejected - Car Rental System",

                    "Hello "
                            + booking.getCustomer().getName()

                            + "\n\nYour submitted UPI payment "
                            + "could not be verified."

                            + "\n\nPayment ID : "
                            + updatedPayment.getId()

                            + "\nBooking ID : "
                            + booking.getId()

                            + "\nCar : "
                            + booking.getCarVariant()
                            .getVariantName()

                            + "\nAmount : Rs. "
                            + updatedPayment.getAmount()

                            + "\nPayment Method : UPI"

                            + "\nUPI Transaction ID / UTR : "
                            + updatedPayment
                            .getUpiTransactionId()

                            + "\nPayment Status : REJECTED"

                            + "\n\nPlease contact the administrator "
                            + "or submit a valid payment."

            );
        }


        return updatedPayment;
    }


    // =========================================================
    // GET ALL PAYMENTS
    // =========================================================

    public List<Payment> getAllPayments() {

        return paymentRepository.findAll();
    }


    // =========================================================
    // GET PAYMENT BY ID
    // =========================================================

    public Payment getPaymentById(
            Long id) {

        return paymentRepository
                .findById(id)
                .orElse(null);
    }


    // =========================================================
    // DELETE PAYMENT
    // =========================================================

    public String deletePayment(
            Long id) {


        Payment payment =
                paymentRepository
                        .findById(id)
                        .orElse(null);


        if (payment == null) {

            return "Payment Not Found";
        }


        paymentRepository.deleteById(
                id
        );


        return "Payment Deleted Successfully";
    }
}