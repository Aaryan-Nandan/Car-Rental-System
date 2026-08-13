package com.example.backend.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import java.time.LocalDate;

@Entity

@JsonPropertyOrder({
        "id",
        "fromDate",
        "toDate",
        "totalAmount",
        "bookingStatus",
        "pickupAddress",
        "pickupLocality",
        "pickupCity",
        "pickupDistrict",
        "pickupState",
        "pickupPincode",
        "pickupLatitude",
        "pickupLongitude"
})

public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate fromDate;

    private LocalDate toDate;

    private Double totalAmount;

    private String licenseFileName;

    private String bookingStatus;


    // =========================================================
    // PICKUP LOCATION
    // =========================================================

    @Column(length = 500)
    private String pickupAddress;

    private String pickupLocality;

    private String pickupCity;

    private String pickupDistrict;

    private String pickupState;

    private String pickupPincode;

    private Double pickupLatitude;

    private Double pickupLongitude;


    // =========================================================
    // CUSTOMER
    // =========================================================

    @ManyToOne
    private Customer customer;


    // =========================================================
    // CAR VARIANT
    // =========================================================

    @ManyToOne
    private CarVariant carVariant;


    // =========================================================
    // ACTUAL CAR
    // =========================================================

    @ManyToOne
    private Car car;


    // =========================================================
    // GETTERS AND SETTERS
    // =========================================================

    public Long getId() {
        return id;
    }


    public LocalDate getFromDate() {
        return fromDate;
    }

    public void setFromDate(LocalDate fromDate) {
        this.fromDate = fromDate;
    }


    public LocalDate getToDate() {
        return toDate;
    }

    public void setToDate(LocalDate toDate) {
        this.toDate = toDate;
    }


    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }


    public String getLicenseFileName() {
        return licenseFileName;
    }

    public void setLicenseFileName(String licenseFileName) {
        this.licenseFileName = licenseFileName;
    }


    public String getBookingStatus() {
        return bookingStatus;
    }

    public void setBookingStatus(String bookingStatus) {
        this.bookingStatus = bookingStatus;
    }


    // =========================================================
    // PICKUP LOCATION GETTERS / SETTERS
    // =========================================================

    public String getPickupAddress() {
        return pickupAddress;
    }

    public void setPickupAddress(String pickupAddress) {
        this.pickupAddress = pickupAddress;
    }


    public String getPickupLocality() {
        return pickupLocality;
    }

    public void setPickupLocality(String pickupLocality) {
        this.pickupLocality = pickupLocality;
    }


    public String getPickupCity() {
        return pickupCity;
    }

    public void setPickupCity(String pickupCity) {
        this.pickupCity = pickupCity;
    }


    public String getPickupDistrict() {
        return pickupDistrict;
    }

    public void setPickupDistrict(String pickupDistrict) {
        this.pickupDistrict = pickupDistrict;
    }


    public String getPickupState() {
        return pickupState;
    }

    public void setPickupState(String pickupState) {
        this.pickupState = pickupState;
    }


    public String getPickupPincode() {
        return pickupPincode;
    }

    public void setPickupPincode(String pickupPincode) {
        this.pickupPincode = pickupPincode;
    }


    public Double getPickupLatitude() {
        return pickupLatitude;
    }

    public void setPickupLatitude(Double pickupLatitude) {
        this.pickupLatitude = pickupLatitude;
    }


    public Double getPickupLongitude() {
        return pickupLongitude;
    }

    public void setPickupLongitude(Double pickupLongitude) {
        this.pickupLongitude = pickupLongitude;
    }


    // =========================================================
    // CUSTOMER
    // =========================================================

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }


    // =========================================================
    // CAR VARIANT
    // =========================================================

    public CarVariant getCarVariant() {
        return carVariant;
    }

    public void setCarVariant(CarVariant carVariant) {
        this.carVariant = carVariant;
    }


    // =========================================================
    // CAR
    // =========================================================

    public Car getCar() {
        return car;
    }

    public void setCar(Car car) {
        this.car = car;
    }
}