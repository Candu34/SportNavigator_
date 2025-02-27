package com.example.sportnavigator.DTO.Auth;

import com.example.sportnavigator.DTO.EncodedImage;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserDTO {

    @JsonProperty
    private Long id;

    @Email(message = "Wrong email format")
    @JsonProperty("email")
    @NotNull
    private String email;

    @NotNull(message = "First name should not be empty")
    @Size(min = 2, max = 30, message = "first name should be between 2 and 30 characters")
    @JsonProperty("firstName")
    private String firstName;

    @NotNull(message = "Last name should not be empty")
    @Size(min = 2, max = 30, message = "first name should be between 2 and 30 characters")
    @JsonProperty("lastName")
    private String lastName;

    @NotNull(message = "Password should not be empty")
    @Size(min = 8, message = "Password should be at least 8 characters")
    @JsonProperty("password")
    private String password;

    @JsonProperty
    EncodedImage image;













}
