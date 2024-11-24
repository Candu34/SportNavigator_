package com.example.sportnavigator.Repository;

import com.example.sportnavigator.Models.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    public List<Review> getReviewBySportCourtId(Long sportCourtId);
    public List<Review> getReviewByUserId(Long userID);

}
