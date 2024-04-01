package com.example.sportnavigator.Repository;

import com.example.sportnavigator.Models.Enums.CourtType;
import com.example.sportnavigator.Models.Enums.Sport;
import com.example.sportnavigator.Models.SportCourt;
import com.example.sportnavigator.Models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface SportCourtRepository extends JpaRepository<SportCourt, Long> {

    public List<SportCourt> getAllByUser(User user);

    public List<SportCourt> getAllBySport(String sport);
    public List<SportCourt> findSportCourtsByCourtType(String courtType);

    public List<SportCourt> findSportCourtsBySportAndCourtType(String sport, String courtType);


}
