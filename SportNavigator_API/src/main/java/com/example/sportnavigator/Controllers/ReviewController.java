package com.example.sportnavigator.Controllers;

import com.example.sportnavigator.DTO.ReviewDTO;
import com.example.sportnavigator.Mapper.ReviewMapper;
import com.example.sportnavigator.Models.Review;
import com.example.sportnavigator.Service.ReviewService;
import com.example.sportnavigator.Utils.Excetions.ReviewNotCreatedException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reviews")
public class ReviewController {
    private final ReviewService reviewService;
    private final ReviewMapper reviewMapper;


    @GetMapping()
    @ResponseBody()
    public List<ReviewDTO> findAll() {
        List<ReviewDTO> reviewDTOS = new ArrayList<>();
        List<Review> reviews = reviewService.findAll();

        for (Review review : reviews) {
            reviewDTOS.add(reviewMapper.ReviewToReviewDTO(review));
        }
        return reviewDTOS;
    }

    @GetMapping("/{id}")
    @ResponseBody()
    public ReviewDTO findOne(@PathVariable Long id) {
        Review review = reviewService.findById(id);
        return reviewMapper.ReviewToReviewDTO(review);
    }

    @PostMapping()
    public ResponseEntity<HttpStatus> save(@RequestBody @Valid ReviewDTO reviewDTO,
                                           BindingResult bindingResult) {
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
        Review review = reviewMapper.ReviewDTOToReview(reviewDTO);
        reviewService.save(review);
        return ResponseEntity.ok(HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> delete(@PathVariable Long id) {
        reviewService.deleteById(id);
        return ResponseEntity.ok(HttpStatus.OK);
    }

    @GetMapping("/user/{userId}")
    @ResponseBody()
    public List<ReviewDTO> getReviewsByUserId(@PathVariable Long userId) {
        List<Review> reviews = reviewService.findByUserId(userId);
        List<ReviewDTO> reviewDTOS = new ArrayList<>();
        for (Review review : reviews) {
            reviewDTOS.add(reviewMapper.ReviewToReviewDTO(review));
        }
        return reviewDTOS;
    }

    @GetMapping("/court/{courtId}")
    @ResponseBody()
    public List<ReviewDTO> getReviewsByCourtId(@PathVariable Long courtId){
        List<Review> reviews = reviewService.findByUserId(courtId);
        List<ReviewDTO> reviewDTOS = new ArrayList<>();
        for (Review review : reviews) {
            reviewDTOS.add(reviewMapper.ReviewToReviewDTO(review));
        }
        return reviewDTOS;
    }

}
