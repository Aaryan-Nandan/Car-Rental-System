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

    @Autowired
    private MailService mailService;

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

        Booking savedBooking =
                bookingRepository.save(
                        booking
                );

        // SEND EMAIL TO CUSTOMER

        if (customer != null) {

            mailService.sendMail(

                    customer.getEmail(),

                    "Booking Request Received - Car Rental System",

                    "Hello "
                            + customer.getName()

                            + "\n\nYour booking request has been submitted successfully."

                            + "\n\nBooking Status : PENDING"

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

        Booking updatedBooking =
                bookingRepository.save(
                        booking
                );

        // SEND APPROVAL EMAIL

        if (booking.getCustomer() != null) {

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
                            + booking.getCarVariant().getVariantName()

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

        Booking updatedBooking =
                bookingRepository.save(
                        booking
                );

        // SEND REJECTION EMAIL

        if (booking.getCustomer() != null) {

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
                            + booking.getCarVariant().getVariantName()

                            + "\n\nPlease try booking another available vehicle."

                            + "\n\nThank you for choosing Car Rental System."

            );

        }

        return updatedBooking;

    }

}