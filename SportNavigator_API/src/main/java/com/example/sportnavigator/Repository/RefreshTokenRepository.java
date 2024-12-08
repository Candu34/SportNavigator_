package com.example.sportnavigator.Repository;

import com.example.sportnavigator.Models.Authentification.RefreshToken;
import com.example.sportnavigator.Models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

        Optional<RefreshToken> findByToken(String token);
        Boolean existsByUser(User user);
        void deleteByUserId(Long userId);
        void deleteByUserEmail(String email);
}
