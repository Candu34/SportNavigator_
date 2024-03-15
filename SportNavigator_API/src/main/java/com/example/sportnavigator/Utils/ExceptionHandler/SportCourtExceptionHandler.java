package com.example.sportnavigator.Utils.ExceptionHandler;

import com.example.sportnavigator.Utils.ErrorMessage.ErrorMessage;
import com.example.sportnavigator.Utils.Excetions.SportCourtNotCreatedException;
import com.example.sportnavigator.Utils.Excetions.SportCourtNotFoundException;
import com.example.sportnavigator.Utils.Excetions.SportCourtNotUpdatedException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class SportCourtExceptionHandler {

    @ExceptionHandler(value = SportCourtNotFoundException.class)
    public ResponseEntity<ErrorMessage> handleSportCourtNotFoundException (SportCourtNotFoundException e) {
        ErrorMessage errorMessage = new ErrorMessage(e.getMessage(), System.currentTimeMillis());
        return new ResponseEntity(errorMessage, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = SportCourtNotCreatedException.class)
    public ResponseEntity<ErrorMessage> handleSportCourtNotCreatedException (SportCourtNotCreatedException e) {
        ErrorMessage errorMessage = new ErrorMessage(e.getMessage(), System.currentTimeMillis());
        return new ResponseEntity(errorMessage, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = SportCourtNotUpdatedException.class)
    public ResponseEntity<ErrorMessage> handleSportCourtNotUpdatedException(SportCourtNotUpdatedException e) {
        ErrorMessage errorMessage = new ErrorMessage(e.getMessage(), System.currentTimeMillis());
        return new ResponseEntity<>(errorMessage, HttpStatus.BAD_REQUEST);
    }

}
