package com.example.sportnavigator.Controllers;


import com.example.sportnavigator.DTO.SportCourtDTO;
import com.example.sportnavigator.DTO.SportCourtResponse;
import com.example.sportnavigator.Mapper.SportCourtMapper;
import com.example.sportnavigator.Models.SportCourt;
import com.example.sportnavigator.Models.User;
import com.example.sportnavigator.Service.SportCourtService;
import com.example.sportnavigator.Service.UserService;
import com.example.sportnavigator.Utils.Excetions.SportCourtNotCreatedException;
import com.example.sportnavigator.Utils.Excetions.SportCourtNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courts")
@PreAuthorize("isAuthenticated()")
@RequiredArgsConstructor
@Slf4j
public class SportCourtController {
    private final SportCourtService sportCourtService;
    private final SportCourtMapper sportCourtMapper;
    private final UserService userService;


    @PostMapping()
    @ResponseBody()
    public ResponseEntity<Long> save(@RequestBody @Valid SportCourtDTO sportCourtDTO,
                                           BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            StringBuilder errorMsg = new StringBuilder();

            List<FieldError> errors = bindingResult.getFieldErrors();

            for (FieldError error : errors) {
                errorMsg.append(error.getField())
                        .append(" - ")
                        .append(error.getDefaultMessage())
                        .append(";");
            }

            throw new SportCourtNotCreatedException(errorMsg.toString());

        }
        SportCourt sportCourt  = sportCourtMapper.SportCourtDTOToSportCourt(sportCourtDTO);
        Long sportCourtId = sportCourtService.save(sportCourt);
        return ResponseEntity.ok(sportCourtId);
    }

    @GetMapping()
    @ResponseBody()
    public ResponseEntity<SportCourtResponse> getAll(@RequestParam(value = "sport", required = false) String sport,
                                                     @RequestParam(value = "courtType", required = false) String courtType,
                                                     @RequestParam(value = "pageNo", defaultValue = "0", required = false) int pageNo,
                                                     @RequestParam(value = "pageSize", defaultValue = "2", required = false) int pageSize) {

        SportCourtResponse sportCourtResponse = sportCourtService.findAll(sport, courtType, pageNo, pageSize);
        return new ResponseEntity<>(sportCourtResponse, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public SportCourtDTO findOne(@PathVariable("id") Long id) {
        return sportCourtMapper.SportCourtToSportCourtDTO(sportCourtService.getOne(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<HttpStatus> deleteOne(@PathVariable("id") long id) {
        sportCourtService.deleteById(id);
        return ResponseEntity.ok(HttpStatus.OK);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<HttpStatus> update(@PathVariable Long id,
                                             @RequestBody @Valid SportCourtDTO sportCourtDTO,
                                             BindingResult bindingResult) {

        SportCourt sportCourt = sportCourtService.getOne(id);

        if (sportCourt == null) {
            throw new SportCourtNotFoundException("Sport court with this id wasn't found!");
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
            throw new SportCourtNotCreatedException(errorMsg.toString());
        }
        sportCourt = sportCourtMapper.SportCourtDTOToSportCourt(sportCourtDTO);
        sportCourt.setId(id);

        sportCourtService.save(sportCourt);

        return ResponseEntity.ok(HttpStatus.OK);
    }


}
