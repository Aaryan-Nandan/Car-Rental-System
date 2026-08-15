package com.example.backend.dto;

public class RazorpayOrderResponse {

    private Long bookingId;

    private Long paymentId;

    private String razorpayOrderId;

    private String keyId;

    private Double amount;

    private String currency;


    public RazorpayOrderResponse() {
    }


    public RazorpayOrderResponse(
            Long bookingId,
            Long paymentId,
            String razorpayOrderId,
            String keyId,
            Double amount,
            String currency
    ) {

        this.bookingId =
                bookingId;

        this.paymentId =
                paymentId;

        this.razorpayOrderId =
                razorpayOrderId;

        this.keyId =
                keyId;

        this.amount =
                amount;

        this.currency =
                currency;
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


    public Long getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(
            Long paymentId
    ) {
        this.paymentId =
                paymentId;
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


    public String getKeyId() {
        return keyId;
    }

    public void setKeyId(
            String keyId
    ) {
        this.keyId =
                keyId;
    }


    public Double getAmount() {
        return amount;
    }

    public void setAmount(
            Double amount
    ) {
        this.amount =
                amount;
    }


    public String getCurrency() {
        return currency;
    }

    public void setCurrency(
            String currency
    ) {
        this.currency =
                currency;
    }
}