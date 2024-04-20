package com.example.sportnavigator.Service;

import com.example.sportnavigator.DTO.FavoriteSportCourtResponse;
import com.example.sportnavigator.DTO.ResponeInfo.ResponseInfo;
import com.example.sportnavigator.DTO.SportCourtDTO;
import com.example.sportnavigator.Mapper.SportCourtMapper;
import com.example.sportnavigator.Models.FavoriteSportCourt;
import com.example.sportnavigator.Models.FavoriteSportCourtsKey;
import com.example.sportnavigator.Models.SportCourt;
import com.example.sportnavigator.Models.User;
import com.example.sportnavigator.Repository.FavoriteSportCourtRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FavoriteSportCourtService {
    private final FavoriteSportCourtRepository favoriteSportCourtRepository;
    private final UserService userService;
    private final SportCourtService sportCourtService;
    private final SportCourtMapper sportCourtMapper;


    public List<FavoriteSportCourt> findAll() {
        return favoriteSportCourtRepository.findAll();
    }


    @Transactional(readOnly = false)
    public void delete(FavoriteSportCourtsKey key) {
        favoriteSportCourtRepository.deleteById(key);
    }

    @Transactional(readOnly = false)
    public void deleteBySportCourt(SportCourt sportCourt) {
        favoriteSportCourtRepository.deleteBySportCourt(sportCourt);
    }

    @Transactional(readOnly = false)
    public void addOrDeleteFromFavorite(Long userId, Long sportCourtId) {
        FavoriteSportCourtsKey key = new FavoriteSportCourtsKey(userId, sportCourtId);

        if(favoriteSportCourtRepository.findById(key).isPresent()) {
            favoriteSportCourtRepository.deleteById(key);
        } else {
            User user = userService.getUserById(userId);
            SportCourt sportCourt = sportCourtService.getOne(sportCourtId);
            FavoriteSportCourt favoriteSportCourt = new FavoriteSportCourt();
            favoriteSportCourt.setId(key);
            favoriteSportCourt.setUser(user);
            favoriteSportCourt.setSportCourt(sportCourt);
            favoriteSportCourtRepository.save(favoriteSportCourt);
        }
    }

    @Transactional(readOnly = false)
    public void deleteByUser(User user) {
        favoriteSportCourtRepository.deleteByUser(user);
    }

    public FavoriteSportCourtResponse findAllByUserId(Long userId, int pageNo, int pageSize) {
        Pageable pageable = PageRequest.of(pageNo, pageSize);
        ResponseInfo responseInfo = new ResponseInfo();
        Page<FavoriteSportCourt> favoriteSportCourts = favoriteSportCourtRepository.findAllByUser_Id(userId, pageable);
        FavoriteSportCourtResponse favoriteSportCourtResponse = new FavoriteSportCourtResponse();
        List<SportCourtDTO> courtsDTOs = favoriteSportCourts.stream()
                .map(FavoriteSportCourt::getSportCourt)
                .map(sportCourtMapper::SportCourtToSportCourtDTO)
                .toList();

        favoriteSportCourtResponse.setFavoriteSportCourts(courtsDTOs);
        favoriteSportCourtResponse.setUserId(userId);
        responseInfo.setPageNo(favoriteSportCourts.getNumber());
        responseInfo.setPageSize(favoriteSportCourts.getSize());
        responseInfo.setTotalElements(favoriteSportCourts.getTotalElements());
        responseInfo.setTotalPages(favoriteSportCourts.getTotalPages());
        responseInfo.setLast(favoriteSportCourts.isLast());
        favoriteSportCourtResponse.setResponseInfo(responseInfo);

        return favoriteSportCourtResponse;
    }

}
