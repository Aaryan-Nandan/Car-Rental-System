package com.example.backend.service;

import com.example.backend.entity.Booking;
import com.example.backend.entity.Car;
import com.example.backend.entity.CarVariant;
import com.example.backend.entity.Customer;
import com.example.backend.repository.BookingRepository;
import com.example.backend.repository.CarRepository;
import com.example.backend.repository.CarVariantRepository;
import com.example.backend.repository.CustomerRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private CarVariantRepository carVariantRepository;

    @Autowired
    private CarRepository carRepository;

    // ADD BOOKING
    public Booking addBooking(Booking booking) {

        Long customerId =
                booking.getCustomer().getId();

        Customer customer =
                customerRepository
                        .findById(customerId)
                        .orElse(null);

        Long variantId =
                booking.getCarVariant().getId();

        CarVariant carVariant =
                carVariantRepository
                        .findById(variantId)
                        .orElse(null);

        booking.setCustomer(customer);

        booking.setCarVariant(carVariant);

        booking.setBookingStatus("PENDING");

        booking.setLicenseFileName(
                "license.jpg"
        );

        Car car =
                carRepository
                        .findFirstByCarVariantIdAndAvailableTrue(
                                variantId
                        );

        if (car == null) {

            throw new RuntimeException(
                    "No Cars Available"
            );
        }

        booking.setCar(car);

        car.setAvailable(false);

        carRepository.save(car);

        return bookingRepository.save(
                booking
        );
    }

    // GET ALL BOOKINGS
    public List<Booking> getAllBookings() {

        return bookingRepository.findAll();
    }

    // DELETE BOOKING
    public String deleteBooking(Long id) {

        bookingRepository.deleteById(id);

        return "Booking Deleted Successfully";
    }

    // APPROVE BOOKING
    public Booking approveBooking(Long id) {

        Booking booking =
                bookingRepository
                        .findById(id)
                        .orElse(null);

        if (booking == null) {

            return null;
        }

        booking.setBookingStatus(
                "APPROVED"
        );

        return bookingRepository.save(
                booking
        );
    }

    // REJECT BOOKING
    public Booking rejectBooking(Long id) {

        Booking booking =
                bookingRepository
                        .findById(id)
                        .orElse(null);

        if (booking == null) {

            return null;
        }

        booking.setBookingStatus(
                "REJECTED"
        );

        if (booking.getCar() != null) {

            Car car =
                    booking.getCar();

            car.setAvailable(true);

            carRepository.save(car);
        }

        return bookingRepository.save(
                booking
        );
    }
}