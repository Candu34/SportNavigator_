package com.example.sportnavigator.Controllers;

import com.example.sportnavigator.DTO.FavoriteSportCourtResponse;
import com.example.sportnavigator.Service.FavoriteSportCourtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/favorite")
public class FavoriteSportCourtController {

    private final FavoriteSportCourtService favoriteSportCourtService;

    @GetMapping()
    public ResponseEntity<FavoriteSportCourtResponse> findAllByUserId(
            @RequestParam(value = "userId") Long userId,
            @RequestParam(value = "pageNo", defaultValue = "0", required = false) int pageNo,
            @RequestParam(value = "pageSize", defaultValue = "5", required = false) int pageSize
    ) {
        FavoriteSportCourtResponse favoriteSportCourtResponse =
                favoriteSportCourtService.findAllByUserId(userId, pageNo, pageSize);
        return new ResponseEntity<>(favoriteSportCourtResponse, HttpStatus.OK);
    }

    @PostMapping()
    public ResponseEntity<HttpStatus> addToFavorite(
            @RequestParam(value = "userId") Long userId,
            @RequestParam(value = "courtId") Long sportCourtId) {

        favoriteSportCourtService.addOrDeleteFromFavorite(userId, sportCourtId);

        return new ResponseEntity<>(HttpStatus.OK);
    }


}
