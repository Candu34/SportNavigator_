package com.example.sportnavigator.Utils.ExceptionHandler;


import com.example.sportnavigator.Utils.ErrorMessage.ErrorMessage;
import com.example.sportnavigator.Utils.Excetions.EventNotFoundException;
import com.example.sportnavigator.Utils.Excetions.WrongCoordinateRangeException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class CoordinateExceptionHandler {

    @ExceptionHandler(value = WrongCoordinateRangeException.class)
    protected ResponseEntity<ErrorMessage> handleWrongCoordinateRangeException (WrongCoordinateRangeException e) {
        ErrorMessage errorMessage = new ErrorMessage(e.getMessage(), System.currentTimeMillis());
        return new ResponseEntity<>(errorMessage, HttpStatus.BAD_REQUEST);
    }
}
