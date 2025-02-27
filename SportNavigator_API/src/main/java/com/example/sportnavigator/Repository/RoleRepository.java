package com.example.sportnavigator.Repository;

import com.example.sportnavigator.Models.Authentification.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Integer> {
    Optional<Role> findByName(String name);
}
