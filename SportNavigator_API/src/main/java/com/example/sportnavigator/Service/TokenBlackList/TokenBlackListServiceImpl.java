package com.example.sportnavigator.Service.TokenBlackList;

import com.example.sportnavigator.Security.jwt.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class TokenBlackListServiceImpl implements TokenBlackListService {


    private final RedisTemplate<String, Object> redisTemplate;

    private final JwtService jwtService;

    @Override
    public void addToBlacklist(HttpServletRequest request) {
        String token = jwtService.extractTokenFromRequest(request);
        Date expiry = jwtService.extractExpiration(token);
        long expiration = expiry.getTime() - System.currentTimeMillis();
        redisTemplate.opsForValue().set(token, "blacklisted", expiration, TimeUnit.MILLISECONDS);
    }


    @Override
    public boolean isBlacklisted(String token) {
        return redisTemplate.hasKey(token);
    }
}
