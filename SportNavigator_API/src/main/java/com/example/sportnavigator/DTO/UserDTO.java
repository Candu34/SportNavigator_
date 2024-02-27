package com.example.sportnavigator.DTO;

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

    @Email(message = "wrong email format")
    @JsonProperty("email")
    @NotNull
    private String email;

    @NotNull(message = "first_name should not be empty")
    @Size(min = 2, max = 30, message = "first name should be between 2 and 30 characters")
    @JsonProperty("firstName")
    private String firstName;

    @NotNull(message = "last_name should not be empty")
    @Size(min = 2, max = 30, message = "first name should be between 2 and 30 characters")
    @JsonProperty("lastName")
    private String lastName;

    @JsonProperty
    private String password;

    @JsonProperty
    EncodedImage image;











}
