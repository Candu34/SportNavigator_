package com.example.sportnavigator.Service;

import com.example.sportnavigator.Models.SportCourt;
import com.example.sportnavigator.Repository.SportCourtRepository;
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
            return null;
            // TODO Exception throwing
        }
        return sportCourt.get();
    }

    public void save(SportCourt sportCourt){
        sportCourtRepository.save(sportCourt);
    }

    public List<SportCourt> findAll(){
        return sportCourtRepository.findAll();
    }

    public void deleteById(Long id){
        sportCourtRepository.deleteById(id);
    }
}
