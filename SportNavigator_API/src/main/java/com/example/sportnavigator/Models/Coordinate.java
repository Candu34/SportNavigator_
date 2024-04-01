package com.example.sportnavigator.Models;


import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "coordinates")
public class Coordinate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "longitude")
    @NotNull
//    @DecimalMin(value = "43.0", message = "coordinate are outside the application perimeter")
//    @DecimalMax(value = "49.0", message = "coordinate are outside the application perimeter")
    private double longitude;

    @Column(name = "latitude")
    @NotNull
//    @DecimalMin(value = "20.0", message = "coordinate are outside the application perimeter")
//    @DecimalMax(value = "31.0", message = "coordinate are outside the application perimeter")
    private double latitude;

    @OneToOne
    @JoinColumn(name = "court_id")
    private SportCourt sportCourt;
}
