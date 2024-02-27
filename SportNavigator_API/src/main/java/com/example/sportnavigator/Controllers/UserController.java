package com.example.sportnavigator.Controllers;


import com.example.sportnavigator.DTO.UserDTO;
import com.example.sportnavigator.Mapper.UserMapper;
import com.example.sportnavigator.Models.User;
import com.example.sportnavigator.Service.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/users")
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;

    @ResponseBody
    @PostMapping
    public ResponseEntity<HttpStatus> save(@RequestBody @Valid UserDTO userDTO,
                                           BindingResult bindingResult){
        if(bindingResult.hasErrors()){
            StringBuilder errorMsg = new StringBuilder();

            List<FieldError> errors = bindingResult.getFieldErrors();

            for(FieldError error : errors){
                errorMsg.append(error.getField())
                        .append(" - ")
                        .append(error.getDefaultMessage())
                        .append(";");
            }

            //TODO Exceptions throwing

        }

        User user = userMapper.userDTOToUser(userDTO);
        userService.saveUser(user);
        return ResponseEntity.ok(HttpStatus.OK);
    }

}
