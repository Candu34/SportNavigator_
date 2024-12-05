package com.example.sportnavigator.Controllers;


import com.example.sportnavigator.DTO.Auth.*;
import com.example.sportnavigator.Mapper.UserMapper;
import com.example.sportnavigator.Models.Authentification.RefreshToken;
import com.example.sportnavigator.Models.User;
import com.example.sportnavigator.Security.jwt.JwtService;
import com.example.sportnavigator.Service.AuthenticationService;
import com.example.sportnavigator.Service.EmailVerificationService;
import com.example.sportnavigator.Service.RefreshTokenService;
import com.example.sportnavigator.Utils.Excetions.AuthenticationException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("api/auth")
@RequiredArgsConstructor
public class AuthenticationController {


    private final JwtService jwtService;
    private final AuthenticationService authenticationService;
    private final EmailVerificationService emailVerificationService;
    private final UserMapper userMapper;
    private final RefreshTokenService refreshTokenService;



    @PostMapping("/signup")
    public ResponseEntity<User> register(@RequestBody @Valid RegisterUserDTO registerUserDto) {
        User registeredUser = authenticationService.signup(registerUserDto);

        if (!registeredUser.isEmailVerified()) {
            emailVerificationService.sendVerificationToken(registeredUser.getId(), registeredUser.getEmail());
        }

        return ResponseEntity.ok(registeredUser);
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponseDTO> authenticate(@RequestBody LoginUserDTO loginUserDto) {
        User authenticatedUser = authenticationService.authenticate(loginUserDto);

        String jwtToken = jwtService.generateToken(authenticatedUser);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(loginUserDto.getEmail());

        JwtResponseDTO jwtResponseDTO =   JwtResponseDTO.builder()
                .accessToken(jwtToken)
                .token(refreshToken.getToken())
                .build();

        return ResponseEntity.ok(jwtResponseDTO);
    }

    @PostMapping("/email/resend-verification")
    public ResponseEntity<Void> resendVerificationLink(@RequestBody String email) {

        System.out.println("Email to recent verification: "+email);

        emailVerificationService.resendVerificationToken(email);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/email/verify")
    public ResponseEntity<UserDTO> verifyEmail(
            @RequestParam("uid") Long userId, @RequestParam("t") String token) {

        final User verifiedUser =
                emailVerificationService.verifyEmail(userId, token);

        return ResponseEntity.ok(userMapper.userToUserDTO(verifiedUser));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().build();
        }

        String token = authHeader.substring(7);
        authenticationService.logout(token);

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/refreshToken")
    public ResponseEntity<JwtResponseDTO> refreshToken(@RequestBody RefreshTokenRequestDTO refreshTokenRequestDTO){
        JwtResponseDTO responseDTO = refreshTokenService.findByToken(refreshTokenRequestDTO.getToken())
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    String accessToken = jwtService.generateToken(user);
                    return JwtResponseDTO.builder()
                            .accessToken(accessToken)
                            .token(refreshTokenRequestDTO.getToken()).build();
                }).orElseThrow(() ->new AuthenticationException("Refresh Token is not in DB..!!"));

        return ResponseEntity.ok(responseDTO);
    }
}
