package com.example.sportnavigator.Mapper;

import com.example.sportnavigator.DTO.CoordinateDTO;
import com.example.sportnavigator.Models.Coordinate;
import com.example.sportnavigator.Models.SportCourt;
import com.example.sportnavigator.Service.CoordinateService;
import com.example.sportnavigator.Service.SportCourtService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class CoordinateMapper {
    private final SportCourtService sportCourtService;

    public Coordinate CoordinateDTOToCoordinate(CoordinateDTO coordinateDTO){
        Coordinate coordinate = new Coordinate();
        coordinate.setId(coordinateDTO.getId());
        coordinate.setLatitude(coordinate.getLatitude());
        coordinate.setLongitude(coordinateDTO.getLongitude());
        coordinate.setSportCourt(sportCourtService.getOne(coordinateDTO.getSportCourtId()));

        return coordinate;
    }

    public CoordinateDTO coordinateToCoordinateDTO(Coordinate coordinate){
        CoordinateDTO coordinateDTO = new CoordinateDTO();
        coordinateDTO.setId(coordinate.getId());
        coordinateDTO.setLatitude(coordinateDTO.getLatitude());
        coordinateDTO.setLongitude(coordinateDTO.getLongitude());
        coordinateDTO.setSportCourtId(coordinate.getSportCourt().getId());

        return coordinateDTO;
    }


}
