package com.example.sportnavigator.Service;

import com.example.sportnavigator.DTO.ResponeInfo.ResponseInfo;
import com.example.sportnavigator.DTO.SportCourtDTO;
import com.example.sportnavigator.DTO.SportCourtResponse;
import com.example.sportnavigator.Mapper.SportCourtMapper;
import com.example.sportnavigator.Models.Coordinate;
import com.example.sportnavigator.Models.Enums.Sport;
import com.example.sportnavigator.Models.SportCourt;
import com.example.sportnavigator.Models.User;
import com.example.sportnavigator.Repository.SportCourtRepository;
import com.example.sportnavigator.Repository.UserRepository;
import com.example.sportnavigator.Utils.Excetions.SportCourtNotCreatedException;
import com.example.sportnavigator.Utils.Excetions.UserNotFoundException;
import com.example.sportnavigator.Utils.Excetions.WrongCoordinateRangeException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SportCourtService {
    private final SportCourtRepository sportCourtRepository;
    private final SportCourtMapper sportCourtMapper;
    private final UserRepository userRepository;

    public SportCourt getOne(Long id) {
        Optional<SportCourt> sportCourt = sportCourtRepository.findById(id);
        if (sportCourt.isEmpty()) {
            throw new SportCourtNotCreatedException("SportCourt with this id wasn't found!");
        }
        return sportCourt.get();
    }



    public Long save(SportCourt sportCourt) {
        Coordinate coordinate = sportCourt.getCoordinates();
        if (coordinate.getLongitude() > 31.0 | coordinate.getLongitude() < 21.0
                | coordinate.getLatitude() > 49.0 | coordinate.getLatitude() < 43.0) {
            throw new WrongCoordinateRangeException("Coordinate outside the app perimeter");
        } else {
            return sportCourtRepository.save(sportCourt).getId();
        }
    }

    public SportCourtResponse findAll(String sport, String courtType, int pageNo, int pageSize) {
        Pageable pageable = PageRequest.of(pageNo, pageSize);
        Page<SportCourt> sportCourts;
        if (sport == null && courtType == null) {
            sportCourts = sportCourtRepository.findAll(pageable);
        } else if (sport != null && courtType != null) {
            sportCourts = sportCourtRepository.findSportCourtsBySportAndCourtType(Sport.valueOf(sport.toUpperCase()), courtType, pageable);
        } else if (sport != null && courtType == null) {
            sportCourts = sportCourtRepository.getAllBySport(Sport.valueOf(sport.toUpperCase()), pageable);
        } else {
            sportCourts = sportCourtRepository.findSportCourtsByCourtType(courtType, pageable);
        }

        List<SportCourtDTO> content = sportCourts.stream().map(sportCourtMapper::SportCourtToSportCourtDTO).toList();
        SportCourtResponse sportCourtResponse = new SportCourtResponse();
        ResponseInfo responseInfo = new ResponseInfo();
        sportCourtResponse.setContent(content);
        responseInfo.setPageNo(sportCourts.getNumber());
        responseInfo.setPageSize(sportCourts.getSize());
        responseInfo.setTotalElements(sportCourts.getTotalElements());
        responseInfo.setTotalPages(sportCourts.getTotalPages());
        responseInfo.setLast(sportCourts.isLast());
        sportCourtResponse.setResponseInfo(responseInfo);



        return sportCourtResponse;
    }

    public Page<SportCourt> findAllByUser(User user, int pageNo, int pageSize) {
        Pageable pageable = PageRequest.of(pageNo, pageSize);

        return sportCourtRepository.getAllByUser(user, pageable);
    }

    public void deleteById(Long id) {
        sportCourtRepository.deleteById(id);
    }

    public Long countByUserId(Long userId){
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()){
            throw new UserNotFoundException("User with this id wasn't found");
        }
        return sportCourtRepository.countAllByUser(userOptional.get());
    }


}
