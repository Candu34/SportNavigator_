package com.example.sportnavigator.Service;

import com.example.sportnavigator.Models.User;
import com.example.sportnavigator.Repository.UserRepository;
import com.example.sportnavigator.Utils.Excetions.UserExistingEmailException;
import com.example.sportnavigator.Utils.Excetions.UserNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
@Transactional(readOnly = true)
public class UserService {
    private final UserRepository userRepository;

    @Transactional
    public void saveUser(User user) {
        if (userRepository.findByEmail(user.getEmail()) != null) {
            throw new UserExistingEmailException("User with this email already exists");
        } else {
            userRepository.save(user);
        }
    }

    public User getUserById(Long id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isEmpty()) {
            throw new UserNotFoundException("User with this id wasn't found");
        }
        return user.get();
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public void deleteUserByID(Long id) {
        userRepository.deleteById(id);
    }


}
