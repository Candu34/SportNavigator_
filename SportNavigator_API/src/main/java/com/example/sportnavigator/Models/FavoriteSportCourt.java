package com.example.sportnavigator.Models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Table(name = "user_favorite_courts")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class FavoriteSportCourt {

    @EmbeddedId
    FavoriteSportCourtsKey id;

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    User user;

    @ManyToOne
    @MapsId("sportCourtId")
    @JoinColumn(name = "sport_court_id")
    SportCourt sportCourt;


}

