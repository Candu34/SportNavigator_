package com.example.sportnavigator.Utils.bootstrap;

import com.example.sportnavigator.DTO.User.RegisterUserDTO;
import com.example.sportnavigator.Models.Enums.RoleEnum;
import com.example.sportnavigator.Models.Authentification.Role;
import com.example.sportnavigator.Models.User;
import com.example.sportnavigator.Repository.RoleRepository;
import com.example.sportnavigator.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;


@RequiredArgsConstructor
public class AdminSeeder implements ApplicationListener<ContextRefreshedEvent> {

    @Value("${auth.admin.password}")
    private String SUPER_ADMIN_PASSWORD;

    @Value("${auth.admin.email}")
    private String SUPER_ADMIN_EMAIL;

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    @Override
    public void onApplicationEvent(ContextRefreshedEvent contextRefreshedEvent) {
        this.createSuperAdministrator();
    }

    private void createSuperAdministrator() {
        RegisterUserDTO userDto = new RegisterUserDTO();
        userDto.setFirstName("Super");
        userDto.setLastName("Admin");
        userDto.setEmail(SUPER_ADMIN_EMAIL);
        userDto.setPassword(SUPER_ADMIN_PASSWORD);

        Optional<Role> optionalRole = roleRepository.findByName(RoleEnum.SUPER_ADMIN.name());
        Optional<User> optionalUser = userRepository.findByEmail(userDto.getEmail());

        if (optionalRole.isEmpty() || optionalUser.isPresent()) {
            return;
        }

        var user = new User();
        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        user.setEmail(userDto.getEmail());
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        user.getRoles().add(optionalRole.get());

        userRepository.save(user);
    }
}
