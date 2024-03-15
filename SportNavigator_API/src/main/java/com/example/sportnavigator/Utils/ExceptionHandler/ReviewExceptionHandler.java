package com.example.sportnavigator.Utils.ExceptionHandler;

import com.example.sportnavigator.Utils.ErrorMessage.ErrorMessage;
import com.example.sportnavigator.Utils.Excetions.ReviewNotCreatedException;
import com.example.sportnavigator.Utils.Excetions.ReviewNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class ReviewExceptionHandler {

    @ExceptionHandler(value = ReviewNotCreatedException.class)
    public ResponseEntity<ErrorMessage> handleReviewNotCreatedException(ReviewNotCreatedException e){
        ErrorMessage errorMessage = new ErrorMessage(e.getMessage(), System.currentTimeMillis());
        return new ResponseEntity<>(errorMessage, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = ReviewNotFoundException.class)
    public ResponseEntity<ErrorMessage> handleReviewNotFoundException (ReviewNotFoundException e){
        ErrorMessage errorMessage = new ErrorMessage(e.getMessage(), System.currentTimeMillis());
        return new ResponseEntity<>(errorMessage, HttpStatus.BAD_REQUEST);
    }
}
