package com.example.sportnavigator.Mapper;

import com.example.sportnavigator.DTO.review.ReviewDTO;
import com.example.sportnavigator.DTO.user.UserInfoDTO;
import com.example.sportnavigator.Models.Review;
import com.example.sportnavigator.Service.SportCourtService;
import com.example.sportnavigator.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ReviewMapper {
    private final UserService userService;
    private final UserMapper userMapper;

    public Review ReviewDTOToReview(ReviewDTO reviewDTO) {
        Review review = new Review();
        review.setDescription(reviewDTO.getDescription());
        review.setRating(reviewDTO.getRating());
        review.setUser(userService.getUserById(reviewDTO.getUserID()));

        return review;
    }

    public ReviewDTO ReviewToReviewDTO(Review review) {
        UserInfoDTO userInfoDTO = userMapper.userToUserInfoDTO(review.getUser());
        ReviewDTO reviewDTO = new ReviewDTO();
        reviewDTO.setId(review.getId());
        reviewDTO.setDescription(review.getDescription());
        reviewDTO.setRating(review.getRating());
        reviewDTO.setCreatedAt(review.getCreatedAt());
        reviewDTO.setUserInfoDTO(userInfoDTO);

        return reviewDTO;
    }
}
