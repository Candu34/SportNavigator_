package com.example.sportnavigator.Service.TokenBlackList;

import jakarta.servlet.http.HttpServletRequest;

public interface TokenBlackListService {
    void addToBlacklist(HttpServletRequest request);
    boolean isBlacklisted(String token);
}
