package com.example.sportnavigator.Service;

import com.example.sportnavigator.Models.FavoriteSportCourt;
import com.example.sportnavigator.Models.FavoriteSportCourtsKey;
import com.example.sportnavigator.Models.SportCourt;
import com.example.sportnavigator.Models.User;
import com.example.sportnavigator.Repository.FavoriteSportCourtRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FavoriteSportCourtService {
    private final FavoriteSportCourtRepository favoriteSportCourtRepository;

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
    public void save(FavoriteSportCourt favoriteSportCourt) {
        favoriteSportCourtRepository.save(favoriteSportCourt);
    }

    @Transactional(readOnly = false)
    public void deleteByUser(User user){
        favoriteSportCourtRepository.deleteByUser(user);
    }

    public List<FavoriteSportCourt> findAllByUserId(Long userId){
        return favoriteSportCourtRepository.findAllByUser_Id(userId);
    }

}
