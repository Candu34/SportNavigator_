package com.example.sportnavigator.DTO.User;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class LoginUserDTO {

    private String mail;
    private String password;
}
