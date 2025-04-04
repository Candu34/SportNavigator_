package com.example.sportnavigator.DTO.ResponeInfo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@AllArgsConstructor
@NoArgsConstructor
@Data
public class DataResponse<T> {

    List<T> data;
    ResponseInfo responseInfo;
}
