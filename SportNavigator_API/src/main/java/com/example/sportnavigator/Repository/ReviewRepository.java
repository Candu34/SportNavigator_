package com.example.sportnavigator.Repository;

import com.example.sportnavigator.Models.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    public Page<Review> getReviewBySportCourtId(Long sportCourtId,  Pageable pageable);
    public Page<Review> getReviewBySportCourtIdAndRating(Long sportCourtId, int rating, Pageable pageable);

    public List<Review> getReviewByUserId(Long userID);

    public Long countAllBySportCourtId(Long sportCourtId);

    @Query("SELECT SUM(o.rating) FROM Review o WHERE o.sportCourt.id = :courtId")
    Double getTotalAmountSum(@Param("courtId") Long courtId);

}
