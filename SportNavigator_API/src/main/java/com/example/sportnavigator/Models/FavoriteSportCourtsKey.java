package com.example.sportnavigator.Models;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Objects;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FavoriteSportCourtsKey implements Serializable {

    @Column(name = "user_id")
    Long userId;

    @Column(name = "sport_court_id")
    Long sportCourtId;


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        FavoriteSportCourtsKey that = (FavoriteSportCourtsKey) o;
        return Objects.equals(userId, that.userId) &&
                Objects.equals(sportCourtId, that.sportCourtId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, sportCourtId);
    }
}
