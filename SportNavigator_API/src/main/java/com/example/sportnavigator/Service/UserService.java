package com.example.sportnavigator.Service;

import com.example.sportnavigator.DTO.User.UserDTO;
import com.example.sportnavigator.Mapper.UserMapper;
import com.example.sportnavigator.Models.User;
import com.example.sportnavigator.Repository.UserRepository;
import com.example.sportnavigator.Utils.Excetions.UserExistingEmailException;
import com.example.sportnavigator.Utils.Excetions.UserNotCreatedException;
import com.example.sportnavigator.Utils.Excetions.UserNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
@Transactional(readOnly = true)
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper mapper;

    @Transactional
    public void saveUser(UserDTO userDTO, BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            StringBuilder errorMsg = new StringBuilder();

            List<FieldError> errors = bindingResult.getFieldErrors();

            for (FieldError error : errors) {
                errorMsg.append(error.getField()).append(" - ").append(error.getDefaultMessage()).append(";");
            }

            throw new UserNotCreatedException(errorMsg.toString());

        }

        if (userRepository.findByEmail(userDTO.getEmail()) != null) {
            throw new UserExistingEmailException("User with this email already exists");
        } else {
            User user = mapper.userDTOToUser(userDTO);
            user.setCreatedAt(LocalDateTime.now());
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

    @Transactional
    public void updateUser(UserDTO userDTO, BindingResult bindingResult) {
        Optional<User> userOptional = userRepository.findById(userDTO.getId());

        if (userOptional.isEmpty()) {
            //TODO exception throwing
        }
        if (bindingResult.hasErrors()) {
            StringBuilder errorMsg = new StringBuilder();

            List<FieldError> errors = bindingResult.getFieldErrors();

            for (FieldError error : errors) {
                errorMsg.append(error.getField()).append(" - ").append(error.getDefaultMessage()).append(";");
            }
            throw new UserNotCreatedException(errorMsg.toString());
        }
        if (userRepository.findByEmail(userDTO.getEmail()) != null) {
            throw new UserExistingEmailException("User with this email already exists");
        } else {
            User user = mapper.userDTOToUser(userDTO);
            user.setLastUpdated(LocalDateTime.now());
            userRepository.save(user);
        }
    }

    public User getAuthentificatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email);
    }


}
