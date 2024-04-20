package com.example.sportnavigator.Repository;

import com.example.sportnavigator.Models.FavoriteSportCourt;
import com.example.sportnavigator.Models.FavoriteSportCourtsKey;
import com.example.sportnavigator.Models.SportCourt;
import com.example.sportnavigator.Models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FavoriteSportCourtRepository extends JpaRepository<FavoriteSportCourt, FavoriteSportCourtsKey> {

    public Page<FavoriteSportCourt> findAllByUser_Id(Long id, Pageable pageable);

    public void deleteBySportCourt(SportCourt sportCourt);

    public void deleteByUser(User user);
}
