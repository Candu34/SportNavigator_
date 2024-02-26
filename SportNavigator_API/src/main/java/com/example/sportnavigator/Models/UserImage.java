package com.example.sportnavigator.Models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "user_images")
public class UserImage {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "mime", nullable = false)
    private String mime;

    @Lob
    private byte[] bytes;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

}
