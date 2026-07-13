package com.example.backend.controller;

import com.example.backend.entity.Payment;
import com.example.backend.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payment")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/add")
    public Object addPayment(
            @RequestBody Payment payment) {

        try {

            return paymentService.addPayment(
                    payment
            );

        } catch (Exception e) {

            e.printStackTrace();

            return e.getMessage();
        }
    }

    @GetMapping("/all")
    public List<Payment> getAllPayments() {

        return paymentService.getAllPayments();
    }

    @DeleteMapping("/delete/{id}")
    public String deletePayment(
            @PathVariable Long id) {

        return paymentService.deletePayment(id);
    }
}