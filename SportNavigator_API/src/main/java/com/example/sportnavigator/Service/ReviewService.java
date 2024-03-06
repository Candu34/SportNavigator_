package com.example.sportnavigator.Service;

import com.example.sportnavigator.Models.Review;
import com.example.sportnavigator.Models.SportCourt;
import com.example.sportnavigator.Models.User;
import com.example.sportnavigator.Repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReviewService {
    private final ReviewRepository reviewRepository;

    @Transactional()
    public void save(Review review) {
        reviewRepository.save(review);
    }

    public List<Review> findBySportCourtId(Long sportCourtId) {
        return reviewRepository.getReviewBySportCourtId(sportCourtId);
    }

    public List<Review> findByUserId(Long userId) {
        return reviewRepository.getReviewByUserId(userId);
    }

    @Transactional()
    public void deleteById(Long id) {
        reviewRepository.deleteById(id);
    }

    public Review findById(Long id) {
        Optional<Review> review = reviewRepository.findById(id);
        if (review.isEmpty()) {
            //TODO Exception throwing
        }

        return review.get();
    }

    public List<Review> findAll() {
        return reviewRepository.findAll();
    }

}
