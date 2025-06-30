package com.example.sportnavigator.Controllers;


import com.example.sportnavigator.DTO.Auth.UserDTO;
import com.example.sportnavigator.DTO.user.UserChangeRequestDto;
import com.example.sportnavigator.DTO.user.UserInfoDTO;
import com.example.sportnavigator.Mapper.UserMapper;
import com.example.sportnavigator.Models.User;
import com.example.sportnavigator.Service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/users")
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;

    @GetMapping
    @ResponseBody
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public List<UserDTO> findAll() {
        List<User> users = userService.getAllUsers();
        List<UserDTO> usersDTO = new ArrayList<>();
        for (User user : users) {
            usersDTO.add(userMapper.userToUserDTO(user));
        }
        return usersDTO;
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/me")
    public ResponseEntity<UserDTO> authenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        User currentUser = (User) authentication.getPrincipal();
        UserDTO userDTO = userMapper.userToUserDTO(currentUser);
        return ResponseEntity.ok(userDTO);
    }


    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @GetMapping("/{id}")
    @ResponseBody
    public UserDTO getOne(@PathVariable("id") long id) {
        return userMapper.userToUserDTO(userService.getUserById(id));
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/info/{id}")
    @ResponseBody
    public ResponseEntity<UserInfoDTO> getUserInfo(@PathVariable("id") long id) {
        return ResponseEntity.ok(userMapper.userToUserInfoDTO(userService.getUserById(id)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> delete(@PathVariable Long id) {
        userService.deleteUserByID(id);
        return ResponseEntity.ok(HttpStatus.OK);
    }

    @PreAuthorize("isAuthenticated()")
    @PatchMapping("/update/{id}")
    public ResponseEntity<UserDTO> update(@PathVariable Long id,
                                             @RequestBody @Valid UserChangeRequestDto requestDto,
                                             BindingResult bindingResult) {

        User user = userService.updateUser(requestDto, bindingResult);
        UserDTO userDto = userMapper.userToUserDTO(user);

        return ResponseEntity.ok(userDto);
    }



}
