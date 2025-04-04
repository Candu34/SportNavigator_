package com.example.sportnavigator.DTO.review;


public record RatingResponse(
        Long reviewCount,
        Float averageRating
) {
}
