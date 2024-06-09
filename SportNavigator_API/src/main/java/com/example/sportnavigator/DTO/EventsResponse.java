package com.example.sportnavigator.DTO;
import com.example.sportnavigator.DTO.ResponeInfo.ResponseInfo;
import com.example.sportnavigator.Models.Event;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EventsResponse {

    @JsonProperty
    private List<EventDTO> eventsDTO;

    @JsonProperty
    private ResponseInfo responseInfo;

}
