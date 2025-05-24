package com.example.sportnavigator.Service;

import com.example.sportnavigator.DTO.ResponeInfo.DataResponse;
import com.example.sportnavigator.DTO.ResponeInfo.ResponseInfo;
import com.example.sportnavigator.DTO.review.RatingData;
import com.example.sportnavigator.DTO.review.ReviewDTO;
import com.example.sportnavigator.Mapper.ReviewMapper;
import com.example.sportnavigator.Models.Review;
import com.example.sportnavigator.Repository.ReviewRepository;
import com.example.sportnavigator.Utils.Excetions.ReviewNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final ReviewMapper reviewMapper;

    @Transactional()
    public void save(Review review) {
        reviewRepository.save(review);
    }

    public DataResponse<ReviewDTO> findBySportCourtId(Long sportCourtId, int pageSize, int pageNo, int rating) {
        Pageable pageable = PageRequest.of(pageNo, pageSize);
        Page<Review> reviewsPage;
        if (rating == 0) {
            reviewsPage = reviewRepository.getReviewBySportCourtId(sportCourtId, pageable);
        } else {
            reviewsPage = reviewRepository.getReviewBySportCourtIdAndRating(sportCourtId, rating, pageable);
        }
        ResponseInfo responseInfo = new ResponseInfo();
        DataResponse<ReviewDTO> reviewResponse = new DataResponse<>();
        log.info("Reviews found {} for court {}", reviewsPage.get().count(), sportCourtId);
        log.info("Review Page has content: {}", reviewsPage.hasContent());
        if (!reviewsPage.hasContent()) {
            responseInfo.setPageNo(0);
            responseInfo.setPageSize(0);
            reviewResponse.setResponseInfo(responseInfo);
            reviewResponse.setData(null);
            return reviewResponse;
        }

        List<ReviewDTO> reviewDTOS = new ArrayList<>();
        for (Review review : reviewsPage.getContent()) {
            ReviewDTO reviewDTO = reviewMapper.ReviewToReviewDTO(review);
            reviewDTOS.add(reviewDTO);
        }
        reviewResponse.setData(reviewDTOS);
        responseInfo.setLast(reviewsPage.isLast());
        responseInfo.setTotalPages(reviewsPage.getTotalPages());
        responseInfo.setTotalElements(reviewsPage.getTotalElements());
        responseInfo.setPageSize(reviewsPage.getSize());
        responseInfo.setPageNo(reviewsPage.getNumber());

        reviewResponse.setResponseInfo(responseInfo);
        return reviewResponse;
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
            throw new ReviewNotFoundException("Review with this id wasn't found");
        }

        return review.get();
    }

    public List<Review> findAll() {
        return reviewRepository.findAll();
    }

    public RatingData getReviewInfo(Long courtId) {
        Long noOfReviews = reviewRepository.countAllBySportCourtId(courtId);
        Double sumOfRatings = reviewRepository.getTotalAmountSum(courtId);

        if (noOfReviews == 0 || sumOfRatings == null) {
            return new RatingData(0L, 0F);
        }

        Float averageRating = BigDecimal.valueOf(sumOfRatings / noOfReviews)
                .setScale(1, RoundingMode.HALF_UP)
                .floatValue();
        return new RatingData(noOfReviews, averageRating);
    }


}
