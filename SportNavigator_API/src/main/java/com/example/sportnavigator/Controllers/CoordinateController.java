package com.example.sportnavigator.Controllers;

import com.example.sportnavigator.DTO.CoordinateDTO;
import com.example.sportnavigator.Mapper.CoordinateMapper;
import com.example.sportnavigator.Models.Coordinate;
import com.example.sportnavigator.Service.CoordinateService;
import com.example.sportnavigator.Utils.Excetions.SportCourtNotCreatedException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/coordinatem")
public class CoordinateController {
    private final CoordinateService coordinateService;
    private final CoordinateMapper coordinateMapper;

    @GetMapping()
    @ResponseBody()
    public List<CoordinateDTO> findAll(){
        List<Coordinate> coordinates = coordinateService.findAll();
        List<CoordinateDTO> coordinateDTOS = new ArrayList<>();

        for (Coordinate coordinate: coordinates) {
            coordinateDTOS.add(coordinateMapper.coordinateToCoordinateDTO(
                    coordinate
            ));
        }
        return coordinateDTOS;
    }

    @GetMapping("/{id}")
    public CoordinateDTO findOne(@PathVariable("id") Long id){
        Coordinate coordinate = coordinateService.getById(id);
        return coordinateMapper.coordinateToCoordinateDTO(coordinate);
    }

    @PostMapping()
    @ResponseBody()
    public ResponseEntity<HttpStatus> save(@RequestBody @Valid CoordinateDTO coordinateDTO,
                                           BindingResult bindingResult){

        if (bindingResult.hasErrors()) {
            StringBuilder errorMsg = new StringBuilder();

            List<FieldError> errors = bindingResult.getFieldErrors();

            for (FieldError error : errors) {
                errorMsg.append(error.getField())
                        .append(" - ")
                        .append(error.getDefaultMessage())
                        .append(";");
            }

           //TODO Exception Handling
        }

        Coordinate coordinate = coordinateMapper.CoordinateDTOToCoordinate(coordinateDTO);
        coordinateService.save(coordinate);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PatchMapping()
    public ResponseEntity<HttpStatus> update(@RequestBody @Valid CoordinateDTO coordinateDTO,
                                             BindingResult bindingResult){

        if (bindingResult.hasErrors()) {
            StringBuilder errorMsg = new StringBuilder();

            List<FieldError> errors = bindingResult.getFieldErrors();

            for (FieldError error : errors) {
                errorMsg.append(error.getField())
                        .append(" - ")
                        .append(error.getDefaultMessage())
                        .append(";");
            }

            //TODO Exception Handling
        }

        Coordinate coordinate = coordinateMapper.CoordinateDTOToCoordinate(coordinateDTO);
        coordinateService.save(coordinate);
        return new ResponseEntity<>(HttpStatus.OK);
    }




}
