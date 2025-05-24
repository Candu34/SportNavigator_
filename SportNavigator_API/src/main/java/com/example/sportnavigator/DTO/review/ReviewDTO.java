package com.example.sportnavigator.DTO.review;

import com.example.sportnavigator.DTO.user.UserInfoDTO;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReviewDTO {

    private Long id;

    @JsonProperty
    private String description;

    @JsonProperty
    @Min(value = 1, message = "rating should be between 1 and 5")
    @Max(value = 5, message = "rating should be between 1 and 5")
    private int rating;

    private LocalDateTime createdAt;

    @JsonProperty
    private Long userID;

    @JsonProperty
    private Long sportCourtID;

    @JsonProperty
    private UserInfoDTO userInfoDTO;
}
