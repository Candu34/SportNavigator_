package com.example.sportnavigator.Service;

import com.example.sportnavigator.Models.Event;
import com.example.sportnavigator.Repository.EventRepository;
import com.example.sportnavigator.Utils.Excetions.EventNotFoundException;
import com.example.sportnavigator.Utils.Excetions.UnexpectedDateTimeException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EventService {

    private final EventRepository eventRepository;

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

    public List<Event> findBySportCourtId(Long sportCourtId){
        return eventRepository.getEventsBySportCourtId(sportCourtId);
    }

    public Long countBySportCourtId(Long id){
        return eventRepository.countBySportCourt_Id(id);
    }

    public List<Event> findByUserId(Long UserId){
        return eventRepository.getEventsByUserId(UserId);
    }


}
