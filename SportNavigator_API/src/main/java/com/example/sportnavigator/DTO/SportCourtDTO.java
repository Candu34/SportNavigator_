package com.example.sportnavigator.DTO;


import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class SportCourtDTO {

    @JsonProperty
    private Long id;

    @JsonProperty
    @NotNull
    @Size(min = 2, max = 50, message = "name should be between 2 and 50 characters")
    private String name;

    @JsonProperty
    @NotNull(message = "description should not be empty")
    private String description;

    @JsonProperty
    @NotNull(message = "court type should not be empty")
    private String courtType;

    @JsonProperty
    private List<EncodedImage> images;

    @JsonProperty
    @NotNull
    private Long userID;

    @JsonProperty
    @Min(value = 0 ,  message = "wrong coordinate")
    @Max(value = 90, message = "wrong coordinate")
    private double latitude;

    @Min(value = 0 ,  message = "wrong coordinate")
    @Max(value = 90, message = "wrong coordinate")
    @JsonProperty
    private double longitude;

    @JsonProperty
    @NotNull
    private String sport;

}
