package com.example.sportnavigator.Mapper;

import com.example.sportnavigator.DTO.ReviewDTO;
import com.example.sportnavigator.Models.Review;
import com.example.sportnavigator.Repository.SportCourtRepository;
import com.example.sportnavigator.Service.SportCourtService;
import com.example.sportnavigator.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ReviewMapper {
    private final UserService userService;
    private final SportCourtService sportCourtService;
    public Review ReviewDTOToReview(ReviewDTO reviewDTO) {
        Review review = new Review();
        review.setDescription(reviewDTO.getDescription());
        review.setRating(reviewDTO.getRating());
        review.setUser(userService.getUserById(reviewDTO.getUserID()));
        review.setSportCourt(sportCourtService.getOne(reviewDTO.getSportCourtID()));

        return review;
    }

    public ReviewDTO ReviewToReviewDTO(Review review) {
        ReviewDTO reviewDTO = new ReviewDTO();
        reviewDTO.setDescription(review.getDescription());
        reviewDTO.setRating(review.getRating());
        reviewDTO.setSportCourtID(review.getSportCourt().getId());
        reviewDTO.setUserID(review.getUser().getId());

        return reviewDTO;
    }
}
