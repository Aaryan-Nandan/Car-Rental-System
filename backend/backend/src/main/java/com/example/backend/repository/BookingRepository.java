package com.example.backend.repository;

import com.example.backend.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository
        extends JpaRepository<Booking, Long> {

    long countByBookingStatus(
            String bookingStatus
    );

    // =========================================================
    // CHECK WHETHER A CAR IS USED IN ANY BOOKING
    // =========================================================
    boolean existsByCarId(
            Long carId
    );
}