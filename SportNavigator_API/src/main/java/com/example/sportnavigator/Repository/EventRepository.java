package com.example.sportnavigator.Repository;

import com.example.sportnavigator.Models.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {

    public Page<Event> getEventsBySportCourtId(Long SportCourtId, Pageable pageable);
    public Page<Event> getEventsByUserId(Long userId, Pageable pageable);

    public Long countBySportCourt_Id(Long id);

}
