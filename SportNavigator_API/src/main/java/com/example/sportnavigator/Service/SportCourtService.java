package com.example.sportnavigator.Service;

import com.example.sportnavigator.Models.Coordinate;
import com.example.sportnavigator.Models.SportCourt;
import com.example.sportnavigator.Repository.SportCourtRepository;
import com.example.sportnavigator.Utils.Excetions.SportCourtNotCreatedException;
import com.example.sportnavigator.Utils.Excetions.WrongCoordinateRangeException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SportCourtService {
    private final SportCourtRepository sportCourtRepository;


    public SportCourt getOne(Long id) {
        Optional<SportCourt> sportCourt = sportCourtRepository.findById(id);
        if (sportCourt.isEmpty()) {
            throw new SportCourtNotCreatedException("SportCourt with this id wasn't found!");
        }
        return sportCourt.get();
    }

    public void save(SportCourt sportCourt){
        Coordinate coordinate = sportCourt.getCoordinates();
        if (coordinate.getLatitude() > 31.0 | coordinate.getLatitude() < 21.0
                | coordinate.getLongitude() > 49.0 | coordinate.getLongitude() < 43.0){
            throw new WrongCoordinateRangeException("Coordinate outside the app perimeter");
        } else {
            sportCourtRepository.save(sportCourt);
        }
    }

    public List<SportCourt> findAll(){
        return sportCourtRepository.findAll();
    }

    public void deleteById(Long id){
        sportCourtRepository.deleteById(id);
    }

    public List<SportCourt> findAllBySport(String sport){
        return sportCourtRepository.getAllBySport(sport);
    }

    public List<SportCourt> findAllByCourtType(String courtType){
        return sportCourtRepository.findSportCourtsByCourtType(courtType);
    }

    public List<SportCourt> findAllBySportAndCourtType(String sport, String courtType){
        return sportCourtRepository.findSportCourtsBySportAndCourtType(sport, courtType);
    }


}
