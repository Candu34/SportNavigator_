package com.example.sportnavigator.Controllers;


import com.example.sportnavigator.Repository.SportCourtRepository;
import com.example.sportnavigator.Service.SportCourtService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/api/courts")
@RequiredArgsConstructor
public class SportCourtController {
    private final SportCourtService sportCourtService;

}
