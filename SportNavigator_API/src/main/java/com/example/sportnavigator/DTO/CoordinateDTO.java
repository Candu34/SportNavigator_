package com.example.sportnavigator.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CoordinateDTO {

    @JsonProperty
    @NotNull
    private Long id;

    @JsonProperty
    @NotNull
    private double longitude;

    @JsonProperty
    @NotNull
    private double latitude;

    @JsonProperty
    @NotNull
    private Long sportCourtId;

}
