package com.example.sportnavigator.Controllers;


import com.example.sportnavigator.DTO.EventDTO;
import com.example.sportnavigator.Mapper.EventMapper;
import com.example.sportnavigator.Models.Event;
import com.example.sportnavigator.Service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;
    private final EventMapper eventMapper;

    @PostMapping()
    public ResponseEntity<HttpStatus> save(@RequestBody @Valid EventDTO eventDTO,
                                           BindingResult bindingResult){
        if (bindingResult.hasErrors()) {
            StringBuilder errorMsg = new StringBuilder();

            List<FieldError> errors = bindingResult.getFieldErrors();

            for (FieldError error : errors) {
                errorMsg.append(error.getField())
                        .append(" - ")
                        .append(error.getDefaultMessage())
                        .append(";");
            }

            //TODO Exceptions throwing
        }

        eventService.save(eventMapper.EnventDTOToEvent(eventDTO));
        return ResponseEntity.ok(HttpStatus.OK);
    }

    @GetMapping()
    @ResponseBody()
    public List<EventDTO> findAll(){
        List<Event> events = eventService.findAll();
        List<EventDTO> eventDTOS = new ArrayList<>();

        for (Event event: events) {
            eventDTOS.add(eventMapper.EventToEventDTO(
                    event
            ));
        }
        return eventDTOS;
    }

    @GetMapping("/{id}")
    @ResponseBody()
    public EventDTO findOne(@PathVariable Long id){
        return eventMapper.EventToEventDTO(
                eventService.findOne(id));
    }

    @GetMapping("/user/{userId}")
    @ResponseBody()
    public List<EventDTO> findByUserId(@PathVariable Long userId){
        List<Event> events = eventService.findByUserId(userId);
        List<EventDTO> eventDTOS = new ArrayList<>();
        for (Event event : events) {
            eventDTOS.add(eventMapper.EventToEventDTO(event));
        }
        return eventDTOS;
    }

    @GetMapping("/sportCourt/{sportCourtId}")
    @ResponseBody()
    public List<EventDTO> findBySportCourtId(@PathVariable Long sportCourtId){
        List<Event> events = eventService.findBySportCourtId(sportCourtId);
        List<EventDTO> eventDTOS = new ArrayList<>();
        for (Event event : events) {
            eventDTOS.add(eventMapper.EventToEventDTO(event));
        }

        return eventDTOS;
    }



}
