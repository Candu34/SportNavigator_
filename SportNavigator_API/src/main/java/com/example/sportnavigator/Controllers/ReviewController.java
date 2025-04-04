package com.example.sportnavigator.Controllers;

import com.example.sportnavigator.DTO.ResponeInfo.DataResponse;
import com.example.sportnavigator.DTO.review.RatingData;
import com.example.sportnavigator.DTO.review.ReviewDTO;
import com.example.sportnavigator.Mapper.ReviewMapper;
import com.example.sportnavigator.Models.Review;
import com.example.sportnavigator.Service.ReviewService;
import com.example.sportnavigator.Utils.Excetions.ReviewNotCreatedException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
@RequestMapping("/api/reviews")
public class ReviewController {
    private final ReviewService reviewService;
    private final ReviewMapper reviewMapper;


    @GetMapping()
    public List<ReviewDTO> findAll() {
        List<ReviewDTO> reviewDTOS = new ArrayList<>();
        List<Review> reviews = reviewService.findAll();

        for (Review review : reviews) {
            reviewDTOS.add(reviewMapper.ReviewToReviewDTO(review));
        }
        return reviewDTOS;
    }

    @GetMapping("/{id}")
    public ReviewDTO findOne(@PathVariable Long id) {
        Review review = reviewService.findById(id);
        return reviewMapper.ReviewToReviewDTO(review);
    }

    @PostMapping()
    public ResponseEntity<HttpStatus> save(@RequestBody @Valid ReviewDTO reviewDTO,
                                           BindingResult bindingResult) {
        checkBindingResult(reviewDTO, bindingResult);
        Review review = reviewMapper.ReviewDTOToReview(reviewDTO);
        reviewService.save(review);
        return ResponseEntity.ok(HttpStatus.OK);
    }

    private void checkBindingResult(@RequestBody @Valid ReviewDTO reviewDTO, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            StringBuilder errorMsg = new StringBuilder();

            List<FieldError> errors = bindingResult.getFieldErrors();

            for (FieldError error : errors) {
                errorMsg.append(error.getField())
                        .append(" - ")
                        .append(error.getDefaultMessage())
                        .append(";");
            }

            throw new ReviewNotCreatedException(errorMsg.toString());
        }
    }

    @PutMapping()
    public ResponseEntity<HttpStatus> update(@RequestBody @Valid ReviewDTO reviewDTO,
                                             BindingResult bindingResult){
        checkBindingResult(reviewDTO, bindingResult);
        Review review = reviewMapper.ReviewDTOToReview(reviewDTO);
        review.setId(reviewDTO.getId());
        reviewService.save(review);
        return ResponseEntity.ok(HttpStatus.OK);
    }



    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<HttpStatus> delete(@PathVariable Long id) {
        reviewService.deleteById(id);
        return ResponseEntity.ok(HttpStatus.OK);
    }

    @GetMapping("/user/{userId}")
    public List<ReviewDTO> getReviewsByUserId(@PathVariable Long userId) {
        List<Review> reviews = reviewService.findByUserId(userId);
        List<ReviewDTO> reviewDTOS = new ArrayList<>();
        for (Review review : reviews) {
            reviewDTOS.add(reviewMapper.ReviewToReviewDTO(review));
        }
        return reviewDTOS;
    }

    @GetMapping("/court")
    public ResponseEntity<DataResponse<ReviewDTO>> getReviewsByCourtId(@RequestParam(value = "courtId", required = true) Long courtId,
                                                                       @RequestParam(value = "pageNo", defaultValue = "0", required = false) int pageNo,
                                                                       @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize,
                                                                       @RequestParam(value = "rating", defaultValue = "0") int rating) {

        DataResponse<ReviewDTO> reviewResponse = reviewService.findBySportCourtId(courtId, pageSize, pageNo, rating);
        return new ResponseEntity<>(reviewResponse, HttpStatus.OK);
    }

    @GetMapping("/rating")
    public ResponseEntity<RatingData> getRatingInfo(@RequestParam(value = "courtId") Long courtId) {
        RatingData ratingResponse = reviewService.getReviewInfo(courtId);
        return new ResponseEntity<>(ratingResponse, HttpStatus.OK);
    }

}
