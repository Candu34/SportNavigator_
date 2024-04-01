package com.example.sportnavigator.Utils.ExceptionHandler;

import com.example.sportnavigator.Utils.ErrorMessage.ErrorMessage;
import com.example.sportnavigator.Utils.Excetions.EventNotFoundException;
import com.example.sportnavigator.Utils.Excetions.UnexpectedDateTimeException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class EventExceptionHandler {

    @ExceptionHandler(value = EventNotFoundException.class)
    protected ResponseEntity<ErrorMessage> handleEventNotFoundException (EventNotFoundException e) {
        ErrorMessage errorMessage = new ErrorMessage(e.getMessage(), System.currentTimeMillis());
        return new ResponseEntity<>(errorMessage, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = UnexpectedDateTimeException.class)
    protected ResponseEntity<ErrorMessage> handleUnexpectedDateTimeException (UnexpectedDateTimeException e) {
        ErrorMessage errorMessage = new ErrorMessage(e.getMessage(), System.currentTimeMillis());
        return new ResponseEntity<>(errorMessage, HttpStatus.BAD_REQUEST);
    }


}
