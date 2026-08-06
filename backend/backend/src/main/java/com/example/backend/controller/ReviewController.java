package com.example.backend.controller;

import com.example.backend.entity.Review;
import com.example.backend.service.ReviewService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/review")
@CrossOrigin(origins = "http://localhost:3000")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    // ADD REVIEW
    @PostMapping("/add")
    public Review addReview(
            @RequestBody Review review) {

        return reviewService.addReview(
                review
        );
    }

    // GET ALL REVIEWS
    @GetMapping("/all")
    public List<Review> getAllReviews() {

        return reviewService.getAllReviews();
    }

    // GET REVIEWS BY CUSTOMER
    @GetMapping("/customer/{id}")
    public List<Review> getReviewsByCustomer(
            @PathVariable Long id) {

        return reviewService
                .getReviewsByCustomer(id);
    }

    // GET REVIEWS BY CAR VARIANT
    @GetMapping("/variant/{id}")
    public List<Review> getReviewsByVariant(
            @PathVariable Long id) {

        return reviewService
                .getReviewsByVariant(id);
    }

    // DELETE REVIEW
    @DeleteMapping("/delete/{id}")
    public String deleteReview(
            @PathVariable Long id) {

        return reviewService
                .deleteReview(id);
    }

}