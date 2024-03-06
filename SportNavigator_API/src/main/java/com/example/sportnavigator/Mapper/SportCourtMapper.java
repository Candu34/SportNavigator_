package com.example.sportnavigator.Mapper;

import com.example.sportnavigator.DTO.EncodedImage;
import com.example.sportnavigator.DTO.SportCourtDTO;
import com.example.sportnavigator.Models.Coordinate;
import com.example.sportnavigator.Models.CourtImage;
import com.example.sportnavigator.Models.Enums.CourtType;
import com.example.sportnavigator.Models.Enums.Sport;
import com.example.sportnavigator.Models.SportCourt;
import com.example.sportnavigator.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class SportCourtMapper {
    private final ImageMapper imageMapper;
    private final UserService userService;

    public SportCourt SportCourtDTOToSportCourt(SportCourtDTO courtDTO) {
        Set<CourtType> courtType = new HashSet<>();
        Set<Sport> sport = new HashSet<>();
        Coordinate coordinate = new Coordinate();

        courtType.add(CourtType.valueOf(courtDTO.getCourtType())); //TODO exception handler
        sport.add(Sport.valueOf(courtDTO.getSport()));
        SportCourt court = new SportCourt();

        court.setName(courtDTO.getName());
        court.setDescription(courtDTO.getDescription());
        court.setCourtTypes(courtType);
        court.setUser(userService.getUserById(courtDTO.getUserID()));
        court.setSport(sport);

        coordinate.setLongitude(courtDTO.getLongitude());
        coordinate.setLatitude(courtDTO.getLatitude());
        coordinate.setSportCourt(court);
        court.setCoordinates(coordinate);
        List<CourtImage> images = new ArrayList<>();
        for (EncodedImage image : courtDTO.getImages()) {
            images.add(imageMapper.EncodedImageToCourtImage(image, court));
        }
        court.setImages(images);
        return court;
    }

    public SportCourtDTO SportCourtToSportCourtDTO(SportCourt sportCourt) {
        SportCourtDTO courtDTO = new SportCourtDTO();
        courtDTO.setId(sportCourt.getId());
        courtDTO.setName(sportCourt.getName());
        courtDTO.setDescription(sportCourt.getDescription());
        courtDTO.setCourtType(sportCourt.getCourtTypes().toString());
        courtDTO.setUserID(sportCourt.getUser().getId());
        courtDTO.setLatitude(sportCourt.getCoordinates().getLatitude());
        courtDTO.setLongitude(sportCourt.getCoordinates().getLongitude());
        courtDTO.setSport(sportCourt.getSport().toString());
        List<EncodedImage> images = new ArrayList<>();
        for (CourtImage image : sportCourt.getImages()) {
            images.add(imageMapper.ImageToEncodedImage(image));
        }
        courtDTO.setImages(images);
        return courtDTO;
    }

}
