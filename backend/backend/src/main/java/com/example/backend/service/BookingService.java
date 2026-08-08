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

import java.time.temporal.ChronoUnit;
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

    @Autowired
    private MailService mailService;


    // =========================================================
    // ADD BOOKING
    // =========================================================

    public Booking addBooking(Booking booking) {

        // =====================================================
        // CUSTOMER VALIDATION
        // =====================================================

        if (booking.getCustomer() == null ||
                booking.getCustomer().getId() == null) {

            throw new RuntimeException(
                    "Customer is required"
            );
        }

        Long customerId =
                booking.getCustomer().getId();

        Customer customer =
                customerRepository
                        .findById(customerId)
                        .orElse(null);

        if (customer == null) {

            throw new RuntimeException(
                    "Customer Not Found"
            );
        }


        // =====================================================
        // CAR VARIANT VALIDATION
        // =====================================================

        if (booking.getCarVariant() == null ||
                booking.getCarVariant().getId() == null) {

            throw new RuntimeException(
                    "Car Variant is required"
            );
        }

        Long variantId =
                booking.getCarVariant().getId();

        CarVariant carVariant =
                carVariantRepository
                        .findById(variantId)
                        .orElse(null);

        if (carVariant == null) {

            throw new RuntimeException(
                    "Car Variant Not Found"
            );
        }


        // =====================================================
        // DATE VALIDATION
        // =====================================================

        if (booking.getFromDate() == null ||
                booking.getToDate() == null) {

            throw new RuntimeException(
                    "From Date and To Date are required"
            );
        }

        if (booking.getToDate()
                .isBefore(
                        booking.getFromDate()
                )) {

            throw new RuntimeException(
                    "To Date cannot be before From Date"
            );
        }


        // =====================================================
        // CALCULATE RENTAL DAYS
        // =====================================================

        long days =
                ChronoUnit.DAYS.between(
                        booking.getFromDate(),
                        booking.getToDate()
                ) + 1;


        // =====================================================
        // CALCULATE TOTAL AMOUNT
        // =====================================================

        double totalAmount =
                days *
                        carVariant.getPricePerDay();

        booking.setTotalAmount(
                totalAmount
        );


        // =====================================================
        // SET DATABASE OBJECTS
        // =====================================================

        booking.setCustomer(
                customer
        );

        booking.setCarVariant(
                carVariant
        );

        booking.setBookingStatus(
                "PENDING"
        );


        // =====================================================
        // FIND AVAILABLE CAR
        // =====================================================

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


        // =====================================================
        // ASSIGN CAR TO BOOKING
        // =====================================================

        booking.setCar(
                car
        );


        // =====================================================
        // LICENSE
        // =====================================================

        /*
         * Currently we are not uploading the actual file.
         * We will implement MultipartFile upload separately.
         */

        booking.setLicenseFileName(
                "license.jpg"
        );


        // =====================================================
        // MAKE CAR UNAVAILABLE
        // =====================================================

        car.setAvailable(
                false
        );

        carRepository.save(
                car
        );


        // =====================================================
        // SAVE BOOKING
        // =====================================================

        Booking savedBooking =
                bookingRepository.save(
                        booking
                );


        // =====================================================
        // SEND BOOKING EMAIL
        // =====================================================

        if (customer.getEmail() != null) {

            mailService.sendMail(

                    customer.getEmail(),

                    "Booking Request Received - Car Rental System",

                    "Hello "
                            + customer.getName()

                            + "\n\nYour booking request has been submitted successfully."

                            + "\n\nBooking Status : PENDING"

                            + "\n\nBooking ID : "
                            + savedBooking.getId()

                            + "\n\nCar : "
                            + carVariant.getVariantName()

                            + "\nFuel Type : "
                            + carVariant.getFuelType()

                            + "\nFrom Date : "
                            + booking.getFromDate()

                            + "\nTo Date : "
                            + booking.getToDate()

                            + "\nTotal Amount : Rs. "
                            + booking.getTotalAmount()

                            + "\n\nYour booking is waiting for Admin Approval."

                            + "\n\nThank you for choosing Car Rental System."

            );
        }


        return savedBooking;
    }


    // =========================================================
    // GET ALL BOOKINGS
    // =========================================================

    public List<Booking> getAllBookings() {

        return bookingRepository.findAll();
    }


    // =========================================================
    // DELETE BOOKING
    // =========================================================

    public String deleteBooking(
            Long id) {

        Booking booking =
                bookingRepository
                        .findById(id)
                        .orElse(null);

        if (booking == null) {

            return "Booking Not Found";
        }


        // -----------------------------------------------------
        // If car was assigned to this booking,
        // make it available again.
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


        bookingRepository.deleteById(
                id
        );


        return "Booking Deleted Successfully";
    }


    // =========================================================
    // APPROVE BOOKING
    // =========================================================

    public Booking approveBooking(
            Long id) {

        Booking booking =
                bookingRepository
                        .findById(id)
                        .orElse(null);

        if (booking == null) {

            return null;
        }


        // -----------------------------------------------------
        // Change status
        // -----------------------------------------------------

        booking.setBookingStatus(
                "APPROVED"
        );


        // -----------------------------------------------------
        // Save booking
        // -----------------------------------------------------

        Booking updatedBooking =
                bookingRepository.save(
                        booking
                );


        // -----------------------------------------------------
        // SEND APPROVAL EMAIL
        // -----------------------------------------------------

        if (booking.getCustomer() != null &&
                booking.getCustomer().getEmail() != null) {

            mailService.sendMail(

                    booking.getCustomer().getEmail(),

                    "Booking Approved - Car Rental System",

                    "Hello "
                            + booking.getCustomer().getName()

                            + "\n\nCongratulations!"

                            + "\n\nYour booking has been APPROVED."

                            + "\n\nBooking ID : "
                            + booking.getId()

                            + "\nCar : "
                            + booking.getCarVariant()
                            .getVariantName()

                            + "\nFrom Date : "
                            + booking.getFromDate()

                            + "\nTo Date : "
                            + booking.getToDate()

                            + "\nAmount : Rs. "
                            + booking.getTotalAmount()

                            + "\n\nPlease login and complete your payment."

                            + "\n\nThank you for choosing Car Rental System."

            );
        }


        return updatedBooking;
    }


    // =========================================================
    // REJECT BOOKING
    // =========================================================

    public Booking rejectBooking(
            Long id) {

        Booking booking =
                bookingRepository
                        .findById(id)
                        .orElse(null);

        if (booking == null) {

            return null;
        }


        // -----------------------------------------------------
        // Change status
        // -----------------------------------------------------

        booking.setBookingStatus(
                "REJECTED"
        );


        // -----------------------------------------------------
        // Make assigned car available again
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
        // Save booking
        // -----------------------------------------------------

        Booking updatedBooking =
                bookingRepository.save(
                        booking
                );


        // -----------------------------------------------------
        // SEND REJECTION EMAIL
        // -----------------------------------------------------

        if (booking.getCustomer() != null &&
                booking.getCustomer().getEmail() != null) {

            mailService.sendMail(

                    booking.getCustomer().getEmail(),

                    "Booking Rejected - Car Rental System",

                    "Hello "
                            + booking.getCustomer().getName()

                            + "\n\nWe are sorry."

                            + "\n\nYour booking request has been REJECTED."

                            + "\n\nBooking ID : "
                            + booking.getId()

                            + "\nCar : "
                            + booking.getCarVariant()
                            .getVariantName()

                            + "\n\nPlease try booking another available vehicle."

                            + "\n\nThank you for choosing Car Rental System."

            );
        }


        return updatedBooking;
    }
}