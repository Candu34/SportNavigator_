package com.example.sportnavigator.DTO.User;

public record RegistrationResponseDTO(
        String email,
        String password,
        boolean emailVerificationRequired ) {
}
