package com.example.sportnavigator.Controllers;


import com.example.sportnavigator.DTO.SportCourtDTO;
import com.example.sportnavigator.DTO.UserDTO;
import com.example.sportnavigator.Mapper.SportCourtMapper;
import com.example.sportnavigator.Models.SportCourt;
import com.example.sportnavigator.Models.User;
import com.example.sportnavigator.Repository.SportCourtRepository;
import com.example.sportnavigator.Service.SportCourtService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping("/api/courts")
@RequiredArgsConstructor
public class SportCourtController {
    private final SportCourtService sportCourtService;
    private final SportCourtMapper sportCourtMapper;


    @PostMapping
    @ResponseBody
    public ResponseEntity<HttpStatus> save(@RequestBody @Valid SportCourtDTO sportCourtDTO,
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

            //TODO Exceptions throwing

        }

        SportCourt sportCourt = sportCourtMapper.SportCourtDTOToSportCourt(sportCourtDTO);
        sportCourtService.save(sportCourt);
        return  ResponseEntity.ok(HttpStatus.OK);
    }

    @GetMapping()
    @ResponseBody()
    public List<SportCourtDTO> getAll(){
        List<SportCourt> sportCourts = sportCourtService.findAll();
        List<SportCourtDTO> sportCourtsDTO = new ArrayList<>();
        for(SportCourt sportCourt:sportCourts){
            sportCourtsDTO.add(sportCourtMapper.SportCourtToSportCourtDTO(sportCourt));
        }
        return sportCourtsDTO;
    }

    @GetMapping("/{id}")
    public SportCourtDTO findOne(@PathVariable("id") Long id){
        return sportCourtMapper.SportCourtToSportCourtDTO(sportCourtService.getOne(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteOne(@PathVariable("id") long id){
        sportCourtService.deleteById(id);
        return ResponseEntity.ok(HttpStatus.OK);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<HttpStatus> update(@PathVariable Long id,
                                             @RequestBody @Valid SportCourtDTO sportCourtDTO,
                                             BindingResult bindingResult) {

        SportCourt sportCourt = sportCourtService.getOne(id);

        if (sportCourt == null) {
            //TODO Exceptions throwing
            return ResponseEntity.ok(HttpStatus.BAD_REQUEST);
        }
        if (bindingResult.hasErrors()) {
            StringBuilder errorMsg = new StringBuilder();

            List<FieldError> errors = bindingResult.getFieldErrors();

            for (FieldError error : errors) {
                errorMsg.append(error.getField())
                        .append(" - ")
                        .append(error.getDefaultMessage())
                        .append(";");
            }
            //TODO Exceptions throwing
        }
        sportCourt = sportCourtMapper.SportCourtDTOToSportCourt(sportCourtDTO);
        sportCourt.setId(id);
        sportCourtService.save(sportCourt);

        return ResponseEntity.ok(HttpStatus.OK);
    }


}
