package com.example.sportnavigator.DTO.review;

public record ReviewResponseDTO(
        Long courtId,

        Long userId,

        String description,

        int rating
) {
}
