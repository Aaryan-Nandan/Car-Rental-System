package com.example.backend.controller;

import com.example.backend.entity.Booking;
import com.example.backend.service.BookingService;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/booking")
@CrossOrigin(
        origins = "http://localhost:3000"
)
public class BookingController {

    @Autowired
    private BookingService bookingService;


    // =========================================================
    // CUSTOMER
    // CREATE BOOKING
    //
    // IMPORTANT:
    // Booking is NOT confirmed here.
    //
    // Status:
    // PAYMENT_PENDING
    // =========================================================

    @PostMapping("/add")
    public Object addBooking(
            @RequestBody Booking booking
    ) {

        try {

            return bookingService
                    .addBooking(
                            booking
                    );

        } catch (Exception e) {

            return e.getMessage();
        }
    }


    // =========================================================
    // ADMIN / CUSTOMER
    // =========================================================

    @GetMapping("/all")
    public List<Booking> getAllBookings() {

        return bookingService
                .getAllBookings();
    }


    // =========================================================
    // DELETE
    // =========================================================

    @DeleteMapping(
            "/delete/{id}"
    )
    public String deleteBooking(
            @PathVariable Long id
    ) {

        return bookingService
                .deleteBooking(
                        id
                );
    }


    // =========================================================
    // OLD ADMIN APPROVE ENDPOINT
    //
    // Kept only so your existing project does
    // not break.
    //
    // NEW PAYMENT FLOW DOES NOT USE THIS.
    // =========================================================

    @PutMapping(
            "/approve/{id}"
    )
    public Booking approveBooking(
            @PathVariable Long id
    ) {

        return bookingService
                .approveBooking(
                        id
                );
    }


    // =========================================================
    // ADMIN REJECT BOOKING
    // =========================================================

    @PutMapping(
            "/reject/{id}"
    )
    public Booking rejectBooking(
            @PathVariable Long id
    ) {

        return bookingService
                .rejectBooking(
                        id
                );
    }
}