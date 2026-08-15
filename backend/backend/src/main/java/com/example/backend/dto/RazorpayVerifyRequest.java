package com.example.backend.dto;

public class RazorpayVerifyRequest {

    private Long bookingId;

    private String razorpayOrderId;

    private String razorpayPaymentId;

    private String razorpaySignature;


    public RazorpayVerifyRequest() {
    }


    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(
            Long bookingId
    ) {
        this.bookingId =
                bookingId;
    }


    public String getRazorpayOrderId() {
        return razorpayOrderId;
    }

    public void setRazorpayOrderId(
            String razorpayOrderId
    ) {
        this.razorpayOrderId =
                razorpayOrderId;
    }


    public String getRazorpayPaymentId() {
        return razorpayPaymentId;
    }

    public void setRazorpayPaymentId(
            String razorpayPaymentId
    ) {
        this.razorpayPaymentId =
                razorpayPaymentId;
    }


    public String getRazorpaySignature() {
        return razorpaySignature;
    }

    public void setRazorpaySignature(
            String razorpaySignature
    ) {
        this.razorpaySignature =
                razorpaySignature;
    }
}