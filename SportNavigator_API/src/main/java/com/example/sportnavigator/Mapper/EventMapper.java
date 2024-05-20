package com.example.sportnavigator.Mapper;

import com.example.sportnavigator.DTO.EventDTO;
import com.example.sportnavigator.Models.Event;
import com.example.sportnavigator.Models.SportCourt;
import com.example.sportnavigator.Models.User;
import com.example.sportnavigator.Service.SportCourtService;
import com.example.sportnavigator.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Component
@RequiredArgsConstructor
public class EventMapper {

    private final SportCourtService sportCourtService;
    private final UserService userService;

    public Event EnventDTOToEvent(EventDTO eventDTO){
        Event event = new Event();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm");
        SportCourt sportCourt = sportCourtService.getOne((Long)eventDTO.getSportCourtID());
        User user = userService.getUserById((Long)eventDTO.getUserId());
        event.setName(eventDTO.getName());
        event.setDescription(eventDTO.getDescription());
        event.setSportCourt(sportCourt);
        event.setUser(user);
        event.setEvent_time(LocalDateTime.parse(eventDTO.getEvent_time(), formatter));

        return event;
    }

    public EventDTO EventToEventDTO(Event event){
        EventDTO eventDTO = new EventDTO();
        eventDTO.setId(event.getId());
        eventDTO.setName(event.getName());
        eventDTO.setDescription(event.getDescription());
        eventDTO.setSportCourtID(event.getSportCourt().getId());
        eventDTO.setEvent_time(event.getEvent_time().toString());
        eventDTO.setUserId(event.getUser().getId());

        return eventDTO;
    }
}
