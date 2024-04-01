package com.example.sportnavigator.Models;


import com.example.sportnavigator.Models.Enums.CourtType;
import com.example.sportnavigator.Models.Enums.Sport;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "courts")
@Entity
public class SportCourt {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "description", columnDefinition = "text")
    private String description;


    @NotNull(message = "sport should not be empty")
    @Column(name = "sport", length = 32, columnDefinition = "varchar(32) default 'UNKNOWN'")
    @Enumerated(value = EnumType.STRING)
    Sport sport;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY,
            mappedBy = "sportCourt")
    private List<CourtImage> images = new ArrayList<>();

    @Column(name = "date_of_creating", nullable = false, updatable = false)
    private LocalDateTime dateOfCreated;

    @ManyToOne(cascade = CascadeType.REFRESH, fetch = FetchType.LAZY)
    @JoinColumn
    private User user;

    @Column(name = "court_type")
    String courtType;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY,
            mappedBy = "sportCourt")
    private List<Review> reviews;

    @OneToOne(mappedBy = "sportCourt",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private Coordinate coordinates;



    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY,
            mappedBy = "sportCourt")
    private List<Event> events;

    @PrePersist
    private void init() {
        this.dateOfCreated = LocalDateTime.now();
    }

}
