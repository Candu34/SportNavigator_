package com.example.sportnavigator.Service;


import com.example.sportnavigator.DTO.CoordinateDTO;
import com.example.sportnavigator.Mapper.CoordinateMapper;
import com.example.sportnavigator.Models.Coordinate;
import com.example.sportnavigator.Models.Enums.Sport;
import com.example.sportnavigator.Models.SportCourt;
import com.example.sportnavigator.Repository.CoordinateRepository;
import com.example.sportnavigator.Utils.Excetions.WrongCoordinateRangeException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CoordinateService {

    private final CoordinateRepository coordinateRepository;
    private final CoordinateMapper coordinateMapper;

    public Coordinate getById(Long id){
        Optional<Coordinate> coordinate = coordinateRepository.findById(id);

        if(coordinate.isEmpty()){
            //TODO Exception Throwing
        }

        return coordinate.get();
    }

    public List<CoordinateDTO> findAll(){
        List<CoordinateDTO> coordinateDTOS = new ArrayList<>();
        List<Coordinate> coordinates = coordinateRepository.findAll();

        for (Coordinate coordinate: coordinates) {
            coordinateDTOS.add(coordinateMapper.coordinateToCoordinateDTO(
                    coordinate
            ));
        }
        return coordinateDTOS;
    }

    public Coordinate findBySportCourt(SportCourt sportCourt){
        return coordinateRepository.getBySportCourt(sportCourt);
    }

    @Transactional(readOnly = false)
    public void save(Coordinate coordinate){
        if (coordinate.getLatitude() > 31.0 | coordinate.getLatitude() < 21.0
            | coordinate.getLongitude() > 49.0 | coordinate.getLongitude() < 43.0){
            throw new WrongCoordinateRangeException("Coordinate outside the app perimeter");
        } else {
            coordinateRepository.save(coordinate);
        }
    }

    @Transactional(readOnly = false)
    public void delete(Long coordinateId){
        coordinateRepository.deleteById(coordinateId);
    }

    public List<CoordinateDTO> findAllBySportCourtSport(String sport){
        List<CoordinateDTO> coordinateDTOS = new ArrayList<>();
        List<Coordinate> coordinates = coordinateRepository
                .findCoordinatesBySportCourt_Sport(Sport.valueOf(sport.toUpperCase()));

        for (Coordinate coordinate: coordinates) {
            coordinateDTOS.add(coordinateMapper.coordinateToCoordinateDTO(
                    coordinate
            ));
        }
        return coordinateDTOS;
    }
}
