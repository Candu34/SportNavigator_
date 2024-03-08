package com.example.sportnavigator.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EventDTO {

    @JsonProperty
    private Long id;

    @JsonProperty
    @NotNull
    @Size(min = 4, max = 255, message = "Name should be between 4 and 255 characters")
    private String name;

    @JsonProperty
    @NotNull
    private String description;

    @JsonProperty
    @NotNull
    private Long sportCourtID;

    @JsonProperty
    @NotNull
    private Long UserId;

    @JsonProperty
    @NotNull
    private String event_time;



}
