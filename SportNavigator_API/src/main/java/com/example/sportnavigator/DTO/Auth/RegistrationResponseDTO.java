package com.example.sportnavigator.DTO.Auth;

public record RegistrationResponseDTO(
        String email,
        String password,
        boolean emailVerificationRequired ) {
}
