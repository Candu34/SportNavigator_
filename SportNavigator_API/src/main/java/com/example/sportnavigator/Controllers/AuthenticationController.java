package com.example.sportnavigator.Controllers;


import com.example.sportnavigator.DTO.ResponeInfo.LoginResponse;
import com.example.sportnavigator.DTO.User.LoginUserDTO;
import com.example.sportnavigator.DTO.User.RegisterUserDTO;
import com.example.sportnavigator.DTO.User.UserDTO;
import com.example.sportnavigator.Mapper.UserMapper;
import com.example.sportnavigator.Models.User;
import com.example.sportnavigator.Security.jwt.JwtService;
import com.example.sportnavigator.Service.AuthenticationService;
import com.example.sportnavigator.Service.EmailVerificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("api/auth")
@RequiredArgsConstructor
public class AuthenticationController {


    private final JwtService jwtService;
    private final AuthenticationService authenticationService;
    private final EmailVerificationService emailVerificationService;
    private final UserMapper userMapper;



    @PostMapping("/signup")
    public ResponseEntity<User> register(@RequestBody @Valid RegisterUserDTO registerUserDto) {
        User registeredUser = authenticationService.signup(registerUserDto);

        if (!registeredUser.isEmailVerified()) {
            emailVerificationService.sendVerificationToken(registeredUser.getId(), registeredUser.getEmail());
        }

        return ResponseEntity.ok(registeredUser);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticate(@RequestBody LoginUserDTO loginUserDto) {
        User authenticatedUser = authenticationService.authenticate(loginUserDto);

        String jwtToken = jwtService.generateToken(authenticatedUser);

        LoginResponse loginResponse = new LoginResponse();
        loginResponse.setToken(jwtToken);
        loginResponse.setExpiresIn(jwtService.getExpirationTime());

        return ResponseEntity.ok(loginResponse);
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
}
