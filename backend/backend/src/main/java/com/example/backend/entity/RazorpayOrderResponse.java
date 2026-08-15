package com.example.backend.entity;

public class RazorpayOrderResponse {

    private String orderId;

    private String keyId;

    private Integer amount;

    private String currency;

    private Long bookingId;

    public RazorpayOrderResponse() {
    }

    public RazorpayOrderResponse(
            String orderId,
            String keyId,
            Integer amount,
            String currency,
            Long bookingId
    ) {

        this.orderId = orderId;
        this.keyId = keyId;
        this.amount = amount;
        this.currency = currency;
        this.bookingId = bookingId;
    }

    public String getOrderId() {
        return orderId;
    }

    public String getKeyId() {
        return keyId;
    }

    public Integer getAmount() {
        return amount;
    }

    public String getCurrency() {
        return currency;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public void setKeyId(String keyId) {
        this.keyId = keyId;
    }

    public void setAmount(Integer amount) {
        this.amount = amount;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }
}