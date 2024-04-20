package com.example.sportnavigator.Repository;


import com.example.sportnavigator.Models.Coordinate;
import com.example.sportnavigator.Models.Enums.CourtType;
import com.example.sportnavigator.Models.Enums.Sport;
import com.example.sportnavigator.Models.SportCourt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Set;

@Repository
public interface CoordinateRepository extends JpaRepository<Coordinate, Long> {

   public Coordinate getBySportCourt(SportCourt sportCourt);


   List<Coordinate> findCoordinatesBySportCourt_Sport(Sport sport);
}
