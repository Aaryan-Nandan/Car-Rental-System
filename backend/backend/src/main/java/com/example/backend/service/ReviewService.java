package com.example.backend.service;

import com.example.backend.entity.CarVariant;
import com.example.backend.entity.Customer;
import com.example.backend.entity.Review;
import com.example.backend.repository.CarVariantRepository;
import com.example.backend.repository.CustomerRepository;
import com.example.backend.repository.ReviewRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private CarVariantRepository carVariantRepository;

    // ADD REVIEW
    public Review addReview(
            Review review) {

        Long customerId =
                review.getCustomer().getId();

        Long variantId =
                review.getCarVariant().getId();

        Customer customer =
                customerRepository
                        .findById(customerId)
                        .orElse(null);

        CarVariant carVariant =
                carVariantRepository
                        .findById(variantId)
                        .orElse(null);

        if (customer == null ||
                carVariant == null) {

            return null;
        }

        review.setCustomer(customer);

        review.setCarVariant(carVariant);

        review.setReviewDate(
                LocalDate.now()
        );

        return reviewRepository.save(
                review
        );
    }

    // GET ALL REVIEWS
    public List<Review> getAllReviews() {

        return reviewRepository.findAll();
    }

    // GET REVIEWS BY CUSTOMER
    public List<Review> getReviewsByCustomer(
            Long customerId) {

        return reviewRepository
                .findByCustomerId(
                        customerId
                );
    }

    // GET REVIEWS BY CAR VARIANT
    public List<Review> getReviewsByVariant(
            Long variantId) {

        return reviewRepository
                .findByCarVariantId(
                        variantId
                );
    }

    // DELETE REVIEW
    public String deleteReview(
            Long id) {

        reviewRepository.deleteById(id);

        return "Review Deleted Successfully";
    }

}