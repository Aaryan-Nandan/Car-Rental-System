package com.example.backend.repository;

import com.example.backend.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository
        extends JpaRepository<Review, Long> {

    List<Review> findByCarVariantId(
            Long carVariantId
    );

    List<Review> findByCustomerId(
            Long customerId
    );
}
