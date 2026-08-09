package com.example.backend.controller;

import com.example.backend.entity.Payment;
import com.example.backend.service.PaymentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payment")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {


    @Autowired
    private PaymentService paymentService;


    // =========================================================
    // ADD / SUBMIT PAYMENT
    // =========================================================

    @PostMapping("/add")
    public Object addPayment(
            @RequestBody Payment payment) {

        try {

            return paymentService.addPayment(
                    payment
            );

        }
        catch (Exception e) {

            e.printStackTrace();

            return e.getMessage();
        }
    }


    // =========================================================
    // GET ALL PAYMENTS
    // =========================================================

    @GetMapping("/all")
    public List<Payment> getAllPayments() {

        return paymentService.getAllPayments();
    }


    // =========================================================
    // GET PAYMENT BY ID
    // =========================================================

    @GetMapping("/{id}")
    public Payment getPaymentById(
            @PathVariable Long id) {

        return paymentService.getPaymentById(
                id
        );
    }


    // =========================================================
    // VERIFY PAYMENT
    // ADMIN
    // =========================================================

    @PutMapping("/verify/{id}")
    public Object verifyPayment(
            @PathVariable Long id) {

        try {

            return paymentService.verifyPayment(
                    id
            );

        }
        catch (Exception e) {

            e.printStackTrace();

            return e.getMessage();
        }
    }


    // =========================================================
    // REJECT PAYMENT
    // ADMIN
    // =========================================================

    @PutMapping("/reject/{id}")
    public Object rejectPayment(
            @PathVariable Long id) {

        try {

            return paymentService.rejectPayment(
                    id
            );

        }
        catch (Exception e) {

            e.printStackTrace();

            return e.getMessage();
        }
    }


    // =========================================================
    // DELETE PAYMENT
    // =========================================================

    @DeleteMapping("/delete/{id}")
    public String deletePayment(
            @PathVariable Long id) {

        return paymentService.deletePayment(
                id
        );
    }
}