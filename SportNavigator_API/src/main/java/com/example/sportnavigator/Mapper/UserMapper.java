package com.example.sportnavigator.Mapper;

import com.example.sportnavigator.DTO.EncodedImage;
import com.example.sportnavigator.DTO.UserDTO;
import com.example.sportnavigator.Models.User;
import com.example.sportnavigator.Models.UserImage;
import com.example.sportnavigator.Service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class UserMapper {

    private final ImageMapper imageMapper;

    public UserDTO userToUserDTO(User user){
        if (user == null) return null;
        EncodedImage encodedImage = imageMapper.ImageToEncodedImage(user.getImage());


        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setEmail(userDTO.getEmail());
        userDTO.setFirstName(user.getFirstName());
        userDTO.setLastName(user.getLastName());
        userDTO.setImage(encodedImage);

        return userDTO;
    }

    public User userDTOToUser(UserDTO userDTO){
        if (userDTO == null) return null; //TODO Exception throwing

        User user = new User();
        UserImage userImage= imageMapper.EncodedImageToImage(userDTO.getImage(), user);

        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setEmail(userDTO.getEmail());
        user.setImage(userImage);

        return user;
    }
}
