package com.example.sportnavigator.Utils.Excetions;

public class UserExistingEmailException extends RuntimeException{
    public UserExistingEmailException (String msg) {
        super(msg);
    }
}
