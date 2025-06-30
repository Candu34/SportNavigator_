package com.example.sportnavigator.DTO.user;

import com.example.sportnavigator.DTO.EncodedImage;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class ChangeUserImageRequest {

    @JsonProperty
    private Long id;

    @JsonProperty
    private EncodedImage image;
}
