package com.example.sportnavigator.Service;

import com.example.sportnavigator.Models.Event;
import com.example.sportnavigator.Repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EventService {

    private final EventRepository eventRepository;

    @Transactional(readOnly = false)
    public void save(Event event){
        eventRepository.save(event);
    }

    @Transactional(readOnly = false)
    public void delete(Long id){
        eventRepository.deleteById(id);
    }

    public Event findOne(Long id){
        Optional<Event> event = eventRepository.findById(id);
        if(event.isEmpty()){
            //TODO Exception throwing
        }

        return event.get();
    }

    public List<Event> findAll(){
        return eventRepository.findAll();
    }

    public List<Event> findBySportCourtId(Long sportCourtId){
        return eventRepository.getEventsBySportCourtId(sportCourtId);
    }

    public List<Event> findByUserId(Long UserId){
        return eventRepository.getEventsByUserId(UserId);
    }


}
