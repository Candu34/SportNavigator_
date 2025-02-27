package com.example.sportnavigator.Service;


import com.example.sportnavigator.DTO.Auth.LoginUserDTO;
import com.example.sportnavigator.DTO.Auth.RegisterUserDTO;
import com.example.sportnavigator.Models.Enums.RoleEnum;
import com.example.sportnavigator.Models.Authentification.Role;
import com.example.sportnavigator.Models.User;
import com.example.sportnavigator.Repository.RoleRepository;
import com.example.sportnavigator.Repository.UserRepository;
import com.example.sportnavigator.Security.jwt.JwtService;
import com.example.sportnavigator.Service.TokenBlackList.TokenBlackListService;
import com.example.sportnavigator.Utils.Excetions.AuthenticationException;
import com.example.sportnavigator.Utils.Excetions.UserNotVerifiedException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;



@Service
@RequiredArgsConstructor
@Slf4j
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final RoleRepository roleRepository;
    private final TokenBlackListService tokenBlackListService;
    private final RefreshTokenService refreshTokenService;
    private final JwtService jwtService;


    public User signup(RegisterUserDTO input) {
        Optional<Role> optionalRole = roleRepository.findByName(RoleEnum.USER.name());

        if (optionalRole.isEmpty()) {
            return null;
        }

        if (userRepository.existsByEmail(input.getEmail())) {
            throw new UsernameNotFoundException("User with this email already exists");
        }

        User user = new User();
        user.setFirstName(input.getFirstName());
        user.setLastName(input.getLastName());
        user.setEmail(input.getEmail());
        user.setPassword(passwordEncoder.encode(input.getPassword()));
        user.getRoles().add(optionalRole.get());

        log.info("User with mail: {} created", user.getEmail());
        return userRepository.save(user);
    }

    public User authenticate(LoginUserDTO input) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        input.getEmail(),
                        input.getPassword()
                )
        );

        User user = userRepository.findByEmail(input.getEmail()).orElseThrow();
        if (!user.isEmailVerified()) {
            throw new UserNotVerifiedException("You're email is not verified!");
        }

        return user;
    }


    public void logout(HttpServletRequest request) {

        String authTokenHeader = request.getHeader("Authorization");
        if (authTokenHeader == null || !authTokenHeader.startsWith("Bearer ")) {
            throw new AuthenticationException("Invalid or missing Authorization header");
        }

        String token = authTokenHeader.replace("Bearer ", "");

        String userEmail = jwtService.extractUsername(token);
        if (userEmail == null) {
            throw new AuthenticationException("Unable to extract username from token");
        }

        refreshTokenService.deleteByUserEmail(userEmail);

        tokenBlackListService.addToBlacklist(request);
    }

}
