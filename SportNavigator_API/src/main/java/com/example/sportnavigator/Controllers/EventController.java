package com.example.sportnavigator.Controllers;


import com.example.sportnavigator.DTO.Auth.UserDTO;
import com.example.sportnavigator.DTO.EventDTO;
import com.example.sportnavigator.DTO.EventsResponse;
import com.example.sportnavigator.Mapper.EventMapper;
import com.example.sportnavigator.Models.Event;
import com.example.sportnavigator.Repository.EventRepository;
import com.example.sportnavigator.Service.EventService;
import com.example.sportnavigator.Utils.Excetions.EventNotCreatedException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("isAuthenticated()")
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

            throw new EventNotCreatedException(errorMsg.toString());
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
    public ResponseEntity<EventsResponse> findByUserId(@PathVariable Long userId,
                                                       @RequestParam(value = "pageNo", defaultValue = "0", required = false) int pageNo,
                                                       @RequestParam(value = "pageSize", defaultValue = "5", required = false) int pageSize){
        EventsResponse eventsResponse = eventService.findByUserId(userId, pageNo, pageSize);
        return new ResponseEntity<>(eventsResponse, HttpStatus.OK);
    }

    @GetMapping("/court/{courtId}")
    @ResponseBody()
    public ResponseEntity<EventsResponse> findByCourtId(@PathVariable Long courtId,
                                                       @RequestParam(value = "pageNo", defaultValue = "0", required = false) int pageNo,
                                                       @RequestParam(value = "pageSize", defaultValue = "5", required = false) int pageSize){
        EventsResponse eventsResponse = eventService.findBySportCourtId(courtId, pageNo, pageSize);
        return new ResponseEntity<>(eventsResponse, HttpStatus.OK);
    }



    @GetMapping("/count/{sportCourtId}")
    @ResponseBody()
    public Long countBySportCourtId(@PathVariable Long sportCourtId){
        return eventService.countBySportCourtId(sportCourtId);
    }

    @PostMapping("/join/{eventId}")
    public ResponseEntity<HttpStatus> joinEvent(@PathVariable Long eventId, @RequestParam Long userId) {
        log.info("User ID {} joining event ID {}", userId, eventId);
        eventService.joinEvent(eventId, userId);
        return ResponseEntity.ok(HttpStatus.OK);
    }

    @PostMapping("/leave/{eventId}")
    public ResponseEntity<HttpStatus> leaveEvent(@PathVariable Long eventId, @RequestParam Long userId) {
        log.info("User ID {} leaving event ID {}", userId, eventId);
        eventService.leaveEvent(eventId, userId);
        return ResponseEntity.ok(HttpStatus.OK);
    }

    @GetMapping("/participants/{eventId}")
    public ResponseEntity<List<UserDTO>> getEventParticipants(@PathVariable Long eventId) {
        List<UserDTO> participants = eventService.getEventParticipants(eventId);
        return new ResponseEntity<>(participants, HttpStatus.OK);
    }

    @GetMapping("/is-joined/{eventId}")
    public ResponseEntity<Boolean> isUserJoinedEvent(@PathVariable Long eventId, @RequestParam Long userId) {
        boolean isJoined = eventService.isUserJoinedEvent(eventId, userId);
        return new ResponseEntity<>(isJoined, HttpStatus.OK);
    }




}
