package com.example.sportnavigator.Security.User;

import com.example.sportnavigator.Models.User;
import com.example.sportnavigator.Repository.UserRepository;
import com.example.sportnavigator.Utils.Excetions.UserNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
@RequiredArgsConstructor
public class MyUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = Optional.ofNullable(userRepository.findByEmail(email)).orElseThrow(() -> new UserNotFoundException("User not found"));

        return MyUserDetails.buildUserDetails(user);
    }
}
