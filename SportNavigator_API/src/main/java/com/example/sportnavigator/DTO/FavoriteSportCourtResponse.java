package com.example.sportnavigator.DTO;

import com.example.sportnavigator.DTO.ResponeInfo.ResponseInfo;
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
public class FavoriteSportCourtResponse {

    @JsonProperty
    @NotNull(message = "userId should not be null")
    private Long userId;

    @JsonProperty
    private List<SportCourtDTO> favoriteSportCourts;

    @JsonProperty
    private ResponseInfo responseInfo;
}
