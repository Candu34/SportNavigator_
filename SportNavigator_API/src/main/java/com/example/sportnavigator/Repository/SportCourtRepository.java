package com.example.sportnavigator.Repository;

import com.example.sportnavigator.Models.Enums.Sport;
import com.example.sportnavigator.Models.SportCourt;
import com.example.sportnavigator.Models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SportCourtRepository extends JpaRepository<SportCourt, Long> {

    public Page<SportCourt> getAllByUser(User user, Pageable pageable);

    public Page<SportCourt> getAllBySport(Sport sport, Pageable pageable);

    public Page<SportCourt> findSportCourtsByCourtType(String courtType, Pageable pageable);

    public Page<SportCourt> findSportCourtsBySportAndCourtType(Sport sport, String courtType, Pageable pageable);

    public Long countAllByUser(User user);

}
