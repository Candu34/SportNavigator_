package com.example.sportnavigator.Service;


import com.example.sportnavigator.Models.Authentification.RefreshToken;
import com.example.sportnavigator.Models.User;
import com.example.sportnavigator.Repository.RefreshTokenRepository;
import com.example.sportnavigator.Repository.UserRepository;
import com.example.sportnavigator.Utils.Excetions.UserNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    private final UserRepository userRepository;

    @Value("${auth.refresh-token.expirationInMils}")
    private long EXPIRATION_TIME;

    @Transactional()
    public RefreshToken createRefreshToken(String email){
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            throw new UserNotFoundException("User with email: " + email + " not found!");
        }
        User user = optionalUser.get();

        refreshTokenRepository.deleteByUserEmail(user.getEmail());

        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusMillis(EXPIRATION_TIME))
                .build();
        return refreshTokenRepository.save(refreshToken);
    }


    public Optional<RefreshToken> findByToken(String token){
        return refreshTokenRepository.findByToken(token);
    }

    public RefreshToken verifyExpiration(RefreshToken token){
        if(token.getExpiryDate().compareTo(Instant.now())<0){
            refreshTokenRepository.delete(token);
            throw new RuntimeException(token.getToken() + " Refresh token is expired. Please make a new login..!");
        }
        return token;
    }

    public RefreshToken save(RefreshToken refreshToken){
        return refreshTokenRepository.save(refreshToken);
    }

    public void deleteById(Long id){
        refreshTokenRepository.deleteById(id);
    }

    @Transactional()
    public void deleteByUserEmail(String userEmail){
        refreshTokenRepository.deleteByUserEmail(userEmail);
    }


}
