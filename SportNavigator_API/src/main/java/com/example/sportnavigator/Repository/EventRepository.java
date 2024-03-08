package com.example.sportnavigator.Repository;

import com.example.sportnavigator.Models.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {

    public List<Event> getEventsBySportCourtId(Long SportCourtId);
    public List<Event> getEventsByUserId(Long userId);

    public void deleteById(Long id);


}
