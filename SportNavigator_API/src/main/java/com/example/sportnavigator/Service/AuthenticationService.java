package com.example.sportnavigator.Service;



import com.example.sportnavigator.DTO.User.LoginUserDTO;
import com.example.sportnavigator.DTO.User.RegisterUserDTO;
import com.example.sportnavigator.Models.Enums.RoleEnum;
import com.example.sportnavigator.Models.Role;
import com.example.sportnavigator.Models.User;
import com.example.sportnavigator.Repository.RoleRepository;
import com.example.sportnavigator.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final RoleRepository roleRepository;

    public User signup(RegisterUserDTO input) {
        Optional<Role> optionalRole = roleRepository.findByName(RoleEnum.USER.name());

        if (optionalRole.isEmpty()) {
            return null;
        }
        User user = new User();
        user.setFirstName(input.getFirstName());
        user.setLastName(input.getLastName());
        user.setEmail(input.getEmail());
        user.setPassword(passwordEncoder.encode(input.getPassword()));
        user.getRoles().add(optionalRole.get());

        return userRepository.save(user);
    }

    public User authenticate(LoginUserDTO input) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        input.getEmail(),
                        input.getPassword()
                )
        );
        return userRepository.findByEmail(input.getEmail())
                .orElseThrow();
    }
}
