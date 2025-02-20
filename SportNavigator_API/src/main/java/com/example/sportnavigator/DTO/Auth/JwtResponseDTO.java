package com.example.sportnavigator.DTO.Auth;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Service
@Builder
public class JwtResponseDTO {

    private String accessToken;
    private String refreshToken;
    private UserDTO user;

}
