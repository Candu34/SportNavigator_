package com.example.sportnavigator.DTO.user;

import com.example.sportnavigator.DTO.EncodedImage;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserInfoDTO {

    @JsonProperty
    private Long id;

    @JsonProperty("firstName")
    private String firstName;

    @JsonProperty("lastName")
    private String lastName;


    @JsonProperty("science")
    private String science;

}
