package com.example.sportnavigator.Repository;

import com.example.sportnavigator.Models.SportCourt;
import com.example.sportnavigator.Models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SportCourtRepository extends JpaRepository<SportCourt, Long> {

    public List<SportCourt> getAllByUser(User user);
}
