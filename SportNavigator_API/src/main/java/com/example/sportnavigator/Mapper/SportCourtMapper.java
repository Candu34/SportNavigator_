package com.example.sportnavigator.Mapper;

import com.example.sportnavigator.DTO.EncodedImage;
import com.example.sportnavigator.DTO.SportCourtDTO;
import com.example.sportnavigator.Models.Coordinate;
import com.example.sportnavigator.Models.CourtImage;
import com.example.sportnavigator.Models.Enums.CourtType;
import com.example.sportnavigator.Models.Enums.Sport;
import com.example.sportnavigator.Models.SportCourt;
import com.example.sportnavigator.Service.ReviewService;
import com.example.sportnavigator.Service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
@Slf4j
@RequiredArgsConstructor
public class SportCourtMapper {
    private final ImageMapper imageMapper;
    private final UserService userService;
    private final ReviewService reviewService;

    public SportCourt SportCourtDTOToSportCourt(SportCourtDTO courtDTO) {
        Coordinate coordinate = new Coordinate();

         //TODO exception handler
        SportCourt court = new SportCourt();

        court.setName(courtDTO.getName());
        court.setDescription(courtDTO.getDescription());
        court.setCourtType(courtDTO.getCourtType());
        if (courtDTO.getUserID() != null) {
            log.info("User id while mapping sport court: {}", courtDTO.getUserID());
            court.setUser(userService.getUserById(courtDTO.getUserID()));
        }
        court.setSport(Sport.valueOf(courtDTO.getSport()));
        System.out.println("Sport: " + court.getSport());
        court.setCourtType(courtDTO.getCourtType());
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
        courtDTO.setCourtType(sportCourt.getCourtType());
        if (courtDTO.getUserID() != null){
            courtDTO.setUserID(sportCourt.getUser().getId());
        }
        courtDTO.setLatitude(sportCourt.getCoordinates().getLatitude());
        courtDTO.setLongitude(sportCourt.getCoordinates().getLongitude());
        courtDTO.setSport(sportCourt.getSport().toString());
        List<EncodedImage> images = new ArrayList<>();
        for (CourtImage image : sportCourt.getImages()) {
            images.add(imageMapper.ImageToEncodedImage(image));
        }
        courtDTO.setImages(images);
        courtDTO.setRatingData(reviewService.getReviewInfo(courtDTO.getId()));
        return courtDTO;
    }

}
