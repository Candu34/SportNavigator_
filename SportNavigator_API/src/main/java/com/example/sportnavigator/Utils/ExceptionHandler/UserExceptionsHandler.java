package com.example.sportnavigator.Utils.ExceptionHandler;


import com.example.sportnavigator.Utils.ErrorMessage.ErrorMessage;
import com.example.sportnavigator.Utils.Excetions.UserExistingEmailException;
import com.example.sportnavigator.Utils.Excetions.UserNotFoundException;
import com.example.sportnavigator.Utils.Excetions.UserNotUpdatedException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class UserExceptionsHandler {

@ExceptionHandler(value = UserNotFoundException.class)
public ResponseEntity<ErrorMessage> handleUserNotFoundException (UserNotFoundException e) {
    ErrorMessage errorMessage =new ErrorMessage(e.getMessage(), System.currentTimeMillis());
    return new ResponseEntity<>(errorMessage, HttpStatus.BAD_REQUEST);
}

@ExceptionHandler(value = UserExistingEmailException.class)
public ResponseEntity<ErrorMessage> handleUserExistingEmailException (UserExistingEmailException e) {
    ErrorMessage errorMessage = new ErrorMessage(e.getMessage(), System.currentTimeMillis());
    return new ResponseEntity<>(errorMessage, HttpStatus.BAD_REQUEST);
}

@ExceptionHandler(value = UserNotUpdatedException.class)
public ResponseEntity<ErrorMessage> handleUserNotUpdatedException(UserNotUpdatedException e){
    ErrorMessage errorMessage = new ErrorMessage(e.getMessage(), System.currentTimeMillis());
    return new ResponseEntity<>(errorMessage, HttpStatus.BAD_REQUEST);
}

}
