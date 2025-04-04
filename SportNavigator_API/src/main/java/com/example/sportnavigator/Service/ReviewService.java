package com.example.sportnavigator.Service;

import com.example.sportnavigator.DTO.ResponeInfo.DataResponse;
import com.example.sportnavigator.DTO.ResponeInfo.ResponseInfo;
import com.example.sportnavigator.DTO.review.ReviewDTO;
import com.example.sportnavigator.Mapper.ReviewMapper;
import com.example.sportnavigator.Models.Review;
import com.example.sportnavigator.Models.SportCourt;
import com.example.sportnavigator.Repository.ReviewRepository;
import com.example.sportnavigator.Utils.Excetions.ReviewNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final ReviewMapper reviewMapper;

    @Transactional()
    public void save(Review review) {
        reviewRepository.save(review);
    }

    public DataResponse<ReviewDTO> findBySportCourtId(Long sportCourtId, int pageSize, int pageNo) {
        Pageable pageable = PageRequest.of(pageNo, pageSize);
        Page<Review> reviewsPage = reviewRepository.getReviewBySportCourtId(sportCourtId, pageable);
        ResponseInfo responseInfo = new ResponseInfo();
        DataResponse<ReviewDTO> reviewResponse = new DataResponse<>();
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

}
