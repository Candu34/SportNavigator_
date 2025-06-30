package com.example.sportnavigator.DTO.user;

import com.example.sportnavigator.DTO.EncodedImage;

public record UserChangeRequestDto(
        Long id,
        String firstName,
        String lastName,
        EncodedImage image
) {
}
