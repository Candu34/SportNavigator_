package com.example.sportnavigator.DTO;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EncodedImage {


    private String mime;

    private String data;

}
