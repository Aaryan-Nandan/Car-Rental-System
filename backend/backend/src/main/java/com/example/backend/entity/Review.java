package com.example.backend.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer rating;

    @Column(length = 1000)
    private String review;

    private LocalDate reviewDate;

    @ManyToOne
    private Customer customer;

    @ManyToOne
    private CarVariant carVariant;

    // GETTERS

    public Long getId() {
        return id;
    }

    public Integer getRating() {
        return rating;
    }

    public String getReview() {
        return review;
    }

    public LocalDate getReviewDate() {
        return reviewDate;
    }

    public Customer getCustomer() {
        return customer;
    }

    public CarVariant getCarVariant() {
        return carVariant;
    }

    // SETTERS

    public void setId(Long id) {
        this.id = id;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public void setReview(String review) {
        this.review = review;
    }

    public void setReviewDate(LocalDate reviewDate) {
        this.reviewDate = reviewDate;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public void setCarVariant(CarVariant carVariant) {
        this.carVariant = carVariant;
    }

}