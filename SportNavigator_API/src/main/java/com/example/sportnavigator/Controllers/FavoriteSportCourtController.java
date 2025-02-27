package com.example.sportnavigator.Controllers;

import com.example.sportnavigator.DTO.FavoriteSportCourtResponse;
import com.example.sportnavigator.Models.User;
import com.example.sportnavigator.Service.FavoriteSportCourtService;
import com.example.sportnavigator.Service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/favorite")
@PreAuthorize("isAuthenticated()")
@Slf4j
public class FavoriteSportCourtController {

    private final FavoriteSportCourtService favoriteSportCourtService;
    private final UserService userService;

    @GetMapping()
    public ResponseEntity<FavoriteSportCourtResponse> findAllByUserId(
                @RequestParam(value = "pageNo", defaultValue = "0", required = false) int pageNo,
                @RequestParam(value = "pageSize", defaultValue = "5", required = false) int pageSize,
                @RequestParam(value = "userId") Long userId) {

        FavoriteSportCourtResponse favoriteSportCourtResponse =
                favoriteSportCourtService.findAllByUserId(userId, pageNo, pageSize);
        return new ResponseEntity<>(favoriteSportCourtResponse, HttpStatus.OK);
    }

    @PostMapping()
    public ResponseEntity<String> addToFavorite(
            @RequestParam(value = "courtId") Long sportCourtId,
            @RequestParam(value = "userId") Long userId) {

        User currentUser = userService.getUserById(userId);
        favoriteSportCourtService.addOrDeleteFromFavorite(currentUser.getId(), sportCourtId);
        String currentStatus = favoriteSportCourtService.isInFavorite(currentUser.getId(), sportCourtId).toString();
        return new ResponseEntity<>(currentStatus, HttpStatus.OK);
    }

    @GetMapping("/verify")
    @ResponseBody()
    public String isInFavorite(@RequestParam(value = "courtId") Long sportCourtId,
                               @RequestParam(value = "userId") Long userId) {
        User currentUser = userService.getUserById(userId);
        return favoriteSportCourtService.isInFavorite(currentUser.getId(), sportCourtId).toString();
    }

}
