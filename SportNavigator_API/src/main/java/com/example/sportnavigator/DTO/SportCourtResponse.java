package com.example.sportnavigator.DTO;

import com.example.sportnavigator.DTO.ResponeInfo.ResponseInfo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@AllArgsConstructor
@NoArgsConstructor
@Data
public class SportCourtResponse {
    private List<SportCourtDTO> content;
    private ResponseInfo responseInfo;
}
