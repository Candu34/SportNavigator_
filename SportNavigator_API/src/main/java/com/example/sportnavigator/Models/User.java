package com.example.sportnavigator.Models;


import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;


@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private long id;

    @Column(name = "email")
    @Email
    @NotNull(message = "Email should not be empty")
    private String email;

    @Column(name = "first_name")
    @NotNull(message = "first name should not be empty")
    @Size(min = 2, max = 30, message = "First name should be between 2 and 30 characters")
    private String firstName;

    @Column(name = "last_name")
    @NotNull(message = "last name should not be empty")
    @Size(min = 2, max = 30, message = "Last name should not be empty")
    private String lastName;

    @OneToOne(mappedBy = "user",
            cascade = CascadeType.ALL,
            orphanRemoval = true, optional = true)
    private UserImage image;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL,
                orphanRemoval = false)
    private List<SportCourt> sportCourts;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL,
                orphanRemoval = true, fetch = FetchType.EAGER)
    private List<Event> events;

    @Column(name = "date_of_created", nullable = false, updatable = false)
    private LocalDateTime dateOfCreated;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY,
            mappedBy = "user", orphanRemoval = true)
    private List<Review> reviews;


    @PrePersist
    public void init(){
        this.dateOfCreated = LocalDateTime.now();
    }

}
