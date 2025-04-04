package com.example.sportnavigator.DTO.user;

public record UserChangeNameRequestDto(
        Long id,
        String firstName,
        String lastName
) {
}
