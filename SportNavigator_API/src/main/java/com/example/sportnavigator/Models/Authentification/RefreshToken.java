package com.example.sportnavigator.Models.Authentification;


import com.example.sportnavigator.Models.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@AllArgsConstructor
@NoArgsConstructor
@Entity
@Getter
@Setter
@Builder
@Table(name = "refresh_token")
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "token", nullable = false)
    private String token;

    @Column(name = "expiry_date")
    private Instant expiryDate;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;
}
