package com.example.sportnavigator.Mapper;

import com.example.sportnavigator.DTO.EncodedImage;
import com.example.sportnavigator.DTO.Auth.UserDTO;
import com.example.sportnavigator.DTO.user.UserInfoDTO;
import com.example.sportnavigator.Models.User;
import com.example.sportnavigator.Models.UserImage;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;

@Component
@AllArgsConstructor
public class UserMapper {

    private final ImageMapper imageMapper;
    private final PasswordEncoder passwordEncoder;
    public UserDTO userToUserDTO(User user){
        if (user == null) return null;
        EncodedImage encodedImage = imageMapper.ImageToEncodedImage(user.getImage());


        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setEmail(user.getEmail());
        userDTO.setFirstName(user.getFirstName());
        userDTO.setLastName(user.getLastName());
        userDTO.setImage(encodedImage);

        DateTimeFormatter formatters = DateTimeFormatter.ofPattern("d/MM/uuuu");
        userDTO.setScience(user.getCreatedAt().format(formatters));
        return userDTO;
    }

    public UserInfoDTO userToUserInfoDTO(User user){
        if (user == null) return null;
        EncodedImage encodedImage = imageMapper.ImageToEncodedImage(user.getImage());


        UserInfoDTO userDTO = new UserInfoDTO();
        userDTO.setId(user.getId());
        userDTO.setFirstName(user.getFirstName());
        userDTO.setLastName(user.getLastName());

        DateTimeFormatter formatters = DateTimeFormatter.ofPattern("d/MM/uuuu");
        userDTO.setScience(user.getCreatedAt().format(formatters));
        return userDTO;
    }

    public User userDTOToUser(UserDTO userDTO){
        if (userDTO == null) {
            //TODO Exception throwing
        }

        User user = new User();
        UserImage userImage= imageMapper.EncodedImageToImage(userDTO.getImage(), user);

        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setEmail(userDTO.getEmail());
        user.setImage(userImage);
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));

        return user;
    }
}
