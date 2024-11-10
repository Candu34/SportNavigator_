package com.example.sportnavigator.Models;



import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "users")
@EntityListeners(AuditingEntityListener.class)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private long id;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @OneToOne(mappedBy = "user",
            cascade = {CascadeType.REFRESH, CascadeType.REFRESH, CascadeType.MERGE, CascadeType.REMOVE},
            orphanRemoval = true, optional = true)
    private UserImage image;

    @Column(name = "password", length = 1000, nullable = false)
    private String password;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL,
                orphanRemoval = false)
    private List<SportCourt> sportCourts;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL,
                orphanRemoval = true, fetch = FetchType.EAGER)
    private List<Event> events;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY,
            mappedBy = "user", orphanRemoval = true)
    private List<Review> reviews;


    @OneToMany(mappedBy = "user")
    private Set<SportCourt> favoriteSportCourts;

    @Column(name = "creation_date", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime lastUpdated;


    @ManyToMany(fetch = FetchType.EAGER,
            cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    @JoinTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "user_id"),
                inverseJoinColumns = @JoinColumn(name = "role_id", referencedColumnName = "id"))
    private Collection<Role> roles = new HashSet<>();



}
