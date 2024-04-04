package com.example.sportnavigator.DTO;

import com.example.sportnavigator.Models.SportCourt;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FavoriteSportCourtDTO {

    @JsonProperty
    @NotNull(message = "userId should not be null")
    private Long userId;

    @JsonProperty
    private List<SportCourt> favoriteSportCourts;

}
