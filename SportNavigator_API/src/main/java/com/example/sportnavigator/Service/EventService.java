package com.example.sportnavigator.Service;

import com.example.sportnavigator.DTO.Auth.UserDTO;
import com.example.sportnavigator.DTO.EventDTO;
import com.example.sportnavigator.DTO.EventsResponse;
import com.example.sportnavigator.DTO.ResponeInfo.ResponseInfo;
import com.example.sportnavigator.Mapper.EventMapper;
import com.example.sportnavigator.Mapper.UserMapper;
import com.example.sportnavigator.Models.Event;
import com.example.sportnavigator.Models.User;
import com.example.sportnavigator.Repository.EventRepository;
import com.example.sportnavigator.Repository.UserRepository;
import com.example.sportnavigator.Utils.Excetions.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.util.ArrayUtils;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class EventService {

    private final EventRepository eventRepository;
    private final EventMapper eventMapper;
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Transactional(readOnly = false)
    public void save(Event event){ LocalDateTime now = LocalDateTime.now();
        if (now.isAfter(event.getEvent_time())){
            throw new UnexpectedDateTimeException("The time of the event should be after the current date and time");
        }

        eventRepository.save(event);
    }

    @Transactional(readOnly = false)
    public void delete(Long id){
        eventRepository.deleteById(id);
    }

    public Event findOne(Long id){
        Optional<Event> event = eventRepository.findById(id);
        if(event.isEmpty()){
            throw new EventNotFoundException("Event with this id wasn't found!");
        }

        return event.get();
    }

    public List<Event> findAll(){
        return eventRepository.findAll();
    }

    public EventsResponse findBySportCourtId(Long sportCourtId, int pageNo, int pageSize){
        Pageable pageable = PageRequest.of(pageNo, pageSize);
        ResponseInfo responseInfo = new ResponseInfo();
        Page<Event> eventsPage = eventRepository.getEventsBySportCourtId(sportCourtId, pageable);
        return getEventsResponse(responseInfo, eventsPage);
    }

    public Long countBySportCourtId(Long id){
        return eventRepository.countBySportCourt_Id(id);
    }

    public EventsResponse findByUserId(Long userId, int pageNo, int pageSize){
        Pageable pageable = PageRequest.of(pageNo, pageSize);
        ResponseInfo responseInfo = new ResponseInfo();
        Page<Event> eventsPage = eventRepository.getEventsByUserId(userId, pageable);
        return getEventsResponse(responseInfo, eventsPage);
    }

    private EventsResponse getEventsResponse(ResponseInfo responseInfo, Page<Event> eventsPage) {
        EventsResponse eventsResponse = new EventsResponse();
        List<EventDTO> eventDTOS = eventsPage.stream()
                .map(eventMapper::EventToEventDTO)
                .toList();

        responseInfo.setPageNo(eventsPage.getNumber());
        responseInfo.setPageSize(eventsPage.getSize());
        responseInfo.setTotalElements(eventsPage.getTotalElements());
        responseInfo.setLast(eventsPage.isLast());
        responseInfo.setTotalPages(eventsPage.getTotalPages());
        responseInfo.setLast(eventsPage.isLast());
        eventsResponse.setEventsDTO(eventDTOS);
        eventsResponse.setResponseInfo(responseInfo);


        return eventsResponse;
    }

    @Transactional()
    public void joinEvent(Long eventId, Long userId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EventNotFoundException("Event not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        if (event.getParticipants().contains(user)) {
            throw new EventUserAlreadyJoined("Already joined");
        }
        if (event.getParticipants().size() >= event.getMaxParticipants()) {
            throw new EventFullException("Event is full");
        }

        log.info("BEFORE: Participants: " + event.getParticipants());
        event.getParticipants().add(user);
        log.info("AFTER: Participants: " + event.getParticipants());
        eventRepository.save(event);
    }

    @Transactional()
    public void leaveEvent(Long eventId, Long userId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!event.getParticipants().contains(user)) {
            throw new EventUserIsNotParticipantException("User is not a participant");
        }
        event.getParticipants().remove(user);
        eventRepository.save(event);
    }

    public Integer countParticipants(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EventNotFoundException("Event not found"));
        return event.getParticipants().size();
    }



    public Long countByUserId(Long userId){
        return eventRepository.countByUserId(userId);
    }


    public List<UserDTO> getEventParticipants(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EventNotFoundException("Event not found"));

        if (event.getParticipants().isEmpty()) {
            return Arrays.asList();
        }

        return event.getParticipants().stream()
                .map(userMapper::userToUserDTO)
                .toList();
    }

    public Boolean isParticipant(Long eventId, Long userId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EventNotFoundException("Event not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        return event.getParticipants().contains(user);
    }

    public boolean isUserJoinedEvent(Long eventId, Long userId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EventNotFoundException("Event not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        return event.getParticipants().stream()
                .anyMatch(participant -> participant.getId().equals(user.getId()));
    }
}
